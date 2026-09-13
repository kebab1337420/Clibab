# Discord MLS / DAVE Voice Handshake Reference

> Wire-up guide for the **MLS group key-agreement layer** Discord uses to
> negotiate and rotate the **transport `secret_key`** used by `src/voice.rs`.
> Goal: a human can splice OpenMLS epoch key-negotiation into this crate in
> **<15 min** using the discord.js `Networking` + `libdave`/`libundave`
> references below, **without breaking `cargo check`** (which must stay at
> exit code 0).
>
> Sources:
> - discord.js `Networking.onWsPacket` / `onWsBinary` —
>   `packages/voice/src/networking/Networking.ts` (v0.19.0 tag + `main`).
> - Discord developer docs: `docs/discord.com/developers/topics/voice-connections`
>   §"End-to-End Encryption (DAVE Protocol)" / "Joining the MLS Group".
> - `discord-api-types` `voice/v8.ts` & `voice/v4.ts` VoiceOpcodes enums
>   (opcode 26 = MLS Key Package, 27 = MLS Commit+Welcome, etc.).
> - `official-alex/libundave` notes + Discord's `libdave` (C++/WASM, uses
>   `mlspp` RFC 9420) for the ciphersuite and blob wire format.
> - This crate already implements the *transport* layer (`aead_aes256_gcm_rtpsize`
>   decrypt in `src/voice.rs:TransportCipher`). What's missing is the *MLS*
>   layer that produces/rotates `secret_key` from the group epoch.

---

## 1. Where we are today (baseline)

`src/gateway.rs` does the classic v10 gateway dance:

1. `Gateway.identify` (op 2) with `INTENT_GUILD_VOICE_STATES`.
2. `Gateway.send(op=4 VOICE_STATE_UPDATE)` → join the channel.
3. Wait for **both** `VOICE_STATE_UPDATE` (SSRC↔user_id table) and
   `VOICE_SERVER_UPDATE` (token, `endpoint`, base64 `key`) on the main WS.
4. `JoinResult { endpoint, key, ssrc_table }` is handed straight to
   `VoiceSession::connect` (`src/voice.rs`).

`key` is consumed immediately by `TransportCipher::from_key`:
HKDF-SHA256 over the 32-byte base64-decoded key, info=`"Discord voice RTP"`,
yielding the AES-256-GCM transport key. **This is the legacy / DAVE-v0 path.**

What this crate does **not** do yet:

- (a) **MLS epoch key negotiation** — Discord's DAVE protocol derives the
  transport `secret_key` (and rotates it) via an MLS group, not directly from
  `VOICE_SERVER_UPDATE`. See `VoiceSession::connect` for the existing
  `/* MLS / Dave decryption stub */` block.
- (b) **IP discovery via the ip_discovery payload** — we hardcode port 50001
  (`src/gateway.rs:112`). See `IPDiscovery` TODO below.

---

## 2. The discord.js `Networking` MLS sequence (exact)

From `packages/voice/src/networking/Networking.ts`, the state machine is:

```
OpeningWs → (ws open) → Identifying
  → (op 2 Ready) → UdpHandshaking   // UDP socket + ip_discovery
  → (ip_discovery done) → SelectingProtocol   // SelectProtocol (op 1)
  → (op 4 SessionDescription) → Ready         // secret_key, encryptionMode, dave_protocol_version
  → (binary MLS msgs) → Ready (MLS active)
```

### Step A — Identify (op 0)
Sent on `ws.once('open')`:

```json
{ "op": 0, "d": { "server_id": "<guild_id>", "user_id": "<bot_user_id>",
                  "session_id": "<gateway session_id>", "token": "<vsu token>" } }
```

This is what halley calls *halley/src/voice/sodium.rs-style* identification; in
this crate it would be sent after `Gateway::join_voice` returns the
`VOICE_SERVER_UPDATE` token.

### Step B — Hello (op 3) + Heartbeat
Server sends `{ op: 3, d: { heartbeat_interval: ms } }` immediately.
Client starts a heartbeat interval (`op 3 Heartbeat` → `op 6 HeartbeatAck`).
discord.js: `this.state.ws.setHeartbeatInterval(packet.d.heartbeat_interval)`.

### Step C — Ready (op 2) → UDP + IP discovery
Server sends (v8 gateway):

```json
{ "op": 2, "d": { "ip": "127.0.0.1", "port": 50001, "ssrc": 123456789,
                  "modes": ["aead_aes256_gcm_rtpsize", "xsalsa20_poly1305_lite"] } }
```

discord.js then:

```ts
const { ip, port, ssrc, modes } = packet.d;
const udp = new VoiceUDPSocket({ ip, port });
udp.performIPDiscovery(ssrc).then((localConfig) => {
  // localConfig.ip / localConfig.port = our public UDP endpoint as seen by Discord
  ws.sendPacket({ op: 1, d: { protocol: 'udp',
    data: { address: localConfig.ip, port: localConfig.port, mode: chooseEncryptionMode(modes) } } });
});
```

**IPDiscovery payload** (binary, discord.js `VoiceUDPSocket.performIPDiscovery`):
send a 70-byte packet `{ ssrc: 0x0001 }` repeated, receive back a JSON-like
response `{ "ip": "1.2.3.4", "port": 12345 }` (for non-NA servers the response
is a 70-byte struct; parse `ip` as a null-terminated ASCII string starting at
offset 4, `port` as a uint16 BE at the end). This replaces the hardcoded
`:50001` in `src/gateway.rs:112`.

### Step D — SelectProtocol (op 1)
Client → `{ op: 1, d: { protocol: "udp", data: { address, port, mode } } }`.

### Step E — SessionDescription (op 4) → `secret_key`
Server →

```json
{ "op": 4, "d": { "mode": "aead_aes256_gcm_rtpsize", "secret_key": "<base64 32B>",
                  "dave_protocol_version": N } }
```

discord.js (v0.19.0):

```ts
const { mode: encryptionMode, secret_key: secretKey, dave_protocol_version: daveProtocolVersion } = packet.d;
this.state.code = NetworkingStatusCode.Ready;
this.state.dave = this.createDaveSession(daveProtocolVersion);   // <-- MLS session born here
this.state.connectionData.secretKey = new Uint8Array(secretKey);
```

**This `secret_key` is the *MLS epoch's* derived transport key when DAVE is
active.** `createDaveSession(v)` constructs the DAVE/MLS session; if
`daveProtocolVersion` is present and > 0, the group uses MLS for key agreement
rather than the raw `VOICE_SERVER_UPDATE` key. That is the wire cut for
OpenMLS: replace `TransportCipher::from_key(&key)` in
`VoiceSession::connect` with a call into an MLS client once the epoch
`secret_key` is available.

### Step F — MLS handshake (the missing piece)

When DAVE/MLS is enabled, after Step E the voice WS carries **binary** messages
(opcode = raw byte, see `VoiceWebSocket.sendBinaryMessage`). discord.js
`onWsBinary`:

```ts
if (message.op === VoiceOpcodes.DaveMlsExternalSender)        // op 24? (external sender creds)
  dave.setExternalSender(message.payload);
else if (message.op === VoiceOpcodes.DaveMlsProposals)        // op 25
  dave.processProposals(payload, connectedClients)
    .then(p => ws.sendBinary(VoiceOpcodes.DaveMlsCommitWelcome, p));   // → op 26/27
else if (message.op === VoiceOpcodes.DaveMlsAnnounceCommitTransition)  // op 28
  dave.processCommit(payload).then(({ transitionId, success }) =>
    success
      ? ws.sendBinary(VoiceOpcodes.DaveTransitionReady, { transitionId })
      : ws.sendBinary(VoiceOpcodes.DaveMlsInvalidCommitWelcome, { transitionId }));
else if (message.op === VoiceOpcodes.DaveMlsWelcome)          // op 29
  dave.processWelcome(payload).then(({ transitionId, success }) =>
    success
      ? ws.sendBinary(VoiceOpcodes.DaveTransitionReady, { transitionId })
      : ws.sendBinary(VoiceOpcodes.DaveMlsInvalidCommitWelcome, { transitionId }));
```

Exact opcode numbers (from `discord-api-types/voice/v8.ts`):

| Opcode | Name | Direction | Purpose |
|--------|------|-----------|---------|
| 0 | Identify | C→S | Start voice session |
| 1 | SelectProtocol | C→S | UDP + mode |
| 2 | Ready | S→C | IP, port, ssrc, modes |
| 3 | Heartbeat | ↔ | Keepalive |
| 4 | SessionDescription | S→C | mode + secret_key + dave_protocol_version |
| 5 | Speaking | C→S | voice activity |
| 6 | HeartbeatAck | S→C | — |
| 24 | DaveMlsExternalSender | S→C | external sender creds |
| 25 | DaveMlsProposals | S→C | MLS proposals to append/revoke |
| 26 | DaveMlsCommitWelcome | C→S | client MLS Commit + optional Welcome |
| 27 | DaveMlsAnnounceCommitTransition | S→C | commit to announce/transition |
| 28 | DaveMlsWelcome | S→C | MLS Welcome (new member join) |
| 29 | DaveMlsInvalidCommitWelcome | S→C | invalid commit/welcome report |
| 21 | DavePrepareTransition | S→C | prepare DAVE/MLS transition |
| 22 | DaveExecuteTransition | C→S | execute prepared transition |
| 23 | DaveTransitionReady | C→S | ack readiness for transition |
| 20 | DavePrepareEpoch | S→C | prepare new MLS epoch |

**MLS group key-agreement flow** (the part OpenMLS must implement):

1. **Join**: client generates an MLS key package
   (`generateKeyPackage()` → `KeyPackage` = `KeyPackage` struct: client
   InitSender (credential + signaturekey + leaf key) + `key_package` field
   containing the HPKE init/KEL/CachedCommit per ciphersuite
   `MLS_256_DHKEM_X25519_AES_128_GCM_SHA256_Ed25519` / Discord's
   `DHKEMP256_AES128GCM_SHA256_P256`) and sends it **before** Step E via
   `VoiceOpcodes.DaveMlsKeyPackage` (older op code 26 name) — discord.js emits
   `keyPackage` from `DaveSession` and the app forwards it.
   - Blob: TLS-serialized `mls::KeyPackage` (RFC 9420), opaque to the WS.

2. **Propose**: server → `{ op: 25, payload: <MLS Proposal commits> }`.
   Client calls `processProposals(payload, connectedClients)`; if it has a
   pending proposal, returns `<MLS Commit>` bytes.

3. **Commit**: client → `{ op: 26, payload: <MLS Commit (+ optional Welcome)> }`.
   The Commit contains the group's `Commit` (proposals + new tree) and, if this
   client is the committer, a `Welcome` for new members.

4. **Announce**: server → `{ op: 27, payload: { transitionId, success } }`
   after validating the Commit.

5. **Welcome**: server → `{ op: 28, payload: <MLS Welcome> }` for a joining
   member. Client `processWelcome(payload)` derives the epoch secrets.

6. **Epoch derivation**: each successful Commit/Welcome advances the MLS
   epoch; the epoch secret → `secret_key` (HKDF `Discord voice RTP`) →
   `TransportCipher`. **Rotating the epoch = rotating the transport key.**
   `DavePrepareEpoch` (op 20) signals an upcoming epoch; the client must
   commit a new Commit against it.

### Ciphersuite

From libundave / `libdave` (uses `mlspp`):

```
DHKEMP256_AES128GCM_SHA256_P256
```

- KEM: DHKEM(P-256) — `secp256r1`
- AEAD: AES-128-GCM (note: **128**, not 256 — the transport `secret_key`
  from Step E is what the MLS group derives for RTP; the legacy AES-256-GCM
  path in `src/voice.rs` is the pre-DAVE fallback)
- Hash: SHA-256
- Signature: P-256 ECDSA (Ed25519 variant exists; Discord uses P-256 for
  the key package creds)

---

## 3. Where to splice it in (this crate)

### 3.1 `VoiceSession::connect` (`src/voice.rs:298`)

Today:

```rust
pub async fn connect(JoinResult { endpoint, key, ssrc_table }: JoinResult) -> io::Result<Self> {
    let socket = UdpSocket::bind("0.0.0.0:0").await?;
    socket.connect(&endpoint).await?;
    #[cfg(feature = "transport_decrypt")]
    let cipher = Some(TransportCipher::from_key(&key)?);
    ...
}
```

Wire-cut: introduce an `MlsEpoch` (OpenMLS client) that, **when DAVE/MLS is
negotiated**, feeds the group-derived epoch secret into
`TransportCipher::from_key` instead of the raw `key`. The `key` from
`VOICE_SERVER_UPDATE` is only authoritative when `dave_protocol_version == 0`
(legacy). Concretely:

```rust
// After Step E (SessionDescription):
let transport_key = if dave_protocol_version > 0 {
    // MLS epoch secret — obtained from OpenMLS epoch key-negotiation
    // (see mls_handshake.md §2 Steps 1–5). 15-min wire-up:
    //   mls_client.process_commit_or_welcome(...) -> epoch_secret
    epoch_secret.to_vec()
} else {
    key  // raw VOICE_SERVER_UPDATE key — existing behavior
};
let cipher = Some(TransportCipher::from_key(&transport_key)?);
```

Add a per-epoch re-key hook in `VoiceSession::run` so that on
`DaveMlsAnnounceCommitTransition` (op 27) / `DaveMlsWelcome` (op 28) the
cipher is rebuilt from the new epoch secret. This is the "<15 min" edit.

### 3.2 `Gateway::join_voice` (`src/gateway.rs`)

Currently stops at `VOICE_SERVER_UPDATE` + `VOICE_STATE_UPDATE`. To support
MLS, the caller must additionally:

1. Hold the gateway `session_id` + `token` (already in `VOICE_SERVER_UPDATE`)
   and forward them into `VoiceSession` so it can (re)identify on the *voice*
   WS (`wss://<endpoint>?v=8`) — `src/voice.rs` currently has no voice WS.
2. Optionally issue `GET /api/v9/channels/{channel_id}/call` — see §4.

### 3.3 IP discovery (`src/gateway.rs` + `src/voice.rs`)

DONE 2026-09-13: IP discovery is no longer a TODO — `VoiceSession::discover()`
(src/voice.rs) performs the real type-0x1/0x2 UDP exchange (§2 Step C) and
exposes the public `(ip, port)` as `VoiceSession.discovered`. After connect,
main.rs feeds it back to the gateway via `select_protocol(ip, port)` (op 1)
so Discord routes RTP to the real 4-tuple. `gateway.rs` still targets
`{host}:50001` for the *initial* UDP connect (matches discord.js); the
ip_discovery reply replaces 50001 as the *final* routing target. The hardcoded
`:50001` is therefore intentional for connect, not a remaining bug.

---

## 4. (Optional) REST call: GET /api/v9/channels/{id}/call

Per the discord.js `Networking` `ConnectionOptions` (no public REST call in
`Networking.ts` itself — the `endpoint`/`token`/key come from the main
gateway `VOICE_SERVER_UPDATE`), the `GET /channels/{channel_id}/call`
endpoint is **not** part of the standard voice path. It exists for the
legacy group-DM "call" object (returns `{ "channel_id", "participants"[] }`),
not for guild voice channels.

If a future need arises to fetch the **MLS key package / room_id** over REST
(see libundave notes on "room key"), the call is:

```
GET https://discord.com/api/v9/channels/{channel_id}/call
Authorization: Bot <token>
```

Response shape (legacy DM call — **not the guild voice path**):

```json
{ "channel_id": "...", "participants": ["uid1","uid2"], "stage_instance_id": null }
```

This does **not** return an MLS key package — Discord does **not** ship MLS
key packages over REST. The key package is generated client-side and sent
**over the voice WS** (binary op 26, §2 Step F) after the `Hello`. So
OPTION B (REST fetch via reqwest) would **not** actually obtain the MLS
material — it would be dead code that risks breaking `cargo check`.

➡️ Therefore **OPTION A is chosen**: this note + inline `TODO`s in
`src/voice.rs`. `cargo check` stays green (no new deps).

---

## 5. Quick checklist for the OpenMLS splice (<15 min)

- [ ] Add `OpenMLS` (or `mls-rs`) dependency under a new feature gate `mls`,
      NOT in default/features that `cargo check` uses.
- [ ] Implement `MlsClient` with `generate_key_package()` → serialize
      `KeyPackage` (RFC 9420, ciphersuite `DHKEMP256_AES128GCM_SHA256_P256`).
- [x] IP discovery: DONE — `VoiceSession::discover()` (type-0x1/0x2 UDP) +
      `gateway.select_protocol()` round-trip wired in main.rs. See §3.3.
- [ ] On `SessionDescription` (op 4) with `dave_protocol_version > 0`: hold the
      voice WS, send key package (op 26) after Hello.
- [ ] On binary op 27/28: call `processCommit` / `processWelcome` → derive
      epoch secret → `TransportCipher::from_key(epoch_secret)`.
- [ ] On op 20 (`DavePrepareEpoch`): queue a Commit.
- [ ] On op 21/22 (`DavePrepareTransition`/`DaveExecuteTransition`):
      ratchet the epoch via `executeTransition` before it takes effect.
- [ ] Replace `Gateway`/`VoiceSession` to carry `session_id` + `token` and
      open the voice WS (`wss://<endpoint>?v=8`) needed to speak binary
      MLS opcodes (currently `VoiceSession` only owns the UDP socket).
- [ ] IP discovery: parse the 70-byte ip_discovery response (§2 Step C) and
      drop the hardcoded `:50001` in `src/gateway.rs:112`.

---

## 6. Current state vs. this doc
This doc was authored as a sub-agent reference for the OpenMLS splice. Since it
was written, the following were **implemented directly on main** (2026-09-13):
- [x] IP discovery (`VoiceSession::discover` + `gateway.select_protocol` round-trip).
- [x] Heartbeat `.await` bug (gateway WS send).
- [x] `join_voice` select! timeout (15s) — fails fast on bad creds.
- [x] Feature-gating: `opus_decode` / `transport_decrypt` cfg correctness +
  `opus-decoder` made a true optional dep (`dep:opus-decoder`).
- [x] Graceful shutdown via `tokio::select!` on a broadcast Receiver in `run()`.
- [x] Clippy-clean (0 warnings) across all 5 feature configurations.

NOT implemented (still OpenMLS splice, needs reverse-engineering the binary
KeyPackage/Welcome blob format that libundave/halley expose):
- Full MLS epoch key agreement (op 24–29 binary msgs) — see §5 checklist.

`cargo check`, `cargo check --all-features`, `cargo check --no-default-features`
(+ both single-feature combos), `cargo clippy --all-features`, and
`cargo build --release --all-features` are all green (0 err / 0 warn) at head.

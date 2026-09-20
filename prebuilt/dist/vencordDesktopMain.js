// Vencord 59a5428
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var ln=Object.defineProperty;var Do=Object.getOwnPropertyDescriptor;var Oo=Object.getOwnPropertyNames;var Lo=Object.prototype.hasOwnProperty;var At=(t,e,n)=>()=>{if(n)throw n[0];try{return t&&(e=t(t=0)),e}catch(r){throw n=[r],r}};var fe=(t,e)=>{for(var n in e)ln(t,n,{get:e[n],enumerable:!0})},Vo=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Oo(e))!Lo.call(t,i)&&i!==n&&ln(t,i,{get:()=>e[i],enumerable:!(r=Do(e,i))||r.enumerable});return t};var Fo=t=>Vo(ln({},"__esModule",{value:!0}),t);var u=At(()=>{"use strict"});var Me=At(()=>{"use strict";u()});function Je(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var vr=At(()=>{"use strict";u()});var zo={};function Re(...t){let e={cwd:Sr};return un?cn("flatpak-spawn",["--host","git",...t],e):cn("git",t,e)}async function No(){return(await Re("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function $o(){await Re("fetch");let t=(await Re("branch","--show-current")).stdout.trim();if(!((await Re("ls-remote","origin",t)).stdout.length>0))return[];let r=(await Re("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function Uo(){return(await Re("pull")).stdout.includes("Fast-forward")}async function Go(){return!(await cn(un?"flatpak-spawn":"node",un?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:Sr})).stderr.includes("Build failed")}var yr,Xe,wr,br,Sr,cn,un,xr=At(()=>{"use strict";u();Me();yr=require("child_process"),Xe=require("electron"),wr=require("path"),br=require("util");vr();Sr=(0,wr.join)(__dirname,".."),cn=(0,br.promisify)(yr.execFile),un=!1;Xe.ipcMain.handle("VencordGetRepo",Je(No));Xe.ipcMain.handle("VencordGetUpdates",Je($o));Xe.ipcMain.handle("VencordUpdate",Je(Uo));Xe.ipcMain.handle("VencordBuild",Je(Go))});u();u();u();xr();u();Me();var jn=require("electron");u();var hn={};fe(hn,{fetchTrackData:()=>Bo});u();u();u();var Er="59a5428";u();var dn="Vendicated/Vencord";var Tr=`Vencord/${Er}${dn?` (https://github.com/${dn})`:""}`;var kr=require("child_process"),Ir=require("util"),Pr=(0,Ir.promisify)(kr.execFile);async function pn(t){let{stdout:e}=await Pr("osascript",t.map(n=>["-e",n]).flat());return e}var B=null;async function Wo({id:t,name:e,artist:n,album:r}){if(t===B?.id){if("data"in B)return B.data;if("failures"in B&&B.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":Tr}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return B={id:t,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},B.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),B={id:t,failures:(t===B?.id&&"failures"in B?B.failures:0)+1},null}}async function Bo(){try{await Pr("pgrep",["^Music$"])}catch{return null}if(await pn(['tell application "Music"',"get player state","end tell"]).then(f=>f.trim())!=="playing")return null;let e=await pn(['tell application "Music"',"get player position","end tell"]).then(f=>Number.parseFloat(f.trim())),n=await pn(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(f=>!!f),l=Number.parseFloat(s),h=await Wo({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:e,duration:l,...h}}var fn={};fe(fn,{initDevtoolsOpenEagerLoad:()=>Ho});u();function Ho(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var Or={};u();u();Me();u();var mn=Symbol("SettingsStore.isProxy"),Ar=Symbol("SettingsStore.getRawTarget"),Qe=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===mn)return!0;if(r===Ar)return n;let o=Reflect.get(n,r,i),a=e.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[mn]){let h=`${l}${l&&"."}${r}`;return e.makeProxy(o,s,h)}return o},set(n,r,i){if(i?.[mn]&&(i=i[Ar]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return e.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return e.notifyListeners(s,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyPrefixListeners(e,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,e))}}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,h)=>l[h],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n)),this.notifyPrefixListeners(e,i,n)}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}addPrefixChangeListener(e,n){let r=this.prefixListeners.get(e)??new Set;r.add(n),this.prefixListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}removePrefixChangeListener(e,n){let r=this.prefixListeners.get(e);r&&(r.delete(n),r.size||this.prefixListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}};u();function gn(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},gn(t[n],r)):t[n]??=r}return t}var wn=require("electron"),ge=require("fs");u();var Cr=require("electron"),ie=require("path"),Mt=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,ie.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,ie.join)(Cr.app.getPath("userData"),"..","Vencord")),me=(0,ie.join)(Mt,"settings"),oe=(0,ie.join)(Mt,"themes"),_e=(0,ie.join)(me,"quickCss.css"),vn=(0,ie.join)(me,"settings.json"),yn=(0,ie.join)(me,"native-settings.json"),Mr=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"];(0,ge.mkdirSync)(me,{recursive:!0});function Rr(t,e){try{return JSON.parse((0,ge.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var D=new Qe(Rr("renderer",vn));D.addGlobalChangeListener(()=>{try{(0,ge.writeFileSync)(vn,JSON.stringify(D.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});wn.ipcMain.on("VencordGetSettings",t=>t.returnValue=D.plain);wn.ipcMain.handle("VencordSetSettings",(t,e,n)=>{D.setData(e,n)});var jo={plugins:{},customCspRules:{}},_r=Rr("native",yn);gn(_r,jo);var Z=new Qe(_r);Z.addGlobalChangeListener(()=>{try{(0,ge.writeFileSync)(yn,JSON.stringify(Z.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}});var _t=require("electron"),Rt=[];function Dr(){let t=[];for(let e=Rt.length-1;e>=0;e--){let{processId:n,routingId:r}=Rt[e],i=_t.webFrameMain.fromId(n,r);if(!i){Rt.splice(e,1);continue}t.push(i)}return t}_t.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){Dr();let{routingId:i,processId:o}=r;Rt.push({routingId:i,processId:o});let a=D.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});D.addChangeListener("plugins.FixSpotifyEmbeds.volume",t=>{try{Dr().forEach(e=>e.executeJavaScript(`globalThis._vcVolume = ${t/100}`))}catch(e){console.error("FixSpotifyEmbeds: Failed to update volume",e)}});var Vr={};u();var Lr=require("electron");Lr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!D.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var bn={};fe(bn,{resolveRedirect:()=>Zo});u();var Fr=require("https"),Ko=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function Nr(t){return new Promise((e,n)=>{let r=(0,Fr.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?Nr(i.headers.location):t)});r.on("error",n),r.end()})}async function Zo(t,e){return Ko.test(e)?Nr(e):e}var Sn={};fe(Sn,{makeDeeplTranslateRequest:()=>qo,makeKagiTranslateRequest:()=>Yo});u();async function qo(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function Yo(t,e,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${e}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var xn={};fe(xn,{readRecording:()=>Jo});u();var $r=require("electron"),Dt=require("fs/promises"),et=require("path");async function Jo(t,e){e=(0,et.normalize)(e);let n=(0,et.basename)(e),r=(0,et.normalize)($r.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!e.startsWith(r))return null;try{let i=await(0,Dt.readFile)(e);return(0,Dt.rm)(e).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var En={};fe(En,{closeSocket:()=>Qo,sendToOverlay:()=>Xo});u();var Ur=require("dgram"),Ot=null;function Xo(t,e){e.messageType=e.type;let n=JSON.stringify(e);Ot??=(0,Ur.createSocket)("udp4"),Ot.send(n,42069,"127.0.0.1")}function Qo(){Ot?.close(),Ot=null}var zr={};u();var Gr=require("electron");u();var Tn=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;Gr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{D.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(Tn):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(Tn))})})});var Hn={};fe(Hn,{answerOverlayAction:()=>pl,armDisplayMedia:()=>Fs,checkUpdate:()=>ml,closeStudioOverlay:()=>ll,deleteClip:()=>ms,disarmDisplayMedia:()=>Ns,downloadUpdate:()=>vl,dropOverlayWaiters:()=>dl,emptyTrash:()=>cs,focusClient:()=>hl,gameFeedStatus:()=>Bs,getActiveScreen:()=>Vs,getCaptureSources:()=>Os,getClipDirectory:()=>Ms,getMemoryReport:()=>Ls,getPlatformInfo:()=>Ds,hideClipOverlay:()=>rl,hideVrPanel:()=>Js,listClips:()=>Qa,listTrash:()=>ls,notifyClipSaved:()=>nl,openClipDirectory:()=>_s,openStudioOverlay:()=>sl,openVrBindings:()=>qs,pickAudioFiles:()=>xs,pickClipDirectory:()=>Rs,pickImageFiles:()=>ks,pickVideoFiles:()=>ws,readAudioFile:()=>Ts,readClip:()=>es,readImageFile:()=>As,readLibrary:()=>vs,readVideoFile:()=>Ss,readVoiceTrack:()=>Ja,registerShortcuts:()=>Us,relaunchClient:()=>yl,releaseClipPath:()=>Ka,renameClip:()=>gs,reserveClipPath:()=>ja,restoreClip:()=>ss,revealClip:()=>Cs,saveClip:()=>Ha,saveVoiceTrack:()=>Ya,shareClip:()=>rs,showClipOverlay:()=>tl,showVrPanel:()=>Ys,spillClear:()=>fs,spillDrop:()=>hs,spillRead:()=>ps,spillWrite:()=>ds,startGameFeeds:()=>zs,startVrBridge:()=>js,stopGameFeeds:()=>Ws,stopVrBridge:()=>Ks,studioOverlayUp:()=>cl,trashClip:()=>as,unregisterShortcuts:()=>Wn,vrBridgeStatus:()=>Zs,waitForGameEvent:()=>Hs,waitForOverlayAction:()=>ul,waitForShortcut:()=>Gs,waitForVrEvent:()=>Xs,writeLibrary:()=>ys});u();var Mi=require("crypto"),y=require("electron"),c=require("fs"),qt=require("https"),Zt=require("os"),p=require("path");u();var H=require("fs"),Hr=require("http"),jr=require("https"),Kr=require("os"),at=require("path"),Wr=34765,ea=6,Zr=256*1024,ta=2e3,na=1500,ra="127.0.0.1",ia=2999,oa="gamestate_integration_clipper.cfg",ae=null,Oe=0,Vt="",Le=null,it=[],aa=12,ot=[],Ve=[],Fe={cs2:!1,league:!1};function Ft(t){it.length>=aa||it.includes(t)||it.push(t)}var Nt=Promise.resolve();function tt(t){let e=Ve.shift();if(e){e(t);return}ot.push(t),ot.length>16&&ot.shift()}var E={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function qr(){E={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function sa(t){return t>=5?"an ace in Counter-Strike 2":t===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function la(t){let e=t.provider?.steamid,{player:n}=t;if(!n||!e||!n.steamid||n.steamid!==e)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof t.map?.round=="number"?t.map.round:E.round;(r.kills<E.kills||r.deaths<E.deaths)&&qr();let o=E.kills<0;i!==E.round&&(E.round=i,E.roundKills=0,E.announced=0);let a=r.kills-Math.max(0,E.kills),s=r.deaths-Math.max(0,E.deaths);if(E.kills=r.kills,E.deaths=r.deaths,o)return;a>0&&(E.roundKills+=a,E.roundKills>=3&&E.roundKills>E.announced?(E.announced=E.roundKills,tt({kind:"multikill",note:sa(E.roundKills)})):tt({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&tt({kind:"death",note:"your death in Counter-Strike 2"});let l=t.round?.win_team;l&&n.team&&l===n.team&&t.round?.phase==="over"&&E.roundKills>0&&tt({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function ca(){return new Promise(t=>{let e=0,n=(0,Hr.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>Zr&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{la(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++e<ea){n.listen(Wr+e,"127.0.0.1");return}Ft(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}ae===n&&(ae=null,Oe=0,Fe={...Fe,cs2:!1}),t(0)}),n.on("listening",()=>{ae=n,t(n.address().port)}),n.listen(Wr,"127.0.0.1")})}function ua(){let t=[],e=(0,Kr.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&t.push((0,at.join)(i,"Steam"))}let n=[];for(let r of t)if((0,H.existsSync)(r)){n.push(r);try{let i=(0,H.readFileSync)((0,at.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function da(){for(let t of ua()){let e=(0,at.join)(t,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,H.existsSync)(e))return e}return""}function pa(t){let e=da();if(!e)return Ft("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,at.join)(e,oa),r=`"Clipper"
{
    "uri"       "http://127.0.0.1:${t}/"
    "timeout"   "5.0"
    "buffer"    "0.1"
    "throttle"  "0.5"
    "heartbeat" "60.0"
    "auth"      { }
    "data"
    {
        "provider"           "1"
        "player_id"          "1"
        "player_state"       "1"
        "player_match_stats" "1"
        "map"                "1"
        "round"              "1"
    }
}
`;try{return(0,H.mkdirSync)(e,{recursive:!0}),(0,H.writeFileSync)(n,r,"utf8"),n}catch(i){return Ft(`Counter-Strike 2's config could not be written (${i.message})`),""}}function ha(){let t=Vt;if(Vt="",!!t)try{(0,H.unlinkSync)(t)}catch{}}var nt="",De=-1,kn=!1,Lt=!1;function rt(t){return t.split("#")[0].trim().toLowerCase()}function Br(t){return new Promise(e=>{let n=(0,jr.get)({host:ra,port:ia,path:t,rejectUnauthorized:!1,timeout:na},r=>{if(r.statusCode!==200){r.resume(),e(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>Zr&&n.destroy()}),r.on("end",()=>{try{e(JSON.parse(i))}catch{e(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>e(null))})}function fa(t,e){let n=t.EventName??"",r=rt(t.KillerName??"");switch(n){case"ChampionKill":return r===e?{kind:"kill",note:"a kill in League of Legends"}:rt(t.VictimName??"")===e?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==e?null:{kind:"multikill",note:`a ${t.KillStreak??3}-kill run in League of Legends`};case"Ace":return rt(t.Acer??"")!==e?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return rt(t.Recipient??"")!==e?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==e?null:{kind:"objective",note:`${t.DragonType?`the ${t.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==e?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==e?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==e?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function ma(){if(!Lt){Lt=!0;try{if(!nt){let r=await Br("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;nt=rt(r),De=-1}let t=await Br("/liveclientdata/eventdata");if(!t?.Events){nt="";return}let e=De<0,n=De;for(let r of t.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=De||(n=Math.max(n,i),e))continue;let o=fa(r,nt);o&&tt(o)}De=n}finally{Lt=!1}}}function ga(){nt="",De=-1,Lt=!1,Le=setInterval(()=>{ma().catch(t=>{kn||(kn=!0,Ft(`League of Legends could not be read (${t.message})`))})},ta)}function va(t){return t.cs2!==Fe.cs2||t.league!==Fe.league?!1:(!t.cs2||ae!==null)&&(!t.league||Le!==null)}function Yr(t){let e=Nt.then(async()=>(va(t)||(Jr(),it=[],t.cs2&&(qr(),Oe=await ca(),Oe&&(Vt=pa(Oe))),t.league&&ga(),Fe={cs2:t.cs2&&ae!==null,league:t.league}),$t()));return Nt=e.catch(()=>{}),e}function Jr(){if(Fe={cs2:!1,league:!1},Le&&clearInterval(Le),Le=null,kn=!1,ae)try{ae.close()}catch{}ae=null,Oe=0,ha(),ot=[];let t=Ve;Ve=[];for(let e of t)e(null)}function In(){let t=Nt.then(()=>Jr());return Nt=t.catch(()=>{}),t}function $t(){return{port:Oe,configPath:Vt,league:Le!==null,problems:[...it]}}function Xr(t){let e=ot.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{Ve=Ve.filter(a=>a!==i),i(null)},t);Ve.push(i)})}u();var se=require("electron"),zt=require("fs"),lt=require("path"),Qr=require("url"),Ut=24,ei=2600,Gt=220,ya=300,wa=56,Pn=!0;function Wt(){return Pn}var we=null,ve=null,st=null,ye=null;function ba(){return!!we&&!we.isDestroyed()}function be(){ve&&(clearTimeout(ve),ve=null);let t=we;we=null,t&&!t.isDestroyed()&&t.destroy()}function Ne(){ye&&(clearTimeout(ye),ye=null);let t=st;st=null,t&&!t.isDestroyed()&&t.destroy()}function Sa(t,e,n){let i=se.screen.getDisplayNearestPoint(se.screen.getCursorScreenPoint()).workArea,o=t==="top-left"||t==="bottom-left",a=t==="top-left"||t==="top-right";return{x:Math.round(o?i.x+Ut:i.x+i.width-e-Ut),y:Math.round(a?i.y+Ut:i.y+i.height-n-Ut)}}function ct(t,e){let n=(0,lt.join)(se.app.getPath("userData"),"clipper-overlay");(0,zt.mkdirSync)(n,{recursive:!0});let r=(0,lt.join)(n,t);return(0,zt.writeFileSync)(r,e,"utf8"),r}function ti(t,e,n,r){let{x:i,y:o}=Sa(r,e,n),a=new se.BrowserWindow({width:e,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(t).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function ni(t){return`<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }
    .card {
        position: absolute; inset: 0; border-radius: 12px; overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 10px 34px rgba(0, 0, 0, 0.6);
        opacity: 0; transform: scale(0.96); transition: opacity ${Gt}ms ease, transform ${Gt}ms ease;
    }
    .card.up { opacity: 1; transform: none; }
    ${t}
</style>`}function q(t){return JSON.stringify(t).replace(/</g,"\\u003c")}function xa(t,e){return`<!doctype html>
<html>
<head>
${ni(`.card { background: #000; }
    video { display: block; width: 100%; height: 100%; object-fit: cover; }
    .tag {
        position: absolute; left: 0; right: 0; bottom: 0; padding: 18px 10px 7px;
        font: 600 12px/1.3 "gg sans", "Segoe UI", system-ui, sans-serif; color: #fff;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9); white-space: nowrap; overflow: hidden;
        text-overflow: ellipsis; background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    }`)}
</head>
<body>
<div class="card" id="card">
    <video id="video" playsinline></video>
    <div class="tag" id="tag"></div>
</div>
<script>
    var look = ${q(e)};
    var video = document.getElementById("video");
    var card = document.getElementById("card");
    document.getElementById("tag").textContent = ${q((0,lt.basename)(t))};

    var leaving = false;
    function leave() {
        if (leaving) return;
        leaving = true;
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Gt});
    }

    // The last seconds of the clip are the ones worth seeing: a save keeps the
    // moment that just happened, and it happened at the end of the buffer.
    video.addEventListener("loadedmetadata", function () {
        var length = isFinite(video.duration) ? video.duration : 0;
        if (look.seconds > 0 && length > look.seconds) video.currentTime = length - look.seconds;
        card.classList.add("up");
    });

    video.addEventListener("ended", leave);
    video.addEventListener("error", leave);

    video.volume = Math.max(0, Math.min(1, look.volume / 100));
    video.muted = look.volume <= 0;

    video.src = ${q((0,Qr.pathToFileURL)(t).href)};

    // Autoplay with sound is only allowed after a gesture, and this window
    // never gets one. Muted playback is always allowed, so it is the fallback
    // rather than a reason to show nothing.
    video.play().catch(function () {
        video.muted = true;
        video.play().catch(leave);
    });
</script>
</body>
</html>`}function Ea(t,e){return`<!doctype html>
<html>
<head>
${ni(`.card {
        background: rgba(20, 21, 24, 0.92); display: flex; align-items: center; gap: 10px; padding: 0 14px;
        font: 12px/1.3 "gg sans", "Segoe UI", system-ui, sans-serif; color: #fff;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 10px 34px rgba(0, 0, 0, 0.6);
    }
    .dot { width: 9px; height: 9px; border-radius: 50%; background: #da373c; flex: none; box-shadow: 0 0 0 3px rgba(218, 55, 60, 0.2); }
    .text { min-width: 0; }
    .title { font-weight: 600; font-size: 13px; }
    .note { opacity: 0.72; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }`)}
</head>
<body>
<div class="card" id="card">
    <div class="dot"></div>
    <div class="text">
        <div class="title" id="title"></div>
        <div class="note" id="note"></div>
    </div>
</div>
<script>
    var card = document.getElementById("card");
    document.getElementById("title").textContent = ${q(t)};
    document.getElementById("note").textContent = ${q(e)};

    requestAnimationFrame(function () { card.classList.add("up"); });

    setTimeout(function () {
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Gt});
    }, ${ei});
</script>
</body>
</html>`}function ri(t,e){if(!Pn)return!1;be(),Ne();let n=Math.max(200,Math.round(e.width)),r=Math.round(n*9/16),i=ti(ct("clip.html",xa(t,e)),n,r,e.corner);we=i,i.on("closed",()=>{we===i&&(we=null,ve&&(clearTimeout(ve),ve=null))});let o=(e.seconds>0?e.seconds:300)+10;return ve=setTimeout(()=>be(),o*1e3),!0}function ii(t,e,n){if(!Pn||ba())return!1;Ne();let r=ti(ct("toast.html",Ea(t,e)),ya,wa,n);return st=r,r.on("closed",()=>{st===r&&(st=null,ye&&(clearTimeout(ye),ye=null))}),ye=setTimeout(()=>Ne(),ei+4e3),!0}se.app.on("will-quit",()=>{be(),Ne()});u();var Y=require("electron"),oi=require("url");var An="VencordClipperOverlayAction",ai="VencordClipperOverlayReply",Ta=108,O=null;function Cn(){return!!O&&!O.isDestroyed()}function dt(){let t=O;O=null,t&&!t.isDestroyed()&&t.destroy()}var $e=[],ut=[];function ka(t){let e=$e.shift();if(e){e(t);return}ut.push(t),ut.length>4&&ut.shift()}function si(t){let e=ut.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{$e=$e.filter(a=>a!==i),i(null)},t);$e.push(i)})}function li(){ut=[];let t=$e;$e=[];for(let e of t)e(null)}function ci(t){!O||O.isDestroyed()||O.webContents.send(ai,t)}Y.ipcMain.removeAllListeners(An);Y.ipcMain.on(An,(t,e,n)=>{if(!O||O.isDestroyed()||t.sender!==O.webContents)return;let r=String(e??"");if(r==="close"){dt();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open"&&r!=="link")return;let i=n??{},o=Number(i.from),a=Number(i.to);ka({kind:r,clip:String(i.clip??""),from:Number.isFinite(o)?Math.max(0,o):0,to:Number.isFinite(a)?Math.max(0,a):0})});function Ia(t,e){let{workArea:n}=Y.screen.getDisplayNearestPoint(Y.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-t)/2),y:Math.round(n.y+(n.height-e)/2)}}var Pa=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${q(An)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${q(ai)}, (_event, reply) => handler(reply));
    }
});
`;function Aa(t,e){return`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; user-select: none; }
    .card {
        position: absolute; inset: 0; display: flex; flex-direction: column;
        border-radius: 12px; overflow: hidden; background: #101114;
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 14px 40px rgba(0, 0, 0, 0.7);
        font: 12px/1.35 "gg sans", "Segoe UI", system-ui, sans-serif; color: #f2f3f5;
        opacity: 0; transition: opacity 160ms ease;
    }
    .card.up { opacity: 1; }
    .screen { position: relative; flex: 1 1 auto; min-height: 0; background: #000; }
    video { display: block; width: 100%; height: 100%; object-fit: contain; }
    .name {
        position: absolute; left: 10px; top: 8px; max-width: 70%; padding: 3px 8px; border-radius: 6px;
        background: rgba(0, 0, 0, 0.55); font-size: 11px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .controls { flex: none; padding: 10px 12px 11px; display: flex; flex-direction: column; gap: 8px; }
    .track { position: relative; height: 22px; cursor: pointer; }
    .rail { position: absolute; left: 0; right: 0; top: 8px; height: 6px; border-radius: 3px; background: #2c2f36; }
    .range { position: absolute; top: 8px; height: 6px; border-radius: 3px; background: #4752c4; }
    .played { position: absolute; top: 8px; height: 6px; border-radius: 3px; background: #5865f2; }
    .mark { position: absolute; top: 3px; width: 2px; height: 16px; margin-left: -1px; border-radius: 1px; background: #f0b132; }
    .handle {
        position: absolute; top: 1px; width: 8px; height: 20px; margin-left: -4px; border-radius: 3px;
        background: #f2f3f5; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6); cursor: ew-resize;
    }
    .head { position: absolute; top: 0; width: 2px; height: 22px; margin-left: -1px; background: #fff; pointer-events: none; }
    .row { display: flex; align-items: center; gap: 6px; }
    .spacer { flex: 1 1 auto; }
    .grp { width: 1px; align-self: stretch; margin: 0 2px; background: rgba(255, 255, 255, 0.08); }
    .time { font-variant-numeric: tabular-nums; opacity: 0.75; }
    button {
        font: inherit; color: #f2f3f5; background: #2b2d31; border: 0; border-radius: 6px;
        padding: 5px 10px; cursor: pointer; transition: background-color 0.12s ease, color 0.12s ease;
    }
    button:hover { background: #3a3d44; }
    button:active:not(:disabled) { transform: scale(0.97); }
    button:disabled { opacity: 0.4; cursor: default; }
    button:focus-visible { outline: 2px solid #5865f2; outline-offset: 2px; }
    button.go { background: #5865f2; }
    button.go:hover { background: #4752c4; }
    button.danger:hover { background: #a12828; }
    #play {
        background: linear-gradient(135deg, #5865f2, #4752c4);
        font-weight: 600; box-shadow: 0 2px 10px rgba(88, 101, 242, 0.35);
    }
    #play:hover { background: linear-gradient(135deg, #4752c4, #3c45a5); }
    .status { min-height: 15px; font-size: 11px; opacity: 0.75; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .status.bad { color: #fa777c; opacity: 1; }
    /* Where the panels that come later - speed, volume, captions - mount. They
       speak the same channel, so nothing below them has to change. */
    .panels:empty { display: none; }
    @media (prefers-reduced-motion: reduce) {
        * { transition-duration: 0.01ms !important; }
    }
</style>
</head>
<body>
<div class="card" id="card">
    <div class="screen">
        <video id="video" playsinline></video>
        <div class="name" id="name"></div>
    </div>
    <div class="controls">
        <div class="track" id="track">
            <div class="rail"></div>
            <div class="range" id="range"></div>
            <div class="played" id="played"></div>
            <div id="marks"></div>
            <div class="handle" id="handleIn"></div>
            <div class="handle" id="handleOut"></div>
            <div class="head" id="head"></div>
        </div>
        <div class="panels" id="panels"></div>
        <div class="row">
            <button id="play" data-do="play">Pause</button>
            <span class="time" id="time">0:00 / 0:00</span>
            <span class="grp"></span>
            <button data-do="in" title="I">In</button>
            <button data-do="out" title="O">Out</button>
            <button data-do="all">All</button>
            <button class="go" data-do="cut">Cut</button>
            <button class="go" data-do="send">Send</button>
            <button class="go" data-do="link" title="Upload the whole clip and copy a share link">Link</button>
            <button class="danger" data-do="delete">Delete</button>
            <span class="grp"></span>
            <span class="spacer"></span>
            <button data-do="open">Studio</button>
            <button data-do="close" title="Esc">Close</button>
        </div>
        <div class="status" id="status"></div>
    </div>
</div>
<script>
    var clip = ${q({name:t.name,url:(0,oi.pathToFileURL)(t.path).href,markers:t.markers})};
    var look = ${q(e)};
    var api = window.clipper;

    var el = {};
    ["card", "video", "name", "track", "range", "played", "marks", "handleIn", "handleOut", "head", "play", "time", "status"]
        .forEach(function (id) { el[id] = document.getElementById(id); });

    el.name.textContent = clip.name;

    var length = 0;
    var inAt = 0;
    var outAt = 0;
    var busy = false;
    var armed = false;
    var armedTimer = 0;

    function clamp(value, low, high) { return value < low ? low : value > high ? high : value; }

    function stamp(seconds) {
        var whole = Math.max(0, Math.floor(seconds || 0));
        var rest = whole % 60;
        return Math.floor(whole / 60) + ":" + (rest < 10 ? "0" : "") + rest;
    }

    function percent(seconds) { return (length > 0 ? clamp(seconds / length, 0, 1) * 100 : 0) + "%"; }

    function span(from, to) {
        return (length > 0 ? clamp((to - from) / length, 0, 1) * 100 : 0) + "%";
    }

    function draw() {
        var at = el.video.currentTime || 0;

        el.range.style.left = percent(inAt);
        el.range.style.width = span(inAt, outAt);

        el.played.style.left = percent(inAt);
        el.played.style.width = span(inAt, clamp(at, inAt, outAt));

        el.head.style.left = percent(at);
        el.handleIn.style.left = percent(inAt);
        el.handleOut.style.left = percent(outAt);

        el.time.textContent = stamp(at - inAt) + " / " + stamp(outAt - inAt);
    }

    function say(text, bad) {
        el.status.textContent = text || "";
        el.status.className = bad ? "status bad" : "status";
    }

    function disarm() {
        if (!armed) return;
        armed = false;
        clearTimeout(armedTimer);
        document.querySelector("[data-do=delete]").textContent = "Delete";
    }

    function working(state) {
        busy = state;
        var buttons = document.querySelectorAll("[data-do=cut], [data-do=send], [data-do=link], [data-do=delete], [data-do=open]");
        for (var i = 0; i < buttons.length; i++) buttons[i].disabled = state;
    }

    function leave() {
        el.card.classList.remove("up");
        // The window belongs to the main process; asking it to close is the
        // same door the keybind uses.
        if (api) api.act("close", {});
        else window.close();
    }

    function ask(kind) {
        if (busy) return;
        if (!api) { say("This overlay cannot reach the client", true); return; }
        if (!(outAt > inAt)) { say("Nothing is selected", true); return; }

        working(true);
        say("Working...");
        api.act(kind, { clip: clip.name, from: inAt, to: outAt });
    }

    if (api) api.onReply(function (reply) {
        working(false);
        say(reply && reply.message, !(reply && reply.ok));
        if (reply && reply.close) setTimeout(leave, 700);
    });

    /* ------------------------------------------------------------ playback */

    el.video.addEventListener("loadedmetadata", function () {
        length = isFinite(el.video.duration) ? el.video.duration : 0;
        outAt = length;
        drawMarks();
        draw();
        el.card.classList.add("up");
    });

    el.video.addEventListener("timeupdate", function () {
        // Playback stays inside the selection, so the handles are heard as well
        // as seen: what loops is what a cut would keep.
        if (el.video.currentTime < inAt - 0.25 || el.video.currentTime > outAt) el.video.currentTime = inAt;
        draw();
    });

    el.video.addEventListener("play", function () { el.play.textContent = "Pause"; });
    el.video.addEventListener("pause", function () { el.play.textContent = "Play"; });
    el.video.addEventListener("error", function () { say("That clip cannot be played here", true); });

    el.video.volume = clamp((look.volume || 0) / 100, 0, 1);
    el.video.muted = !(look.volume > 0);
    el.video.src = clip.url;

    // Sound needs a gesture this window has not had yet; muted always plays.
    el.video.play().catch(function () {
        el.video.muted = true;
        el.video.play().catch(function () { say("That clip cannot be played here", true); });
    });

    /* ----------------------------------------------------------- the ruler */

    function timeAt(event) {
        var box = el.track.getBoundingClientRect();
        return clamp((event.clientX - box.left) / (box.width || 1), 0, 1) * length;
    }

    function drag(handle, move) {
        handle.addEventListener("pointerdown", function (event) {
            event.preventDefault();
            event.stopPropagation();
            handle.setPointerCapture(event.pointerId);

            var onMove = function (moved) { move(timeAt(moved)); draw(); };
            var onUp = function () {
                handle.removeEventListener("pointermove", onMove);
                handle.removeEventListener("pointerup", onUp);
            };

            handle.addEventListener("pointermove", onMove);
            handle.addEventListener("pointerup", onUp);
        });
    }

    drag(el.handleIn, function (at) {
        inAt = clamp(at, 0, Math.max(0, outAt - 0.2));
        if (el.video.currentTime < inAt) el.video.currentTime = inAt;
    });

    drag(el.handleOut, function (at) {
        outAt = clamp(at, Math.min(length, inAt + 0.2), length);
        if (el.video.currentTime > outAt) el.video.currentTime = inAt;
    });

    el.track.addEventListener("pointerdown", function (event) {
        el.video.currentTime = clamp(timeAt(event), inAt, outAt);
        draw();
    });

    function drawMarks() {
        el.marks.textContent = "";
        if (!(length > 0)) return;

        for (var i = 0; i < clip.markers.length; i++) {
            if (clip.markers[i] < 0 || clip.markers[i] > length) continue;

            var mark = document.createElement("div");
            mark.className = "mark";
            mark.style.left = percent(clip.markers[i]);
            el.marks.appendChild(mark);
        }
    }

    /* --------------------------------------------------------- the buttons */

    var doing = {
        play: function () { if (el.video.paused) el.video.play().catch(function () {}); else el.video.pause(); },
        "in": function () { inAt = clamp(el.video.currentTime, 0, Math.max(0, outAt - 0.2)); draw(); },
        out: function () { outAt = clamp(el.video.currentTime, Math.min(length, inAt + 0.2), length); draw(); },
        all: function () { inAt = 0; outAt = length; el.video.currentTime = 0; draw(); },
        cut: function () { ask("cut"); },
        send: function () { ask("send"); },
        open: function () { ask("open"); },
        close: leave,
        "delete": function () {
            // Nothing irreversible on one click, in a window opened mid-game.
            if (!armed) {
                armed = true;
                document.querySelector("[data-do=delete]").textContent = "Sure?";
                say("Press again to delete this clip");
                armedTimer = setTimeout(disarm, 4000);
                return;
            }

            disarm();
            ask("delete");
        }
    };

    document.addEventListener("click", function (event) {
        var button = event.target.closest ? event.target.closest("[data-do]") : null;
        if (!button) return;

        var what = button.getAttribute("data-do");
        if (what !== "delete") disarm();
        if (doing[what]) doing[what]();
    });

    document.addEventListener("keydown", function (event) {
        var step = event.shiftKey ? 5 : 1;

        if (event.key === "Escape") leave();
        else if (event.key === " ") doing.play();
        else if (event.key === "ArrowLeft") el.video.currentTime = clamp(el.video.currentTime - step, inAt, outAt);
        else if (event.key === "ArrowRight") el.video.currentTime = clamp(el.video.currentTime + step, inAt, outAt);
        else if (event.key === "i" || event.key === "I") doing["in"]();
        else if (event.key === "o" || event.key === "O") doing.out();
        else return;

        event.preventDefault();
        draw();
    });

    draw();
</script>
</body>
</html>`}function ui(t,e){if(!Wt())return!1;dt(),be(),Ne();let n=Math.max(360,Math.round(e.width)),r=Math.round(n*9/16)+Ta,{x:i,y:o}=Ia(n,r),a=ct("studio-preload.js",Pa),s=ct("studio.html",Aa(t,e)),l=new Y.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return O=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{O===l&&(O=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}Y.app.on("will-quit",()=>dt());u();function j(t){return`${t.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}u();var wi=require("child_process"),bi=require("electron"),On=require("fs"),gt=require("path");u();var Ca=`
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

namespace Clipper
{
    public static class Bridge
    {
        [DllImport("kernel32", SetLastError = true, CharSet = CharSet.Ansi)]
        private static extern IntPtr LoadLibrary(string path);

        [DllImport("kernel32", SetLastError = true, CharSet = CharSet.Ansi)]
        private static extern IntPtr GetProcAddress(IntPtr module, string name);

        [DllImport("kernel32", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool FreeLibrary(IntPtr module);

        // The six flat exports. Everything else lives behind GetGenericInterface.
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate IntPtr InitInternal(ref int error, int applicationType);
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate void ShutdownInternal();
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate IntPtr GetGenericInterface([MarshalAs(UnmanagedType.LPStr)] string version, ref int error);

        // IVRSystem
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate void GetPoses(int origin, float secondsAhead, IntPtr poses, uint count);
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate uint IndexForRole(int role);
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate IntPtr RuntimeVersion();

        // IVRInput
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate int SetManifest([MarshalAs(UnmanagedType.LPStr)] string path);
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate int GetHandle([MarshalAs(UnmanagedType.LPStr)] string name, out ulong handle);
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate int UpdateState([In] ActiveActionSet[] sets, uint sizeOfOne, uint count);
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate int DigitalData(ulong action, ref DigitalActionData data, uint size, ulong restrictTo);
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate int BindingUI([MarshalAs(UnmanagedType.LPStr)] string appKey, ulong actionSet, ulong device, [MarshalAs(UnmanagedType.I1)] bool onDesktop);

        // IVROverlay
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int MakeOverlay([MarshalAs(UnmanagedType.LPStr)] string key, [MarshalAs(UnmanagedType.LPStr)] string name, ref ulong handle);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int DropOverlay(ulong overlay);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate IntPtr OverlayErrorName(int error);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int OverlayWidth(ulong overlay, float metres);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int OverlayFollow(ulong overlay, uint device, ref Matrix34 place);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int OverlayPixels(ulong overlay, IntPtr buffer, uint width, uint height, uint bytesPerPixel);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        private delegate int OverlayShow(ulong overlay);

        // IVRApplications
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate int AddManifest([MarshalAs(UnmanagedType.LPStr)] string path, [MarshalAs(UnmanagedType.I1)] bool temporary);
        [UnmanagedFunctionPointer(CallingConvention.StdCall)]
        private delegate int Identify(uint pid, [MarshalAs(UnmanagedType.LPStr)] string appKey);

        [StructLayout(LayoutKind.Sequential)]
        private struct ActiveActionSet
        {
            public ulong ActionSet;
            public ulong RestrictedToDevice;
            public ulong SecondaryActionSet;
            public uint Padding;
            public int Priority;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct DigitalActionData
        {
            [MarshalAs(UnmanagedType.I1)] public bool Active;
            public ulong ActiveOrigin;
            [MarshalAs(UnmanagedType.I1)] public bool State;
            [MarshalAs(UnmanagedType.I1)] public bool Changed;
            public float UpdateTime;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct DevicePose
        {
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 12)] public float[] DeviceToAbsolute;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)] public float[] Velocity;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)] public float[] AngularVelocity;
            public int TrackingResult;
            [MarshalAs(UnmanagedType.I1)] public bool PoseIsValid;
            [MarshalAs(UnmanagedType.I1)] public bool DeviceIsConnected;
        }

        /*
         * HmdMatrix34_t: three rows of four, laid out one after another.
         *
         * Written as twelve fields rather than as an array, because a struct
         * holding a managed array has to be told how to marshal it and gets it
         * wrong quietly if the attribute is missed. Twelve plain floats can
         * only be laid out one way, and its size is checked at startup with
         * the three below it.
         */
        [StructLayout(LayoutKind.Sequential)]
        private struct Matrix34
        {
            public float M00, M01, M02, M03;
            public float M10, M11, M12, M13;
            public float M20, M21, M22, M23;
        }

        private const int ApplicationBackground = 3;
        private const int UniverseStanding = 1;
        private const int MaxDevices = 64;
        private const int RoleLeftHand = 1;
        private const int RoleRightHand = 2;

        /*
         * How long to leave SteamVR alone between attempts to attach, and how
         * many failed updates in a row mean it has gone away underneath us.
         *
         * Five seconds rather than the fifteen the supervisor used to wait,
         * because an attempt now costs one failed function call instead of a
         * process and a C# compile. Fifty ticks is roughly a second of the
         * loop below - the update call is the first thing it does, with the
         * timeout only ever hit while it is busy - long enough that a hiccup
         * is not mistaken for a shutdown.
         */
        private const int RetrySeconds = 5;
        private const int LostLimit = 50;

        /* The fast (50Hz) and idle (~30Hz) cadences of the session loop. */
        private const int BusyMilliseconds = 20;
        private const int IdleMilliseconds = 33;
        /* How many busy loops to stay fast for after the last thing that needed it. */
        private const int FastTicks = 25;

        /*
         * The lowest hands and head speeds worth saying anything about,
         * matching ./vr.ts: HAND_FLOOR and HEAD_FLOOR, under which its
         * scale() throws the value away and the line would just be parsed
         * into a zero.
         */
        private const float MotionHands = 1.2f;
        private const float MotionHead = 1.5f;

        /*
         * Where the panel hangs, relative to the headset.
         *
         * A metre out and thirty centimetres down, which in a headset is below
         * whatever the player is actually looking at and well inside the field
         * of view - the same place a car puts its instruments, and for the same
         * reason. Tilted back fifteen degrees so it faces the eyes rather than
         * the floor.
         *
         * Attached to the headset rather than left in the room, because this is
         * a notice that somebody has a second or two to read: a panel left
         * hanging where the player was looking a minute ago is a panel nobody
         * ever sees.
         */
        private const float PanelForward = -1.0f;
        private const float PanelDown = -0.30f;
        private const float PanelTilt = 0.26f;
        private const float PanelMetres = 0.55f;

        /** The largest picture the plugin may hand over, in pixels either way. */
        private const int PanelLimit = 2048;

        private static readonly object Gate = new object();
        private static readonly Queue<string> _commands = new Queue<string>();
        private static bool _stopped;

        private static T Entry<T>(IntPtr table, int index)
        {
            IntPtr fn = Marshal.ReadIntPtr(table, index * IntPtr.Size);
            if (fn == IntPtr.Zero) throw new EntryPointNotFoundException("Nothing at index " + index + " of an OpenVR function table");

            return (T) (object) Marshal.GetDelegateForFunctionPointer(fn, typeof(T));
        }

        /*
         * One string, made safe to sit inside the JSON written by hand above.
         *
         * The control characters are replaced rather than escaped, because
         * every message that comes through here is a sentence meant for a
         * person and none of them mean anything as a tab or a newline. What
         * matters is that none of them survive: a raw control character inside
         * a JSON string makes the whole line unparseable, and an unparseable
         * line is dropped in silence at the other end. For an error line that
         * means a bridge which gave its reason and had it thrown away, leaving
         * the plugin to work out three bridges later that something is wrong.
         */
        private static string Esc(string text)
        {
            if (text == null) return "";

            StringBuilder built = new StringBuilder(text.Length);

            foreach (char c in text)
            {
                if (c == '\\\\') built.Append("\\\\\\\\");
                else if (c == '"') built.Append("\\\\\\"");
                else if (c < ' ' || c == (char) 127) built.Append(' ');
                else built.Append(c);
            }

            return built.ToString();
        }

        private static void Say(string line)
        {
            Console.Out.WriteLine(line);
            Console.Out.Flush();
        }

        /*
         * Something went wrong that no amount of retrying fixes: a SteamVR too
         * old for the interfaces, a manifest it will not take, a bridge that
         * will not compile at all. The plugin keeps it, repeats it in the
         * toolbox, and stops starting new bridges.
         *
         * That is the whole of what an error line means here, and it is why
         * there is no flag on it saying so. Anything that is only true for now -
         * SteamVR off, the headset on the desk - is a waiting line instead and
         * never comes through here.
         */
        private static void Fail(string message)
        {
            Say("{\\"t\\":\\"error\\",\\"message\\":\\"" + Esc(message) + "\\"}");
        }

        /*
         * Something is wrong with a session that is otherwise working.
         *
         * Deliberately not an error: an error is a thing the plugin stops
         * starting bridges over, and this session is up and delivering presses.
         * The one that goes through here is a set SteamVR knows with actions in
         * it that it does not, which leaves buttons that can never be bound and
         * nothing anywhere saying why - worth saying, not worth giving up over,
         * and above all not worth refusing to start the next bridge over after
         * a crash that had nothing to do with it.
         */
        private static void Warn(string message)
        {
            Say("{\\"t\\":\\"warning\\",\\"message\\":\\"" + Esc(message) + "\\"}");
        }

        /*
         * Why there is no session, in words somebody can act on.
         *
         * The headset codes say nothing about whether SteamVR is running, and an
         * earlier version of this said they did. The presence check happens
         * before the server is ever contacted, so 126 comes back on a machine
         * with SteamVR shut down and no headset plugged in - which is most
         * machines, most of the time, and was being told SteamVR was running.
         */
        private static string Explain(int error)
        {
            if (error == 108 || error == 125 || error == 126) return "No headset is connected";
            if (error == 109 || error == 119 || error == 121) return "SteamVR is not running";
            if (error >= 100 && error <= 103) return "SteamVR is installed but not working (error " + error + ")";
            if (error == 115 || error == 117) return "SteamVR is still starting up";

            return "SteamVR is not ready (error " + error + ")";
        }

        /*
         * The same thing for an error that will not come right.
         *
         * Explain() is for things somebody can wait out, and its wording says
         * so. "Not ready" reads as "give it a minute" for a refusal that will
         * still be a refusal tomorrow, which is worse than saying nothing.
         */
        private static string Refused(int error)
        {
            string what;

            if (error == 123) what = "SteamVR has decided this is a utility application, and does not give those a session";
            else if (error == 130) what = "SteamVR does not accept the kind of application the bridge asks to be";
            else what = "SteamVR refused the connection outright";

            return what + " (error " + error + "), and waiting will not change that";
        }

        /*
         * Whether an init error can ever come right on its own.
         *
         * Almost none of them are worth giving up over: a headset gets plugged
         * in, SteamVR gets started, and the same call succeeds a moment later.
         * The three here are ways of asking for something this application is
         * not, which no amount of waiting changes.
         */
        private static bool Fatal(int error)
        {
            return error == 123 || error == 130 || error == 131;
        }

        private static string Num(double value)
        {
            return value.ToString("0.###", CultureInfo.InvariantCulture);
        }

        private static double Magnitude(float[] v)
        {
            if (v == null || v.Length < 3) return 0;
            return Math.Sqrt((double) v[0] * v[0] + (double) v[1] * v[1] + (double) v[2] * v[2]);
        }

        // Takes the next thing the plugin asked for, or null if it has not asked.
        private static string TakeCommand()
        {
            lock (Gate)
            {
                return _commands.Count == 0 ? null : _commands.Dequeue();
            }
        }

        /*
         * Throws away anything asked for while there was nothing to ask.
         *
         * A request for the binding panel is only worth acting on while somebody
         * is still looking at the button they clicked it with. Left in the queue,
         * it opened SteamVR's binding panel over whatever they were playing the
         * next time a headset went on, which could be hours later.
         */
        private static void Drain()
        {
            lock (Gate) { _commands.Clear(); }
        }

        /** Whether the plugin has asked to stop, or has gone away. */
        private static bool Stopping()
        {
            lock (Gate) { return _stopped; }
        }

        /*
         * Sleeps, but notices a stop while it does.
         *
         * A plain Sleep would leave a bridge asked to shut down sitting there
         * for the rest of its wait, and the plugin kills it after two seconds -
         * which loses the tidy SteamVR shutdown the pipe closing is for.
         */
        private static void Wait(int seconds)
        {
            for (int i = 0; i < seconds * 10 && !Stopping(); i++) Thread.Sleep(100);
        }

        private static void ReadCommands()
        {
            while (true)
            {
                string line = Console.In.ReadLine();

                // The plugin closed the pipe: it is gone, and so are we. Without
                // this a bridge outlives a client that crashed, holding a
                // SteamVR application registration nothing will ever clear.
                if (line == null) { lock (Gate) { _stopped = true; } return; }

                line = line.Trim();
                if (line.Length == 0) continue;

                if (line == "stop") { lock (Gate) { _stopped = true; } return; }

                // Queued rather than held in one slot: a stop arriving straight
                // after a request for the binding panel used to overwrite it, so
                // the panel never opened. Bounded, because a plugin that asks
                // faster than this can act is a bug, not a backlog to keep.
                lock (Gate) { if (_commands.Count < 8) _commands.Enqueue(line); }
            }
        }

        /*
         * One process for as long as the setting is on, whether SteamVR is there
         * or not.
         *
         * The plugin used to start one of these every fifteen seconds while it
         * waited, and every start recompiled the C# above - a full csc run, a
         * little over a second of it, all day, on a machine that is also running
         * a game. So the waiting happens in here now, where it costs a sleeping
         * thread, and the supervisor on the other end only has to restart this
         * if it actually dies.
         */
        public static void Run(string apiPath, string actionsPath, string manifestPath, string appKey, string actionList)
        {
            IntPtr library = LoadLibrary(apiPath);
            if (library == IntPtr.Zero) { Fail("openvr_api.dll could not be loaded from " + apiPath); return; }

            try
            {
                IntPtr initAddress = GetProcAddress(library, "VR_InitInternal");
                IntPtr shutdownAddress = GetProcAddress(library, "VR_ShutdownInternal");
                IntPtr interfaceAddress = GetProcAddress(library, "VR_GetGenericInterface");

                if (initAddress == IntPtr.Zero || shutdownAddress == IntPtr.Zero || interfaceAddress == IntPtr.Zero)
                {
                    Fail("openvr_api.dll is not the library it claims to be: the entry points are missing");
                    return;
                }

                /*
                 * The sizes the header says these are, checked rather than
                 * trusted. A struct laid out differently than OpenVR expects
                 * does not crash: it reads neighbouring bytes as floats, and the
                 * motion detector acts on the result. Wrong numbers that look
                 * like numbers are the worst outcome available here.
                 */
                if (Marshal.SizeOf(typeof(ActiveActionSet)) != 32
                    || Marshal.SizeOf(typeof(DigitalActionData)) != 24
                    || Marshal.SizeOf(typeof(DevicePose)) != 80
                    || Marshal.SizeOf(typeof(Matrix34)) != 48)
                {
                    Fail("The OpenVR structures are not the size they are supposed to be, refusing to call into them");
                    return;
                }

                InitInternal init = (InitInternal) Marshal.GetDelegateForFunctionPointer(initAddress, typeof(InitInternal));
                ShutdownInternal shutdown = (ShutdownInternal) Marshal.GetDelegateForFunctionPointer(shutdownAddress, typeof(ShutdownInternal));
                GetGenericInterface get = (GetGenericInterface) Marshal.GetDelegateForFunctionPointer(interfaceAddress, typeof(GetGenericInterface));

                Thread reader = new Thread(ReadCommands);
                reader.IsBackground = true;
                reader.Start();

                // What was last said about not being attached, so the same line
                // is not printed twelve times a minute at a plugin that already
                // knows. Cleared on every attach, so taking a headset off and
                // putting it back on says both things again.
                string said = "";

                while (!Stopping())
                {
                    // Before the attempt, so that neither a wait nor a session
                    // starts holding something asked for a long time ago.
                    Drain();

                    int error = 0;

                    /*
                     * Background, not Overlay. An overlay application starts
                     * SteamVR if it is not already running, and Discord
                     * launching SteamVR because a setting is on would be
                     * indefensible. Background attaches to a session that
                     * exists and fails cleanly when there is none.
                     */
                    init(ref error, ApplicationBackground);

                    if (error != 0)
                    {
                        // Called even though the init failed: OpenVR keeps state
                        // per process from a half-finished attempt, and the next
                        // attempt would inherit it.
                        shutdown();

                        if (Fatal(error)) { Fail(Refused(error)); return; }

                        string reason = Explain(error);
                        if (reason != said)
                        {
                            Say("{\\"t\\":\\"waiting\\",\\"reason\\":\\"" + Esc(reason) + "\\"}");
                            said = reason;
                        }

                        Wait(RetrySeconds);
                        continue;
                    }

                    said = "";

                    bool again = Session(get, appKey, actionsPath, manifestPath, actionList);
                    shutdown();

                    if (!again) return;
                }
            }
            finally
            {
                FreeLibrary(library);
            }
        }

        /*
         * One attached session, from the interfaces to SteamVR going away again.
         *
         * Returns true if it is worth waiting for SteamVR to come back, false if
         * the bridge is done - asked to stop, or stopped by something no retry
         * fixes.
         */
        private static bool Session(GetGenericInterface get, string appKey, string actionsPath, string manifestPath, string actionList)
        {
            int error = 0;

            IntPtr system = get("FnTable:IVRSystem_026", ref error);
            if (system == IntPtr.Zero) { Fail("This SteamVR is too old: it has no IVRSystem_026"); return false; }

            IntPtr input = get("FnTable:IVRInput_011", ref error);
            if (input == IntPtr.Zero) { Fail("This SteamVR is too old: it has no IVRInput_011"); return false; }

            IntPtr apps = get("FnTable:IVRApplications_008", ref error);
            if (apps == IntPtr.Zero) { Fail("This SteamVR is too old: it has no IVRApplications_008"); return false; }

            /*
             * The overlay is the one interface allowed to be absent.
             *
             * Everything above this is what the binds are made of, and a
             * SteamVR without it is a SteamVR the plugin cannot work on at all.
             * The panel is a nicety on top: a runtime too old to draw it should
             * cost the player the picture and nothing else, so a missing
             * interface here warns and carries on with a zero handle, which
             * every panel command below checks for.
             */
            IntPtr overlay = get("FnTable:IVROverlay_028", ref error);
            ulong panel = 0;

            if (overlay == IntPtr.Zero) Warn("This SteamVR has no IVROverlay_028, so the binds will work but nothing will be drawn in the headset");
            else if (!MakePanel(overlay, appKey, ref panel)) overlay = IntPtr.Zero;

            // IVRSystem index 49, GetRuntimeVersion, the last entry but one.
            // Reached correctly only if every index before it was counted
            // right, which is the whole point of asking.
            IntPtr versionPtr = Entry<RuntimeVersion>(system, 49)();
            string version = versionPtr == IntPtr.Zero ? "" : Marshal.PtrToStringAnsi(versionPtr);

            if (string.IsNullOrEmpty(version) || version.Length > 64)
            {
                Fail("The OpenVR function tables are not laid out as expected, refusing to call into them");
                return false;
            }

            // IVRApplications index 0, AddApplicationManifest. Temporary, so
            // nothing is left in SteamVR's application list afterwards.
            Entry<AddManifest>(apps, 0)(manifestPath, true);

            // IVRApplications index 11, IdentifyApplication. This is what
            // makes the binding panel say Clipper rather than powershell.
            Entry<Identify>(apps, 11)((uint) System.Diagnostics.Process.GetCurrentProcess().Id, appKey);

            // IVRInput index 0, SetActionManifestPath.
            int failed = Entry<SetManifest>(input, 0)(actionsPath);
            if (failed != 0) { Fail("SteamVR rejected the action manifest (error " + failed + ")"); return false; }

            // IVRInput index 1, GetActionSetHandle; index 2, GetActionHandle.
            GetHandle setHandles = Entry<GetHandle>(input, 1);
            GetHandle actionHandles = Entry<GetHandle>(input, 2);

            // The set, then every action in it, separated by pipes: one
            // argument rather than a variable number of them.
            string[] parts = actionList.Split('|');

            ulong setHandle = 0;
            failed = setHandles(parts[0], out setHandle);
            if (failed != 0) { Fail("SteamVR does not know the action set (error " + failed + ")"); return false; }

            string[] names = new string[parts.Length - 1];
            ulong[] actions = new ulong[parts.Length - 1];
            string missing = "";
            int usable = 0;

            for (int i = 1; i < parts.Length; i++)
            {
                ulong handle = 0;

                // Checked, not assumed. An action SteamVR does not recognise
                // comes back as a zero handle and is skipped in the loop below,
                // which used to mean a button that quietly did nothing for ever
                // with nothing anywhere saying why.
                if (actionHandles(parts[0] + "/in/" + parts[i], out handle) != 0 || handle == 0)
                {
                    missing = missing.Length == 0 ? parts[i] : missing + ", " + parts[i];
                    handle = 0;
                }
                else usable++;

                names[i - 1] = parts[i];
                actions[i - 1] = handle;
            }

            if (usable == 0)
            {
                Fail("SteamVR did not recognise any of the plugin's actions, so no controller button can reach it");
                return false;
            }

            ActiveActionSet[] active = new ActiveActionSet[1];
            active[0].ActionSet = setHandle;

            UpdateState update = Entry<UpdateState>(input, 4);
            DigitalData digital = Entry<DigitalData>(input, 5);
            BindingUI openBindings = Entry<BindingUI>(input, 32);
            GetPoses poses = Entry<GetPoses>(system, 12);
            IndexForRole role = Entry<IndexForRole>(system, 18);

            uint setSize = (uint) Marshal.SizeOf(typeof(ActiveActionSet));
            uint dataSize = (uint) Marshal.SizeOf(typeof(DigitalActionData));
            int stride = Marshal.SizeOf(typeof(DevicePose));
            IntPtr buffer = Marshal.AllocHGlobal(stride * MaxDevices);

            Say("{\\"t\\":\\"ready\\",\\"runtime\\":\\"" + Esc(version) + "\\"}");

            // After the ready line rather than before it, because the plugin
            // clears the last problem when a bridge attaches - and this one is
            // still true of the bridge that just did. Said again after every
            // re-attach, for the same reason.
            if (missing.Length > 0) Warn("SteamVR did not recognise these actions, and nothing can be bound to them: " + missing);

            try
            {
                int tick = 0;
                int lost = 0;
                int busyTicks = 0;
                DateTime until = DateTime.MinValue;

                while (!Stopping())
                {
                    // Null nearly every time round: nothing has been asked
                    // for. Checked once here rather than at each branch, because
                    // the branches below are not all plain comparisons, and a
                    // comparison is the only thing null survives.
                    string command = TakeCommand();

                    if (command != null)
                    {
                        busyTicks = FastTicks;

                        // IVRInput index 32, OpenBindingUI: SteamVR's own
                        // binding panel, opened on our action set. Shown on the
                        // desktop as well as in the headset, because the person
                        // who just clicked the button in Discord is looking at
                        // a monitor.
                        if (command == "bindings") openBindings(appKey, setHandle, 0, true);

                        // A picture to put in front of the player's eyes,
                        // painted in the browser and left in a file because a
                        // few hundred kilobytes of pixels do not belong on a
                        // line-by-line pipe.
                        else if (command.StartsWith("panel ")) until = ShowPanel(overlay, panel, command);
                        else if (command == "panelhide") { HidePanel(overlay, panel); until = DateTime.MinValue; }
                    }

                    /*
                     * The countdown is kept here rather than in the plugin.
                     *
                     * Whatever asked for the panel is a renderer that can be
                     * busy, reloaded or closed in the seconds between showing
                     * it and taking it away, and none of those should be able
                     * to leave a picture nailed across somebody's view of the
                     * game. The side that draws it is the side that can always
                     * be counted on to hide it.
                     */
                    if (until != DateTime.MinValue && DateTime.UtcNow >= until)
                    {
                        HidePanel(overlay, panel);
                        until = DateTime.MinValue;
                    }

                    /*
                     * The return value is the only warning that SteamVR has
                     * gone: it does not kill this process, the calls simply
                     * start failing. A second of them in a row is treated as a
                     * shutdown and sends the outer loop back to waiting, so
                     * taking a headset off and putting it on again costs
                     * nothing and starts nothing.
                     */
                    if (update(active, setSize, 1) != 0)
                    {
                        if (++lost >= LostLimit) return true;

                        Thread.Sleep(20);
                        continue;
                    }

                    lost = 0;

                    for (int i = 0; i < actions.Length; i++)
                    {
                        if (actions[i] == 0) continue;

                        DigitalActionData data = new DigitalActionData();
                        if (digital(actions[i], ref data, dataSize, 0) != 0) continue;

                        // Changed as well as State: held down is one press,
                        // not fifty a second.
                        if (data.Active && data.State && data.Changed)
                        {
                            busyTicks = FastTicks;
                            Say("{\\"t\\":\\"action\\",\\"name\\":\\"" + Esc(names[i]) + "\\"}");
                        }
                    }

                    // Poses ten times a second rather than fifty. Hands do not
                    // change direction meaningfully faster than that, and the
                    // line is being parsed by a browser.
                    if (++tick >= 5)
                    {
                        tick = 0;
                        poses(UniverseStanding, 0f, buffer, MaxDevices);

                        DevicePose head = (DevicePose) Marshal.PtrToStructure(buffer, typeof(DevicePose));
                        double hands = 0;

                        uint left = role(RoleLeftHand);
                        uint right = role(RoleRightHand);

                        if (left < MaxDevices) hands = Math.Max(hands, HandSpeed(buffer, stride, left));
                        if (right < MaxDevices) hands = Math.Max(hands, HandSpeed(buffer, stride, right));

                        double turn = head.PoseIsValid ? Magnitude(head.AngularVelocity) : 0;

                        /*
                         * Silent until a hand or the head actually moves.
                         *
                         * The renderer turns the line into two levels by
                         * comparing the numbers against HAND_FLOOR and
                         * HEAD_FLOOR - a swing that matters, or nothing at
                         * all - and ./signals forgets a level a second after
                         * its last report. So a resting player needs no line
                         * at all: nothing reported means zero, and the moment
                         * a hand gets up in the air it does because a line
                         * showed up. Sending zeros ten times a second was
                         * moving the value 0 from the bridge to the browser
                         * for nothing.
                         *
                         * One line because people do not sit at exactly zero:
                         * a controller in a lap has a little sway in it, and
                         * treating that as motion would wake the renderer up
                         * for no reason and make it lie about what was
                         * happening.
                         */
                        if (hands >= MotionHands || turn >= MotionHead)
                        {
                            busyTicks = FastTicks;
                            Say("{\\"t\\":\\"motion\\",\\"hands\\":" + Num(hands) + ",\\"head\\":" + Num(turn) + "}");
                        }
                    }

                    // Slow down when nothing is going on, wake up the moment
                    // anything is. A sleeping player needs a 50Hz report of
                    // their stillness about as much as they need the 50Hz
                    // report of their slumber, and cutting the idle cadence
                    // across both pipes - this loop and the browser that
                    // parses it - is a quiet win for the whole machine.
                    if (busyTicks > 0) busyTicks--;
                    Thread.Sleep(busyTicks > 0 ? BusyMilliseconds : IdleMilliseconds);
                }
            }
            finally
            {
                Marshal.FreeHGlobal(buffer);

                // IVROverlay index 3, DestroyOverlay. SteamVR would drop it
                // when the process goes, but this process is meant to outlive
                // several SteamVR sessions: leaving them behind would put one
                // more dead overlay in the compositor on every re-attach.
                if (overlay != IntPtr.Zero && panel != 0) Entry<DropOverlay>(overlay, 3)(panel);
            }

            return false;
        }

        /**
         * Makes the panel, and puts it where the player can read it.
         *
         * The canary first: index 8 turns an error number back into its own
         * name, so calling it with zero and getting "VROverlayError_None" says
         * that this table is laid out where the header says it is - before
         * anything is created, and without a single call that could be a
         * different function taking different arguments.
         */
        private static bool MakePanel(IntPtr overlay, string appKey, ref ulong panel)
        {
            IntPtr namePtr;

            try { namePtr = Entry<OverlayErrorName>(overlay, 8)(0); }
            catch { namePtr = IntPtr.Zero; }

            string none = namePtr == IntPtr.Zero ? "" : Marshal.PtrToStringAnsi(namePtr);

            if (none != "VROverlayError_None")
            {
                Warn("The IVROverlay function table is not laid out as expected, so nothing will be drawn in the headset");
                return false;
            }

            // IVROverlay index 1, CreateOverlay. The key is what SteamVR
            // identifies it by and has to be unique across everything running;
            // the name is what a person sees in the compositor's own lists.
            int failed = Entry<MakeOverlay>(overlay, 1)(appKey + ".panel", "Clipper", ref panel);

            if (failed != 0 || panel == 0)
            {
                Warn("SteamVR refused to make the overlay (error " + failed + "), so nothing will be drawn in the headset");
                return false;
            }

            // IVROverlay index 22, SetOverlayWidthInMeters. Height follows from
            // the picture's own shape, so only the width is ever set.
            Entry<OverlayWidth>(overlay, 22)(panel, PanelMetres);

            /*
             * A rotation about x, then the offset, in the headset's own frame.
             *
             * Row-major three by four: the left three columns turn, the last
             * one moves. Negative z is forward in OpenVR, so the panel sits a
             * metre in front and a little below, pitched up towards the eyes by
             * the same angle it was put down by.
             */
            double c = Math.Cos(PanelTilt);
            double s = Math.Sin(PanelTilt);

            Matrix34 place = new Matrix34();
            place.M00 = 1f; place.M03 = 0f;
            place.M11 = (float) c; place.M12 = (float) -s; place.M13 = PanelDown;
            place.M21 = (float) s; place.M22 = (float) c; place.M23 = PanelForward;

            // IVROverlay index 35, SetOverlayTransformTrackedDeviceRelative,
            // on device 0 - the headset, which OpenVR reserves that index for.
            Entry<OverlayFollow>(overlay, 35)(panel, 0, ref place);

            return true;
        }

        /**
         * Draws one picture and shows it, returning when it should go away.
         *
         * The command is: panel, then width, height, milliseconds and the path,
         * in that order. The numbers come first so that the path can be the
         * whole of the rest of the line: it is a Windows path out of a folder
         * under the user's profile, and those have spaces in them often
         * enough to be worth never thinking about.
         */
        private static DateTime ShowPanel(IntPtr overlay, ulong panel, string command)
        {
            if (overlay == IntPtr.Zero || panel == 0) return DateTime.MinValue;

            string[] parts = command.Split(new char[] { ' ' }, 5);
            if (parts.Length < 5) return DateTime.MinValue;

            int width, height, ms;

            if (!int.TryParse(parts[1], out width) || !int.TryParse(parts[2], out height) || !int.TryParse(parts[3], out ms)) return DateTime.MinValue;
            if (width <= 0 || height <= 0 || width > PanelLimit || height > PanelLimit || ms <= 0) return DateTime.MinValue;

            byte[] pixels;

            /*
             * Read once, then delete, whatever happened next.
             *
             * The file is this side's to dispose of: the plugin writes it into
             * the temporary directory and forgets it, because the moment it has
             * handed the path over it has no way of knowing when the picture
             * has been read and the file is safe to remove.
             */
            try { pixels = File.ReadAllBytes(parts[4]); }
            catch { return DateTime.MinValue; }
            finally { try { File.Delete(parts[4]); } catch { } }

            // Four bytes to the pixel, and exactly as many as were promised: a
            // buffer shorter than its stated size is read past the end of by
            // the compositor rather than refused.
            if (pixels.Length != width * height * 4) return DateTime.MinValue;

            GCHandle pinned = GCHandle.Alloc(pixels, GCHandleType.Pinned);

            try
            {
                // IVROverlay index 62, SetOverlayRaw. Plain RGBA out of main
                // memory, which is why none of this needs a graphics device.
                if (Entry<OverlayPixels>(overlay, 62)(panel, pinned.AddrOfPinnedObject(), (uint) width, (uint) height, 4) != 0) return DateTime.MinValue;
            }
            finally
            {
                pinned.Free();
            }

            // IVROverlay index 43, ShowOverlay.
            Entry<OverlayShow>(overlay, 43)(panel);

            return DateTime.UtcNow.AddMilliseconds(ms);
        }

        /** IVROverlay index 44, HideOverlay. Harmless on one already hidden. */
        private static void HidePanel(IntPtr overlay, ulong panel)
        {
            if (overlay == IntPtr.Zero || panel == 0) return;

            Entry<OverlayShow>(overlay, 44)(panel);
        }

        private static double HandSpeed(IntPtr buffer, int stride, uint index)
        {
            DevicePose pose = (DevicePose) Marshal.PtrToStructure(new IntPtr(buffer.ToInt64() + (long) stride * index), typeof(DevicePose));
            return pose.PoseIsValid ? Magnitude(pose.Velocity) : 0;
        }
    }
}
`,di=`# Vencord Clipper - SteamVR bridge. Generated; edits are overwritten.
param(
    [Parameter(Mandatory = $true)][string] $Api,
    [Parameter(Mandatory = $true)][string] $Actions,
    [Parameter(Mandatory = $true)][string] $Manifest,
    [Parameter(Mandatory = $true)][string] $AppKey,
    [Parameter(Mandatory = $true)][string] $ActionList
)

$ErrorActionPreference = "Stop"

# Before anything is written, including the compile failure below.
#
# A pipe gets whatever [Console]::OutputEncoding says, and on a machine that is
# not set to English that is the OEM code page rather than UTF-8: every accented
# character in a message from Windows or from PowerShell itself arrives at the
# plugin as a replacement character, and the one place those messages are ever
# read is a settings row explaining why the bridge is not running.
try { [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false } catch { }

$source = @'
${Ca}
'@

# Compile once, run as often as needed.
#
# The C# above is the same text every time the bridge is (re)started - toggled
# on/off, a process killed, a headset yanked - and a cold Add-Type run is a
# full csc invocation, around a second of it, every single time. So the one
# thing that is actually expensive is hoarded: the compiled assembly is kept in
# the temporary directory under a name carrying a hash of everything that
# affects its output - the source and the PowerShell generation it was built
# for - and only recompiled when that changes. The name also keeps a 5.1
# Framework build and a 7.x Core build apart: an assembly loads where it was
# built.
$sourceHash = [System.BitConverter]::ToString(
    [System.Security.Cryptography.SHA256]::Create().ComputeHash(
        [System.Text.Encoding]::UTF8.GetBytes($source)
    )
).Replace('-', '').Substring(0, 16)
$cacheDir = Join-Path $env:TEMP "clipper-bridge"
New-Item -ItemType Directory -Path $cacheDir -Force | Out-Null
$cacheFile = Join-Path $cacheDir ("bridge-" + $PSVersionTable.PSVersion.Major + "-" + $sourceHash + ".dll")

try {
    if (-not (Test-Path -LiteralPath $cacheFile)) {
        Add-Type -TypeDefinition $source -Language CSharp -OutputAssembly $cacheFile

        # OutputAssembly writes the file but leaves the type unloaded, so a
        # brand-new copy needs the same load as a reused one below.
    }

    Add-Type -LiteralPath $cacheFile
} catch {
    Write-Output ('{"t":"error","message":"The bridge could not be compiled: ' + ($_.Exception.Message -replace '["\\\\]', ' ' -replace '\\s+', ' ') + '"}')
    exit 1
}

# Wrapped, because nothing else catches this. An exception on the way out of Run
# - a function table slot that is not where the header says it is, a pointer that
# is not what it claims - would otherwise reach PowerShell, be printed to standard
# error, and leave the plugin holding a dead bridge it thinks is worth starting
# again every fifteen seconds, compiling all of the above each time.
try {
    [Clipper.Bridge]::Run($Api, $Actions, $Manifest, $AppKey, $ActionList)
} catch {
    Write-Output ('{"t":"error","message":"The bridge stopped: ' + ($_.Exception.Message -replace '["\\\\]', ' ' -replace '\\s+', ' ') + '"}')
    exit 1
}
`;u();var hi=require("electron"),U=require("fs"),$=require("path"),Bt="vencord.clipper",le="/actions/clipper",pt=["save","mark","toggle","pov"],Ma=["save","mark"],Ra={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function Mn(){let t=(0,$.join)(hi.app.getPath("userData"),"clipper-vr");return(0,U.mkdirSync)(t,{recursive:!0}),t}function _a(){let t=(0,$.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,U.readFileSync)(t,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,U.existsSync)((0,$.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let e=(0,$.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,U.existsSync)((0,$.join)(e,"bin","win64","openvr_api.dll"))?e:null}function fi(){let t=_a();return t&&(0,$.join)(t,"bin","win64","openvr_api.dll")}var Da=.4,Oa={save:"double",mark:"long"};function La(t,e,n){return{path:t,mode:"button",inputs:{[e]:{output:`${le}/in/${n}`}},parameters:e==="long"?{long_press_delay:Da}:{}}}function pi(t,e){return{app_key:Bt,controller_type:t,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[le]:{sources:Ma.map(n=>La(e[n],Oa[n],n))}}}}function mi(){let t=Mn(),e={language_tag:"en_US",[le]:"Clipper"};for(let o of pt)e[`${le}/in/${o}`]=Ra[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:le,usage:"leftright"}],actions:pt.map(o=>({name:`${le}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[e]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,U.writeFileSync)((0,$.join)(t,"bindings_knuckles.json"),JSON.stringify(pi("knuckles",r),null,4),"utf8"),(0,U.writeFileSync)((0,$.join)(t,"bindings_oculus_touch.json"),JSON.stringify(pi("oculus_touch",r),null,4),"utf8");let i=(0,$.join)(t,"actions.json");return(0,U.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function gi(t){let e={source:"builtin",applications:[{app_key:Bt,launch_type:"binary",binary_path_windows:t,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,$.join)(Mn(),"clipper.vrmanifest");return(0,U.writeFileSync)(n,JSON.stringify(e,null,4),"utf8"),n}function Rn(){return(0,$.join)(Mn(),"bridge.ps1")}var Va=15e3,Fa=45e3,vi=3,Na=3,$a=2e3,V=null,mt=!1,ee="",L="",Se="",xe=!1,Dn=0,Si=0,Ue=null,ht=[],ft=null,ce=[],Ht=Promise.resolve();function yi(t){let e=ce.shift();if(e){e(t);return}if(t.kind==="motion"){ft=t;return}ht.push(t.action),ht.length>8&&ht.shift()}function Ua(t){let e=t.trim();if(!e.startsWith("{"))return!1;let n;try{n=JSON.parse(e)}catch{return!1}if(n.t==="ready")return ee=String(n.runtime??""),L="",Se="",xe=!1,!0;if(n.t==="waiting")return ee="",L="",Se=String(n.reason??""),!0;if(n.t==="warning")return L=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return L=String(n.message??"The SteamVR bridge failed for a reason it did not give"),xe=!ee||++Si>=Na,!0;if(n.t==="action"){let r=pt.find(i=>i===n.name);return r&&yi({kind:"action",action:r}),!1}return n.t==="motion"&&yi({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function _n(){Ue||!mt||xe||(Ue=setTimeout(()=>{Ue=null,mt&&xi()},Va))}function xi(){if(V)return Promise.resolve();let t=fi();if(!t)return _n(),Promise.resolve();let e;try{let n=Rn();(0,On.writeFileSync)(n,di,"utf8");let r=(0,gt.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");e=(0,wi.spawn)(r,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",t,"-Actions",mi(),"-Manifest",gi(r),"-AppKey",Bt,"-ActionList",[le,...pt].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return L=`The SteamVR bridge could not be started (${n.message}).`,_n(),Promise.resolve()}return V=e,ee="",Se="",xe=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{L="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},Fa),a="";e.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let h of l)Ua(h)&&i()}),e.stderr?.on("data",s=>{L||(L=s.toString("utf8").trim().slice(0,300))}),e.on("error",s=>{L=`The SteamVR bridge could not be started (${s.message}).`,i()}),e.on("exit",()=>{V===e&&(!ee&&!Se&&!xe?++Dn>=vi&&(xe=!0,L||(L=`The SteamVR bridge stopped ${vi} times without saying why. Switch the VR controls off and on again to try it once more.`)):Dn=0,V=null,ee="",Se="");let s=ce;ce=[];for(let l of s)l(null);i(),_n()})})}function Ei(){Ue&&(clearTimeout(Ue),Ue=null);let t=V;V=null,ee="",Se="",xe=!1,Dn=0,Si=0,ht=[],ft=null;let e=ce;ce=[];for(let r of e)r(null);if(!t)return;try{t.stdin?.end()}catch{}let n=setTimeout(()=>{try{t.kill()}catch{}},$a);t.on("exit",()=>clearTimeout(n))}function Ti(t){let e=Ht.then(async()=>(mt=t,t?(await xi(),jt()):(Ei(),L="",jt())));return Ht=e.catch(()=>{}),e}function Ln(){let t=Ht.then(()=>{mt=!1,Ei()});return Ht=t.catch(()=>{}),t}function jt(){return{running:V!==null&&ee!=="",wanted:mt,runtime:ee,problem:L,waiting:Se}}function ki(){if(!V?.stdin?.writable)return!1;try{return V.stdin.write(`bindings
`),!0}catch{return!1}}var Ga=0;function Ii(t,e,n,r){if(!V?.stdin?.writable||e<=0||n<=0||t.length!==e*n*4)return!1;let i=(0,gt.join)((0,gt.dirname)(Rn()),`panel-${Ga++%8}.rgba`);try{return(0,On.writeFileSync)(i,t),V.stdin.write(`panel ${e} ${n} ${Math.round(r)} ${i}
`),!0}catch{return!1}}function Pi(){if(!V?.stdin?.writable)return!1;try{return V.stdin.write(`panelhide
`),!0}catch{return!1}}function Ai(t=3e4){let e=ht.shift();if(e)return Promise.resolve({kind:"action",action:e});if(ft){let n=ft;return ft=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{ce=ce.filter(a=>a!==i),i(null)},t);ce.push(i)})}bi.app.on("will-quit",()=>{Ln()});var Ri=!0,Gn=!1,Vn=500*1024*1024,_i=/vesktop|equibop/i.test(y.app.getName());function x(t){let e=t?.trim(),n=e&&(0,p.isAbsolute)(e)?e:(0,p.join)(y.app.getPath("videos"),"DiscordClips"),r=n.toLowerCase().replace(/[\\/]+$/,"");for(let i of za()){let o=i.toLowerCase().replace(/[\\/]+$/,"");if(r===o||r.startsWith(`${o}\\`)||r.startsWith(`${o}/`))throw new Error("That folder is not a place for clips")}return n}function za(){let t=[];for(let e of["SystemRoot","windir","ProgramFiles","ProgramFiles(x86)","ProgramW6432"]){let n=process.env[e]?.trim();n&&t.push(n)}try{t.push(Bn())}catch{}return t}var Wa=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;function F(t){let n=(0,p.basename)(String(t??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${Wa.test(r[1])?`_${r[1]}`:r[1]}.${r[2].toLowerCase()}`:null}function Di(t){return F(t)??`clip-${Date.now()}.webm`}function St(t,e){let n=(0,p.extname)(e),r=e.slice(0,e.length-n.length),i=(0,p.join)(t,e),o=2;for(;(0,c.existsSync)(i)&&o<1e3;)i=(0,p.join)(t,`${r} (${o++})${n}`);if((0,c.existsSync)(i))throw new Error(`No free name left for ${e}; rename or clear the folder`);return i}var Ge=new Map;function Ba(t,e){let n=`${t}.tmp-${process.pid}-${Date.now()}`;(0,c.writeFileSync)(n,Buffer.from(e));try{(0,c.renameSync)(n,t)}catch(r){try{(0,c.unlinkSync)(n)}catch{}throw r}}function Ha(t,e,n,r,i=!1){if(r.length>Vn)throw new Error("That clip is too large to write");let o=x(e);(0,c.mkdirSync)(o,{recursive:!0});let a=Di(n),s=(0,p.join)(o,a),l=(Ge.get(s)??Promise.resolve()).catch(()=>{}).then(async()=>{let h=i?St(o,a):(0,p.join)(o,a);return Ba(h,r),h});return l.then(()=>{Ge.get(s)===l&&Ge.delete(s)},()=>{Ge.get(s)===l&&Ge.delete(s)}),Ge.set(s,l),l}var vt=new Set;function ja(t,e,n){let r=x(e);(0,c.mkdirSync)(r,{recursive:!0});let i=St(r,Di(n));if(!vt.has(i))return vt.add(i),i;let o=(0,p.extname)(i),a=i.slice(0,i.length-o.length),s=1,l=`${a}-${s}${o}`;for(;vt.has(l)||(0,c.existsSync)(l);)l=`${a}-${++s}${o}`;return vt.add(l),l}function Ka(t,e){vt.delete(e)}var xt="voices";function Za(t,e){let n=F(t);return!n||!/^\d{1,25}$/.test(String(e??""))?null:`${n.slice(0,n.length-(0,p.extname)(n).length)}.${e}.webm`}function qa(t,e){let n=F(e);if(!n)return[];let r=(0,p.join)(x(t),xt);if(!(0,c.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,p.extname)(n).length)}.`,o=[];for(let a of(0,c.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function Ya(t,e,n,r,i){let o=Za(n,r);if(!o)return null;let a=(0,p.join)(x(e),xt);(0,c.mkdirSync)(a,{recursive:!0});let s=(0,p.join)(a,o);return(0,c.writeFileSync)(s,Buffer.from(i)),s}function Ja(t,e,n){let r=(0,p.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");return new Uint8Array((0,c.readFileSync)((0,p.join)(x(e),xt,r)))}function Xa(t,e){let n=(0,p.join)(x(t),xt);for(let{file:r}of qa(t,e))try{(0,c.unlinkSync)((0,p.join)(n,r))}catch{}}function Qa(t,e){let n=x(e);if(!(0,c.existsSync)(n))return[];try{Vi(n)}catch{}let r=[],i=new Set,o=(0,c.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,p.join)(n,a.name);try{let l=(0,c.statSync)(s),h=j(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(h)?{thumb:h}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function es(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");let i=(0,p.join)(x(e),r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>Vn)throw new Error("That clip is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>Vn)throw new Error("That clip is too large to open");return s}finally{(0,c.closeSync)(o)}}var Ci=200*1024*1024,ts="https://catbox.moe/user/api.php",ns=1024*1024;function rs(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");if(!/\.(webm|mp4)$/i.test(r))throw new Error("Only video clips can be shared as a link");let i=(0,p.join)(x(e),r),o=(0,c.openSync)(i,"r"),a;try{let{size:d}=(0,c.fstatSync)(o);if(d>Ci)throw new Error("That clip is over 200MB - shorten it in the studio first");if(a=(0,c.readFileSync)(o),a.length>Ci)throw new Error("That clip is over 200MB - shorten it in the studio first")}finally{(0,c.closeSync)(o)}let s=`clipper-${Date.now().toString(16)}-${Math.floor(Math.random()*4294967295).toString(16)}`,l=r.toLowerCase().endsWith(".mp4")?"video/mp4":"video/webm",h=Buffer.from(`--${s}\r
Content-Disposition: form-data; name="reqtype"\r
\r
fileupload\r
--${s}\r
Content-Disposition: form-data; name="fileToUpload"; filename="${r}"\r
Content-Type: ${l}\r
\r
`,"utf8"),f=Buffer.from(`\r
--${s}--\r
`,"utf8");return new Promise((d,m)=>{let S=(0,qt.request)(ts,{method:"POST",headers:{"User-Agent":Ui,"Content-Type":`multipart/form-data; boundary=${s}`,"Content-Length":h.length+a.length+f.length}},T=>{let _=[],C=0;T.on("data",k=>{if(C+=k.length,C>ns){T.destroy(new Error("The host answered with more than a link"));return}_.push(k)}),T.on("end",()=>{let k=Buffer.concat(_).toString("utf8").trim();(T.statusCode??0)!==200?m(new Error(`The host answered ${T.statusCode??"?"} - try again later`)):/^https:\/\//.test(k)?d(k):m(new Error("The host did not return a link - try again later"))}),T.on("error",m)});S.setTimeout(3e5,()=>S.destroy(new Error("The upload timed out - try again on a faster connection"))),S.on("error",m),S.write(h),S.write(a),S.end(f)})}var is=".trash",Oi=".trash.json",os=168*3600*1e3;function Et(t){return(0,p.join)(t,is)}function Tt(t){let e;try{e=JSON.parse((0,c.readFileSync)((0,p.join)(t,Oi),"utf8"))}catch{return{}}if(!e||typeof e!="object")return{};let n={};for(let[r,i]of Object.entries(e))/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.test(r)&&(!i||typeof i!="object"||i.stored!==r||(n[r]=i));return n}function wt(t,e){(0,c.mkdirSync)(t,{recursive:!0}),(0,c.writeFileSync)((0,p.join)(t,Oi),JSON.stringify(e))}function Li(t,e){if(!e)return;let n=(0,p.join)(t,xt),r;try{r=(0,c.readdirSync)(n)}catch{return}for(let i of r)if(i.startsWith(`${e}.`)&&i.toLowerCase().endsWith(".webm"))try{(0,c.unlinkSync)((0,p.join)(n,i))}catch{}}function Vi(t){let e=Et(t);if(!(0,c.existsSync)(e))return;let n=Tt(e),r=Date.now(),i=!1;for(let[o,a]of Object.entries(n))if(!(!a||r-(a.deletedAt??0)<os)){for(let s of[o,j(o)])try{(0,c.unlinkSync)((0,p.join)(e,s))}catch{}Li(t,(a.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,"")),delete n[o],i=!0}i&&wt(e,n)}function as(t,e,n,r){let i=F(n);if(!i)throw new Error("That is not a clip name");if(r!==null&&(typeof r!="string"||r.length>1024*1024))throw new Error("That metadata is not metadata");let o=x(e),a=(0,p.join)(o,i);if(!(0,c.existsSync)(a))throw new Error("That clip is already gone");let s=Et(o);(0,c.mkdirSync)(s,{recursive:!0});let l=St(s,i).split(/[\\/]/).pop()||i;(0,c.renameSync)(a,(0,p.join)(s,l));let h=j(i);if((0,c.existsSync)((0,p.join)(o,h)))try{(0,c.renameSync)((0,p.join)(o,h),(0,p.join)(s,j(l)))}catch{}let f=Tt(s);f[l]={stored:l,name:i,deletedAt:Date.now(),meta:r},wt(s,f)}function ss(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");let i=x(e),o=Et(i),a=Tt(o),s=a[r];if(!s||!(0,c.existsSync)((0,p.join)(o,r)))throw delete a[r],wt(o,a),new Error("That clip is no longer in the trash");let l=St(i,s.name).split(/[\\/]/).pop()||s.name;(0,c.renameSync)((0,p.join)(o,r),(0,p.join)(i,l));let h=j(r);if((0,c.existsSync)((0,p.join)(o,h)))try{(0,c.renameSync)((0,p.join)(o,h),(0,p.join)(i,j(l)))}catch{}return delete a[r],wt(o,a),{name:l,meta:s.meta??null}}function ls(t,e){let n=x(e);Vi(n);let r=Et(n),i=Tt(r),o=[];for(let[a,s]of Object.entries(i)){if(!s)continue;let l=0;try{l=(0,c.statSync)((0,p.join)(r,a)).size}catch{delete i[a];continue}let h="";try{let f=s.meta?JSON.parse(s.meta):null;f&&typeof f.game=="string"&&(h=f.game)}catch{}o.push({stored:a,name:s.name??a,size:l,deletedAt:s.deletedAt??0,game:h})}return o.sort((a,s)=>a.deletedAt-s.deletedAt)}function cs(t,e){let n=x(e),r=Et(n);if((0,c.existsSync)(r)){for(let[i,o]of Object.entries(Tt(r))){for(let a of[i,j(i)])try{(0,c.unlinkSync)((0,p.join)(r,a))}catch{}o&&Li(n,(o.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,""))}wt(r,{})}}var Fi=32*1024*1024;function us(){let t=(0,p.join)((0,Zt.tmpdir)(),`clipper-spill-${process.pid}`);return(0,c.mkdirSync)(t,{recursive:!0}),t}function zn(t){if(!/^spill-\d+-[a-z0-9]+$/i.test(t))throw new Error("That is not a spill file");return(0,p.join)(us(),`${t}.frag`)}function ds(t,e,n){if(n.length>Fi)throw new Error("That spill chunk is too large");(0,c.writeFileSync)(zn(e),Buffer.from(n))}function ps(t,e){let n=zn(e),r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>Fi)throw new Error("That spill chunk is too large");return new Uint8Array((0,c.readFileSync)(r))}finally{(0,c.closeSync)(r)}}function hs(t,e){for(let n of e)try{(0,c.unlinkSync)(zn(n))}catch{}}function fs(){let t=`clipper-spill-${process.pid}`,e;try{e=(0,c.readdirSync)((0,Zt.tmpdir)())}catch{return}for(let n of e){if(!n.startsWith("clipper-spill-"))continue;let r=(0,p.join)((0,Zt.tmpdir)(),n);if(n!==t){let i=0;try{i=Date.now()-(0,c.statSync)(r).mtimeMs}catch{continue}if(i<24*3600*1e3)continue}try{(0,c.rmSync)(r,{recursive:!0,force:!0})}catch{}}}async function ms(t,e,n){let r=x(e),i=F(n);if(!i)throw new Error("That is not a clip name");let o=(0,p.join)(r,i);try{await y.shell.trashItem(o)}catch{(0,c.unlinkSync)(o)}Xa(e,i);let a=(0,p.join)(r,j(i));if((0,c.existsSync)(a))try{await y.shell.trashItem(a)}catch{try{(0,c.unlinkSync)(a)}catch{}}}function gs(t,e,n,r){let i=x(e),o=F(n);if(!o)throw new Error("That is not a clip name");let a=(0,p.join)(i,o),s=(0,p.extname)(o),l=F(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let f=l.toLowerCase()===o.toLowerCase()?(0,p.join)(i,l):St(i,l);(0,c.renameSync)(a,f);let d=(0,p.join)(i,j(o));if((0,c.existsSync)(d))try{(0,c.renameSync)(d,(0,p.join)(i,j((0,p.basename)(f))))}catch{}return(0,p.basename)(f)}var Ni="clipper-library.json";function vs(t,e){let n=(0,p.join)(x(e),Ni);if(!(0,c.existsSync)(n))return"";try{return(0,c.readFileSync)(n,"utf8")}catch{return""}}function ys(t,e,n){let r=x(e);(0,c.mkdirSync)(r,{recursive:!0});let i=(0,p.join)(r,Ni),o=`${i}.tmp`;(0,c.writeFileSync)(o,String(n??""),"utf8"),(0,c.renameSync)(o,i)}async function ws(t){let e=await y.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return e.canceled?[]:e.filePaths}var bs=512*1024*1024;function Ss(t,e){if(!(0,p.isAbsolute)(e)||!/\.(mp4|webm|mkv|mov|m4v)$/i.test(e))throw new Error("Not a video file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>bs){let i=Math.round(r/1048576);throw new Error(`That video is ${i} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function xs(t){let e=await y.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return e.canceled?[]:e.filePaths}var Es=64*1024*1024;function Ts(t,e){if(!(0,p.isAbsolute)(e)||!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(e))throw new Error("Not an audio file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>Es){let i=Math.round(r/1048576);throw new Error(`That sound is ${i} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function ks(t){let e=await y.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return e.canceled?[]:e.filePaths}var Is=24*1024*1024,Ps=64*1024*1024;function As(t,e){if(!(0,p.isAbsolute)(e)||!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(e))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(e),r=n?Ps:Is,i=(0,c.openSync)(e,"r");try{let{size:o}=(0,c.fstatSync)(i);if(o>r){let a=Math.round(o/1048576),s=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${a} MB; the montage caps them at ${s} MB.`)}return new Uint8Array((0,c.readFileSync)(i))}finally{(0,c.closeSync)(i)}}function Cs(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");y.shell.showItemInFolder((0,p.join)(x(e),r))}function Ms(t,e){return x(e)}async function Rs(t,e){let n=await y.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:x(e),properties:["openDirectory","createDirectory"]});return n.canceled?"":n.filePaths[0]??""}function _s(t,e){let n=x(e);(0,c.mkdirSync)(n,{recursive:!0}),y.shell.openPath(n)}function Ds(t){return{platform:"win32",wayland:Gn,vesktop:_i,overlay:Wt()}}var ue=new Set;async function Os(t,e=!0){if(Gn)return[];let n=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:e?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(ue.size){let i=new Set(n.map(o=>o.id));for(let o of ue)i.has(o)||ue.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!e){if(!o&&ue.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if(Ri&&!o&&a){ue.add(i.id);continue}ue.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function Ls(t){try{return y.app.getAppMetrics().map(e=>({type:e.serviceName||e.type,mb:Math.round((e.memory?.workingSetSize??0)/1024)})).filter(e=>e.mb>0).sort((e,n)=>n.mb-e.mb)}catch{return[]}}async function Vs(t){if(Gn)return"";let e=await y.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!e.length)return"";try{let n=y.screen.getDisplayNearestPoint(y.screen.getCursorScreenPoint()),r=e.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return e[0].id}var Fn="",Nn=!1;function Fs(t,e,n=!0){return!n||_i?!1:(Fn=e??"",Nn=!0,y.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(h=>h.id===Fn),l=(a&&!ue.has(a.id)?a:void 0)??o.find(h=>h.id.startsWith("screen:"))??o.find(h=>!ue.has(h.id));if(!l){i({});return}i(Ri&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function Ns(t){Fn="",Nn&&(Nn=!1,y.session.defaultSession.setDisplayMediaRequestHandler(null))}var $n=new Map,ze=[],yt=[];function $s(t){let e=ze.shift();if(e){e(t);return}yt.push(t),yt.length>8&&yt.shift()}function Us(t,e){Wn();let n=[];for(let[r,i]of Object.entries(e)){if(!i)continue;let o=!1;try{o=y.globalShortcut.register(i,()=>$s(r))}catch{o=!1}o?$n.set(r,i):n.push(i)}return n}function Wn(t){for(let n of $n.values())try{y.globalShortcut.unregister(n)}catch{}$n.clear(),yt=[];let e=ze;ze=[];for(let n of e)n(null)}function Gs(t,e=3e4){let n=yt.shift();return n?Promise.resolve(n):new Promise(r=>{let i=!1,o=s=>{i||(i=!0,clearTimeout(a),r(s))},a=setTimeout(()=>{ze=ze.filter(s=>s!==o),o(null)},e);ze.push(o)})}y.app.on("will-quit",()=>Wn());function zs(t,e){return Yr(e)}function Ws(t){return In()}function Bs(t){return $t()}function Hs(t,e=3e4){return Xr(e)}function js(t,e){return Ti(e)}function Ks(t){return Ln()}function Zs(t){return jt()}function qs(t){return ki()}function Ys(t,e,n,r,i){return Ii(new Uint8Array(e),n,r,i)}function Js(t){return Pi()}function Xs(t,e=3e4){return Ai(e)}y.app.on("will-quit",()=>{In()});var Qs=["top-left","top-right","bottom-left","bottom-right"];function We(t,e,n,r){let i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(e,Math.round(i))):r}function $i(t){return Qs.includes(t)?t:"bottom-right"}function el(t){return{corner:$i(t?.corner),width:We(t?.width,200,1280,420),volume:We(t?.volume,0,100,0),seconds:We(t?.seconds,0,300,10)}}function Un(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function tl(t,e,n,r){let i=F(n);if(!i)return!1;let o=(0,p.join)(x(e),i);return(0,c.existsSync)(o)?ri(o,el(r)):!1}function nl(t,e,n,r){return y.BrowserWindow.getFocusedWindow()||Cn()?!1:ii(Un(e,60),Un(n,90),$i(r))}function rl(t){be()}var il=200;function ol(t){return Array.isArray(t)?t.map(Number).filter(e=>Number.isFinite(e)&&e>=0).slice(0,il):[]}function al(t){return{width:We(t?.width,360,1600,720),volume:We(t?.volume,0,100,0)}}function sl(t,e,n,r,i){let o=F(n);if(!o)return!1;let a=(0,p.join)(x(e),o);return(0,c.existsSync)(a)?ui({name:o,path:a,markers:ol(r)},al(i)):!1}function ll(t){dt()}function cl(t){return Cn()}function ul(t,e=3e4){return si(We(e,1e3,12e4,3e4))}function dl(t){li()}function pl(t,e,n,r){ci({ok:!!e,message:Un(n,120),close:!!r})}function hl(t){let e=y.BrowserWindow.fromWebContents(t.sender);!e||e.isDestroyed()||(e.isMinimized()&&e.restore(),e.show(),e.focus())}var bt="kebab1337420/Clibab",Ui=`VencordClipper (+https://github.com/${bt})`,Kt=256*1024*1024;function Yt(t,e=0){return new Promise((n,r)=>{let i=(0,qt.get)(t,{headers:{"User-Agent":Ui,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),e>=5?r(new Error(`Too many redirects for ${t}`)):n(Yt(new URL(s,t).toString(),e+1));return}let l=[],h=0,{"content-length":f}=o.headers;if(f&&Number(f)>Kt){o.destroy(new Error(`${t} answered ${f} bytes, over the ${Kt} byte cap`));return}o.on("data",d=>{if(h+=d.length,h>Kt){o.destroy(new Error(`${t} exceeded the ${Kt} byte cap`));return}l.push(d)}),o.on("end",()=>n({status:a,body:Buffer.concat(l)})),o.on("error",r)});i.setTimeout(6e4,()=>i.destroy(new Error(`${t} timed out`))),i.on("error",r)})}async function fl(t){let{status:e,body:n}=await Yt(t);if(e!==200)throw new Error(`${t} answered ${e}`);return n}function Bn(){return __dirname}function Gi(t){return(0,c.existsSync)((0,p.join)(t,"patcher.js"))&&(0,c.existsSync)((0,p.join)(t,"renderer.js"))}function zi(t){try{return(0,c.accessSync)(t,c.constants.W_OK),!0}catch{return!1}}function Wi(t,e){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(t),i=n(e);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function ml(t,e){let n=await fl(`https://api.github.com/repos/${bt}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=Bn();return{version:o,tag:i,available:!!o&&Wi(o,e),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${bt}/releases`),directory:a,writable:Gi(a)&&zi(a)}}async function gl(t){let{status:e,body:n}=await Yt(`https://raw.githubusercontent.com/${bt}/${t}/prebuilt/build-info.json`);if(e===404)return null;if(e!==200)throw new Error(`The release's file list answered ${e}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return r}async function vl(t,e,n){if(!/^[\w.-]{1,40}$/.test(e))throw new Error(`Refusing to fetch a release named ${e}`);if(!Wi(e.replace(/^v/i,""),String(n??"")))throw new Error(`Refusing to install ${e}: it is not newer than the installed bundle`);let r=Bn();if(!Gi(r))throw new Error(`No installed bundle at ${r}`);if(!zi(r))throw new Error(`${r} is read-only`);let i=await gl(e);if(!i)throw new Error(`The release under ${e} carries no file list; refusing to install it unchecked`);let o=Object.keys(i),a=(0,p.join)(r,".clipper-update");(0,c.rmSync)(a,{recursive:!0,force:!0}),(0,c.mkdirSync)(a,{recursive:!0});try{let s=[];for(let d of o){if(d!==(0,p.basename)(d)||d.startsWith("."))throw new Error(`Refusing a release file named ${d}`);let{status:m,body:S}=await Yt(`https://raw.githubusercontent.com/${bt}/${e}/prebuilt/dist/${d}`);if(m!==200)throw new Error(`${d} answered ${m}`);if(S.length===0)throw new Error(`${d} came back empty`);let T=i[d];if(T?.size===void 0||!T?.sha256)throw new Error(`${d} has no size and hash in the release's file list`);if(S.length!==T.size)throw new Error(`${d} is ${S.length} bytes, the release says ${T.size}`);if((0,Mi.createHash)("sha256").update(S).digest("hex").toLowerCase()!==T.sha256.toLowerCase())throw new Error(`${d} does not match its hash`);(0,c.writeFileSync)((0,p.join)(a,d),S),s.push(d)}if(s.length===0)throw new Error(`There is no bundle published under ${e}`);for(let d of["renderer.js","patcher.js"])if(!s.includes(d))throw new Error(`The release carries no ${d}`);if(!(0,c.readFileSync)((0,p.join)(a,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let l=(0,p.join)(a,".previous");(0,c.mkdirSync)(l,{recursive:!0});let h=[],f=[];try{for(let d of s){let m=(0,p.join)(r,d);(0,c.existsSync)(m)&&((0,c.renameSync)(m,(0,p.join)(l,d)),h.push(d)),(0,c.renameSync)((0,p.join)(a,d),m),f.push(d)}}catch(d){for(let m of f)try{(0,c.unlinkSync)((0,p.join)(r,m))}catch{}for(let m of h)try{(0,c.renameSync)((0,p.join)(l,m),(0,p.join)(r,m))}catch{}throw new Error(`The update could not be put in place (${d.message}). The bundle that was there has been put back.`)}return s}finally{(0,c.rmSync)(a,{recursive:!0,force:!0})}}function yl(t){y.app.relaunch(),y.app.quit(),setTimeout(()=>y.app.exit(0),3e3)}var Bi={AppleMusicRichPresence:hn,ConsoleShortcuts:fn,FixSpotifyEmbeds:Or,FixYoutubeEmbeds:Vr,OpenInApp:bn,Translate:Sn,VoiceMessages:xn,XSOverlay:En,YoutubeAdblock:zr,Clipper:Hn};var Hi={};for(let[t,e]of Object.entries(Bi)){let n=Object.entries(e);if(!n.length)continue;let r=Hi[t]={};for(let[i,o]of n){let a=`VencordPluginNative_${t}_${i}`;jn.ipcMain.handle(a,o),r[i]=a}}jn.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=Hi});u();function Kn(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}Me();var b=require("electron");u();var ji="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var Ee=require("fs"),pe=require("fs/promises"),no=require("os"),Qn=require("path");u();Me();var Be=require("electron");u();var Zn=require("electron"),K=["connect-src"],G=[...K,"img-src"],qi=["style-src","font-src"],Ki=[...G,"media-src"],I=[...G,...qi],Zi=[...I,"script-src","worker-src"],Yn={"http://localhost:*":I,"http://127.0.0.1:*":I,"localhost:*":I,"127.0.0.1:*":I,"*.github.io":I,"github.com":I,"raw.githubusercontent.com":I,"*.gitlab.io":I,"gitlab.com":I,"*.codeberg.page":I,"codeberg.org":I,"*.githack.com":I,"jsdelivr.net":I,"fonts.googleapis.com":qi,"i.imgur.com":G,"i.ibb.co":G,"i.pinimg.com":G,"files.catbox.moe":I,"cdn.discordapp.com":I,"media.discordapp.net":G,"cdnjs.cloudflare.com":Zi,"cdn.jsdelivr.net":Zi,"api.github.com":K,"ws.audioscrobbler.com":K,"musicbrainz.org":K,"*.listenbrainz.org":K,"coverartarchive.org":K,"archive.org":K,"*.archive.org":K,"translate-pa.googleapis.com":K,"*.vencord.dev":G,"manti.vendicated.dev":G,"decor.fieryflames.dev":K,"ugc.decor.fieryflames.dev":G,"sponsor.ajay.app":K,"dearrow-thumb.ajay.app":G,"usrbg.is-hardly.online":G,"icons.duckduckgo.com":G,"*.tenor.com":Ki,"*.tenor.co":Ki},qn=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),wl=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},bl=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),Sl=t=>{let e=qn(t,"content-security-policy-report-only");e&&delete t[e];let n=qn(t,"content-security-policy");if(n){let r=wl(t[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(Z.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(Yn))for(let s of a)i(s,o);t[n]=[bl(r)]}};function Yi(){Zn.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&Sl(t),e==="stylesheet")){let r=qn(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),Zn.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function Ji(){Be.ipcMain.handle("VencordCspRemoveOverride",kl),Be.ipcMain.handle("VencordCspRequestAddOverride",Tl),Be.ipcMain.handle("VencordCspIsDomainAllowed",Il)}function xl(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!I.includes(n)))}function El(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Vesktop for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let a=e.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function Tl(t,e,n,r){if(!xl(e,n))return"invalid";let i=new URL(e).host;if(i in Z.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await Be.dialog.showMessageBox({...El(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(Z.store.customCspRules[i]=n,"ok"):"unchecked"}function kl(t,e){return e in Z.store.customCspRules?(delete Z.store.customCspRules[e],!0):!1}function Il(t,e,n){try{let r=new URL(e).host,i=Yn[r]??Z.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}u();var Pl=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,Al=/^\\@/;function Jn(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function Xi(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function Qi(t,e){if(!t)return Jn(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return Jn(e);let r={},i="",o="";for(let a of n.split(Pl))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace(Al,"@");return r[i]=o.trim(),delete r[""],Jn(e,r)}u();var He=require("path");function de(t,e){let n=(0,He.normalize)(t+"/"),r=(0,He.join)(t,e),i=(0,He.normalize)(r);return i===(0,He.normalize)(t)||i.startsWith(n)?i:null}u();var eo=require("electron");function to(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":eo.shell.openExternal(e)}return{action:"deny"}})}var Cl=(0,Qn.join)(__dirname,"vencordDesktopRenderer.css");(0,Ee.mkdirSync)(oe,{recursive:!0});Ji();function ro(){return(0,pe.readFile)(_e,"utf-8").catch(()=>"")}async function Ml(){let t=await(0,pe.readdir)(oe).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await io(n).then(Xi).catch(()=>null);r!=null&&e.push(Qi(r,n))}return e}function io(t){t=t.replace(/\?v=\d+$/,"");let e=de(oe,t);return e?(0,pe.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}b.ipcMain.handle("VencordOpenQuickCss",()=>b.shell.openPath(_e));b.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!Mr.includes(n))throw"Disallowed protocol.";b.shell.openExternal(e).catch(r=>console.error("[Vencord] Failed to open external link",e,r))});b.ipcMain.handle("VencordGetQuickCss",()=>ro());b.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,Ee.writeFileSync)(_e,e));b.ipcMain.handle("VencordGetThemesList",()=>Ml());b.ipcMain.handle("VencordGetThemeData",(t,e)=>io(e));b.ipcMain.handle("VencordGetThemeSystemValues",()=>{let t=b.systemPreferences.getAccentColor?.()??"";return t.length&&t[0]!=="#"&&(t=`#${t}`),{"os-accent-color":t}});b.ipcMain.handle("VencordOpenThemesFolder",()=>b.shell.openPath(oe));b.ipcMain.handle("VencordOpenSettingsFolder",()=>b.shell.openPath(me));var Xn=[];b.ipcMain.handle("VencordInitFileWatchers",({sender:t})=>{Xn.forEach(i=>i.close());let e,n;(0,pe.open)(_e,"a+").then(i=>{i.close(),e=(0,Ee.watch)(_e,{persistent:!1},Kn(async()=>{t.postMessage("VencordQuickCssUpdate",await ro())},50))}).catch(()=>{});let r=(0,Ee.watch)(oe,{persistent:!1},Kn(()=>{t.postMessage("VencordThemeUpdate",void 0)}));Xn=[e,r,n].filter(Boolean),t.once("destroyed",()=>{e?.close(),r.close(),n?.close(),Xn=[]})});b.ipcMain.on("VencordGetMonacoTheme",t=>{t.returnValue=b.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});b.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=b.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new b.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:b.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,Qn.join)(__dirname,"vencordDesktopPreload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});to(n),await n.loadURL(`data:text/html;base64,${ji}`)});b.ipcMain.handle("VencordGetRendererCss",()=>(0,pe.readFile)(Cl,"utf-8"));b.ipcMain.on("VencordSupportsWindowsMaterial",t=>{t.returnValue=Number((0,no.release)().split(".")[2])>=22621});var ke=require("electron"),Po=require("path"),lr=require("url");u();var rn=require("electron");u();var so=require("module"),Rl=(0,so.createRequire)("/"),je,Xt,tr,_l=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{je=Rl("worker_threads"),Xt=je.Worker,tr=je.isMarkedAsUntransferable}catch{}var Dl=Xt?function(t,e,n,r,i){var o=!1,a=new Xt(t+_l,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return tr&&(r=r.filter(function(s){return!tr(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,Xt.prototype.terminate.call(a)},a}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},R=Uint8Array,Te=Uint16Array,lo=Int32Array,rr=new R([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),ir=new R([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),co=new R([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),uo=function(t,e){for(var n=new Te(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new lo(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},je=uo(rr,2),or=je.b,Ol=je.r;or[28]=258,Ol[258]=28;var po=uo(ir,0),ho=po.b,ed=po.r,tn=new Te(32768);for(w=0;w<32768;++w)te=(w&43690)>>1|(w&21845)<<1,te=(te&52428)>>2|(te&13107)<<2,te=(te&61680)>>4|(te&3855)<<4,tn[w]=((te&65280)>>8|(te&255)<<8)>>1;var te,w,Ke=(function(t,e,n){for(var r=t.length,i=0,o=new Te(e);i<r;++i)t[i]&&++o[t[i]-1];var a=new Te(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new Te(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var h=i<<4|t[i],f=e-t[i],d=a[t[i]-1]++<<f,m=d|(1<<f)-1;d<=m;++d)s[tn[d]>>l]=h}else for(s=new Te(r),i=0;i<r;++i)t[i]&&(s[i]=tn[a[t[i]-1]++]>>15-t[i]);return s}),kt=new R(288);for(w=0;w<144;++w)kt[w]=8;var w;for(w=144;w<256;++w)kt[w]=9;var w;for(w=256;w<280;++w)kt[w]=7;var w;for(w=280;w<288;++w)kt[w]=8;var w,fo=new R(32);for(w=0;w<32;++w)fo[w]=5;var w;var mo=Ke(kt,9,1);var go=Ke(fo,5,1),Qt=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},z=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},en=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},vo=function(t){return(t+7)/8|0},nn=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new R(t.subarray(e,n))};var yo=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],A=function(t,e,n){var r=new Error(e||yo[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,A),!n)throw r;return r},wo=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new R(0);var a=!n,s=a||e.i!=2,l=e.i;a&&(n=new R(i*3));var h=function(fr){var mr=n.length;if(fr>mr){var gr=new R(Math.max(mr*2,fr));gr.set(n),n=gr}},f=e.f||0,d=e.p||0,m=e.b||0,S=e.l,T=e.d,_=e.m,C=e.n,k=i*8;do{if(!S){f=z(t,d,1);var ne=z(t,d+1,3);if(d+=3,ne)if(ne==1)S=mo,T=go,_=9,C=5;else if(ne==2){var Ze=z(t,d,31)+257,It=z(t,d+10,15)+4,he=Ze+z(t,d+5,31)+1;d+=14;for(var N=new R(he),Pe=new R(19),P=0;P<It;++P)Pe[co[P]]=z(t,d+P*3,7);d+=It*3;for(var qe=Qt(Pe),Ao=(1<<qe)-1,Co=Ke(Pe,qe,1),P=0;P<he;){var cr=Co[z(t,d,Ao)];d+=cr&15;var M=cr>>4;if(M<16)N[P++]=M;else{var Ae=0,Pt=0;for(M==16?(Pt=3+z(t,d,3),d+=2,Ae=N[P-1]):M==17?(Pt=3+z(t,d,7),d+=3):M==18&&(Pt=11+z(t,d,127),d+=7);Pt--;)N[P++]=Ae}}var ur=N.subarray(0,Ze),re=N.subarray(Ze);_=Qt(ur),C=Qt(re),S=Ke(ur,_,1),T=Ke(re,C,1)}else A(1);else{var M=vo(d)+4,Q=t[M-4]|t[M-3]<<8,Ie=M+Q;if(Ie>i){l&&A(0);break}s&&h(m+Q),n.set(t.subarray(M,Ie),m),e.b=m+=Q,e.p=d=Ie*8,e.f=f;continue}if(d>k){l&&A(0);break}}s&&h(m+131072);for(var Mo=(1<<_)-1,Ro=(1<<C)-1,on=d;;on=d){var Ae=S[en(t,d)&Mo],Ce=Ae>>4;if(d+=Ae&15,d>k){l&&A(0);break}if(Ae||A(2),Ce<256)n[m++]=Ce;else if(Ce==256){on=d,S=null;break}else{var dr=Ce-254;if(Ce>264){var P=Ce-257,Ye=rr[P];dr=z(t,d,(1<<Ye)-1)+or[P],d+=Ye}var an=T[en(t,d)&Ro],sn=an>>4;an||A(3),d+=an&15;var re=ho[sn];if(sn>3){var Ye=ir[sn];re+=en(t,d)&(1<<Ye)-1,d+=Ye}if(d>k){l&&A(0);break}s&&h(m+131072);var pr=m+dr;if(m<re){var hr=o-re,_o=Math.min(re,pr);for(hr+m<0&&A(3);m<_o;++m)n[m]=r[hr+m]}for(;m<pr;++m)n[m]=n[m-re]}}e.l=S,e.p=on,e.b=m,e.f=f,S&&(f=1,e.m=_,e.d=T,e.n=C)}while(!f);return m!=n.length&&a?nn(n,0,m):n.subarray(0,m)};var Ll=new R(0);var Vl=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},oo=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){e+=";"+l+"=";var h=s.toString();if(s.prototype)if(h.indexOf("[native code]")!=-1){var f=h.indexOf(" ",8)+1;e+=h.slice(f,h.indexOf("(",f))}else{e+=h;for(var d in s.prototype)e+=";"+l+".prototype."+d+"="+s.prototype[d].toString()}else e+=h}else n[l]=s}return e},Jt=[],Fl=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},Nl=function(t,e,n,r){if(!Jt[n]){for(var i="",o={},a=t.length-1,s=0;s<a;++s)i=oo(t[s],i,o);Jt[n]={c:oo(t[a],i,o),e:o}}var l=Vl({},Jt[n].e);return Dl(Jt[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,Fl(l),r)},$l=function(){return[R,Te,lo,rr,ir,co,or,ho,mo,go,tn,yo,Ke,Qt,z,en,vo,nn,A,wo,ar,bo,So]};var bo=function(t){return postMessage(t,[t.buffer])},So=function(t){return t&&{out:t.size&&new R(t.size),dictionary:t.dictionary}},Ul=function(t,e,n,r,i,o){var a=Nl(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([t,e],e.consume?[t.buffer]:[]),function(){a.terminate()}};var J=function(t,e){return t[e]|t[e+1]<<8},W=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},er=function(t,e){return W(t,e)+W(t,e+4)*4294967296};function Gl(t,e,n){return n||(n=e,e={}),typeof n!="function"&&A(7),Ul(t,e,[$l],function(r){return bo(ar(r.data[0],So(r.data[1])))},1,n)}function ar(t,e){return wo(t,{i:2},e&&e.out,e&&e.dictionary)}var nr=typeof TextDecoder<"u"&&new TextDecoder,zl=0;try{nr.decode(Ll,{stream:!0}),zl=1}catch{}var Wl=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:nn(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function Bl(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(nr)return nr.decode(t);var i=Wl(t),o=i.s,n=i.r;return n.length&&A(8),o}}var Hl=function(t,e){return e+30+J(t,e+26)+J(t,e+28)},jl=function(t,e,n){var r=J(t,e+28),i=J(t,e+30),o=Bl(t.subarray(e+46,e+46+r),!(J(t,e+8)&2048)),a=e+46+r,s=Kl(t,a,i,n,W(t,e+20),W(t,e+24),W(t,e+42)),l=s[0],h=s[1],f=s[2];return[J(t,e+10),l,h,o,a+i+J(t,e+32),f]},Kl=function(t,e,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,h=a==4294967295,f=e+n,d=s+l+h;if(r&&d){for(;e+4<f;e+=4+J(t,e+2))if(J(t,e)==1)return[s?er(t,e+4+8*l):i,l?er(t,e+4):o,h?er(t,e+4+8*(l+s)):a,1];r<2&&A(13)}return[i,o,a,0]};var ao=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function xo(t,e,n){n||(n=e,e={}),typeof n!="function"&&A(7);var r=[],i=function(){for(var C=0;C<r.length;++C)r[C]()},o={},a=function(C,k){ao(function(){n(C,k)})};ao(function(){a=n});for(var s=t.length-22;W(t,s)!=101010256;--s)if(!s||t.length-s>65558)return a(A(13,0,1),null),i;var l=J(t,s+8);if(l){var h=l,f=W(t,s+16),d=W(t,s-20)==117853008;if(d){var m=W(t,s-12);d=W(t,m)==101075792,d&&(h=l=W(t,m+32),f=W(t,m+48))}for(var S=e&&e.filter,T=function(C){var k=jl(t,f,d),ne=k[0],M=k[1],Q=k[2],Ie=k[3],Ze=k[4],It=k[5],he=Hl(t,It);f=Ze;var N=function(P,qe){P?(i(),a(P,null)):(qe&&(o[Ie]=qe),--l||a(null,o))};if(!S||S({name:Ie,size:M,originalSize:Q,compression:ne}))if(!ne)N(null,nn(t,he,he+M));else if(ne==8){var Pe=t.subarray(he,he+M);if(Q<524288||M>.8*Q)try{N(null,ar(Pe,{out:new R(Q)}))}catch(P){N(P,null)}else r.push(Gl(Pe,{size:Q},N))}else N(A(14,"unknown compression type "+ne,1),null);else N(null,null)},_=0;_<h;++_)T(_)}else a(null,{});return i}var ko=require("fs"),X=require("fs/promises"),sr=require("path");u();function Eo(t){function e(a,s,l,h){let f=0;return f+=a<<0,f+=s<<8,f+=l<<16,f+=h<<24>>>0,f}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let a=e(t[8],t[9],t[10],t[11]),s=e(t[12],t[13],t[14],t[15]),l=16+a+s;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}u();var Zl=require("original-fs");async function ql(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function To(t,e){let r=await(await ql(t,e)).arrayBuffer();return Buffer.from(r)}var Yl=(0,sr.join)(Mt,"ExtensionCache");async function Jl(t,e){return await(0,X.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{xo(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let d=de(e,a);if(!d)throw new Error(`Path traversal detected: "${a}"`);return void await(0,X.mkdir)(d,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),h=de(e,l);if(!h)throw new Error(`Path traversal detected: "${a}"`);let f=de(e,a);if(!f)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,X.mkdir)(h,{recursive:!0}),await(0,X.writeFile)(f,o[a])})).then(()=>n()).catch(a=>{(0,X.rm)(e,{recursive:!0,force:!0}),r(a)})})})}async function Io(t){let e=(0,sr.join)(Yl,t);try{await(0,X.access)(e,ko.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await To(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await Jl(Eo(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}rn.session.defaultSession.extensions?rn.session.defaultSession.extensions.loadExtension(e):rn.session.defaultSession.loadExtension(e)}ke.app.whenReady().then(()=>{ke.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=de(oe,n);return r?ke.net.fetch((0,lr.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return ke.net.fetch((0,lr.pathToFileURL)((0,Po.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{D.store.enableReactDevtools&&Io("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}Yi()});
//# sourceURL=file:///VencordDesktopMain
//# sourceMappingURL=vencord://vencordDesktopMain.js.map
/*! For license information please see vencordDesktopMain.js.LEGAL.txt */

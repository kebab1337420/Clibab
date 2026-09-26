// Vencord 59a5428
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var dn=Object.defineProperty;var Wo=Object.getOwnPropertyDescriptor;var Bo=Object.getOwnPropertyNames;var jo=Object.prototype.hasOwnProperty;var Rt=(t,e,n)=>()=>{if(n)throw n[0];try{return t&&(e=t(t=0)),e}catch(r){throw n=[r],r}};var ge=(t,e)=>{for(var n in e)dn(t,n,{get:e[n],enumerable:!0})},Ho=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Bo(e))!jo.call(t,i)&&i!==n&&dn(t,i,{get:()=>e[i],enumerable:!(r=Wo(e,i))||r.enumerable});return t};var Ko=t=>Ho(dn({},"__esModule",{value:!0}),t);var d=Rt(()=>{"use strict"});var Oe=Rt(()=>{"use strict";d()});function nt(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var Tr=Rt(()=>{"use strict";d()});var Xo={};function Le(...t){let e={cwd:Ar};return pn?hn("flatpak-spawn",["--host","git",...t],e):hn("git",t,e)}async function Zo(){return(await Le("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function qo(){await Le("fetch");let t=(await Le("branch","--show-current")).stdout.trim();if(!((await Le("ls-remote","origin",t)).stdout.length>0))return[];let r=(await Le("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function Yo(){return(await Le("pull")).stdout.includes("Fast-forward")}async function Jo(){return!(await hn(pn?"flatpak-spawn":"node",pn?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:Ar})).stderr.includes("Build failed")}var kr,rt,Ir,Pr,Ar,hn,pn,Cr=Rt(()=>{"use strict";d();Oe();kr=require("child_process"),rt=require("electron"),Ir=require("path"),Pr=require("util");Tr();Ar=(0,Ir.join)(__dirname,".."),hn=(0,Pr.promisify)(kr.execFile),pn=!1;rt.ipcMain.handle("VencordGetRepo",nt(Zo));rt.ipcMain.handle("VencordGetUpdates",nt(qo));rt.ipcMain.handle("VencordUpdate",nt(Yo));rt.ipcMain.handle("VencordBuild",nt(Jo))});d();d();d();Cr();d();Oe();var Qn=require("electron");d();var gn={};ge(gn,{fetchTrackData:()=>ea});d();d();d();var Mr="59a5428";d();var fn="Vendicated/Vencord";var Rr=`Vencord/${Mr}${fn?` (https://github.com/${fn})`:""}`;var _r=require("child_process"),Dr=require("util"),Or=(0,Dr.promisify)(_r.execFile);async function mn(t){let{stdout:e}=await Or("osascript",t.map(n=>["-e",n]).flat());return e}var B=null;async function Qo({id:t,name:e,artist:n,album:r}){if(t===B?.id){if("data"in B)return B.data;if("failures"in B&&B.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":Rr}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return B={id:t,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},B.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),B={id:t,failures:(t===B?.id&&"failures"in B?B.failures:0)+1},null}}async function ea(){try{await Or("pgrep",["^Music$"])}catch{return null}if(await mn(['tell application "Music"',"get player state","end tell"]).then(f=>f.trim())!=="playing")return null;let e=await mn(['tell application "Music"',"get player position","end tell"]).then(f=>Number.parseFloat(f.trim())),n=await mn(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(f=>!!f),l=Number.parseFloat(s),h=await Qo({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:e,duration:l,...h}}var vn={};ge(vn,{initDevtoolsOpenEagerLoad:()=>ta});d();function ta(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var Gr={};d();d();Oe();d();var yn=Symbol("SettingsStore.isProxy"),Lr=Symbol("SettingsStore.getRawTarget"),it=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===yn)return!0;if(r===Lr)return n;let o=Reflect.get(n,r,i),a=e.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[yn]){let h=`${l}${l&&"."}${r}`;return e.makeProxy(o,s,h)}return o},set(n,r,i){if(i?.[yn]&&(i=i[Lr]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return e.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return e.notifyListeners(s,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyPrefixListeners(e,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,e))}}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,h)=>l[h],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n)),this.notifyPrefixListeners(e,i,n)}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}addPrefixChangeListener(e,n){let r=this.prefixListeners.get(e)??new Set;r.add(n),this.prefixListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}removePrefixChangeListener(e,n){let r=this.prefixListeners.get(e);r&&(r.delete(n),r.size||this.prefixListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}};d();function wn(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},wn(t[n],r)):t[n]??=r}return t}var xn=require("electron"),ye=require("fs");d();var Vr=require("electron"),oe=require("path"),Dt=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,oe.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,oe.join)(Vr.app.getPath("userData"),"..","Vencord")),ve=(0,oe.join)(Dt,"settings"),ae=(0,oe.join)(Dt,"themes"),Ve=(0,oe.join)(ve,"quickCss.css"),bn=(0,oe.join)(ve,"settings.json"),Sn=(0,oe.join)(ve,"native-settings.json"),Fr=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"];(0,ye.mkdirSync)(ve,{recursive:!0});function Nr(t,e){try{return JSON.parse((0,ye.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var O=new it(Nr("renderer",bn));O.addGlobalChangeListener(()=>{try{(0,ye.writeFileSync)(bn,JSON.stringify(O.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});xn.ipcMain.on("VencordGetSettings",t=>t.returnValue=O.plain);xn.ipcMain.handle("VencordSetSettings",(t,e,n)=>{O.setData(e,n)});var na={plugins:{},customCspRules:{}},$r=Nr("native",Sn);wn($r,na);var Z=new it($r);Z.addGlobalChangeListener(()=>{try{(0,ye.writeFileSync)(Sn,JSON.stringify(Z.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}});var Lt=require("electron"),Ot=[];function Ur(){let t=[];for(let e=Ot.length-1;e>=0;e--){let{processId:n,routingId:r}=Ot[e],i=Lt.webFrameMain.fromId(n,r);if(!i){Ot.splice(e,1);continue}t.push(i)}return t}Lt.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){Ur();let{routingId:i,processId:o}=r;Ot.push({routingId:i,processId:o});let a=O.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});O.addChangeListener("plugins.FixSpotifyEmbeds.volume",t=>{try{Ur().forEach(e=>e.executeJavaScript(`globalThis._vcVolume = ${t/100}`))}catch(e){console.error("FixSpotifyEmbeds: Failed to update volume",e)}});var Wr={};d();var zr=require("electron");zr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!O.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var En={};ge(En,{resolveRedirect:()=>ia});d();var Br=require("https"),ra=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function jr(t){return new Promise((e,n)=>{let r=(0,Br.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?jr(i.headers.location):t)});r.on("error",n),r.end()})}async function ia(t,e){return ra.test(e)?jr(e):e}var Tn={};ge(Tn,{makeDeeplTranslateRequest:()=>oa,makeKagiTranslateRequest:()=>aa});d();async function oa(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function aa(t,e,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${e}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var kn={};ge(kn,{readRecording:()=>sa});d();var Hr=require("electron"),Vt=require("fs/promises"),ot=require("path");async function sa(t,e){e=(0,ot.normalize)(e);let n=(0,ot.basename)(e),r=(0,ot.normalize)(Hr.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!e.startsWith(r))return null;try{let i=await(0,Vt.readFile)(e);return(0,Vt.rm)(e).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var In={};ge(In,{closeSocket:()=>ca,sendToOverlay:()=>la});d();var Kr=require("dgram"),Ft=null;function la(t,e){e.messageType=e.type;let n=JSON.stringify(e);Ft??=(0,Kr.createSocket)("udp4"),Ft.send(n,42069,"127.0.0.1")}function ca(){Ft?.close(),Ft=null}var qr={};d();var Zr=require("electron");d();var Pn=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;Zr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{O.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(Pn):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(Pn))})})});var Xn={};ge(Xn,{answerOverlayAction:()=>wl,armDisplayMedia:()=>Bs,checkUpdate:()=>Tl,closeStudioOverlay:()=>ml,deleteClip:()=>Ss,disarmDisplayMedia:()=>js,downloadUpdate:()=>Il,dropOverlayWaiters:()=>yl,emptyTrash:()=>ms,focusClient:()=>bl,gameFeedStatus:()=>Js,getActiveScreen:()=>Ws,getCaptureSources:()=>Gs,getClipDirectory:()=>Fs,getMemoryReport:()=>zs,getPlatformInfo:()=>Us,hideClipOverlay:()=>ul,hideVrPanel:()=>il,listClips:()=>ls,listTrash:()=>fs,notifyClipSaved:()=>cl,openClipDirectory:()=>$s,openStudioOverlay:()=>fl,openVrBindings:()=>nl,pickAudioFiles:()=>Cs,pickClipDirectory:()=>Ns,pickImageFiles:()=>_s,pickVideoFiles:()=>Is,readAudioFile:()=>Rs,readClip:()=>cs,readImageFile:()=>Ls,readLibrary:()=>Es,readVideoFile:()=>As,readVoiceTrack:()=>as,registerShortcuts:()=>Ks,relaunchClient:()=>Al,releaseClipPath:()=>ns,renameClip:()=>xs,reserveClipPath:()=>ts,restoreClip:()=>ps,revealClip:()=>Vs,saveClip:()=>es,saveVoiceTrack:()=>os,showClipOverlay:()=>ll,showVrPanel:()=>rl,spillClear:()=>bs,spillDrop:()=>ws,spillRead:()=>ys,spillWrite:()=>vs,startGameFeeds:()=>qs,startVrBridge:()=>Qs,stopGameFeeds:()=>Ys,stopVrBridge:()=>el,studioOverlayUp:()=>gl,trashClip:()=>hs,unregisterShortcuts:()=>Yn,vrBridgeStatus:()=>tl,waitForGameEvent:()=>Xs,waitForOverlayAction:()=>vl,waitForShortcut:()=>Zs,waitForVrEvent:()=>ol,writeLibrary:()=>Ts});d();var Xt=require("crypto"),y=require("electron"),c=require("fs"),Ni=require("https"),Jt=require("os"),u=require("path");d();var j=require("fs"),Xr=require("http"),Qr=require("https"),ei=require("os"),dt=require("path"),Yr=34765,ua=6,ti=256*1024,da=2e3,ha=1500,pa="127.0.0.1",fa=2999,ma="gamestate_integration_clipper.cfg",se=null,Ne=0,$t="",$e=null,ct=[],ga=12,ut=[],Ue=[],Ge={cs2:!1,league:!1};function Ut(t){ct.length>=ga||ct.includes(t)||ct.push(t)}var Gt=Promise.resolve();function at(t){let e=Ue.shift();if(e){e(t);return}ut.push(t),ut.length>16&&ut.shift()}var E={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function ni(){E={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function va(t){return t>=5?"an ace in Counter-Strike 2":t===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function ya(t){let e=t.provider?.steamid,{player:n}=t;if(!n||!e||!n.steamid||n.steamid!==e)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof t.map?.round=="number"?t.map.round:E.round;(r.kills<E.kills||r.deaths<E.deaths)&&ni();let o=E.kills<0;i!==E.round&&(E.round=i,E.roundKills=0,E.announced=0);let a=r.kills-Math.max(0,E.kills),s=r.deaths-Math.max(0,E.deaths);if(E.kills=r.kills,E.deaths=r.deaths,o)return;a>0&&(E.roundKills+=a,E.roundKills>=3&&E.roundKills>E.announced?(E.announced=E.roundKills,at({kind:"multikill",note:va(E.roundKills)})):at({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&at({kind:"death",note:"your death in Counter-Strike 2"});let l=t.round?.win_team;l&&n.team&&l===n.team&&t.round?.phase==="over"&&E.roundKills>0&&at({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function wa(){return new Promise(t=>{let e=0,n=(0,Xr.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>ti&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{ya(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++e<ua){n.listen(Yr+e,"127.0.0.1");return}Ut(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}se===n&&(se=null,Ne=0,Ge={...Ge,cs2:!1}),t(0)}),n.on("listening",()=>{se=n,t(n.address().port)}),n.listen(Yr,"127.0.0.1")})}function ba(){let t=[],e=(0,ei.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&t.push((0,dt.join)(i,"Steam"))}let n=[];for(let r of t)if((0,j.existsSync)(r)){n.push(r);try{let i=(0,j.readFileSync)((0,dt.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function Sa(){for(let t of ba()){let e=(0,dt.join)(t,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,j.existsSync)(e))return e}return""}function xa(t){let e=Sa();if(!e)return Ut("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,dt.join)(e,ma),r=`"Clipper"
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
`;try{return(0,j.mkdirSync)(e,{recursive:!0}),(0,j.writeFileSync)(n,r,"utf8"),n}catch(i){return Ut(`Counter-Strike 2's config could not be written (${i.message})`),""}}function Ea(){let t=$t;if($t="",!!t)try{(0,j.unlinkSync)(t)}catch{}}var st="",Fe=-1,An=!1,Nt=!1;function lt(t){return t.split("#")[0].trim().toLowerCase()}function Jr(t){return new Promise(e=>{let n=(0,Qr.get)({host:pa,port:fa,path:t,rejectUnauthorized:!1,timeout:ha},r=>{if(r.statusCode!==200){r.resume(),e(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>ti&&n.destroy()}),r.on("end",()=>{try{e(JSON.parse(i))}catch{e(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>e(null))})}function Ta(t,e){let n=t.EventName??"",r=lt(t.KillerName??"");switch(n){case"ChampionKill":return r===e?{kind:"kill",note:"a kill in League of Legends"}:lt(t.VictimName??"")===e?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==e?null:{kind:"multikill",note:`a ${t.KillStreak??3}-kill run in League of Legends`};case"Ace":return lt(t.Acer??"")!==e?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return lt(t.Recipient??"")!==e?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==e?null:{kind:"objective",note:`${t.DragonType?`the ${t.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==e?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==e?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==e?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function ka(){if(!Nt){Nt=!0;try{if(!st){let r=await Jr("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;st=lt(r),Fe=-1}let t=await Jr("/liveclientdata/eventdata");if(!t?.Events){st="";return}let e=Fe<0,n=Fe;for(let r of t.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=Fe||(n=Math.max(n,i),e))continue;let o=Ta(r,st);o&&at(o)}Fe=n}finally{Nt=!1}}}function Ia(){st="",Fe=-1,Nt=!1,$e=setInterval(()=>{ka().catch(t=>{An||(An=!0,Ut(`League of Legends could not be read (${t.message})`))})},da)}function Pa(t){return t.cs2!==Ge.cs2||t.league!==Ge.league?!1:(!t.cs2||se!==null)&&(!t.league||$e!==null)}function ri(t){let e=Gt.then(async()=>(Pa(t)||(ii(),ct=[],t.cs2&&(ni(),Ne=await wa(),Ne&&($t=xa(Ne))),t.league&&Ia(),Ge={cs2:t.cs2&&se!==null,league:t.league}),zt()));return Gt=e.catch(()=>{}),e}function ii(){if(Ge={cs2:!1,league:!1},$e&&clearInterval($e),$e=null,An=!1,se)try{se.close()}catch{}se=null,Ne=0,Ea(),ut=[];let t=Ue;Ue=[];for(let e of t)e(null)}function Cn(){let t=Gt.then(()=>ii());return Gt=t.catch(()=>{}),t}function zt(){return{port:Ne,configPath:$t,league:$e!==null,problems:[...ct]}}function oi(t){let e=ut.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{Ue=Ue.filter(a=>a!==i),i(null)},t);Ue.push(i)})}d();var le=require("electron"),We=require("fs"),pt=require("path"),ai=require("url"),Wt=24,si=2600,Bt=220,Aa=300,Ca=56,Mn=!0;function jt(){return Mn}var Se=null,we=null,ht=null,be=null;function Ma(){return!!Se&&!Se.isDestroyed()}function xe(){we&&(clearTimeout(we),we=null);let t=Se;Se=null,t&&!t.isDestroyed()&&t.destroy()}function ze(){be&&(clearTimeout(be),be=null);let t=ht;ht=null,t&&!t.isDestroyed()&&t.destroy()}function Ra(t,e,n){let i=le.screen.getDisplayNearestPoint(le.screen.getCursorScreenPoint()).workArea,o=t==="top-left"||t==="bottom-left",a=t==="top-left"||t==="top-right";return{x:Math.round(o?i.x+Wt:i.x+i.width-e-Wt),y:Math.round(a?i.y+Wt:i.y+i.height-n-Wt)}}function ft(t,e){let n=(0,pt.join)(le.app.getPath("userData"),"clipper-overlay");(0,We.mkdirSync)(n,{recursive:!0});let r=(0,pt.join)(n,t);return(0,We.writeFileSync)(r,e,"utf8"),r}function li(t){return`${t}-${Date.now()}-${process.pid}.html`}function ci(t){try{(0,We.unlinkSync)(t)}catch{}}function ui(t,e,n,r){let{x:i,y:o}=Ra(r,e,n),a=new le.BrowserWindow({width:e,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(t).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function di(t){return`<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }
    .card {
        position: absolute; inset: 0; border-radius: 12px; overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 10px 34px rgba(0, 0, 0, 0.6);
        opacity: 0; transform: scale(0.96); transition: opacity ${Bt}ms ease, transform ${Bt}ms ease;
    }
    .card.up { opacity: 1; transform: none; }
    ${t}
</style>`}function q(t){return JSON.stringify(t).replace(/</g,"\\u003c")}function _a(t,e){return`<!doctype html>
<html>
<head>
${di(`.card { background: #000; }
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
    document.getElementById("tag").textContent = ${q((0,pt.basename)(t))};

    var leaving = false;
    function leave() {
        if (leaving) return;
        leaving = true;
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Bt});
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

    video.src = ${q((0,ai.pathToFileURL)(t).href)};

    // Autoplay with sound is only allowed after a gesture, and this window
    // never gets one. Muted playback is always allowed, so it is the fallback
    // rather than a reason to show nothing.
    video.play().catch(function () {
        video.muted = true;
        video.play().catch(leave);
    });
</script>
</body>
</html>`}function Da(t,e){return`<!doctype html>
<html>
<head>
${di(`.card {
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
        setTimeout(function () { window.close(); }, ${Bt});
    }, ${si});
</script>
</body>
</html>`}function hi(t,e){if(!Mn)return!1;xe(),ze();let n=Math.max(200,Math.round(e.width)),r=Math.round(n*9/16),i=ft(li("clip"),_a(t,e)),o=ui(i,n,r,e.corner);Se=o,o.on("closed",()=>{ci(i),Se===o&&(Se=null,we&&(clearTimeout(we),we=null))});let a=(e.seconds>0?e.seconds:300)+10;return we=setTimeout(()=>xe(),a*1e3),!0}function pi(t,e,n){if(!Mn||Ma())return!1;ze();let r=ft(li("toast"),Da(t,e)),i=ui(r,Aa,Ca,n);return ht=i,i.on("closed",()=>{ci(r),ht===i&&(ht=null,be&&(clearTimeout(be),be=null))}),be=setTimeout(()=>ze(),si+4e3),!0}le.app.on("will-quit",()=>{xe(),ze()});d();var Y=require("electron"),fi=require("url");var Rn="VencordClipperOverlayAction",mi="VencordClipperOverlayReply",Oa=108,L=null;function _n(){return!!L&&!L.isDestroyed()}function gt(){let t=L;L=null,t&&!t.isDestroyed()&&t.destroy()}var Be=[],mt=[];function La(t){let e=Be.shift();if(e){e(t);return}mt.push(t),mt.length>4&&mt.shift()}function gi(t){let e=mt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{Be=Be.filter(a=>a!==i),i(null)},t);Be.push(i)})}function vi(){mt=[];let t=Be;Be=[];for(let e of t)e(null)}function yi(t){!L||L.isDestroyed()||L.webContents.send(mi,t)}Y.ipcMain.removeAllListeners(Rn);Y.ipcMain.on(Rn,(t,e,n)=>{if(!L||L.isDestroyed()||t.sender!==L.webContents)return;let r=String(e??"");if(r==="close"){gt();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open"&&r!=="link")return;let i=n??{},o=Number(i.from),a=Number(i.to),s=String(i.clip??"");!s||s.length>128||La({kind:r,clip:s,from:Number.isFinite(o)?Math.min(3600,Math.max(0,o)):0,to:Number.isFinite(a)?Math.min(3600,Math.max(0,a)):0})});function Va(t,e){let{workArea:n}=Y.screen.getDisplayNearestPoint(Y.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-t)/2),y:Math.round(n.y+(n.height-e)/2)}}var Fa=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${q(Rn)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${q(mi)}, (_event, reply) => handler(reply));
    }
});
`;function Na(t,e){return`<!doctype html>
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
    var clip = ${q({name:t.name,url:(0,fi.pathToFileURL)(t.path).href,markers:t.markers})};
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
</html>`}function wi(t,e){if(!jt())return!1;gt(),xe(),ze();let n=Math.max(360,Math.round(e.width)),r=Math.round(n*9/16)+Oa,{x:i,y:o}=Va(n,r),a=ft("studio-preload.js",Fa),s=ft("studio.html",Na(t,e)),l=new Y.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return L=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{L===l&&(L=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}Y.app.on("will-quit",()=>gt());d();function H(t){return`${t.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}d();var Pi=require("child_process"),Ai=require("crypto"),Ci=require("electron"),ke=require("fs"),bt=require("path");d();var $a=`
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
`,Dn=`# Vencord Clipper - SteamVR bridge. Generated; edits are overwritten.
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
${$a}
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

        # The cache only ever needs the current build: nothing else can ever
        # be loaded again, because the name is a hash of the source itself.
        # Old copies from previous plugin versions would otherwise sit in
        # %TEMP% for ever, one per update.
        Get-ChildItem -LiteralPath $cacheDir -Filter 'bridge-*.dll' |
            Where-Object { $_.FullName -ne $cacheFile } |
            Remove-Item -Force -ErrorAction SilentlyContinue
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
`;d();var Si=require("electron"),U=require("fs"),$=require("path"),Ht="vencord.clipper",ce="/actions/clipper",vt=["save","mark","toggle","pov"],Ua=["save","mark"],Ga={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function On(){let t=(0,$.join)(Si.app.getPath("userData"),"clipper-vr");return(0,U.mkdirSync)(t,{recursive:!0}),t}function za(){let t=(0,$.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,U.readFileSync)(t,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,U.existsSync)((0,$.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let e=(0,$.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,U.existsSync)((0,$.join)(e,"bin","win64","openvr_api.dll"))?e:null}function xi(){let t=za();return t&&(0,$.join)(t,"bin","win64","openvr_api.dll")}var Wa=.4,Ba={save:"double",mark:"long"};function ja(t,e,n){return{path:t,mode:"button",inputs:{[e]:{output:`${ce}/in/${n}`}},parameters:e==="long"?{long_press_delay:Wa}:{}}}function bi(t,e){return{app_key:Ht,controller_type:t,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[ce]:{sources:Ua.map(n=>ja(e[n],Ba[n],n))}}}}function Ei(){let t=On(),e={language_tag:"en_US",[ce]:"Clipper"};for(let o of vt)e[`${ce}/in/${o}`]=Ga[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:ce,usage:"leftright"}],actions:vt.map(o=>({name:`${ce}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[e]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,U.writeFileSync)((0,$.join)(t,"bindings_knuckles.json"),JSON.stringify(bi("knuckles",r),null,4),"utf8"),(0,U.writeFileSync)((0,$.join)(t,"bindings_oculus_touch.json"),JSON.stringify(bi("oculus_touch",r),null,4),"utf8");let i=(0,$.join)(t,"actions.json");return(0,U.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function Ti(t){let e={source:"builtin",applications:[{app_key:Ht,launch_type:"binary",binary_path_windows:t,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,$.join)(On(),"clipper.vrmanifest");return(0,U.writeFileSync)(n,JSON.stringify(e,null,4),"utf8"),n}function Ln(){return(0,$.join)(On(),"bridge.ps1")}var Ha=15e3,Ka=45e3,ki=3,Za=3,qa=2e3,F=null,Kt=!1,te="",V="",Ee="",Te=!1,Fn=0,Mi=0,je=null,yt=[],wt=null,ue=[],Zt=Promise.resolve();function Ii(t){let e=ue.shift();if(e){e(t);return}if(t.kind==="motion"){wt=t;return}yt.push(t.action),yt.length>8&&yt.shift()}function Ya(t){let e=t.trim();if(!e.startsWith("{"))return!1;let n;try{n=JSON.parse(e)}catch{return!1}if(n.t==="ready")return te=String(n.runtime??""),V="",Ee="",Te=!1,!0;if(n.t==="waiting")return te="",V="",Ee=String(n.reason??""),!0;if(n.t==="warning")return V=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return V=String(n.message??"The SteamVR bridge failed for a reason it did not give"),Te=!te||++Mi>=Za,!0;if(n.t==="action"){let r=vt.find(i=>i===n.name);return r&&Ii({kind:"action",action:r}),!1}return n.t==="motion"&&Ii({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function Vn(){je||!Kt||Te||(je=setTimeout(()=>{je=null,Kt&&Ri()},Ha))}function Ri(){if(F)return Promise.resolve();let t=xi();if(!t)return Vn(),Promise.resolve();let e;try{let n=Ln();(0,ke.writeFileSync)(n,Dn,"utf8");let r=(0,ke.readFileSync)(n,"utf8"),i=a=>(0,Ai.createHash)("sha256").update(a,"utf8").digest("hex");if(i(r)!==i(Dn))throw new Error("The SteamVR bridge script changed between writing and starting it.");let o=(0,bt.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");e=(0,Pi.spawn)(o,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",t,"-Actions",Ei(),"-Manifest",Ti(o),"-AppKey",Ht,"-ActionList",[ce,...vt].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return V=`The SteamVR bridge could not be started (${n.message}).`,Vn(),Promise.resolve()}return F=e,te="",Ee="",Te=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{V="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},Ka),a="";e.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let h of l)Ya(h)&&i()}),e.stderr?.on("data",()=>{V||(V="The SteamVR bridge printed an error and gave no usable message.")}),e.on("error",s=>{V=`The SteamVR bridge could not be started (${s.message}).`,i()}),e.on("exit",()=>{F===e&&(!te&&!Ee&&!Te?++Fn>=ki&&(Te=!0,V||(V=`The SteamVR bridge stopped ${ki} times without saying why. Switch the VR controls off and on again to try it once more.`)):Fn=0,F=null,te="",Ee="");let s=ue;ue=[];for(let l of s)l(null);i(),Vn()})})}function _i(){je&&(clearTimeout(je),je=null);let t=F;F=null,te="",Ee="",Te=!1,Fn=0,Mi=0,yt=[],wt=null;let e=ue;ue=[];for(let r of e)r(null);if(!t)return;try{t.stdin?.end()}catch{}let n=setTimeout(()=>{try{t.kill()}catch{}},qa);t.on("exit",()=>clearTimeout(n))}function Di(t){let e=Zt.then(async()=>(Kt=t,t?(await Ri(),qt()):(_i(),V="",qt())));return Zt=e.catch(()=>{}),e}function Nn(){let t=Zt.then(()=>{Kt=!1,_i()});return Zt=t.catch(()=>{}),t}function qt(){return{running:F!==null&&te!=="",runtime:te,problem:V,waiting:Ee}}function Oi(){if(!F?.stdin?.writable)return!1;try{return F.stdin.write(`bindings
`),!0}catch{return!1}}var Ja=0;function Li(t,e,n,r){if(!F?.stdin?.writable||e<=0||n<=0||t.length!==e*n*4||e>2048||n>2048||t.length>16*1024*1024)return!1;let i=Math.min(1e4,Math.max(1e3,Math.round(r))),o=(0,bt.join)((0,bt.dirname)(Ln()),`panel-${Ja++%8}.rgba`);try{return(0,ke.writeFileSync)(o,t),F.stdin.write(`panel ${e} ${n} ${i} ${o}
`),!0}catch{try{(0,ke.unlinkSync)(o)}catch{}return!1}}function Vi(){if(!F?.stdin?.writable)return!1;try{return F.stdin.write(`panelhide
`),!0}catch{return!1}}function Fi(t=3e4){let e=yt.shift();if(e)return Promise.resolve({kind:"action",action:e});if(wt){let n=wt;return wt=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{ue=ue.filter(a=>a!==i),i(null)},t);ue.push(i)})}Ci.app.on("will-quit",()=>{Nn()});var $i=!0,Hn=!1,$n=500*1024*1024,Ui=/vesktop|equibop/i.test(y.app.getName());function x(t){let e=t?.trim(),n=e&&(0,u.isAbsolute)(e)?e:(0,u.join)(y.app.getPath("videos"),"DiscordClips"),r=(0,u.normalize)(n),i=r.toUpperCase();if(i.startsWith("\\\\?\\")||i.startsWith("\\\\.\\"))throw new Error("That folder is not a place for clips");if(/(^|[\\/])[. ]+([\\/]|$)/.test(r.replace(/[\\/]+$/,"")))throw new Error("That folder is not a place for clips");let o=r.toLowerCase().replace(/[\\/]+$/,"");for(let a of Xa()){let s=(0,u.normalize)(a).toLowerCase().replace(/[\\/]+$/,"");if(o===s||o.startsWith(`${s}\\`)||o.startsWith(`${s}/`))throw new Error("That folder is not a place for clips")}return r}function Xa(){let t=[];for(let e of["SystemRoot","windir","ProgramFiles","ProgramFiles(x86)","ProgramW6432"]){let n=process.env[e]?.trim();n&&t.push(n)}try{t.push(Jn())}catch{}try{t.push(y.app.getPath("userData"))}catch{}return t}var Qa=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;function _(t){let n=(0,u.basename)(String(t??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${Qa.test(r[1])?`_${r[1]}`:r[1]}.${r[2].toLowerCase()}`:null}function Gi(t){return _(t)??`clip-${Date.now()}.webm`}function Tt(t,e){let n=(0,u.extname)(e),r=e.slice(0,e.length-n.length),i=(0,u.join)(t,e),o=2;for(;((0,c.existsSync)(i)||Ie.has(J(i)))&&o<1e3;)i=(0,u.join)(t,`${r} (${o++})${n}`);if((0,c.existsSync)(i)||Ie.has(J(i)))throw new Error(`No free name left for ${e}; rename or clear the folder`);return i}var He=new Map;function zi(t,e){let n=`${t}.tmp-${process.pid}-${Date.now()}`;(0,c.writeFileSync)(n,Buffer.from(e));try{(0,c.renameSync)(n,t)}catch(r){try{(0,c.unlinkSync)(n)}catch{}throw r}}function es(t,e,n,r,i=!1){if(r.length>$n)throw new Error("That clip is too large to write");let o=x(e);(0,c.mkdirSync)(o,{recursive:!0});let a=Gi(n),s=(0,u.join)(o,a),l=(He.get(s)??Promise.resolve()).catch(()=>{}).then(async()=>{let h=i?Tt(o,a):(0,u.join)(o,a);return zi(h,r),h});return l.then(()=>{He.get(s)===l&&He.delete(s)},()=>{He.get(s)===l&&He.delete(s)}),He.set(s,l),l}var Ie=new Set;function ts(t,e,n){let r=x(e);(0,c.mkdirSync)(r,{recursive:!0});let i=Tt(r,Gi(n));if(!Ie.has(J(i)))return Ie.add(J(i)),i;let o=(0,u.extname)(i),a=i.slice(0,i.length-o.length),s=1,l=`${a}-${s}${o}`;for(;Ie.has(J(l))||(0,c.existsSync)(l);)l=`${a}-${++s}${o}`;return Ie.add(J(l)),l}function ns(t,e){typeof e!="string"||!(0,u.isAbsolute)(e)||_((0,u.basename)(e)??"")&&Ie.delete(J(e))}var kt="voices";function rs(t,e){let n=_(t);return!n||!/^\d{1,25}$/.test(String(e??""))?null:`${n.slice(0,n.length-(0,u.extname)(n).length)}.${e}.webm`}function is(t,e){let n=_(e);if(!n)return[];let r=(0,u.join)(x(t),kt);if(!(0,c.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,u.extname)(n).length)}.`,o=[];for(let a of(0,c.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function os(t,e,n,r,i){let o=rs(n,r);if(!o)return null;if(i.length>Un)throw new Error("That voice track is too large to write");let a=(0,u.join)(x(e),kt);(0,c.mkdirSync)(a,{recursive:!0});let s=(0,u.join)(a,o);return zi(s,i),s}var Un=64*1024*1024;function as(t,e,n){let r=(0,u.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");let i=(0,u.join)(x(e),kt,r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>Un)throw new Error("That voice track is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>Un)throw new Error("That voice track is too large to open");return s}finally{(0,c.closeSync)(o)}}function ss(t,e){let n=(0,u.join)(x(t),kt);for(let{file:r}of is(t,e))try{(0,c.unlinkSync)((0,u.join)(n,r))}catch{}}function ls(t,e){let n=x(e);if(!(0,c.existsSync)(n))return[];try{ji(n)}catch{}let r=[],i=new Set,o=(0,c.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,u.join)(n,a.name);try{let l=(0,c.statSync)(s),h=H(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(h)?{thumb:h}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function cs(t,e,n){let r=_(n);if(!r)throw new Error("That is not a clip name");let i=(0,u.join)(x(e),r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>$n)throw new Error("That clip is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>$n)throw new Error("That clip is too large to open");return s}finally{(0,c.closeSync)(o)}}var us=".trash",Wi=".trash.json",ds=168*3600*1e3;function It(t){return(0,u.join)(t,us)}function Pt(t){let e;try{e=JSON.parse((0,c.readFileSync)((0,u.join)(t,Wi),"utf8"))}catch{return{}}if(!e||typeof e!="object")return{};let n={};for(let[r,i]of Object.entries(e))/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.test(r)&&(!i||typeof i!="object"||i.stored!==r||(n[r]=i));return n}function Ke(t,e){(0,c.mkdirSync)(t,{recursive:!0}),(0,c.writeFileSync)((0,u.join)(t,Wi),JSON.stringify(e))}function Bi(t,e){if(!e)return;let n=(0,u.join)(t,kt),r;try{r=(0,c.readdirSync)(n)}catch{return}for(let i of r)if(i.startsWith(`${e}.`)&&i.toLowerCase().endsWith(".webm"))try{(0,c.unlinkSync)((0,u.join)(n,i))}catch{}}function ji(t){let e=It(t);if(!(0,c.existsSync)(e))return;let n=Pt(e),r=Date.now(),i=!1;for(let[o,a]of Object.entries(n))if(!(!a||r-(a.deletedAt??0)<ds)){for(let s of[o,H(o)])try{(0,c.unlinkSync)((0,u.join)(e,s))}catch{}Bi(t,(a.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,"")),delete n[o],i=!0}i&&Ke(e,n)}function hs(t,e,n,r){let i=_(n);if(!i)throw new Error("That is not a clip name");if(r!==null&&(typeof r!="string"||r.length>1024*1024))throw new Error("That metadata is not metadata");let o=x(e),a=(0,u.join)(o,i);if(!(0,c.existsSync)(a))throw new Error("That clip is already gone");let s=It(o);(0,c.mkdirSync)(s,{recursive:!0});let l=Tt(s,i).split(/[\\/]/).pop()||i;(0,c.renameSync)(a,(0,u.join)(s,l));let h=H(i);if((0,c.existsSync)((0,u.join)(o,h)))try{(0,c.renameSync)((0,u.join)(o,h),(0,u.join)(s,H(l)))}catch{}let f=Pt(s);f[l]={stored:l,name:i,deletedAt:Date.now(),meta:r},Ke(s,f)}function ps(t,e,n){let r=_(n);if(!r)throw new Error("That is not a clip name");let i=x(e),o=It(i),a=Pt(o),s=a[r];if(!s||!(0,c.existsSync)((0,u.join)(o,r)))throw delete a[r],Ke(o,a),new Error("That clip is no longer in the trash");let l=_(s.name);if(!l)throw delete a[r],Ke(o,a),new Error("That trash entry names nothing restorable");let h=Tt(i,l).split(/[\\/]/).pop()||l;(0,c.renameSync)((0,u.join)(o,r),(0,u.join)(i,h));let f=H(r);if((0,c.existsSync)((0,u.join)(o,f)))try{(0,c.renameSync)((0,u.join)(o,f),(0,u.join)(i,H(h)))}catch{}return delete a[r],Ke(o,a),{name:h,meta:s.meta??null}}function fs(t,e){let n=x(e);ji(n);let r=It(n),i=Pt(r),o=[];for(let[a,s]of Object.entries(i)){if(!s)continue;let l=0;try{l=(0,c.statSync)((0,u.join)(r,a)).size}catch{delete i[a];continue}let h="";try{let f=s.meta?JSON.parse(s.meta):null;f&&typeof f.game=="string"&&(h=f.game)}catch{}o.push({stored:a,name:s.name??a,size:l,deletedAt:s.deletedAt??0,game:h})}return o.sort((a,s)=>a.deletedAt-s.deletedAt)}function ms(t,e){let n=x(e),r=It(n);if((0,c.existsSync)(r)){for(let[i,o]of Object.entries(Pt(r))){for(let a of[i,H(i)])try{(0,c.unlinkSync)((0,u.join)(r,a))}catch{}o&&Bi(n,(o.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,""))}Ke(r,{})}}var Hi=32*1024*1024;function gs(){let t=(0,u.join)((0,Jt.tmpdir)(),`clipper-spill-${process.pid}`);return(0,c.mkdirSync)(t,{recursive:!0}),t}function Kn(t){if(!/^spill-\d+-[a-z0-9]+$/i.test(t))throw new Error("That is not a spill file");return(0,u.join)(gs(),`${t}.frag`)}function vs(t,e,n){if(n.length>Hi)throw new Error("That spill chunk is too large");(0,c.writeFileSync)(Kn(e),Buffer.from(n))}function ys(t,e){let n=Kn(e),r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>Hi)throw new Error("That spill chunk is too large");return new Uint8Array((0,c.readFileSync)(r))}finally{(0,c.closeSync)(r)}}function ws(t,e){for(let n of e)try{(0,c.unlinkSync)(Kn(n))}catch{}}function bs(){let t=`clipper-spill-${process.pid}`,e;try{e=(0,c.readdirSync)((0,Jt.tmpdir)())}catch{return}for(let n of e){if(!n.startsWith("clipper-spill-"))continue;let r=(0,u.join)((0,Jt.tmpdir)(),n);if(n!==t){let i=0;try{i=Date.now()-(0,c.statSync)(r).mtimeMs}catch{continue}if(i<24*3600*1e3)continue}try{(0,c.rmSync)(r,{recursive:!0,force:!0})}catch{}}}async function Ss(t,e,n){let r=x(e),i=_(n);if(!i)throw new Error("That is not a clip name");let o=(0,u.join)(r,i);try{await y.shell.trashItem(o)}catch{(0,c.unlinkSync)(o)}ss(e,i);let a=(0,u.join)(r,H(i));if((0,c.existsSync)(a))try{await y.shell.trashItem(a)}catch{try{(0,c.unlinkSync)(a)}catch{}}}function xs(t,e,n,r){let i=x(e),o=_(n);if(!o)throw new Error("That is not a clip name");let a=(0,u.join)(i,o),s=(0,u.extname)(o),l=_(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let f=l.toLowerCase()===o.toLowerCase()?(0,u.join)(i,l):Tt(i,l);(0,c.renameSync)(a,f);let p=(0,u.join)(i,H(o));if((0,c.existsSync)(p))try{(0,c.renameSync)(p,(0,u.join)(i,H((0,u.basename)(f))))}catch{}return(0,u.basename)(f)}var Ki="clipper-library.json",Gn=5*1024*1024;function Es(t,e){let n=(0,u.join)(x(e),Ki);if(!(0,c.existsSync)(n))return"";try{let r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>Gn)return"";let o=new Uint8Array((0,c.readFileSync)(r));return o.length>Gn?"":Buffer.from(o).toString("utf8")}finally{(0,c.closeSync)(r)}}catch{return""}}function Ts(t,e,n){let r=x(e);if((0,c.mkdirSync)(r,{recursive:!0}),String(n??"").length>Gn)throw new Error("That library document is too large to write");let i=(0,u.join)(r,Ki),o=`${i}.tmp`;(0,c.writeFileSync)(o,String(n??""),"utf8"),(0,c.renameSync)(o,i)}var Zi="clipper-imports.json",qi=200,xt=new Set;function J(t){return(0,u.normalize)(t).toLowerCase()}function ks(){try{(0,c.writeFileSync)((0,u.join)(y.app.getPath("userData"),Zi),JSON.stringify([...xt].slice(-qi)),"utf8")}catch{}}try{let t=(0,c.readFileSync)((0,u.join)(y.app.getPath("userData"),Zi),"utf8"),e=JSON.parse(t);if(Array.isArray(e))for(let n of e.slice(-qi))typeof n=="string"&&(0,u.isAbsolute)(n)&&xt.add(J(n))}catch{}function Zn(t){let e=!1;for(let n of t){if(typeof n!="string"||!(0,u.isAbsolute)(n))continue;let r=J(n);xt.has(r)||(xt.add(r),e=!0)}return e&&ks(),t}function qn(t,e){if(typeof t!="string"||!(0,u.isAbsolute)(t)||!xt.has(J(t)))throw new Error(`That ${e} was not picked for import`);return t}async function Is(t){let e=await y.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return e.canceled?[]:Zn(e.filePaths)}var Ps=512*1024*1024;function As(t,e){if(qn(e,"video"),!/\.(mp4|webm|mkv|mov|m4v)$/i.test(e))throw new Error("Not a video file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>Ps){let i=Math.round(r/1048576);throw new Error(`That video is ${i} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function Cs(t){let e=await y.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return e.canceled?[]:Zn(e.filePaths)}var Ms=64*1024*1024;function Rs(t,e){if(qn(e,"audio file"),!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(e))throw new Error("Not an audio file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>Ms){let i=Math.round(r/1048576);throw new Error(`That sound is ${i} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function _s(t){let e=await y.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return e.canceled?[]:Zn(e.filePaths)}var Ds=24*1024*1024,Os=64*1024*1024;function Ls(t,e){if(qn(e,"picture or clip"),!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(e))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(e),r=n?Os:Ds,i=(0,c.openSync)(e,"r");try{let{size:o}=(0,c.fstatSync)(i);if(o>r){let a=Math.round(o/1048576),s=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${a} MB; the montage caps them at ${s} MB.`)}return new Uint8Array((0,c.readFileSync)(i))}finally{(0,c.closeSync)(i)}}function Vs(t,e,n){let r=_(n);if(!r)throw new Error("That is not a clip name");y.shell.showItemInFolder((0,u.join)(x(e),r))}function Fs(t,e){return x(e)}async function Ns(t,e){let n;try{n=x(e)}catch{n=(0,u.join)(y.app.getPath("videos"),"DiscordClips")}let r=await y.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:n,properties:["openDirectory","createDirectory"]});return r.canceled?"":r.filePaths[0]??""}function $s(t,e){let n=x(e);(0,c.mkdirSync)(n,{recursive:!0}),y.shell.openPath(n)}function Us(t){return{platform:"win32",wayland:Hn,vesktop:Ui,overlay:jt()}}var de=new Set;async function Gs(t,e=!0){if(Hn)return[];let n=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:e?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(de.size){let i=new Set(n.map(o=>o.id));for(let o of de)i.has(o)||de.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!e){if(!o&&de.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if($i&&!o&&a){de.add(i.id);continue}de.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function zs(t){try{return y.app.getAppMetrics().map(e=>({type:e.serviceName||e.type,mb:Math.round((e.memory?.workingSetSize??0)/1024)})).filter(e=>e.mb>0).sort((e,n)=>n.mb-e.mb)}catch{return[]}}async function Ws(t){if(Hn)return"";let e=await y.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!e.length)return"";try{let n=y.screen.getDisplayNearestPoint(y.screen.getCursorScreenPoint()),r=e.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return e[0].id}var zn="",Wn=!1;function Bs(t,e,n=!0){return!n||Ui?!1:(zn=e??"",Wn=!0,y.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(h=>h.id===zn),l=(a&&!de.has(a.id)?a:void 0)??o.find(h=>h.id.startsWith("screen:"))??o.find(h=>!de.has(h.id));if(!l){i({});return}i($i&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function js(t){zn="",Wn&&(Wn=!1,y.session.defaultSession.setDisplayMediaRequestHandler(null))}var Bn=new Map,he=[],St=[];function Hs(t){let e=he.shift();if(e){e(t);return}St.push(t),St.length>8&&St.shift()}function Ks(t,e){Yn();let n=[];for(let[r,i]of Object.entries(e)){if(r!=="save"&&r!=="toggle"&&r!=="mark"&&r!=="pov"&&r!=="replay"||!i)continue;let o=!1;try{o=y.globalShortcut.register(i,()=>Hs(r))}catch{o=!1}o?Bn.set(r,i):n.push(i)}return n}function Yn(t){for(let n of Bn.values())try{y.globalShortcut.unregister(n)}catch{}Bn.clear(),St=[];let e=he;he=[];for(let n of e)n(null)}function Zs(t,e=3e4){let n=St.shift();if(n)return Promise.resolve(n);let r=Math.min(12e4,Math.max(1e3,Number(e)||3e4));return he.length>32&&he.shift()?.(null),new Promise(i=>{let o=!1,a=l=>{o||(o=!0,clearTimeout(s),i(l))},s=setTimeout(()=>{he=he.filter(l=>l!==a),a(null)},r);he.push(a)})}y.app.on("will-quit",()=>Yn());function qs(t,e){return ri(e)}function Ys(t){return Cn()}function Js(t){return zt()}function Xs(t,e=3e4){return oi(e)}function Qs(t,e){return Di(e)}function el(t){return Nn()}function tl(t){return qt()}function nl(t){return Oi()}function rl(t,e,n,r,i){return Li(new Uint8Array(e),n,r,i)}function il(t){return Vi()}function ol(t,e=3e4){return Fi(e)}y.app.on("will-quit",()=>{Cn()});var al=["top-left","top-right","bottom-left","bottom-right"];function Ze(t,e,n,r){let i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(e,Math.round(i))):r}function Yi(t){return al.includes(t)?t:"bottom-right"}function sl(t){return{corner:Yi(t?.corner),width:Ze(t?.width,200,1280,420),volume:Ze(t?.volume,0,100,0),seconds:Ze(t?.seconds,0,300,10)}}function jn(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function ll(t,e,n,r){let i=_(n);if(!i)return!1;let o=(0,u.join)(x(e),i);return(0,c.existsSync)(o)?hi(o,sl(r)):!1}function cl(t,e,n,r){return y.BrowserWindow.getFocusedWindow()||_n()?!1:pi(jn(e,60),jn(n,90),Yi(r))}function ul(t){xe()}var dl=200;function hl(t){return Array.isArray(t)?t.map(Number).filter(e=>Number.isFinite(e)&&e>=0).slice(0,dl):[]}function pl(t){return{width:Ze(t?.width,360,1600,720),volume:Ze(t?.volume,0,100,0)}}function fl(t,e,n,r,i){let o=_(n);if(!o)return!1;let a=(0,u.join)(x(e),o);return(0,c.existsSync)(a)?wi({name:o,path:a,markers:hl(r)},pl(i)):!1}function ml(t){gt()}function gl(t){return _n()}function vl(t,e=3e4){return gi(Ze(e,1e3,12e4,3e4))}function yl(t){vi()}function wl(t,e,n,r){yi({ok:!!e,message:jn(n,120),close:!!r})}function bl(t){let e=y.BrowserWindow.fromWebContents(t.sender);!e||e.isDestroyed()||(e.isMinimized()&&e.restore(),e.show(),e.focus())}var Et="kebab1337420/Clibab",Sl=`VencordClipper (+https://github.com/${Et})`,Yt=256*1024*1024;function xl(t){let e="";try{let n=new URL(t);if(n.protocol!=="https:")return!1;e=n.hostname.toLowerCase()}catch{return!1}return e==="api.github.com"||e==="github.com"||e==="codeload.github.com"||e==="raw.githubusercontent.com"||e==="objects.githubusercontent.com"||e.endsWith(".githubusercontent.com")}function Qt(t,e=0){return xl(t)?new Promise((n,r)=>{let i=(0,Ni.get)(t,{headers:{"User-Agent":Sl,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),e>=5?r(new Error(`Too many redirects for ${t}`)):n(Qt(new URL(s,t).toString(),e+1));return}let l=[],h=0,f=setTimeout(p,2e4);function p(){o.destroy(new Error(`${t} stalled mid-download`))}let{"content-length":w}=o.headers;if(w&&Number(w)>Yt){clearTimeout(f),o.destroy(new Error(`${t} answered ${w} bytes, over the ${Yt} byte cap`));return}o.on("data",v=>{if(clearTimeout(f),f=setTimeout(p,2e4),h+=v.length,h>Yt){o.destroy(new Error(`${t} exceeded the ${Yt} byte cap`));return}l.push(v)}),o.on("end",()=>{clearTimeout(f),n({status:a,body:Buffer.concat(l)})}),o.on("error",v=>{clearTimeout(f),r(v)})});i.setTimeout(6e4,()=>i.destroy(new Error(`${t} timed out`))),i.on("error",r)}):Promise.reject(new Error(`Refusing to fetch outside the update hosts: ${t}`))}async function El(t){let{status:e,body:n}=await Qt(t);if(e!==200)throw new Error(`${t} answered ${e}`);return n}function Jn(){return __dirname}function Ji(t){return(0,c.existsSync)((0,u.join)(t,"patcher.js"))&&(0,c.existsSync)((0,u.join)(t,"renderer.js"))}function Xi(t){try{return(0,c.accessSync)(t,c.constants.W_OK),!0}catch{return!1}}function Qi(t,e){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(t),i=n(e);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function Tl(t,e){let n=await El(`https://api.github.com/repos/${Et}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=Jn();return{version:o,tag:i,available:!!o&&Qi(o,e),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${Et}/releases`),directory:a,writable:Ji(a)&&Xi(a)}}async function kl(t){let{status:e,body:n}=await Qt(`https://raw.githubusercontent.com/${Et}/${t}/prebuilt/build-info.json`);if(e===404)return null;if(e!==200)throw new Error(`The release's file list answered ${e}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return{files:r,text:n.toString("utf8")}}async function Il(t,e,n){if(!/^[\w.-]{1,40}$/.test(e))throw new Error(`Refusing to fetch a release named ${e}`);if(!Qi(e.replace(/^v/i,""),String(n??"")))throw new Error(`Refusing to install ${e}: it is not newer than the installed bundle`);let r=Jn();if(!Ji(r))throw new Error(`No installed bundle at ${r}`);if(!Xi(r))throw new Error(`${r} is read-only`);let i=await kl(e);if(!i)throw new Error(`The release under ${e} carries no file list; refusing to install it unchecked`);let o=i.files,a=i.text,s=Object.keys(o),l=(0,u.join)(r,`.clipper-update-${(0,Xt.randomBytes)(8).toString("hex")}`);if((0,c.existsSync)(l))throw new Error("An update staging folder is already there; refusing to share it");(0,c.mkdirSync)(l,{recursive:!0});try{let h=[];for(let v of s){if(v!==(0,u.basename)(v)||v.startsWith("."))throw new Error(`Refusing a release file named ${v}`);let{status:T,body:C}=await Qt(`https://raw.githubusercontent.com/${Et}/${e}/prebuilt/dist/${v}`);if(T!==200)throw new Error(`${v} answered ${T}`);if(C.length===0)throw new Error(`${v} came back empty`);let k=o[v];if(k?.size===void 0||!k?.sha256)throw new Error(`${v} has no size and hash in the release's file list`);if(C.length!==k.size)throw new Error(`${v} is ${C.length} bytes, the release says ${k.size}`);if((0,Xt.createHash)("sha256").update(C).digest("hex").toLowerCase()!==k.sha256.toLowerCase())throw new Error(`${v} does not match its hash`);(0,c.writeFileSync)((0,u.join)(l,v),C),h.push(v)}if(h.length===0)throw new Error(`There is no bundle published under ${e}`);for(let v of["renderer.js","patcher.js"])if(!h.includes(v))throw new Error(`The release carries no ${v}`);if(!(0,c.readFileSync)((0,u.join)(l,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let f=(0,u.join)(l,".previous");(0,c.mkdirSync)(f,{recursive:!0});let p=[],w=[];try{for(let v of h){let T=(0,u.join)(r,v);(0,c.existsSync)(T)&&((0,c.renameSync)(T,(0,u.join)(f,v)),p.push(v)),(0,c.renameSync)((0,u.join)(l,v),T),w.push(v)}}catch(v){for(let T of w)try{(0,c.unlinkSync)((0,u.join)(r,T))}catch{}for(let T of p)try{(0,c.renameSync)((0,u.join)(f,T),(0,u.join)(r,T))}catch{}throw new Error(`The update could not be put in place (${v.message}). The bundle that was there has been put back.`)}try{Pl(r,e,h,a)}catch{}return h}finally{(0,c.rmSync)(l,{recursive:!0,force:!0})}}function Pl(t,e,n,r){let i=e.replace(/^v/i,"");if(!/^[\w.-]{1,40}$/.test(i))return;let o=(0,u.join)(t,".."),a=(0,u.join)(o,`.recovery-${i}`);(0,c.mkdirSync)(a,{recursive:!0});for(let s of n)s!==(0,u.basename)(s)||s.startsWith(".")||(0,c.copyFileSync)((0,u.join)(t,s),(0,u.join)(a,s));(0,c.writeFileSync)((0,u.join)(a,"build-info.json"),r);for(let s of(0,c.readdirSync)(o))s===`.recovery-${i}`||!s.startsWith(".recovery-")||(0,c.rmSync)((0,u.join)(o,s),{recursive:!0,force:!0})}function Al(t){y.app.relaunch(),y.app.quit(),setTimeout(()=>y.app.exit(0),3e3)}var eo={AppleMusicRichPresence:gn,ConsoleShortcuts:vn,FixSpotifyEmbeds:Gr,FixYoutubeEmbeds:Wr,OpenInApp:En,Translate:Tn,VoiceMessages:kn,XSOverlay:In,YoutubeAdblock:qr,Clipper:Xn};var to={};for(let[t,e]of Object.entries(eo)){let n=Object.entries(e);if(!n.length)continue;let r=to[t]={};for(let[i,o]of n){let a=`VencordPluginNative_${t}_${i}`;Qn.ipcMain.handle(a,o),r[i]=a}}Qn.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=to});d();function er(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}Oe();var S=require("electron");d();var no="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var Pe=require("fs"),fe=require("fs/promises"),po=require("os"),ar=require("path");d();Oe();var qe=require("electron");d();var tr=require("electron"),K=["connect-src"],G=[...K,"img-src"],oo=["style-src","font-src"],ro=[...G,"media-src"],I=[...G,...oo],io=[...I,"script-src","worker-src"],rr={"http://localhost:*":I,"http://127.0.0.1:*":I,"localhost:*":I,"127.0.0.1:*":I,"*.github.io":I,"github.com":I,"raw.githubusercontent.com":I,"*.gitlab.io":I,"gitlab.com":I,"*.codeberg.page":I,"codeberg.org":I,"*.githack.com":I,"jsdelivr.net":I,"fonts.googleapis.com":oo,"i.imgur.com":G,"i.ibb.co":G,"i.pinimg.com":G,"files.catbox.moe":I,"cdn.discordapp.com":I,"media.discordapp.net":G,"cdnjs.cloudflare.com":io,"cdn.jsdelivr.net":io,"api.github.com":K,"ws.audioscrobbler.com":K,"musicbrainz.org":K,"*.listenbrainz.org":K,"coverartarchive.org":K,"archive.org":K,"*.archive.org":K,"translate-pa.googleapis.com":K,"*.vencord.dev":G,"manti.vendicated.dev":G,"decor.fieryflames.dev":K,"ugc.decor.fieryflames.dev":G,"sponsor.ajay.app":K,"dearrow-thumb.ajay.app":G,"usrbg.is-hardly.online":G,"icons.duckduckgo.com":G,"*.tenor.com":ro,"*.tenor.co":ro},nr=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),Cl=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},Ml=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),Rl=t=>{let e=nr(t,"content-security-policy-report-only");e&&delete t[e];let n=nr(t,"content-security-policy");if(n){let r=Cl(t[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(Z.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(rr))for(let s of a)i(s,o);t[n]=[Ml(r)]}};function ao(){tr.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&Rl(t),e==="stylesheet")){let r=nr(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),tr.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function so(){qe.ipcMain.handle("VencordCspRemoveOverride",Ll),qe.ipcMain.handle("VencordCspRequestAddOverride",Ol),qe.ipcMain.handle("VencordCspIsDomainAllowed",Vl)}function _l(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!I.includes(n)))}function Dl(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Vesktop for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let a=e.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function Ol(t,e,n,r){if(!_l(e,n))return"invalid";let i=new URL(e).host;if(i in Z.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await qe.dialog.showMessageBox({...Dl(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(Z.store.customCspRules[i]=n,"ok"):"unchecked"}function Ll(t,e){return e in Z.store.customCspRules?(delete Z.store.customCspRules[e],!0):!1}function Vl(t,e,n){try{let r=new URL(e).host,i=rr[r]??Z.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}d();var Fl=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,Nl=/^\\@/;function ir(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function lo(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function co(t,e){if(!t)return ir(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return ir(e);let r={},i="",o="";for(let a of n.split(Fl))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace(Nl,"@");return r[i]=o.trim(),delete r[""],ir(e,r)}d();var Ye=require("path");function pe(t,e){let n=(0,Ye.normalize)(t+"/"),r=(0,Ye.join)(t,e),i=(0,Ye.normalize)(r);return i===(0,Ye.normalize)(t)||i.startsWith(n)?i:null}d();var uo=require("electron");function ho(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":uo.shell.openExternal(e)}return{action:"deny"}})}var $l=(0,ar.join)(__dirname,"vencordDesktopRenderer.css");(0,Pe.mkdirSync)(ae,{recursive:!0});so();function fo(){return(0,fe.readFile)(Ve,"utf-8").catch(()=>"")}async function Ul(){let t=await(0,fe.readdir)(ae).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await mo(n).then(lo).catch(()=>null);r!=null&&e.push(co(r,n))}return e}function mo(t){t=t.replace(/\?v=\d+$/,"");let e=pe(ae,t);return e?(0,fe.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}S.ipcMain.handle("VencordOpenQuickCss",()=>S.shell.openPath(Ve));S.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!Fr.includes(n))throw"Disallowed protocol.";S.shell.openExternal(e).catch(r=>console.error("[Vencord] Failed to open external link",e,r))});S.ipcMain.handle("VencordGetQuickCss",()=>fo());S.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,Pe.writeFileSync)(Ve,e));S.ipcMain.handle("VencordGetThemesList",()=>Ul());S.ipcMain.handle("VencordGetThemeData",(t,e)=>mo(e));S.ipcMain.handle("VencordGetThemeSystemValues",()=>{let t=S.systemPreferences.getAccentColor?.()??"";return t.length&&t[0]!=="#"&&(t=`#${t}`),{"os-accent-color":t}});S.ipcMain.handle("VencordOpenThemesFolder",()=>S.shell.openPath(ae));S.ipcMain.handle("VencordOpenSettingsFolder",()=>S.shell.openPath(ve));var or=[];S.ipcMain.handle("VencordInitFileWatchers",({sender:t})=>{or.forEach(i=>i.close());let e,n;(0,fe.open)(Ve,"a+").then(i=>{i.close(),e=(0,Pe.watch)(Ve,{persistent:!1},er(async()=>{t.postMessage("VencordQuickCssUpdate",await fo())},50))}).catch(()=>{});let r=(0,Pe.watch)(ae,{persistent:!1},er(()=>{t.postMessage("VencordThemeUpdate",void 0)}));or=[e,r,n].filter(Boolean),t.once("destroyed",()=>{e?.close(),r.close(),n?.close(),or=[]})});S.ipcMain.on("VencordGetMonacoTheme",t=>{t.returnValue=S.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});S.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=S.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new S.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:S.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,ar.join)(__dirname,"vencordDesktopPreload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});ho(n),await n.loadURL(`data:text/html;base64,${no}`)});S.ipcMain.handle("VencordGetRendererCss",()=>(0,fe.readFile)($l,"utf-8"));S.ipcMain.on("VencordSupportsWindowsMaterial",t=>{t.returnValue=Number((0,po.release)().split(".")[2])>=22621});var Ce=require("electron"),Fo=require("path"),mr=require("url");d();var sn=require("electron");d();var yo=require("module"),Gl=(0,yo.createRequire)("/"),Je,tn,lr,zl=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{Je=Gl("worker_threads"),tn=Je.Worker,lr=Je.isMarkedAsUntransferable}catch{}var Wl=tn?function(t,e,n,r,i){var o=!1,a=new tn(t+zl,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return lr&&(r=r.filter(function(s){return!lr(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,tn.prototype.terminate.call(a)},a}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},R=Uint8Array,Ae=Uint16Array,wo=Int32Array,ur=new R([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),dr=new R([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),bo=new R([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),So=function(t,e){for(var n=new Ae(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new wo(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},Je=So(ur,2),hr=Je.b,Bl=Je.r;hr[28]=258,Bl[258]=28;var xo=So(dr,0),Eo=xo.b,ud=xo.r,on=new Ae(32768);for(b=0;b<32768;++b)ne=(b&43690)>>1|(b&21845)<<1,ne=(ne&52428)>>2|(ne&13107)<<2,ne=(ne&61680)>>4|(ne&3855)<<4,on[b]=((ne&65280)>>8|(ne&255)<<8)>>1;var ne,b,Xe=(function(t,e,n){for(var r=t.length,i=0,o=new Ae(e);i<r;++i)t[i]&&++o[t[i]-1];var a=new Ae(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new Ae(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var h=i<<4|t[i],f=e-t[i],p=a[t[i]-1]++<<f,w=p|(1<<f)-1;p<=w;++p)s[on[p]>>l]=h}else for(s=new Ae(r),i=0;i<r;++i)t[i]&&(s[i]=on[a[t[i]-1]++]>>15-t[i]);return s}),At=new R(288);for(b=0;b<144;++b)At[b]=8;var b;for(b=144;b<256;++b)At[b]=9;var b;for(b=256;b<280;++b)At[b]=7;var b;for(b=280;b<288;++b)At[b]=8;var b,To=new R(32);for(b=0;b<32;++b)To[b]=5;var b;var ko=Xe(At,9,1);var Io=Xe(To,5,1),nn=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},z=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},rn=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},Po=function(t){return(t+7)/8|0},an=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new R(t.subarray(e,n))};var Ao=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],A=function(t,e,n){var r=new Error(e||Ao[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,A),!n)throw r;return r},Co=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new R(0);var a=!n,s=a||e.i!=2,l=e.i;a&&(n=new R(i*3));var h=function(Sr){var xr=n.length;if(Sr>xr){var Er=new R(Math.max(xr*2,Sr));Er.set(n),n=Er}},f=e.f||0,p=e.p||0,w=e.b||0,v=e.l,T=e.d,C=e.m,k=e.n,D=i*8;do{if(!v){f=z(t,p,1);var re=z(t,p+1,3);if(p+=3,re)if(re==1)v=ko,T=Io,C=9,k=5;else if(re==2){var Qe=z(t,p,31)+257,Ct=z(t,p+10,15)+4,me=Qe+z(t,p+5,31)+1;p+=14;for(var N=new R(me),Re=new R(19),P=0;P<Ct;++P)Re[bo[P]]=z(t,p+P*3,7);p+=Ct*3;for(var et=nn(Re),No=(1<<et)-1,$o=Xe(Re,et,1),P=0;P<me;){var gr=$o[z(t,p,No)];p+=gr&15;var M=gr>>4;if(M<16)N[P++]=M;else{var _e=0,Mt=0;for(M==16?(Mt=3+z(t,p,3),p+=2,_e=N[P-1]):M==17?(Mt=3+z(t,p,7),p+=3):M==18&&(Mt=11+z(t,p,127),p+=7);Mt--;)N[P++]=_e}}var vr=N.subarray(0,Qe),ie=N.subarray(Qe);C=nn(vr),k=nn(ie),v=Xe(vr,C,1),T=Xe(ie,k,1)}else A(1);else{var M=Po(p)+4,ee=t[M-4]|t[M-3]<<8,Me=M+ee;if(Me>i){l&&A(0);break}s&&h(w+ee),n.set(t.subarray(M,Me),w),e.b=w+=ee,e.p=p=Me*8,e.f=f;continue}if(p>D){l&&A(0);break}}s&&h(w+131072);for(var Uo=(1<<C)-1,Go=(1<<k)-1,ln=p;;ln=p){var _e=v[rn(t,p)&Uo],De=_e>>4;if(p+=_e&15,p>D){l&&A(0);break}if(_e||A(2),De<256)n[w++]=De;else if(De==256){ln=p,v=null;break}else{var yr=De-254;if(De>264){var P=De-257,tt=ur[P];yr=z(t,p,(1<<tt)-1)+hr[P],p+=tt}var cn=T[rn(t,p)&Go],un=cn>>4;cn||A(3),p+=cn&15;var ie=Eo[un];if(un>3){var tt=dr[un];ie+=rn(t,p)&(1<<tt)-1,p+=tt}if(p>D){l&&A(0);break}s&&h(w+131072);var wr=w+yr;if(w<ie){var br=o-ie,zo=Math.min(ie,wr);for(br+w<0&&A(3);w<zo;++w)n[w]=r[br+w]}for(;w<wr;++w)n[w]=n[w-ie]}}e.l=v,e.p=ln,e.b=w,e.f=f,v&&(f=1,e.m=C,e.d=T,e.n=k)}while(!f);return w!=n.length&&a?an(n,0,w):n.subarray(0,w)};var jl=new R(0);var Hl=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},go=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){e+=";"+l+"=";var h=s.toString();if(s.prototype)if(h.indexOf("[native code]")!=-1){var f=h.indexOf(" ",8)+1;e+=h.slice(f,h.indexOf("(",f))}else{e+=h;for(var p in s.prototype)e+=";"+l+".prototype."+p+"="+s.prototype[p].toString()}else e+=h}else n[l]=s}return e},en=[],Kl=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},Zl=function(t,e,n,r){if(!en[n]){for(var i="",o={},a=t.length-1,s=0;s<a;++s)i=go(t[s],i,o);en[n]={c:go(t[a],i,o),e:o}}var l=Hl({},en[n].e);return Wl(en[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,Kl(l),r)},ql=function(){return[R,Ae,wo,ur,dr,bo,hr,Eo,ko,Io,on,Ao,Xe,nn,z,rn,Po,an,A,Co,pr,Mo,Ro]};var Mo=function(t){return postMessage(t,[t.buffer])},Ro=function(t){return t&&{out:t.size&&new R(t.size),dictionary:t.dictionary}},Yl=function(t,e,n,r,i,o){var a=Zl(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([t,e],e.consume?[t.buffer]:[]),function(){a.terminate()}};var X=function(t,e){return t[e]|t[e+1]<<8},W=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},sr=function(t,e){return W(t,e)+W(t,e+4)*4294967296};function Jl(t,e,n){return n||(n=e,e={}),typeof n!="function"&&A(7),Yl(t,e,[ql],function(r){return Mo(pr(r.data[0],Ro(r.data[1])))},1,n)}function pr(t,e){return Co(t,{i:2},e&&e.out,e&&e.dictionary)}var cr=typeof TextDecoder<"u"&&new TextDecoder,Xl=0;try{cr.decode(jl,{stream:!0}),Xl=1}catch{}var Ql=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:an(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function ec(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(cr)return cr.decode(t);var i=Ql(t),o=i.s,n=i.r;return n.length&&A(8),o}}var tc=function(t,e){return e+30+X(t,e+26)+X(t,e+28)},nc=function(t,e,n){var r=X(t,e+28),i=X(t,e+30),o=ec(t.subarray(e+46,e+46+r),!(X(t,e+8)&2048)),a=e+46+r,s=rc(t,a,i,n,W(t,e+20),W(t,e+24),W(t,e+42)),l=s[0],h=s[1],f=s[2];return[X(t,e+10),l,h,o,a+i+X(t,e+32),f]},rc=function(t,e,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,h=a==4294967295,f=e+n,p=s+l+h;if(r&&p){for(;e+4<f;e+=4+X(t,e+2))if(X(t,e)==1)return[s?sr(t,e+4+8*l):i,l?sr(t,e+4):o,h?sr(t,e+4+8*(l+s)):a,1];r<2&&A(13)}return[i,o,a,0]};var vo=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function _o(t,e,n){n||(n=e,e={}),typeof n!="function"&&A(7);var r=[],i=function(){for(var k=0;k<r.length;++k)r[k]()},o={},a=function(k,D){vo(function(){n(k,D)})};vo(function(){a=n});for(var s=t.length-22;W(t,s)!=101010256;--s)if(!s||t.length-s>65558)return a(A(13,0,1),null),i;var l=X(t,s+8);if(l){var h=l,f=W(t,s+16),p=W(t,s-20)==117853008;if(p){var w=W(t,s-12);p=W(t,w)==101075792,p&&(h=l=W(t,w+32),f=W(t,w+48))}for(var v=e&&e.filter,T=function(k){var D=nc(t,f,p),re=D[0],M=D[1],ee=D[2],Me=D[3],Qe=D[4],Ct=D[5],me=tc(t,Ct);f=Qe;var N=function(P,et){P?(i(),a(P,null)):(et&&(o[Me]=et),--l||a(null,o))};if(!v||v({name:Me,size:M,originalSize:ee,compression:re}))if(!re)N(null,an(t,me,me+M));else if(re==8){var Re=t.subarray(me,me+M);if(ee<524288||M>.8*ee)try{N(null,pr(Re,{out:new R(ee)}))}catch(P){N(P,null)}else r.push(Jl(Re,{size:ee},N))}else N(A(14,"unknown compression type "+re,1),null);else N(null,null)},C=0;C<h;++C)T(C)}else a(null,{});return i}var Lo=require("fs"),Q=require("fs/promises"),fr=require("path");d();function Do(t){function e(a,s,l,h){let f=0;return f+=a<<0,f+=s<<8,f+=l<<16,f+=h<<24>>>0,f}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let a=e(t[8],t[9],t[10],t[11]),s=e(t[12],t[13],t[14],t[15]),l=16+a+s;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}d();var ic=require("original-fs");async function oc(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function Oo(t,e){let r=await(await oc(t,e)).arrayBuffer();return Buffer.from(r)}var ac=(0,fr.join)(Dt,"ExtensionCache");async function sc(t,e){return await(0,Q.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{_o(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let p=pe(e,a);if(!p)throw new Error(`Path traversal detected: "${a}"`);return void await(0,Q.mkdir)(p,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),h=pe(e,l);if(!h)throw new Error(`Path traversal detected: "${a}"`);let f=pe(e,a);if(!f)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,Q.mkdir)(h,{recursive:!0}),await(0,Q.writeFile)(f,o[a])})).then(()=>n()).catch(a=>{(0,Q.rm)(e,{recursive:!0,force:!0}),r(a)})})})}async function Vo(t){let e=(0,fr.join)(ac,t);try{await(0,Q.access)(e,Lo.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await Oo(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await sc(Do(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}sn.session.defaultSession.extensions?sn.session.defaultSession.extensions.loadExtension(e):sn.session.defaultSession.loadExtension(e)}Ce.app.whenReady().then(()=>{Ce.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=pe(ae,n);return r?Ce.net.fetch((0,mr.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return Ce.net.fetch((0,mr.pathToFileURL)((0,Fo.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{O.store.enableReactDevtools&&Vo("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}ao()});
//# sourceURL=file:///VencordDesktopMain
//# sourceMappingURL=vencord://vencordDesktopMain.js.map
/*! For license information please see vencordDesktopMain.js.LEGAL.txt */

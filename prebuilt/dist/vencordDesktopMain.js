// Vencord 59a5428
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var dn=Object.defineProperty;var Go=Object.getOwnPropertyDescriptor;var zo=Object.getOwnPropertyNames;var Wo=Object.prototype.hasOwnProperty;var Mt=(t,e,n)=>()=>{if(n)throw n[0];try{return t&&(e=t(t=0)),e}catch(r){throw n=[r],r}};var ge=(t,e)=>{for(var n in e)dn(t,n,{get:e[n],enumerable:!0})},Bo=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of zo(e))!Wo.call(t,i)&&i!==n&&dn(t,i,{get:()=>e[i],enumerable:!(r=Go(e,i))||r.enumerable});return t};var jo=t=>Bo(dn({},"__esModule",{value:!0}),t);var u=Mt(()=>{"use strict"});var Oe=Mt(()=>{"use strict";u()});function tt(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var Tr=Mt(()=>{"use strict";u()});var qo={};function Le(...t){let e={cwd:Ar};return pn?hn("flatpak-spawn",["--host","git",...t],e):hn("git",t,e)}async function Ho(){return(await Le("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function Ko(){await Le("fetch");let t=(await Le("branch","--show-current")).stdout.trim();if(!((await Le("ls-remote","origin",t)).stdout.length>0))return[];let r=(await Le("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function Zo(){return(await Le("pull")).stdout.includes("Fast-forward")}async function Yo(){return!(await hn(pn?"flatpak-spawn":"node",pn?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:Ar})).stderr.includes("Build failed")}var kr,nt,Ir,Pr,Ar,hn,pn,Cr=Mt(()=>{"use strict";u();Oe();kr=require("child_process"),nt=require("electron"),Ir=require("path"),Pr=require("util");Tr();Ar=(0,Ir.join)(__dirname,".."),hn=(0,Pr.promisify)(kr.execFile),pn=!1;nt.ipcMain.handle("VencordGetRepo",tt(Ho));nt.ipcMain.handle("VencordGetUpdates",tt(Ko));nt.ipcMain.handle("VencordUpdate",tt(Zo));nt.ipcMain.handle("VencordBuild",tt(Yo))});u();u();u();Cr();u();Oe();var Qn=require("electron");u();var gn={};ge(gn,{fetchTrackData:()=>Xo});u();u();u();var Mr="59a5428";u();var fn="Vendicated/Vencord";var Rr=`Vencord/${Mr}${fn?` (https://github.com/${fn})`:""}`;var _r=require("child_process"),Dr=require("util"),Or=(0,Dr.promisify)(_r.execFile);async function mn(t){let{stdout:e}=await Or("osascript",t.map(n=>["-e",n]).flat());return e}var W=null;async function Jo({id:t,name:e,artist:n,album:r}){if(t===W?.id){if("data"in W)return W.data;if("failures"in W&&W.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":Rr}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return W={id:t,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},W.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),W={id:t,failures:(t===W?.id&&"failures"in W?W.failures:0)+1},null}}async function Xo(){try{await Or("pgrep",["^Music$"])}catch{return null}if(await mn(['tell application "Music"',"get player state","end tell"]).then(f=>f.trim())!=="playing")return null;let e=await mn(['tell application "Music"',"get player position","end tell"]).then(f=>Number.parseFloat(f.trim())),n=await mn(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(f=>!!f),l=Number.parseFloat(s),p=await Jo({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:e,duration:l,...p}}var vn={};ge(vn,{initDevtoolsOpenEagerLoad:()=>Qo});u();function Qo(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var Gr={};u();u();Oe();u();var yn=Symbol("SettingsStore.isProxy"),Lr=Symbol("SettingsStore.getRawTarget"),rt=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===yn)return!0;if(r===Lr)return n;let o=Reflect.get(n,r,i),a=e.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[yn]){let p=`${l}${l&&"."}${r}`;return e.makeProxy(o,s,p)}return o},set(n,r,i){if(i?.[yn]&&(i=i[Lr]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return e.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return e.notifyListeners(s,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyPrefixListeners(e,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,e))}}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,p)=>l[p],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n)),this.notifyPrefixListeners(e,i,n)}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}addPrefixChangeListener(e,n){let r=this.prefixListeners.get(e)??new Set;r.add(n),this.prefixListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}removePrefixChangeListener(e,n){let r=this.prefixListeners.get(e);r&&(r.delete(n),r.size||this.prefixListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}};u();function wn(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},wn(t[n],r)):t[n]??=r}return t}var xn=require("electron"),ye=require("fs");u();var Vr=require("electron"),oe=require("path"),_t=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,oe.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,oe.join)(Vr.app.getPath("userData"),"..","Vencord")),ve=(0,oe.join)(_t,"settings"),ae=(0,oe.join)(_t,"themes"),Ve=(0,oe.join)(ve,"quickCss.css"),bn=(0,oe.join)(ve,"settings.json"),Sn=(0,oe.join)(ve,"native-settings.json"),Fr=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"];(0,ye.mkdirSync)(ve,{recursive:!0});function Nr(t,e){try{return JSON.parse((0,ye.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var M=new rt(Nr("renderer",bn));M.addGlobalChangeListener(()=>{try{(0,ye.writeFileSync)(bn,JSON.stringify(M.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});xn.ipcMain.on("VencordGetSettings",t=>t.returnValue=M.plain);xn.ipcMain.handle("VencordSetSettings",(t,e,n)=>{M.setData(e,n)});var ea={plugins:{},customCspRules:{}},$r=Nr("native",Sn);wn($r,ea);var Z=new rt($r);Z.addGlobalChangeListener(()=>{try{(0,ye.writeFileSync)(Sn,JSON.stringify(Z.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}});var Ot=require("electron"),Dt=[];function Ur(){let t=[];for(let e=Dt.length-1;e>=0;e--){let{processId:n,routingId:r}=Dt[e],i=Ot.webFrameMain.fromId(n,r);if(!i){Dt.splice(e,1);continue}t.push(i)}return t}Ot.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){Ur();let{routingId:i,processId:o}=r;Dt.push({routingId:i,processId:o});let a=M.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});M.addChangeListener("plugins.FixSpotifyEmbeds.volume",t=>{try{Ur().forEach(e=>e.executeJavaScript(`globalThis._vcVolume = ${t/100}`))}catch(e){console.error("FixSpotifyEmbeds: Failed to update volume",e)}});var Wr={};u();var zr=require("electron");zr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!M.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var En={};ge(En,{resolveRedirect:()=>na});u();var Br=require("https"),ta=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function jr(t){return new Promise((e,n)=>{let r=(0,Br.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?jr(i.headers.location):t)});r.on("error",n),r.end()})}async function na(t,e){return ta.test(e)?jr(e):e}var Tn={};ge(Tn,{makeDeeplTranslateRequest:()=>ra,makeKagiTranslateRequest:()=>ia});u();async function ra(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function ia(t,e,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${e}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var kn={};ge(kn,{readRecording:()=>oa});u();var Hr=require("electron"),Lt=require("fs/promises"),it=require("path");async function oa(t,e){e=(0,it.normalize)(e);let n=(0,it.basename)(e),r=(0,it.normalize)(Hr.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!e.startsWith(r))return null;try{let i=await(0,Lt.readFile)(e);return(0,Lt.rm)(e).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var In={};ge(In,{closeSocket:()=>sa,sendToOverlay:()=>aa});u();var Kr=require("dgram"),Vt=null;function aa(t,e){e.messageType=e.type;let n=JSON.stringify(e);Vt??=(0,Kr.createSocket)("udp4"),Vt.send(n,42069,"127.0.0.1")}function sa(){Vt?.close(),Vt=null}var Yr={};u();var Zr=require("electron");u();var Pn=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;Zr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{M.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(Pn):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(Pn))})})});var Xn={};ge(Xn,{answerOverlayAction:()=>vl,armDisplayMedia:()=>zs,checkUpdate:()=>xl,closeStudioOverlay:()=>pl,deleteClip:()=>ws,disarmDisplayMedia:()=>Ws,downloadUpdate:()=>Tl,dropOverlayWaiters:()=>gl,emptyTrash:()=>ps,focusClient:()=>yl,gameFeedStatus:()=>Ys,getActiveScreen:()=>Gs,getCaptureSources:()=>$s,getClipDirectory:()=>Ls,getMemoryReport:()=>Us,getPlatformInfo:()=>Ns,hideClipOverlay:()=>ll,hideVrPanel:()=>nl,listClips:()=>as,listTrash:()=>hs,notifyClipSaved:()=>sl,openClipDirectory:()=>Fs,openStudioOverlay:()=>hl,openVrBindings:()=>el,pickAudioFiles:()=>Ps,pickClipDirectory:()=>Vs,pickImageFiles:()=>Ms,pickVideoFiles:()=>Ts,readAudioFile:()=>Cs,readClip:()=>ss,readImageFile:()=>Ds,readLibrary:()=>Ss,readVideoFile:()=>Is,readVoiceTrack:()=>is,registerShortcuts:()=>js,relaunchClient:()=>kl,releaseClipPath:()=>es,renameClip:()=>bs,reserveClipPath:()=>Qa,restoreClip:()=>ds,revealClip:()=>Os,saveClip:()=>Xa,saveVoiceTrack:()=>rs,showClipOverlay:()=>al,showVrPanel:()=>tl,spillClear:()=>ys,spillDrop:()=>vs,spillRead:()=>gs,spillWrite:()=>ms,startGameFeeds:()=>Ks,startVrBridge:()=>Js,stopGameFeeds:()=>Zs,stopVrBridge:()=>Xs,studioOverlayUp:()=>fl,trashClip:()=>us,unregisterShortcuts:()=>qn,vrBridgeStatus:()=>Qs,waitForGameEvent:()=>qs,waitForOverlayAction:()=>ml,waitForShortcut:()=>Hs,waitForVrEvent:()=>rl,writeLibrary:()=>xs});u();var Xt=require("crypto"),y=require("electron"),c=require("fs"),Vi=require("https"),Jt=require("os"),d=require("path");u();var B=require("fs"),Xr=require("http"),Qr=require("https"),ei=require("os"),ut=require("path"),qr=34765,la=6,ti=256*1024,ca=2e3,ua=1500,da="127.0.0.1",ha=2999,pa="gamestate_integration_clipper.cfg",se=null,Ne=0,Nt="",$e=null,lt=[],fa=12,ct=[],Ue=[],Ge={cs2:!1,league:!1};function $t(t){lt.length>=fa||lt.includes(t)||lt.push(t)}var Ut=Promise.resolve();function ot(t){let e=Ue.shift();if(e){e(t);return}ct.push(t),ct.length>16&&ct.shift()}var x={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function ni(){x={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function ma(t){return t>=5?"an ace in Counter-Strike 2":t===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function ga(t){let e=t.provider?.steamid,{player:n}=t;if(!n||!e||!n.steamid||n.steamid!==e)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof t.map?.round=="number"?t.map.round:x.round;(r.kills<x.kills||r.deaths<x.deaths)&&ni();let o=x.kills<0;i!==x.round&&(x.round=i,x.roundKills=0,x.announced=0);let a=r.kills-Math.max(0,x.kills),s=r.deaths-Math.max(0,x.deaths);if(x.kills=r.kills,x.deaths=r.deaths,o)return;a>0&&(x.roundKills+=a,x.roundKills>=3&&x.roundKills>x.announced?(x.announced=x.roundKills,ot({kind:"multikill",note:ma(x.roundKills)})):ot({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&ot({kind:"death",note:"your death in Counter-Strike 2"});let l=t.round?.win_team;l&&n.team&&l===n.team&&t.round?.phase==="over"&&x.roundKills>0&&ot({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function va(){return new Promise(t=>{let e=0,n=(0,Xr.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>ti&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{ga(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++e<la){n.listen(qr+e,"127.0.0.1");return}$t(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}se===n&&(se=null,Ne=0,Ge={...Ge,cs2:!1}),t(0)}),n.on("listening",()=>{se=n,t(n.address().port)}),n.listen(qr,"127.0.0.1")})}function ya(){let t=[],e=(0,ei.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&t.push((0,ut.join)(i,"Steam"))}let n=[];for(let r of t)if((0,B.existsSync)(r)){n.push(r);try{let i=(0,B.readFileSync)((0,ut.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function wa(){for(let t of ya()){let e=(0,ut.join)(t,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,B.existsSync)(e))return e}return""}function ba(t){let e=wa();if(!e)return $t("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,ut.join)(e,pa),r=`"Clipper"
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
`;try{return(0,B.mkdirSync)(e,{recursive:!0}),(0,B.writeFileSync)(n,r,"utf8"),n}catch(i){return $t(`Counter-Strike 2's config could not be written (${i.message})`),""}}function Sa(){let t=Nt;if(Nt="",!!t)try{(0,B.unlinkSync)(t)}catch{}}var at="",Fe=-1,An=!1,Ft=!1;function st(t){return t.split("#")[0].trim().toLowerCase()}function Jr(t){return new Promise(e=>{let n=(0,Qr.get)({host:da,port:ha,path:t,rejectUnauthorized:!1,timeout:ua},r=>{if(r.statusCode!==200){r.resume(),e(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>ti&&n.destroy()}),r.on("end",()=>{try{e(JSON.parse(i))}catch{e(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>e(null))})}function xa(t,e){let n=t.EventName??"",r=st(t.KillerName??"");switch(n){case"ChampionKill":return r===e?{kind:"kill",note:"a kill in League of Legends"}:st(t.VictimName??"")===e?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==e?null:{kind:"multikill",note:`a ${t.KillStreak??3}-kill run in League of Legends`};case"Ace":return st(t.Acer??"")!==e?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return st(t.Recipient??"")!==e?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==e?null:{kind:"objective",note:`${t.DragonType?`the ${t.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==e?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==e?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==e?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function Ea(){if(!Ft){Ft=!0;try{if(!at){let r=await Jr("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;at=st(r),Fe=-1}let t=await Jr("/liveclientdata/eventdata");if(!t?.Events){at="";return}let e=Fe<0,n=Fe;for(let r of t.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=Fe||(n=Math.max(n,i),e))continue;let o=xa(r,at);o&&ot(o)}Fe=n}finally{Ft=!1}}}function Ta(){at="",Fe=-1,Ft=!1,$e=setInterval(()=>{Ea().catch(t=>{An||(An=!0,$t(`League of Legends could not be read (${t.message})`))})},ca)}function ka(t){return t.cs2!==Ge.cs2||t.league!==Ge.league?!1:(!t.cs2||se!==null)&&(!t.league||$e!==null)}function ri(t){let e=Ut.then(async()=>(ka(t)||(ii(),lt=[],t.cs2&&(ni(),Ne=await va(),Ne&&(Nt=ba(Ne))),t.league&&Ta(),Ge={cs2:t.cs2&&se!==null,league:t.league}),Gt()));return Ut=e.catch(()=>{}),e}function ii(){if(Ge={cs2:!1,league:!1},$e&&clearInterval($e),$e=null,An=!1,se)try{se.close()}catch{}se=null,Ne=0,Sa(),ct=[];let t=Ue;Ue=[];for(let e of t)e(null)}function Cn(){let t=Ut.then(()=>ii());return Ut=t.catch(()=>{}),t}function Gt(){return{port:Ne,configPath:Nt,league:$e!==null,problems:[...lt]}}function oi(t){let e=ct.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{Ue=Ue.filter(a=>a!==i),i(null)},t);Ue.push(i)})}u();var le=require("electron"),Bt=require("fs"),ht=require("path"),ai=require("url"),zt=24,si=2600,Wt=220,Ia=300,Pa=56,Mn=!0;function jt(){return Mn}var Se=null,we=null,dt=null,be=null;function Aa(){return!!Se&&!Se.isDestroyed()}function xe(){we&&(clearTimeout(we),we=null);let t=Se;Se=null,t&&!t.isDestroyed()&&t.destroy()}function ze(){be&&(clearTimeout(be),be=null);let t=dt;dt=null,t&&!t.isDestroyed()&&t.destroy()}function Ca(t,e,n){let i=le.screen.getDisplayNearestPoint(le.screen.getCursorScreenPoint()).workArea,o=t==="top-left"||t==="bottom-left",a=t==="top-left"||t==="top-right";return{x:Math.round(o?i.x+zt:i.x+i.width-e-zt),y:Math.round(a?i.y+zt:i.y+i.height-n-zt)}}function pt(t,e){let n=(0,ht.join)(le.app.getPath("userData"),"clipper-overlay");(0,Bt.mkdirSync)(n,{recursive:!0});let r=(0,ht.join)(n,t);return(0,Bt.writeFileSync)(r,e,"utf8"),r}function li(t,e,n,r){let{x:i,y:o}=Ca(r,e,n),a=new le.BrowserWindow({width:e,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(t).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function ci(t){return`<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }
    .card {
        position: absolute; inset: 0; border-radius: 12px; overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 10px 34px rgba(0, 0, 0, 0.6);
        opacity: 0; transform: scale(0.96); transition: opacity ${Wt}ms ease, transform ${Wt}ms ease;
    }
    .card.up { opacity: 1; transform: none; }
    ${t}
</style>`}function Y(t){return JSON.stringify(t).replace(/</g,"\\u003c")}function Ma(t,e){return`<!doctype html>
<html>
<head>
${ci(`.card { background: #000; }
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
    var look = ${Y(e)};
    var video = document.getElementById("video");
    var card = document.getElementById("card");
    document.getElementById("tag").textContent = ${Y((0,ht.basename)(t))};

    var leaving = false;
    function leave() {
        if (leaving) return;
        leaving = true;
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Wt});
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

    video.src = ${Y((0,ai.pathToFileURL)(t).href)};

    // Autoplay with sound is only allowed after a gesture, and this window
    // never gets one. Muted playback is always allowed, so it is the fallback
    // rather than a reason to show nothing.
    video.play().catch(function () {
        video.muted = true;
        video.play().catch(leave);
    });
</script>
</body>
</html>`}function Ra(t,e){return`<!doctype html>
<html>
<head>
${ci(`.card {
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
    document.getElementById("title").textContent = ${Y(t)};
    document.getElementById("note").textContent = ${Y(e)};

    requestAnimationFrame(function () { card.classList.add("up"); });

    setTimeout(function () {
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Wt});
    }, ${si});
</script>
</body>
</html>`}function ui(t,e){if(!Mn)return!1;xe(),ze();let n=Math.max(200,Math.round(e.width)),r=Math.round(n*9/16),i=li(pt("clip.html",Ma(t,e)),n,r,e.corner);Se=i,i.on("closed",()=>{Se===i&&(Se=null,we&&(clearTimeout(we),we=null))});let o=(e.seconds>0?e.seconds:300)+10;return we=setTimeout(()=>xe(),o*1e3),!0}function di(t,e,n){if(!Mn||Aa())return!1;ze();let r=li(pt("toast.html",Ra(t,e)),Ia,Pa,n);return dt=r,r.on("closed",()=>{dt===r&&(dt=null,be&&(clearTimeout(be),be=null))}),be=setTimeout(()=>ze(),si+4e3),!0}le.app.on("will-quit",()=>{xe(),ze()});u();var q=require("electron"),hi=require("url");var Rn="VencordClipperOverlayAction",pi="VencordClipperOverlayReply",_a=108,R=null;function _n(){return!!R&&!R.isDestroyed()}function mt(){let t=R;R=null,t&&!t.isDestroyed()&&t.destroy()}var We=[],ft=[];function Da(t){let e=We.shift();if(e){e(t);return}ft.push(t),ft.length>4&&ft.shift()}function fi(t){let e=ft.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{We=We.filter(a=>a!==i),i(null)},t);We.push(i)})}function mi(){ft=[];let t=We;We=[];for(let e of t)e(null)}function gi(t){!R||R.isDestroyed()||R.webContents.send(pi,t)}q.ipcMain.removeAllListeners(Rn);q.ipcMain.on(Rn,(t,e,n)=>{if(!R||R.isDestroyed()||t.sender!==R.webContents)return;let r=String(e??"");if(r==="close"){mt();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open"&&r!=="link")return;let i=n??{},o=Number(i.from),a=Number(i.to),s=String(i.clip??"");!s||s.length>128||Da({kind:r,clip:s,from:Number.isFinite(o)?Math.min(3600,Math.max(0,o)):0,to:Number.isFinite(a)?Math.min(3600,Math.max(0,a)):0})});function Oa(t,e){let{workArea:n}=q.screen.getDisplayNearestPoint(q.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-t)/2),y:Math.round(n.y+(n.height-e)/2)}}var La=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${Y(Rn)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${Y(pi)}, (_event, reply) => handler(reply));
    }
});
`;function Va(t,e){return`<!doctype html>
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
    var clip = ${Y({name:t.name,url:(0,hi.pathToFileURL)(t.path).href,markers:t.markers})};
    var look = ${Y(e)};
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
</html>`}function vi(t,e){if(!jt())return!1;mt(),xe(),ze();let n=Math.max(360,Math.round(e.width)),r=Math.round(n*9/16)+_a,{x:i,y:o}=Oa(n,r),a=pt("studio-preload.js",La),s=pt("studio.html",Va(t,e)),l=new q.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return R=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{R===l&&(R=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}q.app.on("will-quit",()=>mt());u();function j(t){return`${t.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}u();var ki=require("child_process"),Ii=require("crypto"),Pi=require("electron"),ke=require("fs"),wt=require("path");u();var Fa=`
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
${Fa}
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
`;u();var wi=require("electron"),$=require("fs"),N=require("path"),Ht="vencord.clipper",ce="/actions/clipper",gt=["save","mark","toggle","pov"],Na=["save","mark"],$a={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function On(){let t=(0,N.join)(wi.app.getPath("userData"),"clipper-vr");return(0,$.mkdirSync)(t,{recursive:!0}),t}function Ua(){let t=(0,N.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,$.readFileSync)(t,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,$.existsSync)((0,N.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let e=(0,N.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,$.existsSync)((0,N.join)(e,"bin","win64","openvr_api.dll"))?e:null}function bi(){let t=Ua();return t&&(0,N.join)(t,"bin","win64","openvr_api.dll")}var Ga=.4,za={save:"double",mark:"long"};function Wa(t,e,n){return{path:t,mode:"button",inputs:{[e]:{output:`${ce}/in/${n}`}},parameters:e==="long"?{long_press_delay:Ga}:{}}}function yi(t,e){return{app_key:Ht,controller_type:t,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[ce]:{sources:Na.map(n=>Wa(e[n],za[n],n))}}}}function Si(){let t=On(),e={language_tag:"en_US",[ce]:"Clipper"};for(let o of gt)e[`${ce}/in/${o}`]=$a[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:ce,usage:"leftright"}],actions:gt.map(o=>({name:`${ce}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[e]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,$.writeFileSync)((0,N.join)(t,"bindings_knuckles.json"),JSON.stringify(yi("knuckles",r),null,4),"utf8"),(0,$.writeFileSync)((0,N.join)(t,"bindings_oculus_touch.json"),JSON.stringify(yi("oculus_touch",r),null,4),"utf8");let i=(0,N.join)(t,"actions.json");return(0,$.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function xi(t){let e={source:"builtin",applications:[{app_key:Ht,launch_type:"binary",binary_path_windows:t,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,N.join)(On(),"clipper.vrmanifest");return(0,$.writeFileSync)(n,JSON.stringify(e,null,4),"utf8"),n}function Ln(){return(0,N.join)(On(),"bridge.ps1")}var Ba=15e3,ja=45e3,Ei=3,Ha=3,Ka=2e3,D=null,Kt=!1,te="",_="",Ee="",Te=!1,Fn=0,Ai=0,Be=null,vt=[],yt=null,ue=[],Zt=Promise.resolve();function Ti(t){let e=ue.shift();if(e){e(t);return}if(t.kind==="motion"){yt=t;return}vt.push(t.action),vt.length>8&&vt.shift()}function Za(t){let e=t.trim();if(!e.startsWith("{"))return!1;let n;try{n=JSON.parse(e)}catch{return!1}if(n.t==="ready")return te=String(n.runtime??""),_="",Ee="",Te=!1,!0;if(n.t==="waiting")return te="",_="",Ee=String(n.reason??""),!0;if(n.t==="warning")return _=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return _=String(n.message??"The SteamVR bridge failed for a reason it did not give"),Te=!te||++Ai>=Ha,!0;if(n.t==="action"){let r=gt.find(i=>i===n.name);return r&&Ti({kind:"action",action:r}),!1}return n.t==="motion"&&Ti({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function Vn(){Be||!Kt||Te||(Be=setTimeout(()=>{Be=null,Kt&&Ci()},Ba))}function Ci(){if(D)return Promise.resolve();let t=bi();if(!t)return Vn(),Promise.resolve();let e;try{let n=Ln();(0,ke.writeFileSync)(n,Dn,"utf8");let r=(0,ke.readFileSync)(n,"utf8"),i=a=>(0,Ii.createHash)("sha256").update(a,"utf8").digest("hex");if(i(r)!==i(Dn))throw new Error("The SteamVR bridge script changed between writing and starting it.");let o=(0,wt.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");e=(0,ki.spawn)(o,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",t,"-Actions",Si(),"-Manifest",xi(o),"-AppKey",Ht,"-ActionList",[ce,...gt].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return _=`The SteamVR bridge could not be started (${n.message}).`,Vn(),Promise.resolve()}return D=e,te="",Ee="",Te=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{_="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},ja),a="";e.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let p of l)Za(p)&&i()}),e.stderr?.on("data",()=>{_||(_="The SteamVR bridge printed an error and gave no usable message.")}),e.on("error",s=>{_=`The SteamVR bridge could not be started (${s.message}).`,i()}),e.on("exit",()=>{D===e&&(!te&&!Ee&&!Te?++Fn>=Ei&&(Te=!0,_||(_=`The SteamVR bridge stopped ${Ei} times without saying why. Switch the VR controls off and on again to try it once more.`)):Fn=0,D=null,te="",Ee="");let s=ue;ue=[];for(let l of s)l(null);i(),Vn()})})}function Mi(){Be&&(clearTimeout(Be),Be=null);let t=D;D=null,te="",Ee="",Te=!1,Fn=0,Ai=0,vt=[],yt=null;let e=ue;ue=[];for(let r of e)r(null);if(!t)return;try{t.stdin?.end()}catch{}let n=setTimeout(()=>{try{t.kill()}catch{}},Ka);t.on("exit",()=>clearTimeout(n))}function Ri(t){let e=Zt.then(async()=>(Kt=t,t?(await Ci(),Yt()):(Mi(),_="",Yt())));return Zt=e.catch(()=>{}),e}function Nn(){let t=Zt.then(()=>{Kt=!1,Mi()});return Zt=t.catch(()=>{}),t}function Yt(){return{running:D!==null&&te!=="",runtime:te,problem:_,waiting:Ee}}function _i(){if(!D?.stdin?.writable)return!1;try{return D.stdin.write(`bindings
`),!0}catch{return!1}}var Ya=0;function Di(t,e,n,r){if(!D?.stdin?.writable||e<=0||n<=0||t.length!==e*n*4||e>2048||n>2048||t.length>16*1024*1024)return!1;let i=Math.min(1e4,Math.max(1e3,Math.round(r))),o=(0,wt.join)((0,wt.dirname)(Ln()),`panel-${Ya++%8}.rgba`);try{return(0,ke.writeFileSync)(o,t),D.stdin.write(`panel ${e} ${n} ${i} ${o}
`),!0}catch{try{(0,ke.unlinkSync)(o)}catch{}return!1}}function Oi(){if(!D?.stdin?.writable)return!1;try{return D.stdin.write(`panelhide
`),!0}catch{return!1}}function Li(t=3e4){let e=vt.shift();if(e)return Promise.resolve({kind:"action",action:e});if(yt){let n=yt;return yt=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{ue=ue.filter(a=>a!==i),i(null)},t);ue.push(i)})}Pi.app.on("will-quit",()=>{Nn()});var Fi=!0,Hn=!1,$n=500*1024*1024,Ni=/vesktop|equibop/i.test(y.app.getName());function S(t){let e=t?.trim(),n=e&&(0,d.isAbsolute)(e)?e:(0,d.join)(y.app.getPath("videos"),"DiscordClips"),r=(0,d.normalize)(n),i=r.toUpperCase();if(i.startsWith("\\\\?\\")||i.startsWith("\\\\.\\"))throw new Error("That folder is not a place for clips");if(/(^|[\\/])[. ]+([\\/]|$)/.test(r.replace(/[\\/]+$/,"")))throw new Error("That folder is not a place for clips");let o=r.toLowerCase().replace(/[\\/]+$/,"");for(let a of qa()){let s=(0,d.normalize)(a).toLowerCase().replace(/[\\/]+$/,"");if(o===s||o.startsWith(`${s}\\`)||o.startsWith(`${s}/`))throw new Error("That folder is not a place for clips")}return r}function qa(){let t=[];for(let e of["SystemRoot","windir","ProgramFiles","ProgramFiles(x86)","ProgramW6432"]){let n=process.env[e]?.trim();n&&t.push(n)}try{t.push(Jn())}catch{}try{t.push(y.app.getPath("userData"))}catch{}return t}var Ja=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;function C(t){let n=(0,d.basename)(String(t??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${Ja.test(r[1])?`_${r[1]}`:r[1]}.${r[2].toLowerCase()}`:null}function $i(t){return C(t)??`clip-${Date.now()}.webm`}function Et(t,e){let n=(0,d.extname)(e),r=e.slice(0,e.length-n.length),i=(0,d.join)(t,e),o=2;for(;((0,c.existsSync)(i)||Ie.has(J(i)))&&o<1e3;)i=(0,d.join)(t,`${r} (${o++})${n}`);if((0,c.existsSync)(i)||Ie.has(J(i)))throw new Error(`No free name left for ${e}; rename or clear the folder`);return i}var je=new Map;function Ui(t,e){let n=`${t}.tmp-${process.pid}-${Date.now()}`;(0,c.writeFileSync)(n,Buffer.from(e));try{(0,c.renameSync)(n,t)}catch(r){try{(0,c.unlinkSync)(n)}catch{}throw r}}function Xa(t,e,n,r,i=!1){if(r.length>$n)throw new Error("That clip is too large to write");let o=S(e);(0,c.mkdirSync)(o,{recursive:!0});let a=$i(n),s=(0,d.join)(o,a),l=(je.get(s)??Promise.resolve()).catch(()=>{}).then(async()=>{let p=i?Et(o,a):(0,d.join)(o,a);return Ui(p,r),p});return l.then(()=>{je.get(s)===l&&je.delete(s)},()=>{je.get(s)===l&&je.delete(s)}),je.set(s,l),l}var Ie=new Set;function Qa(t,e,n){let r=S(e);(0,c.mkdirSync)(r,{recursive:!0});let i=Et(r,$i(n));if(!Ie.has(J(i)))return Ie.add(J(i)),i;let o=(0,d.extname)(i),a=i.slice(0,i.length-o.length),s=1,l=`${a}-${s}${o}`;for(;Ie.has(J(l))||(0,c.existsSync)(l);)l=`${a}-${++s}${o}`;return Ie.add(J(l)),l}function es(t,e){typeof e!="string"||!(0,d.isAbsolute)(e)||C((0,d.basename)(e)??"")&&Ie.delete(J(e))}var Tt="voices";function ts(t,e){let n=C(t);return!n||!/^\d{1,25}$/.test(String(e??""))?null:`${n.slice(0,n.length-(0,d.extname)(n).length)}.${e}.webm`}function ns(t,e){let n=C(e);if(!n)return[];let r=(0,d.join)(S(t),Tt);if(!(0,c.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,d.extname)(n).length)}.`,o=[];for(let a of(0,c.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function rs(t,e,n,r,i){let o=ts(n,r);if(!o)return null;if(i.length>Un)throw new Error("That voice track is too large to write");let a=(0,d.join)(S(e),Tt);(0,c.mkdirSync)(a,{recursive:!0});let s=(0,d.join)(a,o);return Ui(s,i),s}var Un=64*1024*1024;function is(t,e,n){let r=(0,d.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");let i=(0,d.join)(S(e),Tt,r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>Un)throw new Error("That voice track is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>Un)throw new Error("That voice track is too large to open");return s}finally{(0,c.closeSync)(o)}}function os(t,e){let n=(0,d.join)(S(t),Tt);for(let{file:r}of ns(t,e))try{(0,c.unlinkSync)((0,d.join)(n,r))}catch{}}function as(t,e){let n=S(e);if(!(0,c.existsSync)(n))return[];try{Wi(n)}catch{}let r=[],i=new Set,o=(0,c.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,d.join)(n,a.name);try{let l=(0,c.statSync)(s),p=j(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(p)?{thumb:p}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function ss(t,e,n){let r=C(n);if(!r)throw new Error("That is not a clip name");let i=(0,d.join)(S(e),r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>$n)throw new Error("That clip is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>$n)throw new Error("That clip is too large to open");return s}finally{(0,c.closeSync)(o)}}var ls=".trash",Gi=".trash.json",cs=168*3600*1e3;function kt(t){return(0,d.join)(t,ls)}function It(t){let e;try{e=JSON.parse((0,c.readFileSync)((0,d.join)(t,Gi),"utf8"))}catch{return{}}if(!e||typeof e!="object")return{};let n={};for(let[r,i]of Object.entries(e))/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.test(r)&&(!i||typeof i!="object"||i.stored!==r||(n[r]=i));return n}function He(t,e){(0,c.mkdirSync)(t,{recursive:!0}),(0,c.writeFileSync)((0,d.join)(t,Gi),JSON.stringify(e))}function zi(t,e){if(!e)return;let n=(0,d.join)(t,Tt),r;try{r=(0,c.readdirSync)(n)}catch{return}for(let i of r)if(i.startsWith(`${e}.`)&&i.toLowerCase().endsWith(".webm"))try{(0,c.unlinkSync)((0,d.join)(n,i))}catch{}}function Wi(t){let e=kt(t);if(!(0,c.existsSync)(e))return;let n=It(e),r=Date.now(),i=!1;for(let[o,a]of Object.entries(n))if(!(!a||r-(a.deletedAt??0)<cs)){for(let s of[o,j(o)])try{(0,c.unlinkSync)((0,d.join)(e,s))}catch{}zi(t,(a.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,"")),delete n[o],i=!0}i&&He(e,n)}function us(t,e,n,r){let i=C(n);if(!i)throw new Error("That is not a clip name");if(r!==null&&(typeof r!="string"||r.length>1024*1024))throw new Error("That metadata is not metadata");let o=S(e),a=(0,d.join)(o,i);if(!(0,c.existsSync)(a))throw new Error("That clip is already gone");let s=kt(o);(0,c.mkdirSync)(s,{recursive:!0});let l=Et(s,i).split(/[\\/]/).pop()||i;(0,c.renameSync)(a,(0,d.join)(s,l));let p=j(i);if((0,c.existsSync)((0,d.join)(o,p)))try{(0,c.renameSync)((0,d.join)(o,p),(0,d.join)(s,j(l)))}catch{}let f=It(s);f[l]={stored:l,name:i,deletedAt:Date.now(),meta:r},He(s,f)}function ds(t,e,n){let r=C(n);if(!r)throw new Error("That is not a clip name");let i=S(e),o=kt(i),a=It(o),s=a[r];if(!s||!(0,c.existsSync)((0,d.join)(o,r)))throw delete a[r],He(o,a),new Error("That clip is no longer in the trash");let l=C(s.name);if(!l)throw delete a[r],He(o,a),new Error("That trash entry names nothing restorable");let p=Et(i,l).split(/[\\/]/).pop()||l;(0,c.renameSync)((0,d.join)(o,r),(0,d.join)(i,p));let f=j(r);if((0,c.existsSync)((0,d.join)(o,f)))try{(0,c.renameSync)((0,d.join)(o,f),(0,d.join)(i,j(p)))}catch{}return delete a[r],He(o,a),{name:p,meta:s.meta??null}}function hs(t,e){let n=S(e);Wi(n);let r=kt(n),i=It(r),o=[];for(let[a,s]of Object.entries(i)){if(!s)continue;let l=0;try{l=(0,c.statSync)((0,d.join)(r,a)).size}catch{delete i[a];continue}let p="";try{let f=s.meta?JSON.parse(s.meta):null;f&&typeof f.game=="string"&&(p=f.game)}catch{}o.push({stored:a,name:s.name??a,size:l,deletedAt:s.deletedAt??0,game:p})}return o.sort((a,s)=>a.deletedAt-s.deletedAt)}function ps(t,e){let n=S(e),r=kt(n);if((0,c.existsSync)(r)){for(let[i,o]of Object.entries(It(r))){for(let a of[i,j(i)])try{(0,c.unlinkSync)((0,d.join)(r,a))}catch{}o&&zi(n,(o.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,""))}He(r,{})}}var Bi=32*1024*1024;function fs(){let t=(0,d.join)((0,Jt.tmpdir)(),`clipper-spill-${process.pid}`);return(0,c.mkdirSync)(t,{recursive:!0}),t}function Kn(t){if(!/^spill-\d+-[a-z0-9]+$/i.test(t))throw new Error("That is not a spill file");return(0,d.join)(fs(),`${t}.frag`)}function ms(t,e,n){if(n.length>Bi)throw new Error("That spill chunk is too large");(0,c.writeFileSync)(Kn(e),Buffer.from(n))}function gs(t,e){let n=Kn(e),r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>Bi)throw new Error("That spill chunk is too large");return new Uint8Array((0,c.readFileSync)(r))}finally{(0,c.closeSync)(r)}}function vs(t,e){for(let n of e)try{(0,c.unlinkSync)(Kn(n))}catch{}}function ys(){let t=`clipper-spill-${process.pid}`,e;try{e=(0,c.readdirSync)((0,Jt.tmpdir)())}catch{return}for(let n of e){if(!n.startsWith("clipper-spill-"))continue;let r=(0,d.join)((0,Jt.tmpdir)(),n);if(n!==t){let i=0;try{i=Date.now()-(0,c.statSync)(r).mtimeMs}catch{continue}if(i<24*3600*1e3)continue}try{(0,c.rmSync)(r,{recursive:!0,force:!0})}catch{}}}async function ws(t,e,n){let r=S(e),i=C(n);if(!i)throw new Error("That is not a clip name");let o=(0,d.join)(r,i);try{await y.shell.trashItem(o)}catch{(0,c.unlinkSync)(o)}os(e,i);let a=(0,d.join)(r,j(i));if((0,c.existsSync)(a))try{await y.shell.trashItem(a)}catch{try{(0,c.unlinkSync)(a)}catch{}}}function bs(t,e,n,r){let i=S(e),o=C(n);if(!o)throw new Error("That is not a clip name");let a=(0,d.join)(i,o),s=(0,d.extname)(o),l=C(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let f=l.toLowerCase()===o.toLowerCase()?(0,d.join)(i,l):Et(i,l);(0,c.renameSync)(a,f);let h=(0,d.join)(i,j(o));if((0,c.existsSync)(h))try{(0,c.renameSync)(h,(0,d.join)(i,j((0,d.basename)(f))))}catch{}return(0,d.basename)(f)}var ji="clipper-library.json",Gn=5*1024*1024;function Ss(t,e){let n=(0,d.join)(S(e),ji);if(!(0,c.existsSync)(n))return"";try{let r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>Gn)return"";let o=new Uint8Array((0,c.readFileSync)(r));return o.length>Gn?"":Buffer.from(o).toString("utf8")}finally{(0,c.closeSync)(r)}}catch{return""}}function xs(t,e,n){let r=S(e);if((0,c.mkdirSync)(r,{recursive:!0}),String(n??"").length>Gn)throw new Error("That library document is too large to write");let i=(0,d.join)(r,ji),o=`${i}.tmp`;(0,c.writeFileSync)(o,String(n??""),"utf8"),(0,c.renameSync)(o,i)}var Hi="clipper-imports.json",Ki=200,St=new Set;function J(t){return(0,d.normalize)(t).toLowerCase()}function Es(){try{(0,c.writeFileSync)((0,d.join)(y.app.getPath("userData"),Hi),JSON.stringify([...St].slice(-Ki)),"utf8")}catch{}}try{let t=(0,c.readFileSync)((0,d.join)(y.app.getPath("userData"),Hi),"utf8"),e=JSON.parse(t);if(Array.isArray(e))for(let n of e.slice(-Ki))typeof n=="string"&&(0,d.isAbsolute)(n)&&St.add(J(n))}catch{}function Zn(t){let e=!1;for(let n of t){if(typeof n!="string"||!(0,d.isAbsolute)(n))continue;let r=J(n);St.has(r)||(St.add(r),e=!0)}return e&&Es(),t}function Yn(t,e){if(typeof t!="string"||!(0,d.isAbsolute)(t)||!St.has(J(t)))throw new Error(`That ${e} was not picked for import`);return t}async function Ts(t){let e=await y.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return e.canceled?[]:Zn(e.filePaths)}var ks=512*1024*1024;function Is(t,e){if(Yn(e,"video"),!/\.(mp4|webm|mkv|mov|m4v)$/i.test(e))throw new Error("Not a video file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>ks){let i=Math.round(r/1048576);throw new Error(`That video is ${i} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function Ps(t){let e=await y.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return e.canceled?[]:Zn(e.filePaths)}var As=64*1024*1024;function Cs(t,e){if(Yn(e,"audio file"),!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(e))throw new Error("Not an audio file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>As){let i=Math.round(r/1048576);throw new Error(`That sound is ${i} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function Ms(t){let e=await y.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return e.canceled?[]:Zn(e.filePaths)}var Rs=24*1024*1024,_s=64*1024*1024;function Ds(t,e){if(Yn(e,"picture or clip"),!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(e))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(e),r=n?_s:Rs,i=(0,c.openSync)(e,"r");try{let{size:o}=(0,c.fstatSync)(i);if(o>r){let a=Math.round(o/1048576),s=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${a} MB; the montage caps them at ${s} MB.`)}return new Uint8Array((0,c.readFileSync)(i))}finally{(0,c.closeSync)(i)}}function Os(t,e,n){let r=C(n);if(!r)throw new Error("That is not a clip name");y.shell.showItemInFolder((0,d.join)(S(e),r))}function Ls(t,e){return S(e)}async function Vs(t,e){let n;try{n=S(e)}catch{n=(0,d.join)(y.app.getPath("videos"),"DiscordClips")}let r=await y.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:n,properties:["openDirectory","createDirectory"]});return r.canceled?"":r.filePaths[0]??""}function Fs(t,e){let n=S(e);(0,c.mkdirSync)(n,{recursive:!0}),y.shell.openPath(n)}function Ns(t){return{platform:"win32",wayland:Hn,vesktop:Ni,overlay:jt()}}var de=new Set;async function $s(t,e=!0){if(Hn)return[];let n=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:e?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(de.size){let i=new Set(n.map(o=>o.id));for(let o of de)i.has(o)||de.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!e){if(!o&&de.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if(Fi&&!o&&a){de.add(i.id);continue}de.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function Us(t){try{return y.app.getAppMetrics().map(e=>({type:e.serviceName||e.type,mb:Math.round((e.memory?.workingSetSize??0)/1024)})).filter(e=>e.mb>0).sort((e,n)=>n.mb-e.mb)}catch{return[]}}async function Gs(t){if(Hn)return"";let e=await y.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!e.length)return"";try{let n=y.screen.getDisplayNearestPoint(y.screen.getCursorScreenPoint()),r=e.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return e[0].id}var zn="",Wn=!1;function zs(t,e,n=!0){return!n||Ni?!1:(zn=e??"",Wn=!0,y.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(p=>p.id===zn),l=(a&&!de.has(a.id)?a:void 0)??o.find(p=>p.id.startsWith("screen:"))??o.find(p=>!de.has(p.id));if(!l){i({});return}i(Fi&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function Ws(t){zn="",Wn&&(Wn=!1,y.session.defaultSession.setDisplayMediaRequestHandler(null))}var Bn=new Map,he=[],bt=[];function Bs(t){let e=he.shift();if(e){e(t);return}bt.push(t),bt.length>8&&bt.shift()}function js(t,e){qn();let n=[];for(let[r,i]of Object.entries(e)){if(r!=="save"&&r!=="toggle"&&r!=="mark"&&r!=="pov"&&r!=="replay"||!i)continue;let o=!1;try{o=y.globalShortcut.register(i,()=>Bs(r))}catch{o=!1}o?Bn.set(r,i):n.push(i)}return n}function qn(t){for(let n of Bn.values())try{y.globalShortcut.unregister(n)}catch{}Bn.clear(),bt=[];let e=he;he=[];for(let n of e)n(null)}function Hs(t,e=3e4){let n=bt.shift();if(n)return Promise.resolve(n);let r=Math.min(12e4,Math.max(1e3,Number(e)||3e4));return he.length>32&&he.shift()?.(null),new Promise(i=>{let o=!1,a=l=>{o||(o=!0,clearTimeout(s),i(l))},s=setTimeout(()=>{he=he.filter(l=>l!==a),a(null)},r);he.push(a)})}y.app.on("will-quit",()=>qn());function Ks(t,e){return ri(e)}function Zs(t){return Cn()}function Ys(t){return Gt()}function qs(t,e=3e4){return oi(e)}function Js(t,e){return Ri(e)}function Xs(t){return Nn()}function Qs(t){return Yt()}function el(t){return _i()}function tl(t,e,n,r,i){return Di(new Uint8Array(e),n,r,i)}function nl(t){return Oi()}function rl(t,e=3e4){return Li(e)}y.app.on("will-quit",()=>{Cn()});var il=["top-left","top-right","bottom-left","bottom-right"];function Ke(t,e,n,r){let i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(e,Math.round(i))):r}function Zi(t){return il.includes(t)?t:"bottom-right"}function ol(t){return{corner:Zi(t?.corner),width:Ke(t?.width,200,1280,420),volume:Ke(t?.volume,0,100,0),seconds:Ke(t?.seconds,0,300,10)}}function jn(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function al(t,e,n,r){let i=C(n);if(!i)return!1;let o=(0,d.join)(S(e),i);return(0,c.existsSync)(o)?ui(o,ol(r)):!1}function sl(t,e,n,r){return y.BrowserWindow.getFocusedWindow()||_n()?!1:di(jn(e,60),jn(n,90),Zi(r))}function ll(t){xe()}var cl=200;function ul(t){return Array.isArray(t)?t.map(Number).filter(e=>Number.isFinite(e)&&e>=0).slice(0,cl):[]}function dl(t){return{width:Ke(t?.width,360,1600,720),volume:Ke(t?.volume,0,100,0)}}function hl(t,e,n,r,i){let o=C(n);if(!o)return!1;let a=(0,d.join)(S(e),o);return(0,c.existsSync)(a)?vi({name:o,path:a,markers:ul(r)},dl(i)):!1}function pl(t){mt()}function fl(t){return _n()}function ml(t,e=3e4){return fi(Ke(e,1e3,12e4,3e4))}function gl(t){mi()}function vl(t,e,n,r){gi({ok:!!e,message:jn(n,120),close:!!r})}function yl(t){let e=y.BrowserWindow.fromWebContents(t.sender);!e||e.isDestroyed()||(e.isMinimized()&&e.restore(),e.show(),e.focus())}var xt="kebab1337420/Clibab",wl=`VencordClipper (+https://github.com/${xt})`,qt=256*1024*1024;function bl(t){let e="";try{let n=new URL(t);if(n.protocol!=="https:")return!1;e=n.hostname.toLowerCase()}catch{return!1}return e==="api.github.com"||e==="github.com"||e==="codeload.github.com"||e==="raw.githubusercontent.com"||e==="objects.githubusercontent.com"||e.endsWith(".githubusercontent.com")}function Qt(t,e=0){return bl(t)?new Promise((n,r)=>{let i=(0,Vi.get)(t,{headers:{"User-Agent":wl,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),e>=5?r(new Error(`Too many redirects for ${t}`)):n(Qt(new URL(s,t).toString(),e+1));return}let l=[],p=0,{"content-length":f}=o.headers;if(f&&Number(f)>qt){o.destroy(new Error(`${t} answered ${f} bytes, over the ${qt} byte cap`));return}o.on("data",h=>{if(p+=h.length,p>qt){o.destroy(new Error(`${t} exceeded the ${qt} byte cap`));return}l.push(h)}),o.on("end",()=>n({status:a,body:Buffer.concat(l)})),o.on("error",r)});i.setTimeout(6e4,()=>i.destroy(new Error(`${t} timed out`))),i.on("error",r)}):Promise.reject(new Error(`Refusing to fetch outside the update hosts: ${t}`))}async function Sl(t){let{status:e,body:n}=await Qt(t);if(e!==200)throw new Error(`${t} answered ${e}`);return n}function Jn(){return __dirname}function Yi(t){return(0,c.existsSync)((0,d.join)(t,"patcher.js"))&&(0,c.existsSync)((0,d.join)(t,"renderer.js"))}function qi(t){try{return(0,c.accessSync)(t,c.constants.W_OK),!0}catch{return!1}}function Ji(t,e){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(t),i=n(e);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function xl(t,e){let n=await Sl(`https://api.github.com/repos/${xt}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=Jn();return{version:o,tag:i,available:!!o&&Ji(o,e),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${xt}/releases`),directory:a,writable:Yi(a)&&qi(a)}}async function El(t){let{status:e,body:n}=await Qt(`https://raw.githubusercontent.com/${xt}/${t}/prebuilt/build-info.json`);if(e===404)return null;if(e!==200)throw new Error(`The release's file list answered ${e}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return r}async function Tl(t,e,n){if(!/^[\w.-]{1,40}$/.test(e))throw new Error(`Refusing to fetch a release named ${e}`);if(!Ji(e.replace(/^v/i,""),String(n??"")))throw new Error(`Refusing to install ${e}: it is not newer than the installed bundle`);let r=Jn();if(!Yi(r))throw new Error(`No installed bundle at ${r}`);if(!qi(r))throw new Error(`${r} is read-only`);let i=await El(e);if(!i)throw new Error(`The release under ${e} carries no file list; refusing to install it unchecked`);let o=Object.keys(i),a=(0,d.join)(r,`.clipper-update-${(0,Xt.randomBytes)(8).toString("hex")}`);if((0,c.existsSync)(a))throw new Error("An update staging folder is already there; refusing to share it");(0,c.mkdirSync)(a,{recursive:!0});try{let s=[];for(let h of o){if(h!==(0,d.basename)(h)||h.startsWith("."))throw new Error(`Refusing a release file named ${h}`);let{status:v,body:k}=await Qt(`https://raw.githubusercontent.com/${xt}/${e}/prebuilt/dist/${h}`);if(v!==200)throw new Error(`${h} answered ${v}`);if(k.length===0)throw new Error(`${h} came back empty`);let O=i[h];if(O?.size===void 0||!O?.sha256)throw new Error(`${h} has no size and hash in the release's file list`);if(k.length!==O.size)throw new Error(`${h} is ${k.length} bytes, the release says ${O.size}`);if((0,Xt.createHash)("sha256").update(k).digest("hex").toLowerCase()!==O.sha256.toLowerCase())throw new Error(`${h} does not match its hash`);(0,c.writeFileSync)((0,d.join)(a,h),k),s.push(h)}if(s.length===0)throw new Error(`There is no bundle published under ${e}`);for(let h of["renderer.js","patcher.js"])if(!s.includes(h))throw new Error(`The release carries no ${h}`);if(!(0,c.readFileSync)((0,d.join)(a,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let l=(0,d.join)(a,".previous");(0,c.mkdirSync)(l,{recursive:!0});let p=[],f=[];try{for(let h of s){let v=(0,d.join)(r,h);(0,c.existsSync)(v)&&((0,c.renameSync)(v,(0,d.join)(l,h)),p.push(h)),(0,c.renameSync)((0,d.join)(a,h),v),f.push(h)}}catch(h){for(let v of f)try{(0,c.unlinkSync)((0,d.join)(r,v))}catch{}for(let v of p)try{(0,c.renameSync)((0,d.join)(l,v),(0,d.join)(r,v))}catch{}throw new Error(`The update could not be put in place (${h.message}). The bundle that was there has been put back.`)}return s}finally{(0,c.rmSync)(a,{recursive:!0,force:!0})}}function kl(t){y.app.relaunch(),y.app.quit(),setTimeout(()=>y.app.exit(0),3e3)}var Xi={AppleMusicRichPresence:gn,ConsoleShortcuts:vn,FixSpotifyEmbeds:Gr,FixYoutubeEmbeds:Wr,OpenInApp:En,Translate:Tn,VoiceMessages:kn,XSOverlay:In,YoutubeAdblock:Yr,Clipper:Xn};var Qi={};for(let[t,e]of Object.entries(Xi)){let n=Object.entries(e);if(!n.length)continue;let r=Qi[t]={};for(let[i,o]of n){let a=`VencordPluginNative_${t}_${i}`;Qn.ipcMain.handle(a,o),r[i]=a}}Qn.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=Qi});u();function er(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}Oe();var b=require("electron");u();var eo="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var Pe=require("fs"),fe=require("fs/promises"),uo=require("os"),ar=require("path");u();Oe();var Ze=require("electron");u();var tr=require("electron"),H=["connect-src"],U=[...H,"img-src"],ro=["style-src","font-src"],to=[...U,"media-src"],E=[...U,...ro],no=[...E,"script-src","worker-src"],rr={"http://localhost:*":E,"http://127.0.0.1:*":E,"localhost:*":E,"127.0.0.1:*":E,"*.github.io":E,"github.com":E,"raw.githubusercontent.com":E,"*.gitlab.io":E,"gitlab.com":E,"*.codeberg.page":E,"codeberg.org":E,"*.githack.com":E,"jsdelivr.net":E,"fonts.googleapis.com":ro,"i.imgur.com":U,"i.ibb.co":U,"i.pinimg.com":U,"files.catbox.moe":E,"cdn.discordapp.com":E,"media.discordapp.net":U,"cdnjs.cloudflare.com":no,"cdn.jsdelivr.net":no,"api.github.com":H,"ws.audioscrobbler.com":H,"musicbrainz.org":H,"*.listenbrainz.org":H,"coverartarchive.org":H,"archive.org":H,"*.archive.org":H,"translate-pa.googleapis.com":H,"*.vencord.dev":U,"manti.vendicated.dev":U,"decor.fieryflames.dev":H,"ugc.decor.fieryflames.dev":U,"sponsor.ajay.app":H,"dearrow-thumb.ajay.app":U,"usrbg.is-hardly.online":U,"icons.duckduckgo.com":U,"*.tenor.com":to,"*.tenor.co":to},nr=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),Il=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},Pl=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),Al=t=>{let e=nr(t,"content-security-policy-report-only");e&&delete t[e];let n=nr(t,"content-security-policy");if(n){let r=Il(t[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(Z.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(rr))for(let s of a)i(s,o);t[n]=[Pl(r)]}};function io(){tr.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&Al(t),e==="stylesheet")){let r=nr(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),tr.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function oo(){Ze.ipcMain.handle("VencordCspRemoveOverride",_l),Ze.ipcMain.handle("VencordCspRequestAddOverride",Rl),Ze.ipcMain.handle("VencordCspIsDomainAllowed",Dl)}function Cl(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!E.includes(n)))}function Ml(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Vesktop for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let a=e.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function Rl(t,e,n,r){if(!Cl(e,n))return"invalid";let i=new URL(e).host;if(i in Z.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await Ze.dialog.showMessageBox({...Ml(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(Z.store.customCspRules[i]=n,"ok"):"unchecked"}function _l(t,e){return e in Z.store.customCspRules?(delete Z.store.customCspRules[e],!0):!1}function Dl(t,e,n){try{let r=new URL(e).host,i=rr[r]??Z.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}u();var Ol=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,Ll=/^\\@/;function ir(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function ao(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function so(t,e){if(!t)return ir(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return ir(e);let r={},i="",o="";for(let a of n.split(Ol))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace(Ll,"@");return r[i]=o.trim(),delete r[""],ir(e,r)}u();var Ye=require("path");function pe(t,e){let n=(0,Ye.normalize)(t+"/"),r=(0,Ye.join)(t,e),i=(0,Ye.normalize)(r);return i===(0,Ye.normalize)(t)||i.startsWith(n)?i:null}u();var lo=require("electron");function co(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":lo.shell.openExternal(e)}return{action:"deny"}})}var Vl=(0,ar.join)(__dirname,"vencordDesktopRenderer.css");(0,Pe.mkdirSync)(ae,{recursive:!0});oo();function ho(){return(0,fe.readFile)(Ve,"utf-8").catch(()=>"")}async function Fl(){let t=await(0,fe.readdir)(ae).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await po(n).then(ao).catch(()=>null);r!=null&&e.push(so(r,n))}return e}function po(t){t=t.replace(/\?v=\d+$/,"");let e=pe(ae,t);return e?(0,fe.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}b.ipcMain.handle("VencordOpenQuickCss",()=>b.shell.openPath(Ve));b.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!Fr.includes(n))throw"Disallowed protocol.";b.shell.openExternal(e).catch(r=>console.error("[Vencord] Failed to open external link",e,r))});b.ipcMain.handle("VencordGetQuickCss",()=>ho());b.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,Pe.writeFileSync)(Ve,e));b.ipcMain.handle("VencordGetThemesList",()=>Fl());b.ipcMain.handle("VencordGetThemeData",(t,e)=>po(e));b.ipcMain.handle("VencordGetThemeSystemValues",()=>{let t=b.systemPreferences.getAccentColor?.()??"";return t.length&&t[0]!=="#"&&(t=`#${t}`),{"os-accent-color":t}});b.ipcMain.handle("VencordOpenThemesFolder",()=>b.shell.openPath(ae));b.ipcMain.handle("VencordOpenSettingsFolder",()=>b.shell.openPath(ve));var or=[];b.ipcMain.handle("VencordInitFileWatchers",({sender:t})=>{or.forEach(i=>i.close());let e,n;(0,fe.open)(Ve,"a+").then(i=>{i.close(),e=(0,Pe.watch)(Ve,{persistent:!1},er(async()=>{t.postMessage("VencordQuickCssUpdate",await ho())},50))}).catch(()=>{});let r=(0,Pe.watch)(ae,{persistent:!1},er(()=>{t.postMessage("VencordThemeUpdate",void 0)}));or=[e,r,n].filter(Boolean),t.once("destroyed",()=>{e?.close(),r.close(),n?.close(),or=[]})});b.ipcMain.on("VencordGetMonacoTheme",t=>{t.returnValue=b.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});b.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=b.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new b.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:b.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,ar.join)(__dirname,"vencordDesktopPreload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});co(n),await n.loadURL(`data:text/html;base64,${eo}`)});b.ipcMain.handle("VencordGetRendererCss",()=>(0,fe.readFile)(Vl,"utf-8"));b.ipcMain.on("VencordSupportsWindowsMaterial",t=>{t.returnValue=Number((0,uo.release)().split(".")[2])>=22621});var Ce=require("electron"),Lo=require("path"),mr=require("url");u();var sn=require("electron");u();var go=require("module"),Nl=(0,go.createRequire)("/"),qe,tn,lr,$l=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{qe=Nl("worker_threads"),tn=qe.Worker,lr=qe.isMarkedAsUntransferable}catch{}var Ul=tn?function(t,e,n,r,i){var o=!1,a=new tn(t+$l,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return lr&&(r=r.filter(function(s){return!lr(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,tn.prototype.terminate.call(a)},a}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},A=Uint8Array,Ae=Uint16Array,vo=Int32Array,ur=new A([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),dr=new A([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),yo=new A([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),wo=function(t,e){for(var n=new Ae(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new vo(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},qe=wo(ur,2),hr=qe.b,Gl=qe.r;hr[28]=258,Gl[258]=28;var bo=wo(dr,0),So=bo.b,sd=bo.r,on=new Ae(32768);for(w=0;w<32768;++w)ne=(w&43690)>>1|(w&21845)<<1,ne=(ne&52428)>>2|(ne&13107)<<2,ne=(ne&61680)>>4|(ne&3855)<<4,on[w]=((ne&65280)>>8|(ne&255)<<8)>>1;var ne,w,Je=(function(t,e,n){for(var r=t.length,i=0,o=new Ae(e);i<r;++i)t[i]&&++o[t[i]-1];var a=new Ae(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new Ae(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var p=i<<4|t[i],f=e-t[i],h=a[t[i]-1]++<<f,v=h|(1<<f)-1;h<=v;++h)s[on[h]>>l]=p}else for(s=new Ae(r),i=0;i<r;++i)t[i]&&(s[i]=on[a[t[i]-1]++]>>15-t[i]);return s}),Pt=new A(288);for(w=0;w<144;++w)Pt[w]=8;var w;for(w=144;w<256;++w)Pt[w]=9;var w;for(w=256;w<280;++w)Pt[w]=7;var w;for(w=280;w<288;++w)Pt[w]=8;var w,xo=new A(32);for(w=0;w<32;++w)xo[w]=5;var w;var Eo=Je(Pt,9,1);var To=Je(xo,5,1),nn=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},G=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},rn=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},ko=function(t){return(t+7)/8|0},an=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new A(t.subarray(e,n))};var Io=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],I=function(t,e,n){var r=new Error(e||Io[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,I),!n)throw r;return r},Po=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new A(0);var a=!n,s=a||e.i!=2,l=e.i;a&&(n=new A(i*3));var p=function(Sr){var xr=n.length;if(Sr>xr){var Er=new A(Math.max(xr*2,Sr));Er.set(n),n=Er}},f=e.f||0,h=e.p||0,v=e.b||0,k=e.l,O=e.d,K=e.m,L=e.n,V=i*8;do{if(!k){f=G(t,h,1);var re=G(t,h+1,3);if(h+=3,re)if(re==1)k=Eo,O=To,K=9,L=5;else if(re==2){var Xe=G(t,h,31)+257,At=G(t,h+10,15)+4,me=Xe+G(t,h+5,31)+1;h+=14;for(var F=new A(me),Re=new A(19),T=0;T<At;++T)Re[yo[T]]=G(t,h+T*3,7);h+=At*3;for(var Qe=nn(Re),Vo=(1<<Qe)-1,Fo=Je(Re,Qe,1),T=0;T<me;){var gr=Fo[G(t,h,Vo)];h+=gr&15;var P=gr>>4;if(P<16)F[T++]=P;else{var _e=0,Ct=0;for(P==16?(Ct=3+G(t,h,3),h+=2,_e=F[T-1]):P==17?(Ct=3+G(t,h,7),h+=3):P==18&&(Ct=11+G(t,h,127),h+=7);Ct--;)F[T++]=_e}}var vr=F.subarray(0,Xe),ie=F.subarray(Xe);K=nn(vr),L=nn(ie),k=Je(vr,K,1),O=Je(ie,L,1)}else I(1);else{var P=ko(h)+4,ee=t[P-4]|t[P-3]<<8,Me=P+ee;if(Me>i){l&&I(0);break}s&&p(v+ee),n.set(t.subarray(P,Me),v),e.b=v+=ee,e.p=h=Me*8,e.f=f;continue}if(h>V){l&&I(0);break}}s&&p(v+131072);for(var No=(1<<K)-1,$o=(1<<L)-1,ln=h;;ln=h){var _e=k[rn(t,h)&No],De=_e>>4;if(h+=_e&15,h>V){l&&I(0);break}if(_e||I(2),De<256)n[v++]=De;else if(De==256){ln=h,k=null;break}else{var yr=De-254;if(De>264){var T=De-257,et=ur[T];yr=G(t,h,(1<<et)-1)+hr[T],h+=et}var cn=O[rn(t,h)&$o],un=cn>>4;cn||I(3),h+=cn&15;var ie=So[un];if(un>3){var et=dr[un];ie+=rn(t,h)&(1<<et)-1,h+=et}if(h>V){l&&I(0);break}s&&p(v+131072);var wr=v+yr;if(v<ie){var br=o-ie,Uo=Math.min(ie,wr);for(br+v<0&&I(3);v<Uo;++v)n[v]=r[br+v]}for(;v<wr;++v)n[v]=n[v-ie]}}e.l=k,e.p=ln,e.b=v,e.f=f,k&&(f=1,e.m=K,e.d=O,e.n=L)}while(!f);return v!=n.length&&a?an(n,0,v):n.subarray(0,v)};var zl=new A(0);var Wl=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},fo=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){e+=";"+l+"=";var p=s.toString();if(s.prototype)if(p.indexOf("[native code]")!=-1){var f=p.indexOf(" ",8)+1;e+=p.slice(f,p.indexOf("(",f))}else{e+=p;for(var h in s.prototype)e+=";"+l+".prototype."+h+"="+s.prototype[h].toString()}else e+=p}else n[l]=s}return e},en=[],Bl=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},jl=function(t,e,n,r){if(!en[n]){for(var i="",o={},a=t.length-1,s=0;s<a;++s)i=fo(t[s],i,o);en[n]={c:fo(t[a],i,o),e:o}}var l=Wl({},en[n].e);return Ul(en[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,Bl(l),r)},Hl=function(){return[A,Ae,vo,ur,dr,yo,hr,So,Eo,To,on,Io,Je,nn,G,rn,ko,an,I,Po,pr,Ao,Co]};var Ao=function(t){return postMessage(t,[t.buffer])},Co=function(t){return t&&{out:t.size&&new A(t.size),dictionary:t.dictionary}},Kl=function(t,e,n,r,i,o){var a=jl(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([t,e],e.consume?[t.buffer]:[]),function(){a.terminate()}};var X=function(t,e){return t[e]|t[e+1]<<8},z=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},sr=function(t,e){return z(t,e)+z(t,e+4)*4294967296};function Zl(t,e,n){return n||(n=e,e={}),typeof n!="function"&&I(7),Kl(t,e,[Hl],function(r){return Ao(pr(r.data[0],Co(r.data[1])))},1,n)}function pr(t,e){return Po(t,{i:2},e&&e.out,e&&e.dictionary)}var cr=typeof TextDecoder<"u"&&new TextDecoder,Yl=0;try{cr.decode(zl,{stream:!0}),Yl=1}catch{}var ql=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:an(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function Jl(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(cr)return cr.decode(t);var i=ql(t),o=i.s,n=i.r;return n.length&&I(8),o}}var Xl=function(t,e){return e+30+X(t,e+26)+X(t,e+28)},Ql=function(t,e,n){var r=X(t,e+28),i=X(t,e+30),o=Jl(t.subarray(e+46,e+46+r),!(X(t,e+8)&2048)),a=e+46+r,s=ec(t,a,i,n,z(t,e+20),z(t,e+24),z(t,e+42)),l=s[0],p=s[1],f=s[2];return[X(t,e+10),l,p,o,a+i+X(t,e+32),f]},ec=function(t,e,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,p=a==4294967295,f=e+n,h=s+l+p;if(r&&h){for(;e+4<f;e+=4+X(t,e+2))if(X(t,e)==1)return[s?sr(t,e+4+8*l):i,l?sr(t,e+4):o,p?sr(t,e+4+8*(l+s)):a,1];r<2&&I(13)}return[i,o,a,0]};var mo=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function Mo(t,e,n){n||(n=e,e={}),typeof n!="function"&&I(7);var r=[],i=function(){for(var L=0;L<r.length;++L)r[L]()},o={},a=function(L,V){mo(function(){n(L,V)})};mo(function(){a=n});for(var s=t.length-22;z(t,s)!=101010256;--s)if(!s||t.length-s>65558)return a(I(13,0,1),null),i;var l=X(t,s+8);if(l){var p=l,f=z(t,s+16),h=z(t,s-20)==117853008;if(h){var v=z(t,s-12);h=z(t,v)==101075792,h&&(p=l=z(t,v+32),f=z(t,v+48))}for(var k=e&&e.filter,O=function(L){var V=Ql(t,f,h),re=V[0],P=V[1],ee=V[2],Me=V[3],Xe=V[4],At=V[5],me=Xl(t,At);f=Xe;var F=function(T,Qe){T?(i(),a(T,null)):(Qe&&(o[Me]=Qe),--l||a(null,o))};if(!k||k({name:Me,size:P,originalSize:ee,compression:re}))if(!re)F(null,an(t,me,me+P));else if(re==8){var Re=t.subarray(me,me+P);if(ee<524288||P>.8*ee)try{F(null,pr(Re,{out:new A(ee)}))}catch(T){F(T,null)}else r.push(Zl(Re,{size:ee},F))}else F(I(14,"unknown compression type "+re,1),null);else F(null,null)},K=0;K<p;++K)O(K)}else a(null,{});return i}var Do=require("fs"),Q=require("fs/promises"),fr=require("path");u();function Ro(t){function e(a,s,l,p){let f=0;return f+=a<<0,f+=s<<8,f+=l<<16,f+=p<<24>>>0,f}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let a=e(t[8],t[9],t[10],t[11]),s=e(t[12],t[13],t[14],t[15]),l=16+a+s;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}u();var tc=require("original-fs");async function nc(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function _o(t,e){let r=await(await nc(t,e)).arrayBuffer();return Buffer.from(r)}var rc=(0,fr.join)(_t,"ExtensionCache");async function ic(t,e){return await(0,Q.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{Mo(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let h=pe(e,a);if(!h)throw new Error(`Path traversal detected: "${a}"`);return void await(0,Q.mkdir)(h,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),p=pe(e,l);if(!p)throw new Error(`Path traversal detected: "${a}"`);let f=pe(e,a);if(!f)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,Q.mkdir)(p,{recursive:!0}),await(0,Q.writeFile)(f,o[a])})).then(()=>n()).catch(a=>{(0,Q.rm)(e,{recursive:!0,force:!0}),r(a)})})})}async function Oo(t){let e=(0,fr.join)(rc,t);try{await(0,Q.access)(e,Do.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await _o(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await ic(Ro(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}sn.session.defaultSession.extensions?sn.session.defaultSession.extensions.loadExtension(e):sn.session.defaultSession.loadExtension(e)}Ce.app.whenReady().then(()=>{Ce.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=pe(ae,n);return r?Ce.net.fetch((0,mr.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return Ce.net.fetch((0,mr.pathToFileURL)((0,Lo.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{M.store.enableReactDevtools&&Oo("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}io()});
//# sourceURL=file:///VencordDesktopMain
//# sourceMappingURL=vencord://vencordDesktopMain.js.map
/*! For license information please see vencordDesktopMain.js.LEGAL.txt */

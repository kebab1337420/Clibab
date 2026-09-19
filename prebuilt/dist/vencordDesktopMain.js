// Vencord 59a5428
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var nn=Object.defineProperty;var So=Object.getOwnPropertyDescriptor;var xo=Object.getOwnPropertyNames;var ko=Object.prototype.hasOwnProperty;var kt=(t,e,n)=>()=>{if(n)throw n[0];try{return t&&(e=t(t=0)),e}catch(r){throw n=[r],r}};var pe=(t,e)=>{for(var n in e)nn(t,n,{get:e[n],enumerable:!0})},Eo=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of xo(e))!ko.call(t,i)&&i!==n&&nn(t,i,{get:()=>e[i],enumerable:!(r=So(e,i))||r.enumerable});return t};var To=t=>Eo(nn({},"__esModule",{value:!0}),t);var c=kt(()=>{"use strict"});var Ce=kt(()=>{"use strict";c()});function Ye(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var ur=kt(()=>{"use strict";c()});var Mo={};function Me(...t){let e={cwd:fr};return on?rn("flatpak-spawn",["--host","git",...t],e):rn("git",t,e)}async function Io(){return(await Me("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function Po(){await Me("fetch");let t=(await Me("branch","--show-current")).stdout.trim();if(!((await Me("ls-remote","origin",t)).stdout.length>0))return[];let r=(await Me("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function Ao(){return(await Me("pull")).stdout.includes("Fast-forward")}async function Co(){return!(await rn(on?"flatpak-spawn":"node",on?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:fr})).stderr.includes("Build failed")}var dr,Je,hr,pr,fr,rn,on,mr=kt(()=>{"use strict";c();Ce();dr=require("child_process"),Je=require("electron"),hr=require("path"),pr=require("util");ur();fr=(0,hr.join)(__dirname,".."),rn=(0,pr.promisify)(dr.execFile),on=!1;Je.ipcMain.handle("VencordGetRepo",Ye(Io));Je.ipcMain.handle("VencordGetUpdates",Ye(Po));Je.ipcMain.handle("VencordUpdate",Ye(Ao));Je.ipcMain.handle("VencordBuild",Ye(Co))});c();c();c();mr();c();Ce();var Un=require("electron");c();var ln={};pe(ln,{fetchTrackData:()=>_o});c();c();c();var gr="59a5428";c();var an="Vendicated/Vencord";var vr=`Vencord/${gr}${an?` (https://github.com/${an})`:""}`;var yr=require("child_process"),wr=require("util"),br=(0,wr.promisify)(yr.execFile);async function sn(t){let{stdout:e}=await br("osascript",t.map(n=>["-e",n]).flat());return e}var W=null;async function Ro({id:t,name:e,artist:n,album:r}){if(t===W?.id){if("data"in W)return W.data;if("failures"in W&&W.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":vr}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return W={id:t,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},W.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),W={id:t,failures:(t===W?.id&&"failures"in W?W.failures:0)+1},null}}async function _o(){try{await br("pgrep",["^Music$"])}catch{return null}if(await sn(['tell application "Music"',"get player state","end tell"]).then(h=>h.trim())!=="playing")return null;let e=await sn(['tell application "Music"',"get player position","end tell"]).then(h=>Number.parseFloat(h.trim())),n=await sn(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(h=>!!h),l=Number.parseFloat(s),p=await Ro({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:e,duration:l,...p}}var cn={};pe(cn,{initDevtoolsOpenEagerLoad:()=>Do});c();function Do(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var Pr={};c();c();Ce();c();var un=Symbol("SettingsStore.isProxy"),Sr=Symbol("SettingsStore.getRawTarget"),Xe=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===un)return!0;if(r===Sr)return n;let o=Reflect.get(n,r,i),a=e.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[un]){let p=`${l}${l&&"."}${r}`;return e.makeProxy(o,s,p)}return o},set(n,r,i){if(i?.[un]&&(i=i[Sr]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return e.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return e.notifyListeners(s,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyPrefixListeners(e,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,e))}}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,p)=>l[p],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n)),this.notifyPrefixListeners(e,i,n)}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}addPrefixChangeListener(e,n){let r=this.prefixListeners.get(e)??new Set;r.add(n),this.prefixListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}removePrefixChangeListener(e,n){let r=this.prefixListeners.get(e);r&&(r.delete(n),r.size||this.prefixListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}};c();function dn(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},dn(t[n],r)):t[n]??=r}return t}var fn=require("electron"),me=require("fs");c();var xr=require("electron"),re=require("path"),Tt=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,re.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,re.join)(xr.app.getPath("userData"),"..","Vencord")),fe=(0,re.join)(Tt,"settings"),ie=(0,re.join)(Tt,"themes"),Re=(0,re.join)(fe,"quickCss.css"),hn=(0,re.join)(fe,"settings.json"),pn=(0,re.join)(fe,"native-settings.json"),kr=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"];(0,me.mkdirSync)(fe,{recursive:!0});function Er(t,e){try{return JSON.parse((0,me.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var R=new Xe(Er("renderer",hn));R.addGlobalChangeListener(()=>{try{(0,me.writeFileSync)(hn,JSON.stringify(R.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});fn.ipcMain.on("VencordGetSettings",t=>t.returnValue=R.plain);fn.ipcMain.handle("VencordSetSettings",(t,e,n)=>{R.setData(e,n)});var Oo={plugins:{},customCspRules:{}},Tr=Er("native",pn);dn(Tr,Oo);var K=new Xe(Tr);K.addGlobalChangeListener(()=>{try{(0,me.writeFileSync)(pn,JSON.stringify(K.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}});var Pt=require("electron"),It=[];function Ir(){let t=[];for(let e=It.length-1;e>=0;e--){let{processId:n,routingId:r}=It[e],i=Pt.webFrameMain.fromId(n,r);if(!i){It.splice(e,1);continue}t.push(i)}return t}Pt.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){Ir();let{routingId:i,processId:o}=r;It.push({routingId:i,processId:o});let a=R.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});R.addChangeListener("plugins.FixSpotifyEmbeds.volume",t=>{try{Ir().forEach(e=>e.executeJavaScript(`globalThis._vcVolume = ${t/100}`))}catch(e){console.error("FixSpotifyEmbeds: Failed to update volume",e)}});var Cr={};c();var Ar=require("electron");Ar.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!R.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var mn={};pe(mn,{resolveRedirect:()=>Vo});c();var Mr=require("https"),Lo=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function Rr(t){return new Promise((e,n)=>{let r=(0,Mr.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?Rr(i.headers.location):t)});r.on("error",n),r.end()})}async function Vo(t,e){return Lo.test(e)?Rr(e):e}var gn={};pe(gn,{makeDeeplTranslateRequest:()=>Fo,makeKagiTranslateRequest:()=>No});c();async function Fo(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function No(t,e,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${e}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var vn={};pe(vn,{readRecording:()=>Uo});c();var _r=require("electron"),At=require("fs/promises"),Qe=require("path");async function Uo(t,e){e=(0,Qe.normalize)(e);let n=(0,Qe.basename)(e),r=(0,Qe.normalize)(_r.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!e.startsWith(r))return null;try{let i=await(0,At.readFile)(e);return(0,At.rm)(e).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var yn={};pe(yn,{closeSocket:()=>Go,sendToOverlay:()=>$o});c();var Dr=require("dgram"),Ct=null;function $o(t,e){e.messageType=e.type;let n=JSON.stringify(e);Ct??=(0,Dr.createSocket)("udp4"),Ct.send(n,42069,"127.0.0.1")}function Go(){Ct?.close(),Ct=null}var Lr={};c();var Or=require("electron");c();var wn=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;Or.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{R.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(wn):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(wn))})})});var Nn={};pe(Nn,{answerOverlayAction:()=>Ws,armDisplayMedia:()=>fs,checkUpdate:()=>Ks,closeStudioOverlay:()=>Us,deleteClip:()=>ja,disarmDisplayMedia:()=>ms,downloadUpdate:()=>qs,dropOverlayWaiters:()=>zs,focusClient:()=>Bs,gameFeedStatus:()=>Ss,getActiveScreen:()=>ps,getCaptureSources:()=>ds,getClipDirectory:()=>ss,getMemoryReport:()=>hs,getPlatformInfo:()=>us,hideClipOverlay:()=>Os,hideVrPanel:()=>As,listClips:()=>Ga,notifyClipSaved:()=>Ds,openClipDirectory:()=>cs,openStudioOverlay:()=>Ns,openVrBindings:()=>Is,pickAudioFiles:()=>Qa,pickClipDirectory:()=>ls,pickImageFiles:()=>ns,pickVideoFiles:()=>Ya,readAudioFile:()=>ts,readClip:()=>za,readImageFile:()=>os,readLibrary:()=>Za,readVideoFile:()=>Xa,readVoiceTrack:()=>Ua,registerShortcuts:()=>vs,relaunchClient:()=>Ys,releaseClipPath:()=>La,renameClip:()=>Ka,reserveClipPath:()=>Oa,revealClip:()=>as,saveClip:()=>Da,saveVoiceTrack:()=>Na,shareClip:()=>Ha,showClipOverlay:()=>_s,showVrPanel:()=>Ps,startGameFeeds:()=>ws,startVrBridge:()=>ks,stopGameFeeds:()=>bs,stopVrBridge:()=>Es,studioOverlayUp:()=>$s,unregisterShortcuts:()=>Fn,vrBridgeStatus:()=>Ts,waitForGameEvent:()=>xs,waitForOverlayAction:()=>Gs,waitForShortcut:()=>ys,waitForVrEvent:()=>Cs,writeLibrary:()=>qa});c();var xi=require("crypto"),y=require("electron"),u=require("fs"),Wt=require("https"),f=require("path");c();var B=require("fs"),Nr=require("http"),Ur=require("https"),$r=require("os"),ot=require("path"),Vr=34765,zo=6,Gr=256*1024,Wo=2e3,Bo=1500,Ho="127.0.0.1",jo=2999,Ko="gamestate_integration_clipper.cfg",oe=null,De=0,Rt="",Oe=null,rt=[],Zo=12,it=[],Le=[],Ve={cs2:!1,league:!1};function _t(t){rt.length>=Zo||rt.includes(t)||rt.push(t)}var Dt=Promise.resolve();function et(t){let e=Le.shift();if(e){e(t);return}it.push(t),it.length>16&&it.shift()}var x={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function zr(){x={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function qo(t){return t>=5?"an ace in Counter-Strike 2":t===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function Yo(t){let e=t.provider?.steamid,{player:n}=t;if(!n||!e||!n.steamid||n.steamid!==e)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof t.map?.round=="number"?t.map.round:x.round;(r.kills<x.kills||r.deaths<x.deaths)&&zr();let o=x.kills<0;i!==x.round&&(x.round=i,x.roundKills=0,x.announced=0);let a=r.kills-Math.max(0,x.kills),s=r.deaths-Math.max(0,x.deaths);if(x.kills=r.kills,x.deaths=r.deaths,o)return;a>0&&(x.roundKills+=a,x.roundKills>=3&&x.roundKills>x.announced?(x.announced=x.roundKills,et({kind:"multikill",note:qo(x.roundKills)})):et({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&et({kind:"death",note:"your death in Counter-Strike 2"});let l=t.round?.win_team;l&&n.team&&l===n.team&&t.round?.phase==="over"&&x.roundKills>0&&et({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function Jo(){return new Promise(t=>{let e=0,n=(0,Nr.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>Gr&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{Yo(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++e<zo){n.listen(Vr+e,"127.0.0.1");return}_t(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}oe===n&&(oe=null,De=0,Ve={...Ve,cs2:!1}),t(0)}),n.on("listening",()=>{oe=n,t(n.address().port)}),n.listen(Vr,"127.0.0.1")})}function Xo(){let t=[],e=(0,$r.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&t.push((0,ot.join)(i,"Steam"))}let n=[];for(let r of t)if((0,B.existsSync)(r)){n.push(r);try{let i=(0,B.readFileSync)((0,ot.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function Qo(){for(let t of Xo()){let e=(0,ot.join)(t,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,B.existsSync)(e))return e}return""}function ea(t){let e=Qo();if(!e)return _t("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,ot.join)(e,Ko),r=`"Clipper"
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
`;try{return(0,B.mkdirSync)(e,{recursive:!0}),(0,B.writeFileSync)(n,r,"utf8"),n}catch(i){return _t(`Counter-Strike 2's config could not be written (${i.message})`),""}}function ta(){let t=Rt;if(Rt="",!!t)try{(0,B.unlinkSync)(t)}catch{}}var tt="",_e=-1,bn=!1,Mt=!1;function nt(t){return t.split("#")[0].trim().toLowerCase()}function Fr(t){return new Promise(e=>{let n=(0,Ur.get)({host:Ho,port:jo,path:t,rejectUnauthorized:!1,timeout:Bo},r=>{if(r.statusCode!==200){r.resume(),e(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>Gr&&n.destroy()}),r.on("end",()=>{try{e(JSON.parse(i))}catch{e(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>e(null))})}function na(t,e){let n=t.EventName??"",r=nt(t.KillerName??"");switch(n){case"ChampionKill":return r===e?{kind:"kill",note:"a kill in League of Legends"}:nt(t.VictimName??"")===e?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==e?null:{kind:"multikill",note:`a ${t.KillStreak??3}-kill run in League of Legends`};case"Ace":return nt(t.Acer??"")!==e?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return nt(t.Recipient??"")!==e?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==e?null:{kind:"objective",note:`${t.DragonType?`the ${t.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==e?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==e?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==e?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function ra(){if(!Mt){Mt=!0;try{if(!tt){let r=await Fr("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;tt=nt(r),_e=-1}let t=await Fr("/liveclientdata/eventdata");if(!t?.Events){tt="";return}let e=_e<0,n=_e;for(let r of t.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=_e||(n=Math.max(n,i),e))continue;let o=na(r,tt);o&&et(o)}_e=n}finally{Mt=!1}}}function ia(){tt="",_e=-1,Mt=!1,Oe=setInterval(()=>{ra().catch(t=>{bn||(bn=!0,_t(`League of Legends could not be read (${t.message})`))})},Wo)}function oa(t){return t.cs2!==Ve.cs2||t.league!==Ve.league?!1:(!t.cs2||oe!==null)&&(!t.league||Oe!==null)}function Wr(t){let e=Dt.then(async()=>(oa(t)||(Br(),rt=[],t.cs2&&(zr(),De=await Jo(),De&&(Rt=ea(De))),t.league&&ia(),Ve={cs2:t.cs2&&oe!==null,league:t.league}),Ot()));return Dt=e.catch(()=>{}),e}function Br(){if(Ve={cs2:!1,league:!1},Oe&&clearInterval(Oe),Oe=null,bn=!1,oe)try{oe.close()}catch{}oe=null,De=0,ta(),it=[];let t=Le;Le=[];for(let e of t)e(null)}function Sn(){let t=Dt.then(()=>Br());return Dt=t.catch(()=>{}),t}function Ot(){return{port:De,configPath:Rt,league:Oe!==null,problems:[...rt]}}function Hr(t){let e=it.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{Le=Le.filter(a=>a!==i),i(null)},t);Le.push(i)})}c();var ae=require("electron"),Ft=require("fs"),st=require("path"),jr=require("url"),Lt=24,Kr=2600,Vt=220,aa=300,sa=56,xn=!0;function Nt(){return xn}var ye=null,ge=null,at=null,ve=null;function la(){return!!ye&&!ye.isDestroyed()}function we(){ge&&(clearTimeout(ge),ge=null);let t=ye;ye=null,t&&!t.isDestroyed()&&t.destroy()}function Fe(){ve&&(clearTimeout(ve),ve=null);let t=at;at=null,t&&!t.isDestroyed()&&t.destroy()}function ca(t,e,n){let i=ae.screen.getDisplayNearestPoint(ae.screen.getCursorScreenPoint()).workArea,o=t==="top-left"||t==="bottom-left",a=t==="top-left"||t==="top-right";return{x:Math.round(o?i.x+Lt:i.x+i.width-e-Lt),y:Math.round(a?i.y+Lt:i.y+i.height-n-Lt)}}function lt(t,e){let n=(0,st.join)(ae.app.getPath("userData"),"clipper-overlay");(0,Ft.mkdirSync)(n,{recursive:!0});let r=(0,st.join)(n,t);return(0,Ft.writeFileSync)(r,e,"utf8"),r}function Zr(t,e,n,r){let{x:i,y:o}=ca(r,e,n),a=new ae.BrowserWindow({width:e,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(t).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function qr(t){return`<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }
    .card {
        position: absolute; inset: 0; border-radius: 12px; overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 10px 34px rgba(0, 0, 0, 0.6);
        opacity: 0; transform: scale(0.96); transition: opacity ${Vt}ms ease, transform ${Vt}ms ease;
    }
    .card.up { opacity: 1; transform: none; }
    ${t}
</style>`}function Z(t){return JSON.stringify(t).replace(/</g,"\\u003c")}function ua(t,e){return`<!doctype html>
<html>
<head>
${qr(`.card { background: #000; }
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
    var look = ${Z(e)};
    var video = document.getElementById("video");
    var card = document.getElementById("card");
    document.getElementById("tag").textContent = ${Z((0,st.basename)(t))};

    var leaving = false;
    function leave() {
        if (leaving) return;
        leaving = true;
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Vt});
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

    video.src = ${Z((0,jr.pathToFileURL)(t).href)};

    // Autoplay with sound is only allowed after a gesture, and this window
    // never gets one. Muted playback is always allowed, so it is the fallback
    // rather than a reason to show nothing.
    video.play().catch(function () {
        video.muted = true;
        video.play().catch(leave);
    });
</script>
</body>
</html>`}function da(t,e){return`<!doctype html>
<html>
<head>
${qr(`.card {
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
    document.getElementById("title").textContent = ${Z(t)};
    document.getElementById("note").textContent = ${Z(e)};

    requestAnimationFrame(function () { card.classList.add("up"); });

    setTimeout(function () {
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Vt});
    }, ${Kr});
</script>
</body>
</html>`}function Yr(t,e){if(!xn)return!1;we(),Fe();let n=Math.max(200,Math.round(e.width)),r=Math.round(n*9/16),i=Zr(lt("clip.html",ua(t,e)),n,r,e.corner);ye=i,i.on("closed",()=>{ye===i&&(ye=null,ge&&(clearTimeout(ge),ge=null))});let o=(e.seconds>0?e.seconds:300)+10;return ge=setTimeout(()=>we(),o*1e3),!0}function Jr(t,e,n){if(!xn||la())return!1;Fe();let r=Zr(lt("toast.html",da(t,e)),aa,sa,n);return at=r,r.on("closed",()=>{at===r&&(at=null,ve&&(clearTimeout(ve),ve=null))}),ve=setTimeout(()=>Fe(),Kr+4e3),!0}ae.app.on("will-quit",()=>{we(),Fe()});c();var q=require("electron"),Xr=require("url");var kn="VencordClipperOverlayAction",Qr="VencordClipperOverlayReply",ha=108,_=null;function En(){return!!_&&!_.isDestroyed()}function ut(){let t=_;_=null,t&&!t.isDestroyed()&&t.destroy()}var Ne=[],ct=[];function pa(t){let e=Ne.shift();if(e){e(t);return}ct.push(t),ct.length>4&&ct.shift()}function ei(t){let e=ct.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{Ne=Ne.filter(a=>a!==i),i(null)},t);Ne.push(i)})}function ti(){ct=[];let t=Ne;Ne=[];for(let e of t)e(null)}function ni(t){!_||_.isDestroyed()||_.webContents.send(Qr,t)}q.ipcMain.removeAllListeners(kn);q.ipcMain.on(kn,(t,e,n)=>{if(!_||_.isDestroyed()||t.sender!==_.webContents)return;let r=String(e??"");if(r==="close"){ut();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open")return;let i=n??{},o=Number(i.from),a=Number(i.to);pa({kind:r,clip:String(i.clip??""),from:Number.isFinite(o)?Math.max(0,o):0,to:Number.isFinite(a)?Math.max(0,a):0})});function fa(t,e){let{workArea:n}=q.screen.getDisplayNearestPoint(q.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-t)/2),y:Math.round(n.y+(n.height-e)/2)}}var ma=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${Z(kn)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${Z(Qr)}, (_event, reply) => handler(reply));
    }
});
`;function ga(t,e){return`<!doctype html>
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
    var clip = ${Z({name:t.name,url:(0,Xr.pathToFileURL)(t.path).href,markers:t.markers})};
    var look = ${Z(e)};
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
        var buttons = document.querySelectorAll("[data-do=cut], [data-do=send], [data-do=delete], [data-do=open]");
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
</html>`}function ri(t,e){if(!Nt())return!1;ut(),we(),Fe();let n=Math.max(360,Math.round(e.width)),r=Math.round(n*9/16)+ha,{x:i,y:o}=fa(n,r),a=lt("studio-preload.js",ma),s=lt("studio.html",ga(t,e)),l=new q.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return _=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{_===l&&(_=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}q.app.on("will-quit",()=>ut());c();function dt(t){return`${t.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}c();var hi=require("child_process"),pi=require("electron"),Cn=require("fs"),gt=require("path");c();var va=`
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
`,ii=`# Vencord Clipper - SteamVR bridge. Generated; edits are overwritten.
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
${va}
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
`;c();var ai=require("electron"),U=require("fs"),N=require("path"),Ut="vencord.clipper",se="/actions/clipper",ht=["save","mark","toggle","pov"],ya=["save","mark"],wa={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function Tn(){let t=(0,N.join)(ai.app.getPath("userData"),"clipper-vr");return(0,U.mkdirSync)(t,{recursive:!0}),t}function ba(){let t=(0,N.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,U.readFileSync)(t,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,U.existsSync)((0,N.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let e=(0,N.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,U.existsSync)((0,N.join)(e,"bin","win64","openvr_api.dll"))?e:null}function si(){let t=ba();return t&&(0,N.join)(t,"bin","win64","openvr_api.dll")}var Sa=.4,xa={save:"double",mark:"long"};function ka(t,e,n){return{path:t,mode:"button",inputs:{[e]:{output:`${se}/in/${n}`}},parameters:e==="long"?{long_press_delay:Sa}:{}}}function oi(t,e){return{app_key:Ut,controller_type:t,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[se]:{sources:ya.map(n=>ka(e[n],xa[n],n))}}}}function li(){let t=Tn(),e={language_tag:"en_US",[se]:"Clipper"};for(let o of ht)e[`${se}/in/${o}`]=wa[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:se,usage:"leftright"}],actions:ht.map(o=>({name:`${se}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[e]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,U.writeFileSync)((0,N.join)(t,"bindings_knuckles.json"),JSON.stringify(oi("knuckles",r),null,4),"utf8"),(0,U.writeFileSync)((0,N.join)(t,"bindings_oculus_touch.json"),JSON.stringify(oi("oculus_touch",r),null,4),"utf8");let i=(0,N.join)(t,"actions.json");return(0,U.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function ci(t){let e={source:"builtin",applications:[{app_key:Ut,launch_type:"binary",binary_path_windows:t,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,N.join)(Tn(),"clipper.vrmanifest");return(0,U.writeFileSync)(n,JSON.stringify(e,null,4),"utf8"),n}function In(){return(0,N.join)(Tn(),"bridge.ps1")}var Ea=15e3,Ta=45e3,ui=3,Ia=3,Pa=2e3,O=null,mt=!1,Q="",D="",be="",Se=!1,An=0,fi=0,Ue=null,pt=[],ft=null,le=[],$t=Promise.resolve();function di(t){let e=le.shift();if(e){e(t);return}if(t.kind==="motion"){ft=t;return}pt.push(t.action),pt.length>8&&pt.shift()}function Aa(t){let e=t.trim();if(!e.startsWith("{"))return!1;let n;try{n=JSON.parse(e)}catch{return!1}if(n.t==="ready")return Q=String(n.runtime??""),D="",be="",Se=!1,!0;if(n.t==="waiting")return Q="",D="",be=String(n.reason??""),!0;if(n.t==="warning")return D=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return D=String(n.message??"The SteamVR bridge failed for a reason it did not give"),Se=!Q||++fi>=Ia,!0;if(n.t==="action"){let r=ht.find(i=>i===n.name);return r&&di({kind:"action",action:r}),!1}return n.t==="motion"&&di({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function Pn(){Ue||!mt||Se||(Ue=setTimeout(()=>{Ue=null,mt&&mi()},Ea))}function mi(){if(O)return Promise.resolve();let t=si();if(!t)return Pn(),Promise.resolve();let e;try{let n=In();(0,Cn.writeFileSync)(n,ii,"utf8");let r=(0,gt.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");e=(0,hi.spawn)(r,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",t,"-Actions",li(),"-Manifest",ci(r),"-AppKey",Ut,"-ActionList",[se,...ht].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return D=`The SteamVR bridge could not be started (${n.message}).`,Pn(),Promise.resolve()}return O=e,Q="",be="",Se=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{D="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},Ta),a="";e.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let p of l)Aa(p)&&i()}),e.stderr?.on("data",s=>{D||(D=s.toString("utf8").trim().slice(0,300))}),e.on("error",s=>{D=`The SteamVR bridge could not be started (${s.message}).`,i()}),e.on("exit",()=>{O===e&&(!Q&&!be&&!Se?++An>=ui&&(Se=!0,D||(D=`The SteamVR bridge stopped ${ui} times without saying why. Switch the VR controls off and on again to try it once more.`)):An=0,O=null,Q="",be="");let s=le;le=[];for(let l of s)l(null);i(),Pn()})})}function gi(){Ue&&(clearTimeout(Ue),Ue=null);let t=O;O=null,Q="",be="",Se=!1,An=0,fi=0,pt=[],ft=null;let e=le;le=[];for(let r of e)r(null);if(!t)return;try{t.stdin?.end()}catch{}let n=setTimeout(()=>{try{t.kill()}catch{}},Pa);t.on("exit",()=>clearTimeout(n))}function vi(t){let e=$t.then(async()=>(mt=t,t?(await mi(),Gt()):(gi(),D="",Gt())));return $t=e.catch(()=>{}),e}function Mn(){let t=$t.then(()=>{mt=!1,gi()});return $t=t.catch(()=>{}),t}function Gt(){return{running:O!==null&&Q!=="",wanted:mt,runtime:Q,problem:D,waiting:be}}function yi(){if(!O?.stdin?.writable)return!1;try{return O.stdin.write(`bindings
`),!0}catch{return!1}}var Ca=0;function wi(t,e,n,r){if(!O?.stdin?.writable||e<=0||n<=0||t.length!==e*n*4)return!1;let i=(0,gt.join)((0,gt.dirname)(In()),`panel-${Ca++%8}.rgba`);try{return(0,Cn.writeFileSync)(i,t),O.stdin.write(`panel ${e} ${n} ${Math.round(r)} ${i}
`),!0}catch{return!1}}function bi(){if(!O?.stdin?.writable)return!1;try{return O.stdin.write(`panelhide
`),!0}catch{return!1}}function Si(t=3e4){let e=pt.shift();if(e)return Promise.resolve({kind:"action",action:e});if(ft){let n=ft;return ft=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{le=le.filter(a=>a!==i),i(null)},t);le.push(i)})}pi.app.on("will-quit",()=>{Mn()});var ki=!0,Ln=!1,Ma=500*1024*1024,Ei=/vesktop|equibop/i.test(y.app.getName());function k(t){let e=t?.trim();return e&&(0,f.isAbsolute)(e)?e:(0,f.join)(y.app.getPath("videos"),"DiscordClips")}var Ra=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;function H(t){let n=(0,f.basename)(String(t??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${Ra.test(r[1])?`_${r[1]}`:r[1]}.${r[2].toLowerCase()}`:null}function Ti(t){return H(t)??`clip-${Date.now()}.webm`}function Vn(t,e){let n=(0,f.extname)(e),r=e.slice(0,e.length-n.length),i=(0,f.join)(t,e),o=2;for(;(0,u.existsSync)(i)&&o<1e3;)i=(0,f.join)(t,`${r} (${o++})${n}`);if((0,u.existsSync)(i))throw new Error(`No free name left for ${e}; rename or clear the folder`);return i}var $e=new Map;function _a(t,e){let n=`${t}.tmp-${process.pid}-${Date.now()}`;(0,u.writeFileSync)(n,Buffer.from(e));try{(0,u.renameSync)(n,t)}catch(r){try{(0,u.unlinkSync)(n)}catch{}throw r}}function Da(t,e,n,r,i=!1){let o=k(e);(0,u.mkdirSync)(o,{recursive:!0});let a=Ti(n),s=(0,f.join)(o,a),l=($e.get(s)??Promise.resolve()).catch(()=>{}).then(async()=>{let p=i?Vn(o,a):(0,f.join)(o,a);return _a(p,r),p});return l.then(()=>{$e.get(s)===l&&$e.delete(s)},()=>{$e.get(s)===l&&$e.delete(s)}),$e.set(s,l),l}var vt=new Set;function Oa(t,e,n){let r=k(e);(0,u.mkdirSync)(r,{recursive:!0});let i=Vn(r,Ti(n));if(!vt.has(i))return vt.add(i),i;let o=(0,f.extname)(i),a=i.slice(0,i.length-o.length),s=1,l=`${a}-${s}${o}`;for(;vt.has(l)||(0,u.existsSync)(l);)l=`${a}-${++s}${o}`;return vt.add(l),l}function La(t,e){vt.delete(e)}var Bt="voices";function Va(t,e){let n=H(t);return!n||!/^\d{1,25}$/.test(String(e??""))?null:`${n.slice(0,n.length-(0,f.extname)(n).length)}.${e}.webm`}function Fa(t,e){let n=H(e);if(!n)return[];let r=(0,f.join)(k(t),Bt);if(!(0,u.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,f.extname)(n).length)}.`,o=[];for(let a of(0,u.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function Na(t,e,n,r,i){let o=Va(n,r);if(!o)return null;let a=(0,f.join)(k(e),Bt);(0,u.mkdirSync)(a,{recursive:!0});let s=(0,f.join)(a,o);return(0,u.writeFileSync)(s,Buffer.from(i)),s}function Ua(t,e,n){let r=(0,f.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");return new Uint8Array((0,u.readFileSync)((0,f.join)(k(e),Bt,r)))}function $a(t,e){let n=(0,f.join)(k(t),Bt);for(let{file:r}of Fa(t,e))try{(0,u.unlinkSync)((0,f.join)(n,r))}catch{}}function Ga(t,e){let n=k(e);if(!(0,u.existsSync)(n))return[];let r=[],i=new Set,o=(0,u.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,f.join)(n,a.name);try{let l=(0,u.statSync)(s),p=dt(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(p)?{thumb:p}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function za(t,e,n){let r=H(n);if(!r)throw new Error("That is not a clip name");let i=(0,f.join)(k(e),r),o=(0,u.openSync)(i,"r");try{let{size:a}=(0,u.fstatSync)(o);if(a>Ma)throw new Error("That clip is too large to open");return new Uint8Array((0,u.readFileSync)(o))}finally{(0,u.closeSync)(o)}}var Wa=200*1024*1024,Ba="https://catbox.moe/user/api.php";function Ha(t,e,n){let r=H(n);if(!r)throw new Error("That is not a clip name");if(!/\.(webm|mp4)$/i.test(r))throw new Error("Only video clips can be shared as a link");let i=(0,f.join)(k(e),r),o=(0,u.openSync)(i,"r"),a;try{let{size:d}=(0,u.fstatSync)(o);if(d>Wa)throw new Error("That clip is over 200MB - shorten it in the studio first");a=(0,u.readFileSync)(o)}finally{(0,u.closeSync)(o)}let s=`clipper-${Date.now().toString(16)}-${Math.floor(Math.random()*4294967295).toString(16)}`,l=r.toLowerCase().endsWith(".mp4")?"video/mp4":"video/webm",p=Buffer.from(`--${s}\r
Content-Disposition: form-data; name="reqtype"\r
\r
fileupload\r
--${s}\r
Content-Disposition: form-data; name="fileToUpload"; filename="${r}"\r
Content-Type: ${l}\r
\r
`,"utf8"),h=Buffer.from(`\r
--${s}--\r
`,"utf8");return new Promise((d,v)=>{let S=(0,Wt.request)(Ba,{method:"POST",headers:{"User-Agent":Ai,"Content-Type":`multipart/form-data; boundary=${s}`,"Content-Length":p.length+a.length+h.length}},M=>{let L=[];M.on("data",T=>L.push(T)),M.on("end",()=>{let T=Buffer.concat(L).toString("utf8").trim();(M.statusCode??0)!==200?v(new Error(`The host answered ${M.statusCode??"?"} - try again later`)):/^https:\/\//.test(T)?d(T):v(new Error("The host did not return a link - try again later"))}),M.on("error",v)});S.setTimeout(3e5,()=>S.destroy(new Error("The upload timed out - try again on a faster connection"))),S.on("error",v),S.write(p),S.write(a),S.end(h)})}async function ja(t,e,n){let r=k(e),i=H(n);if(!i)throw new Error("That is not a clip name");let o=(0,f.join)(r,i);try{await y.shell.trashItem(o)}catch{(0,u.unlinkSync)(o)}$a(e,i);let a=(0,f.join)(r,dt(i));if((0,u.existsSync)(a))try{await y.shell.trashItem(a)}catch{try{(0,u.unlinkSync)(a)}catch{}}}function Ka(t,e,n,r){let i=k(e),o=H(n);if(!o)throw new Error("That is not a clip name");let a=(0,f.join)(i,o),s=(0,f.extname)(o),l=H(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let h=l.toLowerCase()===o.toLowerCase()?(0,f.join)(i,l):Vn(i,l);(0,u.renameSync)(a,h);let d=(0,f.join)(i,dt(o));if((0,u.existsSync)(d))try{(0,u.renameSync)(d,(0,f.join)(i,dt((0,f.basename)(h))))}catch{}return(0,f.basename)(h)}var Ii="clipper-library.json";function Za(t,e){let n=(0,f.join)(k(e),Ii);if(!(0,u.existsSync)(n))return"";try{return(0,u.readFileSync)(n,"utf8")}catch{return""}}function qa(t,e,n){let r=k(e);(0,u.mkdirSync)(r,{recursive:!0});let i=(0,f.join)(r,Ii),o=`${i}.tmp`;(0,u.writeFileSync)(o,String(n??""),"utf8"),(0,u.renameSync)(o,i)}async function Ya(t){let e=await y.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return e.canceled?[]:e.filePaths}var Ja=512*1024*1024;function Xa(t,e){if(!(0,f.isAbsolute)(e)||!/\.(mp4|webm|mkv|mov|m4v)$/i.test(e))throw new Error("Not a video file");let n=(0,u.openSync)(e,"r");try{let{size:r}=(0,u.fstatSync)(n);if(r>Ja){let i=Math.round(r/1048576);throw new Error(`That video is ${i} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,u.readFileSync)(n))}finally{(0,u.closeSync)(n)}}async function Qa(t){let e=await y.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return e.canceled?[]:e.filePaths}var es=64*1024*1024;function ts(t,e){if(!(0,f.isAbsolute)(e)||!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(e))throw new Error("Not an audio file");let n=(0,u.openSync)(e,"r");try{let{size:r}=(0,u.fstatSync)(n);if(r>es){let i=Math.round(r/1048576);throw new Error(`That sound is ${i} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,u.readFileSync)(n))}finally{(0,u.closeSync)(n)}}async function ns(t){let e=await y.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return e.canceled?[]:e.filePaths}var rs=24*1024*1024,is=64*1024*1024;function os(t,e){if(!(0,f.isAbsolute)(e)||!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(e))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(e),r=n?is:rs,i=(0,u.openSync)(e,"r");try{let{size:o}=(0,u.fstatSync)(i);if(o>r){let a=Math.round(o/1048576),s=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${a} MB; the montage caps them at ${s} MB.`)}return new Uint8Array((0,u.readFileSync)(i))}finally{(0,u.closeSync)(i)}}function as(t,e,n){let r=H(n);if(!r)throw new Error("That is not a clip name");y.shell.showItemInFolder((0,f.join)(k(e),r))}function ss(t,e){return k(e)}async function ls(t,e){let n=await y.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:k(e),properties:["openDirectory","createDirectory"]});return n.canceled?"":n.filePaths[0]??""}function cs(t,e){let n=k(e);(0,u.mkdirSync)(n,{recursive:!0}),y.shell.openPath(n)}function us(t){return{platform:"win32",wayland:Ln,vesktop:Ei,overlay:Nt()}}var ce=new Set;async function ds(t,e=!0){if(Ln)return[];let n=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:e?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(ce.size){let i=new Set(n.map(o=>o.id));for(let o of ce)i.has(o)||ce.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!e){if(!o&&ce.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if(ki&&!o&&a){ce.add(i.id);continue}ce.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function hs(t){try{return y.app.getAppMetrics().map(e=>({type:e.serviceName||e.type,mb:Math.round((e.memory?.workingSetSize??0)/1024)})).filter(e=>e.mb>0).sort((e,n)=>n.mb-e.mb)}catch{return[]}}async function ps(t){if(Ln)return"";let e=await y.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!e.length)return"";try{let n=y.screen.getDisplayNearestPoint(y.screen.getCursorScreenPoint()),r=e.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return e[0].id}var Rn="",_n=!1;function fs(t,e,n=!0){return!n||Ei?!1:(Rn=e??"",_n=!0,y.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(p=>p.id===Rn),l=(a&&!ce.has(a.id)?a:void 0)??o.find(p=>p.id.startsWith("screen:"))??o.find(p=>!ce.has(p.id));if(!l){i({});return}i(ki&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function ms(t){Rn="",_n&&(_n=!1,y.session.defaultSession.setDisplayMediaRequestHandler(null))}var Dn=new Map,Ge=[],yt=[];function gs(t){let e=Ge.shift();if(e){e(t);return}yt.push(t),yt.length>8&&yt.shift()}function vs(t,e){Fn();let n=[];for(let[r,i]of Object.entries(e)){if(!i)continue;let o=!1;try{o=y.globalShortcut.register(i,()=>gs(r))}catch{o=!1}o?Dn.set(r,i):n.push(i)}return n}function Fn(t){for(let n of Dn.values())try{y.globalShortcut.unregister(n)}catch{}Dn.clear(),yt=[];let e=Ge;Ge=[];for(let n of e)n(null)}function ys(t,e=3e4){let n=yt.shift();return n?Promise.resolve(n):new Promise(r=>{let i=!1,o=s=>{i||(i=!0,clearTimeout(a),r(s))},a=setTimeout(()=>{Ge=Ge.filter(s=>s!==o),o(null)},e);Ge.push(o)})}y.app.on("will-quit",()=>Fn());function ws(t,e){return Wr(e)}function bs(t){return Sn()}function Ss(t){return Ot()}function xs(t,e=3e4){return Hr(e)}function ks(t,e){return vi(e)}function Es(t){return Mn()}function Ts(t){return Gt()}function Is(t){return yi()}function Ps(t,e,n,r,i){return wi(new Uint8Array(e),n,r,i)}function As(t){return bi()}function Cs(t,e=3e4){return Si(e)}y.app.on("will-quit",()=>{Sn()});var Ms=["top-left","top-right","bottom-left","bottom-right"];function ze(t,e,n,r){let i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(e,Math.round(i))):r}function Pi(t){return Ms.includes(t)?t:"bottom-right"}function Rs(t){return{corner:Pi(t?.corner),width:ze(t?.width,200,1280,420),volume:ze(t?.volume,0,100,0),seconds:ze(t?.seconds,0,300,10)}}function On(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function _s(t,e,n,r){let i=H(n);if(!i)return!1;let o=(0,f.join)(k(e),i);return(0,u.existsSync)(o)?Yr(o,Rs(r)):!1}function Ds(t,e,n,r){return y.BrowserWindow.getFocusedWindow()||En()?!1:Jr(On(e,60),On(n,90),Pi(r))}function Os(t){we()}var Ls=200;function Vs(t){return Array.isArray(t)?t.map(Number).filter(e=>Number.isFinite(e)&&e>=0).slice(0,Ls):[]}function Fs(t){return{width:ze(t?.width,360,1600,720),volume:ze(t?.volume,0,100,0)}}function Ns(t,e,n,r,i){let o=H(n);if(!o)return!1;let a=(0,f.join)(k(e),o);return(0,u.existsSync)(a)?ri({name:o,path:a,markers:Vs(r)},Fs(i)):!1}function Us(t){ut()}function $s(t){return En()}function Gs(t,e=3e4){return ei(ze(e,1e3,12e4,3e4))}function zs(t){ti()}function Ws(t,e,n,r){ni({ok:!!e,message:On(n,120),close:!!r})}function Bs(t){let e=y.BrowserWindow.fromWebContents(t.sender);!e||e.isDestroyed()||(e.isMinimized()&&e.restore(),e.show(),e.focus())}var wt="kebab1337420/vencord-clipper",Ai=`VencordClipper (+https://github.com/${wt})`,zt=256*1024*1024;function Ht(t,e=0){return new Promise((n,r)=>{let i=(0,Wt.get)(t,{headers:{"User-Agent":Ai,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),e>=5?r(new Error(`Too many redirects for ${t}`)):n(Ht(new URL(s,t).toString(),e+1));return}let l=[],p=0,{"content-length":h}=o.headers;if(h&&Number(h)>zt){o.destroy(new Error(`${t} answered ${h} bytes, over the ${zt} byte cap`));return}o.on("data",d=>{if(p+=d.length,p>zt){o.destroy(new Error(`${t} exceeded the ${zt} byte cap`));return}l.push(d)}),o.on("end",()=>n({status:a,body:Buffer.concat(l)})),o.on("error",r)});i.setTimeout(6e4,()=>i.destroy(new Error(`${t} timed out`))),i.on("error",r)})}async function Hs(t){let{status:e,body:n}=await Ht(t);if(e!==200)throw new Error(`${t} answered ${e}`);return n}function Ci(){return __dirname}function Mi(t){return(0,u.existsSync)((0,f.join)(t,"patcher.js"))&&(0,u.existsSync)((0,f.join)(t,"renderer.js"))}function Ri(t){try{return(0,u.accessSync)(t,u.constants.W_OK),!0}catch{return!1}}function js(t,e){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(t),i=n(e);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function Ks(t,e){let n=await Hs(`https://api.github.com/repos/${wt}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=Ci();return{version:o,tag:i,available:!!o&&js(o,e),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${wt}/releases`),directory:a,writable:Mi(a)&&Ri(a)}}async function Zs(t){let{status:e,body:n}=await Ht(`https://raw.githubusercontent.com/${wt}/${t}/prebuilt/build-info.json`);if(e===404)return null;if(e!==200)throw new Error(`The release's file list answered ${e}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return r}async function qs(t,e){if(!/^[\w.-]{1,40}$/.test(e))throw new Error(`Refusing to fetch a release named ${e}`);let n=Ci();if(!Mi(n))throw new Error(`No installed bundle at ${n}`);if(!Ri(n))throw new Error(`${n} is read-only`);let r=await Zs(e);if(!r)throw new Error(`The release under ${e} carries no file list; refusing to install it unchecked`);let i=Object.keys(r),o=(0,f.join)(n,".clipper-update");(0,u.rmSync)(o,{recursive:!0,force:!0}),(0,u.mkdirSync)(o,{recursive:!0});try{let a=[];for(let h of i){if(h!==(0,f.basename)(h)||h.startsWith("."))throw new Error(`Refusing a release file named ${h}`);let{status:d,body:v}=await Ht(`https://raw.githubusercontent.com/${wt}/${e}/prebuilt/dist/${h}`);if(d!==200)throw new Error(`${h} answered ${d}`);if(v.length===0)throw new Error(`${h} came back empty`);let S=r[h];if(S?.size===void 0||!S?.sha256)throw new Error(`${h} has no size and hash in the release's file list`);if(v.length!==S.size)throw new Error(`${h} is ${v.length} bytes, the release says ${S.size}`);if((0,xi.createHash)("sha256").update(v).digest("hex").toLowerCase()!==S.sha256.toLowerCase())throw new Error(`${h} does not match its hash`);(0,u.writeFileSync)((0,f.join)(o,h),v),a.push(h)}if(a.length===0)throw new Error(`There is no bundle published under ${e}`);for(let h of["renderer.js","patcher.js"])if(!a.includes(h))throw new Error(`The release carries no ${h}`);if(!(0,u.readFileSync)((0,f.join)(o,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let s=(0,f.join)(o,".previous");(0,u.mkdirSync)(s,{recursive:!0});let l=[],p=[];try{for(let h of a){let d=(0,f.join)(n,h);(0,u.existsSync)(d)&&((0,u.renameSync)(d,(0,f.join)(s,h)),l.push(h)),(0,u.renameSync)((0,f.join)(o,h),d),p.push(h)}}catch(h){for(let d of p)try{(0,u.unlinkSync)((0,f.join)(n,d))}catch{}for(let d of l)try{(0,u.renameSync)((0,f.join)(s,d),(0,f.join)(n,d))}catch{}throw new Error(`The update could not be put in place (${h.message}). The bundle that was there has been put back.`)}return a}finally{(0,u.rmSync)(o,{recursive:!0,force:!0})}}function Ys(t){y.app.relaunch(),y.app.quit(),setTimeout(()=>y.app.exit(0),3e3)}var _i={AppleMusicRichPresence:ln,ConsoleShortcuts:cn,FixSpotifyEmbeds:Pr,FixYoutubeEmbeds:Cr,OpenInApp:mn,Translate:gn,VoiceMessages:vn,XSOverlay:yn,YoutubeAdblock:Lr,Clipper:Nn};var Di={};for(let[t,e]of Object.entries(_i)){let n=Object.entries(e);if(!n.length)continue;let r=Di[t]={};for(let[i,o]of n){let a=`VencordPluginNative_${t}_${i}`;Un.ipcMain.handle(a,o),r[i]=a}}Un.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=Di});c();function $n(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}Ce();var b=require("electron");c();var Oi="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var xe=require("fs"),de=require("fs/promises"),Bi=require("os"),jn=require("path");c();Ce();var We=require("electron");c();var Gn=require("electron"),j=["connect-src"],$=[...j,"img-src"],Fi=["style-src","font-src"],Li=[...$,"media-src"],E=[...$,...Fi],Vi=[...E,"script-src","worker-src"],Wn={"http://localhost:*":E,"http://127.0.0.1:*":E,"localhost:*":E,"127.0.0.1:*":E,"*.github.io":E,"github.com":E,"raw.githubusercontent.com":E,"*.gitlab.io":E,"gitlab.com":E,"*.codeberg.page":E,"codeberg.org":E,"*.githack.com":E,"jsdelivr.net":E,"fonts.googleapis.com":Fi,"i.imgur.com":$,"i.ibb.co":$,"i.pinimg.com":$,"files.catbox.moe":E,"cdn.discordapp.com":E,"media.discordapp.net":$,"cdnjs.cloudflare.com":Vi,"cdn.jsdelivr.net":Vi,"api.github.com":j,"ws.audioscrobbler.com":j,"musicbrainz.org":j,"*.listenbrainz.org":j,"coverartarchive.org":j,"archive.org":j,"*.archive.org":j,"translate-pa.googleapis.com":j,"*.vencord.dev":$,"manti.vendicated.dev":$,"decor.fieryflames.dev":j,"ugc.decor.fieryflames.dev":$,"sponsor.ajay.app":j,"dearrow-thumb.ajay.app":$,"usrbg.is-hardly.online":$,"icons.duckduckgo.com":$,"*.tenor.com":Li,"*.tenor.co":Li},zn=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),Js=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},Xs=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),Qs=t=>{let e=zn(t,"content-security-policy-report-only");e&&delete t[e];let n=zn(t,"content-security-policy");if(n){let r=Js(t[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(K.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(Wn))for(let s of a)i(s,o);t[n]=[Xs(r)]}};function Ni(){Gn.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&Qs(t),e==="stylesheet")){let r=zn(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),Gn.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function Ui(){We.ipcMain.handle("VencordCspRemoveOverride",rl),We.ipcMain.handle("VencordCspRequestAddOverride",nl),We.ipcMain.handle("VencordCspIsDomainAllowed",il)}function el(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!E.includes(n)))}function tl(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Vesktop for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let a=e.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function nl(t,e,n,r){if(!el(e,n))return"invalid";let i=new URL(e).host;if(i in K.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await We.dialog.showMessageBox({...tl(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(K.store.customCspRules[i]=n,"ok"):"unchecked"}function rl(t,e){return e in K.store.customCspRules?(delete K.store.customCspRules[e],!0):!1}function il(t,e,n){try{let r=new URL(e).host,i=Wn[r]??K.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}c();var ol=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,al=/^\\@/;function Bn(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function $i(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function Gi(t,e){if(!t)return Bn(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return Bn(e);let r={},i="",o="";for(let a of n.split(ol))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace(al,"@");return r[i]=o.trim(),delete r[""],Bn(e,r)}c();var Be=require("path");function ue(t,e){let n=(0,Be.normalize)(t+"/"),r=(0,Be.join)(t,e),i=(0,Be.normalize)(r);return i===(0,Be.normalize)(t)||i.startsWith(n)?i:null}c();var zi=require("electron");function Wi(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":zi.shell.openExternal(e)}return{action:"deny"}})}var sl=(0,jn.join)(__dirname,"vencordDesktopRenderer.css");(0,xe.mkdirSync)(ie,{recursive:!0});Ui();function Hi(){return(0,de.readFile)(Re,"utf-8").catch(()=>"")}async function ll(){let t=await(0,de.readdir)(ie).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await ji(n).then($i).catch(()=>null);r!=null&&e.push(Gi(r,n))}return e}function ji(t){t=t.replace(/\?v=\d+$/,"");let e=ue(ie,t);return e?(0,de.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}b.ipcMain.handle("VencordOpenQuickCss",()=>b.shell.openPath(Re));b.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!kr.includes(n))throw"Disallowed protocol.";b.shell.openExternal(e).catch(r=>console.error("[Vencord] Failed to open external link",e,r))});b.ipcMain.handle("VencordGetQuickCss",()=>Hi());b.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,xe.writeFileSync)(Re,e));b.ipcMain.handle("VencordGetThemesList",()=>ll());b.ipcMain.handle("VencordGetThemeData",(t,e)=>ji(e));b.ipcMain.handle("VencordGetThemeSystemValues",()=>{let t=b.systemPreferences.getAccentColor?.()??"";return t.length&&t[0]!=="#"&&(t=`#${t}`),{"os-accent-color":t}});b.ipcMain.handle("VencordOpenThemesFolder",()=>b.shell.openPath(ie));b.ipcMain.handle("VencordOpenSettingsFolder",()=>b.shell.openPath(fe));var Hn=[];b.ipcMain.handle("VencordInitFileWatchers",({sender:t})=>{Hn.forEach(i=>i.close());let e,n;(0,de.open)(Re,"a+").then(i=>{i.close(),e=(0,xe.watch)(Re,{persistent:!1},$n(async()=>{t.postMessage("VencordQuickCssUpdate",await Hi())},50))}).catch(()=>{});let r=(0,xe.watch)(ie,{persistent:!1},$n(()=>{t.postMessage("VencordThemeUpdate",void 0)}));Hn=[e,r,n].filter(Boolean),t.once("destroyed",()=>{e?.close(),r.close(),n?.close(),Hn=[]})});b.ipcMain.on("VencordGetMonacoTheme",t=>{t.returnValue=b.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});b.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=b.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new b.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:b.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,jn.join)(__dirname,"vencordDesktopPreload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});Wi(n),await n.loadURL(`data:text/html;base64,${Oi}`)});b.ipcMain.handle("VencordGetRendererCss",()=>(0,de.readFile)(sl,"utf-8"));b.ipcMain.on("VencordSupportsWindowsMaterial",t=>{t.returnValue=Number((0,Bi.release)().split(".")[2])>=22621});var Ee=require("electron"),mo=require("path"),tr=require("url");c();var Xt=require("electron");c();var qi=require("module"),cl=(0,qi.createRequire)("/"),He,Kt,Zn,ul=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{He=cl("worker_threads"),Kt=He.Worker,Zn=He.isMarkedAsUntransferable}catch{}var dl=Kt?function(t,e,n,r,i){var o=!1,a=new Kt(t+ul,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return Zn&&(r=r.filter(function(s){return!Zn(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,Kt.prototype.terminate.call(a)},a}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},C=Uint8Array,ke=Uint16Array,Yi=Int32Array,Yn=new C([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Jn=new C([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Ji=new C([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Xi=function(t,e){for(var n=new ke(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new Yi(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},He=Xi(Yn,2),Xn=He.b,hl=He.r;Xn[28]=258,hl[258]=28;var Qi=Xi(Jn,0),eo=Qi.b,_u=Qi.r,Yt=new ke(32768);for(w=0;w<32768;++w)ee=(w&43690)>>1|(w&21845)<<1,ee=(ee&52428)>>2|(ee&13107)<<2,ee=(ee&61680)>>4|(ee&3855)<<4,Yt[w]=((ee&65280)>>8|(ee&255)<<8)>>1;var ee,w,je=(function(t,e,n){for(var r=t.length,i=0,o=new ke(e);i<r;++i)t[i]&&++o[t[i]-1];var a=new ke(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new ke(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var p=i<<4|t[i],h=e-t[i],d=a[t[i]-1]++<<h,v=d|(1<<h)-1;d<=v;++d)s[Yt[d]>>l]=p}else for(s=new ke(r),i=0;i<r;++i)t[i]&&(s[i]=Yt[a[t[i]-1]++]>>15-t[i]);return s}),bt=new C(288);for(w=0;w<144;++w)bt[w]=8;var w;for(w=144;w<256;++w)bt[w]=9;var w;for(w=256;w<280;++w)bt[w]=7;var w;for(w=280;w<288;++w)bt[w]=8;var w,to=new C(32);for(w=0;w<32;++w)to[w]=5;var w;var no=je(bt,9,1);var ro=je(to,5,1),Zt=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},G=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},qt=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},io=function(t){return(t+7)/8|0},Jt=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new C(t.subarray(e,n))};var oo=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],P=function(t,e,n){var r=new Error(e||oo[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,P),!n)throw r;return r},ao=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new C(0);var a=!n,s=a||e.i!=2,l=e.i;a&&(n=new C(i*3));var p=function(sr){var lr=n.length;if(sr>lr){var cr=new C(Math.max(lr*2,sr));cr.set(n),n=cr}},h=e.f||0,d=e.p||0,v=e.b||0,S=e.l,M=e.d,L=e.m,T=e.n,V=i*8;do{if(!S){h=G(t,d,1);var te=G(t,d+1,3);if(d+=3,te)if(te==1)S=no,M=ro,L=9,T=5;else if(te==2){var Ke=G(t,d,31)+257,St=G(t,d+10,15)+4,he=Ke+G(t,d+5,31)+1;d+=14;for(var F=new C(he),Ie=new C(19),I=0;I<St;++I)Ie[Ji[I]]=G(t,d+I*3,7);d+=St*3;for(var Ze=Zt(Ie),go=(1<<Ze)-1,vo=je(Ie,Ze,1),I=0;I<he;){var nr=vo[G(t,d,go)];d+=nr&15;var A=nr>>4;if(A<16)F[I++]=A;else{var Pe=0,xt=0;for(A==16?(xt=3+G(t,d,3),d+=2,Pe=F[I-1]):A==17?(xt=3+G(t,d,7),d+=3):A==18&&(xt=11+G(t,d,127),d+=7);xt--;)F[I++]=Pe}}var rr=F.subarray(0,Ke),ne=F.subarray(Ke);L=Zt(rr),T=Zt(ne),S=je(rr,L,1),M=je(ne,T,1)}else P(1);else{var A=io(d)+4,X=t[A-4]|t[A-3]<<8,Te=A+X;if(Te>i){l&&P(0);break}s&&p(v+X),n.set(t.subarray(A,Te),v),e.b=v+=X,e.p=d=Te*8,e.f=h;continue}if(d>V){l&&P(0);break}}s&&p(v+131072);for(var yo=(1<<L)-1,wo=(1<<T)-1,Qt=d;;Qt=d){var Pe=S[qt(t,d)&yo],Ae=Pe>>4;if(d+=Pe&15,d>V){l&&P(0);break}if(Pe||P(2),Ae<256)n[v++]=Ae;else if(Ae==256){Qt=d,S=null;break}else{var ir=Ae-254;if(Ae>264){var I=Ae-257,qe=Yn[I];ir=G(t,d,(1<<qe)-1)+Xn[I],d+=qe}var en=M[qt(t,d)&wo],tn=en>>4;en||P(3),d+=en&15;var ne=eo[tn];if(tn>3){var qe=Jn[tn];ne+=qt(t,d)&(1<<qe)-1,d+=qe}if(d>V){l&&P(0);break}s&&p(v+131072);var or=v+ir;if(v<ne){var ar=o-ne,bo=Math.min(ne,or);for(ar+v<0&&P(3);v<bo;++v)n[v]=r[ar+v]}for(;v<or;++v)n[v]=n[v-ne]}}e.l=S,e.p=Qt,e.b=v,e.f=h,S&&(h=1,e.m=L,e.d=M,e.n=T)}while(!h);return v!=n.length&&a?Jt(n,0,v):n.subarray(0,v)};var pl=new C(0);var fl=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},Ki=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){e+=";"+l+"=";var p=s.toString();if(s.prototype)if(p.indexOf("[native code]")!=-1){var h=p.indexOf(" ",8)+1;e+=p.slice(h,p.indexOf("(",h))}else{e+=p;for(var d in s.prototype)e+=";"+l+".prototype."+d+"="+s.prototype[d].toString()}else e+=p}else n[l]=s}return e},jt=[],ml=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},gl=function(t,e,n,r){if(!jt[n]){for(var i="",o={},a=t.length-1,s=0;s<a;++s)i=Ki(t[s],i,o);jt[n]={c:Ki(t[a],i,o),e:o}}var l=fl({},jt[n].e);return dl(jt[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,ml(l),r)},vl=function(){return[C,ke,Yi,Yn,Jn,Ji,Xn,eo,no,ro,Yt,oo,je,Zt,G,qt,io,Jt,P,ao,Qn,so,lo]};var so=function(t){return postMessage(t,[t.buffer])},lo=function(t){return t&&{out:t.size&&new C(t.size),dictionary:t.dictionary}},yl=function(t,e,n,r,i,o){var a=gl(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([t,e],e.consume?[t.buffer]:[]),function(){a.terminate()}};var Y=function(t,e){return t[e]|t[e+1]<<8},z=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},Kn=function(t,e){return z(t,e)+z(t,e+4)*4294967296};function wl(t,e,n){return n||(n=e,e={}),typeof n!="function"&&P(7),yl(t,e,[vl],function(r){return so(Qn(r.data[0],lo(r.data[1])))},1,n)}function Qn(t,e){return ao(t,{i:2},e&&e.out,e&&e.dictionary)}var qn=typeof TextDecoder<"u"&&new TextDecoder,bl=0;try{qn.decode(pl,{stream:!0}),bl=1}catch{}var Sl=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:Jt(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function xl(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(qn)return qn.decode(t);var i=Sl(t),o=i.s,n=i.r;return n.length&&P(8),o}}var kl=function(t,e){return e+30+Y(t,e+26)+Y(t,e+28)},El=function(t,e,n){var r=Y(t,e+28),i=Y(t,e+30),o=xl(t.subarray(e+46,e+46+r),!(Y(t,e+8)&2048)),a=e+46+r,s=Tl(t,a,i,n,z(t,e+20),z(t,e+24),z(t,e+42)),l=s[0],p=s[1],h=s[2];return[Y(t,e+10),l,p,o,a+i+Y(t,e+32),h]},Tl=function(t,e,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,p=a==4294967295,h=e+n,d=s+l+p;if(r&&d){for(;e+4<h;e+=4+Y(t,e+2))if(Y(t,e)==1)return[s?Kn(t,e+4+8*l):i,l?Kn(t,e+4):o,p?Kn(t,e+4+8*(l+s)):a,1];r<2&&P(13)}return[i,o,a,0]};var Zi=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function co(t,e,n){n||(n=e,e={}),typeof n!="function"&&P(7);var r=[],i=function(){for(var T=0;T<r.length;++T)r[T]()},o={},a=function(T,V){Zi(function(){n(T,V)})};Zi(function(){a=n});for(var s=t.length-22;z(t,s)!=101010256;--s)if(!s||t.length-s>65558)return a(P(13,0,1),null),i;var l=Y(t,s+8);if(l){var p=l,h=z(t,s+16),d=z(t,s-20)==117853008;if(d){var v=z(t,s-12);d=z(t,v)==101075792,d&&(p=l=z(t,v+32),h=z(t,v+48))}for(var S=e&&e.filter,M=function(T){var V=El(t,h,d),te=V[0],A=V[1],X=V[2],Te=V[3],Ke=V[4],St=V[5],he=kl(t,St);h=Ke;var F=function(I,Ze){I?(i(),a(I,null)):(Ze&&(o[Te]=Ze),--l||a(null,o))};if(!S||S({name:Te,size:A,originalSize:X,compression:te}))if(!te)F(null,Jt(t,he,he+A));else if(te==8){var Ie=t.subarray(he,he+A);if(X<524288||A>.8*X)try{F(null,Qn(Ie,{out:new C(X)}))}catch(I){F(I,null)}else r.push(wl(Ie,{size:X},F))}else F(P(14,"unknown compression type "+te,1),null);else F(null,null)},L=0;L<p;++L)M(L)}else a(null,{});return i}var po=require("fs"),J=require("fs/promises"),er=require("path");c();function uo(t){function e(a,s,l,p){let h=0;return h+=a<<0,h+=s<<8,h+=l<<16,h+=p<<24>>>0,h}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let a=e(t[8],t[9],t[10],t[11]),s=e(t[12],t[13],t[14],t[15]),l=16+a+s;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}c();var Il=require("original-fs");async function Pl(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function ho(t,e){let r=await(await Pl(t,e)).arrayBuffer();return Buffer.from(r)}var Al=(0,er.join)(Tt,"ExtensionCache");async function Cl(t,e){return await(0,J.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{co(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let d=ue(e,a);if(!d)throw new Error(`Path traversal detected: "${a}"`);return void await(0,J.mkdir)(d,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),p=ue(e,l);if(!p)throw new Error(`Path traversal detected: "${a}"`);let h=ue(e,a);if(!h)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,J.mkdir)(p,{recursive:!0}),await(0,J.writeFile)(h,o[a])})).then(()=>n()).catch(a=>{(0,J.rm)(e,{recursive:!0,force:!0}),r(a)})})})}async function fo(t){let e=(0,er.join)(Al,t);try{await(0,J.access)(e,po.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await ho(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await Cl(uo(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}Xt.session.defaultSession.extensions?Xt.session.defaultSession.extensions.loadExtension(e):Xt.session.defaultSession.loadExtension(e)}Ee.app.whenReady().then(()=>{Ee.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=ue(ie,n);return r?Ee.net.fetch((0,tr.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return Ee.net.fetch((0,tr.pathToFileURL)((0,mo.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{R.store.enableReactDevtools&&fo("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}Ni()});
//# sourceURL=file:///VencordDesktopMain
//# sourceMappingURL=vencord://vencordDesktopMain.js.map
/*! For license information please see vencordDesktopMain.js.LEGAL.txt */

// Vencord 59a5428
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var $o=Object.create;var Rt=Object.defineProperty;var Go=Object.getOwnPropertyDescriptor;var zo=Object.getOwnPropertyNames;var Wo=Object.getPrototypeOf,Bo=Object.prototype.hasOwnProperty;var G=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(r){throw n=[r],r}};var be=(e,t)=>{for(var n in t)Rt(e,n,{get:t[n],enumerable:!0})},br=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of zo(t))!Bo.call(e,i)&&i!==n&&Rt(e,i,{get:()=>t[i],enumerable:!(r=Go(t,i))||r.enumerable});return e};var dn=(e,t,n)=>(n=e!=null?$o(Wo(e)):{},br(t||!e||!e.__esModule?Rt(n,"default",{value:e,enumerable:!0}):n,e)),pn=e=>br(Rt({},"__esModule",{value:!0}),e);var c=G(()=>{"use strict"});var Le=G(()=>{"use strict";c()});function rt(e){return async function(){try{return{ok:!0,value:await e(...arguments)}}catch(t){return{ok:!1,error:t instanceof Error?{...t,message:t.message,name:t.name,stack:t.stack}:t}}}}var Sr=G(()=>{"use strict";c()});var qo={};function Ve(...e){let t={cwd:Tr};return fn?hn("flatpak-spawn",["--host","git",...e],t):hn("git",e,t)}async function jo(){return(await Ve("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function Ho(){await Ve("fetch");let e=(await Ve("branch","--show-current")).stdout.trim();if(!((await Ve("ls-remote","origin",e)).stdout.length>0))return[];let r=(await Ve("log",`HEAD...origin/${e}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function Ko(){return(await Ve("pull")).stdout.includes("Fast-forward")}async function Zo(){return!(await hn(fn?"flatpak-spawn":"node",fn?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:Tr})).stderr.includes("Build failed")}var xr,it,kr,Er,Tr,hn,fn,Pr=G(()=>{"use strict";c();Le();xr=require("child_process"),it=require("electron"),kr=require("path"),Er=require("util");Sr();Tr=(0,kr.join)(__dirname,".."),hn=(0,Er.promisify)(xr.execFile),fn=!1;it.ipcMain.handle("VencordGetRepo",rt(jo));it.ipcMain.handle("VencordGetUpdates",rt(Ho));it.ipcMain.handle("VencordUpdate",rt(Ko));it.ipcMain.handle("VencordBuild",rt(Zo))});var wn,_r,ot,Dr=G(()=>{"use strict";c();wn=Symbol("SettingsStore.isProxy"),_r=Symbol("SettingsStore.getRawTarget"),ot=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let t=this;return{get(n,r,i){if(r===wn)return!0;if(r===_r)return n;let o=Reflect.get(n,r,i),a=t.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&t.getDefaultValue!=null&&(o=t.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[wn]){let h=`${l}${l&&"."}${r}`;return t.makeProxy(o,s,h)}return o},set(n,r,i){if(i?.[wn]&&(i=i[_r]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=t.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return t.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=t.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return t.notifyListeners(s,void 0,o),!0}}})();constructor(t,n={}){this.plain=t,this.store=this.makeProxy(t),Object.assign(this,n)}makeProxy(t,n=t,r=""){return this.proxyContexts.set(t,{root:n,path:r}),new Proxy(t,this.proxyHandler)}notifyPrefixListeners(t,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,t))}}notifyListeners(t,n,r){let i=t.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,h)=>l[h],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,t));this.pathListeners.get(t)?.forEach(o=>o(n)),this.notifyPrefixListeners(t,i,n)}setData(t,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=t,this.store=this.makeProxy(t),n){let r=t,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(t){this.globalListeners.add(t)}addChangeListener(t,n){let r=this.pathListeners.get(t)??new Set;r.add(n),this.pathListeners.set(t,r)}addPrefixChangeListener(t,n){let r=this.prefixListeners.get(t)??new Set;r.add(n),this.prefixListeners.set(t,r)}removeGlobalChangeListener(t){this.globalListeners.delete(t)}removeChangeListener(t,n){let r=this.pathListeners.get(t);r&&(r.delete(n),r.size||this.pathListeners.delete(t))}removePrefixChangeListener(t,n){let r=this.prefixListeners.get(t);r&&(r.delete(n),r.size||this.prefixListeners.delete(t))}markAsChanged(){this.globalListeners.forEach(t=>t(this.plain,""))}}});function bn(e,t){for(let n in t){let r=t[n];typeof r=="object"&&!Array.isArray(r)?(e[n]??={},bn(e[n],r)):e[n]??=r}return e}var Or=G(()=>{"use strict";c()});var Lr,le,_t,Se,ce,Fe,Sn,xn,Vr,Dt,Ne=G(()=>{"use strict";c();Lr=require("electron"),le=require("path"),_t=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,le.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,le.join)(Lr.app.getPath("userData"),"..","Vencord")),Se=(0,le.join)(_t,"settings"),ce=(0,le.join)(_t,"themes"),Fe=(0,le.join)(Se,"quickCss.css"),Sn=(0,le.join)(Se,"settings.json"),xn=(0,le.join)(Se,"native-settings.json"),Vr=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"],Dt=process.argv.includes("--vanilla")});function Fr(e,t){try{return JSON.parse((0,xe.readFileSync)(t,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${e} settings`,n),{}}}var kn,xe,A,Qo,Nr,K,ne=G(()=>{"use strict";c();Le();Dr();Or();kn=require("electron"),xe=require("fs");Ne();(0,xe.mkdirSync)(Se,{recursive:!0});A=new ot(Fr("renderer",Sn));A.addGlobalChangeListener(()=>{try{(0,xe.writeFileSync)(Sn,JSON.stringify(A.plain,null,4))}catch(e){console.error("Failed to write renderer settings",e)}});kn.ipcMain.on("VencordGetSettings",e=>e.returnValue=A.plain);kn.ipcMain.handle("VencordSetSettings",(e,t,n)=>{A.setData(t,n)});Qo={plugins:{},customCspRules:{}},Nr=Fr("native",xn);bn(Nr,Qo);K=new ot(Nr);K.addGlobalChangeListener(()=>{try{(0,xe.writeFileSync)(xn,JSON.stringify(K.plain,null,4))}catch(e){console.error("Failed to write native settings",e)}})});function Ao(e,t,n){let r=t;if(t in e)return void n(e[r]);Object.defineProperty(e,t,{set(i){delete e[r],e[r]=i,n(i)},configurable:!0,enumerable:!1})}var Co=G(()=>{"use strict";c()});var Zl={};function Kl(e,t){let n=e.slice(4).split(".").map(Number),r=t.slice(4).split(".").map(Number);for(let i=0;i<r.length;i++){if(n[i]>r[i])return!0;if(n[i]<r[i])return!1}return!1}function Ro(){if(!process.env.DISABLE_UPDATER_AUTO_PATCHING)try{let e=(0,j.dirname)(process.execPath),t=(0,j.basename)(e),n=(0,j.join)(e,".."),r=(0,Q.readdirSync)(n).reduce((h,u)=>u.startsWith("app-")&&Kl(u,h)?u:h,t);if(r===t)return;let i=(0,j.join)(n,t,"resources"),o=(0,j.join)(i,"app.asar"),a=(0,j.join)(n,r,"resources"),s=(0,j.join)(a,"app.asar"),l=(0,j.join)(a,"_app.asar");if(!(0,Q.existsSync)(o)||!(0,Q.existsSync)(s)||(0,Q.existsSync)(l))return;console.info(`[Vencord] Detected Host Update (${t} -> ${r}). Repatching...`),(0,Q.renameSync)(s,l),(0,Q.copyFileSync)(o,s)}catch(e){console.error("[Vencord] Failed to repatch latest host update",e)}}var Mo,cr,Q,j,_o=G(()=>{"use strict";c();Mo=require("electron"),cr=dn(require("events")),Q=require("original-fs"),j=require("path");cr.default.prototype.emit=new Proxy(cr.default.prototype.emit,{apply(e,t,n){return n[0]==="host-updated"&&Ro(),Reflect.apply(e,t,n)}}),Mo.app.on("before-quit",Ro)});var Xl={};var H,ve,ql,Yl,ur,Jl,Do=G(()=>{"use strict";c();Co();H=dn(require("electron")),ve=require("path");ne();Ne();console.log("[Vencord] Starting up...");ql=require.main.filename,Yl=require.main.path.endsWith("app.asar")?"_app.asar":"app.asar",ur=(0,ve.join)((0,ve.dirname)(ql),"..",Yl),Jl=require((0,ve.join)(ur,"package.json"));require.main.filename=(0,ve.join)(ur,Jl.main);H.app.setAppPath(ur);if(Dt)console.log("[Vencord] Running in vanilla mode. Not loading Vencord");else{let e=A.store;if(_o(),e.winCtrlQ){let r=H.Menu.buildFromTemplate;H.Menu.buildFromTemplate=function(i){if(i[0]?.label==="&File"){let{submenu:o}=i[0];Array.isArray(o)&&o.push({label:"Quit (Hidden)",visible:!1,acceleratorWorksWhenHidden:!0,accelerator:"Control+Q",click:()=>H.app.quit()})}return r.call(this,i)}}class t extends H.default.BrowserWindow{constructor(i){if(!i?.webPreferences?.preload||!i.title){super(i);return}let{frameless:o,winNativeTitleBar:a,disableMinSize:s,transparent:l,macosVibrancyStyle:h,windowsMaterial:u}=e,p=i.webPreferences.preload;i.webPreferences.preload=(0,ve.join)(__dirname,"preload.js"),i.webPreferences.sandbox=!1,o?i.frame=!1:a&&delete i.frame,s&&(i.minWidth=0,i.minHeight=0),l&&(i.transparent=!0,i.backgroundColor="#00000000"),u&&u!=="none"&&(i.backgroundMaterial=u,i.backgroundColor="#00000000"),process.env.DISCORD_PRELOAD=p,super(i),s&&(this.setMinimumSize=(y,E)=>{})}}Object.assign(t,H.default.BrowserWindow),Object.defineProperty(t,"name",{value:"BrowserWindow",configurable:!0});let n=require.resolve("electron");delete require.cache[n].exports,require.cache[n].exports={...H.default,BrowserWindow:t},Ao(global,"appSettings",r=>{r.set("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING",!0)}),process.env.DATA_DIR=(0,ve.join)(H.app.getPath("userData"),"..","Vencord")}console.log("[Vencord] Loading original Discord app.asar");require(require.main.filename)});c();c();c();Pr();c();Le();var Zn=require("electron");c();var vn={};be(vn,{fetchTrackData:()=>Jo});c();c();c();var Ir="59a5428";c();var mn="Vendicated/Vencord";var Ar=`Vencord/${Ir}${mn?` (https://github.com/${mn})`:""}`;var Cr=require("child_process"),Rr=require("util"),Mr=(0,Rr.promisify)(Cr.execFile);async function gn(e){let{stdout:t}=await Mr("osascript",e.map(n=>["-e",n]).flat());return t}var z=null;async function Yo({id:e,name:t,artist:n,album:r}){if(e===z?.id){if("data"in z)return z.data;if("failures"in z&&z.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${t} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":Ar}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return z={id:e,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},z.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),z={id:e,failures:(e===z?.id&&"failures"in z?z.failures:0)+1},null}}async function Jo(){try{await Mr("pgrep",["^Music$"])}catch{return null}if(await gn(['tell application "Music"',"get player state","end tell"]).then(u=>u.trim())!=="playing")return null;let t=await gn(['tell application "Music"',"get player position","end tell"]).then(u=>Number.parseFloat(u.trim())),n=await gn(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(u=>!!u),l=Number.parseFloat(s),h=await Yo({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:t,duration:l,...h}}var yn={};be(yn,{initDevtoolsOpenEagerLoad:()=>Xo});c();function Xo(e){let t=()=>e.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");e.sender.isDevToolsOpened()?t():e.sender.once("devtools-opened",()=>t())}var $r={};c();ne();var Lt=require("electron"),Ot=[];function Ur(){let e=[];for(let t=Ot.length-1;t>=0;t--){let{processId:n,routingId:r}=Ot[t],i=Lt.webFrameMain.fromId(n,r);if(!i){Ot.splice(t,1);continue}e.push(i)}return e}Lt.app.on("browser-window-created",(e,t)=>{t.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){Ur();let{routingId:i,processId:o}=r;Ot.push({routingId:i,processId:o});let a=A.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});A.addChangeListener("plugins.FixSpotifyEmbeds.volume",e=>{try{Ur().forEach(t=>t.executeJavaScript(`globalThis._vcVolume = ${e/100}`))}catch(t){console.error("FixSpotifyEmbeds: Failed to update volume",t)}});var zr={};c();ne();var Gr=require("electron");Gr.app.on("browser-window-created",(e,t)=>{t.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!A.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var En={};be(En,{resolveRedirect:()=>ta});c();var Wr=require("https"),ea=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function Br(e){return new Promise((t,n)=>{let r=(0,Wr.request)(new URL(e),{method:"HEAD"},i=>{t(i.headers.location?Br(i.headers.location):e)});r.on("error",n),r.end()})}async function ta(e,t){return ea.test(t)?Br(t):t}var Tn={};be(Tn,{makeDeeplTranslateRequest:()=>na,makeKagiTranslateRequest:()=>ra});c();async function na(e,t,n,r){let i=t?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function ra(e,t,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${t}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var Pn={};be(Pn,{readRecording:()=>ia});c();var jr=require("electron"),Vt=require("fs/promises"),at=require("path");async function ia(e,t){t=(0,at.normalize)(t);let n=(0,at.basename)(t),r=(0,at.normalize)(jr.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!t.startsWith(r))return null;try{let i=await(0,Vt.readFile)(t);return(0,Vt.rm)(t).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var In={};be(In,{closeSocket:()=>aa,sendToOverlay:()=>oa});c();var Hr=require("dgram"),Ft=null;function oa(e,t){t.messageType=t.type;let n=JSON.stringify(t);Ft??=(0,Hr.createSocket)("udp4"),Ft.send(n,42069,"127.0.0.1")}function aa(){Ft?.close(),Ft=null}var Zr={};c();ne();var Kr=require("electron");c();var An=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;Kr.app.on("browser-window-created",(e,t)=>{t.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{A.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(An):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(An))})})});var Kn={};be(Kn,{answerOverlayAction:()=>ol,armDisplayMedia:()=>Rs,checkUpdate:()=>ul,closeStudioOverlay:()=>tl,deleteClip:()=>ls,disarmDisplayMedia:()=>Ms,downloadUpdate:()=>pl,dropOverlayWaiters:()=>il,focusClient:()=>al,gameFeedStatus:()=>Fs,getActiveScreen:()=>Cs,getCaptureSources:()=>Is,getClipDirectory:()=>ks,getMemoryReport:()=>As,getPlatformInfo:()=>Ps,hideClipOverlay:()=>Ys,hideVrPanel:()=>Bs,listClips:()=>as,notifyClipSaved:()=>qs,openClipDirectory:()=>Ts,openStudioOverlay:()=>el,openVrBindings:()=>zs,pickAudioFiles:()=>ms,pickClipDirectory:()=>Es,pickImageFiles:()=>ys,pickVideoFiles:()=>ps,readAudioFile:()=>vs,readClip:()=>ss,readImageFile:()=>Ss,readLibrary:()=>us,readVideoFile:()=>fs,readVoiceTrack:()=>is,registerShortcuts:()=>Ds,relaunchClient:()=>hl,releaseClipPath:()=>es,renameClip:()=>cs,reserveClipPath:()=>Qa,revealClip:()=>xs,saveClip:()=>Xa,saveVoiceTrack:()=>rs,showClipOverlay:()=>Zs,showVrPanel:()=>Ws,startGameFeeds:()=>Ls,startVrBridge:()=>Us,stopGameFeeds:()=>Vs,stopVrBridge:()=>$s,studioOverlayUp:()=>nl,unregisterShortcuts:()=>Hn,vrBridgeStatus:()=>Gs,waitForGameEvent:()=>Ns,waitForOverlayAction:()=>rl,waitForShortcut:()=>Os,waitForVrEvent:()=>js,writeLibrary:()=>ds});c();var Li=require("crypto"),v=require("electron"),d=require("fs"),Vi=require("https"),f=require("path");c();var W=require("fs"),Jr=require("http"),Xr=require("https"),Qr=require("os"),pt=require("path"),qr=34765,sa=6,ei=256*1024,la=2e3,ca=1500,ua="127.0.0.1",da=2999,pa="gamestate_integration_clipper.cfg",ue=null,$e=0,Ut="",Ge=null,ut=[],ha=12,dt=[],ze=[],We={cs2:!1,league:!1};function $t(e){ut.length>=ha||ut.includes(e)||ut.push(e)}var Gt=Promise.resolve();function st(e){let t=ze.shift();if(t){t(e);return}dt.push(e),dt.length>16&&dt.shift()}var S={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function ti(){S={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function fa(e){return e>=5?"an ace in Counter-Strike 2":e===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function ma(e){let t=e.provider?.steamid,{player:n}=e;if(!n||!t||!n.steamid||n.steamid!==t)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof e.map?.round=="number"?e.map.round:S.round;(r.kills<S.kills||r.deaths<S.deaths)&&ti();let o=S.kills<0;i!==S.round&&(S.round=i,S.roundKills=0,S.announced=0);let a=r.kills-Math.max(0,S.kills),s=r.deaths-Math.max(0,S.deaths);if(S.kills=r.kills,S.deaths=r.deaths,o)return;a>0&&(S.roundKills+=a,S.roundKills>=3&&S.roundKills>S.announced?(S.announced=S.roundKills,st({kind:"multikill",note:fa(S.roundKills)})):st({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&st({kind:"death",note:"your death in Counter-Strike 2"});let l=e.round?.win_team;l&&n.team&&l===n.team&&e.round?.phase==="over"&&S.roundKills>0&&st({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function ga(){return new Promise(e=>{let t=0,n=(0,Jr.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>ei&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{ma(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++t<sa){n.listen(qr+t,"127.0.0.1");return}$t(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}ue===n&&(ue=null,$e=0,We={...We,cs2:!1}),e(0)}),n.on("listening",()=>{ue=n,e(n.address().port)}),n.listen(qr,"127.0.0.1")})}function va(){let e=[],t=(0,Qr.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&e.push((0,pt.join)(i,"Steam"))}let n=[];for(let r of e)if((0,W.existsSync)(r)){n.push(r);try{let i=(0,W.readFileSync)((0,pt.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function ya(){for(let e of va()){let t=(0,pt.join)(e,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,W.existsSync)(t))return t}return""}function wa(e){let t=ya();if(!t)return $t("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,pt.join)(t,pa),r=`"Clipper"
{
    "uri"       "http://127.0.0.1:${e}/"
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
`;try{return(0,W.mkdirSync)(t,{recursive:!0}),(0,W.writeFileSync)(n,r,"utf8"),n}catch(i){return $t(`Counter-Strike 2's config could not be written (${i.message})`),""}}function ba(){let e=Ut;if(Ut="",!!e)try{(0,W.unlinkSync)(e)}catch{}}var lt="",Ue=-1,Cn=!1,Nt=!1;function ct(e){return e.split("#")[0].trim().toLowerCase()}function Yr(e){return new Promise(t=>{let n=(0,Xr.get)({host:ua,port:da,path:e,rejectUnauthorized:!1,timeout:ca},r=>{if(r.statusCode!==200){r.resume(),t(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>ei&&n.destroy()}),r.on("end",()=>{try{t(JSON.parse(i))}catch{t(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>t(null))})}function Sa(e,t){let n=e.EventName??"",r=ct(e.KillerName??"");switch(n){case"ChampionKill":return r===t?{kind:"kill",note:"a kill in League of Legends"}:ct(e.VictimName??"")===t?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==t?null:{kind:"multikill",note:`a ${e.KillStreak??3}-kill run in League of Legends`};case"Ace":return ct(e.Acer??"")!==t?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return ct(e.Recipient??"")!==t?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==t?null:{kind:"objective",note:`${e.DragonType?`the ${e.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==t?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==t?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==t?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function xa(){if(!Nt){Nt=!0;try{if(!lt){let r=await Yr("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;lt=ct(r),Ue=-1}let e=await Yr("/liveclientdata/eventdata");if(!e?.Events){lt="";return}let t=Ue<0,n=Ue;for(let r of e.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=Ue||(n=Math.max(n,i),t))continue;let o=Sa(r,lt);o&&st(o)}Ue=n}finally{Nt=!1}}}function ka(){lt="",Ue=-1,Nt=!1,Ge=setInterval(()=>{xa().catch(e=>{Cn||(Cn=!0,$t(`League of Legends could not be read (${e.message})`))})},la)}function Ea(e){return e.cs2!==We.cs2||e.league!==We.league?!1:(!e.cs2||ue!==null)&&(!e.league||Ge!==null)}function ni(e){let t=Gt.then(async()=>(Ea(e)||(ri(),ut=[],e.cs2&&(ti(),$e=await ga(),$e&&(Ut=wa($e))),e.league&&ka(),We={cs2:e.cs2&&ue!==null,league:e.league}),zt()));return Gt=t.catch(()=>{}),t}function ri(){if(We={cs2:!1,league:!1},Ge&&clearInterval(Ge),Ge=null,Cn=!1,ue)try{ue.close()}catch{}ue=null,$e=0,ba(),dt=[];let e=ze;ze=[];for(let t of e)t(null)}function Rn(){let e=Gt.then(()=>ri());return Gt=e.catch(()=>{}),e}function zt(){return{port:$e,configPath:Ut,league:Ge!==null,problems:[...ut]}}function ii(e){let t=dt.shift();return t?Promise.resolve(t):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{ze=ze.filter(a=>a!==i),i(null)},e);ze.push(i)})}c();var de=require("electron"),jt=require("fs"),ft=require("path"),oi=require("url"),Wt=24,ai=2600,Bt=220,Ta=300,Pa=56,Mn=!0;function Ht(){return Mn}var Te=null,ke=null,ht=null,Ee=null;function Ia(){return!!Te&&!Te.isDestroyed()}function Pe(){ke&&(clearTimeout(ke),ke=null);let e=Te;Te=null,e&&!e.isDestroyed()&&e.destroy()}function Be(){Ee&&(clearTimeout(Ee),Ee=null);let e=ht;ht=null,e&&!e.isDestroyed()&&e.destroy()}function Aa(e,t,n){let i=de.screen.getDisplayNearestPoint(de.screen.getCursorScreenPoint()).workArea,o=e==="top-left"||e==="bottom-left",a=e==="top-left"||e==="top-right";return{x:Math.round(o?i.x+Wt:i.x+i.width-t-Wt),y:Math.round(a?i.y+Wt:i.y+i.height-n-Wt)}}function mt(e,t){let n=(0,ft.join)(de.app.getPath("userData"),"clipper-overlay");(0,jt.mkdirSync)(n,{recursive:!0});let r=(0,ft.join)(n,e);return(0,jt.writeFileSync)(r,t,"utf8"),r}function si(e,t,n,r){let{x:i,y:o}=Aa(r,t,n),a=new de.BrowserWindow({width:t,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(e).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function li(e){return`<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }
    .card {
        position: absolute; inset: 0; border-radius: 12px; overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 10px 34px rgba(0, 0, 0, 0.6);
        opacity: 0; transform: scale(0.96); transition: opacity ${Bt}ms ease, transform ${Bt}ms ease;
    }
    .card.up { opacity: 1; transform: none; }
    ${e}
</style>`}function Z(e){return JSON.stringify(e).replace(/</g,"\\u003c")}function Ca(e,t){return`<!doctype html>
<html>
<head>
${li(`.card { background: #000; }
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
    var look = ${Z(t)};
    var video = document.getElementById("video");
    var card = document.getElementById("card");
    document.getElementById("tag").textContent = ${Z((0,ft.basename)(e))};

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

    video.src = ${Z((0,oi.pathToFileURL)(e).href)};

    // Autoplay with sound is only allowed after a gesture, and this window
    // never gets one. Muted playback is always allowed, so it is the fallback
    // rather than a reason to show nothing.
    video.play().catch(function () {
        video.muted = true;
        video.play().catch(leave);
    });
</script>
</body>
</html>`}function Ra(e,t){return`<!doctype html>
<html>
<head>
${li(`.card {
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
    document.getElementById("title").textContent = ${Z(e)};
    document.getElementById("note").textContent = ${Z(t)};

    requestAnimationFrame(function () { card.classList.add("up"); });

    setTimeout(function () {
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Bt});
    }, ${ai});
</script>
</body>
</html>`}function ci(e,t){if(!Mn)return!1;Pe(),Be();let n=Math.max(200,Math.round(t.width)),r=Math.round(n*9/16),i=si(mt("clip.html",Ca(e,t)),n,r,t.corner);Te=i,i.on("closed",()=>{Te===i&&(Te=null,ke&&(clearTimeout(ke),ke=null))});let o=(t.seconds>0?t.seconds:300)+10;return ke=setTimeout(()=>Pe(),o*1e3),!0}function ui(e,t,n){if(!Mn||Ia())return!1;Be();let r=si(mt("toast.html",Ra(e,t)),Ta,Pa,n);return ht=r,r.on("closed",()=>{ht===r&&(ht=null,Ee&&(clearTimeout(Ee),Ee=null))}),Ee=setTimeout(()=>Be(),ai+4e3),!0}de.app.on("will-quit",()=>{Pe(),Be()});c();var q=require("electron"),di=require("url");var _n="VencordClipperOverlayAction",pi="VencordClipperOverlayReply",Ma=108,R=null;function Dn(){return!!R&&!R.isDestroyed()}function vt(){let e=R;R=null,e&&!e.isDestroyed()&&e.destroy()}var je=[],gt=[];function _a(e){let t=je.shift();if(t){t(e);return}gt.push(e),gt.length>4&&gt.shift()}function hi(e){let t=gt.shift();return t?Promise.resolve(t):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{je=je.filter(a=>a!==i),i(null)},e);je.push(i)})}function fi(){gt=[];let e=je;je=[];for(let t of e)t(null)}function mi(e){!R||R.isDestroyed()||R.webContents.send(pi,e)}q.ipcMain.removeAllListeners(_n);q.ipcMain.on(_n,(e,t,n)=>{if(!R||R.isDestroyed()||e.sender!==R.webContents)return;let r=String(t??"");if(r==="close"){vt();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open")return;let i=n??{},o=Number(i.from),a=Number(i.to);_a({kind:r,clip:String(i.clip??""),from:Number.isFinite(o)?Math.max(0,o):0,to:Number.isFinite(a)?Math.max(0,a):0})});function Da(e,t){let{workArea:n}=q.screen.getDisplayNearestPoint(q.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-e)/2),y:Math.round(n.y+(n.height-t)/2)}}var Oa=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${Z(_n)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${Z(pi)}, (_event, reply) => handler(reply));
    }
});
`;function La(e,t){return`<!doctype html>
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
    var clip = ${Z({name:e.name,url:(0,di.pathToFileURL)(e.path).href,markers:e.markers})};
    var look = ${Z(t)};
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
</html>`}function gi(e,t){if(!Ht())return!1;vt(),Pe(),Be();let n=Math.max(360,Math.round(t.width)),r=Math.round(n*9/16)+Ma,{x:i,y:o}=Da(n,r),a=mt("studio-preload.js",Oa),s=mt("studio.html",La(e,t)),l=new q.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return R=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{R===l&&(R=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}q.app.on("will-quit",()=>vt());c();function yt(e){return`${e.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}c();var Ti=require("child_process"),Pi=require("electron"),Nn=require("fs"),kt=require("path");c();var Va=`
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
`,vi=`# Vencord Clipper - SteamVR bridge. Generated; edits are overwritten.
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
${Va}
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
`;c();var wi=require("electron"),F=require("fs"),V=require("path"),Kt="vencord.clipper",pe="/actions/clipper",wt=["save","mark","toggle","pov"],Fa=["save","mark"],Na={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function On(){let e=(0,V.join)(wi.app.getPath("userData"),"clipper-vr");return(0,F.mkdirSync)(e,{recursive:!0}),e}function Ua(){let e=(0,V.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,F.readFileSync)(e,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,F.existsSync)((0,V.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let t=(0,V.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,F.existsSync)((0,V.join)(t,"bin","win64","openvr_api.dll"))?t:null}function bi(){let e=Ua();return e&&(0,V.join)(e,"bin","win64","openvr_api.dll")}var $a=.4,Ga={save:"double",mark:"long"};function za(e,t,n){return{path:e,mode:"button",inputs:{[t]:{output:`${pe}/in/${n}`}},parameters:t==="long"?{long_press_delay:$a}:{}}}function yi(e,t){return{app_key:Kt,controller_type:e,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[pe]:{sources:Fa.map(n=>za(t[n],Ga[n],n))}}}}function Si(){let e=On(),t={language_tag:"en_US",[pe]:"Clipper"};for(let o of wt)t[`${pe}/in/${o}`]=Na[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:pe,usage:"leftright"}],actions:wt.map(o=>({name:`${pe}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[t]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,F.writeFileSync)((0,V.join)(e,"bindings_knuckles.json"),JSON.stringify(yi("knuckles",r),null,4),"utf8"),(0,F.writeFileSync)((0,V.join)(e,"bindings_oculus_touch.json"),JSON.stringify(yi("oculus_touch",r),null,4),"utf8");let i=(0,V.join)(e,"actions.json");return(0,F.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function xi(e){let t={source:"builtin",applications:[{app_key:Kt,launch_type:"binary",binary_path_windows:e,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,V.join)(On(),"clipper.vrmanifest");return(0,F.writeFileSync)(n,JSON.stringify(t,null,4),"utf8"),n}function Ln(){return(0,V.join)(On(),"bridge.ps1")}var Wa=15e3,Ba=45e3,ki=3,ja=3,Ha=2e3,_=null,xt=!1,re="",M="",Ie="",Ae=!1,Fn=0,Ii=0,He=null,bt=[],St=null,he=[],Zt=Promise.resolve();function Ei(e){let t=he.shift();if(t){t(e);return}if(e.kind==="motion"){St=e;return}bt.push(e.action),bt.length>8&&bt.shift()}function Ka(e){let t=e.trim();if(!t.startsWith("{"))return!1;let n;try{n=JSON.parse(t)}catch{return!1}if(n.t==="ready")return re=String(n.runtime??""),M="",Ie="",Ae=!1,!0;if(n.t==="waiting")return re="",M="",Ie=String(n.reason??""),!0;if(n.t==="warning")return M=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return M=String(n.message??"The SteamVR bridge failed for a reason it did not give"),Ae=!re||++Ii>=ja,!0;if(n.t==="action"){let r=wt.find(i=>i===n.name);return r&&Ei({kind:"action",action:r}),!1}return n.t==="motion"&&Ei({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function Vn(){He||!xt||Ae||(He=setTimeout(()=>{He=null,xt&&Ai()},Wa))}function Ai(){if(_)return Promise.resolve();let e=bi();if(!e)return Vn(),Promise.resolve();let t;try{let n=Ln();(0,Nn.writeFileSync)(n,vi,"utf8");let r=(0,kt.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");t=(0,Ti.spawn)(r,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",e,"-Actions",Si(),"-Manifest",xi(r),"-AppKey",Kt,"-ActionList",[pe,...wt].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return M=`The SteamVR bridge could not be started (${n.message}).`,Vn(),Promise.resolve()}return _=t,re="",Ie="",Ae=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{M="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},Ba),a="";t.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let h of l)Ka(h)&&i()}),t.stderr?.on("data",s=>{M||(M=s.toString("utf8").trim().slice(0,300))}),t.on("error",s=>{M=`The SteamVR bridge could not be started (${s.message}).`,i()}),t.on("exit",()=>{_===t&&(!re&&!Ie&&!Ae?++Fn>=ki&&(Ae=!0,M||(M=`The SteamVR bridge stopped ${ki} times without saying why. Switch the VR controls off and on again to try it once more.`)):Fn=0,_=null,re="",Ie="");let s=he;he=[];for(let l of s)l(null);i(),Vn()})})}function Ci(){He&&(clearTimeout(He),He=null);let e=_;_=null,re="",Ie="",Ae=!1,Fn=0,Ii=0,bt=[],St=null;let t=he;he=[];for(let r of t)r(null);if(!e)return;try{e.stdin?.end()}catch{}let n=setTimeout(()=>{try{e.kill()}catch{}},Ha);e.on("exit",()=>clearTimeout(n))}function Ri(e){let t=Zt.then(async()=>(xt=e,e?(await Ai(),qt()):(Ci(),M="",qt())));return Zt=t.catch(()=>{}),t}function Un(){let e=Zt.then(()=>{xt=!1,Ci()});return Zt=e.catch(()=>{}),e}function qt(){return{running:_!==null&&re!=="",wanted:xt,runtime:re,problem:M,waiting:Ie}}function Mi(){if(!_?.stdin?.writable)return!1;try{return _.stdin.write(`bindings
`),!0}catch{return!1}}var Za=0;function _i(e,t,n,r){if(!_?.stdin?.writable||t<=0||n<=0||e.length!==t*n*4)return!1;let i=(0,kt.join)((0,kt.dirname)(Ln()),`panel-${Za++%8}.rgba`);try{return(0,Nn.writeFileSync)(i,e),_.stdin.write(`panel ${t} ${n} ${Math.round(r)} ${i}
`),!0}catch{return!1}}function Di(){if(!_?.stdin?.writable)return!1;try{return _.stdin.write(`panelhide
`),!0}catch{return!1}}function Oi(e=3e4){let t=bt.shift();if(t)return Promise.resolve({kind:"action",action:t});if(St){let n=St;return St=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{he=he.filter(a=>a!==i),i(null)},e);he.push(i)})}Pi.app.on("will-quit",()=>{Un()});var Fi=!0,Bn=!1,qa=500*1024*1024,Ni=/vesktop|equibop/i.test(v.app.getName());function x(e){let t=e?.trim();return t&&(0,f.isAbsolute)(t)?t:(0,f.join)(v.app.getPath("videos"),"DiscordClips")}var Ya=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;function Y(e){let n=(0,f.basename)(String(e??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${Ya.test(r[1])?`_${r[1]}`:r[1]}.${r[2].toLowerCase()}`:null}function Ui(e){return Y(e)??`clip-${Date.now()}.webm`}function jn(e,t){let n=(0,f.extname)(t),r=t.slice(0,t.length-n.length),i=(0,f.join)(e,t),o=2;for(;(0,d.existsSync)(i)&&o<1e3;)i=(0,f.join)(e,`${r} (${o++})${n}`);if((0,d.existsSync)(i))throw new Error(`No free name left for ${t}; rename or clear the folder`);return i}var Ke=new Map;function Ja(e,t){let n=`${e}.tmp-${process.pid}-${Date.now()}`;(0,d.writeFileSync)(n,Buffer.from(t));try{(0,d.renameSync)(n,e)}catch(r){try{(0,d.unlinkSync)(n)}catch{}throw r}}function Xa(e,t,n,r,i=!1){let o=x(t);(0,d.mkdirSync)(o,{recursive:!0});let a=Ui(n),s=(0,f.join)(o,a),l=(Ke.get(s)??Promise.resolve()).catch(()=>{}).then(async()=>{let h=i?jn(o,a):(0,f.join)(o,a);return Ja(h,r),h});return l.then(()=>{Ke.get(s)===l&&Ke.delete(s)},()=>{Ke.get(s)===l&&Ke.delete(s)}),Ke.set(s,l),l}var Et=new Set;function Qa(e,t,n){let r=x(t);(0,d.mkdirSync)(r,{recursive:!0});let i=jn(r,Ui(n));if(!Et.has(i))return Et.add(i),i;let o=(0,f.extname)(i),a=i.slice(0,i.length-o.length),s=1,l=`${a}-${s}${o}`;for(;Et.has(l)||(0,d.existsSync)(l);)l=`${a}-${++s}${o}`;return Et.add(l),l}function es(e,t){Et.delete(t)}var Jt="voices";function ts(e,t){let n=Y(e);return!n||!/^\d{1,25}$/.test(String(t??""))?null:`${n.slice(0,n.length-(0,f.extname)(n).length)}.${t}.webm`}function ns(e,t){let n=Y(t);if(!n)return[];let r=(0,f.join)(x(e),Jt);if(!(0,d.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,f.extname)(n).length)}.`,o=[];for(let a of(0,d.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function rs(e,t,n,r,i){let o=ts(n,r);if(!o)return null;let a=(0,f.join)(x(t),Jt);(0,d.mkdirSync)(a,{recursive:!0});let s=(0,f.join)(a,o);return(0,d.writeFileSync)(s,Buffer.from(i)),s}function is(e,t,n){let r=(0,f.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");return new Uint8Array((0,d.readFileSync)((0,f.join)(x(t),Jt,r)))}function os(e,t){let n=(0,f.join)(x(e),Jt);for(let{file:r}of ns(e,t))try{(0,d.unlinkSync)((0,f.join)(n,r))}catch{}}function as(e,t){let n=x(t);if(!(0,d.existsSync)(n))return[];let r=[],i=new Set,o=(0,d.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,f.join)(n,a.name);try{let l=(0,d.statSync)(s),h=yt(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(h)?{thumb:h}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function ss(e,t,n){let r=Y(n);if(!r)throw new Error("That is not a clip name");let i=(0,f.join)(x(t),r),o=(0,d.openSync)(i,"r");try{let{size:a}=(0,d.fstatSync)(o);if(a>qa)throw new Error("That clip is too large to open");return new Uint8Array((0,d.readFileSync)(o))}finally{(0,d.closeSync)(o)}}async function ls(e,t,n){let r=x(t),i=Y(n);if(!i)throw new Error("That is not a clip name");let o=(0,f.join)(r,i);try{await v.shell.trashItem(o)}catch{(0,d.unlinkSync)(o)}os(t,i);let a=(0,f.join)(r,yt(i));if((0,d.existsSync)(a))try{await v.shell.trashItem(a)}catch{try{(0,d.unlinkSync)(a)}catch{}}}function cs(e,t,n,r){let i=x(t),o=Y(n);if(!o)throw new Error("That is not a clip name");let a=(0,f.join)(i,o),s=(0,f.extname)(o),l=Y(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let u=l.toLowerCase()===o.toLowerCase()?(0,f.join)(i,l):jn(i,l);(0,d.renameSync)(a,u);let p=(0,f.join)(i,yt(o));if((0,d.existsSync)(p))try{(0,d.renameSync)(p,(0,f.join)(i,yt((0,f.basename)(u))))}catch{}return(0,f.basename)(u)}var $i="clipper-library.json";function us(e,t){let n=(0,f.join)(x(t),$i);if(!(0,d.existsSync)(n))return"";try{return(0,d.readFileSync)(n,"utf8")}catch{return""}}function ds(e,t,n){let r=x(t);(0,d.mkdirSync)(r,{recursive:!0});let i=(0,f.join)(r,$i),o=`${i}.tmp`;(0,d.writeFileSync)(o,String(n??""),"utf8"),(0,d.renameSync)(o,i)}async function ps(e){let t=await v.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return t.canceled?[]:t.filePaths}var hs=512*1024*1024;function fs(e,t){if(!(0,f.isAbsolute)(t)||!/\.(mp4|webm|mkv|mov|m4v)$/i.test(t))throw new Error("Not a video file");let n=(0,d.openSync)(t,"r");try{let{size:r}=(0,d.fstatSync)(n);if(r>hs){let i=Math.round(r/1048576);throw new Error(`That video is ${i} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,d.readFileSync)(n))}finally{(0,d.closeSync)(n)}}async function ms(e){let t=await v.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return t.canceled?[]:t.filePaths}var gs=64*1024*1024;function vs(e,t){if(!(0,f.isAbsolute)(t)||!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(t))throw new Error("Not an audio file");let n=(0,d.openSync)(t,"r");try{let{size:r}=(0,d.fstatSync)(n);if(r>gs){let i=Math.round(r/1048576);throw new Error(`That sound is ${i} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,d.readFileSync)(n))}finally{(0,d.closeSync)(n)}}async function ys(e){let t=await v.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return t.canceled?[]:t.filePaths}var ws=24*1024*1024,bs=64*1024*1024;function Ss(e,t){if(!(0,f.isAbsolute)(t)||!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(t))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(t),r=n?bs:ws,i=(0,d.openSync)(t,"r");try{let{size:o}=(0,d.fstatSync)(i);if(o>r){let a=Math.round(o/1048576),s=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${a} MB; the montage caps them at ${s} MB.`)}return new Uint8Array((0,d.readFileSync)(i))}finally{(0,d.closeSync)(i)}}function xs(e,t,n){let r=Y(n);if(!r)throw new Error("That is not a clip name");v.shell.showItemInFolder((0,f.join)(x(t),r))}function ks(e,t){return x(t)}async function Es(e,t){let n=await v.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:x(t),properties:["openDirectory","createDirectory"]});return n.canceled?"":n.filePaths[0]??""}function Ts(e,t){let n=x(t);(0,d.mkdirSync)(n,{recursive:!0}),v.shell.openPath(n)}function Ps(e){return{platform:"win32",wayland:Bn,vesktop:Ni,overlay:Ht()}}var fe=new Set;async function Is(e,t=!0){if(Bn)return[];let n=await v.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:t?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(fe.size){let i=new Set(n.map(o=>o.id));for(let o of fe)i.has(o)||fe.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!t){if(!o&&fe.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if(Fi&&!o&&a){fe.add(i.id);continue}fe.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function As(e){try{return v.app.getAppMetrics().map(t=>({type:t.serviceName||t.type,mb:Math.round((t.memory?.workingSetSize??0)/1024)})).filter(t=>t.mb>0).sort((t,n)=>n.mb-t.mb)}catch{return[]}}async function Cs(e){if(Bn)return"";let t=await v.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!t.length)return"";try{let n=v.screen.getDisplayNearestPoint(v.screen.getCursorScreenPoint()),r=t.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return t[0].id}var $n="",Gn=!1;function Rs(e,t,n=!0){return!n||Ni?!1:($n=t??"",Gn=!0,v.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await v.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(h=>h.id===$n),l=(a&&!fe.has(a.id)?a:void 0)??o.find(h=>h.id.startsWith("screen:"))??o.find(h=>!fe.has(h.id));if(!l){i({});return}i(Fi&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function Ms(e){$n="",Gn&&(Gn=!1,v.session.defaultSession.setDisplayMediaRequestHandler(null))}var zn=new Map,Ze=[],Tt=[];function _s(e){let t=Ze.shift();if(t){t(e);return}Tt.push(e),Tt.length>8&&Tt.shift()}function Ds(e,t){Hn();let n=[];for(let[r,i]of Object.entries(t)){if(!i)continue;let o=!1;try{o=v.globalShortcut.register(i,()=>_s(r))}catch{o=!1}o?zn.set(r,i):n.push(i)}return n}function Hn(e){for(let n of zn.values())try{v.globalShortcut.unregister(n)}catch{}zn.clear(),Tt=[];let t=Ze;Ze=[];for(let n of t)n(null)}function Os(e,t=3e4){let n=Tt.shift();return n?Promise.resolve(n):new Promise(r=>{let i=!1,o=s=>{i||(i=!0,clearTimeout(a),r(s))},a=setTimeout(()=>{Ze=Ze.filter(s=>s!==o),o(null)},t);Ze.push(o)})}v.app.on("will-quit",()=>Hn());function Ls(e,t){return ni(t)}function Vs(e){return Rn()}function Fs(e){return zt()}function Ns(e,t=3e4){return ii(t)}function Us(e,t){return Ri(t)}function $s(e){return Un()}function Gs(e){return qt()}function zs(e){return Mi()}function Ws(e,t,n,r,i){return _i(new Uint8Array(t),n,r,i)}function Bs(e){return Di()}function js(e,t=3e4){return Oi(t)}v.app.on("will-quit",()=>{Rn()});var Hs=["top-left","top-right","bottom-left","bottom-right"];function qe(e,t,n,r){let i=Number(e);return Number.isFinite(i)?Math.min(n,Math.max(t,Math.round(i))):r}function Gi(e){return Hs.includes(e)?e:"bottom-right"}function Ks(e){return{corner:Gi(e?.corner),width:qe(e?.width,200,1280,420),volume:qe(e?.volume,0,100,0),seconds:qe(e?.seconds,0,300,10)}}function Wn(e,t){return String(e??"").replace(/\s+/g," ").trim().slice(0,t)}function Zs(e,t,n,r){let i=Y(n);if(!i)return!1;let o=(0,f.join)(x(t),i);return(0,d.existsSync)(o)?ci(o,Ks(r)):!1}function qs(e,t,n,r){return v.BrowserWindow.getFocusedWindow()||Dn()?!1:ui(Wn(t,60),Wn(n,90),Gi(r))}function Ys(e){Pe()}var Js=200;function Xs(e){return Array.isArray(e)?e.map(Number).filter(t=>Number.isFinite(t)&&t>=0).slice(0,Js):[]}function Qs(e){return{width:qe(e?.width,360,1600,720),volume:qe(e?.volume,0,100,0)}}function el(e,t,n,r,i){let o=Y(n);if(!o)return!1;let a=(0,f.join)(x(t),o);return(0,d.existsSync)(a)?gi({name:o,path:a,markers:Xs(r)},Qs(i)):!1}function tl(e){vt()}function nl(e){return Dn()}function rl(e,t=3e4){return hi(qe(t,1e3,12e4,3e4))}function il(e){fi()}function ol(e,t,n,r){mi({ok:!!t,message:Wn(n,120),close:!!r})}function al(e){let t=v.BrowserWindow.fromWebContents(e.sender);!t||t.isDestroyed()||(t.isMinimized()&&t.restore(),t.show(),t.focus())}var Pt="kebab1337420/vencord-clipper",sl=`VencordClipper (+https://github.com/${Pt})`,Yt=256*1024*1024;function Xt(e,t=0){return new Promise((n,r)=>{let i=(0,Vi.get)(e,{headers:{"User-Agent":sl,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),t>=5?r(new Error(`Too many redirects for ${e}`)):n(Xt(new URL(s,e).toString(),t+1));return}let l=[],h=0,{"content-length":u}=o.headers;if(u&&Number(u)>Yt){o.destroy(new Error(`${e} answered ${u} bytes, over the ${Yt} byte cap`));return}o.on("data",p=>{if(h+=p.length,h>Yt){o.destroy(new Error(`${e} exceeded the ${Yt} byte cap`));return}l.push(p)}),o.on("end",()=>n({status:a,body:Buffer.concat(l)})),o.on("error",r)});i.setTimeout(6e4,()=>i.destroy(new Error(`${e} timed out`))),i.on("error",r)})}async function ll(e){let{status:t,body:n}=await Xt(e);if(t!==200)throw new Error(`${e} answered ${t}`);return n}function zi(){return __dirname}function Wi(e){return(0,d.existsSync)((0,f.join)(e,"patcher.js"))&&(0,d.existsSync)((0,f.join)(e,"renderer.js"))}function Bi(e){try{return(0,d.accessSync)(e,d.constants.W_OK),!0}catch{return!1}}function cl(e,t){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(e),i=n(t);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function ul(e,t){let n=await ll(`https://api.github.com/repos/${Pt}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=zi();return{version:o,tag:i,available:!!o&&cl(o,t),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${Pt}/releases`),directory:a,writable:Wi(a)&&Bi(a)}}async function dl(e){let{status:t,body:n}=await Xt(`https://raw.githubusercontent.com/${Pt}/${e}/prebuilt/build-info.json`);if(t===404)return null;if(t!==200)throw new Error(`The release's file list answered ${t}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return r}async function pl(e,t){if(!/^[\w.-]{1,40}$/.test(t))throw new Error(`Refusing to fetch a release named ${t}`);let n=zi();if(!Wi(n))throw new Error(`No installed bundle at ${n}`);if(!Bi(n))throw new Error(`${n} is read-only`);let r=await dl(t);if(!r)throw new Error(`The release under ${t} carries no file list; refusing to install it unchecked`);let i=Object.keys(r),o=(0,f.join)(n,".clipper-update");(0,d.rmSync)(o,{recursive:!0,force:!0}),(0,d.mkdirSync)(o,{recursive:!0});try{let a=[];for(let u of i){if(u!==(0,f.basename)(u)||u.startsWith("."))throw new Error(`Refusing a release file named ${u}`);let{status:p,body:y}=await Xt(`https://raw.githubusercontent.com/${Pt}/${t}/prebuilt/dist/${u}`);if(p!==200)throw new Error(`${u} answered ${p}`);if(y.length===0)throw new Error(`${u} came back empty`);let E=r[u];if(E?.size===void 0||!E?.sha256)throw new Error(`${u} has no size and hash in the release's file list`);if(y.length!==E.size)throw new Error(`${u} is ${y.length} bytes, the release says ${E.size}`);if((0,Li.createHash)("sha256").update(y).digest("hex").toLowerCase()!==E.sha256.toLowerCase())throw new Error(`${u} does not match its hash`);(0,d.writeFileSync)((0,f.join)(o,u),y),a.push(u)}if(a.length===0)throw new Error(`There is no bundle published under ${t}`);for(let u of["renderer.js","patcher.js"])if(!a.includes(u))throw new Error(`The release carries no ${u}`);if(!(0,d.readFileSync)((0,f.join)(o,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let s=(0,f.join)(o,".previous");(0,d.mkdirSync)(s,{recursive:!0});let l=[],h=[];try{for(let u of a){let p=(0,f.join)(n,u);(0,d.existsSync)(p)&&((0,d.renameSync)(p,(0,f.join)(s,u)),l.push(u)),(0,d.renameSync)((0,f.join)(o,u),p),h.push(u)}}catch(u){for(let p of h)try{(0,d.unlinkSync)((0,f.join)(n,p))}catch{}for(let p of l)try{(0,d.renameSync)((0,f.join)(s,p),(0,f.join)(n,p))}catch{}throw new Error(`The update could not be put in place (${u.message}). The bundle that was there has been put back.`)}return a}finally{(0,d.rmSync)(o,{recursive:!0,force:!0})}}function hl(e){v.app.relaunch(),v.app.quit(),setTimeout(()=>v.app.exit(0),3e3)}var ji={AppleMusicRichPresence:vn,ConsoleShortcuts:yn,FixSpotifyEmbeds:$r,FixYoutubeEmbeds:zr,OpenInApp:En,Translate:Tn,VoiceMessages:Pn,XSOverlay:In,YoutubeAdblock:Zr,Clipper:Kn};var Hi={};for(let[e,t]of Object.entries(ji)){let n=Object.entries(t);if(!n.length)continue;let r=Hi[e]={};for(let[i,o]of n){let a=`VencordPluginNative_${e}_${i}`;Zn.ipcMain.handle(a,o),r[i]=a}}Zn.ipcMain.on("VencordGetPluginIpcMethodMap",e=>{e.returnValue=Hi});ne();c();function qn(e,t=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{e(...r)},t)}}Le();var b=require("electron");c();var Ki="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var ie=require("fs"),ge=require("fs/promises"),ro=require("os"),Qt=require("path");c();ne();Le();var Ye=require("electron");c();ne();var Yn=require("electron"),B=["connect-src"],N=[...B,"img-src"],Yi=["style-src","font-src"],Zi=[...N,"media-src"],k=[...N,...Yi],qi=[...k,"script-src","worker-src"],Xn={"http://localhost:*":k,"http://127.0.0.1:*":k,"localhost:*":k,"127.0.0.1:*":k,"*.github.io":k,"github.com":k,"raw.githubusercontent.com":k,"*.gitlab.io":k,"gitlab.com":k,"*.codeberg.page":k,"codeberg.org":k,"*.githack.com":k,"jsdelivr.net":k,"fonts.googleapis.com":Yi,"i.imgur.com":N,"i.ibb.co":N,"i.pinimg.com":N,"files.catbox.moe":k,"cdn.discordapp.com":k,"media.discordapp.net":N,"cdnjs.cloudflare.com":qi,"cdn.jsdelivr.net":qi,"api.github.com":B,"ws.audioscrobbler.com":B,"musicbrainz.org":B,"*.listenbrainz.org":B,"coverartarchive.org":B,"archive.org":B,"*.archive.org":B,"translate-pa.googleapis.com":B,"*.vencord.dev":N,"manti.vendicated.dev":N,"decor.fieryflames.dev":B,"ugc.decor.fieryflames.dev":N,"sponsor.ajay.app":B,"dearrow-thumb.ajay.app":N,"usrbg.is-hardly.online":N,"icons.duckduckgo.com":N,"*.tenor.com":Zi,"*.tenor.co":Zi},Jn=(e,t)=>Object.keys(e).find(n=>n.toLowerCase()===t),fl=e=>{let t={};return e.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(t,r)&&(t[r]=i)}),t},ml=e=>Object.entries(e).filter(([,t])=>t?.length).map(t=>t.flat().join(" ")).join("; "),gl=e=>{let t=Jn(e,"content-security-policy-report-only");t&&delete e[t];let n=Jn(e,"content-security-policy");if(n){let r=fl(e[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(K.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(Xn))for(let s of a)i(s,o);e[n]=[ml(r)]}};function Ji(){Yn.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:e,resourceType:t},n)=>{if(e&&(t==="mainFrame"&&gl(e),t==="stylesheet")){let r=Jn(e,"content-type");r&&(e[r]=["text/css"])}n({cancel:!1,responseHeaders:e})}),Yn.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function Xi(){Ye.ipcMain.handle("VencordCspRemoveOverride",bl),Ye.ipcMain.handle("VencordCspRequestAddOverride",wl),Ye.ipcMain.handle("VencordCspIsDomainAllowed",Sl)}function vl(e,t){try{let{host:n}=new URL(e);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(t.length===0||t.some(n=>!k.includes(n)))}function yl(e,t,n){let r=new URL(e).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Discord for the changes to take effect.`;if(t.length===1&&t[0]==="connect-src")return{message:i,detail:o};let a=t.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function wl(e,t,n,r){if(!vl(t,n))return"invalid";let i=new URL(t).host;if(i in K.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await Ye.dialog.showMessageBox({...yl(t,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(K.store.customCspRules[i]=n,"ok"):"unchecked"}function bl(e,t){return t in K.store.customCspRules?(delete K.store.customCspRules[t],!0):!1}function Sl(e,t,n){try{let r=new URL(t).host,i=Xn[r]??K.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}c();var xl=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,kl=/^\\@/;function Qn(e,t={}){return{fileName:e,name:t.name??e.replace(/\.css$/i,""),author:t.author??"Unknown Author",description:t.description??"A Discord Theme.",version:t.version,license:t.license,source:t.source,website:t.website,invite:t.invite}}function Qi(e){return e.charCodeAt(0)===65279&&(e=e.slice(1)),e}function eo(e,t){if(!e)return Qn(t);let n=e.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return Qn(t);let r={},i="",o="";for(let a of n.split(xl))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace(kl,"@");return r[i]=o.trim(),delete r[""],Qn(t,r)}Ne();c();var Je=require("path");function me(e,t){let n=(0,Je.normalize)(e+"/"),r=(0,Je.join)(e,t),i=(0,Je.normalize)(r);return i===(0,Je.normalize)(e)||i.startsWith(n)?i:null}c();var to=require("electron");function no(e){e.webContents.setWindowOpenHandler(({url:t})=>{switch(t){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(t)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":to.shell.openExternal(t)}return{action:"deny"}})}var El=(0,Qt.join)(__dirname,"renderer.css");(0,ie.mkdirSync)(ce,{recursive:!0});Xi();function io(){return(0,ge.readFile)(Fe,"utf-8").catch(()=>"")}async function Tl(){let e=await(0,ge.readdir)(ce).catch(()=>[]),t=[];for(let n of e){if(!n.endsWith(".css"))continue;let r=await oo(n).then(Qi).catch(()=>null);r!=null&&t.push(eo(r,n))}return t}function oo(e){e=e.replace(/\?v=\d+$/,"");let t=me(ce,e);return t?(0,ge.readFile)(t,"utf-8"):Promise.reject(`Unsafe path ${e}`)}b.ipcMain.handle("VencordOpenQuickCss",()=>b.shell.openPath(Fe));b.ipcMain.handle("VencordOpenExternal",(e,t)=>{try{var{protocol:n}=new URL(t)}catch{throw"Malformed URL"}if(!Vr.includes(n))throw"Disallowed protocol.";b.shell.openExternal(t).catch(r=>console.error("[Vencord] Failed to open external link",t,r))});b.ipcMain.handle("VencordGetQuickCss",()=>io());b.ipcMain.handle("VencordSetQuickCss",(e,t)=>(0,ie.writeFileSync)(Fe,t));b.ipcMain.handle("VencordGetThemesList",()=>Tl());b.ipcMain.handle("VencordGetThemeData",(e,t)=>oo(t));b.ipcMain.handle("VencordGetThemeSystemValues",()=>{let e=b.systemPreferences.getAccentColor?.()??"";return e.length&&e[0]!=="#"&&(e=`#${e}`),{"os-accent-color":e}});b.ipcMain.handle("VencordOpenThemesFolder",()=>b.shell.openPath(ce));b.ipcMain.handle("VencordOpenSettingsFolder",()=>b.shell.openPath(Se));var er=[];b.ipcMain.handle("VencordInitFileWatchers",({sender:e})=>{er.forEach(i=>i.close());let t,n;(0,ge.open)(Fe,"a+").then(i=>{i.close(),t=(0,ie.watch)(Fe,{persistent:!1},qn(async()=>{e.postMessage("VencordQuickCssUpdate",await io())},50))}).catch(()=>{});let r=(0,ie.watch)(ce,{persistent:!1},qn(()=>{e.postMessage("VencordThemeUpdate",void 0)}));er=[t,r,n].filter(Boolean),e.once("destroyed",()=>{t?.close(),r.close(),n?.close(),er=[]})});b.ipcMain.on("VencordGetMonacoTheme",e=>{e.returnValue=b.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});b.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let e="Vencord QuickCSS Editor",t=b.BrowserWindow.getAllWindows().find(r=>r.title===e);if(t&&!t.isDestroyed()){t.focus();return}let n=new b.BrowserWindow({title:e,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:b.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,Qt.join)(__dirname,"preload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});no(n),await n.loadURL(`data:text/html;base64,${Ki}`)});b.ipcMain.handle("VencordGetRendererCss",()=>(0,ge.readFile)(El,"utf-8"));b.ipcMain.on("VencordPreloadGetRendererJs",e=>{e.returnValue=(0,ie.readFileSync)((0,Qt.join)(__dirname,"renderer.js"),"utf-8")});b.ipcMain.on("VencordSupportsWindowsMaterial",e=>{e.returnValue=Number((0,ro.release)().split(".")[2])>=22621});var Re=require("electron"),Oo=require("path"),dr=require("url");ne();Ne();c();var sn=require("electron");c();var lo=require("module"),Pl=(0,lo.createRequire)("/"),Xe,tn,nr,Il=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{Xe=Pl("worker_threads"),tn=Xe.Worker,nr=Xe.isMarkedAsUntransferable}catch{}var Al=tn?function(e,t,n,r,i){var o=!1,a=new tn(e+Il,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return nr&&(r=r.filter(function(s){return!nr(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,tn.prototype.terminate.call(a)},a}:function(e,t,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},C=Uint8Array,Ce=Uint16Array,co=Int32Array,ir=new C([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),or=new C([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),uo=new C([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),po=function(e,t){for(var n=new Ce(31),r=0;r<31;++r)n[r]=t+=1<<e[r-1];for(var i=new co(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},Xe=po(ir,2),ar=Xe.b,Cl=Xe.r;ar[28]=258,Cl[258]=28;var ho=po(or,0),fo=ho.b,ed=ho.r,on=new Ce(32768);for(w=0;w<32768;++w)oe=(w&43690)>>1|(w&21845)<<1,oe=(oe&52428)>>2|(oe&13107)<<2,oe=(oe&61680)>>4|(oe&3855)<<4,on[w]=((oe&65280)>>8|(oe&255)<<8)>>1;var oe,w,Qe=(function(e,t,n){for(var r=e.length,i=0,o=new Ce(t);i<r;++i)e[i]&&++o[e[i]-1];var a=new Ce(t);for(i=1;i<t;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new Ce(1<<t);var l=15-t;for(i=0;i<r;++i)if(e[i])for(var h=i<<4|e[i],u=t-e[i],p=a[e[i]-1]++<<u,y=p|(1<<u)-1;p<=y;++p)s[on[p]>>l]=h}else for(s=new Ce(r),i=0;i<r;++i)e[i]&&(s[i]=on[a[e[i]-1]++]>>15-e[i]);return s}),It=new C(288);for(w=0;w<144;++w)It[w]=8;var w;for(w=144;w<256;++w)It[w]=9;var w;for(w=256;w<280;++w)It[w]=7;var w;for(w=280;w<288;++w)It[w]=8;var w,mo=new C(32);for(w=0;w<32;++w)mo[w]=5;var w;var go=Qe(It,9,1);var vo=Qe(mo,5,1),nn=function(e){for(var t=e[0],n=1;n<e.length;++n)e[n]>t&&(t=e[n]);return t},U=function(e,t,n){var r=t/8|0;return(e[r]|e[r+1]<<8)>>(t&7)&n},rn=function(e,t){var n=t/8|0;return(e[n]|e[n+1]<<8|e[n+2]<<16)>>(t&7)},yo=function(e){return(e+7)/8|0},an=function(e,t,n){return(t==null||t<0)&&(t=0),(n==null||n>e.length)&&(n=e.length),new C(e.subarray(t,n))};var wo=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],P=function(e,t,n){var r=new Error(t||wo[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,P),!n)throw r;return r},bo=function(e,t,n,r){var i=e.length,o=r?r.length:0;if(!i||t.f&&!t.l)return n||new C(0);var a=!n,s=a||t.i!=2,l=t.i;a&&(n=new C(i*3));var h=function(vr){var yr=n.length;if(vr>yr){var wr=new C(Math.max(yr*2,vr));wr.set(n),n=wr}},u=t.f||0,p=t.p||0,y=t.b||0,E=t.l,ye=t.d,ee=t.m,D=t.n,O=i*8;do{if(!E){u=U(e,p,1);var ae=U(e,p+1,3);if(p+=3,ae)if(ae==1)E=go,ye=vo,ee=9,D=5;else if(ae==2){var et=U(e,p,31)+257,At=U(e,p+10,15)+4,we=et+U(e,p+5,31)+1;p+=14;for(var L=new C(we),_e=new C(19),T=0;T<At;++T)_e[uo[T]]=U(e,p+T*3,7);p+=At*3;for(var tt=nn(_e),Lo=(1<<tt)-1,Vo=Qe(_e,tt,1),T=0;T<we;){var pr=Vo[U(e,p,Lo)];p+=pr&15;var I=pr>>4;if(I<16)L[T++]=I;else{var De=0,Ct=0;for(I==16?(Ct=3+U(e,p,3),p+=2,De=L[T-1]):I==17?(Ct=3+U(e,p,7),p+=3):I==18&&(Ct=11+U(e,p,127),p+=7);Ct--;)L[T++]=De}}var hr=L.subarray(0,et),se=L.subarray(et);ee=nn(hr),D=nn(se),E=Qe(hr,ee,1),ye=Qe(se,D,1)}else P(1);else{var I=yo(p)+4,te=e[I-4]|e[I-3]<<8,Me=I+te;if(Me>i){l&&P(0);break}s&&h(y+te),n.set(e.subarray(I,Me),y),t.b=y+=te,t.p=p=Me*8,t.f=u;continue}if(p>O){l&&P(0);break}}s&&h(y+131072);for(var Fo=(1<<ee)-1,No=(1<<D)-1,ln=p;;ln=p){var De=E[rn(e,p)&Fo],Oe=De>>4;if(p+=De&15,p>O){l&&P(0);break}if(De||P(2),Oe<256)n[y++]=Oe;else if(Oe==256){ln=p,E=null;break}else{var fr=Oe-254;if(Oe>264){var T=Oe-257,nt=ir[T];fr=U(e,p,(1<<nt)-1)+ar[T],p+=nt}var cn=ye[rn(e,p)&No],un=cn>>4;cn||P(3),p+=cn&15;var se=fo[un];if(un>3){var nt=or[un];se+=rn(e,p)&(1<<nt)-1,p+=nt}if(p>O){l&&P(0);break}s&&h(y+131072);var mr=y+fr;if(y<se){var gr=o-se,Uo=Math.min(se,mr);for(gr+y<0&&P(3);y<Uo;++y)n[y]=r[gr+y]}for(;y<mr;++y)n[y]=n[y-se]}}t.l=E,t.p=ln,t.b=y,t.f=u,E&&(u=1,t.m=ee,t.d=ye,t.n=D)}while(!u);return y!=n.length&&a?an(n,0,y):n.subarray(0,y)};var Rl=new C(0);var Ml=function(e,t){var n={};for(var r in e)n[r]=e[r];for(var r in t)n[r]=t[r];return n},ao=function(e,t,n){for(var r=e(),i=e.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){t+=";"+l+"=";var h=s.toString();if(s.prototype)if(h.indexOf("[native code]")!=-1){var u=h.indexOf(" ",8)+1;t+=h.slice(u,h.indexOf("(",u))}else{t+=h;for(var p in s.prototype)t+=";"+l+".prototype."+p+"="+s.prototype[p].toString()}else t+=h}else n[l]=s}return t},en=[],_l=function(e){var t=[];for(var n in e)e[n].buffer&&t.push((e[n]=new e[n].constructor(e[n])).buffer);return t},Dl=function(e,t,n,r){if(!en[n]){for(var i="",o={},a=e.length-1,s=0;s<a;++s)i=ao(e[s],i,o);en[n]={c:ao(e[a],i,o),e:o}}var l=Ml({},en[n].e);return Al(en[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+t.toString()+"}",n,l,_l(l),r)},Ol=function(){return[C,Ce,co,ir,or,uo,ar,fo,go,vo,on,wo,Qe,nn,U,rn,yo,an,P,bo,sr,So,xo]};var So=function(e){return postMessage(e,[e.buffer])},xo=function(e){return e&&{out:e.size&&new C(e.size),dictionary:e.dictionary}},Ll=function(e,t,n,r,i,o){var a=Dl(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([e,t],t.consume?[e.buffer]:[]),function(){a.terminate()}};var J=function(e,t){return e[t]|e[t+1]<<8},$=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},tr=function(e,t){return $(e,t)+$(e,t+4)*4294967296};function Vl(e,t,n){return n||(n=t,t={}),typeof n!="function"&&P(7),Ll(e,t,[Ol],function(r){return So(sr(r.data[0],xo(r.data[1])))},1,n)}function sr(e,t){return bo(e,{i:2},t&&t.out,t&&t.dictionary)}var rr=typeof TextDecoder<"u"&&new TextDecoder,Fl=0;try{rr.decode(Rl,{stream:!0}),Fl=1}catch{}var Nl=function(e){for(var t="",n=0;;){var r=e[n++],i=(r>127)+(r>223)+(r>239);if(n+i>e.length)return{s:t,r:an(e,n-1)};i?i==3?(r=((r&15)<<18|(e[n++]&63)<<12|(e[n++]&63)<<6|e[n++]&63)-65536,t+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?t+=String.fromCharCode((r&31)<<6|e[n++]&63):t+=String.fromCharCode((r&15)<<12|(e[n++]&63)<<6|e[n++]&63):t+=String.fromCharCode(r)}};function Ul(e,t){if(t){for(var n="",r=0;r<e.length;r+=16384)n+=String.fromCharCode.apply(null,e.subarray(r,r+16384));return n}else{if(rr)return rr.decode(e);var i=Nl(e),o=i.s,n=i.r;return n.length&&P(8),o}}var $l=function(e,t){return t+30+J(e,t+26)+J(e,t+28)},Gl=function(e,t,n){var r=J(e,t+28),i=J(e,t+30),o=Ul(e.subarray(t+46,t+46+r),!(J(e,t+8)&2048)),a=t+46+r,s=zl(e,a,i,n,$(e,t+20),$(e,t+24),$(e,t+42)),l=s[0],h=s[1],u=s[2];return[J(e,t+10),l,h,o,a+i+J(e,t+32),u]},zl=function(e,t,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,h=a==4294967295,u=t+n,p=s+l+h;if(r&&p){for(;t+4<u;t+=4+J(e,t+2))if(J(e,t)==1)return[s?tr(e,t+4+8*l):i,l?tr(e,t+4):o,h?tr(e,t+4+8*(l+s)):a,1];r<2&&P(13)}return[i,o,a,0]};var so=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(e){e()};function ko(e,t,n){n||(n=t,t={}),typeof n!="function"&&P(7);var r=[],i=function(){for(var D=0;D<r.length;++D)r[D]()},o={},a=function(D,O){so(function(){n(D,O)})};so(function(){a=n});for(var s=e.length-22;$(e,s)!=101010256;--s)if(!s||e.length-s>65558)return a(P(13,0,1),null),i;var l=J(e,s+8);if(l){var h=l,u=$(e,s+16),p=$(e,s-20)==117853008;if(p){var y=$(e,s-12);p=$(e,y)==101075792,p&&(h=l=$(e,y+32),u=$(e,y+48))}for(var E=t&&t.filter,ye=function(D){var O=Gl(e,u,p),ae=O[0],I=O[1],te=O[2],Me=O[3],et=O[4],At=O[5],we=$l(e,At);u=et;var L=function(T,tt){T?(i(),a(T,null)):(tt&&(o[Me]=tt),--l||a(null,o))};if(!E||E({name:Me,size:I,originalSize:te,compression:ae}))if(!ae)L(null,an(e,we,we+I));else if(ae==8){var _e=e.subarray(we,we+I);if(te<524288||I>.8*te)try{L(null,sr(_e,{out:new C(te)}))}catch(T){L(T,null)}else r.push(Vl(_e,{size:te},L))}else L(P(14,"unknown compression type "+ae,1),null);else L(null,null)},ee=0;ee<h;++ee)ye(ee)}else a(null,{});return i}var Po=require("fs"),X=require("fs/promises"),lr=require("path");Ne();c();function Eo(e){function t(a,s,l,h){let u=0;return u+=a<<0,u+=s<<8,u+=l<<16,u+=h<<24>>>0,u}if(e[0]===80&&e[1]===75&&e[2]===3&&e[3]===4)return e;if(e[0]!==67||e[1]!==114||e[2]!==50||e[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=e[4]===3,r=e[4]===2;if(!r&&!n||e[5]||e[6]||e[7])throw new Error("Unexpected crx format version number.");if(r){let a=t(e[8],e[9],e[10],e[11]),s=t(e[12],e[13],e[14],e[15]),l=16+a+s;return e.subarray(l,e.length)}let o=12+t(e[8],e[9],e[10],e[11]);return e.subarray(o,e.length)}c();var Wl=require("original-fs");async function Bl(e,t){try{var n=await fetch(e,t)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${t?.method??"GET"} ${e} failed: ${i}`)}if(n.ok)return n;let r=`${t?.method??"GET"} ${e}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function To(e,t){let r=await(await Bl(e,t)).arrayBuffer();return Buffer.from(r)}var jl=(0,lr.join)(_t,"ExtensionCache");async function Hl(e,t){return await(0,X.mkdir)(t,{recursive:!0}),new Promise((n,r)=>{ko(e,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let p=me(t,a);if(!p)throw new Error(`Path traversal detected: "${a}"`);return void await(0,X.mkdir)(p,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),h=me(t,l);if(!h)throw new Error(`Path traversal detected: "${a}"`);let u=me(t,a);if(!u)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,X.mkdir)(h,{recursive:!0}),await(0,X.writeFile)(u,o[a])})).then(()=>n()).catch(a=>{(0,X.rm)(t,{recursive:!0,force:!0}),r(a)})})})}async function Io(e){let t=(0,lr.join)(jl,e);try{await(0,X.access)(t,Po.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${e}%26uc&prodversion=${process.versions.chrome}`,i=await To(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await Hl(Eo(i),t).catch(o=>console.error(`Failed to extract extension ${e}`,o))}sn.session.defaultSession.extensions?sn.session.defaultSession.extensions.loadExtension(t):sn.session.defaultSession.loadExtension(t)}Dt||Re.app.whenReady().then(()=>{Re.protocol.handle("vencord",({url:e})=>{let t=decodeURI(e).slice(10).replace(/\?v=\d+$/,"");if(t.endsWith("/")&&(t=t.slice(0,-1)),t.startsWith("/themes/")){let n=t.slice(8),r=me(ce,n);return r?Re.net.fetch((0,dr.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(t){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return Re.net.fetch((0,dr.pathToFileURL)((0,Oo.join)(__dirname,t)).toString());default:return new Response(null,{status:404})}});try{A.store.enableReactDevtools&&Io("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(e=>console.error("[Vencord] Failed to install React Developer Tools",e))}catch{}Ji()});Do();
//# sourceURL=file:///VencordPatcher
//# sourceMappingURL=vencord://patcher.js.map
/*! For license information please see patcher.js.LEGAL.txt */

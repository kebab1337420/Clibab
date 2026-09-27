// Vencord 59a5428
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var da=Object.create;var $t=Object.defineProperty;var pa=Object.getOwnPropertyDescriptor;var fa=Object.getOwnPropertyNames;var ha=Object.getPrototypeOf,ma=Object.prototype.hasOwnProperty;var B=(t,e,n)=>()=>{if(n)throw n[0];try{return t&&(e=t(t=0)),e}catch(r){throw n=[r],r}};var Te=(t,e)=>{for(var n in e)$t(t,n,{get:e[n],enumerable:!0})},Vr=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of fa(e))!ma.call(t,i)&&i!==n&&$t(t,i,{get:()=>e[i],enumerable:!(r=pa(e,i))||r.enumerable});return t};var Sn=(t,e,n)=>(n=t!=null?da(ha(t)):{},Vr(e||!t||!t.__esModule?$t(n,"default",{value:t,enumerable:!0}):n,t)),xn=t=>Vr($t({},"__esModule",{value:!0}),t);var u=B(()=>{"use strict"});var Ue=B(()=>{"use strict";u()});function ct(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var Fr=B(()=>{"use strict";u()});var ba={};function Ge(...t){let e={cwd:Gr};return En?Tn("flatpak-spawn",["--host","git",...t],e):Tn("git",t,e)}async function ga(){return(await Ge("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function va(){await Ge("fetch");let t=(await Ge("branch","--show-current")).stdout.trim();if(!((await Ge("ls-remote","origin",t)).stdout.length>0))return[];let r=(await Ge("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function ya(){return(await Ge("pull")).stdout.includes("Fast-forward")}async function wa(){return!(await Tn(En?"flatpak-spawn":"node",En?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:Gr})).stderr.includes("Build failed")}var Nr,ut,$r,Ur,Gr,Tn,En,Wr=B(()=>{"use strict";u();Ue();Nr=require("child_process"),ut=require("electron"),$r=require("path"),Ur=require("util");Fr();Gr=(0,$r.join)(__dirname,".."),Tn=(0,Ur.promisify)(Nr.execFile),En=!1;ut.ipcMain.handle("VencordGetRepo",ct(ga));ut.ipcMain.handle("VencordGetUpdates",ct(va));ut.ipcMain.handle("VencordUpdate",ct(ya));ut.ipcMain.handle("VencordBuild",ct(wa))});var Cn,Zr,dt,qr=B(()=>{"use strict";u();Cn=Symbol("SettingsStore.isProxy"),Zr=Symbol("SettingsStore.getRawTarget"),dt=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===Cn)return!0;if(r===Zr)return n;let o=Reflect.get(n,r,i),a=e.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[Cn]){let p=`${l}${l&&"."}${r}`;return e.makeProxy(o,s,p)}return o},set(n,r,i){if(i?.[Cn]&&(i=i[Zr]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return e.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return e.notifyListeners(s,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyPrefixListeners(e,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,e))}}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,p)=>l[p],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n)),this.notifyPrefixListeners(e,i,n)}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}addPrefixChangeListener(e,n){let r=this.prefixListeners.get(e)??new Set;r.add(n),this.prefixListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}removePrefixChangeListener(e,n){let r=this.prefixListeners.get(e);r&&(r.delete(n),r.size||this.prefixListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}}});function Mn(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},Mn(t[n],r)):t[n]??=r}return t}var Yr=B(()=>{"use strict";u()});var Jr,de,Gt,Ee,pe,We,Rn,_n,Xr,Wt,ze=B(()=>{"use strict";u();Jr=require("electron"),de=require("path"),Gt=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,de.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,de.join)(Jr.app.getPath("userData"),"..","Vencord")),Ee=(0,de.join)(Gt,"settings"),pe=(0,de.join)(Gt,"themes"),We=(0,de.join)(Ee,"quickCss.css"),Rn=(0,de.join)(Ee,"settings.json"),_n=(0,de.join)(Ee,"native-settings.json"),Xr=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"],Wt=process.argv.includes("--vanilla")});function Qr(t,e){try{return JSON.parse((0,ke.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var Dn,ke,R,Ea,ei,J,oe=B(()=>{"use strict";u();Ue();qr();Yr();Dn=require("electron"),ke=require("fs");ze();(0,ke.mkdirSync)(Ee,{recursive:!0});R=new dt(Qr("renderer",Rn));R.addGlobalChangeListener(()=>{try{(0,ke.writeFileSync)(Rn,JSON.stringify(R.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});Dn.ipcMain.on("VencordGetSettings",t=>t.returnValue=R.plain);Dn.ipcMain.handle("VencordSetSettings",(t,e,n)=>{R.setData(e,n)});Ea={plugins:{},customCspRules:{}},ei=Qr("native",_n);Mn(ei,Ea);J=new dt(ei);J.addGlobalChangeListener(()=>{try{(0,ke.writeFileSync)(_n,JSON.stringify(J.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}})});function Qo(t,e,n){let r=e;if(e in t)return void n(t[r]);Object.defineProperty(t,e,{set(i){delete t[r],t[r]=i,n(i)},configurable:!0,enumerable:!1})}var ea=B(()=>{"use strict";u()});var Dc={};function _c(t,e){let n=t.slice(4).split(".").map(Number),r=e.slice(4).split(".").map(Number);for(let i=0;i<r.length;i++){if(n[i]>r[i])return!0;if(n[i]<r[i])return!1}return!1}function ta(){if(!process.env.DISABLE_UPDATER_AUTO_PATCHING)try{let t=(0,q.dirname)(process.execPath),e=(0,q.basename)(t),n=(0,q.join)(t,".."),r=(0,re.readdirSync)(n).reduce((p,f)=>f.startsWith("app-")&&_c(f,p)?f:p,e);if(r===e)return;let i=(0,q.join)(n,e,"resources"),o=(0,q.join)(i,"app.asar"),a=(0,q.join)(n,r,"resources"),s=(0,q.join)(a,"app.asar"),l=(0,q.join)(a,"_app.asar");if(!(0,re.existsSync)(o)||!(0,re.existsSync)(s)||(0,re.existsSync)(l))return;console.info(`[Vencord] Detected Host Update (${e} -> ${r}). Repatching...`),(0,re.renameSync)(s,l),(0,re.copyFileSync)(o,s)}catch(t){console.error("[Vencord] Failed to repatch latest host update",t)}}var na,kr,re,q,ra=B(()=>{"use strict";u();na=require("electron"),kr=Sn(require("events")),re=require("original-fs"),q=require("path");kr.default.prototype.emit=new Proxy(kr.default.prototype.emit,{apply(t,e,n){return n[0]==="host-updated"&&ta(),Reflect.apply(t,e,n)}}),na.app.on("before-quit",ta)});var Fc={};var Y,Se,Oc,Lc,Pr,Vc,ia=B(()=>{"use strict";u();ea();Y=Sn(require("electron")),Se=require("path");oe();ze();console.log("[Vencord] Starting up...");Oc=require.main.filename,Lc=require.main.path.endsWith("app.asar")?"_app.asar":"app.asar",Pr=(0,Se.join)((0,Se.dirname)(Oc),"..",Lc),Vc=require((0,Se.join)(Pr,"package.json"));require.main.filename=(0,Se.join)(Pr,Vc.main);Y.app.setAppPath(Pr);if(Wt)console.log("[Vencord] Running in vanilla mode. Not loading Vencord");else{let t=R.store;if(ra(),t.winCtrlQ){let r=Y.Menu.buildFromTemplate;Y.Menu.buildFromTemplate=function(i){if(i[0]?.label==="&File"){let{submenu:o}=i[0];Array.isArray(o)&&o.push({label:"Quit (Hidden)",visible:!1,acceleratorWorksWhenHidden:!0,accelerator:"Control+Q",click:()=>Y.app.quit()})}return r.call(this,i)}}class e extends Y.default.BrowserWindow{constructor(i){if(!i?.webPreferences?.preload||!i.title){super(i);return}let{frameless:o,winNativeTitleBar:a,disableMinSize:s,transparent:l,macosVibrancyStyle:p,windowsMaterial:f}=t,h=i.webPreferences.preload;i.webPreferences.preload=(0,Se.join)(__dirname,"preload.js"),i.webPreferences.sandbox=!1,o?i.frame=!1:a&&delete i.frame,s&&(i.minWidth=0,i.minHeight=0),l&&(i.transparent=!0,i.backgroundColor="#00000000"),f&&f!=="none"&&(i.backgroundMaterial=f,i.backgroundColor="#00000000"),process.env.DISCORD_PRELOAD=h,super(i),s&&(this.setMinimumSize=(w,m)=>{})}}Object.assign(e,Y.default.BrowserWindow),Object.defineProperty(e,"name",{value:"BrowserWindow",configurable:!0});let n=require.resolve("electron");delete require.cache[n].exports,require.cache[n].exports={...Y.default,BrowserWindow:e},Qo(global,"appSettings",r=>{r.set("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING",!0)}),process.env.DATA_DIR=(0,Se.join)(Y.app.getPath("userData"),"..","Vencord")}console.log("[Vencord] Loading original Discord app.asar");require(require.main.filename)});u();u();u();Wr();u();Ue();var ur=require("electron");u();var In={};Te(In,{fetchTrackData:()=>xa});u();u();u();var zr="59a5428";u();var kn="Vendicated/Vencord";var Br=`Vencord/${zr}${kn?` (https://github.com/${kn})`:""}`;var jr=require("child_process"),Hr=require("util"),Kr=(0,Hr.promisify)(jr.execFile);async function Pn(t){let{stdout:e}=await Kr("osascript",t.map(n=>["-e",n]).flat());return e}var j=null;async function Sa({id:t,name:e,artist:n,album:r}){if(t===j?.id){if("data"in j)return j.data;if("failures"in j&&j.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":Br}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return j={id:t,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},j.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),j={id:t,failures:(t===j?.id&&"failures"in j?j.failures:0)+1},null}}async function xa(){try{await Kr("pgrep",["^Music$"])}catch{return null}if(await Pn(['tell application "Music"',"get player state","end tell"]).then(f=>f.trim())!=="playing")return null;let e=await Pn(['tell application "Music"',"get player position","end tell"]).then(f=>Number.parseFloat(f.trim())),n=await Pn(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(f=>!!f),l=Number.parseFloat(s),p=await Sa({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:e,duration:l,...p}}var An={};Te(An,{initDevtoolsOpenEagerLoad:()=>Ta});u();function Ta(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var ni={};u();oe();var Bt=require("electron"),zt=[];function ti(){let t=[];for(let e=zt.length-1;e>=0;e--){let{processId:n,routingId:r}=zt[e],i=Bt.webFrameMain.fromId(n,r);if(!i){zt.splice(e,1);continue}t.push(i)}return t}Bt.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){ti();let{routingId:i,processId:o}=r;zt.push({routingId:i,processId:o});let a=R.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});R.addChangeListener("plugins.FixSpotifyEmbeds.volume",t=>{try{ti().forEach(e=>e.executeJavaScript(`globalThis._vcVolume = ${t/100}`))}catch(e){console.error("FixSpotifyEmbeds: Failed to update volume",e)}});var ii={};u();oe();var ri=require("electron");ri.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!R.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var On={};Te(On,{resolveRedirect:()=>Pa});u();var oi=require("https"),ka=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function ai(t){return new Promise((e,n)=>{let r=(0,oi.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?ai(i.headers.location):t)});r.on("error",n),r.end()})}async function Pa(t,e){return ka.test(e)?ai(e):e}var Ln={};Te(Ln,{makeDeeplTranslateRequest:()=>Ia,makeKagiTranslateRequest:()=>Aa});u();async function Ia(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function Aa(t,e,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${e}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var Vn={};Te(Vn,{readRecording:()=>Ca});u();var si=require("electron"),jt=require("fs/promises"),pt=require("path");async function Ca(t,e){e=(0,pt.normalize)(e);let n=(0,pt.basename)(e),r=(0,pt.normalize)(si.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!e.startsWith(r))return null;try{let i=await(0,jt.readFile)(e);return(0,jt.rm)(e).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var Fn={};Te(Fn,{closeSocket:()=>Ra,sendToOverlay:()=>Ma});u();var li=require("dgram"),Ht=null;function Ma(t,e){e.messageType=e.type;let n=JSON.stringify(e);Ht??=(0,li.createSocket)("udp4"),Ht.send(n,42069,"127.0.0.1")}function Ra(){Ht?.close(),Ht=null}var ui={};u();oe();var ci=require("electron");u();var Nn=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;ci.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{R.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(Nn):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(Nn))})})});var cr={};Te(cr,{answerOverlayAction:()=>Bl,armDisplayMedia:()=>ml,checkUpdate:()=>Zl,closeStudioOverlay:()=>Ul,deleteClip:()=>Hs,disarmDisplayMedia:()=>gl,downloadUpdate:()=>Yl,dropOverlayWaiters:()=>zl,emptyTrash:()=>Us,focusClient:()=>jl,gameFeedStatus:()=>xl,getActiveScreen:()=>hl,getCaptureSources:()=>pl,getClipDirectory:()=>ll,getMemoryReport:()=>fl,getPlatformInfo:()=>dl,hideClipOverlay:()=>Ll,hideVrPanel:()=>Cl,listClips:()=>Rs,listTrash:()=>$s,notifyClipSaved:()=>Ol,openClipDirectory:()=>ul,openStudioOverlay:()=>$l,openVrBindings:()=>Il,pickAudioFiles:()=>el,pickClipDirectory:()=>cl,pickImageFiles:()=>rl,pickVideoFiles:()=>Js,readAudioFile:()=>nl,readClip:()=>_s,readImageFile:()=>al,readLibrary:()=>Zs,readVideoFile:()=>Qs,readVoiceTrack:()=>Cs,registerShortcuts:()=>yl,relaunchClient:()=>Xl,releaseClipPath:()=>ks,renameClip:()=>Ks,reserveClipPath:()=>Es,restoreClip:()=>Ns,revealClip:()=>sl,saveClip:()=>Ts,saveVoiceTrack:()=>As,shareClipToHost:()=>Ds,showClipOverlay:()=>Dl,showVrPanel:()=>Al,spillClear:()=>js,spillDrop:()=>Bs,spillRead:()=>zs,spillWrite:()=>Ws,startGameFeeds:()=>bl,startVrBridge:()=>El,stopGameFeeds:()=>Sl,stopVrBridge:()=>kl,studioOverlayUp:()=>Gl,trashClip:()=>Fs,unregisterShortcuts:()=>sr,vrBridgeStatus:()=>Pl,waitForGameEvent:()=>Tl,waitForOverlayAction:()=>Wl,waitForShortcut:()=>wl,waitForVrEvent:()=>Ml,writeLibrary:()=>qs});u();var Rt=require("crypto"),y=require("electron"),c=require("fs"),ln=require("https"),sn=require("os"),d=require("path");u();var H=require("fs"),fi=require("http"),hi=require("https"),mi=require("os"),yt=require("path"),di=34765,_a=6,gi=256*1024,Da=2e3,Oa=1500,La="127.0.0.1",Va=2999,Fa="gamestate_integration_clipper.cfg",fe=null,je=0,Zt="",He=null,gt=[],Na=12,vt=[],Ke=[],Ze={cs2:!1,league:!1};function qt(t){gt.length>=Na||gt.includes(t)||gt.push(t)}var Yt=Promise.resolve();function ft(t){let e=Ke.shift();if(e){e(t);return}vt.push(t),vt.length>16&&vt.shift()}var P={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function vi(){P={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function $a(t){return t>=5?"an ace in Counter-Strike 2":t===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function Ua(t){let e=t.provider?.steamid,{player:n}=t;if(!n||!e||!n.steamid||n.steamid!==e)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof t.map?.round=="number"?t.map.round:P.round;(r.kills<P.kills||r.deaths<P.deaths)&&vi();let o=P.kills<0;i!==P.round&&(P.round=i,P.roundKills=0,P.announced=0);let a=r.kills-Math.max(0,P.kills),s=r.deaths-Math.max(0,P.deaths);if(P.kills=r.kills,P.deaths=r.deaths,o)return;a>0&&(P.roundKills+=a,P.roundKills>=3&&P.roundKills>P.announced?(P.announced=P.roundKills,ft({kind:"multikill",note:$a(P.roundKills)})):ft({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&ft({kind:"death",note:"your death in Counter-Strike 2"});let l=t.round?.win_team;l&&n.team&&l===n.team&&t.round?.phase==="over"&&P.roundKills>0&&ft({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function Ga(){return new Promise(t=>{let e=0,n=(0,fi.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>gi&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{Ua(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++e<_a){n.listen(di+e,"127.0.0.1");return}qt(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}fe===n&&(fe=null,je=0,Ze={...Ze,cs2:!1}),t(0)}),n.on("listening",()=>{fe=n,t(n.address().port)}),n.listen(di,"127.0.0.1")})}function Wa(){let t=[],e=(0,mi.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&t.push((0,yt.join)(i,"Steam"))}let n=[];for(let r of t)if((0,H.existsSync)(r)){n.push(r);try{let i=(0,H.readFileSync)((0,yt.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function za(){for(let t of Wa()){let e=(0,yt.join)(t,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,H.existsSync)(e))return e}return""}function Ba(t){let e=za();if(!e)return qt("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,yt.join)(e,Fa),r=`"Clipper"
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
`;try{return(0,H.mkdirSync)(e,{recursive:!0}),(0,H.writeFileSync)(n,r,"utf8"),n}catch(i){return qt(`Counter-Strike 2's config could not be written (${i.message})`),""}}function ja(){let t=Zt;if(Zt="",!!t)try{(0,H.unlinkSync)(t)}catch{}}var ht="",Be=-1,$n=!1,Kt=!1;function mt(t){return t.split("#")[0].trim().toLowerCase()}function pi(t){return new Promise(e=>{let n=(0,hi.get)({host:La,port:Va,path:t,rejectUnauthorized:!1,timeout:Oa},r=>{if(r.statusCode!==200){r.resume(),e(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>gi&&n.destroy()}),r.on("end",()=>{try{e(JSON.parse(i))}catch{e(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>e(null))})}function Ha(t,e){let n=t.EventName??"",r=mt(t.KillerName??"");switch(n){case"ChampionKill":return r===e?{kind:"kill",note:"a kill in League of Legends"}:mt(t.VictimName??"")===e?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==e?null:{kind:"multikill",note:`a ${t.KillStreak??3}-kill run in League of Legends`};case"Ace":return mt(t.Acer??"")!==e?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return mt(t.Recipient??"")!==e?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==e?null:{kind:"objective",note:`${t.DragonType?`the ${t.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==e?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==e?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==e?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function Ka(){if(!Kt){Kt=!0;try{if(!ht){let r=await pi("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;ht=mt(r),Be=-1}let t=await pi("/liveclientdata/eventdata");if(!t?.Events){ht="";return}let e=Be<0,n=Be;for(let r of t.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=Be||(n=Math.max(n,i),e))continue;let o=Ha(r,ht);o&&ft(o)}Be=n}finally{Kt=!1}}}function Za(){ht="",Be=-1,Kt=!1,He=setInterval(()=>{Ka().catch(t=>{$n||($n=!0,qt(`League of Legends could not be read (${t.message})`))})},Da)}function qa(t){return t.cs2!==Ze.cs2||t.league!==Ze.league?!1:(!t.cs2||fe!==null)&&(!t.league||He!==null)}function yi(t){let e=Yt.then(async()=>(qa(t)||(wi(),gt=[],t.cs2&&(vi(),je=await Ga(),je&&(Zt=Ba(je))),t.league&&Za(),Ze={cs2:t.cs2&&fe!==null,league:t.league}),Jt()));return Yt=e.catch(()=>{}),e}function wi(){if(Ze={cs2:!1,league:!1},He&&clearInterval(He),He=null,$n=!1,fe)try{fe.close()}catch{}fe=null,je=0,ja(),vt=[];let t=Ke;Ke=[];for(let e of t)e(null)}function Un(){let t=Yt.then(()=>wi());return Yt=t.catch(()=>{}),t}function Jt(){return{port:je,configPath:Zt,league:He!==null,problems:[...gt]}}function bi(t){let e=vt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{Ke=Ke.filter(a=>a!==i),i(null)},t);Ke.push(i)})}u();var he=require("electron"),Ye=require("fs"),bt=require("path"),Si=require("url"),Xt=24,xi=2600,Qt=220,Ya=300,Ja=56,Gn=!0;function en(){return Gn}var Ae=null,Pe=null,wt=null,Ie=null;function Xa(){return!!Ae&&!Ae.isDestroyed()}function Ce(){Pe&&(clearTimeout(Pe),Pe=null);let t=Ae;Ae=null,t&&!t.isDestroyed()&&t.destroy()}function qe(){Ie&&(clearTimeout(Ie),Ie=null);let t=wt;wt=null,t&&!t.isDestroyed()&&t.destroy()}function Qa(t,e,n){let i=he.screen.getDisplayNearestPoint(he.screen.getCursorScreenPoint()).workArea,o=t==="top-left"||t==="bottom-left",a=t==="top-left"||t==="top-right";return{x:Math.round(o?i.x+Xt:i.x+i.width-e-Xt),y:Math.round(a?i.y+Xt:i.y+i.height-n-Xt)}}function St(t,e){let n=(0,bt.join)(he.app.getPath("userData"),"clipper-overlay");(0,Ye.mkdirSync)(n,{recursive:!0});let r=(0,bt.join)(n,t);return(0,Ye.writeFileSync)(r,e,"utf8"),r}function Ti(t){return`${t}-${Date.now()}-${process.pid}.html`}function Ei(t){try{(0,Ye.unlinkSync)(t)}catch{}}function ki(t,e,n,r){let{x:i,y:o}=Qa(r,e,n),a=new he.BrowserWindow({width:e,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(t).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function Pi(t){return`<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }
    .card {
        position: absolute; inset: 0; border-radius: 12px; overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 10px 34px rgba(0, 0, 0, 0.6);
        opacity: 0; transform: scale(0.96); transition: opacity ${Qt}ms ease, transform ${Qt}ms ease;
    }
    .card.up { opacity: 1; transform: none; }
    ${t}
</style>`}function X(t){return JSON.stringify(t).replace(/</g,"\\u003c")}function es(t,e){return`<!doctype html>
<html>
<head>
${Pi(`.card { background: #000; }
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
    var look = ${X(e)};
    var video = document.getElementById("video");
    var card = document.getElementById("card");
    document.getElementById("tag").textContent = ${X((0,bt.basename)(t))};

    var leaving = false;
    function leave() {
        if (leaving) return;
        leaving = true;
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Qt});
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

    video.src = ${X((0,Si.pathToFileURL)(t).href)};

    // Autoplay with sound is only allowed after a gesture, and this window
    // never gets one. Muted playback is always allowed, so it is the fallback
    // rather than a reason to show nothing.
    video.play().catch(function () {
        video.muted = true;
        video.play().catch(leave);
    });
</script>
</body>
</html>`}function ts(t,e){return`<!doctype html>
<html>
<head>
${Pi(`.card {
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
    document.getElementById("title").textContent = ${X(t)};
    document.getElementById("note").textContent = ${X(e)};

    requestAnimationFrame(function () { card.classList.add("up"); });

    setTimeout(function () {
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${Qt});
    }, ${xi});
</script>
</body>
</html>`}function Ii(t,e){if(!Gn)return!1;Ce(),qe();let n=Math.max(200,Math.round(e.width)),r=Math.round(n*9/16),i=St(Ti("clip"),es(t,e)),o=ki(i,n,r,e.corner);Ae=o,o.on("closed",()=>{Ei(i),Ae===o&&(Ae=null,Pe&&(clearTimeout(Pe),Pe=null))});let a=(e.seconds>0?e.seconds:300)+10;return Pe=setTimeout(()=>Ce(),a*1e3),!0}function Ai(t,e,n){if(!Gn||Xa())return!1;qe();let r=St(Ti("toast"),ts(t,e)),i=ki(r,Ya,Ja,n);return wt=i,i.on("closed",()=>{Ei(r),wt===i&&(wt=null,Ie&&(clearTimeout(Ie),Ie=null))}),Ie=setTimeout(()=>qe(),xi+4e3),!0}he.app.on("will-quit",()=>{Ce(),qe()});u();var Q=require("electron"),Ci=require("url");var Wn="VencordClipperOverlayAction",Mi="VencordClipperOverlayReply",ns=108,L=null;function zn(){return!!L&&!L.isDestroyed()}function Tt(){let t=L;L=null,t&&!t.isDestroyed()&&t.destroy()}var Je=[],xt=[];function rs(t){let e=Je.shift();if(e){e(t);return}xt.push(t),xt.length>4&&xt.shift()}function Ri(t){let e=xt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{Je=Je.filter(a=>a!==i),i(null)},t);Je.push(i)})}function _i(){xt=[];let t=Je;Je=[];for(let e of t)e(null)}function Di(t){!L||L.isDestroyed()||L.webContents.send(Mi,t)}Q.ipcMain.removeAllListeners(Wn);Q.ipcMain.on(Wn,(t,e,n)=>{if(!L||L.isDestroyed()||t.sender!==L.webContents)return;let r=String(e??"");if(r==="close"){Tt();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open"&&r!=="link")return;let i=n??{},o=Number(i.from),a=Number(i.to),s=String(i.clip??"");!s||s.length>128||rs({kind:r,clip:s,from:Number.isFinite(o)?Math.min(3600,Math.max(0,o)):0,to:Number.isFinite(a)?Math.min(3600,Math.max(0,a)):0})});function is(t,e){let{workArea:n}=Q.screen.getDisplayNearestPoint(Q.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-t)/2),y:Math.round(n.y+(n.height-e)/2)}}var os=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${X(Wn)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${X(Mi)}, (_event, reply) => handler(reply));
    }
});
`;function as(t,e){return`<!doctype html>
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
    var clip = ${X({name:t.name,url:(0,Ci.pathToFileURL)(t.path).href,markers:t.markers})};
    var look = ${X(e)};
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
</html>`}function Oi(t,e){if(!en())return!1;Tt(),Ce(),qe();let n=Math.max(360,Math.round(e.width)),r=Math.round(n*9/16)+ns,{x:i,y:o}=is(n,r),a=St("studio-preload.js",os),s=St("studio.html",as(t,e)),l=new Q.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return L=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{L===l&&(L=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}Q.app.on("will-quit",()=>Tt());u();function K(t){return`${t.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}u();var Wi=require("child_process"),zi=require("crypto"),Bi=require("electron"),_e=require("fs"),It=require("path");u();var ss=`
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
`,Bn=`# Vencord Clipper - SteamVR bridge. Generated; edits are overwritten.
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
${ss}
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
`;u();var Vi=require("electron"),U=require("fs"),$=require("path"),tn="vencord.clipper",me="/actions/clipper",Et=["save","mark","toggle","pov"],ls=["save","mark"],cs={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function jn(){let t=(0,$.join)(Vi.app.getPath("userData"),"clipper-vr");return(0,U.mkdirSync)(t,{recursive:!0}),t}function us(){let t=(0,$.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,U.readFileSync)(t,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,U.existsSync)((0,$.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let e=(0,$.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,U.existsSync)((0,$.join)(e,"bin","win64","openvr_api.dll"))?e:null}function Fi(){let t=us();return t&&(0,$.join)(t,"bin","win64","openvr_api.dll")}var ds=.4,ps={save:"double",mark:"long"};function fs(t,e,n){return{path:t,mode:"button",inputs:{[e]:{output:`${me}/in/${n}`}},parameters:e==="long"?{long_press_delay:ds}:{}}}function Li(t,e){return{app_key:tn,controller_type:t,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[me]:{sources:ls.map(n=>fs(e[n],ps[n],n))}}}}function Ni(){let t=jn(),e={language_tag:"en_US",[me]:"Clipper"};for(let o of Et)e[`${me}/in/${o}`]=cs[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:me,usage:"leftright"}],actions:Et.map(o=>({name:`${me}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[e]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,U.writeFileSync)((0,$.join)(t,"bindings_knuckles.json"),JSON.stringify(Li("knuckles",r),null,4),"utf8"),(0,U.writeFileSync)((0,$.join)(t,"bindings_oculus_touch.json"),JSON.stringify(Li("oculus_touch",r),null,4),"utf8");let i=(0,$.join)(t,"actions.json");return(0,U.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function $i(t){let e={source:"builtin",applications:[{app_key:tn,launch_type:"binary",binary_path_windows:t,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,$.join)(jn(),"clipper.vrmanifest");return(0,U.writeFileSync)(n,JSON.stringify(e,null,4),"utf8"),n}function Hn(){return(0,$.join)(jn(),"bridge.ps1")}var hs=15e3,ms=45e3,Ui=3,gs=3,vs=2e3,F=null,nn=!1,ae="",V="",Me="",Re=!1,Zn=0,ji=0,Xe=null,kt=[],Pt=null,ge=[],rn=Promise.resolve();function Gi(t){let e=ge.shift();if(e){e(t);return}if(t.kind==="motion"){Pt=t;return}kt.push(t.action),kt.length>8&&kt.shift()}function ys(t){let e=t.trim();if(!e.startsWith("{"))return!1;let n;try{n=JSON.parse(e)}catch{return!1}if(n.t==="ready")return ae=String(n.runtime??""),V="",Me="",Re=!1,!0;if(n.t==="waiting")return ae="",V="",Me=String(n.reason??""),!0;if(n.t==="warning")return V=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return V=String(n.message??"The SteamVR bridge failed for a reason it did not give"),Re=!ae||++ji>=gs,!0;if(n.t==="action"){let r=Et.find(i=>i===n.name);return r&&Gi({kind:"action",action:r}),!1}return n.t==="motion"&&Gi({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function Kn(){Xe||!nn||Re||(Xe=setTimeout(()=>{Xe=null,nn&&Hi()},hs))}function Hi(){if(F)return Promise.resolve();let t=Fi();if(!t)return Kn(),Promise.resolve();let e;try{let n=Hn();(0,_e.writeFileSync)(n,Bn,"utf8");let r=(0,_e.readFileSync)(n,"utf8"),i=a=>(0,zi.createHash)("sha256").update(a,"utf8").digest("hex");if(i(r)!==i(Bn))throw new Error("The SteamVR bridge script changed between writing and starting it.");let o=(0,It.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");e=(0,Wi.spawn)(o,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",t,"-Actions",Ni(),"-Manifest",$i(o),"-AppKey",tn,"-ActionList",[me,...Et].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return V=`The SteamVR bridge could not be started (${n.message}).`,Kn(),Promise.resolve()}return F=e,ae="",Me="",Re=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{V="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},ms),a="";e.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let p of l)ys(p)&&i()}),e.stderr?.on("data",()=>{V||(V="The SteamVR bridge printed an error and gave no usable message.")}),e.on("error",s=>{V=`The SteamVR bridge could not be started (${s.message}).`,i()}),e.on("exit",()=>{F===e&&(!ae&&!Me&&!Re?++Zn>=Ui&&(Re=!0,V||(V=`The SteamVR bridge stopped ${Ui} times without saying why. Switch the VR controls off and on again to try it once more.`)):Zn=0,F=null,ae="",Me="");let s=ge;ge=[];for(let l of s)l(null);i(),Kn()})})}function Ki(){Xe&&(clearTimeout(Xe),Xe=null);let t=F;F=null,ae="",Me="",Re=!1,Zn=0,ji=0,kt=[],Pt=null;let e=ge;ge=[];for(let r of e)r(null);if(!t)return;try{t.stdin?.end()}catch{}let n=setTimeout(()=>{try{t.kill()}catch{}},vs);t.on("exit",()=>clearTimeout(n))}function Zi(t){let e=rn.then(async()=>(nn=t,t?(await Hi(),on()):(Ki(),V="",on())));return rn=e.catch(()=>{}),e}function qn(){let t=rn.then(()=>{nn=!1,Ki()});return rn=t.catch(()=>{}),t}function on(){return{running:F!==null&&ae!=="",runtime:ae,problem:V,waiting:Me}}function qi(){if(!F?.stdin?.writable)return!1;try{return F.stdin.write(`bindings
`),!0}catch{return!1}}var ws=0;function Yi(t,e,n,r){if(!F?.stdin?.writable||e<=0||n<=0||t.length!==e*n*4||e>2048||n>2048||t.length>16*1024*1024)return!1;let i=Math.min(1e4,Math.max(1e3,Math.round(r))),o=(0,It.join)((0,It.dirname)(Hn()),`panel-${ws++%8}.rgba`);try{return(0,_e.writeFileSync)(o,t),F.stdin.write(`panel ${e} ${n} ${i} ${o}
`),!0}catch{try{(0,_e.unlinkSync)(o)}catch{}return!1}}function Ji(){if(!F?.stdin?.writable)return!1;try{return F.stdin.write(`panelhide
`),!0}catch{return!1}}function Xi(t=3e4){let e=kt.shift();if(e)return Promise.resolve({kind:"action",action:e});if(Pt){let n=Pt;return Pt=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{ge=ge.filter(a=>a!==i),i(null)},t);ge.push(i)})}Bi.app.on("will-quit",()=>{qn()});var eo=!0,rr=!1,Yn=500*1024*1024,bs="https://0x0.st",Qi=512*1024*1024,to=/vesktop|equibop/i.test(y.app.getName());function T(t){let e=t?.trim(),n=e&&(0,d.isAbsolute)(e)?e:(0,d.join)(y.app.getPath("videos"),"DiscordClips"),r=(0,d.normalize)(n),i=r.toUpperCase();if(i.startsWith("\\\\?\\")||i.startsWith("\\\\.\\"))throw new Error("That folder is not a place for clips");if(/(^|[\\/])[. ]+([\\/]|$)/.test(r.replace(/[\\/]+$/,"")))throw new Error("That folder is not a place for clips");let o=r.toLowerCase().replace(/[\\/]+$/,"");for(let a of Ss()){let s=(0,d.normalize)(a).toLowerCase().replace(/[\\/]+$/,"");if(o===s||o.startsWith(`${s}\\`)||o.startsWith(`${s}/`))throw new Error("That folder is not a place for clips")}return r}function Ss(){let t=[];for(let e of["SystemRoot","windir","ProgramFiles","ProgramFiles(x86)","ProgramW6432"]){let n=process.env[e]?.trim();n&&t.push(n)}try{t.push(lr())}catch{}try{t.push(y.app.getPath("userData"))}catch{}return t}var xs=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;function _(t){let n=(0,d.basename)(String(t??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${xs.test(r[1])?`_${r[1]}`:r[1]}.${r[2].toLowerCase()}`:null}function no(t){return _(t)??`clip-${Date.now()}.webm`}function _t(t,e){let n=(0,d.extname)(e),r=e.slice(0,e.length-n.length),i=(0,d.join)(t,e),o=2;for(;((0,c.existsSync)(i)||De.has(ee(i)))&&o<1e3;)i=(0,d.join)(t,`${r} (${o++})${n}`);if((0,c.existsSync)(i)||De.has(ee(i)))throw new Error(`No free name left for ${e}; rename or clear the folder`);return i}var Qe=new Map;function ro(t,e){let n=`${t}.tmp-${process.pid}-${Date.now()}`;(0,c.writeFileSync)(n,Buffer.from(e));try{(0,c.renameSync)(n,t)}catch(r){try{(0,c.unlinkSync)(n)}catch{}throw r}}function Ts(t,e,n,r,i=!1){if(r.length>Yn)throw new Error("That clip is too large to write");let o=T(e);(0,c.mkdirSync)(o,{recursive:!0});let a=no(n),s=(0,d.join)(o,a),l=(Qe.get(s)??Promise.resolve()).catch(()=>{}).then(async()=>{let p=i?_t(o,a):(0,d.join)(o,a);return ro(p,r),p});return l.then(()=>{Qe.get(s)===l&&Qe.delete(s)},()=>{Qe.get(s)===l&&Qe.delete(s)}),Qe.set(s,l),l}var De=new Set;function Es(t,e,n){let r=T(e);(0,c.mkdirSync)(r,{recursive:!0});let i=_t(r,no(n));if(!De.has(ee(i)))return De.add(ee(i)),i;let o=(0,d.extname)(i),a=i.slice(0,i.length-o.length),s=1,l=`${a}-${s}${o}`;for(;De.has(ee(l))||(0,c.existsSync)(l);)l=`${a}-${++s}${o}`;return De.add(ee(l)),l}function ks(t,e){typeof e!="string"||!(0,d.isAbsolute)(e)||_((0,d.basename)(e)??"")&&De.delete(ee(e))}var Dt="voices";function Ps(t,e){let n=_(t);return!n||!/^\d{1,25}$/.test(String(e??""))?null:`${n.slice(0,n.length-(0,d.extname)(n).length)}.${e}.webm`}function Is(t,e){let n=_(e);if(!n)return[];let r=(0,d.join)(T(t),Dt);if(!(0,c.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,d.extname)(n).length)}.`,o=[];for(let a of(0,c.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function As(t,e,n,r,i){let o=Ps(n,r);if(!o)return null;if(i.length>Jn)throw new Error("That voice track is too large to write");let a=(0,d.join)(T(e),Dt);(0,c.mkdirSync)(a,{recursive:!0});let s=(0,d.join)(a,o);return ro(s,i),s}var Jn=64*1024*1024;function Cs(t,e,n){let r=(0,d.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");let i=(0,d.join)(T(e),Dt,r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>Jn)throw new Error("That voice track is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>Jn)throw new Error("That voice track is too large to open");return s}finally{(0,c.closeSync)(o)}}function Ms(t,e){let n=(0,d.join)(T(t),Dt);for(let{file:r}of Is(t,e))try{(0,c.unlinkSync)((0,d.join)(n,r))}catch{}}function Rs(t,e){let n=T(e);if(!(0,c.existsSync)(n))return[];try{ao(n)}catch{}let r=[],i=new Set,o=(0,c.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,d.join)(n,a.name);try{let l=(0,c.statSync)(s),p=K(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(p)?{thumb:p}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function _s(t,e,n){let r=_(n);if(!r)throw new Error("That is not a clip name");let i=(0,d.join)(T(e),r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>Yn)throw new Error("That clip is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>Yn)throw new Error("That clip is too large to open");return s}finally{(0,c.closeSync)(o)}}async function Ds(t,e,n){let r=_(n);if(!r)throw new Error("That is not a clip name");let i=(0,d.join)(T(e),r),o=(0,c.openSync)(i,"r"),a;try{let{size:s}=(0,c.fstatSync)(o);if(s>Qi)throw new Error("That clip is too large to share");if(a=(0,c.readFileSync)(o),a.length>Qi)throw new Error("That clip is too large to share")}finally{(0,c.closeSync)(o)}return Os(r,a)}function Os(t,e){return new Promise((n,r)=>{let i=`----vencord${(0,Rt.randomBytes)(16).toString("hex")}`,o=Buffer.from(`--${i}\r
Content-Disposition: form-data; name="file"; filename="${t}"\r
Content-Type: application/octet-stream\r
\r
`,"utf8"),a=Buffer.from(`\r
--${i}--\r
`,"utf8"),s=Buffer.concat([o,e,a],o.length+e.length+a.length),l=(0,ln.request)(bs,{method:"POST",headers:{"User-Agent":fo,"Content-Type":`multipart/form-data; boundary=${i}`,"Content-Length":s.length,Accept:"*/*"}},p=>{let f=p.statusCode??0,h=[],w=0,m=setTimeout(E,2e4);function E(){p.destroy(new Error("The host stalled mid-upload"))}p.on("data",x=>{if(clearTimeout(m),m=setTimeout(E,2e4),w+=x.length,w>1024*1024){p.destroy(new Error("The host answered too much"));return}h.push(x)}),p.on("end",()=>{if(clearTimeout(m),f!==200)return r(new Error(`The host answered ${f}`));let x=Buffer.concat(h).toString("utf8").trim(),k=/^https:\/\/0x0\.st\/\S+$/.test(x)?x:null;if(!k)return r(new Error("The host did not return a link"));n(k)}),p.on("error",x=>{clearTimeout(m),r(x)})});l.setTimeout(600*1e3,()=>l.destroy(new Error("The upload took too long"))),l.on("error",r),l.end(s)})}var Ls=".trash",io=".trash.json",Vs=168*3600*1e3;function Ot(t){return(0,d.join)(t,Ls)}function Lt(t){let e;try{e=JSON.parse((0,c.readFileSync)((0,d.join)(t,io),"utf8"))}catch{return{}}if(!e||typeof e!="object")return{};let n={};for(let[r,i]of Object.entries(e))/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.test(r)&&(!i||typeof i!="object"||i.stored!==r||(n[r]=i));return n}function et(t,e){(0,c.mkdirSync)(t,{recursive:!0}),(0,c.writeFileSync)((0,d.join)(t,io),JSON.stringify(e))}function oo(t,e){if(!e)return;let n=(0,d.join)(t,Dt),r;try{r=(0,c.readdirSync)(n)}catch{return}for(let i of r)if(i.startsWith(`${e}.`)&&i.toLowerCase().endsWith(".webm"))try{(0,c.unlinkSync)((0,d.join)(n,i))}catch{}}function ao(t){let e=Ot(t);if(!(0,c.existsSync)(e))return;let n=Lt(e),r=Date.now(),i=!1;for(let[o,a]of Object.entries(n))if(!(!a||r-(a.deletedAt??0)<Vs)){for(let s of[o,K(o)])try{(0,c.unlinkSync)((0,d.join)(e,s))}catch{}oo(t,(a.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,"")),delete n[o],i=!0}i&&et(e,n)}function Fs(t,e,n,r){let i=_(n);if(!i)throw new Error("That is not a clip name");if(r!==null&&(typeof r!="string"||r.length>1024*1024))throw new Error("That metadata is not metadata");let o=T(e),a=(0,d.join)(o,i);if(!(0,c.existsSync)(a))throw new Error("That clip is already gone");let s=Ot(o);(0,c.mkdirSync)(s,{recursive:!0});let l=_t(s,i).split(/[\\/]/).pop()||i;(0,c.renameSync)(a,(0,d.join)(s,l));let p=K(i);if((0,c.existsSync)((0,d.join)(o,p)))try{(0,c.renameSync)((0,d.join)(o,p),(0,d.join)(s,K(l)))}catch{}let f=Lt(s);f[l]={stored:l,name:i,deletedAt:Date.now(),meta:r},et(s,f)}function Ns(t,e,n){let r=_(n);if(!r)throw new Error("That is not a clip name");let i=T(e),o=Ot(i),a=Lt(o),s=a[r];if(!s||!(0,c.existsSync)((0,d.join)(o,r)))throw delete a[r],et(o,a),new Error("That clip is no longer in the trash");let l=_(s.name);if(!l)throw delete a[r],et(o,a),new Error("That trash entry names nothing restorable");let p=_t(i,l).split(/[\\/]/).pop()||l;(0,c.renameSync)((0,d.join)(o,r),(0,d.join)(i,p));let f=K(r);if((0,c.existsSync)((0,d.join)(o,f)))try{(0,c.renameSync)((0,d.join)(o,f),(0,d.join)(i,K(p)))}catch{}return delete a[r],et(o,a),{name:p,meta:s.meta??null}}function $s(t,e){let n=T(e);ao(n);let r=Ot(n),i=Lt(r),o=[];for(let[a,s]of Object.entries(i)){if(!s)continue;let l=0;try{l=(0,c.statSync)((0,d.join)(r,a)).size}catch{delete i[a];continue}let p="";try{let f=s.meta?JSON.parse(s.meta):null;f&&typeof f.game=="string"&&(p=f.game)}catch{}o.push({stored:a,name:s.name??a,size:l,deletedAt:s.deletedAt??0,game:p})}return o.sort((a,s)=>a.deletedAt-s.deletedAt)}function Us(t,e){let n=T(e),r=Ot(n);if((0,c.existsSync)(r)){for(let[i,o]of Object.entries(Lt(r))){for(let a of[i,K(i)])try{(0,c.unlinkSync)((0,d.join)(r,a))}catch{}o&&oo(n,(o.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,""))}et(r,{})}}var so=32*1024*1024;function Gs(){let t=(0,d.join)((0,sn.tmpdir)(),`clipper-spill-${process.pid}`);return(0,c.mkdirSync)(t,{recursive:!0}),t}function ir(t){if(!/^spill-\d+-[a-z0-9]+$/i.test(t))throw new Error("That is not a spill file");return(0,d.join)(Gs(),`${t}.frag`)}function Ws(t,e,n){if(n.length>so)throw new Error("That spill chunk is too large");(0,c.writeFileSync)(ir(e),Buffer.from(n))}function zs(t,e){let n=ir(e),r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>so)throw new Error("That spill chunk is too large");return new Uint8Array((0,c.readFileSync)(r))}finally{(0,c.closeSync)(r)}}function Bs(t,e){for(let n of e)try{(0,c.unlinkSync)(ir(n))}catch{}}function js(){let t=`clipper-spill-${process.pid}`,e;try{e=(0,c.readdirSync)((0,sn.tmpdir)())}catch{return}for(let n of e){if(!n.startsWith("clipper-spill-"))continue;let r=(0,d.join)((0,sn.tmpdir)(),n);if(n!==t){let i=0;try{i=Date.now()-(0,c.statSync)(r).mtimeMs}catch{continue}if(i<24*3600*1e3)continue}try{(0,c.rmSync)(r,{recursive:!0,force:!0})}catch{}}}async function Hs(t,e,n){let r=T(e),i=_(n);if(!i)throw new Error("That is not a clip name");let o=(0,d.join)(r,i);try{await y.shell.trashItem(o)}catch{(0,c.unlinkSync)(o)}Ms(e,i);let a=(0,d.join)(r,K(i));if((0,c.existsSync)(a))try{await y.shell.trashItem(a)}catch{try{(0,c.unlinkSync)(a)}catch{}}}function Ks(t,e,n,r){let i=T(e),o=_(n);if(!o)throw new Error("That is not a clip name");let a=(0,d.join)(i,o),s=(0,d.extname)(o),l=_(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let f=l.toLowerCase()===o.toLowerCase()?(0,d.join)(i,l):_t(i,l);(0,c.renameSync)(a,f);let h=(0,d.join)(i,K(o));if((0,c.existsSync)(h))try{(0,c.renameSync)(h,(0,d.join)(i,K((0,d.basename)(f))))}catch{}return(0,d.basename)(f)}var lo="clipper-library.json",Xn=5*1024*1024;function Zs(t,e){let n=(0,d.join)(T(e),lo);if(!(0,c.existsSync)(n))return"";try{let r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>Xn)return"";let o=new Uint8Array((0,c.readFileSync)(r));return o.length>Xn?"":Buffer.from(o).toString("utf8")}finally{(0,c.closeSync)(r)}}catch{return""}}function qs(t,e,n){let r=T(e);if((0,c.mkdirSync)(r,{recursive:!0}),String(n??"").length>Xn)throw new Error("That library document is too large to write");let i=(0,d.join)(r,lo),o=`${i}.tmp`;(0,c.writeFileSync)(o,String(n??""),"utf8"),(0,c.renameSync)(o,i)}var co="clipper-imports.json",uo=200,Ct=new Set;function ee(t){return(0,d.normalize)(t).toLowerCase()}function Ys(){try{(0,c.writeFileSync)((0,d.join)(y.app.getPath("userData"),co),JSON.stringify([...Ct].slice(-uo)),"utf8")}catch{}}try{let t=(0,c.readFileSync)((0,d.join)(y.app.getPath("userData"),co),"utf8"),e=JSON.parse(t);if(Array.isArray(e))for(let n of e.slice(-uo))typeof n=="string"&&(0,d.isAbsolute)(n)&&Ct.add(ee(n))}catch{}function or(t){let e=!1;for(let n of t){if(typeof n!="string"||!(0,d.isAbsolute)(n))continue;let r=ee(n);Ct.has(r)||(Ct.add(r),e=!0)}return e&&Ys(),t}function ar(t,e){if(typeof t!="string"||!(0,d.isAbsolute)(t)||!Ct.has(ee(t)))throw new Error(`That ${e} was not picked for import`);return t}async function Js(t){let e=await y.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return e.canceled?[]:or(e.filePaths)}var Xs=512*1024*1024;function Qs(t,e){if(ar(e,"video"),!/\.(mp4|webm|mkv|mov|m4v)$/i.test(e))throw new Error("Not a video file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>Xs){let i=Math.round(r/1048576);throw new Error(`That video is ${i} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function el(t){let e=await y.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return e.canceled?[]:or(e.filePaths)}var tl=64*1024*1024;function nl(t,e){if(ar(e,"audio file"),!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(e))throw new Error("Not an audio file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>tl){let i=Math.round(r/1048576);throw new Error(`That sound is ${i} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function rl(t){let e=await y.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return e.canceled?[]:or(e.filePaths)}var il=24*1024*1024,ol=64*1024*1024;function al(t,e){if(ar(e,"picture or clip"),!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(e))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(e),r=n?ol:il,i=(0,c.openSync)(e,"r");try{let{size:o}=(0,c.fstatSync)(i);if(o>r){let a=Math.round(o/1048576),s=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${a} MB; the montage caps them at ${s} MB.`)}return new Uint8Array((0,c.readFileSync)(i))}finally{(0,c.closeSync)(i)}}function sl(t,e,n){let r=_(n);if(!r)throw new Error("That is not a clip name");y.shell.showItemInFolder((0,d.join)(T(e),r))}function ll(t,e){return T(e)}async function cl(t,e){let n;try{n=T(e)}catch{n=(0,d.join)(y.app.getPath("videos"),"DiscordClips")}let r=await y.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:n,properties:["openDirectory","createDirectory"]});return r.canceled?"":r.filePaths[0]??""}function ul(t,e){let n=T(e);(0,c.mkdirSync)(n,{recursive:!0}),y.shell.openPath(n)}function dl(t){return{platform:"win32",wayland:rr,vesktop:to,overlay:en()}}var ve=new Set;async function pl(t,e=!0){if(rr)return[];let n=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:e?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(ve.size){let i=new Set(n.map(o=>o.id));for(let o of ve)i.has(o)||ve.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!e){if(!o&&ve.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if(eo&&!o&&a){ve.add(i.id);continue}ve.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function fl(t){try{return y.app.getAppMetrics().map(e=>({type:e.serviceName||e.type,mb:Math.round((e.memory?.workingSetSize??0)/1024)})).filter(e=>e.mb>0).sort((e,n)=>n.mb-e.mb)}catch{return[]}}async function hl(t){if(rr)return"";let e=await y.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!e.length)return"";try{let n=y.screen.getDisplayNearestPoint(y.screen.getCursorScreenPoint()),r=e.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return e[0].id}var Qn="",er=!1;function ml(t,e,n=!0){return!n||to?!1:(Qn=e??"",er=!0,y.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(p=>p.id===Qn),l=(a&&!ve.has(a.id)?a:void 0)??o.find(p=>p.id.startsWith("screen:"))??o.find(p=>!ve.has(p.id));if(!l){i({});return}i(eo&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function gl(t){Qn="",er&&(er=!1,y.session.defaultSession.setDisplayMediaRequestHandler(null))}var tr=new Map,ye=[],At=[];function vl(t){let e=ye.shift();if(e){e(t);return}At.push(t),At.length>8&&At.shift()}function yl(t,e){sr();let n=[];for(let[r,i]of Object.entries(e)){if(r!=="save"&&r!=="toggle"&&r!=="mark"&&r!=="pov"&&r!=="replay"||!i)continue;let o=!1;try{o=y.globalShortcut.register(i,()=>vl(r))}catch{o=!1}o?tr.set(r,i):n.push(i)}return n}function sr(t){for(let n of tr.values())try{y.globalShortcut.unregister(n)}catch{}tr.clear(),At=[];let e=ye;ye=[];for(let n of e)n(null)}function wl(t,e=3e4){let n=At.shift();if(n)return Promise.resolve(n);let r=Math.min(12e4,Math.max(1e3,Number(e)||3e4));return ye.length>32&&ye.shift()?.(null),new Promise(i=>{let o=!1,a=l=>{o||(o=!0,clearTimeout(s),i(l))},s=setTimeout(()=>{ye=ye.filter(l=>l!==a),a(null)},r);ye.push(a)})}y.app.on("will-quit",()=>sr());function bl(t,e){return yi(e)}function Sl(t){return Un()}function xl(t){return Jt()}function Tl(t,e=3e4){return bi(e)}function El(t,e){return Zi(e)}function kl(t){return qn()}function Pl(t){return on()}function Il(t){return qi()}function Al(t,e,n,r,i){return Yi(new Uint8Array(e),n,r,i)}function Cl(t){return Ji()}function Ml(t,e=3e4){return Xi(e)}y.app.on("will-quit",()=>{Un()});var Rl=["top-left","top-right","bottom-left","bottom-right"];function tt(t,e,n,r){let i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(e,Math.round(i))):r}function po(t){return Rl.includes(t)?t:"bottom-right"}function _l(t){return{corner:po(t?.corner),width:tt(t?.width,200,1280,420),volume:tt(t?.volume,0,100,0),seconds:tt(t?.seconds,0,300,10)}}function nr(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function Dl(t,e,n,r){let i=_(n);if(!i)return!1;let o=(0,d.join)(T(e),i);return(0,c.existsSync)(o)?Ii(o,_l(r)):!1}function Ol(t,e,n,r){return y.BrowserWindow.getFocusedWindow()||zn()?!1:Ai(nr(e,60),nr(n,90),po(r))}function Ll(t){Ce()}var Vl=200;function Fl(t){return Array.isArray(t)?t.map(Number).filter(e=>Number.isFinite(e)&&e>=0).slice(0,Vl):[]}function Nl(t){return{width:tt(t?.width,360,1600,720),volume:tt(t?.volume,0,100,0)}}function $l(t,e,n,r,i){let o=_(n);if(!o)return!1;let a=(0,d.join)(T(e),o);return(0,c.existsSync)(a)?Oi({name:o,path:a,markers:Fl(r)},Nl(i)):!1}function Ul(t){Tt()}function Gl(t){return zn()}function Wl(t,e=3e4){return Ri(tt(e,1e3,12e4,3e4))}function zl(t){_i()}function Bl(t,e,n,r){Di({ok:!!e,message:nr(n,120),close:!!r})}function jl(t){let e=y.BrowserWindow.fromWebContents(t.sender);!e||e.isDestroyed()||(e.isMinimized()&&e.restore(),e.show(),e.focus())}var Mt="kebab1337420/Clibab",fo=`VencordClipper (+https://github.com/${Mt})`,an=256*1024*1024;function Hl(t){let e="";try{let n=new URL(t);if(n.protocol!=="https:")return!1;e=n.hostname.toLowerCase()}catch{return!1}return e==="api.github.com"||e==="github.com"||e==="codeload.github.com"||e==="raw.githubusercontent.com"||e==="objects.githubusercontent.com"||e.endsWith(".githubusercontent.com")}function cn(t,e=0){return Hl(t)?new Promise((n,r)=>{let i=(0,ln.get)(t,{headers:{"User-Agent":fo,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),e>=5?r(new Error(`Too many redirects for ${t}`)):n(cn(new URL(s,t).toString(),e+1));return}let l=[],p=0,f=setTimeout(h,2e4);function h(){o.destroy(new Error(`${t} stalled mid-download`))}let{"content-length":w}=o.headers;if(w&&Number(w)>an){clearTimeout(f),o.destroy(new Error(`${t} answered ${w} bytes, over the ${an} byte cap`));return}o.on("data",m=>{if(clearTimeout(f),f=setTimeout(h,2e4),p+=m.length,p>an){o.destroy(new Error(`${t} exceeded the ${an} byte cap`));return}l.push(m)}),o.on("end",()=>{clearTimeout(f),n({status:a,body:Buffer.concat(l)})}),o.on("error",m=>{clearTimeout(f),r(m)})});i.setTimeout(6e4,()=>i.destroy(new Error(`${t} timed out`))),i.on("error",r)}):Promise.reject(new Error(`Refusing to fetch outside the update hosts: ${t}`))}async function Kl(t){let{status:e,body:n}=await cn(t);if(e!==200)throw new Error(`${t} answered ${e}`);return n}function lr(){return __dirname}function ho(t){return(0,c.existsSync)((0,d.join)(t,"patcher.js"))&&(0,c.existsSync)((0,d.join)(t,"renderer.js"))}function mo(t){try{return(0,c.accessSync)(t,c.constants.W_OK),!0}catch{return!1}}function go(t,e){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(t),i=n(e);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function Zl(t,e){let n=await Kl(`https://api.github.com/repos/${Mt}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=lr();return{version:o,tag:i,available:!!o&&go(o,e),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${Mt}/releases`),directory:a,writable:ho(a)&&mo(a)}}async function ql(t){let{status:e,body:n}=await cn(`https://raw.githubusercontent.com/${Mt}/${t}/prebuilt/build-info.json`);if(e===404)return null;if(e!==200)throw new Error(`The release's file list answered ${e}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return{files:r,text:n.toString("utf8")}}async function Yl(t,e,n){if(!/^[\w.-]{1,40}$/.test(e))throw new Error(`Refusing to fetch a release named ${e}`);if(!go(e.replace(/^v/i,""),String(n??"")))throw new Error(`Refusing to install ${e}: it is not newer than the installed bundle`);let r=lr();if(!ho(r))throw new Error(`No installed bundle at ${r}`);if(!mo(r))throw new Error(`${r} is read-only`);let i=await ql(e);if(!i)throw new Error(`The release under ${e} carries no file list; refusing to install it unchecked`);let o=i.files,a=i.text,s=Object.keys(o),l=(0,d.join)(r,`.clipper-update-${(0,Rt.randomBytes)(8).toString("hex")}`);if((0,c.existsSync)(l))throw new Error("An update staging folder is already there; refusing to share it");(0,c.mkdirSync)(l,{recursive:!0});try{let p=[];for(let m of s){if(m!==(0,d.basename)(m)||m.startsWith("."))throw new Error(`Refusing a release file named ${m}`);let{status:E,body:x}=await cn(`https://raw.githubusercontent.com/${Mt}/${e}/prebuilt/dist/${m}`);if(E!==200)throw new Error(`${m} answered ${E}`);if(x.length===0)throw new Error(`${m} came back empty`);let k=o[m];if(k?.size===void 0||!k?.sha256)throw new Error(`${m} has no size and hash in the release's file list`);if(x.length!==k.size)throw new Error(`${m} is ${x.length} bytes, the release says ${k.size}`);if((0,Rt.createHash)("sha256").update(x).digest("hex").toLowerCase()!==k.sha256.toLowerCase())throw new Error(`${m} does not match its hash`);(0,c.writeFileSync)((0,d.join)(l,m),x),p.push(m)}if(p.length===0)throw new Error(`There is no bundle published under ${e}`);for(let m of["renderer.js","patcher.js"])if(!p.includes(m))throw new Error(`The release carries no ${m}`);if(!(0,c.readFileSync)((0,d.join)(l,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let f=(0,d.join)(l,".previous");(0,c.mkdirSync)(f,{recursive:!0});let h=[],w=[];try{for(let m of p){let E=(0,d.join)(r,m);(0,c.existsSync)(E)&&((0,c.renameSync)(E,(0,d.join)(f,m)),h.push(m)),(0,c.renameSync)((0,d.join)(l,m),E),w.push(m)}}catch(m){for(let E of w)try{(0,c.unlinkSync)((0,d.join)(r,E))}catch{}for(let E of h)try{(0,c.renameSync)((0,d.join)(f,E),(0,d.join)(r,E))}catch{}throw new Error(`The update could not be put in place (${m.message}). The bundle that was there has been put back.`)}try{Jl(r,e,p,a)}catch{}return p}finally{(0,c.rmSync)(l,{recursive:!0,force:!0})}}function Jl(t,e,n,r){let i=e.replace(/^v/i,"");if(!/^[\w.-]{1,40}$/.test(i))return;let o=(0,d.join)(t,".."),a=(0,d.join)(o,`.recovery-${i}`);(0,c.mkdirSync)(a,{recursive:!0});for(let s of n)s!==(0,d.basename)(s)||s.startsWith(".")||(0,c.copyFileSync)((0,d.join)(t,s),(0,d.join)(a,s));(0,c.writeFileSync)((0,d.join)(a,"build-info.json"),r);for(let s of(0,c.readdirSync)(o))s===`.recovery-${i}`||!s.startsWith(".recovery-")||(0,c.rmSync)((0,d.join)(o,s),{recursive:!0,force:!0})}function Xl(t){y.app.relaunch(),y.app.quit(),setTimeout(()=>y.app.exit(0),3e3)}var vo={AppleMusicRichPresence:In,ConsoleShortcuts:An,FixSpotifyEmbeds:ni,FixYoutubeEmbeds:ii,OpenInApp:On,Translate:Ln,VoiceMessages:Vn,XSOverlay:Fn,YoutubeAdblock:ui,Clipper:cr};var yo={};for(let[t,e]of Object.entries(vo)){let n=Object.entries(e);if(!n.length)continue;let r=yo[t]={};for(let[i,o]of n){let a=`VencordPluginNative_${t}_${i}`;ur.ipcMain.handle(a,o),r[i]=a}}ur.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=yo});oe();u();function dr(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}Ue();var S=require("electron");u();var wo="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var se=require("fs"),be=require("fs/promises"),Co=require("os"),un=require("path");u();oe();Ue();var nt=require("electron");u();oe();var pr=require("electron"),Z=["connect-src"],G=[...Z,"img-src"],xo=["style-src","font-src"],bo=[...G,"media-src"],I=[...G,...xo],So=[...I,"script-src","worker-src"],hr={"http://localhost:*":I,"http://127.0.0.1:*":I,"localhost:*":I,"127.0.0.1:*":I,"*.github.io":I,"github.com":I,"raw.githubusercontent.com":I,"*.gitlab.io":I,"gitlab.com":I,"*.codeberg.page":I,"codeberg.org":I,"*.githack.com":I,"jsdelivr.net":I,"fonts.googleapis.com":xo,"i.imgur.com":G,"i.ibb.co":G,"i.pinimg.com":G,"files.catbox.moe":I,"cdn.discordapp.com":I,"media.discordapp.net":G,"cdnjs.cloudflare.com":So,"cdn.jsdelivr.net":So,"api.github.com":Z,"ws.audioscrobbler.com":Z,"musicbrainz.org":Z,"*.listenbrainz.org":Z,"coverartarchive.org":Z,"archive.org":Z,"*.archive.org":Z,"translate-pa.googleapis.com":Z,"*.vencord.dev":G,"manti.vendicated.dev":G,"decor.fieryflames.dev":Z,"ugc.decor.fieryflames.dev":G,"sponsor.ajay.app":Z,"dearrow-thumb.ajay.app":G,"usrbg.is-hardly.online":G,"icons.duckduckgo.com":G,"*.tenor.com":bo,"*.tenor.co":bo},fr=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),Ql=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},ec=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),tc=t=>{let e=fr(t,"content-security-policy-report-only");e&&delete t[e];let n=fr(t,"content-security-policy");if(n){let r=Ql(t[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(J.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(hr))for(let s of a)i(s,o);t[n]=[ec(r)]}};function To(){pr.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&tc(t),e==="stylesheet")){let r=fr(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),pr.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function Eo(){nt.ipcMain.handle("VencordCspRemoveOverride",oc),nt.ipcMain.handle("VencordCspRequestAddOverride",ic),nt.ipcMain.handle("VencordCspIsDomainAllowed",ac)}function nc(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!I.includes(n)))}function rc(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Discord for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let a=e.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function ic(t,e,n,r){if(!nc(e,n))return"invalid";let i=new URL(e).host;if(i in J.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await nt.dialog.showMessageBox({...rc(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(J.store.customCspRules[i]=n,"ok"):"unchecked"}function oc(t,e){return e in J.store.customCspRules?(delete J.store.customCspRules[e],!0):!1}function ac(t,e,n){try{let r=new URL(e).host,i=hr[r]??J.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}u();var sc=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,lc=/^\\@/;function mr(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function ko(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function Po(t,e){if(!t)return mr(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return mr(e);let r={},i="",o="";for(let a of n.split(sc))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace(lc,"@");return r[i]=o.trim(),delete r[""],mr(e,r)}ze();u();var rt=require("path");function we(t,e){let n=(0,rt.normalize)(t+"/"),r=(0,rt.join)(t,e),i=(0,rt.normalize)(r);return i===(0,rt.normalize)(t)||i.startsWith(n)?i:null}u();var Io=require("electron");function Ao(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":Io.shell.openExternal(e)}return{action:"deny"}})}var cc=(0,un.join)(__dirname,"renderer.css");(0,se.mkdirSync)(pe,{recursive:!0});Eo();function Mo(){return(0,be.readFile)(We,"utf-8").catch(()=>"")}async function uc(){let t=await(0,be.readdir)(pe).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await Ro(n).then(ko).catch(()=>null);r!=null&&e.push(Po(r,n))}return e}function Ro(t){t=t.replace(/\?v=\d+$/,"");let e=we(pe,t);return e?(0,be.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}S.ipcMain.handle("VencordOpenQuickCss",()=>S.shell.openPath(We));S.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!Xr.includes(n))throw"Disallowed protocol.";S.shell.openExternal(e).catch(r=>console.error("[Vencord] Failed to open external link",e,r))});S.ipcMain.handle("VencordGetQuickCss",()=>Mo());S.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,se.writeFileSync)(We,e));S.ipcMain.handle("VencordGetThemesList",()=>uc());S.ipcMain.handle("VencordGetThemeData",(t,e)=>Ro(e));S.ipcMain.handle("VencordGetThemeSystemValues",()=>{let t=S.systemPreferences.getAccentColor?.()??"";return t.length&&t[0]!=="#"&&(t=`#${t}`),{"os-accent-color":t}});S.ipcMain.handle("VencordOpenThemesFolder",()=>S.shell.openPath(pe));S.ipcMain.handle("VencordOpenSettingsFolder",()=>S.shell.openPath(Ee));var gr=[];S.ipcMain.handle("VencordInitFileWatchers",({sender:t})=>{gr.forEach(i=>i.close());let e,n;(0,be.open)(We,"a+").then(i=>{i.close(),e=(0,se.watch)(We,{persistent:!1},dr(async()=>{t.postMessage("VencordQuickCssUpdate",await Mo())},50))}).catch(()=>{});let r=(0,se.watch)(pe,{persistent:!1},dr(()=>{t.postMessage("VencordThemeUpdate",void 0)}));gr=[e,r,n].filter(Boolean),t.once("destroyed",()=>{e?.close(),r.close(),n?.close(),gr=[]})});S.ipcMain.on("VencordGetMonacoTheme",t=>{t.returnValue=S.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});S.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=S.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new S.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:S.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,un.join)(__dirname,"preload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});Ao(n),await n.loadURL(`data:text/html;base64,${wo}`)});S.ipcMain.handle("VencordGetRendererCss",()=>(0,be.readFile)(cc,"utf-8"));S.ipcMain.on("VencordPreloadGetRendererJs",t=>{t.returnValue=(0,se.readFileSync)((0,un.join)(__dirname,"renderer.js"),"utf-8")});S.ipcMain.on("VencordSupportsWindowsMaterial",t=>{t.returnValue=Number((0,Co.release)().split(".")[2])>=22621});var Le=require("electron"),oa=require("path"),Ir=require("url");oe();ze();u();var vn=require("electron");u();var Oo=require("module"),dc=(0,Oo.createRequire)("/"),it,pn,yr,pc=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{it=dc("worker_threads"),pn=it.Worker,yr=it.isMarkedAsUntransferable}catch{}var fc=pn?function(t,e,n,r,i){var o=!1,a=new pn(t+pc,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return yr&&(r=r.filter(function(s){return!yr(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,pn.prototype.terminate.call(a)},a}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},D=Uint8Array,Oe=Uint16Array,Lo=Int32Array,br=new D([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Sr=new D([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Vo=new D([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Fo=function(t,e){for(var n=new Oe(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new Lo(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},it=Fo(br,2),xr=it.b,hc=it.r;xr[28]=258,hc[258]=28;var No=Fo(Sr,0),$o=No.b,$d=No.r,mn=new Oe(32768);for(b=0;b<32768;++b)le=(b&43690)>>1|(b&21845)<<1,le=(le&52428)>>2|(le&13107)<<2,le=(le&61680)>>4|(le&3855)<<4,mn[b]=((le&65280)>>8|(le&255)<<8)>>1;var le,b,ot=(function(t,e,n){for(var r=t.length,i=0,o=new Oe(e);i<r;++i)t[i]&&++o[t[i]-1];var a=new Oe(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new Oe(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var p=i<<4|t[i],f=e-t[i],h=a[t[i]-1]++<<f,w=h|(1<<f)-1;h<=w;++h)s[mn[h]>>l]=p}else for(s=new Oe(r),i=0;i<r;++i)t[i]&&(s[i]=mn[a[t[i]-1]++]>>15-t[i]);return s}),Vt=new D(288);for(b=0;b<144;++b)Vt[b]=8;var b;for(b=144;b<256;++b)Vt[b]=9;var b;for(b=256;b<280;++b)Vt[b]=7;var b;for(b=280;b<288;++b)Vt[b]=8;var b,Uo=new D(32);for(b=0;b<32;++b)Uo[b]=5;var b;var Go=ot(Vt,9,1);var Wo=ot(Uo,5,1),fn=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},W=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},hn=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},zo=function(t){return(t+7)/8|0},gn=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new D(t.subarray(e,n))};var Bo=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],C=function(t,e,n){var r=new Error(e||Bo[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,C),!n)throw r;return r},jo=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new D(0);var a=!n,s=a||e.i!=2,l=e.i;a&&(n=new D(i*3));var p=function(Dr){var Or=n.length;if(Dr>Or){var Lr=new D(Math.max(Or*2,Dr));Lr.set(n),n=Lr}},f=e.f||0,h=e.p||0,w=e.b||0,m=e.l,E=e.d,x=e.m,k=e.n,O=i*8;do{if(!m){f=W(t,h,1);var ce=W(t,h+1,3);if(h+=3,ce)if(ce==1)m=Go,E=Wo,x=9,k=5;else if(ce==2){var at=W(t,h,31)+257,Ft=W(t,h+10,15)+4,xe=at+W(t,h+5,31)+1;h+=14;for(var N=new D(xe),Fe=new D(19),A=0;A<Ft;++A)Fe[Vo[A]]=W(t,h+A*3,7);h+=Ft*3;for(var st=fn(Fe),aa=(1<<st)-1,sa=ot(Fe,st,1),A=0;A<xe;){var Ar=sa[W(t,h,aa)];h+=Ar&15;var M=Ar>>4;if(M<16)N[A++]=M;else{var Ne=0,Nt=0;for(M==16?(Nt=3+W(t,h,3),h+=2,Ne=N[A-1]):M==17?(Nt=3+W(t,h,7),h+=3):M==18&&(Nt=11+W(t,h,127),h+=7);Nt--;)N[A++]=Ne}}var Cr=N.subarray(0,at),ue=N.subarray(at);x=fn(Cr),k=fn(ue),m=ot(Cr,x,1),E=ot(ue,k,1)}else C(1);else{var M=zo(h)+4,ie=t[M-4]|t[M-3]<<8,Ve=M+ie;if(Ve>i){l&&C(0);break}s&&p(w+ie),n.set(t.subarray(M,Ve),w),e.b=w+=ie,e.p=h=Ve*8,e.f=f;continue}if(h>O){l&&C(0);break}}s&&p(w+131072);for(var la=(1<<x)-1,ca=(1<<k)-1,yn=h;;yn=h){var Ne=m[hn(t,h)&la],$e=Ne>>4;if(h+=Ne&15,h>O){l&&C(0);break}if(Ne||C(2),$e<256)n[w++]=$e;else if($e==256){yn=h,m=null;break}else{var Mr=$e-254;if($e>264){var A=$e-257,lt=br[A];Mr=W(t,h,(1<<lt)-1)+xr[A],h+=lt}var wn=E[hn(t,h)&ca],bn=wn>>4;wn||C(3),h+=wn&15;var ue=$o[bn];if(bn>3){var lt=Sr[bn];ue+=hn(t,h)&(1<<lt)-1,h+=lt}if(h>O){l&&C(0);break}s&&p(w+131072);var Rr=w+Mr;if(w<ue){var _r=o-ue,ua=Math.min(ue,Rr);for(_r+w<0&&C(3);w<ua;++w)n[w]=r[_r+w]}for(;w<Rr;++w)n[w]=n[w-ue]}}e.l=m,e.p=yn,e.b=w,e.f=f,m&&(f=1,e.m=x,e.d=E,e.n=k)}while(!f);return w!=n.length&&a?gn(n,0,w):n.subarray(0,w)};var mc=new D(0);var gc=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},_o=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){e+=";"+l+"=";var p=s.toString();if(s.prototype)if(p.indexOf("[native code]")!=-1){var f=p.indexOf(" ",8)+1;e+=p.slice(f,p.indexOf("(",f))}else{e+=p;for(var h in s.prototype)e+=";"+l+".prototype."+h+"="+s.prototype[h].toString()}else e+=p}else n[l]=s}return e},dn=[],vc=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},yc=function(t,e,n,r){if(!dn[n]){for(var i="",o={},a=t.length-1,s=0;s<a;++s)i=_o(t[s],i,o);dn[n]={c:_o(t[a],i,o),e:o}}var l=gc({},dn[n].e);return fc(dn[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,vc(l),r)},wc=function(){return[D,Oe,Lo,br,Sr,Vo,xr,$o,Go,Wo,mn,Bo,ot,fn,W,hn,zo,gn,C,jo,Tr,Ho,Ko]};var Ho=function(t){return postMessage(t,[t.buffer])},Ko=function(t){return t&&{out:t.size&&new D(t.size),dictionary:t.dictionary}},bc=function(t,e,n,r,i,o){var a=yc(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([t,e],e.consume?[t.buffer]:[]),function(){a.terminate()}};var te=function(t,e){return t[e]|t[e+1]<<8},z=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},vr=function(t,e){return z(t,e)+z(t,e+4)*4294967296};function Sc(t,e,n){return n||(n=e,e={}),typeof n!="function"&&C(7),bc(t,e,[wc],function(r){return Ho(Tr(r.data[0],Ko(r.data[1])))},1,n)}function Tr(t,e){return jo(t,{i:2},e&&e.out,e&&e.dictionary)}var wr=typeof TextDecoder<"u"&&new TextDecoder,xc=0;try{wr.decode(mc,{stream:!0}),xc=1}catch{}var Tc=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:gn(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function Ec(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(wr)return wr.decode(t);var i=Tc(t),o=i.s,n=i.r;return n.length&&C(8),o}}var kc=function(t,e){return e+30+te(t,e+26)+te(t,e+28)},Pc=function(t,e,n){var r=te(t,e+28),i=te(t,e+30),o=Ec(t.subarray(e+46,e+46+r),!(te(t,e+8)&2048)),a=e+46+r,s=Ic(t,a,i,n,z(t,e+20),z(t,e+24),z(t,e+42)),l=s[0],p=s[1],f=s[2];return[te(t,e+10),l,p,o,a+i+te(t,e+32),f]},Ic=function(t,e,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,p=a==4294967295,f=e+n,h=s+l+p;if(r&&h){for(;e+4<f;e+=4+te(t,e+2))if(te(t,e)==1)return[s?vr(t,e+4+8*l):i,l?vr(t,e+4):o,p?vr(t,e+4+8*(l+s)):a,1];r<2&&C(13)}return[i,o,a,0]};var Do=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function Zo(t,e,n){n||(n=e,e={}),typeof n!="function"&&C(7);var r=[],i=function(){for(var k=0;k<r.length;++k)r[k]()},o={},a=function(k,O){Do(function(){n(k,O)})};Do(function(){a=n});for(var s=t.length-22;z(t,s)!=101010256;--s)if(!s||t.length-s>65558)return a(C(13,0,1),null),i;var l=te(t,s+8);if(l){var p=l,f=z(t,s+16),h=z(t,s-20)==117853008;if(h){var w=z(t,s-12);h=z(t,w)==101075792,h&&(p=l=z(t,w+32),f=z(t,w+48))}for(var m=e&&e.filter,E=function(k){var O=Pc(t,f,h),ce=O[0],M=O[1],ie=O[2],Ve=O[3],at=O[4],Ft=O[5],xe=kc(t,Ft);f=at;var N=function(A,st){A?(i(),a(A,null)):(st&&(o[Ve]=st),--l||a(null,o))};if(!m||m({name:Ve,size:M,originalSize:ie,compression:ce}))if(!ce)N(null,gn(t,xe,xe+M));else if(ce==8){var Fe=t.subarray(xe,xe+M);if(ie<524288||M>.8*ie)try{N(null,Tr(Fe,{out:new D(ie)}))}catch(A){N(A,null)}else r.push(Sc(Fe,{size:ie},N))}else N(C(14,"unknown compression type "+ce,1),null);else N(null,null)},x=0;x<p;++x)E(x)}else a(null,{});return i}var Jo=require("fs"),ne=require("fs/promises"),Er=require("path");ze();u();function qo(t){function e(a,s,l,p){let f=0;return f+=a<<0,f+=s<<8,f+=l<<16,f+=p<<24>>>0,f}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let a=e(t[8],t[9],t[10],t[11]),s=e(t[12],t[13],t[14],t[15]),l=16+a+s;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}u();var Ac=require("original-fs");async function Cc(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function Yo(t,e){let r=await(await Cc(t,e)).arrayBuffer();return Buffer.from(r)}var Mc=(0,Er.join)(Gt,"ExtensionCache");async function Rc(t,e){return await(0,ne.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{Zo(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let h=we(e,a);if(!h)throw new Error(`Path traversal detected: "${a}"`);return void await(0,ne.mkdir)(h,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),p=we(e,l);if(!p)throw new Error(`Path traversal detected: "${a}"`);let f=we(e,a);if(!f)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,ne.mkdir)(p,{recursive:!0}),await(0,ne.writeFile)(f,o[a])})).then(()=>n()).catch(a=>{(0,ne.rm)(e,{recursive:!0,force:!0}),r(a)})})})}async function Xo(t){let e=(0,Er.join)(Mc,t);try{await(0,ne.access)(e,Jo.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await Yo(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await Rc(qo(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}vn.session.defaultSession.extensions?vn.session.defaultSession.extensions.loadExtension(e):vn.session.defaultSession.loadExtension(e)}Wt||Le.app.whenReady().then(()=>{Le.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=we(pe,n);return r?Le.net.fetch((0,Ir.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return Le.net.fetch((0,Ir.pathToFileURL)((0,oa.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{R.store.enableReactDevtools&&Xo("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}To()});ia();
//# sourceURL=file:///VencordPatcher
//# sourceMappingURL=vencord://patcher.js.map
/*! For license information please see patcher.js.LEGAL.txt */

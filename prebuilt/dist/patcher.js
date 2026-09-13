// Vencord ef29bbe
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var Go=Object.create;var Rt=Object.defineProperty;var $o=Object.getOwnPropertyDescriptor;var Wo=Object.getOwnPropertyNames;var zo=Object.getPrototypeOf,Bo=Object.prototype.hasOwnProperty;var W=(t,e,n)=>()=>{if(n)throw n[0];try{return t&&(e=t(t=0)),e}catch(r){throw n=[r],r}};var be=(t,e)=>{for(var n in e)Rt(t,n,{get:e[n],enumerable:!0})},wr=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Wo(e))!Bo.call(t,i)&&i!==n&&Rt(t,i,{get:()=>e[i],enumerable:!(r=$o(e,i))||r.enumerable});return t};var br=(t,e,n)=>(n=t!=null?Go(zo(t)):{},wr(e||!t||!t.__esModule?Rt(n,"default",{value:t,enumerable:!0}):n,t)),dn=t=>wr(Rt({},"__esModule",{value:!0}),t);var c=W(()=>{"use strict"});var Le=W(()=>{"use strict";c()});function it(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var Sr=W(()=>{"use strict";c()});var qo={};function Ve(...t){let e={cwd:Tr};return fn?pn("flatpak-spawn",["--host","git",...t],e):pn("git",t,e)}async function jo(){return(await Ve("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function Ho(){await Ve("fetch");let t=(await Ve("branch","--show-current")).stdout.trim();if(!((await Ve("ls-remote","origin",t)).stdout.length>0))return[];let r=(await Ve("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function Ko(){return(await Ve("pull")).stdout.includes("Fast-forward")}async function Zo(){return!(await pn(fn?"flatpak-spawn":"node",fn?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:Tr})).stderr.includes("Build failed")}var xr,ot,kr,Er,Tr,pn,fn,Ir=W(()=>{"use strict";c();Le();xr=require("child_process"),ot=require("electron"),kr=require("path"),Er=require("util");Sr();Tr=(0,kr.join)(__dirname,".."),pn=(0,Er.promisify)(xr.execFile),fn=!1;ot.ipcMain.handle("VencordGetRepo",it(jo));ot.ipcMain.handle("VencordGetUpdates",it(Ho));ot.ipcMain.handle("VencordUpdate",it(Ko));ot.ipcMain.handle("VencordBuild",it(Zo))});var yn,_r,at,Dr=W(()=>{"use strict";c();yn=Symbol("SettingsStore.isProxy"),_r=Symbol("SettingsStore.getRawTarget"),at=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===yn)return!0;if(r===_r)return n;let o=Reflect.get(n,r,i),a=e.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[yn]){let h=`${l}${l&&"."}${r}`;return e.makeProxy(o,s,h)}return o},set(n,r,i){if(i?.[yn]&&(i=i[_r]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return e.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return e.notifyListeners(s,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyPrefixListeners(e,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,e))}}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,h)=>l[h],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n)),this.notifyPrefixListeners(e,i,n)}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}addPrefixChangeListener(e,n){let r=this.prefixListeners.get(e)??new Set;r.add(n),this.prefixListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}removePrefixChangeListener(e,n){let r=this.prefixListeners.get(e);r&&(r.delete(n),r.size||this.prefixListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}}});function wn(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},wn(t[n],r)):t[n]??=r}return t}var Or=W(()=>{"use strict";c()});var Lr,ce,_t,Se,ue,Fe,bn,Sn,Vr,Dt,Ne=W(()=>{"use strict";c();Lr=require("electron"),ce=require("path"),_t=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,ce.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,ce.join)(Lr.app.getPath("userData"),"..","Vencord")),Se=(0,ce.join)(_t,"settings"),ue=(0,ce.join)(_t,"themes"),Fe=(0,ce.join)(Se,"quickCss.css"),bn=(0,ce.join)(Se,"settings.json"),Sn=(0,ce.join)(Se,"native-settings.json"),Vr=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"],Dt=process.argv.includes("--vanilla")});function Fr(t,e){try{return JSON.parse((0,xe.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var xn,xe,C,Qo,Nr,K,te=W(()=>{"use strict";c();Le();Dr();Or();xn=require("electron"),xe=require("fs");Ne();(0,xe.mkdirSync)(Se,{recursive:!0});C=new at(Fr("renderer",bn));C.addGlobalChangeListener(()=>{try{(0,xe.writeFileSync)(bn,JSON.stringify(C.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});xn.ipcMain.on("VencordGetSettings",t=>t.returnValue=C.plain);xn.ipcMain.handle("VencordSetSettings",(t,e,n)=>{C.setData(e,n)});Qo={plugins:{},customCspRules:{}},Nr=Fr("native",Sn);wn(Nr,Qo);K=new at(Nr);K.addGlobalChangeListener(()=>{try{(0,xe.writeFileSync)(Sn,JSON.stringify(K.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}})});function Co(t,e,n){let r=e;if(e in t)return void n(t[r]);Object.defineProperty(t,e,{set(i){delete t[r],t[r]=i,n(i)},configurable:!0,enumerable:!1})}var Ro=W(()=>{"use strict";c()});var Xl={};function Yl(t,e){let n=t.slice(4).split(".").map(Number),r=e.slice(4).split(".").map(Number);for(let i=0;i<r.length;i++){if(n[i]>r[i])return!0;if(n[i]<r[i])return!1}return!1}function Jl(){if(!process.env.DISABLE_UPDATER_AUTO_PATCHING)try{let t=(0,H.dirname)(process.execPath),e=(0,H.basename)(t),n=(0,H.join)(t,".."),r=(0,X.readdirSync)(n).reduce((h,d)=>d.startsWith("app-")&&Yl(d,h)?d:h,e);if(r===e)return;let i=(0,H.join)(n,e,"resources"),o=(0,H.join)(i,"app.asar"),a=(0,H.join)(n,r,"resources"),s=(0,H.join)(a,"app.asar"),l=(0,H.join)(a,"_app.asar");if(!(0,X.existsSync)(o)||!(0,X.existsSync)(s)||(0,X.existsSync)(l))return;console.info(`[Vencord] Detected Host Update (${e} -> ${r}). Repatching...`),(0,X.renameSync)(s,l),(0,X.copyFileSync)(o,s)}catch(t){console.error("[Vencord] Failed to repatch latest host update",t)}}var Mo,X,H,_o=W(()=>{"use strict";c();Mo=require("electron"),X=require("original-fs"),H=require("path");Mo.app.on("before-quit",Jl)});var nc={};var P,ye,Ql,ec,cr,tc,Do=W(()=>{"use strict";c();Ro();P=br(require("electron")),ye=require("path");te();Ne();console.log("[Vencord] Starting up...");Ql=require.main.filename,ec=require.main.path.endsWith("app.asar")?"_app.asar":"app.asar",cr=(0,ye.join)((0,ye.dirname)(Ql),"..",ec),tc=require((0,ye.join)(cr,"package.json"));require.main.filename=(0,ye.join)(cr,tc.main);P.app.setAppPath(cr);if(Dt)console.log("[Vencord] Running in vanilla mode. Not loading Vencord");else{let t=C.store;if(_o(),t.winCtrlQ){let i=P.Menu.buildFromTemplate;P.Menu.buildFromTemplate=function(o){if(o[0]?.label==="&File"){let{submenu:a}=o[0];Array.isArray(a)&&a.push({label:"Quit (Hidden)",visible:!1,acceleratorWorksWhenHidden:!0,accelerator:"Control+Q",click:()=>P.app.quit()})}return i.call(this,o)}}class e extends P.default.BrowserWindow{constructor(o){if(!o?.webPreferences?.preload||!o.title){super(o);return}let{frameless:a,winNativeTitleBar:s,disableMinSize:l,transparent:h,macosVibrancyStyle:d,windowsMaterial:u}=t,y=o.webPreferences.preload;o.webPreferences.preload=(0,ye.join)(__dirname,"preload.js"),o.webPreferences.sandbox=!1,o.webPreferences.backgroundThrottling=!1,a?o.frame=!1:s&&delete o.frame,l&&(o.minWidth=0,o.minHeight=0),h&&(o.transparent=!0,o.backgroundColor="#00000000"),u&&u!=="none"&&(o.backgroundMaterial=u,o.backgroundColor="#00000000"),process.env.DISCORD_PRELOAD=y,super(o),l&&(this.setMinimumSize=(E,ae)=>{})}}Object.assign(e,P.default.BrowserWindow),Object.defineProperty(e,"name",{value:"BrowserWindow",configurable:!0});let n=require.resolve("electron");delete require.cache[n].exports,require.cache[n].exports={...P.default,BrowserWindow:e},Co(global,"appSettings",i=>{i.set("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING",!0)}),process.env.DATA_DIR=(0,ye.join)(P.app.getPath("userData"),"..","Vencord");let r=P.app.commandLine.appendSwitch;P.app.commandLine.appendSwitch=function(...i){if(i[0]==="disable-features"){let o=new Set((i[1]??"").split(","));o.add("UseEcoQoSForBackgroundProcess"),i[1]+=[...o].join(",")}return r.apply(this,i)},P.app.commandLine.appendSwitch("disable-renderer-backgrounding"),P.app.commandLine.appendSwitch("disable-background-timer-throttling"),P.app.commandLine.appendSwitch("disable-backgrounding-occluded-windows")}console.log("[Vencord] Loading original Discord app.asar");require(require.main.filename)});c();c();c();Ir();c();Le();var Zn=require("electron");c();var gn={};be(gn,{fetchTrackData:()=>Jo});c();c();c();var Pr="ef29bbe";c();var hn="Vendicated/Vencord";var Ar=`Vencord/${Pr}${hn?` (https://github.com/${hn})`:""}`;var Cr=require("child_process"),Rr=require("util"),Mr=(0,Rr.promisify)(Cr.execFile);async function mn(t){let{stdout:e}=await Mr("osascript",t.map(n=>["-e",n]).flat());return e}var z=null;async function Yo({id:t,name:e,artist:n,album:r}){if(t===z?.id){if("data"in z)return z.data;if("failures"in z&&z.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":Ar}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return z={id:t,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},z.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),z={id:t,failures:(t===z?.id&&"failures"in z?z.failures:0)+1},null}}async function Jo(){try{await Mr("pgrep",["^Music$"])}catch{return null}if(await mn(['tell application "Music"',"get player state","end tell"]).then(d=>d.trim())!=="playing")return null;let e=await mn(['tell application "Music"',"get player position","end tell"]).then(d=>Number.parseFloat(d.trim())),n=await mn(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(d=>!!d),l=Number.parseFloat(s),h=await Yo({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:e,duration:l,...h}}var vn={};be(vn,{initDevtoolsOpenEagerLoad:()=>Xo});c();function Xo(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var Gr={};c();te();var Lt=require("electron"),Ot=[];function Ur(){let t=[];for(let e=Ot.length-1;e>=0;e--){let{processId:n,routingId:r}=Ot[e],i=Lt.webFrameMain.fromId(n,r);if(!i){Ot.splice(e,1);continue}t.push(i)}return t}Lt.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){Ur();let{routingId:i,processId:o}=r;Ot.push({routingId:i,processId:o});let a=C.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});C.addChangeListener("plugins.FixSpotifyEmbeds.volume",t=>{try{Ur().forEach(e=>e.executeJavaScript(`globalThis._vcVolume = ${t/100}`))}catch(e){console.error("FixSpotifyEmbeds: Failed to update volume",e)}});var Wr={};c();te();var $r=require("electron");$r.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!C.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var kn={};be(kn,{resolveRedirect:()=>ta});c();var zr=require("https"),ea=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function Br(t){return new Promise((e,n)=>{let r=(0,zr.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?Br(i.headers.location):t)});r.on("error",n),r.end()})}async function ta(t,e){return ea.test(e)?Br(e):e}var En={};be(En,{makeDeeplTranslateRequest:()=>na,makeKagiTranslateRequest:()=>ra});c();async function na(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function ra(t,e,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${e}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var Tn={};be(Tn,{readRecording:()=>ia});c();var jr=require("electron"),Vt=require("fs/promises"),st=require("path");async function ia(t,e){e=(0,st.normalize)(e);let n=(0,st.basename)(e),r=(0,st.normalize)(jr.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!e.startsWith(r))return null;try{let i=await(0,Vt.readFile)(e);return(0,Vt.rm)(e).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var In={};be(In,{closeSocket:()=>aa,sendToOverlay:()=>oa});c();var Hr=require("dgram"),Ft=null;function oa(t,e){e.messageType=e.type;let n=JSON.stringify(e);Ft??=(0,Hr.createSocket)("udp4"),Ft.send(n,42069,"127.0.0.1")}function aa(){Ft?.close(),Ft=null}var Zr={};c();te();var Kr=require("electron");c();var Pn=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;Kr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{C.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(Pn):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(Pn))})})});var Kn={};be(Kn,{answerOverlayAction:()=>sl,armDisplayMedia:()=>_s,checkUpdate:()=>fl,closeStudioOverlay:()=>rl,deleteClip:()=>us,disarmDisplayMedia:()=>Ds,downloadUpdate:()=>ml,dropOverlayWaiters:()=>al,focusClient:()=>ll,gameFeedStatus:()=>Us,getActiveScreen:()=>Ms,getCaptureSources:()=>Cs,getClipDirectory:()=>Ts,getMemoryReport:()=>Rs,getPlatformInfo:()=>As,hideClipOverlay:()=>Xs,hideVrPanel:()=>Hs,listClips:()=>ls,notifyClipSaved:()=>Js,openClipDirectory:()=>Ps,openStudioOverlay:()=>nl,openVrBindings:()=>Bs,pickAudioFiles:()=>vs,pickClipDirectory:()=>Is,pickImageFiles:()=>bs,pickVideoFiles:()=>hs,readAudioFile:()=>ws,readClip:()=>cs,readImageFile:()=>ks,readLibrary:()=>ps,readVideoFile:()=>gs,readVoiceTrack:()=>as,registerShortcuts:()=>Ls,relaunchClient:()=>gl,renameClip:()=>ds,reserveClipPath:()=>ns,revealClip:()=>Es,saveClip:()=>ts,saveVoiceTrack:()=>os,showClipOverlay:()=>Ys,showVrPanel:()=>js,startGameFeeds:()=>Fs,startVoiceCapture:()=>Xa,startVrBridge:()=>$s,stopGameFeeds:()=>Ns,stopVoiceCapture:()=>Qa,stopVrBridge:()=>Ws,studioOverlayUp:()=>il,unregisterShortcuts:()=>Hn,voiceCaptureStatus:()=>es,vrBridgeStatus:()=>zs,waitForGameEvent:()=>Gs,waitForOverlayAction:()=>ol,waitForShortcut:()=>Vs,waitForVrEvent:()=>Ks,writeLibrary:()=>fs});c();var Vi=require("crypto"),Fi=require("child_process"),v=require("electron"),p=require("fs"),Ni=require("https"),f=require("path");c();var B=require("fs"),Jr=require("http"),Xr=require("https"),Qr=require("os"),ft=require("path"),qr=34765,sa=6,ei=256*1024,la=2e3,ca=1500,ua="127.0.0.1",da=2999,pa="gamestate_integration_clipper.cfg",de=null,Ge=0,Ut="",$e=null,dt=[],fa=12,pt=[],We=[],ze={cs2:!1,league:!1};function Gt(t){dt.length>=fa||dt.includes(t)||dt.push(t)}var $t=Promise.resolve();function lt(t){let e=We.shift();if(e){e(t);return}pt.push(t),pt.length>16&&pt.shift()}var S={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function ti(){S={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function ha(t){return t>=5?"an ace in Counter-Strike 2":t===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function ma(t){let e=t.provider?.steamid,{player:n}=t;if(!n||!e||!n.steamid||n.steamid!==e)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof t.map?.round=="number"?t.map.round:S.round;(r.kills<S.kills||r.deaths<S.deaths)&&ti();let o=S.kills<0;i!==S.round&&(S.round=i,S.roundKills=0,S.announced=0);let a=r.kills-Math.max(0,S.kills),s=r.deaths-Math.max(0,S.deaths);if(S.kills=r.kills,S.deaths=r.deaths,o)return;a>0&&(S.roundKills+=a,S.roundKills>=3&&S.roundKills>S.announced?(S.announced=S.roundKills,lt({kind:"multikill",note:ha(S.roundKills)})):lt({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&lt({kind:"death",note:"your death in Counter-Strike 2"});let l=t.round?.win_team;l&&n.team&&l===n.team&&t.round?.phase==="over"&&S.roundKills>0&&lt({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function ga(){return new Promise(t=>{let e=0,n=(0,Jr.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>ei&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{ma(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++e<sa){n.listen(qr+e,"127.0.0.1");return}Gt(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}de===n&&(de=null,Ge=0,ze={...ze,cs2:!1}),t(0)}),n.on("listening",()=>{de=n,t(n.address().port)}),n.listen(qr,"127.0.0.1")})}function va(){let t=[],e=(0,Qr.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&t.push((0,ft.join)(i,"Steam"))}let n=[];for(let r of t)if((0,B.existsSync)(r)){n.push(r);try{let i=(0,B.readFileSync)((0,ft.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function ya(){for(let t of va()){let e=(0,ft.join)(t,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,B.existsSync)(e))return e}return""}function wa(t){let e=ya();if(!e)return Gt("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,ft.join)(e,pa),r=`"Clipper"
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
`;try{return(0,B.mkdirSync)(e,{recursive:!0}),(0,B.writeFileSync)(n,r,"utf8"),n}catch(i){return Gt(`Counter-Strike 2's config could not be written (${i.message})`),""}}function ba(){let t=Ut;if(Ut="",!!t)try{(0,B.unlinkSync)(t)}catch{}}var ct="",Ue=-1,An=!1,Nt=!1;function ut(t){return t.split("#")[0].trim().toLowerCase()}function Yr(t){return new Promise(e=>{let n=(0,Xr.get)({host:ua,port:da,path:t,rejectUnauthorized:!1,timeout:ca},r=>{if(r.statusCode!==200){r.resume(),e(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>ei&&n.destroy()}),r.on("end",()=>{try{e(JSON.parse(i))}catch{e(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>e(null))})}function Sa(t,e){let n=t.EventName??"",r=ut(t.KillerName??"");switch(n){case"ChampionKill":return r===e?{kind:"kill",note:"a kill in League of Legends"}:ut(t.VictimName??"")===e?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==e?null:{kind:"multikill",note:`a ${t.KillStreak??3}-kill run in League of Legends`};case"Ace":return ut(t.Acer??"")!==e?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return ut(t.Recipient??"")!==e?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==e?null:{kind:"objective",note:`${t.DragonType?`the ${t.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==e?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==e?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==e?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function xa(){if(!Nt){Nt=!0;try{if(!ct){let r=await Yr("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;ct=ut(r),Ue=-1}let t=await Yr("/liveclientdata/eventdata");if(!t?.Events){ct="";return}let e=Ue<0,n=Ue;for(let r of t.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=Ue||(n=Math.max(n,i),e))continue;let o=Sa(r,ct);o&&lt(o)}Ue=n}finally{Nt=!1}}}function ka(){ct="",Ue=-1,Nt=!1,$e=setInterval(()=>{xa().catch(t=>{An||(An=!0,Gt(`League of Legends could not be read (${t.message})`))})},la)}function Ea(t){return t.cs2!==ze.cs2||t.league!==ze.league?!1:(!t.cs2||de!==null)&&(!t.league||$e!==null)}function ni(t){let e=$t.then(async()=>(Ea(t)||(ri(),dt=[],t.cs2&&(ti(),Ge=await ga(),Ge&&(Ut=wa(Ge))),t.league&&ka(),ze={cs2:t.cs2&&de!==null,league:t.league}),Wt()));return $t=e.catch(()=>{}),e}function ri(){if(ze={cs2:!1,league:!1},$e&&clearInterval($e),$e=null,An=!1,de)try{de.close()}catch{}de=null,Ge=0,ba(),pt=[];let t=We;We=[];for(let e of t)e(null)}function Cn(){let t=$t.then(()=>ri());return $t=t.catch(()=>{}),t}function Wt(){return{port:Ge,configPath:Ut,league:$e!==null,problems:[...dt]}}function ii(t){let e=pt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{We=We.filter(a=>a!==i),i(null)},t);We.push(i)})}c();var pe=require("electron"),jt=require("fs"),mt=require("path"),oi=require("url"),zt=24,ai=2600,Bt=220,Ta=300,Ia=56,Rn=!0;function Ht(){return Rn}var Te=null,ke=null,ht=null,Ee=null;function Pa(){return!!Te&&!Te.isDestroyed()}function Ie(){ke&&(clearTimeout(ke),ke=null);let t=Te;Te=null,t&&!t.isDestroyed()&&t.destroy()}function Be(){Ee&&(clearTimeout(Ee),Ee=null);let t=ht;ht=null,t&&!t.isDestroyed()&&t.destroy()}function Aa(t,e,n){let i=pe.screen.getDisplayNearestPoint(pe.screen.getCursorScreenPoint()).workArea,o=t==="top-left"||t==="bottom-left",a=t==="top-left"||t==="top-right";return{x:Math.round(o?i.x+zt:i.x+i.width-e-zt),y:Math.round(a?i.y+zt:i.y+i.height-n-zt)}}function gt(t,e){let n=(0,mt.join)(pe.app.getPath("userData"),"clipper-overlay");(0,jt.mkdirSync)(n,{recursive:!0});let r=(0,mt.join)(n,t);return(0,jt.writeFileSync)(r,e,"utf8"),r}function si(t,e,n,r){let{x:i,y:o}=Aa(r,e,n),a=new pe.BrowserWindow({width:e,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(t).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function li(t){return`<meta charset="utf-8">
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
</style>`}function Z(t){return JSON.stringify(t).replace(/</g,"\\u003c")}function Ca(t,e){return`<!doctype html>
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
    var look = ${Z(e)};
    var video = document.getElementById("video");
    var card = document.getElementById("card");
    document.getElementById("tag").textContent = ${Z((0,mt.basename)(t))};

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

    video.src = ${Z((0,oi.pathToFileURL)(t).href)};

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
${li(`.card {
        background: rgba(20, 21, 24, 0.92); display: flex; align-items: center; gap: 10px; padding: 0 14px;
        font: 12px/1.3 "gg sans", "Segoe UI", system-ui, sans-serif; color: #fff;
    }
    .dot { width: 9px; height: 9px; border-radius: 50%; background: #f23f43; flex: none; }
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
        setTimeout(function () { window.close(); }, ${Bt});
    }, ${ai});
</script>
</body>
</html>`}function ci(t,e){if(!Rn)return!1;Ie(),Be();let n=Math.max(200,Math.round(e.width)),r=Math.round(n*9/16),i=si(gt("clip.html",Ca(t,e)),n,r,e.corner);Te=i,i.on("closed",()=>{Te===i&&(Te=null,ke&&(clearTimeout(ke),ke=null))});let o=(e.seconds>0?e.seconds:300)+10;return ke=setTimeout(()=>Ie(),o*1e3),!0}function ui(t,e,n){if(!Rn||Pa())return!1;Be();let r=si(gt("toast.html",Ra(t,e)),Ta,Ia,n);return ht=r,r.on("closed",()=>{ht===r&&(ht=null,Ee&&(clearTimeout(Ee),Ee=null))}),Ee=setTimeout(()=>Be(),ai+4e3),!0}pe.app.on("will-quit",()=>{Ie(),Be()});c();var q=require("electron"),di=require("url");var Mn="VencordClipperOverlayAction",pi="VencordClipperOverlayReply",Ma=108,M=null;function _n(){return!!M&&!M.isDestroyed()}function yt(){let t=M;M=null,t&&!t.isDestroyed()&&t.destroy()}var je=[],vt=[];function _a(t){let e=je.shift();if(e){e(t);return}vt.push(t),vt.length>4&&vt.shift()}function fi(t){let e=vt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{je=je.filter(a=>a!==i),i(null)},t);je.push(i)})}function hi(){vt=[];let t=je;je=[];for(let e of t)e(null)}function mi(t){!M||M.isDestroyed()||M.webContents.send(pi,t)}q.ipcMain.removeAllListeners(Mn);q.ipcMain.on(Mn,(t,e,n)=>{if(!M||M.isDestroyed()||t.sender!==M.webContents)return;let r=String(e??"");if(r==="close"){yt();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open")return;let i=n??{},o=Number(i.from),a=Number(i.to);_a({kind:r,clip:String(i.clip??""),from:Number.isFinite(o)?Math.max(0,o):0,to:Number.isFinite(a)?Math.max(0,a):0})});function Da(t,e){let{workArea:n}=q.screen.getDisplayNearestPoint(q.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-t)/2),y:Math.round(n.y+(n.height-e)/2)}}var Oa=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${Z(Mn)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${Z(pi)}, (_event, reply) => handler(reply));
    }
});
`;function La(t,e){return`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; user-select: none; }
    .card {
        position: absolute; inset: 0; display: flex; flex-direction: column;
        border-radius: 12px; overflow: hidden; background: #101114;
        border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 14px 40px rgba(0, 0, 0, 0.7);
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
    .range { position: absolute; top: 8px; height: 6px; border-radius: 3px; background: #3c437e; }
    .played { position: absolute; top: 8px; height: 6px; border-radius: 3px; background: #5865f2; }
    .mark { position: absolute; top: 3px; width: 2px; height: 16px; margin-left: -1px; border-radius: 1px; background: #f0b132; }
    .handle {
        position: absolute; top: 1px; width: 8px; height: 20px; margin-left: -4px; border-radius: 3px;
        background: #f2f3f5; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.6); cursor: ew-resize;
    }
    .head { position: absolute; top: 0; width: 2px; height: 22px; margin-left: -1px; background: #fff; pointer-events: none; }
    .row { display: flex; align-items: center; gap: 6px; }
    .spacer { flex: 1 1 auto; }
    .time { font-variant-numeric: tabular-nums; opacity: 0.75; }
    button {
        font: inherit; color: #f2f3f5; background: #2b2d31; border: 0; border-radius: 6px;
        padding: 5px 10px; cursor: pointer;
    }
    button:hover { background: #3a3d44; }
    button:disabled { opacity: 0.4; cursor: default; }
    button.go { background: #5865f2; }
    button.go:hover { background: #4752c4; }
    button.danger:hover { background: #b5292d; }
    .status { min-height: 15px; font-size: 11px; opacity: 0.75; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .status.bad { color: #fa777c; opacity: 1; }
    /* Where the panels that come later - speed, volume, captions - mount. They
       speak the same channel, so nothing below them has to change. */
    .panels:empty { display: none; }
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
            <button data-do="in" title="I">In</button>
            <button data-do="out" title="O">Out</button>
            <button data-do="all">All</button>
            <span class="spacer"></span>
            <button class="go" data-do="cut">Cut</button>
            <button class="go" data-do="send">Send</button>
            <button class="danger" data-do="delete">Delete</button>
            <button data-do="open">Studio</button>
            <button data-do="close" title="Esc">Close</button>
        </div>
        <div class="status" id="status"></div>
    </div>
</div>
<script>
    var clip = ${Z({name:t.name,url:(0,di.pathToFileURL)(t.path).href,markers:t.markers})};
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
</html>`}function gi(t,e){if(!Ht())return!1;yt(),Ie(),Be();let n=Math.max(360,Math.round(e.width)),r=Math.round(n*9/16)+Ma,{x:i,y:o}=Da(n,r),a=gt("studio-preload.js",Oa),s=gt("studio.html",La(t,e)),l=new q.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return M=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{M===l&&(M=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}q.app.on("will-quit",()=>yt());c();function wt(t){return`${t.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}c();var Ti=require("child_process"),Ii=require("electron"),Fn=require("fs"),Et=require("path");c();var Va=`
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
         * process and a C# compile. Fifty ticks is one second of the loop
         * below: long enough that a hiccup is not mistaken for a shutdown.
         */
        private const int RetrySeconds = 5;
        private const int LostLimit = 50;

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

                        Say("{\\"t\\":\\"motion\\",\\"hands\\":" + Num(hands) + ",\\"head\\":" + Num(turn) + "}");
                    }

                    Thread.Sleep(20);
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

try {
    Add-Type -TypeDefinition $source -Language CSharp
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
`;c();var wi=require("electron"),N=require("fs"),F=require("path"),Kt="vencord.clipper",fe="/actions/clipper",bt=["save","mark","toggle","pov"],Fa=["save","mark"],Na={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function Dn(){let t=(0,F.join)(wi.app.getPath("userData"),"clipper-vr");return(0,N.mkdirSync)(t,{recursive:!0}),t}function Ua(){let t=(0,F.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,N.readFileSync)(t,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,N.existsSync)((0,F.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let e=(0,F.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,N.existsSync)((0,F.join)(e,"bin","win64","openvr_api.dll"))?e:null}function bi(){let t=Ua();return t&&(0,F.join)(t,"bin","win64","openvr_api.dll")}var Ga=.4,$a={save:"double",mark:"long"};function Wa(t,e,n){return{path:t,mode:"button",inputs:{[e]:{output:`${fe}/in/${n}`}},parameters:e==="long"?{long_press_delay:Ga}:{}}}function yi(t,e){return{app_key:Kt,controller_type:t,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[fe]:{sources:Fa.map(n=>Wa(e[n],$a[n],n))}}}}function Si(){let t=Dn(),e={language_tag:"en_US",[fe]:"Clipper"};for(let o of bt)e[`${fe}/in/${o}`]=Na[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:fe,usage:"leftright"}],actions:bt.map(o=>({name:`${fe}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[e]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,N.writeFileSync)((0,F.join)(t,"bindings_knuckles.json"),JSON.stringify(yi("knuckles",r),null,4),"utf8"),(0,N.writeFileSync)((0,F.join)(t,"bindings_oculus_touch.json"),JSON.stringify(yi("oculus_touch",r),null,4),"utf8");let i=(0,F.join)(t,"actions.json");return(0,N.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function xi(t){let e={source:"builtin",applications:[{app_key:Kt,launch_type:"binary",binary_path_windows:t,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,F.join)(Dn(),"clipper.vrmanifest");return(0,N.writeFileSync)(n,JSON.stringify(e,null,4),"utf8"),n}function On(){return(0,F.join)(Dn(),"bridge.ps1")}var za=15e3,Ba=45e3,ki=3,ja=3,Ha=2e3,D=null,kt=!1,ne="",_="",Pe="",Ae=!1,Vn=0,Pi=0,He=null,St=[],xt=null,he=[],Zt=Promise.resolve();function Ei(t){let e=he.shift();if(e){e(t);return}if(t.kind==="motion"){xt=t;return}St.push(t.action),St.length>8&&St.shift()}function Ka(t){let e=t.trim();if(!e.startsWith("{"))return!1;let n;try{n=JSON.parse(e)}catch{return!1}if(n.t==="ready")return ne=String(n.runtime??""),_="",Pe="",Ae=!1,!0;if(n.t==="waiting")return ne="",_="",Pe=String(n.reason??""),!0;if(n.t==="warning")return _=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return _=String(n.message??"The SteamVR bridge failed for a reason it did not give"),Ae=!ne||++Pi>=ja,!0;if(n.t==="action"){let r=bt.find(i=>i===n.name);return r&&Ei({kind:"action",action:r}),!1}return n.t==="motion"&&Ei({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function Ln(){He||!kt||Ae||(He=setTimeout(()=>{He=null,kt&&Ai()},za))}function Ai(){if(D)return Promise.resolve();let t=bi();if(!t)return Ln(),Promise.resolve();let e;try{let n=On();(0,Fn.writeFileSync)(n,vi,"utf8");let r=(0,Et.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");e=(0,Ti.spawn)(r,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",t,"-Actions",Si(),"-Manifest",xi(r),"-AppKey",Kt,"-ActionList",[fe,...bt].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return _=`The SteamVR bridge could not be started (${n.message}).`,Ln(),Promise.resolve()}return D=e,ne="",Pe="",Ae=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{_="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},Ba),a="";e.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let h of l)Ka(h)&&i()}),e.stderr?.on("data",s=>{_||(_=s.toString("utf8").trim().slice(0,300))}),e.on("error",s=>{_=`The SteamVR bridge could not be started (${s.message}).`,i()}),e.on("exit",()=>{D===e&&(!ne&&!Pe&&!Ae?++Vn>=ki&&(Ae=!0,_||(_=`The SteamVR bridge stopped ${ki} times without saying why. Switch the VR controls off and on again to try it once more.`)):Vn=0,D=null,ne="",Pe="");let s=he;he=[];for(let l of s)l(null);i(),Ln()})})}function Ci(){He&&(clearTimeout(He),He=null);let t=D;D=null,ne="",Pe="",Ae=!1,Vn=0,Pi=0,St=[],xt=null;let e=he;he=[];for(let r of e)r(null);if(!t)return;try{t.stdin?.end()}catch{}let n=setTimeout(()=>{try{t.kill()}catch{}},Ha);t.on("exit",()=>clearTimeout(n))}function Ri(t){let e=Zt.then(async()=>(kt=t,t?(await Ai(),qt()):(Ci(),_="",qt())));return Zt=e.catch(()=>{}),e}function Nn(){let t=Zt.then(()=>{kt=!1,Ci()});return Zt=t.catch(()=>{}),t}function qt(){return{running:D!==null&&ne!=="",wanted:kt,runtime:ne,problem:_,waiting:Pe}}function Mi(){if(!D?.stdin?.writable)return!1;try{return D.stdin.write(`bindings
`),!0}catch{return!1}}var Za=0;function _i(t,e,n,r){if(!D?.stdin?.writable||e<=0||n<=0||t.length!==e*n*4)return!1;let i=(0,Et.join)((0,Et.dirname)(On()),`panel-${Za++%8}.rgba`);try{return(0,Fn.writeFileSync)(i,t),D.stdin.write(`panel ${e} ${n} ${Math.round(r)} ${i}
`),!0}catch{return!1}}function Di(){if(!D?.stdin?.writable)return!1;try{return D.stdin.write(`panelhide
`),!0}catch{return!1}}function Oi(t=3e4){let e=St.shift();if(e)return Promise.resolve({kind:"action",action:e});if(xt){let n=xt;return xt=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{he=he.filter(a=>a!==i),i(null)},t);he.push(i)})}Ii.app.on("will-quit",()=>{Nn()});var Ui=!0,Bn=!1,Gi=/vesktop|equibop/i.test(v.app.getName());function qa(){let t=[(0,f.join)(__dirname,"..","..","..","..","rust-voice-capture","target","release","discord-voice-capture"),(0,f.join)(__dirname,"..","..","discord-voice-capture"),(0,f.join)(process.resourcesPath??"","discord-voice-capture")];for(let e of t)if((0,p.existsSync)(e))return e;return null}var re=null,Yt=null,Un=null;function Ya(){v.session.defaultSession.webRequest.onBeforeSendHeaders({urls:["https://*.discord.com/api/*"]},t=>{if(Un==null)for(let e of t.requestHeaders?.Authorization??[]){let n=Array.isArray(e)?e[0]:e,r=String(n??"");r.length>8&&!r.includes("*")&&(Un=r)}})}var Li=!1;function Ja(){Li||(Li=!0,Ya())}function Xa(t,e){if(re&&re.exitCode===null)return{started:!1,error:"already running"};let n=qa();if(!n)return{started:!1,error:"discord-voice-capture binary not found"};Ja();let r=e.token??process.env.DISCORD_TOKEN??Un;if(!r)return{started:!1,error:"no Discord token available yet (make one API request, or pass DISCORD_TOKEN)"};try{let i=(0,Fi.spawn)(n,["--stdio"],{stdio:["pipe","pipe","pipe"],env:{...process.env,DISCORD_TOKEN:r}});re=i,Yt=i.stdin,i.stdout?.on("data",a=>{let s=a.toString().trim();s&&console.log("[clipper-voice]",s)}),i.stderr?.on("data",a=>console.error("[clipper-voice]",a.toString())),i.on("exit",()=>{re=null,Yt=null});let o=JSON.stringify({cmd:"start",token:r,guild_id:e.guildId,channel_id:e.channelId});return Yt?.write(o+`
`,"utf8"),{started:!0,pid:i.pid}}catch(i){return{started:!1,error:i.message}}}function Qa(t){let e=re;return!e||e.exitCode!==null?{stopped:!1,error:"not running"}:(Yt?.write(JSON.stringify({cmd:"stop"})+`
`,"utf8"),{stopped:!0})}function es(t){let e=re;return{running:e!=null&&e.exitCode===null,pid:e?.pid}}function x(t){let e=t?.trim();return e&&(0,f.isAbsolute)(e)?e:(0,f.join)(v.app.getPath("videos"),"DiscordClips")}function qe(t){let n=(0,f.basename)(String(t??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${r[1]}.${r[2].toLowerCase()}`:null}function Ye(t){return qe(t)??`clip-${Date.now()}.webm`}function jn(t,e){let n=(0,f.extname)(e),r=e.slice(0,e.length-n.length),i=(0,f.join)(t,e);for(let o=2;(0,p.existsSync)(i)&&o<1e3;o++)i=(0,f.join)(t,`${r} (${o})${n}`);return i}function ts(t,e,n,r,i=!1){let o=x(e);(0,p.mkdirSync)(o,{recursive:!0});let a=Ye(n),s=i?jn(o,a):(0,f.join)(o,a);return(0,p.writeFileSync)(s,Buffer.from(r)),s}function ns(t,e,n){let r=x(e);return(0,p.mkdirSync)(r,{recursive:!0}),jn(r,Ye(n))}var Jt="voices";function rs(t,e){let n=qe(t);return!n||!/^\d{1,25}$/.test(String(e??""))?null:`${n.slice(0,n.length-(0,f.extname)(n).length)}.${e}.webm`}function is(t,e){let n=qe(e);if(!n)return[];let r=(0,f.join)(x(t),Jt);if(!(0,p.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,f.extname)(n).length)}.`,o=[];for(let a of(0,p.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function os(t,e,n,r,i){let o=rs(n,r);if(!o)return null;let a=(0,f.join)(x(e),Jt);(0,p.mkdirSync)(a,{recursive:!0});let s=(0,f.join)(a,o);return(0,p.writeFileSync)(s,Buffer.from(i)),s}function as(t,e,n){let r=(0,f.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");return new Uint8Array((0,p.readFileSync)((0,f.join)(x(e),Jt,r)))}function ss(t,e){let n=(0,f.join)(x(t),Jt);for(let{file:r}of is(t,e))try{(0,p.unlinkSync)((0,f.join)(n,r))}catch{}}function ls(t,e){let n=x(e);if(!(0,p.existsSync)(n))return[];let r=[],i=new Set,o=(0,p.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,f.join)(n,a.name);try{let l=(0,p.statSync)(s),h=wt(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(h)?{thumb:h}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function cs(t,e,n){let r=(0,f.join)(x(e),Ye(n));return new Uint8Array((0,p.readFileSync)(r))}async function us(t,e,n){let r=x(e),i=Ye(n),o=(0,f.join)(r,i);try{await v.shell.trashItem(o)}catch{(0,p.unlinkSync)(o)}ss(e,i);let a=(0,f.join)(r,wt(i));if((0,p.existsSync)(a))try{await v.shell.trashItem(a)}catch{try{(0,p.unlinkSync)(a)}catch{}}}function ds(t,e,n,r){let i=x(e),o=Ye(n),a=(0,f.join)(i,o),s=(0,f.extname)(o),l=qe(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let d=l.toLowerCase()===o.toLowerCase()?(0,f.join)(i,l):jn(i,l);(0,p.renameSync)(a,d);let u=(0,f.join)(i,wt(o));if((0,p.existsSync)(u))try{(0,p.renameSync)(u,(0,f.join)(i,wt((0,f.basename)(d))))}catch{}return(0,f.basename)(d)}var $i="clipper-library.json";function ps(t,e){let n=(0,f.join)(x(e),$i);if(!(0,p.existsSync)(n))return"";try{return(0,p.readFileSync)(n,"utf8")}catch{return""}}function fs(t,e,n){let r=x(e);(0,p.mkdirSync)(r,{recursive:!0});let i=(0,f.join)(r,$i),o=`${i}.tmp`;(0,p.writeFileSync)(o,String(n??""),"utf8"),(0,p.renameSync)(o,i)}async function hs(t){let e=await v.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return e.canceled?[]:e.filePaths}var ms=512*1024*1024;function gs(t,e){if(!(0,f.isAbsolute)(e)||!/\.(mp4|webm|mkv|mov|m4v)$/i.test(e))throw new Error("Not a video file");let n=(0,p.statSync)(e);if(n.size>ms){let r=Math.round(n.size/1048576);throw new Error(`That video is ${r} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,p.readFileSync)(e))}async function vs(t){let e=await v.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return e.canceled?[]:e.filePaths}var ys=64*1024*1024;function ws(t,e){if(!(0,f.isAbsolute)(e)||!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(e))throw new Error("Not an audio file");let n=(0,p.statSync)(e);if(n.size>ys){let r=Math.round(n.size/1048576);throw new Error(`That sound is ${r} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,p.readFileSync)(e))}async function bs(t){let e=await v.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return e.canceled?[]:e.filePaths}var Ss=24*1024*1024,xs=64*1024*1024;function ks(t,e){if(!(0,f.isAbsolute)(e)||!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(e))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(e),r=n?xs:Ss,i=(0,p.statSync)(e);if(i.size>r){let o=Math.round(i.size/1048576),a=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${o} MB; the montage caps them at ${a} MB.`)}return new Uint8Array((0,p.readFileSync)(e))}function Es(t,e,n){v.shell.showItemInFolder((0,f.join)(x(e),Ye(n)))}function Ts(t,e){return x(e)}async function Is(t,e){let n=await v.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:x(e),properties:["openDirectory","createDirectory"]});return n.canceled?"":n.filePaths[0]??""}function Ps(t,e){let n=x(e);(0,p.mkdirSync)(n,{recursive:!0}),v.shell.openPath(n)}function As(t){return{platform:"win32",wayland:Bn,vesktop:Gi,overlay:Ht()}}var me=new Set;async function Cs(t,e=!0){if(Bn)return[];let n=await v.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:e?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(me.size){let i=new Set(n.map(o=>o.id));for(let o of me)i.has(o)||me.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!e){if(!o&&me.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if(Ui&&!o&&a){me.add(i.id);continue}me.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function Rs(t){try{return v.app.getAppMetrics().map(e=>({type:e.serviceName||e.type,mb:Math.round((e.memory?.workingSetSize??0)/1024)})).filter(e=>e.mb>0).sort((e,n)=>n.mb-e.mb)}catch{return[]}}async function Ms(t){if(Bn)return"";let e=await v.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!e.length)return"";try{let n=v.screen.getDisplayNearestPoint(v.screen.getCursorScreenPoint()),r=e.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return e[0].id}var Gn="",$n=!1;function _s(t,e,n=!0){return!n||Gi?!1:(Gn=e??"",$n=!0,v.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await v.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(h=>h.id===Gn),l=(a&&!me.has(a.id)?a:void 0)??o.find(h=>h.id.startsWith("screen:"))??o.find(h=>!me.has(h.id));if(!l){i({});return}i(Ui&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function Ds(t){Gn="",$n&&($n=!1,v.session.defaultSession.setDisplayMediaRequestHandler(null))}var Wn=new Map,Ke=[],Tt=[];function Os(t){let e=Ke.shift();if(e){e(t);return}Tt.push(t),Tt.length>8&&Tt.shift()}function Ls(t,e){Hn();let n=[];for(let[r,i]of Object.entries(e)){if(!i)continue;let o=!1;try{o=v.globalShortcut.register(i,()=>Os(r))}catch{o=!1}o?Wn.set(r,i):n.push(i)}return n}function Hn(t){for(let n of Wn.values())try{v.globalShortcut.unregister(n)}catch{}Wn.clear(),Tt=[];let e=Ke;Ke=[];for(let n of e)n(null)}function Vs(t,e=3e4){let n=Tt.shift();return n?Promise.resolve(n):new Promise(r=>{let i=!1,o=s=>{i||(i=!0,clearTimeout(a),r(s))},a=setTimeout(()=>{Ke=Ke.filter(s=>s!==o),o(null)},e);Ke.push(o)})}v.app.on("will-quit",()=>Hn());function Fs(t,e){return ni(e)}function Ns(t){return Cn()}function Us(t){return Wt()}function Gs(t,e=3e4){return ii(e)}function $s(t,e){return Ri(e)}function Ws(t){return Nn()}function zs(t){return qt()}function Bs(t){return Mi()}function js(t,e,n,r,i){return _i(new Uint8Array(e),n,r,i)}function Hs(t){return Di()}function Ks(t,e=3e4){return Oi(e)}v.app.on("will-quit",()=>{Cn(),re&&re.exitCode===null&&re.kill()});var Zs=["top-left","top-right","bottom-left","bottom-right"];function Ze(t,e,n,r){let i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(e,Math.round(i))):r}function Wi(t){return Zs.includes(t)?t:"bottom-right"}function qs(t){return{corner:Wi(t?.corner),width:Ze(t?.width,200,1280,420),volume:Ze(t?.volume,0,100,0),seconds:Ze(t?.seconds,0,300,10)}}function zn(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function Ys(t,e,n,r){let i=qe(n);if(!i)return!1;let o=(0,f.join)(x(e),i);return(0,p.existsSync)(o)?ci(o,qs(r)):!1}function Js(t,e,n,r){return v.BrowserWindow.getFocusedWindow()||_n()?!1:ui(zn(e,60),zn(n,90),Wi(r))}function Xs(t){Ie()}var Qs=200;function el(t){return Array.isArray(t)?t.map(Number).filter(e=>Number.isFinite(e)&&e>=0).slice(0,Qs):[]}function tl(t){return{width:Ze(t?.width,360,1600,720),volume:Ze(t?.volume,0,100,0)}}function nl(t,e,n,r,i){let o=qe(n);if(!o)return!1;let a=(0,f.join)(x(e),o);return(0,p.existsSync)(a)?gi({name:o,path:a,markers:el(r)},tl(i)):!1}function rl(t){yt()}function il(t){return _n()}function ol(t,e=3e4){return fi(Ze(e,1e3,12e4,3e4))}function al(t){hi()}function sl(t,e,n,r){mi({ok:!!e,message:zn(n,120),close:!!r})}function ll(t){let e=v.BrowserWindow.fromWebContents(t.sender);!e||e.isDestroyed()||(e.isMinimized()&&e.restore(),e.show(),e.focus())}var It="kebab1337420/vencord-clipper",cl=`VencordClipper (+https://github.com/${It})`,ul=["patcher.js","patcher.js.LEGAL.txt","preload.js","renderer.css","renderer.js","renderer.js.LEGAL.txt","vencordDesktopMain.js","vencordDesktopMain.js.LEGAL.txt","vencordDesktopPreload.js","vencordDesktopRenderer.css","vencordDesktopRenderer.js","vencordDesktopRenderer.js.LEGAL.txt"];function Xt(t,e=0){return new Promise((n,r)=>{let i=(0,Ni.get)(t,{headers:{"User-Agent":cl,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),e>=5?r(new Error(`Too many redirects for ${t}`)):n(Xt(new URL(s,t).toString(),e+1));return}let l=[];o.on("data",h=>l.push(h)),o.on("end",()=>n({status:a,body:Buffer.concat(l)})),o.on("error",r)});i.setTimeout(6e4,()=>i.destroy(new Error(`${t} timed out`))),i.on("error",r)})}async function dl(t){let{status:e,body:n}=await Xt(t);if(e!==200)throw new Error(`${t} answered ${e}`);return n}function zi(){return __dirname}function Bi(t){return(0,p.existsSync)((0,f.join)(t,"patcher.js"))&&(0,p.existsSync)((0,f.join)(t,"renderer.js"))}function ji(t){try{return(0,p.accessSync)(t,p.constants.W_OK),!0}catch{return!1}}function pl(t,e){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(t),i=n(e);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function fl(t,e){let n=await dl(`https://api.github.com/repos/${It}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=zi();return{version:o,tag:i,available:!!o&&pl(o,e),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${It}/releases`),directory:a,writable:Bi(a)&&ji(a)}}async function hl(t){let{status:e,body:n}=await Xt(`https://raw.githubusercontent.com/${It}/${t}/prebuilt/build-info.json`);if(e===404)return null;if(e!==200)throw new Error(`The release's file list answered ${e}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return r}async function ml(t,e){if(!/^[\w.-]{1,40}$/.test(e))throw new Error(`Refusing to fetch a release named ${e}`);let n=zi();if(!Bi(n))throw new Error(`No installed bundle at ${n}`);if(!ji(n))throw new Error(`${n} is read-only`);let r=await hl(e),i=r?Object.keys(r):ul,o=(0,f.join)(n,".clipper-update");(0,p.rmSync)(o,{recursive:!0,force:!0}),(0,p.mkdirSync)(o,{recursive:!0});try{let a=[];for(let d of i){if(d!==(0,f.basename)(d)||d.startsWith("."))throw new Error(`Refusing a release file named ${d}`);let{status:u,body:y}=await Xt(`https://raw.githubusercontent.com/${It}/${e}/prebuilt/dist/${d}`);if(u===404&&!r)continue;if(u!==200)throw new Error(`${d} answered ${u}`);if(y.length===0)throw new Error(`${d} came back empty`);let E=r?.[d];if(E?.size!==void 0&&y.length!==E.size)throw new Error(`${d} is ${y.length} bytes, the release says ${E.size}`);if(E?.sha256&&(0,Vi.createHash)("sha256").update(y).digest("hex").toLowerCase()!==E.sha256.toLowerCase())throw new Error(`${d} does not match its hash`);(0,p.writeFileSync)((0,f.join)(o,d),y),a.push(d)}if(a.length===0)throw new Error(`There is no bundle published under ${e}`);for(let d of["renderer.js","patcher.js"])if(!a.includes(d))throw new Error(`The release carries no ${d}`);if(!(0,p.readFileSync)((0,f.join)(o,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let s=(0,f.join)(o,".previous");(0,p.mkdirSync)(s,{recursive:!0});let l=[],h=[];try{for(let d of a){let u=(0,f.join)(n,d);(0,p.existsSync)(u)&&((0,p.renameSync)(u,(0,f.join)(s,d)),l.push(d)),(0,p.renameSync)((0,f.join)(o,d),u),h.push(d)}}catch(d){for(let u of h)try{(0,p.unlinkSync)((0,f.join)(n,u))}catch{}for(let u of l)try{(0,p.renameSync)((0,f.join)(s,u),(0,f.join)(n,u))}catch{}throw new Error(`The update could not be put in place (${d.message}). The bundle that was there has been put back.`)}return a}finally{(0,p.rmSync)(o,{recursive:!0,force:!0})}}function gl(t){v.app.relaunch(),v.app.quit(),setTimeout(()=>v.app.exit(0),3e3)}var Hi={AppleMusicRichPresence:gn,ConsoleShortcuts:vn,FixSpotifyEmbeds:Gr,FixYoutubeEmbeds:Wr,OpenInApp:kn,Translate:En,VoiceMessages:Tn,XSOverlay:In,YoutubeAdblock:Zr,Clipper:Kn};var Ki={};for(let[t,e]of Object.entries(Hi)){let n=Object.entries(e);if(!n.length)continue;let r=Ki[t]={};for(let[i,o]of n){let a=`VencordPluginNative_${t}_${i}`;Zn.ipcMain.handle(a,o),r[i]=a}}Zn.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=Ki});te();c();function qn(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}Le();var b=require("electron");c();var Zi="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var ie=require("fs"),ve=require("fs/promises"),io=require("os"),Qt=require("path");c();te();Le();var Je=require("electron");c();te();var Yn=require("electron"),j=["connect-src"],U=[...j,"img-src"],Ji=["style-src","font-src"],qi=[...U,"media-src"],k=[...U,...Ji],Yi=[...k,"script-src","worker-src"],Xn={"http://localhost:*":k,"http://127.0.0.1:*":k,"localhost:*":k,"127.0.0.1:*":k,"*.github.io":k,"github.com":k,"raw.githubusercontent.com":k,"*.gitlab.io":k,"gitlab.com":k,"*.codeberg.page":k,"codeberg.org":k,"*.githack.com":k,"jsdelivr.net":k,"fonts.googleapis.com":Ji,"i.imgur.com":U,"i.ibb.co":U,"i.pinimg.com":U,"files.catbox.moe":k,"cdn.discordapp.com":k,"media.discordapp.net":U,"cdnjs.cloudflare.com":Yi,"cdn.jsdelivr.net":Yi,"api.github.com":j,"ws.audioscrobbler.com":j,"musicbrainz.org":j,"*.listenbrainz.org":j,"coverartarchive.org":j,"archive.org":j,"*.archive.org":j,"translate-pa.googleapis.com":j,"*.vencord.dev":U,"manti.vendicated.dev":U,"decor.fieryflames.dev":j,"ugc.decor.fieryflames.dev":U,"sponsor.ajay.app":j,"dearrow-thumb.ajay.app":U,"usrbg.is-hardly.online":U,"icons.duckduckgo.com":U,"*.tenor.com":qi,"*.tenor.co":qi},Jn=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),vl=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},yl=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),wl=t=>{let e=Jn(t,"content-security-policy-report-only");e&&delete t[e];let n=Jn(t,"content-security-policy");if(n){let r=vl(t[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(K.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(Xn))for(let s of a)i(s,o);t[n]=[yl(r)]}};function Xi(){Yn.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&wl(t),e==="stylesheet")){let r=Jn(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),Yn.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function Qi(){Je.ipcMain.handle("VencordCspRemoveOverride",kl),Je.ipcMain.handle("VencordCspRequestAddOverride",xl),Je.ipcMain.handle("VencordCspIsDomainAllowed",El)}function bl(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!k.includes(n)))}function Sl(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Discord for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let a=e.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function xl(t,e,n,r){if(!bl(e,n))return"invalid";let i=new URL(e).host;if(i in K.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await Je.dialog.showMessageBox({...Sl(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(K.store.customCspRules[i]=n,"ok"):"unchecked"}function kl(t,e){return e in K.store.customCspRules?(delete K.store.customCspRules[e],!0):!1}function El(t,e,n){try{let r=new URL(e).host,i=Xn[r]??K.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}c();var Tl=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,Il=/^\\@/;function Qn(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function eo(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function to(t,e){if(!t)return Qn(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return Qn(e);let r={},i="",o="";for(let a of n.split(Tl))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace(Il,"@");return r[i]=o.trim(),delete r[""],Qn(e,r)}Ne();c();var Xe=require("path");function ge(t,e){let n=(0,Xe.normalize)(t+"/"),r=(0,Xe.join)(t,e),i=(0,Xe.normalize)(r);return i===(0,Xe.normalize)(t)||i.startsWith(n)?i:null}c();var no=require("electron");function ro(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":no.shell.openExternal(e)}return{action:"deny"}})}var Pl=(0,Qt.join)(__dirname,"renderer.css");(0,ie.mkdirSync)(ue,{recursive:!0});Qi();function oo(){return(0,ve.readFile)(Fe,"utf-8").catch(()=>"")}async function Al(){let t=await(0,ve.readdir)(ue).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await ao(n).then(eo).catch(()=>null);r!=null&&e.push(to(r,n))}return e}function ao(t){t=t.replace(/\?v=\d+$/,"");let e=ge(ue,t);return e?(0,ve.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}b.ipcMain.handle("VencordOpenQuickCss",()=>b.shell.openPath(Fe));b.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!Vr.includes(n))throw"Disallowed protocol.";b.shell.openExternal(e).catch(r=>console.error("[Vencord] Failed to open external link",e,r))});b.ipcMain.handle("VencordGetQuickCss",()=>oo());b.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,ie.writeFileSync)(Fe,e));b.ipcMain.handle("VencordGetThemesList",()=>Al());b.ipcMain.handle("VencordGetThemeData",(t,e)=>ao(e));b.ipcMain.handle("VencordGetThemeSystemValues",()=>{let t=b.systemPreferences.getAccentColor?.()??"";return t.length&&t[0]!=="#"&&(t=`#${t}`),{"os-accent-color":t}});b.ipcMain.handle("VencordOpenThemesFolder",()=>b.shell.openPath(ue));b.ipcMain.handle("VencordOpenSettingsFolder",()=>b.shell.openPath(Se));var er=[];b.ipcMain.handle("VencordInitFileWatchers",({sender:t})=>{er.forEach(i=>i.close());let e,n;(0,ve.open)(Fe,"a+").then(i=>{i.close(),e=(0,ie.watch)(Fe,{persistent:!1},qn(async()=>{t.postMessage("VencordQuickCssUpdate",await oo())},50))}).catch(()=>{});let r=(0,ie.watch)(ue,{persistent:!1},qn(()=>{t.postMessage("VencordThemeUpdate",void 0)}));er=[e,r,n].filter(Boolean),t.once("destroyed",()=>{e?.close(),r.close(),n?.close(),er=[]})});b.ipcMain.on("VencordGetMonacoTheme",t=>{t.returnValue=b.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});b.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=b.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new b.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:b.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,Qt.join)(__dirname,"preload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});ro(n),await n.loadURL(`data:text/html;base64,${Zi}`)});b.ipcMain.handle("VencordGetRendererCss",()=>(0,ve.readFile)(Pl,"utf-8"));b.ipcMain.on("VencordPreloadGetRendererJs",t=>{t.returnValue=(0,ie.readFileSync)((0,Qt.join)(__dirname,"renderer.js"),"utf-8")});b.ipcMain.on("VencordSupportsWindowsMaterial",t=>{t.returnValue=Number((0,io.release)().split(".")[2])>=22621});var Re=require("electron"),Oo=require("path"),ur=require("url");te();Ne();c();var sn=require("electron");c();var co=require("module"),Cl=(0,co.createRequire)("/"),Qe,tn,nr,Rl=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{Qe=Cl("worker_threads"),tn=Qe.Worker,nr=Qe.isMarkedAsUntransferable}catch{}var Ml=tn?function(t,e,n,r,i){var o=!1,a=new tn(t+Rl,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return nr&&(r=r.filter(function(s){return!nr(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,tn.prototype.terminate.call(a)},a}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},R=Uint8Array,Ce=Uint16Array,uo=Int32Array,ir=new R([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),or=new R([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),po=new R([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),fo=function(t,e){for(var n=new Ce(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new uo(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},Qe=fo(ir,2),ar=Qe.b,_l=Qe.r;ar[28]=258,_l[258]=28;var ho=fo(or,0),mo=ho.b,id=ho.r,on=new Ce(32768);for(w=0;w<32768;++w)oe=(w&43690)>>1|(w&21845)<<1,oe=(oe&52428)>>2|(oe&13107)<<2,oe=(oe&61680)>>4|(oe&3855)<<4,on[w]=((oe&65280)>>8|(oe&255)<<8)>>1;var oe,w,et=(function(t,e,n){for(var r=t.length,i=0,o=new Ce(e);i<r;++i)t[i]&&++o[t[i]-1];var a=new Ce(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new Ce(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var h=i<<4|t[i],d=e-t[i],u=a[t[i]-1]++<<d,y=u|(1<<d)-1;u<=y;++u)s[on[u]>>l]=h}else for(s=new Ce(r),i=0;i<r;++i)t[i]&&(s[i]=on[a[t[i]-1]++]>>15-t[i]);return s}),Pt=new R(288);for(w=0;w<144;++w)Pt[w]=8;var w;for(w=144;w<256;++w)Pt[w]=9;var w;for(w=256;w<280;++w)Pt[w]=7;var w;for(w=280;w<288;++w)Pt[w]=8;var w,go=new R(32);for(w=0;w<32;++w)go[w]=5;var w;var vo=et(Pt,9,1);var yo=et(go,5,1),nn=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},G=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},rn=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},wo=function(t){return(t+7)/8|0},an=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new R(t.subarray(e,n))};var bo=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],I=function(t,e,n){var r=new Error(e||bo[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,I),!n)throw r;return r},So=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new R(0);var a=!n,s=a||e.i!=2,l=e.i;a&&(n=new R(i*3));var h=function(gr){var vr=n.length;if(gr>vr){var yr=new R(Math.max(vr*2,gr));yr.set(n),n=yr}},d=e.f||0,u=e.p||0,y=e.b||0,E=e.l,ae=e.d,Q=e.m,O=e.n,L=i*8;do{if(!E){d=G(t,u,1);var se=G(t,u+1,3);if(u+=3,se)if(se==1)E=vo,ae=yo,Q=9,O=5;else if(se==2){var tt=G(t,u,31)+257,At=G(t,u+10,15)+4,we=tt+G(t,u+5,31)+1;u+=14;for(var V=new R(we),_e=new R(19),T=0;T<At;++T)_e[po[T]]=G(t,u+T*3,7);u+=At*3;for(var nt=nn(_e),Lo=(1<<nt)-1,Vo=et(_e,nt,1),T=0;T<we;){var dr=Vo[G(t,u,Lo)];u+=dr&15;var A=dr>>4;if(A<16)V[T++]=A;else{var De=0,Ct=0;for(A==16?(Ct=3+G(t,u,3),u+=2,De=V[T-1]):A==17?(Ct=3+G(t,u,7),u+=3):A==18&&(Ct=11+G(t,u,127),u+=7);Ct--;)V[T++]=De}}var pr=V.subarray(0,tt),le=V.subarray(tt);Q=nn(pr),O=nn(le),E=et(pr,Q,1),ae=et(le,O,1)}else I(1);else{var A=wo(u)+4,ee=t[A-4]|t[A-3]<<8,Me=A+ee;if(Me>i){l&&I(0);break}s&&h(y+ee),n.set(t.subarray(A,Me),y),e.b=y+=ee,e.p=u=Me*8,e.f=d;continue}if(u>L){l&&I(0);break}}s&&h(y+131072);for(var Fo=(1<<Q)-1,No=(1<<O)-1,ln=u;;ln=u){var De=E[rn(t,u)&Fo],Oe=De>>4;if(u+=De&15,u>L){l&&I(0);break}if(De||I(2),Oe<256)n[y++]=Oe;else if(Oe==256){ln=u,E=null;break}else{var fr=Oe-254;if(Oe>264){var T=Oe-257,rt=ir[T];fr=G(t,u,(1<<rt)-1)+ar[T],u+=rt}var cn=ae[rn(t,u)&No],un=cn>>4;cn||I(3),u+=cn&15;var le=mo[un];if(un>3){var rt=or[un];le+=rn(t,u)&(1<<rt)-1,u+=rt}if(u>L){l&&I(0);break}s&&h(y+131072);var hr=y+fr;if(y<le){var mr=o-le,Uo=Math.min(le,hr);for(mr+y<0&&I(3);y<Uo;++y)n[y]=r[mr+y]}for(;y<hr;++y)n[y]=n[y-le]}}e.l=E,e.p=ln,e.b=y,e.f=d,E&&(d=1,e.m=Q,e.d=ae,e.n=O)}while(!d);return y!=n.length&&a?an(n,0,y):n.subarray(0,y)};var Dl=new R(0);var Ol=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},so=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){e+=";"+l+"=";var h=s.toString();if(s.prototype)if(h.indexOf("[native code]")!=-1){var d=h.indexOf(" ",8)+1;e+=h.slice(d,h.indexOf("(",d))}else{e+=h;for(var u in s.prototype)e+=";"+l+".prototype."+u+"="+s.prototype[u].toString()}else e+=h}else n[l]=s}return e},en=[],Ll=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},Vl=function(t,e,n,r){if(!en[n]){for(var i="",o={},a=t.length-1,s=0;s<a;++s)i=so(t[s],i,o);en[n]={c:so(t[a],i,o),e:o}}var l=Ol({},en[n].e);return Ml(en[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,Ll(l),r)},Fl=function(){return[R,Ce,uo,ir,or,po,ar,mo,vo,yo,on,bo,et,nn,G,rn,wo,an,I,So,sr,xo,ko]};var xo=function(t){return postMessage(t,[t.buffer])},ko=function(t){return t&&{out:t.size&&new R(t.size),dictionary:t.dictionary}},Nl=function(t,e,n,r,i,o){var a=Vl(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([t,e],e.consume?[t.buffer]:[]),function(){a.terminate()}};var Y=function(t,e){return t[e]|t[e+1]<<8},$=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},tr=function(t,e){return $(t,e)+$(t,e+4)*4294967296};function Ul(t,e,n){return n||(n=e,e={}),typeof n!="function"&&I(7),Nl(t,e,[Fl],function(r){return xo(sr(r.data[0],ko(r.data[1])))},1,n)}function sr(t,e){return So(t,{i:2},e&&e.out,e&&e.dictionary)}var rr=typeof TextDecoder<"u"&&new TextDecoder,Gl=0;try{rr.decode(Dl,{stream:!0}),Gl=1}catch{}var $l=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:an(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function Wl(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(rr)return rr.decode(t);var i=$l(t),o=i.s,n=i.r;return n.length&&I(8),o}}var zl=function(t,e){return e+30+Y(t,e+26)+Y(t,e+28)},Bl=function(t,e,n){var r=Y(t,e+28),i=Y(t,e+30),o=Wl(t.subarray(e+46,e+46+r),!(Y(t,e+8)&2048)),a=e+46+r,s=jl(t,a,i,n,$(t,e+20),$(t,e+24),$(t,e+42)),l=s[0],h=s[1],d=s[2];return[Y(t,e+10),l,h,o,a+i+Y(t,e+32),d]},jl=function(t,e,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,h=a==4294967295,d=e+n,u=s+l+h;if(r&&u){for(;e+4<d;e+=4+Y(t,e+2))if(Y(t,e)==1)return[s?tr(t,e+4+8*l):i,l?tr(t,e+4):o,h?tr(t,e+4+8*(l+s)):a,1];r<2&&I(13)}return[i,o,a,0]};var lo=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function Eo(t,e,n){n||(n=e,e={}),typeof n!="function"&&I(7);var r=[],i=function(){for(var O=0;O<r.length;++O)r[O]()},o={},a=function(O,L){lo(function(){n(O,L)})};lo(function(){a=n});for(var s=t.length-22;$(t,s)!=101010256;--s)if(!s||t.length-s>65558)return a(I(13,0,1),null),i;var l=Y(t,s+8);if(l){var h=l,d=$(t,s+16),u=$(t,s-20)==117853008;if(u){var y=$(t,s-12);u=$(t,y)==101075792,u&&(h=l=$(t,y+32),d=$(t,y+48))}for(var E=e&&e.filter,ae=function(O){var L=Bl(t,d,u),se=L[0],A=L[1],ee=L[2],Me=L[3],tt=L[4],At=L[5],we=zl(t,At);d=tt;var V=function(T,nt){T?(i(),a(T,null)):(nt&&(o[Me]=nt),--l||a(null,o))};if(!E||E({name:Me,size:A,originalSize:ee,compression:se}))if(!se)V(null,an(t,we,we+A));else if(se==8){var _e=t.subarray(we,we+A);if(ee<524288||A>.8*ee)try{V(null,sr(_e,{out:new R(ee)}))}catch(T){V(T,null)}else r.push(Ul(_e,{size:ee},V))}else V(I(14,"unknown compression type "+se,1),null);else V(null,null)},Q=0;Q<h;++Q)ae(Q)}else a(null,{});return i}var Po=require("fs"),J=require("fs/promises"),lr=require("path");Ne();c();function To(t){function e(a,s,l,h){let d=0;return d+=a<<0,d+=s<<8,d+=l<<16,d+=h<<24>>>0,d}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let a=e(t[8],t[9],t[10],t[11]),s=e(t[12],t[13],t[14],t[15]),l=16+a+s;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}c();var Hl=require("original-fs");async function Kl(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function Io(t,e){let r=await(await Kl(t,e)).arrayBuffer();return Buffer.from(r)}var Zl=(0,lr.join)(_t,"ExtensionCache");async function ql(t,e){return await(0,J.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{Eo(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let u=ge(e,a);if(!u)throw new Error(`Path traversal detected: "${a}"`);return void await(0,J.mkdir)(u,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),h=ge(e,l);if(!h)throw new Error(`Path traversal detected: "${a}"`);let d=ge(e,a);if(!d)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,J.mkdir)(h,{recursive:!0}),await(0,J.writeFile)(d,o[a])})).then(()=>n()).catch(a=>{(0,J.rm)(e,{recursive:!0,force:!0}),r(a)})})})}async function Ao(t){let e=(0,lr.join)(Zl,t);try{await(0,J.access)(e,Po.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await Io(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await ql(To(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}sn.session.defaultSession.extensions?sn.session.defaultSession.extensions.loadExtension(e):sn.session.defaultSession.loadExtension(e)}Dt||Re.app.whenReady().then(()=>{Re.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=ge(ue,n);return r?Re.net.fetch((0,ur.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return Re.net.fetch((0,ur.pathToFileURL)((0,Oo.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{C.store.enableReactDevtools&&Ao("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}Xi()});Do();
//# sourceURL=file:///VencordPatcher
//# sourceMappingURL=vencord://patcher.js.map
/*! For license information please see patcher.js.LEGAL.txt */

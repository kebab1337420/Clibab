// Vencord 59a5428
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var ta=Object.create;var Lt=Object.defineProperty;var na=Object.getOwnPropertyDescriptor;var ra=Object.getOwnPropertyNames;var ia=Object.getPrototypeOf,oa=Object.prototype.hasOwnProperty;var z=(t,e,n)=>()=>{if(n)throw n[0];try{return t&&(e=t(t=0)),e}catch(r){throw n=[r],r}};var xe=(t,e)=>{for(var n in e)Lt(t,n,{get:e[n],enumerable:!0})},Rr=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of ra(e))!oa.call(t,i)&&i!==n&&Lt(t,i,{get:()=>e[i],enumerable:!(r=na(e,i))||r.enumerable});return t};var yn=(t,e,n)=>(n=t!=null?ta(ia(t)):{},Rr(e||!t||!t.__esModule?Lt(n,"default",{value:t,enumerable:!0}):n,t)),wn=t=>Rr(Lt({},"__esModule",{value:!0}),t);var u=z(()=>{"use strict"});var Ne=z(()=>{"use strict";u()});function ot(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var _r=z(()=>{"use strict";u()});var ua={};function Ue(...t){let e={cwd:Vr};return Sn?bn("flatpak-spawn",["--host","git",...t],e):bn("git",t,e)}async function aa(){return(await Ue("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function sa(){await Ue("fetch");let t=(await Ue("branch","--show-current")).stdout.trim();if(!((await Ue("ls-remote","origin",t)).stdout.length>0))return[];let r=(await Ue("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function la(){return(await Ue("pull")).stdout.includes("Fast-forward")}async function ca(){return!(await bn(Sn?"flatpak-spawn":"node",Sn?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:Vr})).stderr.includes("Build failed")}var Dr,at,Or,Lr,Vr,bn,Sn,Fr=z(()=>{"use strict";u();Ne();Dr=require("child_process"),at=require("electron"),Or=require("path"),Lr=require("util");_r();Vr=(0,Or.join)(__dirname,".."),bn=(0,Lr.promisify)(Dr.execFile),Sn=!1;at.ipcMain.handle("VencordGetRepo",ot(aa));at.ipcMain.handle("VencordGetUpdates",ot(sa));at.ipcMain.handle("VencordUpdate",ot(la));at.ipcMain.handle("VencordBuild",ot(ca))});var Pn,zr,st,Br=z(()=>{"use strict";u();Pn=Symbol("SettingsStore.isProxy"),zr=Symbol("SettingsStore.getRawTarget"),st=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===Pn)return!0;if(r===zr)return n;let o=Reflect.get(n,r,i),a=e.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[Pn]){let h=`${l}${l&&"."}${r}`;return e.makeProxy(o,s,h)}return o},set(n,r,i){if(i?.[Pn]&&(i=i[zr]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return e.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return e.notifyListeners(s,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyPrefixListeners(e,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,e))}}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,h)=>l[h],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n)),this.notifyPrefixListeners(e,i,n)}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}addPrefixChangeListener(e,n){let r=this.prefixListeners.get(e)??new Set;r.add(n),this.prefixListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}removePrefixChangeListener(e,n){let r=this.prefixListeners.get(e);r&&(r.delete(n),r.size||this.prefixListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}}});function In(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},In(t[n],r)):t[n]??=r}return t}var jr=z(()=>{"use strict";u()});var Hr,ue,Ft,Ee,de,$e,An,Cn,Kr,Nt,Ge=z(()=>{"use strict";u();Hr=require("electron"),ue=require("path"),Ft=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,ue.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,ue.join)(Hr.app.getPath("userData"),"..","Vencord")),Ee=(0,ue.join)(Ft,"settings"),de=(0,ue.join)(Ft,"themes"),$e=(0,ue.join)(Ee,"quickCss.css"),An=(0,ue.join)(Ee,"settings.json"),Cn=(0,ue.join)(Ee,"native-settings.json"),Kr=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"],Nt=process.argv.includes("--vanilla")});function Zr(t,e){try{return JSON.parse((0,Te.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var Mn,Te,A,fa,qr,J,ie=z(()=>{"use strict";u();Ne();Br();jr();Mn=require("electron"),Te=require("fs");Ge();(0,Te.mkdirSync)(Ee,{recursive:!0});A=new st(Zr("renderer",An));A.addGlobalChangeListener(()=>{try{(0,Te.writeFileSync)(An,JSON.stringify(A.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});Mn.ipcMain.on("VencordGetSettings",t=>t.returnValue=A.plain);Mn.ipcMain.handle("VencordSetSettings",(t,e,n)=>{A.setData(e,n)});fa={plugins:{},customCspRules:{}},qr=Zr("native",Cn);In(qr,fa);J=new st(qr);J.addGlobalChangeListener(()=>{try{(0,Te.writeFileSync)(Cn,JSON.stringify(J.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}})});function zo(t,e,n){let r=e;if(e in t)return void n(t[r]);Object.defineProperty(t,e,{set(i){delete t[r],t[r]=i,n(i)},configurable:!0,enumerable:!1})}var Bo=z(()=>{"use strict";u()});var wc={};function yc(t,e){let n=t.slice(4).split(".").map(Number),r=e.slice(4).split(".").map(Number);for(let i=0;i<r.length;i++){if(n[i]>r[i])return!0;if(n[i]<r[i])return!1}return!1}function jo(){if(!process.env.DISABLE_UPDATER_AUTO_PATCHING)try{let t=(0,Z.dirname)(process.execPath),e=(0,Z.basename)(t),n=(0,Z.join)(t,".."),r=(0,ne.readdirSync)(n).reduce((h,f)=>f.startsWith("app-")&&yc(f,h)?f:h,e);if(r===e)return;let i=(0,Z.join)(n,e,"resources"),o=(0,Z.join)(i,"app.asar"),a=(0,Z.join)(n,r,"resources"),s=(0,Z.join)(a,"app.asar"),l=(0,Z.join)(a,"_app.asar");if(!(0,ne.existsSync)(o)||!(0,ne.existsSync)(s)||(0,ne.existsSync)(l))return;console.info(`[Vencord] Detected Host Update (${e} -> ${r}). Repatching...`),(0,ne.renameSync)(s,l),(0,ne.copyFileSync)(o,s)}catch(t){console.error("[Vencord] Failed to repatch latest host update",t)}}var Ho,br,ne,Z,Ko=z(()=>{"use strict";u();Ho=require("electron"),br=yn(require("events")),ne=require("original-fs"),Z=require("path");br.default.prototype.emit=new Proxy(br.default.prototype.emit,{apply(t,e,n){return n[0]==="host-updated"&&jo(),Reflect.apply(t,e,n)}}),Ho.app.on("before-quit",jo)});var Ec={};var q,be,bc,Sc,Sr,xc,Zo=z(()=>{"use strict";u();Bo();q=yn(require("electron")),be=require("path");ie();Ge();console.log("[Vencord] Starting up...");bc=require.main.filename,Sc=require.main.path.endsWith("app.asar")?"_app.asar":"app.asar",Sr=(0,be.join)((0,be.dirname)(bc),"..",Sc),xc=require((0,be.join)(Sr,"package.json"));require.main.filename=(0,be.join)(Sr,xc.main);q.app.setAppPath(Sr);if(Nt)console.log("[Vencord] Running in vanilla mode. Not loading Vencord");else{let t=A.store;if(Ko(),t.winCtrlQ){let r=q.Menu.buildFromTemplate;q.Menu.buildFromTemplate=function(i){if(i[0]?.label==="&File"){let{submenu:o}=i[0];Array.isArray(o)&&o.push({label:"Quit (Hidden)",visible:!1,acceleratorWorksWhenHidden:!0,accelerator:"Control+Q",click:()=>q.app.quit()})}return r.call(this,i)}}class e extends q.default.BrowserWindow{constructor(i){if(!i?.webPreferences?.preload||!i.title){super(i);return}let{frameless:o,winNativeTitleBar:a,disableMinSize:s,transparent:l,macosVibrancyStyle:h,windowsMaterial:f}=t,d=i.webPreferences.preload;i.webPreferences.preload=(0,be.join)(__dirname,"preload.js"),i.webPreferences.sandbox=!1,o?i.frame=!1:a&&delete i.frame,s&&(i.minWidth=0,i.minHeight=0),l&&(i.transparent=!0,i.backgroundColor="#00000000"),f&&f!=="none"&&(i.backgroundMaterial=f,i.backgroundColor="#00000000"),process.env.DISCORD_PRELOAD=d,super(i),s&&(this.setMinimumSize=(v,T)=>{})}}Object.assign(e,q.default.BrowserWindow),Object.defineProperty(e,"name",{value:"BrowserWindow",configurable:!0});let n=require.resolve("electron");delete require.cache[n].exports,require.cache[n].exports={...q.default,BrowserWindow:e},zo(global,"appSettings",r=>{r.set("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING",!0)}),process.env.DATA_DIR=(0,be.join)(q.app.getPath("userData"),"..","Vencord")}console.log("[Vencord] Loading original Discord app.asar");require(require.main.filename)});u();u();u();Fr();u();Ne();var or=require("electron");u();var Tn={};xe(Tn,{fetchTrackData:()=>pa});u();u();u();var Nr="59a5428";u();var xn="Vendicated/Vencord";var Ur=`Vencord/${Nr}${xn?` (https://github.com/${xn})`:""}`;var $r=require("child_process"),Gr=require("util"),Wr=(0,Gr.promisify)($r.execFile);async function En(t){let{stdout:e}=await Wr("osascript",t.map(n=>["-e",n]).flat());return e}var B=null;async function da({id:t,name:e,artist:n,album:r}){if(t===B?.id){if("data"in B)return B.data;if("failures"in B&&B.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":Ur}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return B={id:t,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},B.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),B={id:t,failures:(t===B?.id&&"failures"in B?B.failures:0)+1},null}}async function pa(){try{await Wr("pgrep",["^Music$"])}catch{return null}if(await En(['tell application "Music"',"get player state","end tell"]).then(f=>f.trim())!=="playing")return null;let e=await En(['tell application "Music"',"get player position","end tell"]).then(f=>Number.parseFloat(f.trim())),n=await En(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(f=>!!f),l=Number.parseFloat(s),h=await da({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:e,duration:l,...h}}var kn={};xe(kn,{initDevtoolsOpenEagerLoad:()=>ha});u();function ha(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var Jr={};u();ie();var $t=require("electron"),Ut=[];function Yr(){let t=[];for(let e=Ut.length-1;e>=0;e--){let{processId:n,routingId:r}=Ut[e],i=$t.webFrameMain.fromId(n,r);if(!i){Ut.splice(e,1);continue}t.push(i)}return t}$t.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){Yr();let{routingId:i,processId:o}=r;Ut.push({routingId:i,processId:o});let a=A.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});A.addChangeListener("plugins.FixSpotifyEmbeds.volume",t=>{try{Yr().forEach(e=>e.executeJavaScript(`globalThis._vcVolume = ${t/100}`))}catch(e){console.error("FixSpotifyEmbeds: Failed to update volume",e)}});var Qr={};u();ie();var Xr=require("electron");Xr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!A.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var Rn={};xe(Rn,{resolveRedirect:()=>ga});u();var ei=require("https"),ma=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function ti(t){return new Promise((e,n)=>{let r=(0,ei.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?ti(i.headers.location):t)});r.on("error",n),r.end()})}async function ga(t,e){return ma.test(e)?ti(e):e}var _n={};xe(_n,{makeDeeplTranslateRequest:()=>va,makeKagiTranslateRequest:()=>ya});u();async function va(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function ya(t,e,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${e}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var Dn={};xe(Dn,{readRecording:()=>wa});u();var ni=require("electron"),Gt=require("fs/promises"),lt=require("path");async function wa(t,e){e=(0,lt.normalize)(e);let n=(0,lt.basename)(e),r=(0,lt.normalize)(ni.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!e.startsWith(r))return null;try{let i=await(0,Gt.readFile)(e);return(0,Gt.rm)(e).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var On={};xe(On,{closeSocket:()=>Sa,sendToOverlay:()=>ba});u();var ri=require("dgram"),Wt=null;function ba(t,e){e.messageType=e.type;let n=JSON.stringify(e);Wt??=(0,ri.createSocket)("udp4"),Wt.send(n,42069,"127.0.0.1")}function Sa(){Wt?.close(),Wt=null}var oi={};u();ie();var ii=require("electron");u();var Ln=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;ii.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{A.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(Ln):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(Ln))})})});var ir={};xe(ir,{answerOverlayAction:()=>Ml,armDisplayMedia:()=>tl,checkUpdate:()=>Ll,closeStudioOverlay:()=>Pl,deleteClip:()=>Ds,disarmDisplayMedia:()=>nl,downloadUpdate:()=>Fl,dropOverlayWaiters:()=>Cl,emptyTrash:()=>Is,focusClient:()=>Rl,gameFeedStatus:()=>ll,getActiveScreen:()=>el,getCaptureSources:()=>Xs,getClipDirectory:()=>Zs,getMemoryReport:()=>Qs,getPlatformInfo:()=>Js,hideClipOverlay:()=>Sl,hideVrPanel:()=>ml,listClips:()=>bs,listTrash:()=>Ps,notifyClipSaved:()=>bl,openClipDirectory:()=>Ys,openStudioOverlay:()=>kl,openVrBindings:()=>hl,pickAudioFiles:()=>$s,pickClipDirectory:()=>qs,pickImageFiles:()=>zs,pickVideoFiles:()=>Fs,readAudioFile:()=>Ws,readClip:()=>Ss,readImageFile:()=>Hs,readLibrary:()=>Ls,readVideoFile:()=>Us,readVoiceTrack:()=>ys,registerShortcuts:()=>il,relaunchClient:()=>Nl,releaseClipPath:()=>fs,renameClip:()=>Os,reserveClipPath:()=>hs,restoreClip:()=>ks,revealClip:()=>Ks,saveClip:()=>ps,saveVoiceTrack:()=>vs,showClipOverlay:()=>wl,showVrPanel:()=>fl,spillClear:()=>_s,spillDrop:()=>Rs,spillRead:()=>Ms,spillWrite:()=>Cs,startGameFeeds:()=>al,startVrBridge:()=>ul,stopGameFeeds:()=>sl,stopVrBridge:()=>dl,studioOverlayUp:()=>Il,trashClip:()=>Ts,unregisterShortcuts:()=>nr,vrBridgeStatus:()=>pl,waitForGameEvent:()=>cl,waitForOverlayAction:()=>Al,waitForShortcut:()=>ol,waitForVrEvent:()=>gl,writeLibrary:()=>Vs});u();var on=require("crypto"),y=require("electron"),c=require("fs"),Hi=require("https"),rn=require("os"),p=require("path");u();var j=require("fs"),li=require("http"),ci=require("https"),ui=require("os"),ft=require("path"),ai=34765,xa=6,di=256*1024,Ea=2e3,Ta=1500,ka="127.0.0.1",Pa=2999,Ia="gamestate_integration_clipper.cfg",pe=null,ze=0,Bt="",Be=null,pt=[],Aa=12,ht=[],je=[],He={cs2:!1,league:!1};function jt(t){pt.length>=Aa||pt.includes(t)||pt.push(t)}var Ht=Promise.resolve();function ct(t){let e=je.shift();if(e){e(t);return}ht.push(t),ht.length>16&&ht.shift()}var x={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function pi(){x={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function Ca(t){return t>=5?"an ace in Counter-Strike 2":t===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function Ma(t){let e=t.provider?.steamid,{player:n}=t;if(!n||!e||!n.steamid||n.steamid!==e)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof t.map?.round=="number"?t.map.round:x.round;(r.kills<x.kills||r.deaths<x.deaths)&&pi();let o=x.kills<0;i!==x.round&&(x.round=i,x.roundKills=0,x.announced=0);let a=r.kills-Math.max(0,x.kills),s=r.deaths-Math.max(0,x.deaths);if(x.kills=r.kills,x.deaths=r.deaths,o)return;a>0&&(x.roundKills+=a,x.roundKills>=3&&x.roundKills>x.announced?(x.announced=x.roundKills,ct({kind:"multikill",note:Ca(x.roundKills)})):ct({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&ct({kind:"death",note:"your death in Counter-Strike 2"});let l=t.round?.win_team;l&&n.team&&l===n.team&&t.round?.phase==="over"&&x.roundKills>0&&ct({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function Ra(){return new Promise(t=>{let e=0,n=(0,li.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>di&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{Ma(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++e<xa){n.listen(ai+e,"127.0.0.1");return}jt(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}pe===n&&(pe=null,ze=0,He={...He,cs2:!1}),t(0)}),n.on("listening",()=>{pe=n,t(n.address().port)}),n.listen(ai,"127.0.0.1")})}function _a(){let t=[],e=(0,ui.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&t.push((0,ft.join)(i,"Steam"))}let n=[];for(let r of t)if((0,j.existsSync)(r)){n.push(r);try{let i=(0,j.readFileSync)((0,ft.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function Da(){for(let t of _a()){let e=(0,ft.join)(t,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,j.existsSync)(e))return e}return""}function Oa(t){let e=Da();if(!e)return jt("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,ft.join)(e,Ia),r=`"Clipper"
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
`;try{return(0,j.mkdirSync)(e,{recursive:!0}),(0,j.writeFileSync)(n,r,"utf8"),n}catch(i){return jt(`Counter-Strike 2's config could not be written (${i.message})`),""}}function La(){let t=Bt;if(Bt="",!!t)try{(0,j.unlinkSync)(t)}catch{}}var ut="",We=-1,Vn=!1,zt=!1;function dt(t){return t.split("#")[0].trim().toLowerCase()}function si(t){return new Promise(e=>{let n=(0,ci.get)({host:ka,port:Pa,path:t,rejectUnauthorized:!1,timeout:Ta},r=>{if(r.statusCode!==200){r.resume(),e(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>di&&n.destroy()}),r.on("end",()=>{try{e(JSON.parse(i))}catch{e(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>e(null))})}function Va(t,e){let n=t.EventName??"",r=dt(t.KillerName??"");switch(n){case"ChampionKill":return r===e?{kind:"kill",note:"a kill in League of Legends"}:dt(t.VictimName??"")===e?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==e?null:{kind:"multikill",note:`a ${t.KillStreak??3}-kill run in League of Legends`};case"Ace":return dt(t.Acer??"")!==e?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return dt(t.Recipient??"")!==e?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==e?null:{kind:"objective",note:`${t.DragonType?`the ${t.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==e?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==e?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==e?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function Fa(){if(!zt){zt=!0;try{if(!ut){let r=await si("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;ut=dt(r),We=-1}let t=await si("/liveclientdata/eventdata");if(!t?.Events){ut="";return}let e=We<0,n=We;for(let r of t.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=We||(n=Math.max(n,i),e))continue;let o=Va(r,ut);o&&ct(o)}We=n}finally{zt=!1}}}function Na(){ut="",We=-1,zt=!1,Be=setInterval(()=>{Fa().catch(t=>{Vn||(Vn=!0,jt(`League of Legends could not be read (${t.message})`))})},Ea)}function Ua(t){return t.cs2!==He.cs2||t.league!==He.league?!1:(!t.cs2||pe!==null)&&(!t.league||Be!==null)}function hi(t){let e=Ht.then(async()=>(Ua(t)||(fi(),pt=[],t.cs2&&(pi(),ze=await Ra(),ze&&(Bt=Oa(ze))),t.league&&Na(),He={cs2:t.cs2&&pe!==null,league:t.league}),Kt()));return Ht=e.catch(()=>{}),e}function fi(){if(He={cs2:!1,league:!1},Be&&clearInterval(Be),Be=null,Vn=!1,pe)try{pe.close()}catch{}pe=null,ze=0,La(),ht=[];let t=je;je=[];for(let e of t)e(null)}function Fn(){let t=Ht.then(()=>fi());return Ht=t.catch(()=>{}),t}function Kt(){return{port:ze,configPath:Bt,league:Be!==null,problems:[...pt]}}function mi(t){let e=ht.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{je=je.filter(a=>a!==i),i(null)},t);je.push(i)})}u();var he=require("electron"),Yt=require("fs"),gt=require("path"),gi=require("url"),Zt=24,vi=2600,qt=220,$a=300,Ga=56,Nn=!0;function Jt(){return Nn}var Ie=null,ke=null,mt=null,Pe=null;function Wa(){return!!Ie&&!Ie.isDestroyed()}function Ae(){ke&&(clearTimeout(ke),ke=null);let t=Ie;Ie=null,t&&!t.isDestroyed()&&t.destroy()}function Ke(){Pe&&(clearTimeout(Pe),Pe=null);let t=mt;mt=null,t&&!t.isDestroyed()&&t.destroy()}function za(t,e,n){let i=he.screen.getDisplayNearestPoint(he.screen.getCursorScreenPoint()).workArea,o=t==="top-left"||t==="bottom-left",a=t==="top-left"||t==="top-right";return{x:Math.round(o?i.x+Zt:i.x+i.width-e-Zt),y:Math.round(a?i.y+Zt:i.y+i.height-n-Zt)}}function vt(t,e){let n=(0,gt.join)(he.app.getPath("userData"),"clipper-overlay");(0,Yt.mkdirSync)(n,{recursive:!0});let r=(0,gt.join)(n,t);return(0,Yt.writeFileSync)(r,e,"utf8"),r}function yi(t,e,n,r){let{x:i,y:o}=za(r,e,n),a=new he.BrowserWindow({width:e,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(t).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function wi(t){return`<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; media-src file:; style-src 'unsafe-inline'; script-src 'unsafe-inline'">
<style>
    html, body { margin: 0; height: 100%; background: transparent; overflow: hidden; }
    .card {
        position: absolute; inset: 0; border-radius: 12px; overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14); box-shadow: 0 10px 34px rgba(0, 0, 0, 0.6);
        opacity: 0; transform: scale(0.96); transition: opacity ${qt}ms ease, transform ${qt}ms ease;
    }
    .card.up { opacity: 1; transform: none; }
    ${t}
</style>`}function X(t){return JSON.stringify(t).replace(/</g,"\\u003c")}function Ba(t,e){return`<!doctype html>
<html>
<head>
${wi(`.card { background: #000; }
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
    document.getElementById("tag").textContent = ${X((0,gt.basename)(t))};

    var leaving = false;
    function leave() {
        if (leaving) return;
        leaving = true;
        card.classList.remove("up");
        setTimeout(function () { window.close(); }, ${qt});
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

    video.src = ${X((0,gi.pathToFileURL)(t).href)};

    // Autoplay with sound is only allowed after a gesture, and this window
    // never gets one. Muted playback is always allowed, so it is the fallback
    // rather than a reason to show nothing.
    video.play().catch(function () {
        video.muted = true;
        video.play().catch(leave);
    });
</script>
</body>
</html>`}function ja(t,e){return`<!doctype html>
<html>
<head>
${wi(`.card {
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
        setTimeout(function () { window.close(); }, ${qt});
    }, ${vi});
</script>
</body>
</html>`}function bi(t,e){if(!Nn)return!1;Ae(),Ke();let n=Math.max(200,Math.round(e.width)),r=Math.round(n*9/16),i=yi(vt("clip.html",Ba(t,e)),n,r,e.corner);Ie=i,i.on("closed",()=>{Ie===i&&(Ie=null,ke&&(clearTimeout(ke),ke=null))});let o=(e.seconds>0?e.seconds:300)+10;return ke=setTimeout(()=>Ae(),o*1e3),!0}function Si(t,e,n){if(!Nn||Wa())return!1;Ke();let r=yi(vt("toast.html",ja(t,e)),$a,Ga,n);return mt=r,r.on("closed",()=>{mt===r&&(mt=null,Pe&&(clearTimeout(Pe),Pe=null))}),Pe=setTimeout(()=>Ke(),vi+4e3),!0}he.app.on("will-quit",()=>{Ae(),Ke()});u();var Q=require("electron"),xi=require("url");var Un="VencordClipperOverlayAction",Ei="VencordClipperOverlayReply",Ha=108,M=null;function $n(){return!!M&&!M.isDestroyed()}function wt(){let t=M;M=null,t&&!t.isDestroyed()&&t.destroy()}var Ze=[],yt=[];function Ka(t){let e=Ze.shift();if(e){e(t);return}yt.push(t),yt.length>4&&yt.shift()}function Ti(t){let e=yt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{Ze=Ze.filter(a=>a!==i),i(null)},t);Ze.push(i)})}function ki(){yt=[];let t=Ze;Ze=[];for(let e of t)e(null)}function Pi(t){!M||M.isDestroyed()||M.webContents.send(Ei,t)}Q.ipcMain.removeAllListeners(Un);Q.ipcMain.on(Un,(t,e,n)=>{if(!M||M.isDestroyed()||t.sender!==M.webContents)return;let r=String(e??"");if(r==="close"){wt();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open"&&r!=="link")return;let i=n??{},o=Number(i.from),a=Number(i.to),s=String(i.clip??"");!s||s.length>128||Ka({kind:r,clip:s,from:Number.isFinite(o)?Math.min(3600,Math.max(0,o)):0,to:Number.isFinite(a)?Math.min(3600,Math.max(0,a)):0})});function Za(t,e){let{workArea:n}=Q.screen.getDisplayNearestPoint(Q.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-t)/2),y:Math.round(n.y+(n.height-e)/2)}}var qa=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${X(Un)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${X(Ei)}, (_event, reply) => handler(reply));
    }
});
`;function Ya(t,e){return`<!doctype html>
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
    var clip = ${X({name:t.name,url:(0,xi.pathToFileURL)(t.path).href,markers:t.markers})};
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
</html>`}function Ii(t,e){if(!Jt())return!1;wt(),Ae(),Ke();let n=Math.max(360,Math.round(e.width)),r=Math.round(n*9/16)+Ha,{x:i,y:o}=Za(n,r),a=vt("studio-preload.js",qa),s=vt("studio.html",Ya(t,e)),l=new Q.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return M=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{M===l&&(M=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}Q.app.on("will-quit",()=>wt());u();function H(t){return`${t.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}u();var Li=require("child_process"),Vi=require("crypto"),Fi=require("electron"),Re=require("fs"),Et=require("path");u();var Ja=`
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
`,Gn=`# Vencord Clipper - SteamVR bridge. Generated; edits are overwritten.
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
${Ja}
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
`;u();var Ci=require("electron"),U=require("fs"),N=require("path"),Xt="vencord.clipper",fe="/actions/clipper",bt=["save","mark","toggle","pov"],Xa=["save","mark"],Qa={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function Wn(){let t=(0,N.join)(Ci.app.getPath("userData"),"clipper-vr");return(0,U.mkdirSync)(t,{recursive:!0}),t}function es(){let t=(0,N.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,U.readFileSync)(t,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,U.existsSync)((0,N.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let e=(0,N.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,U.existsSync)((0,N.join)(e,"bin","win64","openvr_api.dll"))?e:null}function Mi(){let t=es();return t&&(0,N.join)(t,"bin","win64","openvr_api.dll")}var ts=.4,ns={save:"double",mark:"long"};function rs(t,e,n){return{path:t,mode:"button",inputs:{[e]:{output:`${fe}/in/${n}`}},parameters:e==="long"?{long_press_delay:ts}:{}}}function Ai(t,e){return{app_key:Xt,controller_type:t,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[fe]:{sources:Xa.map(n=>rs(e[n],ns[n],n))}}}}function Ri(){let t=Wn(),e={language_tag:"en_US",[fe]:"Clipper"};for(let o of bt)e[`${fe}/in/${o}`]=Qa[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:fe,usage:"leftright"}],actions:bt.map(o=>({name:`${fe}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[e]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,U.writeFileSync)((0,N.join)(t,"bindings_knuckles.json"),JSON.stringify(Ai("knuckles",r),null,4),"utf8"),(0,U.writeFileSync)((0,N.join)(t,"bindings_oculus_touch.json"),JSON.stringify(Ai("oculus_touch",r),null,4),"utf8");let i=(0,N.join)(t,"actions.json");return(0,U.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function _i(t){let e={source:"builtin",applications:[{app_key:Xt,launch_type:"binary",binary_path_windows:t,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,N.join)(Wn(),"clipper.vrmanifest");return(0,U.writeFileSync)(n,JSON.stringify(e,null,4),"utf8"),n}function zn(){return(0,N.join)(Wn(),"bridge.ps1")}var is=15e3,os=45e3,Di=3,as=3,ss=2e3,_=null,Qt=!1,oe="",R="",Ce="",Me=!1,jn=0,Ni=0,qe=null,St=[],xt=null,me=[],en=Promise.resolve();function Oi(t){let e=me.shift();if(e){e(t);return}if(t.kind==="motion"){xt=t;return}St.push(t.action),St.length>8&&St.shift()}function ls(t){let e=t.trim();if(!e.startsWith("{"))return!1;let n;try{n=JSON.parse(e)}catch{return!1}if(n.t==="ready")return oe=String(n.runtime??""),R="",Ce="",Me=!1,!0;if(n.t==="waiting")return oe="",R="",Ce=String(n.reason??""),!0;if(n.t==="warning")return R=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return R=String(n.message??"The SteamVR bridge failed for a reason it did not give"),Me=!oe||++Ni>=as,!0;if(n.t==="action"){let r=bt.find(i=>i===n.name);return r&&Oi({kind:"action",action:r}),!1}return n.t==="motion"&&Oi({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function Bn(){qe||!Qt||Me||(qe=setTimeout(()=>{qe=null,Qt&&Ui()},is))}function Ui(){if(_)return Promise.resolve();let t=Mi();if(!t)return Bn(),Promise.resolve();let e;try{let n=zn();(0,Re.writeFileSync)(n,Gn,"utf8");let r=(0,Re.readFileSync)(n,"utf8"),i=a=>(0,Vi.createHash)("sha256").update(a,"utf8").digest("hex");if(i(r)!==i(Gn))throw new Error("The SteamVR bridge script changed between writing and starting it.");let o=(0,Et.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");e=(0,Li.spawn)(o,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",t,"-Actions",Ri(),"-Manifest",_i(o),"-AppKey",Xt,"-ActionList",[fe,...bt].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return R=`The SteamVR bridge could not be started (${n.message}).`,Bn(),Promise.resolve()}return _=e,oe="",Ce="",Me=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{R="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},os),a="";e.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let h of l)ls(h)&&i()}),e.stderr?.on("data",()=>{R||(R="The SteamVR bridge printed an error and gave no usable message.")}),e.on("error",s=>{R=`The SteamVR bridge could not be started (${s.message}).`,i()}),e.on("exit",()=>{_===e&&(!oe&&!Ce&&!Me?++jn>=Di&&(Me=!0,R||(R=`The SteamVR bridge stopped ${Di} times without saying why. Switch the VR controls off and on again to try it once more.`)):jn=0,_=null,oe="",Ce="");let s=me;me=[];for(let l of s)l(null);i(),Bn()})})}function $i(){qe&&(clearTimeout(qe),qe=null);let t=_;_=null,oe="",Ce="",Me=!1,jn=0,Ni=0,St=[],xt=null;let e=me;me=[];for(let r of e)r(null);if(!t)return;try{t.stdin?.end()}catch{}let n=setTimeout(()=>{try{t.kill()}catch{}},ss);t.on("exit",()=>clearTimeout(n))}function Gi(t){let e=en.then(async()=>(Qt=t,t?(await Ui(),tn()):($i(),R="",tn())));return en=e.catch(()=>{}),e}function Hn(){let t=en.then(()=>{Qt=!1,$i()});return en=t.catch(()=>{}),t}function tn(){return{running:_!==null&&oe!=="",runtime:oe,problem:R,waiting:Ce}}function Wi(){if(!_?.stdin?.writable)return!1;try{return _.stdin.write(`bindings
`),!0}catch{return!1}}var cs=0;function zi(t,e,n,r){if(!_?.stdin?.writable||e<=0||n<=0||t.length!==e*n*4||e>2048||n>2048||t.length>16*1024*1024)return!1;let i=Math.min(1e4,Math.max(1e3,Math.round(r))),o=(0,Et.join)((0,Et.dirname)(zn()),`panel-${cs++%8}.rgba`);try{return(0,Re.writeFileSync)(o,t),_.stdin.write(`panel ${e} ${n} ${i} ${o}
`),!0}catch{try{(0,Re.unlinkSync)(o)}catch{}return!1}}function Bi(){if(!_?.stdin?.writable)return!1;try{return _.stdin.write(`panelhide
`),!0}catch{return!1}}function ji(t=3e4){let e=St.shift();if(e)return Promise.resolve({kind:"action",action:e});if(xt){let n=xt;return xt=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{me=me.filter(a=>a!==i),i(null)},t);me.push(i)})}Fi.app.on("will-quit",()=>{Hn()});var Ki=!0,er=!1,Kn=500*1024*1024,Zi=/vesktop|equibop/i.test(y.app.getName());function S(t){let e=t?.trim(),n=e&&(0,p.isAbsolute)(e)?e:(0,p.join)(y.app.getPath("videos"),"DiscordClips"),r=n.toLowerCase().replace(/[\\/]+$/,"");for(let i of us()){let o=i.toLowerCase().replace(/[\\/]+$/,"");if(r===o||r.startsWith(`${o}\\`)||r.startsWith(`${o}/`))throw new Error("That folder is not a place for clips")}return n}function us(){let t=[];for(let e of["SystemRoot","windir","ProgramFiles","ProgramFiles(x86)","ProgramW6432"]){let n=process.env[e]?.trim();n&&t.push(n)}try{t.push(rr())}catch{}try{t.push(y.app.getPath("userData"))}catch{}return t}var ds=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;function D(t){let n=(0,p.basename)(String(t??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${ds.test(r[1])?`_${r[1]}`:r[1]}.${r[2].toLowerCase()}`:null}function qi(t){return D(t)??`clip-${Date.now()}.webm`}function At(t,e){let n=(0,p.extname)(e),r=e.slice(0,e.length-n.length),i=(0,p.join)(t,e),o=2;for(;(0,c.existsSync)(i)&&o<1e3;)i=(0,p.join)(t,`${r} (${o++})${n}`);if((0,c.existsSync)(i))throw new Error(`No free name left for ${e}; rename or clear the folder`);return i}var Ye=new Map;function Yi(t,e){let n=`${t}.tmp-${process.pid}-${Date.now()}`;(0,c.writeFileSync)(n,Buffer.from(e));try{(0,c.renameSync)(n,t)}catch(r){try{(0,c.unlinkSync)(n)}catch{}throw r}}function ps(t,e,n,r,i=!1){if(r.length>Kn)throw new Error("That clip is too large to write");let o=S(e);(0,c.mkdirSync)(o,{recursive:!0});let a=qi(n),s=(0,p.join)(o,a),l=(Ye.get(s)??Promise.resolve()).catch(()=>{}).then(async()=>{let h=i?At(o,a):(0,p.join)(o,a);return Yi(h,r),h});return l.then(()=>{Ye.get(s)===l&&Ye.delete(s)},()=>{Ye.get(s)===l&&Ye.delete(s)}),Ye.set(s,l),l}var Tt=new Set;function hs(t,e,n){let r=S(e);(0,c.mkdirSync)(r,{recursive:!0});let i=At(r,qi(n));if(!Tt.has(i))return Tt.add(i),i;let o=(0,p.extname)(i),a=i.slice(0,i.length-o.length),s=1,l=`${a}-${s}${o}`;for(;Tt.has(l)||(0,c.existsSync)(l);)l=`${a}-${++s}${o}`;return Tt.add(l),l}function fs(t,e){typeof e!="string"||!(0,p.isAbsolute)(e)||D((0,p.basename)(e)??"")&&Tt.delete(e)}var Ct="voices";function ms(t,e){let n=D(t);return!n||!/^\d{1,25}$/.test(String(e??""))?null:`${n.slice(0,n.length-(0,p.extname)(n).length)}.${e}.webm`}function gs(t,e){let n=D(e);if(!n)return[];let r=(0,p.join)(S(t),Ct);if(!(0,c.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,p.extname)(n).length)}.`,o=[];for(let a of(0,c.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function vs(t,e,n,r,i){let o=ms(n,r);if(!o)return null;if(i.length>Zn)throw new Error("That voice track is too large to write");let a=(0,p.join)(S(e),Ct);(0,c.mkdirSync)(a,{recursive:!0});let s=(0,p.join)(a,o);return Yi(s,i),s}var Zn=64*1024*1024;function ys(t,e,n){let r=(0,p.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");let i=(0,p.join)(S(e),Ct,r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>Zn)throw new Error("That voice track is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>Zn)throw new Error("That voice track is too large to open");return s}finally{(0,c.closeSync)(o)}}function ws(t,e){let n=(0,p.join)(S(t),Ct);for(let{file:r}of gs(t,e))try{(0,c.unlinkSync)((0,p.join)(n,r))}catch{}}function bs(t,e){let n=S(e);if(!(0,c.existsSync)(n))return[];try{Qi(n)}catch{}let r=[],i=new Set,o=(0,c.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,p.join)(n,a.name);try{let l=(0,c.statSync)(s),h=H(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(h)?{thumb:h}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function Ss(t,e,n){let r=D(n);if(!r)throw new Error("That is not a clip name");let i=(0,p.join)(S(e),r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>Kn)throw new Error("That clip is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>Kn)throw new Error("That clip is too large to open");return s}finally{(0,c.closeSync)(o)}}var xs=".trash",Ji=".trash.json",Es=168*3600*1e3;function Mt(t){return(0,p.join)(t,xs)}function Rt(t){let e;try{e=JSON.parse((0,c.readFileSync)((0,p.join)(t,Ji),"utf8"))}catch{return{}}if(!e||typeof e!="object")return{};let n={};for(let[r,i]of Object.entries(e))/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.test(r)&&(!i||typeof i!="object"||i.stored!==r||(n[r]=i));return n}function Pt(t,e){(0,c.mkdirSync)(t,{recursive:!0}),(0,c.writeFileSync)((0,p.join)(t,Ji),JSON.stringify(e))}function Xi(t,e){if(!e)return;let n=(0,p.join)(t,Ct),r;try{r=(0,c.readdirSync)(n)}catch{return}for(let i of r)if(i.startsWith(`${e}.`)&&i.toLowerCase().endsWith(".webm"))try{(0,c.unlinkSync)((0,p.join)(n,i))}catch{}}function Qi(t){let e=Mt(t);if(!(0,c.existsSync)(e))return;let n=Rt(e),r=Date.now(),i=!1;for(let[o,a]of Object.entries(n))if(!(!a||r-(a.deletedAt??0)<Es)){for(let s of[o,H(o)])try{(0,c.unlinkSync)((0,p.join)(e,s))}catch{}Xi(t,(a.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,"")),delete n[o],i=!0}i&&Pt(e,n)}function Ts(t,e,n,r){let i=D(n);if(!i)throw new Error("That is not a clip name");if(r!==null&&(typeof r!="string"||r.length>1024*1024))throw new Error("That metadata is not metadata");let o=S(e),a=(0,p.join)(o,i);if(!(0,c.existsSync)(a))throw new Error("That clip is already gone");let s=Mt(o);(0,c.mkdirSync)(s,{recursive:!0});let l=At(s,i).split(/[\\/]/).pop()||i;(0,c.renameSync)(a,(0,p.join)(s,l));let h=H(i);if((0,c.existsSync)((0,p.join)(o,h)))try{(0,c.renameSync)((0,p.join)(o,h),(0,p.join)(s,H(l)))}catch{}let f=Rt(s);f[l]={stored:l,name:i,deletedAt:Date.now(),meta:r},Pt(s,f)}function ks(t,e,n){let r=D(n);if(!r)throw new Error("That is not a clip name");let i=S(e),o=Mt(i),a=Rt(o),s=a[r];if(!s||!(0,c.existsSync)((0,p.join)(o,r)))throw delete a[r],Pt(o,a),new Error("That clip is no longer in the trash");let l=At(i,s.name).split(/[\\/]/).pop()||s.name;(0,c.renameSync)((0,p.join)(o,r),(0,p.join)(i,l));let h=H(r);if((0,c.existsSync)((0,p.join)(o,h)))try{(0,c.renameSync)((0,p.join)(o,h),(0,p.join)(i,H(l)))}catch{}return delete a[r],Pt(o,a),{name:l,meta:s.meta??null}}function Ps(t,e){let n=S(e);Qi(n);let r=Mt(n),i=Rt(r),o=[];for(let[a,s]of Object.entries(i)){if(!s)continue;let l=0;try{l=(0,c.statSync)((0,p.join)(r,a)).size}catch{delete i[a];continue}let h="";try{let f=s.meta?JSON.parse(s.meta):null;f&&typeof f.game=="string"&&(h=f.game)}catch{}o.push({stored:a,name:s.name??a,size:l,deletedAt:s.deletedAt??0,game:h})}return o.sort((a,s)=>a.deletedAt-s.deletedAt)}function Is(t,e){let n=S(e),r=Mt(n);if((0,c.existsSync)(r)){for(let[i,o]of Object.entries(Rt(r))){for(let a of[i,H(i)])try{(0,c.unlinkSync)((0,p.join)(r,a))}catch{}o&&Xi(n,(o.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,""))}Pt(r,{})}}var eo=32*1024*1024;function As(){let t=(0,p.join)((0,rn.tmpdir)(),`clipper-spill-${process.pid}`);return(0,c.mkdirSync)(t,{recursive:!0}),t}function tr(t){if(!/^spill-\d+-[a-z0-9]+$/i.test(t))throw new Error("That is not a spill file");return(0,p.join)(As(),`${t}.frag`)}function Cs(t,e,n){if(n.length>eo)throw new Error("That spill chunk is too large");(0,c.writeFileSync)(tr(e),Buffer.from(n))}function Ms(t,e){let n=tr(e),r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>eo)throw new Error("That spill chunk is too large");return new Uint8Array((0,c.readFileSync)(r))}finally{(0,c.closeSync)(r)}}function Rs(t,e){for(let n of e)try{(0,c.unlinkSync)(tr(n))}catch{}}function _s(){let t=`clipper-spill-${process.pid}`,e;try{e=(0,c.readdirSync)((0,rn.tmpdir)())}catch{return}for(let n of e){if(!n.startsWith("clipper-spill-"))continue;let r=(0,p.join)((0,rn.tmpdir)(),n);if(n!==t){let i=0;try{i=Date.now()-(0,c.statSync)(r).mtimeMs}catch{continue}if(i<24*3600*1e3)continue}try{(0,c.rmSync)(r,{recursive:!0,force:!0})}catch{}}}async function Ds(t,e,n){let r=S(e),i=D(n);if(!i)throw new Error("That is not a clip name");let o=(0,p.join)(r,i);try{await y.shell.trashItem(o)}catch{(0,c.unlinkSync)(o)}ws(e,i);let a=(0,p.join)(r,H(i));if((0,c.existsSync)(a))try{await y.shell.trashItem(a)}catch{try{(0,c.unlinkSync)(a)}catch{}}}function Os(t,e,n,r){let i=S(e),o=D(n);if(!o)throw new Error("That is not a clip name");let a=(0,p.join)(i,o),s=(0,p.extname)(o),l=D(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let f=l.toLowerCase()===o.toLowerCase()?(0,p.join)(i,l):At(i,l);(0,c.renameSync)(a,f);let d=(0,p.join)(i,H(o));if((0,c.existsSync)(d))try{(0,c.renameSync)(d,(0,p.join)(i,H((0,p.basename)(f))))}catch{}return(0,p.basename)(f)}var to="clipper-library.json",qn=5*1024*1024;function Ls(t,e){let n=(0,p.join)(S(e),to);if(!(0,c.existsSync)(n))return"";try{let r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>qn)return"";let o=new Uint8Array((0,c.readFileSync)(r));return o.length>qn?"":Buffer.from(o).toString("utf8")}finally{(0,c.closeSync)(r)}}catch{return""}}function Vs(t,e,n){let r=S(e);if((0,c.mkdirSync)(r,{recursive:!0}),String(n??"").length>qn)throw new Error("That library document is too large to write");let i=(0,p.join)(r,to),o=`${i}.tmp`;(0,c.writeFileSync)(o,String(n??""),"utf8"),(0,c.renameSync)(o,i)}async function Fs(t){let e=await y.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return e.canceled?[]:e.filePaths}var Ns=512*1024*1024;function Us(t,e){if(!(0,p.isAbsolute)(e)||!/\.(mp4|webm|mkv|mov|m4v)$/i.test(e))throw new Error("Not a video file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>Ns){let i=Math.round(r/1048576);throw new Error(`That video is ${i} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function $s(t){let e=await y.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return e.canceled?[]:e.filePaths}var Gs=64*1024*1024;function Ws(t,e){if(!(0,p.isAbsolute)(e)||!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(e))throw new Error("Not an audio file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>Gs){let i=Math.round(r/1048576);throw new Error(`That sound is ${i} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function zs(t){let e=await y.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return e.canceled?[]:e.filePaths}var Bs=24*1024*1024,js=64*1024*1024;function Hs(t,e){if(!(0,p.isAbsolute)(e)||!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(e))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(e),r=n?js:Bs,i=(0,c.openSync)(e,"r");try{let{size:o}=(0,c.fstatSync)(i);if(o>r){let a=Math.round(o/1048576),s=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${a} MB; the montage caps them at ${s} MB.`)}return new Uint8Array((0,c.readFileSync)(i))}finally{(0,c.closeSync)(i)}}function Ks(t,e,n){let r=D(n);if(!r)throw new Error("That is not a clip name");y.shell.showItemInFolder((0,p.join)(S(e),r))}function Zs(t,e){return S(e)}async function qs(t,e){let n=await y.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:S(e),properties:["openDirectory","createDirectory"]});return n.canceled?"":n.filePaths[0]??""}function Ys(t,e){let n=S(e);(0,c.mkdirSync)(n,{recursive:!0}),y.shell.openPath(n)}function Js(t){return{platform:"win32",wayland:er,vesktop:Zi,overlay:Jt()}}var ge=new Set;async function Xs(t,e=!0){if(er)return[];let n=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:e?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(ge.size){let i=new Set(n.map(o=>o.id));for(let o of ge)i.has(o)||ge.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!e){if(!o&&ge.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if(Ki&&!o&&a){ge.add(i.id);continue}ge.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function Qs(t){try{return y.app.getAppMetrics().map(e=>({type:e.serviceName||e.type,mb:Math.round((e.memory?.workingSetSize??0)/1024)})).filter(e=>e.mb>0).sort((e,n)=>n.mb-e.mb)}catch{return[]}}async function el(t){if(er)return"";let e=await y.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!e.length)return"";try{let n=y.screen.getDisplayNearestPoint(y.screen.getCursorScreenPoint()),r=e.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return e[0].id}var Yn="",Jn=!1;function tl(t,e,n=!0){return!n||Zi?!1:(Yn=e??"",Jn=!0,y.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(h=>h.id===Yn),l=(a&&!ge.has(a.id)?a:void 0)??o.find(h=>h.id.startsWith("screen:"))??o.find(h=>!ge.has(h.id));if(!l){i({});return}i(Ki&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function nl(t){Yn="",Jn&&(Jn=!1,y.session.defaultSession.setDisplayMediaRequestHandler(null))}var Xn=new Map,ve=[],kt=[];function rl(t){let e=ve.shift();if(e){e(t);return}kt.push(t),kt.length>8&&kt.shift()}function il(t,e){nr();let n=[];for(let[r,i]of Object.entries(e)){if(r!=="save"&&r!=="toggle"&&r!=="mark"&&r!=="pov"&&r!=="replay"||!i)continue;let o=!1;try{o=y.globalShortcut.register(i,()=>rl(r))}catch{o=!1}o?Xn.set(r,i):n.push(i)}return n}function nr(t){for(let n of Xn.values())try{y.globalShortcut.unregister(n)}catch{}Xn.clear(),kt=[];let e=ve;ve=[];for(let n of e)n(null)}function ol(t,e=3e4){let n=kt.shift();if(n)return Promise.resolve(n);let r=Math.min(12e4,Math.max(1e3,Number(e)||3e4));return ve.length>32&&ve.shift()?.(null),new Promise(i=>{let o=!1,a=l=>{o||(o=!0,clearTimeout(s),i(l))},s=setTimeout(()=>{ve=ve.filter(l=>l!==a),a(null)},r);ve.push(a)})}y.app.on("will-quit",()=>nr());function al(t,e){return hi(e)}function sl(t){return Fn()}function ll(t){return Kt()}function cl(t,e=3e4){return mi(e)}function ul(t,e){return Gi(e)}function dl(t){return Hn()}function pl(t){return tn()}function hl(t){return Wi()}function fl(t,e,n,r,i){return zi(new Uint8Array(e),n,r,i)}function ml(t){return Bi()}function gl(t,e=3e4){return ji(e)}y.app.on("will-quit",()=>{Fn()});var vl=["top-left","top-right","bottom-left","bottom-right"];function Je(t,e,n,r){let i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(e,Math.round(i))):r}function no(t){return vl.includes(t)?t:"bottom-right"}function yl(t){return{corner:no(t?.corner),width:Je(t?.width,200,1280,420),volume:Je(t?.volume,0,100,0),seconds:Je(t?.seconds,0,300,10)}}function Qn(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function wl(t,e,n,r){let i=D(n);if(!i)return!1;let o=(0,p.join)(S(e),i);return(0,c.existsSync)(o)?bi(o,yl(r)):!1}function bl(t,e,n,r){return y.BrowserWindow.getFocusedWindow()||$n()?!1:Si(Qn(e,60),Qn(n,90),no(r))}function Sl(t){Ae()}var xl=200;function El(t){return Array.isArray(t)?t.map(Number).filter(e=>Number.isFinite(e)&&e>=0).slice(0,xl):[]}function Tl(t){return{width:Je(t?.width,360,1600,720),volume:Je(t?.volume,0,100,0)}}function kl(t,e,n,r,i){let o=D(n);if(!o)return!1;let a=(0,p.join)(S(e),o);return(0,c.existsSync)(a)?Ii({name:o,path:a,markers:El(r)},Tl(i)):!1}function Pl(t){wt()}function Il(t){return $n()}function Al(t,e=3e4){return Ti(Je(e,1e3,12e4,3e4))}function Cl(t){ki()}function Ml(t,e,n,r){Pi({ok:!!e,message:Qn(n,120),close:!!r})}function Rl(t){let e=y.BrowserWindow.fromWebContents(t.sender);!e||e.isDestroyed()||(e.isMinimized()&&e.restore(),e.show(),e.focus())}var It="kebab1337420/Clibab",_l=`VencordClipper (+https://github.com/${It})`,nn=256*1024*1024;function Dl(t){let e="";try{let n=new URL(t);if(n.protocol!=="https:")return!1;e=n.hostname.toLowerCase()}catch{return!1}return e==="api.github.com"||e==="github.com"||e==="codeload.github.com"||e==="raw.githubusercontent.com"||e==="objects.githubusercontent.com"||e.endsWith(".githubusercontent.com")}function an(t,e=0){return Dl(t)?new Promise((n,r)=>{let i=(0,Hi.get)(t,{headers:{"User-Agent":_l,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),e>=5?r(new Error(`Too many redirects for ${t}`)):n(an(new URL(s,t).toString(),e+1));return}let l=[],h=0,{"content-length":f}=o.headers;if(f&&Number(f)>nn){o.destroy(new Error(`${t} answered ${f} bytes, over the ${nn} byte cap`));return}o.on("data",d=>{if(h+=d.length,h>nn){o.destroy(new Error(`${t} exceeded the ${nn} byte cap`));return}l.push(d)}),o.on("end",()=>n({status:a,body:Buffer.concat(l)})),o.on("error",r)});i.setTimeout(6e4,()=>i.destroy(new Error(`${t} timed out`))),i.on("error",r)}):Promise.reject(new Error(`Refusing to fetch outside the update hosts: ${t}`))}async function Ol(t){let{status:e,body:n}=await an(t);if(e!==200)throw new Error(`${t} answered ${e}`);return n}function rr(){return __dirname}function ro(t){return(0,c.existsSync)((0,p.join)(t,"patcher.js"))&&(0,c.existsSync)((0,p.join)(t,"renderer.js"))}function io(t){try{return(0,c.accessSync)(t,c.constants.W_OK),!0}catch{return!1}}function oo(t,e){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(t),i=n(e);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function Ll(t,e){let n=await Ol(`https://api.github.com/repos/${It}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=rr();return{version:o,tag:i,available:!!o&&oo(o,e),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${It}/releases`),directory:a,writable:ro(a)&&io(a)}}async function Vl(t){let{status:e,body:n}=await an(`https://raw.githubusercontent.com/${It}/${t}/prebuilt/build-info.json`);if(e===404)return null;if(e!==200)throw new Error(`The release's file list answered ${e}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return r}async function Fl(t,e,n){if(!/^[\w.-]{1,40}$/.test(e))throw new Error(`Refusing to fetch a release named ${e}`);if(!oo(e.replace(/^v/i,""),String(n??"")))throw new Error(`Refusing to install ${e}: it is not newer than the installed bundle`);let r=rr();if(!ro(r))throw new Error(`No installed bundle at ${r}`);if(!io(r))throw new Error(`${r} is read-only`);let i=await Vl(e);if(!i)throw new Error(`The release under ${e} carries no file list; refusing to install it unchecked`);let o=Object.keys(i),a=(0,p.join)(r,`.clipper-update-${(0,on.randomBytes)(8).toString("hex")}`);if((0,c.existsSync)(a))throw new Error("An update staging folder is already there; refusing to share it");(0,c.mkdirSync)(a,{recursive:!0});try{let s=[];for(let d of o){if(d!==(0,p.basename)(d)||d.startsWith("."))throw new Error(`Refusing a release file named ${d}`);let{status:v,body:T}=await an(`https://raw.githubusercontent.com/${It}/${e}/prebuilt/dist/${d}`);if(v!==200)throw new Error(`${d} answered ${v}`);if(T.length===0)throw new Error(`${d} came back empty`);let O=i[d];if(O?.size===void 0||!O?.sha256)throw new Error(`${d} has no size and hash in the release's file list`);if(T.length!==O.size)throw new Error(`${d} is ${T.length} bytes, the release says ${O.size}`);if((0,on.createHash)("sha256").update(T).digest("hex").toLowerCase()!==O.sha256.toLowerCase())throw new Error(`${d} does not match its hash`);(0,c.writeFileSync)((0,p.join)(a,d),T),s.push(d)}if(s.length===0)throw new Error(`There is no bundle published under ${e}`);for(let d of["renderer.js","patcher.js"])if(!s.includes(d))throw new Error(`The release carries no ${d}`);if(!(0,c.readFileSync)((0,p.join)(a,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let l=(0,p.join)(a,".previous");(0,c.mkdirSync)(l,{recursive:!0});let h=[],f=[];try{for(let d of s){let v=(0,p.join)(r,d);(0,c.existsSync)(v)&&((0,c.renameSync)(v,(0,p.join)(l,d)),h.push(d)),(0,c.renameSync)((0,p.join)(a,d),v),f.push(d)}}catch(d){for(let v of f)try{(0,c.unlinkSync)((0,p.join)(r,v))}catch{}for(let v of h)try{(0,c.renameSync)((0,p.join)(l,v),(0,p.join)(r,v))}catch{}throw new Error(`The update could not be put in place (${d.message}). The bundle that was there has been put back.`)}return s}finally{(0,c.rmSync)(a,{recursive:!0,force:!0})}}function Nl(t){y.app.relaunch(),y.app.quit(),setTimeout(()=>y.app.exit(0),3e3)}var ao={AppleMusicRichPresence:Tn,ConsoleShortcuts:kn,FixSpotifyEmbeds:Jr,FixYoutubeEmbeds:Qr,OpenInApp:Rn,Translate:_n,VoiceMessages:Dn,XSOverlay:On,YoutubeAdblock:oi,Clipper:ir};var so={};for(let[t,e]of Object.entries(ao)){let n=Object.entries(e);if(!n.length)continue;let r=so[t]={};for(let[i,o]of n){let a=`VencordPluginNative_${t}_${i}`;or.ipcMain.handle(a,o),r[i]=a}}or.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=so});ie();u();function ar(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}Ne();var b=require("electron");u();var lo="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var ae=require("fs"),we=require("fs/promises"),wo=require("os"),sn=require("path");u();ie();Ne();var Xe=require("electron");u();ie();var sr=require("electron"),K=["connect-src"],$=[...K,"img-src"],po=["style-src","font-src"],co=[...$,"media-src"],E=[...$,...po],uo=[...E,"script-src","worker-src"],cr={"http://localhost:*":E,"http://127.0.0.1:*":E,"localhost:*":E,"127.0.0.1:*":E,"*.github.io":E,"github.com":E,"raw.githubusercontent.com":E,"*.gitlab.io":E,"gitlab.com":E,"*.codeberg.page":E,"codeberg.org":E,"*.githack.com":E,"jsdelivr.net":E,"fonts.googleapis.com":po,"i.imgur.com":$,"i.ibb.co":$,"i.pinimg.com":$,"files.catbox.moe":E,"cdn.discordapp.com":E,"media.discordapp.net":$,"cdnjs.cloudflare.com":uo,"cdn.jsdelivr.net":uo,"api.github.com":K,"ws.audioscrobbler.com":K,"musicbrainz.org":K,"*.listenbrainz.org":K,"coverartarchive.org":K,"archive.org":K,"*.archive.org":K,"translate-pa.googleapis.com":K,"*.vencord.dev":$,"manti.vendicated.dev":$,"decor.fieryflames.dev":K,"ugc.decor.fieryflames.dev":$,"sponsor.ajay.app":K,"dearrow-thumb.ajay.app":$,"usrbg.is-hardly.online":$,"icons.duckduckgo.com":$,"*.tenor.com":co,"*.tenor.co":co},lr=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),Ul=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},$l=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),Gl=t=>{let e=lr(t,"content-security-policy-report-only");e&&delete t[e];let n=lr(t,"content-security-policy");if(n){let r=Ul(t[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(J.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(cr))for(let s of a)i(s,o);t[n]=[$l(r)]}};function ho(){sr.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&Gl(t),e==="stylesheet")){let r=lr(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),sr.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function fo(){Xe.ipcMain.handle("VencordCspRemoveOverride",jl),Xe.ipcMain.handle("VencordCspRequestAddOverride",Bl),Xe.ipcMain.handle("VencordCspIsDomainAllowed",Hl)}function Wl(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!E.includes(n)))}function zl(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Discord for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let a=e.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function Bl(t,e,n,r){if(!Wl(e,n))return"invalid";let i=new URL(e).host;if(i in J.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await Xe.dialog.showMessageBox({...zl(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(J.store.customCspRules[i]=n,"ok"):"unchecked"}function jl(t,e){return e in J.store.customCspRules?(delete J.store.customCspRules[e],!0):!1}function Hl(t,e,n){try{let r=new URL(e).host,i=cr[r]??J.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}u();var Kl=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,Zl=/^\\@/;function ur(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function mo(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function go(t,e){if(!t)return ur(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return ur(e);let r={},i="",o="";for(let a of n.split(Kl))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace(Zl,"@");return r[i]=o.trim(),delete r[""],ur(e,r)}Ge();u();var Qe=require("path");function ye(t,e){let n=(0,Qe.normalize)(t+"/"),r=(0,Qe.join)(t,e),i=(0,Qe.normalize)(r);return i===(0,Qe.normalize)(t)||i.startsWith(n)?i:null}u();var vo=require("electron");function yo(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":vo.shell.openExternal(e)}return{action:"deny"}})}var ql=(0,sn.join)(__dirname,"renderer.css");(0,ae.mkdirSync)(de,{recursive:!0});fo();function bo(){return(0,we.readFile)($e,"utf-8").catch(()=>"")}async function Yl(){let t=await(0,we.readdir)(de).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await So(n).then(mo).catch(()=>null);r!=null&&e.push(go(r,n))}return e}function So(t){t=t.replace(/\?v=\d+$/,"");let e=ye(de,t);return e?(0,we.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}b.ipcMain.handle("VencordOpenQuickCss",()=>b.shell.openPath($e));b.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!Kr.includes(n))throw"Disallowed protocol.";b.shell.openExternal(e).catch(r=>console.error("[Vencord] Failed to open external link",e,r))});b.ipcMain.handle("VencordGetQuickCss",()=>bo());b.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,ae.writeFileSync)($e,e));b.ipcMain.handle("VencordGetThemesList",()=>Yl());b.ipcMain.handle("VencordGetThemeData",(t,e)=>So(e));b.ipcMain.handle("VencordGetThemeSystemValues",()=>{let t=b.systemPreferences.getAccentColor?.()??"";return t.length&&t[0]!=="#"&&(t=`#${t}`),{"os-accent-color":t}});b.ipcMain.handle("VencordOpenThemesFolder",()=>b.shell.openPath(de));b.ipcMain.handle("VencordOpenSettingsFolder",()=>b.shell.openPath(Ee));var dr=[];b.ipcMain.handle("VencordInitFileWatchers",({sender:t})=>{dr.forEach(i=>i.close());let e,n;(0,we.open)($e,"a+").then(i=>{i.close(),e=(0,ae.watch)($e,{persistent:!1},ar(async()=>{t.postMessage("VencordQuickCssUpdate",await bo())},50))}).catch(()=>{});let r=(0,ae.watch)(de,{persistent:!1},ar(()=>{t.postMessage("VencordThemeUpdate",void 0)}));dr=[e,r,n].filter(Boolean),t.once("destroyed",()=>{e?.close(),r.close(),n?.close(),dr=[]})});b.ipcMain.on("VencordGetMonacoTheme",t=>{t.returnValue=b.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});b.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=b.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new b.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:b.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,sn.join)(__dirname,"preload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});yo(n),await n.loadURL(`data:text/html;base64,${lo}`)});b.ipcMain.handle("VencordGetRendererCss",()=>(0,we.readFile)(ql,"utf-8"));b.ipcMain.on("VencordPreloadGetRendererJs",t=>{t.returnValue=(0,ae.readFileSync)((0,sn.join)(__dirname,"renderer.js"),"utf-8")});b.ipcMain.on("VencordSupportsWindowsMaterial",t=>{t.returnValue=Number((0,wo.release)().split(".")[2])>=22621});var De=require("electron"),qo=require("path"),xr=require("url");ie();Ge();u();var fn=require("electron");u();var To=require("module"),Jl=(0,To.createRequire)("/"),et,cn,hr,Xl=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{et=Jl("worker_threads"),cn=et.Worker,hr=et.isMarkedAsUntransferable}catch{}var Ql=cn?function(t,e,n,r,i){var o=!1,a=new cn(t+Xl,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return hr&&(r=r.filter(function(s){return!hr(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,cn.prototype.terminate.call(a)},a}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},C=Uint8Array,_e=Uint16Array,ko=Int32Array,mr=new C([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),gr=new C([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Po=new C([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Io=function(t,e){for(var n=new _e(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new ko(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},et=Io(mr,2),vr=et.b,ec=et.r;vr[28]=258,ec[258]=28;var Ao=Io(gr,0),Co=Ao.b,kd=Ao.r,pn=new _e(32768);for(w=0;w<32768;++w)se=(w&43690)>>1|(w&21845)<<1,se=(se&52428)>>2|(se&13107)<<2,se=(se&61680)>>4|(se&3855)<<4,pn[w]=((se&65280)>>8|(se&255)<<8)>>1;var se,w,tt=(function(t,e,n){for(var r=t.length,i=0,o=new _e(e);i<r;++i)t[i]&&++o[t[i]-1];var a=new _e(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new _e(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var h=i<<4|t[i],f=e-t[i],d=a[t[i]-1]++<<f,v=d|(1<<f)-1;d<=v;++d)s[pn[d]>>l]=h}else for(s=new _e(r),i=0;i<r;++i)t[i]&&(s[i]=pn[a[t[i]-1]++]>>15-t[i]);return s}),_t=new C(288);for(w=0;w<144;++w)_t[w]=8;var w;for(w=144;w<256;++w)_t[w]=9;var w;for(w=256;w<280;++w)_t[w]=7;var w;for(w=280;w<288;++w)_t[w]=8;var w,Mo=new C(32);for(w=0;w<32;++w)Mo[w]=5;var w;var Ro=tt(_t,9,1);var _o=tt(Mo,5,1),un=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},G=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},dn=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},Do=function(t){return(t+7)/8|0},hn=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new C(t.subarray(e,n))};var Oo=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],P=function(t,e,n){var r=new Error(e||Oo[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,P),!n)throw r;return r},Lo=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new C(0);var a=!n,s=a||e.i!=2,l=e.i;a&&(n=new C(i*3));var h=function(Ar){var Cr=n.length;if(Ar>Cr){var Mr=new C(Math.max(Cr*2,Ar));Mr.set(n),n=Mr}},f=e.f||0,d=e.p||0,v=e.b||0,T=e.l,O=e.d,Y=e.m,L=e.n,V=i*8;do{if(!T){f=G(t,d,1);var le=G(t,d+1,3);if(d+=3,le)if(le==1)T=Ro,O=_o,Y=9,L=5;else if(le==2){var nt=G(t,d,31)+257,Dt=G(t,d+10,15)+4,Se=nt+G(t,d+5,31)+1;d+=14;for(var F=new C(Se),Le=new C(19),k=0;k<Dt;++k)Le[Po[k]]=G(t,d+k*3,7);d+=Dt*3;for(var rt=un(Le),Yo=(1<<rt)-1,Jo=tt(Le,rt,1),k=0;k<Se;){var Er=Jo[G(t,d,Yo)];d+=Er&15;var I=Er>>4;if(I<16)F[k++]=I;else{var Ve=0,Ot=0;for(I==16?(Ot=3+G(t,d,3),d+=2,Ve=F[k-1]):I==17?(Ot=3+G(t,d,7),d+=3):I==18&&(Ot=11+G(t,d,127),d+=7);Ot--;)F[k++]=Ve}}var Tr=F.subarray(0,nt),ce=F.subarray(nt);Y=un(Tr),L=un(ce),T=tt(Tr,Y,1),O=tt(ce,L,1)}else P(1);else{var I=Do(d)+4,re=t[I-4]|t[I-3]<<8,Oe=I+re;if(Oe>i){l&&P(0);break}s&&h(v+re),n.set(t.subarray(I,Oe),v),e.b=v+=re,e.p=d=Oe*8,e.f=f;continue}if(d>V){l&&P(0);break}}s&&h(v+131072);for(var Xo=(1<<Y)-1,Qo=(1<<L)-1,mn=d;;mn=d){var Ve=T[dn(t,d)&Xo],Fe=Ve>>4;if(d+=Ve&15,d>V){l&&P(0);break}if(Ve||P(2),Fe<256)n[v++]=Fe;else if(Fe==256){mn=d,T=null;break}else{var kr=Fe-254;if(Fe>264){var k=Fe-257,it=mr[k];kr=G(t,d,(1<<it)-1)+vr[k],d+=it}var gn=O[dn(t,d)&Qo],vn=gn>>4;gn||P(3),d+=gn&15;var ce=Co[vn];if(vn>3){var it=gr[vn];ce+=dn(t,d)&(1<<it)-1,d+=it}if(d>V){l&&P(0);break}s&&h(v+131072);var Pr=v+kr;if(v<ce){var Ir=o-ce,ea=Math.min(ce,Pr);for(Ir+v<0&&P(3);v<ea;++v)n[v]=r[Ir+v]}for(;v<Pr;++v)n[v]=n[v-ce]}}e.l=T,e.p=mn,e.b=v,e.f=f,T&&(f=1,e.m=Y,e.d=O,e.n=L)}while(!f);return v!=n.length&&a?hn(n,0,v):n.subarray(0,v)};var tc=new C(0);var nc=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},xo=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){e+=";"+l+"=";var h=s.toString();if(s.prototype)if(h.indexOf("[native code]")!=-1){var f=h.indexOf(" ",8)+1;e+=h.slice(f,h.indexOf("(",f))}else{e+=h;for(var d in s.prototype)e+=";"+l+".prototype."+d+"="+s.prototype[d].toString()}else e+=h}else n[l]=s}return e},ln=[],rc=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},ic=function(t,e,n,r){if(!ln[n]){for(var i="",o={},a=t.length-1,s=0;s<a;++s)i=xo(t[s],i,o);ln[n]={c:xo(t[a],i,o),e:o}}var l=nc({},ln[n].e);return Ql(ln[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,rc(l),r)},oc=function(){return[C,_e,ko,mr,gr,Po,vr,Co,Ro,_o,pn,Oo,tt,un,G,dn,Do,hn,P,Lo,yr,Vo,Fo]};var Vo=function(t){return postMessage(t,[t.buffer])},Fo=function(t){return t&&{out:t.size&&new C(t.size),dictionary:t.dictionary}},ac=function(t,e,n,r,i,o){var a=ic(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([t,e],e.consume?[t.buffer]:[]),function(){a.terminate()}};var ee=function(t,e){return t[e]|t[e+1]<<8},W=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},pr=function(t,e){return W(t,e)+W(t,e+4)*4294967296};function sc(t,e,n){return n||(n=e,e={}),typeof n!="function"&&P(7),ac(t,e,[oc],function(r){return Vo(yr(r.data[0],Fo(r.data[1])))},1,n)}function yr(t,e){return Lo(t,{i:2},e&&e.out,e&&e.dictionary)}var fr=typeof TextDecoder<"u"&&new TextDecoder,lc=0;try{fr.decode(tc,{stream:!0}),lc=1}catch{}var cc=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:hn(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function uc(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(fr)return fr.decode(t);var i=cc(t),o=i.s,n=i.r;return n.length&&P(8),o}}var dc=function(t,e){return e+30+ee(t,e+26)+ee(t,e+28)},pc=function(t,e,n){var r=ee(t,e+28),i=ee(t,e+30),o=uc(t.subarray(e+46,e+46+r),!(ee(t,e+8)&2048)),a=e+46+r,s=hc(t,a,i,n,W(t,e+20),W(t,e+24),W(t,e+42)),l=s[0],h=s[1],f=s[2];return[ee(t,e+10),l,h,o,a+i+ee(t,e+32),f]},hc=function(t,e,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,h=a==4294967295,f=e+n,d=s+l+h;if(r&&d){for(;e+4<f;e+=4+ee(t,e+2))if(ee(t,e)==1)return[s?pr(t,e+4+8*l):i,l?pr(t,e+4):o,h?pr(t,e+4+8*(l+s)):a,1];r<2&&P(13)}return[i,o,a,0]};var Eo=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function No(t,e,n){n||(n=e,e={}),typeof n!="function"&&P(7);var r=[],i=function(){for(var L=0;L<r.length;++L)r[L]()},o={},a=function(L,V){Eo(function(){n(L,V)})};Eo(function(){a=n});for(var s=t.length-22;W(t,s)!=101010256;--s)if(!s||t.length-s>65558)return a(P(13,0,1),null),i;var l=ee(t,s+8);if(l){var h=l,f=W(t,s+16),d=W(t,s-20)==117853008;if(d){var v=W(t,s-12);d=W(t,v)==101075792,d&&(h=l=W(t,v+32),f=W(t,v+48))}for(var T=e&&e.filter,O=function(L){var V=pc(t,f,d),le=V[0],I=V[1],re=V[2],Oe=V[3],nt=V[4],Dt=V[5],Se=dc(t,Dt);f=nt;var F=function(k,rt){k?(i(),a(k,null)):(rt&&(o[Oe]=rt),--l||a(null,o))};if(!T||T({name:Oe,size:I,originalSize:re,compression:le}))if(!le)F(null,hn(t,Se,Se+I));else if(le==8){var Le=t.subarray(Se,Se+I);if(re<524288||I>.8*re)try{F(null,yr(Le,{out:new C(re)}))}catch(k){F(k,null)}else r.push(sc(Le,{size:re},F))}else F(P(14,"unknown compression type "+le,1),null);else F(null,null)},Y=0;Y<h;++Y)O(Y)}else a(null,{});return i}var Go=require("fs"),te=require("fs/promises"),wr=require("path");Ge();u();function Uo(t){function e(a,s,l,h){let f=0;return f+=a<<0,f+=s<<8,f+=l<<16,f+=h<<24>>>0,f}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let a=e(t[8],t[9],t[10],t[11]),s=e(t[12],t[13],t[14],t[15]),l=16+a+s;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}u();var fc=require("original-fs");async function mc(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function $o(t,e){let r=await(await mc(t,e)).arrayBuffer();return Buffer.from(r)}var gc=(0,wr.join)(Ft,"ExtensionCache");async function vc(t,e){return await(0,te.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{No(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let d=ye(e,a);if(!d)throw new Error(`Path traversal detected: "${a}"`);return void await(0,te.mkdir)(d,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),h=ye(e,l);if(!h)throw new Error(`Path traversal detected: "${a}"`);let f=ye(e,a);if(!f)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,te.mkdir)(h,{recursive:!0}),await(0,te.writeFile)(f,o[a])})).then(()=>n()).catch(a=>{(0,te.rm)(e,{recursive:!0,force:!0}),r(a)})})})}async function Wo(t){let e=(0,wr.join)(gc,t);try{await(0,te.access)(e,Go.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await $o(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await vc(Uo(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}fn.session.defaultSession.extensions?fn.session.defaultSession.extensions.loadExtension(e):fn.session.defaultSession.loadExtension(e)}Nt||De.app.whenReady().then(()=>{De.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=ye(de,n);return r?De.net.fetch((0,xr.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return De.net.fetch((0,xr.pathToFileURL)((0,qo.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{A.store.enableReactDevtools&&Wo("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}ho()});Zo();
//# sourceURL=file:///VencordPatcher
//# sourceMappingURL=vencord://patcher.js.map
/*! For license information please see patcher.js.LEGAL.txt */

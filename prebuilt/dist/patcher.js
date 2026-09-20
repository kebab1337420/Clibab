// Vencord 59a5428
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var Qo=Object.create;var Lt=Object.defineProperty;var ea=Object.getOwnPropertyDescriptor;var ta=Object.getOwnPropertyNames;var na=Object.getPrototypeOf,ra=Object.prototype.hasOwnProperty;var B=(t,e,n)=>()=>{if(n)throw n[0];try{return t&&(e=t(t=0)),e}catch(r){throw n=[r],r}};var Se=(t,e)=>{for(var n in e)Lt(t,n,{get:e[n],enumerable:!0})},Ar=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of ta(e))!ra.call(t,i)&&i!==n&&Lt(t,i,{get:()=>e[i],enumerable:!(r=ea(e,i))||r.enumerable});return t};var vn=(t,e,n)=>(n=t!=null?Qo(na(t)):{},Ar(e||!t||!t.__esModule?Lt(n,"default",{value:t,enumerable:!0}):n,t)),yn=t=>Ar(Lt({},"__esModule",{value:!0}),t);var u=B(()=>{"use strict"});var Ve=B(()=>{"use strict";u()});function it(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var Cr=B(()=>{"use strict";u()});var la={};function Fe(...t){let e={cwd:Dr};return bn?wn("flatpak-spawn",["--host","git",...t],e):wn("git",t,e)}async function ia(){return(await Fe("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function oa(){await Fe("fetch");let t=(await Fe("branch","--show-current")).stdout.trim();if(!((await Fe("ls-remote","origin",t)).stdout.length>0))return[];let r=(await Fe("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function aa(){return(await Fe("pull")).stdout.includes("Fast-forward")}async function sa(){return!(await wn(bn?"flatpak-spawn":"node",bn?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:Dr})).stderr.includes("Build failed")}var Rr,ot,Mr,_r,Dr,wn,bn,Or=B(()=>{"use strict";u();Ve();Rr=require("child_process"),ot=require("electron"),Mr=require("path"),_r=require("util");Cr();Dr=(0,Mr.join)(__dirname,".."),wn=(0,_r.promisify)(Rr.execFile),bn=!1;ot.ipcMain.handle("VencordGetRepo",it(ia));ot.ipcMain.handle("VencordGetUpdates",it(oa));ot.ipcMain.handle("VencordUpdate",it(aa));ot.ipcMain.handle("VencordBuild",it(sa))});var kn,Ur,at,Gr=B(()=>{"use strict";u();kn=Symbol("SettingsStore.isProxy"),Ur=Symbol("SettingsStore.getRawTarget"),at=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===kn)return!0;if(r===Ur)return n;let o=Reflect.get(n,r,i),a=e.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[kn]){let f=`${l}${l&&"."}${r}`;return e.makeProxy(o,s,f)}return o},set(n,r,i){if(i?.[kn]&&(i=i[Ur]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return e.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return e.notifyListeners(s,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyPrefixListeners(e,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,e))}}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,f)=>l[f],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n)),this.notifyPrefixListeners(e,i,n)}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}addPrefixChangeListener(e,n){let r=this.prefixListeners.get(e)??new Set;r.add(n),this.prefixListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}removePrefixChangeListener(e,n){let r=this.prefixListeners.get(e);r&&(r.delete(n),r.size||this.prefixListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}}});function Pn(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},Pn(t[n],r)):t[n]??=r}return t}var Wr=B(()=>{"use strict";u()});var zr,ue,Ft,xe,de,Ne,In,An,Br,Nt,$e=B(()=>{"use strict";u();zr=require("electron"),ue=require("path"),Ft=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,ue.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,ue.join)(zr.app.getPath("userData"),"..","Vencord")),xe=(0,ue.join)(Ft,"settings"),de=(0,ue.join)(Ft,"themes"),Ne=(0,ue.join)(xe,"quickCss.css"),In=(0,ue.join)(xe,"settings.json"),An=(0,ue.join)(xe,"native-settings.json"),Br=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"],Nt=process.argv.includes("--vanilla")});function jr(t,e){try{return JSON.parse((0,Ee.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var Cn,Ee,M,pa,Hr,J,ie=B(()=>{"use strict";u();Ve();Gr();Wr();Cn=require("electron"),Ee=require("fs");$e();(0,Ee.mkdirSync)(xe,{recursive:!0});M=new at(jr("renderer",In));M.addGlobalChangeListener(()=>{try{(0,Ee.writeFileSync)(In,JSON.stringify(M.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});Cn.ipcMain.on("VencordGetSettings",t=>t.returnValue=M.plain);Cn.ipcMain.handle("VencordSetSettings",(t,e,n)=>{M.setData(e,n)});pa={plugins:{},customCspRules:{}},Hr=jr("native",An);Pn(Hr,pa);J=new at(Hr);J.addGlobalChangeListener(()=>{try{(0,Ee.writeFileSync)(An,JSON.stringify(J.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}})});function Go(t,e,n){let r=e;if(e in t)return void n(t[r]);Object.defineProperty(t,e,{set(i){delete t[r],t[r]=i,n(i)},configurable:!0,enumerable:!1})}var Wo=B(()=>{"use strict";u()});var wc={};function yc(t,e){let n=t.slice(4).split(".").map(Number),r=e.slice(4).split(".").map(Number);for(let i=0;i<r.length;i++){if(n[i]>r[i])return!0;if(n[i]<r[i])return!1}return!1}function zo(){if(!process.env.DISABLE_UPDATER_AUTO_PATCHING)try{let t=(0,q.dirname)(process.execPath),e=(0,q.basename)(t),n=(0,q.join)(t,".."),r=(0,ne.readdirSync)(n).reduce((f,h)=>h.startsWith("app-")&&yc(h,f)?h:f,e);if(r===e)return;let i=(0,q.join)(n,e,"resources"),o=(0,q.join)(i,"app.asar"),a=(0,q.join)(n,r,"resources"),s=(0,q.join)(a,"app.asar"),l=(0,q.join)(a,"_app.asar");if(!(0,ne.existsSync)(o)||!(0,ne.existsSync)(s)||(0,ne.existsSync)(l))return;console.info(`[Vencord] Detected Host Update (${e} -> ${r}). Repatching...`),(0,ne.renameSync)(s,l),(0,ne.copyFileSync)(o,s)}catch(t){console.error("[Vencord] Failed to repatch latest host update",t)}}var Bo,vr,ne,q,jo=B(()=>{"use strict";u();Bo=require("electron"),vr=vn(require("events")),ne=require("original-fs"),q=require("path");vr.default.prototype.emit=new Proxy(vr.default.prototype.emit,{apply(t,e,n){return n[0]==="host-updated"&&zo(),Reflect.apply(t,e,n)}}),Bo.app.on("before-quit",zo)});var Ec={};var Y,we,bc,Sc,yr,xc,Ho=B(()=>{"use strict";u();Wo();Y=vn(require("electron")),we=require("path");ie();$e();console.log("[Vencord] Starting up...");bc=require.main.filename,Sc=require.main.path.endsWith("app.asar")?"_app.asar":"app.asar",yr=(0,we.join)((0,we.dirname)(bc),"..",Sc),xc=require((0,we.join)(yr,"package.json"));require.main.filename=(0,we.join)(yr,xc.main);Y.app.setAppPath(yr);if(Nt)console.log("[Vencord] Running in vanilla mode. Not loading Vencord");else{let t=M.store;if(jo(),t.winCtrlQ){let r=Y.Menu.buildFromTemplate;Y.Menu.buildFromTemplate=function(i){if(i[0]?.label==="&File"){let{submenu:o}=i[0];Array.isArray(o)&&o.push({label:"Quit (Hidden)",visible:!1,acceleratorWorksWhenHidden:!0,accelerator:"Control+Q",click:()=>Y.app.quit()})}return r.call(this,i)}}class e extends Y.default.BrowserWindow{constructor(i){if(!i?.webPreferences?.preload||!i.title){super(i);return}let{frameless:o,winNativeTitleBar:a,disableMinSize:s,transparent:l,macosVibrancyStyle:f,windowsMaterial:h}=t,d=i.webPreferences.preload;i.webPreferences.preload=(0,we.join)(__dirname,"preload.js"),i.webPreferences.sandbox=!1,o?i.frame=!1:a&&delete i.frame,s&&(i.minWidth=0,i.minHeight=0),l&&(i.transparent=!0,i.backgroundColor="#00000000"),h&&h!=="none"&&(i.backgroundMaterial=h,i.backgroundColor="#00000000"),process.env.DISCORD_PRELOAD=d,super(i),s&&(this.setMinimumSize=(v,S)=>{})}}Object.assign(e,Y.default.BrowserWindow),Object.defineProperty(e,"name",{value:"BrowserWindow",configurable:!0});let n=require.resolve("electron");delete require.cache[n].exports,require.cache[n].exports={...Y.default,BrowserWindow:e},Go(global,"appSettings",r=>{r.set("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING",!0)}),process.env.DATA_DIR=(0,we.join)(Y.app.getPath("userData"),"..","Vencord")}console.log("[Vencord] Loading original Discord app.asar");require(require.main.filename)});u();u();u();Or();u();Ve();var nr=require("electron");u();var En={};Se(En,{fetchTrackData:()=>ua});u();u();u();var Lr="59a5428";u();var Sn="Vendicated/Vencord";var Vr=`Vencord/${Lr}${Sn?` (https://github.com/${Sn})`:""}`;var Fr=require("child_process"),Nr=require("util"),$r=(0,Nr.promisify)(Fr.execFile);async function xn(t){let{stdout:e}=await $r("osascript",t.map(n=>["-e",n]).flat());return e}var j=null;async function ca({id:t,name:e,artist:n,album:r}){if(t===j?.id){if("data"in j)return j.data;if("failures"in j&&j.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":Vr}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return j={id:t,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},j.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),j={id:t,failures:(t===j?.id&&"failures"in j?j.failures:0)+1},null}}async function ua(){try{await $r("pgrep",["^Music$"])}catch{return null}if(await xn(['tell application "Music"',"get player state","end tell"]).then(h=>h.trim())!=="playing")return null;let e=await xn(['tell application "Music"',"get player position","end tell"]).then(h=>Number.parseFloat(h.trim())),n=await xn(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(h=>!!h),l=Number.parseFloat(s),f=await ca({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:e,duration:l,...f}}var Tn={};Se(Tn,{initDevtoolsOpenEagerLoad:()=>da});u();function da(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var Zr={};u();ie();var Ut=require("electron"),$t=[];function Kr(){let t=[];for(let e=$t.length-1;e>=0;e--){let{processId:n,routingId:r}=$t[e],i=Ut.webFrameMain.fromId(n,r);if(!i){$t.splice(e,1);continue}t.push(i)}return t}Ut.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){Kr();let{routingId:i,processId:o}=r;$t.push({routingId:i,processId:o});let a=M.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});M.addChangeListener("plugins.FixSpotifyEmbeds.volume",t=>{try{Kr().forEach(e=>e.executeJavaScript(`globalThis._vcVolume = ${t/100}`))}catch(e){console.error("FixSpotifyEmbeds: Failed to update volume",e)}});var Yr={};u();ie();var qr=require("electron");qr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!M.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var Rn={};Se(Rn,{resolveRedirect:()=>ha});u();var Jr=require("https"),fa=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function Xr(t){return new Promise((e,n)=>{let r=(0,Jr.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?Xr(i.headers.location):t)});r.on("error",n),r.end()})}async function ha(t,e){return fa.test(e)?Xr(e):e}var Mn={};Se(Mn,{makeDeeplTranslateRequest:()=>ma,makeKagiTranslateRequest:()=>ga});u();async function ma(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function ga(t,e,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${e}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var _n={};Se(_n,{readRecording:()=>va});u();var Qr=require("electron"),Gt=require("fs/promises"),st=require("path");async function va(t,e){e=(0,st.normalize)(e);let n=(0,st.basename)(e),r=(0,st.normalize)(Qr.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!e.startsWith(r))return null;try{let i=await(0,Gt.readFile)(e);return(0,Gt.rm)(e).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var Dn={};Se(Dn,{closeSocket:()=>wa,sendToOverlay:()=>ya});u();var ei=require("dgram"),Wt=null;function ya(t,e){e.messageType=e.type;let n=JSON.stringify(e);Wt??=(0,ei.createSocket)("udp4"),Wt.send(n,42069,"127.0.0.1")}function wa(){Wt?.close(),Wt=null}var ni={};u();ie();var ti=require("electron");u();var On=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;ti.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{M.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(On):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(On))})})});var tr={};Se(tr,{answerOverlayAction:()=>_l,armDisplayMedia:()=>rl,checkUpdate:()=>Ll,closeStudioOverlay:()=>Al,deleteClip:()=>Ls,disarmDisplayMedia:()=>il,downloadUpdate:()=>Fl,dropOverlayWaiters:()=>Ml,emptyTrash:()=>Cs,focusClient:()=>Dl,gameFeedStatus:()=>ul,getActiveScreen:()=>nl,getCaptureSources:()=>el,getClipDirectory:()=>Ys,getMemoryReport:()=>tl,getPlatformInfo:()=>Qs,hideClipOverlay:()=>El,hideVrPanel:()=>vl,listClips:()=>ws,listTrash:()=>As,notifyClipSaved:()=>xl,openClipDirectory:()=>Xs,openStudioOverlay:()=>Il,openVrBindings:()=>ml,pickAudioFiles:()=>Ws,pickClipDirectory:()=>Js,pickImageFiles:()=>js,pickVideoFiles:()=>$s,readAudioFile:()=>Bs,readClip:()=>bs,readImageFile:()=>Zs,readLibrary:()=>Fs,readVideoFile:()=>Gs,readVoiceTrack:()=>vs,registerShortcuts:()=>al,relaunchClient:()=>Nl,releaseClipPath:()=>fs,renameClip:()=>Vs,reserveClipPath:()=>ps,restoreClip:()=>Is,revealClip:()=>qs,saveClip:()=>ds,saveVoiceTrack:()=>gs,shareClip:()=>Es,showClipOverlay:()=>Sl,showVrPanel:()=>gl,spillClear:()=>Os,spillDrop:()=>Ds,spillRead:()=>_s,spillWrite:()=>Ms,startGameFeeds:()=>ll,startVrBridge:()=>pl,stopGameFeeds:()=>cl,stopVrBridge:()=>fl,studioOverlayUp:()=>Cl,trashClip:()=>Ps,unregisterShortcuts:()=>Qn,vrBridgeStatus:()=>hl,waitForGameEvent:()=>dl,waitForOverlayAction:()=>Rl,waitForShortcut:()=>sl,waitForVrEvent:()=>yl,writeLibrary:()=>Ns});u();var Bi=require("crypto"),y=require("electron"),c=require("fs"),rn=require("https"),nn=require("os"),p=require("path");u();var H=require("fs"),oi=require("http"),ai=require("https"),si=require("os"),ft=require("path"),ri=34765,ba=6,li=256*1024,Sa=2e3,xa=1500,Ea="127.0.0.1",Ta=2999,ka="gamestate_integration_clipper.cfg",pe=null,Ge=0,Bt="",We=null,dt=[],Pa=12,pt=[],ze=[],Be={cs2:!1,league:!1};function jt(t){dt.length>=Pa||dt.includes(t)||dt.push(t)}var Ht=Promise.resolve();function lt(t){let e=ze.shift();if(e){e(t);return}pt.push(t),pt.length>16&&pt.shift()}var E={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function ci(){E={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function Ia(t){return t>=5?"an ace in Counter-Strike 2":t===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function Aa(t){let e=t.provider?.steamid,{player:n}=t;if(!n||!e||!n.steamid||n.steamid!==e)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof t.map?.round=="number"?t.map.round:E.round;(r.kills<E.kills||r.deaths<E.deaths)&&ci();let o=E.kills<0;i!==E.round&&(E.round=i,E.roundKills=0,E.announced=0);let a=r.kills-Math.max(0,E.kills),s=r.deaths-Math.max(0,E.deaths);if(E.kills=r.kills,E.deaths=r.deaths,o)return;a>0&&(E.roundKills+=a,E.roundKills>=3&&E.roundKills>E.announced?(E.announced=E.roundKills,lt({kind:"multikill",note:Ia(E.roundKills)})):lt({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&lt({kind:"death",note:"your death in Counter-Strike 2"});let l=t.round?.win_team;l&&n.team&&l===n.team&&t.round?.phase==="over"&&E.roundKills>0&&lt({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function Ca(){return new Promise(t=>{let e=0,n=(0,oi.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>li&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{Aa(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++e<ba){n.listen(ri+e,"127.0.0.1");return}jt(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}pe===n&&(pe=null,Ge=0,Be={...Be,cs2:!1}),t(0)}),n.on("listening",()=>{pe=n,t(n.address().port)}),n.listen(ri,"127.0.0.1")})}function Ra(){let t=[],e=(0,si.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&t.push((0,ft.join)(i,"Steam"))}let n=[];for(let r of t)if((0,H.existsSync)(r)){n.push(r);try{let i=(0,H.readFileSync)((0,ft.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function Ma(){for(let t of Ra()){let e=(0,ft.join)(t,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,H.existsSync)(e))return e}return""}function _a(t){let e=Ma();if(!e)return jt("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,ft.join)(e,ka),r=`"Clipper"
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
`;try{return(0,H.mkdirSync)(e,{recursive:!0}),(0,H.writeFileSync)(n,r,"utf8"),n}catch(i){return jt(`Counter-Strike 2's config could not be written (${i.message})`),""}}function Da(){let t=Bt;if(Bt="",!!t)try{(0,H.unlinkSync)(t)}catch{}}var ct="",Ue=-1,Ln=!1,zt=!1;function ut(t){return t.split("#")[0].trim().toLowerCase()}function ii(t){return new Promise(e=>{let n=(0,ai.get)({host:Ea,port:Ta,path:t,rejectUnauthorized:!1,timeout:xa},r=>{if(r.statusCode!==200){r.resume(),e(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>li&&n.destroy()}),r.on("end",()=>{try{e(JSON.parse(i))}catch{e(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>e(null))})}function Oa(t,e){let n=t.EventName??"",r=ut(t.KillerName??"");switch(n){case"ChampionKill":return r===e?{kind:"kill",note:"a kill in League of Legends"}:ut(t.VictimName??"")===e?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==e?null:{kind:"multikill",note:`a ${t.KillStreak??3}-kill run in League of Legends`};case"Ace":return ut(t.Acer??"")!==e?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return ut(t.Recipient??"")!==e?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==e?null:{kind:"objective",note:`${t.DragonType?`the ${t.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==e?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==e?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==e?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function La(){if(!zt){zt=!0;try{if(!ct){let r=await ii("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;ct=ut(r),Ue=-1}let t=await ii("/liveclientdata/eventdata");if(!t?.Events){ct="";return}let e=Ue<0,n=Ue;for(let r of t.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=Ue||(n=Math.max(n,i),e))continue;let o=Oa(r,ct);o&&lt(o)}Ue=n}finally{zt=!1}}}function Va(){ct="",Ue=-1,zt=!1,We=setInterval(()=>{La().catch(t=>{Ln||(Ln=!0,jt(`League of Legends could not be read (${t.message})`))})},Sa)}function Fa(t){return t.cs2!==Be.cs2||t.league!==Be.league?!1:(!t.cs2||pe!==null)&&(!t.league||We!==null)}function ui(t){let e=Ht.then(async()=>(Fa(t)||(di(),dt=[],t.cs2&&(ci(),Ge=await Ca(),Ge&&(Bt=_a(Ge))),t.league&&Va(),Be={cs2:t.cs2&&pe!==null,league:t.league}),Kt()));return Ht=e.catch(()=>{}),e}function di(){if(Be={cs2:!1,league:!1},We&&clearInterval(We),We=null,Ln=!1,pe)try{pe.close()}catch{}pe=null,Ge=0,Da(),pt=[];let t=ze;ze=[];for(let e of t)e(null)}function Vn(){let t=Ht.then(()=>di());return Ht=t.catch(()=>{}),t}function Kt(){return{port:Ge,configPath:Bt,league:We!==null,problems:[...dt]}}function pi(t){let e=pt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{ze=ze.filter(a=>a!==i),i(null)},t);ze.push(i)})}u();var fe=require("electron"),Yt=require("fs"),mt=require("path"),fi=require("url"),Zt=24,hi=2600,qt=220,Na=300,$a=56,Fn=!0;function Jt(){return Fn}var Pe=null,Te=null,ht=null,ke=null;function Ua(){return!!Pe&&!Pe.isDestroyed()}function Ie(){Te&&(clearTimeout(Te),Te=null);let t=Pe;Pe=null,t&&!t.isDestroyed()&&t.destroy()}function je(){ke&&(clearTimeout(ke),ke=null);let t=ht;ht=null,t&&!t.isDestroyed()&&t.destroy()}function Ga(t,e,n){let i=fe.screen.getDisplayNearestPoint(fe.screen.getCursorScreenPoint()).workArea,o=t==="top-left"||t==="bottom-left",a=t==="top-left"||t==="top-right";return{x:Math.round(o?i.x+Zt:i.x+i.width-e-Zt),y:Math.round(a?i.y+Zt:i.y+i.height-n-Zt)}}function gt(t,e){let n=(0,mt.join)(fe.app.getPath("userData"),"clipper-overlay");(0,Yt.mkdirSync)(n,{recursive:!0});let r=(0,mt.join)(n,t);return(0,Yt.writeFileSync)(r,e,"utf8"),r}function mi(t,e,n,r){let{x:i,y:o}=Ga(r,e,n),a=new fe.BrowserWindow({width:e,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(t).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function gi(t){return`<meta charset="utf-8">
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
</style>`}function X(t){return JSON.stringify(t).replace(/</g,"\\u003c")}function Wa(t,e){return`<!doctype html>
<html>
<head>
${gi(`.card { background: #000; }
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
    document.getElementById("tag").textContent = ${X((0,mt.basename)(t))};

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

    video.src = ${X((0,fi.pathToFileURL)(t).href)};

    // Autoplay with sound is only allowed after a gesture, and this window
    // never gets one. Muted playback is always allowed, so it is the fallback
    // rather than a reason to show nothing.
    video.play().catch(function () {
        video.muted = true;
        video.play().catch(leave);
    });
</script>
</body>
</html>`}function za(t,e){return`<!doctype html>
<html>
<head>
${gi(`.card {
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
    }, ${hi});
</script>
</body>
</html>`}function vi(t,e){if(!Fn)return!1;Ie(),je();let n=Math.max(200,Math.round(e.width)),r=Math.round(n*9/16),i=mi(gt("clip.html",Wa(t,e)),n,r,e.corner);Pe=i,i.on("closed",()=>{Pe===i&&(Pe=null,Te&&(clearTimeout(Te),Te=null))});let o=(e.seconds>0?e.seconds:300)+10;return Te=setTimeout(()=>Ie(),o*1e3),!0}function yi(t,e,n){if(!Fn||Ua())return!1;je();let r=mi(gt("toast.html",za(t,e)),Na,$a,n);return ht=r,r.on("closed",()=>{ht===r&&(ht=null,ke&&(clearTimeout(ke),ke=null))}),ke=setTimeout(()=>je(),hi+4e3),!0}fe.app.on("will-quit",()=>{Ie(),je()});u();var Q=require("electron"),wi=require("url");var Nn="VencordClipperOverlayAction",bi="VencordClipperOverlayReply",Ba=108,O=null;function $n(){return!!O&&!O.isDestroyed()}function yt(){let t=O;O=null,t&&!t.isDestroyed()&&t.destroy()}var He=[],vt=[];function ja(t){let e=He.shift();if(e){e(t);return}vt.push(t),vt.length>4&&vt.shift()}function Si(t){let e=vt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{He=He.filter(a=>a!==i),i(null)},t);He.push(i)})}function xi(){vt=[];let t=He;He=[];for(let e of t)e(null)}function Ei(t){!O||O.isDestroyed()||O.webContents.send(bi,t)}Q.ipcMain.removeAllListeners(Nn);Q.ipcMain.on(Nn,(t,e,n)=>{if(!O||O.isDestroyed()||t.sender!==O.webContents)return;let r=String(e??"");if(r==="close"){yt();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open"&&r!=="link")return;let i=n??{},o=Number(i.from),a=Number(i.to);ja({kind:r,clip:String(i.clip??""),from:Number.isFinite(o)?Math.max(0,o):0,to:Number.isFinite(a)?Math.max(0,a):0})});function Ha(t,e){let{workArea:n}=Q.screen.getDisplayNearestPoint(Q.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-t)/2),y:Math.round(n.y+(n.height-e)/2)}}var Ka=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${X(Nn)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${X(bi)}, (_event, reply) => handler(reply));
    }
});
`;function Za(t,e){return`<!doctype html>
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
    var clip = ${X({name:t.name,url:(0,wi.pathToFileURL)(t.path).href,markers:t.markers})};
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
</html>`}function Ti(t,e){if(!Jt())return!1;yt(),Ie(),je();let n=Math.max(360,Math.round(e.width)),r=Math.round(n*9/16)+Ba,{x:i,y:o}=Ha(n,r),a=gt("studio-preload.js",Ka),s=gt("studio.html",Za(t,e)),l=new Q.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return O=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{O===l&&(O=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}Q.app.on("will-quit",()=>yt());u();function K(t){return`${t.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}u();var Di=require("child_process"),Oi=require("electron"),Bn=require("fs"),Et=require("path");u();var qa=`
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
`,ki=`# Vencord Clipper - SteamVR bridge. Generated; edits are overwritten.
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
${qa}
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
`;u();var Ii=require("electron"),U=require("fs"),$=require("path"),Xt="vencord.clipper",he="/actions/clipper",wt=["save","mark","toggle","pov"],Ya=["save","mark"],Ja={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function Un(){let t=(0,$.join)(Ii.app.getPath("userData"),"clipper-vr");return(0,U.mkdirSync)(t,{recursive:!0}),t}function Xa(){let t=(0,$.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,U.readFileSync)(t,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,U.existsSync)((0,$.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let e=(0,$.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,U.existsSync)((0,$.join)(e,"bin","win64","openvr_api.dll"))?e:null}function Ai(){let t=Xa();return t&&(0,$.join)(t,"bin","win64","openvr_api.dll")}var Qa=.4,es={save:"double",mark:"long"};function ts(t,e,n){return{path:t,mode:"button",inputs:{[e]:{output:`${he}/in/${n}`}},parameters:e==="long"?{long_press_delay:Qa}:{}}}function Pi(t,e){return{app_key:Xt,controller_type:t,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[he]:{sources:Ya.map(n=>ts(e[n],es[n],n))}}}}function Ci(){let t=Un(),e={language_tag:"en_US",[he]:"Clipper"};for(let o of wt)e[`${he}/in/${o}`]=Ja[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:he,usage:"leftright"}],actions:wt.map(o=>({name:`${he}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[e]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,U.writeFileSync)((0,$.join)(t,"bindings_knuckles.json"),JSON.stringify(Pi("knuckles",r),null,4),"utf8"),(0,U.writeFileSync)((0,$.join)(t,"bindings_oculus_touch.json"),JSON.stringify(Pi("oculus_touch",r),null,4),"utf8");let i=(0,$.join)(t,"actions.json");return(0,U.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function Ri(t){let e={source:"builtin",applications:[{app_key:Xt,launch_type:"binary",binary_path_windows:t,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,$.join)(Un(),"clipper.vrmanifest");return(0,U.writeFileSync)(n,JSON.stringify(e,null,4),"utf8"),n}function Gn(){return(0,$.join)(Un(),"bridge.ps1")}var ns=15e3,rs=45e3,Mi=3,is=3,os=2e3,V=null,xt=!1,oe="",L="",Ae="",Ce=!1,zn=0,Li=0,Ke=null,bt=[],St=null,me=[],Qt=Promise.resolve();function _i(t){let e=me.shift();if(e){e(t);return}if(t.kind==="motion"){St=t;return}bt.push(t.action),bt.length>8&&bt.shift()}function as(t){let e=t.trim();if(!e.startsWith("{"))return!1;let n;try{n=JSON.parse(e)}catch{return!1}if(n.t==="ready")return oe=String(n.runtime??""),L="",Ae="",Ce=!1,!0;if(n.t==="waiting")return oe="",L="",Ae=String(n.reason??""),!0;if(n.t==="warning")return L=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return L=String(n.message??"The SteamVR bridge failed for a reason it did not give"),Ce=!oe||++Li>=is,!0;if(n.t==="action"){let r=wt.find(i=>i===n.name);return r&&_i({kind:"action",action:r}),!1}return n.t==="motion"&&_i({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function Wn(){Ke||!xt||Ce||(Ke=setTimeout(()=>{Ke=null,xt&&Vi()},ns))}function Vi(){if(V)return Promise.resolve();let t=Ai();if(!t)return Wn(),Promise.resolve();let e;try{let n=Gn();(0,Bn.writeFileSync)(n,ki,"utf8");let r=(0,Et.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");e=(0,Di.spawn)(r,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",t,"-Actions",Ci(),"-Manifest",Ri(r),"-AppKey",Xt,"-ActionList",[he,...wt].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return L=`The SteamVR bridge could not be started (${n.message}).`,Wn(),Promise.resolve()}return V=e,oe="",Ae="",Ce=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{L="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},rs),a="";e.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let f of l)as(f)&&i()}),e.stderr?.on("data",s=>{L||(L=s.toString("utf8").trim().slice(0,300))}),e.on("error",s=>{L=`The SteamVR bridge could not be started (${s.message}).`,i()}),e.on("exit",()=>{V===e&&(!oe&&!Ae&&!Ce?++zn>=Mi&&(Ce=!0,L||(L=`The SteamVR bridge stopped ${Mi} times without saying why. Switch the VR controls off and on again to try it once more.`)):zn=0,V=null,oe="",Ae="");let s=me;me=[];for(let l of s)l(null);i(),Wn()})})}function Fi(){Ke&&(clearTimeout(Ke),Ke=null);let t=V;V=null,oe="",Ae="",Ce=!1,zn=0,Li=0,bt=[],St=null;let e=me;me=[];for(let r of e)r(null);if(!t)return;try{t.stdin?.end()}catch{}let n=setTimeout(()=>{try{t.kill()}catch{}},os);t.on("exit",()=>clearTimeout(n))}function Ni(t){let e=Qt.then(async()=>(xt=t,t?(await Vi(),en()):(Fi(),L="",en())));return Qt=e.catch(()=>{}),e}function jn(){let t=Qt.then(()=>{xt=!1,Fi()});return Qt=t.catch(()=>{}),t}function en(){return{running:V!==null&&oe!=="",wanted:xt,runtime:oe,problem:L,waiting:Ae}}function $i(){if(!V?.stdin?.writable)return!1;try{return V.stdin.write(`bindings
`),!0}catch{return!1}}var ss=0;function Ui(t,e,n,r){if(!V?.stdin?.writable||e<=0||n<=0||t.length!==e*n*4)return!1;let i=(0,Et.join)((0,Et.dirname)(Gn()),`panel-${ss++%8}.rgba`);try{return(0,Bn.writeFileSync)(i,t),V.stdin.write(`panel ${e} ${n} ${Math.round(r)} ${i}
`),!0}catch{return!1}}function Gi(){if(!V?.stdin?.writable)return!1;try{return V.stdin.write(`panelhide
`),!0}catch{return!1}}function Wi(t=3e4){let e=bt.shift();if(e)return Promise.resolve({kind:"action",action:e});if(St){let n=St;return St=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{me=me.filter(a=>a!==i),i(null)},t);me.push(i)})}Oi.app.on("will-quit",()=>{jn()});var ji=!0,Jn=!1,Hn=500*1024*1024,Hi=/vesktop|equibop/i.test(y.app.getName());function x(t){let e=t?.trim(),n=e&&(0,p.isAbsolute)(e)?e:(0,p.join)(y.app.getPath("videos"),"DiscordClips"),r=n.toLowerCase().replace(/[\\/]+$/,"");for(let i of ls()){let o=i.toLowerCase().replace(/[\\/]+$/,"");if(r===o||r.startsWith(`${o}\\`)||r.startsWith(`${o}/`))throw new Error("That folder is not a place for clips")}return n}function ls(){let t=[];for(let e of["SystemRoot","windir","ProgramFiles","ProgramFiles(x86)","ProgramW6432"]){let n=process.env[e]?.trim();n&&t.push(n)}try{t.push(er())}catch{}return t}var cs=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;function F(t){let n=(0,p.basename)(String(t??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${cs.test(r[1])?`_${r[1]}`:r[1]}.${r[2].toLowerCase()}`:null}function Ki(t){return F(t)??`clip-${Date.now()}.webm`}function At(t,e){let n=(0,p.extname)(e),r=e.slice(0,e.length-n.length),i=(0,p.join)(t,e),o=2;for(;(0,c.existsSync)(i)&&o<1e3;)i=(0,p.join)(t,`${r} (${o++})${n}`);if((0,c.existsSync)(i))throw new Error(`No free name left for ${e}; rename or clear the folder`);return i}var Ze=new Map;function us(t,e){let n=`${t}.tmp-${process.pid}-${Date.now()}`;(0,c.writeFileSync)(n,Buffer.from(e));try{(0,c.renameSync)(n,t)}catch(r){try{(0,c.unlinkSync)(n)}catch{}throw r}}function ds(t,e,n,r,i=!1){if(r.length>Hn)throw new Error("That clip is too large to write");let o=x(e);(0,c.mkdirSync)(o,{recursive:!0});let a=Ki(n),s=(0,p.join)(o,a),l=(Ze.get(s)??Promise.resolve()).catch(()=>{}).then(async()=>{let f=i?At(o,a):(0,p.join)(o,a);return us(f,r),f});return l.then(()=>{Ze.get(s)===l&&Ze.delete(s)},()=>{Ze.get(s)===l&&Ze.delete(s)}),Ze.set(s,l),l}var Tt=new Set;function ps(t,e,n){let r=x(e);(0,c.mkdirSync)(r,{recursive:!0});let i=At(r,Ki(n));if(!Tt.has(i))return Tt.add(i),i;let o=(0,p.extname)(i),a=i.slice(0,i.length-o.length),s=1,l=`${a}-${s}${o}`;for(;Tt.has(l)||(0,c.existsSync)(l);)l=`${a}-${++s}${o}`;return Tt.add(l),l}function fs(t,e){Tt.delete(e)}var Ct="voices";function hs(t,e){let n=F(t);return!n||!/^\d{1,25}$/.test(String(e??""))?null:`${n.slice(0,n.length-(0,p.extname)(n).length)}.${e}.webm`}function ms(t,e){let n=F(e);if(!n)return[];let r=(0,p.join)(x(t),Ct);if(!(0,c.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,p.extname)(n).length)}.`,o=[];for(let a of(0,c.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function gs(t,e,n,r,i){let o=hs(n,r);if(!o)return null;let a=(0,p.join)(x(e),Ct);(0,c.mkdirSync)(a,{recursive:!0});let s=(0,p.join)(a,o);return(0,c.writeFileSync)(s,Buffer.from(i)),s}function vs(t,e,n){let r=(0,p.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");return new Uint8Array((0,c.readFileSync)((0,p.join)(x(e),Ct,r)))}function ys(t,e){let n=(0,p.join)(x(t),Ct);for(let{file:r}of ms(t,e))try{(0,c.unlinkSync)((0,p.join)(n,r))}catch{}}function ws(t,e){let n=x(e);if(!(0,c.existsSync)(n))return[];try{Yi(n)}catch{}let r=[],i=new Set,o=(0,c.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,p.join)(n,a.name);try{let l=(0,c.statSync)(s),f=K(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(f)?{thumb:f}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function bs(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");let i=(0,p.join)(x(e),r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>Hn)throw new Error("That clip is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>Hn)throw new Error("That clip is too large to open");return s}finally{(0,c.closeSync)(o)}}var zi=200*1024*1024,Ss="https://catbox.moe/user/api.php",xs=1024*1024;function Es(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");if(!/\.(webm|mp4)$/i.test(r))throw new Error("Only video clips can be shared as a link");let i=(0,p.join)(x(e),r),o=(0,c.openSync)(i,"r"),a;try{let{size:d}=(0,c.fstatSync)(o);if(d>zi)throw new Error("That clip is over 200MB - shorten it in the studio first");if(a=(0,c.readFileSync)(o),a.length>zi)throw new Error("That clip is over 200MB - shorten it in the studio first")}finally{(0,c.closeSync)(o)}let s=`clipper-${Date.now().toString(16)}-${Math.floor(Math.random()*4294967295).toString(16)}`,l=r.toLowerCase().endsWith(".mp4")?"video/mp4":"video/webm",f=Buffer.from(`--${s}\r
Content-Disposition: form-data; name="reqtype"\r
\r
fileupload\r
--${s}\r
Content-Disposition: form-data; name="fileToUpload"; filename="${r}"\r
Content-Type: ${l}\r
\r
`,"utf8"),h=Buffer.from(`\r
--${s}--\r
`,"utf8");return new Promise((d,v)=>{let S=(0,rn.request)(Ss,{method:"POST",headers:{"User-Agent":eo,"Content-Type":`multipart/form-data; boundary=${s}`,"Content-Length":f.length+a.length+h.length}},T=>{let D=[],C=0;T.on("data",k=>{if(C+=k.length,C>xs){T.destroy(new Error("The host answered with more than a link"));return}D.push(k)}),T.on("end",()=>{let k=Buffer.concat(D).toString("utf8").trim();(T.statusCode??0)!==200?v(new Error(`The host answered ${T.statusCode??"?"} - try again later`)):/^https:\/\//.test(k)?d(k):v(new Error("The host did not return a link - try again later"))}),T.on("error",v)});S.setTimeout(3e5,()=>S.destroy(new Error("The upload timed out - try again on a faster connection"))),S.on("error",v),S.write(f),S.write(a),S.end(h)})}var Ts=".trash",Zi=".trash.json",ks=168*3600*1e3;function Rt(t){return(0,p.join)(t,Ts)}function Mt(t){let e;try{e=JSON.parse((0,c.readFileSync)((0,p.join)(t,Zi),"utf8"))}catch{return{}}if(!e||typeof e!="object")return{};let n={};for(let[r,i]of Object.entries(e))/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.test(r)&&(!i||typeof i!="object"||i.stored!==r||(n[r]=i));return n}function Pt(t,e){(0,c.mkdirSync)(t,{recursive:!0}),(0,c.writeFileSync)((0,p.join)(t,Zi),JSON.stringify(e))}function qi(t,e){if(!e)return;let n=(0,p.join)(t,Ct),r;try{r=(0,c.readdirSync)(n)}catch{return}for(let i of r)if(i.startsWith(`${e}.`)&&i.toLowerCase().endsWith(".webm"))try{(0,c.unlinkSync)((0,p.join)(n,i))}catch{}}function Yi(t){let e=Rt(t);if(!(0,c.existsSync)(e))return;let n=Mt(e),r=Date.now(),i=!1;for(let[o,a]of Object.entries(n))if(!(!a||r-(a.deletedAt??0)<ks)){for(let s of[o,K(o)])try{(0,c.unlinkSync)((0,p.join)(e,s))}catch{}qi(t,(a.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,"")),delete n[o],i=!0}i&&Pt(e,n)}function Ps(t,e,n,r){let i=F(n);if(!i)throw new Error("That is not a clip name");if(r!==null&&(typeof r!="string"||r.length>1024*1024))throw new Error("That metadata is not metadata");let o=x(e),a=(0,p.join)(o,i);if(!(0,c.existsSync)(a))throw new Error("That clip is already gone");let s=Rt(o);(0,c.mkdirSync)(s,{recursive:!0});let l=At(s,i).split(/[\\/]/).pop()||i;(0,c.renameSync)(a,(0,p.join)(s,l));let f=K(i);if((0,c.existsSync)((0,p.join)(o,f)))try{(0,c.renameSync)((0,p.join)(o,f),(0,p.join)(s,K(l)))}catch{}let h=Mt(s);h[l]={stored:l,name:i,deletedAt:Date.now(),meta:r},Pt(s,h)}function Is(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");let i=x(e),o=Rt(i),a=Mt(o),s=a[r];if(!s||!(0,c.existsSync)((0,p.join)(o,r)))throw delete a[r],Pt(o,a),new Error("That clip is no longer in the trash");let l=At(i,s.name).split(/[\\/]/).pop()||s.name;(0,c.renameSync)((0,p.join)(o,r),(0,p.join)(i,l));let f=K(r);if((0,c.existsSync)((0,p.join)(o,f)))try{(0,c.renameSync)((0,p.join)(o,f),(0,p.join)(i,K(l)))}catch{}return delete a[r],Pt(o,a),{name:l,meta:s.meta??null}}function As(t,e){let n=x(e);Yi(n);let r=Rt(n),i=Mt(r),o=[];for(let[a,s]of Object.entries(i)){if(!s)continue;let l=0;try{l=(0,c.statSync)((0,p.join)(r,a)).size}catch{delete i[a];continue}let f="";try{let h=s.meta?JSON.parse(s.meta):null;h&&typeof h.game=="string"&&(f=h.game)}catch{}o.push({stored:a,name:s.name??a,size:l,deletedAt:s.deletedAt??0,game:f})}return o.sort((a,s)=>a.deletedAt-s.deletedAt)}function Cs(t,e){let n=x(e),r=Rt(n);if((0,c.existsSync)(r)){for(let[i,o]of Object.entries(Mt(r))){for(let a of[i,K(i)])try{(0,c.unlinkSync)((0,p.join)(r,a))}catch{}o&&qi(n,(o.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,""))}Pt(r,{})}}var Ji=32*1024*1024;function Rs(){let t=(0,p.join)((0,nn.tmpdir)(),`clipper-spill-${process.pid}`);return(0,c.mkdirSync)(t,{recursive:!0}),t}function Xn(t){if(!/^spill-\d+-[a-z0-9]+$/i.test(t))throw new Error("That is not a spill file");return(0,p.join)(Rs(),`${t}.frag`)}function Ms(t,e,n){if(n.length>Ji)throw new Error("That spill chunk is too large");(0,c.writeFileSync)(Xn(e),Buffer.from(n))}function _s(t,e){let n=Xn(e),r=(0,c.openSync)(n,"r");try{let{size:i}=(0,c.fstatSync)(r);if(i>Ji)throw new Error("That spill chunk is too large");return new Uint8Array((0,c.readFileSync)(r))}finally{(0,c.closeSync)(r)}}function Ds(t,e){for(let n of e)try{(0,c.unlinkSync)(Xn(n))}catch{}}function Os(){let t=`clipper-spill-${process.pid}`,e;try{e=(0,c.readdirSync)((0,nn.tmpdir)())}catch{return}for(let n of e){if(!n.startsWith("clipper-spill-"))continue;let r=(0,p.join)((0,nn.tmpdir)(),n);if(n!==t){let i=0;try{i=Date.now()-(0,c.statSync)(r).mtimeMs}catch{continue}if(i<24*3600*1e3)continue}try{(0,c.rmSync)(r,{recursive:!0,force:!0})}catch{}}}async function Ls(t,e,n){let r=x(e),i=F(n);if(!i)throw new Error("That is not a clip name");let o=(0,p.join)(r,i);try{await y.shell.trashItem(o)}catch{(0,c.unlinkSync)(o)}ys(e,i);let a=(0,p.join)(r,K(i));if((0,c.existsSync)(a))try{await y.shell.trashItem(a)}catch{try{(0,c.unlinkSync)(a)}catch{}}}function Vs(t,e,n,r){let i=x(e),o=F(n);if(!o)throw new Error("That is not a clip name");let a=(0,p.join)(i,o),s=(0,p.extname)(o),l=F(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let h=l.toLowerCase()===o.toLowerCase()?(0,p.join)(i,l):At(i,l);(0,c.renameSync)(a,h);let d=(0,p.join)(i,K(o));if((0,c.existsSync)(d))try{(0,c.renameSync)(d,(0,p.join)(i,K((0,p.basename)(h))))}catch{}return(0,p.basename)(h)}var Xi="clipper-library.json";function Fs(t,e){let n=(0,p.join)(x(e),Xi);if(!(0,c.existsSync)(n))return"";try{return(0,c.readFileSync)(n,"utf8")}catch{return""}}function Ns(t,e,n){let r=x(e);(0,c.mkdirSync)(r,{recursive:!0});let i=(0,p.join)(r,Xi),o=`${i}.tmp`;(0,c.writeFileSync)(o,String(n??""),"utf8"),(0,c.renameSync)(o,i)}async function $s(t){let e=await y.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return e.canceled?[]:e.filePaths}var Us=512*1024*1024;function Gs(t,e){if(!(0,p.isAbsolute)(e)||!/\.(mp4|webm|mkv|mov|m4v)$/i.test(e))throw new Error("Not a video file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>Us){let i=Math.round(r/1048576);throw new Error(`That video is ${i} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function Ws(t){let e=await y.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return e.canceled?[]:e.filePaths}var zs=64*1024*1024;function Bs(t,e){if(!(0,p.isAbsolute)(e)||!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(e))throw new Error("Not an audio file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>zs){let i=Math.round(r/1048576);throw new Error(`That sound is ${i} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function js(t){let e=await y.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return e.canceled?[]:e.filePaths}var Hs=24*1024*1024,Ks=64*1024*1024;function Zs(t,e){if(!(0,p.isAbsolute)(e)||!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(e))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(e),r=n?Ks:Hs,i=(0,c.openSync)(e,"r");try{let{size:o}=(0,c.fstatSync)(i);if(o>r){let a=Math.round(o/1048576),s=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${a} MB; the montage caps them at ${s} MB.`)}return new Uint8Array((0,c.readFileSync)(i))}finally{(0,c.closeSync)(i)}}function qs(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");y.shell.showItemInFolder((0,p.join)(x(e),r))}function Ys(t,e){return x(e)}async function Js(t,e){let n=await y.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:x(e),properties:["openDirectory","createDirectory"]});return n.canceled?"":n.filePaths[0]??""}function Xs(t,e){let n=x(e);(0,c.mkdirSync)(n,{recursive:!0}),y.shell.openPath(n)}function Qs(t){return{platform:"win32",wayland:Jn,vesktop:Hi,overlay:Jt()}}var ge=new Set;async function el(t,e=!0){if(Jn)return[];let n=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:e?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(ge.size){let i=new Set(n.map(o=>o.id));for(let o of ge)i.has(o)||ge.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!e){if(!o&&ge.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if(ji&&!o&&a){ge.add(i.id);continue}ge.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function tl(t){try{return y.app.getAppMetrics().map(e=>({type:e.serviceName||e.type,mb:Math.round((e.memory?.workingSetSize??0)/1024)})).filter(e=>e.mb>0).sort((e,n)=>n.mb-e.mb)}catch{return[]}}async function nl(t){if(Jn)return"";let e=await y.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!e.length)return"";try{let n=y.screen.getDisplayNearestPoint(y.screen.getCursorScreenPoint()),r=e.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return e[0].id}var Kn="",Zn=!1;function rl(t,e,n=!0){return!n||Hi?!1:(Kn=e??"",Zn=!0,y.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(f=>f.id===Kn),l=(a&&!ge.has(a.id)?a:void 0)??o.find(f=>f.id.startsWith("screen:"))??o.find(f=>!ge.has(f.id));if(!l){i({});return}i(ji&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function il(t){Kn="",Zn&&(Zn=!1,y.session.defaultSession.setDisplayMediaRequestHandler(null))}var qn=new Map,qe=[],kt=[];function ol(t){let e=qe.shift();if(e){e(t);return}kt.push(t),kt.length>8&&kt.shift()}function al(t,e){Qn();let n=[];for(let[r,i]of Object.entries(e)){if(!i)continue;let o=!1;try{o=y.globalShortcut.register(i,()=>ol(r))}catch{o=!1}o?qn.set(r,i):n.push(i)}return n}function Qn(t){for(let n of qn.values())try{y.globalShortcut.unregister(n)}catch{}qn.clear(),kt=[];let e=qe;qe=[];for(let n of e)n(null)}function sl(t,e=3e4){let n=kt.shift();return n?Promise.resolve(n):new Promise(r=>{let i=!1,o=s=>{i||(i=!0,clearTimeout(a),r(s))},a=setTimeout(()=>{qe=qe.filter(s=>s!==o),o(null)},e);qe.push(o)})}y.app.on("will-quit",()=>Qn());function ll(t,e){return ui(e)}function cl(t){return Vn()}function ul(t){return Kt()}function dl(t,e=3e4){return pi(e)}function pl(t,e){return Ni(e)}function fl(t){return jn()}function hl(t){return en()}function ml(t){return $i()}function gl(t,e,n,r,i){return Ui(new Uint8Array(e),n,r,i)}function vl(t){return Gi()}function yl(t,e=3e4){return Wi(e)}y.app.on("will-quit",()=>{Vn()});var wl=["top-left","top-right","bottom-left","bottom-right"];function Ye(t,e,n,r){let i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(e,Math.round(i))):r}function Qi(t){return wl.includes(t)?t:"bottom-right"}function bl(t){return{corner:Qi(t?.corner),width:Ye(t?.width,200,1280,420),volume:Ye(t?.volume,0,100,0),seconds:Ye(t?.seconds,0,300,10)}}function Yn(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function Sl(t,e,n,r){let i=F(n);if(!i)return!1;let o=(0,p.join)(x(e),i);return(0,c.existsSync)(o)?vi(o,bl(r)):!1}function xl(t,e,n,r){return y.BrowserWindow.getFocusedWindow()||$n()?!1:yi(Yn(e,60),Yn(n,90),Qi(r))}function El(t){Ie()}var Tl=200;function kl(t){return Array.isArray(t)?t.map(Number).filter(e=>Number.isFinite(e)&&e>=0).slice(0,Tl):[]}function Pl(t){return{width:Ye(t?.width,360,1600,720),volume:Ye(t?.volume,0,100,0)}}function Il(t,e,n,r,i){let o=F(n);if(!o)return!1;let a=(0,p.join)(x(e),o);return(0,c.existsSync)(a)?Ti({name:o,path:a,markers:kl(r)},Pl(i)):!1}function Al(t){yt()}function Cl(t){return $n()}function Rl(t,e=3e4){return Si(Ye(e,1e3,12e4,3e4))}function Ml(t){xi()}function _l(t,e,n,r){Ei({ok:!!e,message:Yn(n,120),close:!!r})}function Dl(t){let e=y.BrowserWindow.fromWebContents(t.sender);!e||e.isDestroyed()||(e.isMinimized()&&e.restore(),e.show(),e.focus())}var It="kebab1337420/Clibab",eo=`VencordClipper (+https://github.com/${It})`,tn=256*1024*1024;function on(t,e=0){return new Promise((n,r)=>{let i=(0,rn.get)(t,{headers:{"User-Agent":eo,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),e>=5?r(new Error(`Too many redirects for ${t}`)):n(on(new URL(s,t).toString(),e+1));return}let l=[],f=0,{"content-length":h}=o.headers;if(h&&Number(h)>tn){o.destroy(new Error(`${t} answered ${h} bytes, over the ${tn} byte cap`));return}o.on("data",d=>{if(f+=d.length,f>tn){o.destroy(new Error(`${t} exceeded the ${tn} byte cap`));return}l.push(d)}),o.on("end",()=>n({status:a,body:Buffer.concat(l)})),o.on("error",r)});i.setTimeout(6e4,()=>i.destroy(new Error(`${t} timed out`))),i.on("error",r)})}async function Ol(t){let{status:e,body:n}=await on(t);if(e!==200)throw new Error(`${t} answered ${e}`);return n}function er(){return __dirname}function to(t){return(0,c.existsSync)((0,p.join)(t,"patcher.js"))&&(0,c.existsSync)((0,p.join)(t,"renderer.js"))}function no(t){try{return(0,c.accessSync)(t,c.constants.W_OK),!0}catch{return!1}}function ro(t,e){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(t),i=n(e);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function Ll(t,e){let n=await Ol(`https://api.github.com/repos/${It}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=er();return{version:o,tag:i,available:!!o&&ro(o,e),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${It}/releases`),directory:a,writable:to(a)&&no(a)}}async function Vl(t){let{status:e,body:n}=await on(`https://raw.githubusercontent.com/${It}/${t}/prebuilt/build-info.json`);if(e===404)return null;if(e!==200)throw new Error(`The release's file list answered ${e}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return r}async function Fl(t,e,n){if(!/^[\w.-]{1,40}$/.test(e))throw new Error(`Refusing to fetch a release named ${e}`);if(!ro(e.replace(/^v/i,""),String(n??"")))throw new Error(`Refusing to install ${e}: it is not newer than the installed bundle`);let r=er();if(!to(r))throw new Error(`No installed bundle at ${r}`);if(!no(r))throw new Error(`${r} is read-only`);let i=await Vl(e);if(!i)throw new Error(`The release under ${e} carries no file list; refusing to install it unchecked`);let o=Object.keys(i),a=(0,p.join)(r,".clipper-update");(0,c.rmSync)(a,{recursive:!0,force:!0}),(0,c.mkdirSync)(a,{recursive:!0});try{let s=[];for(let d of o){if(d!==(0,p.basename)(d)||d.startsWith("."))throw new Error(`Refusing a release file named ${d}`);let{status:v,body:S}=await on(`https://raw.githubusercontent.com/${It}/${e}/prebuilt/dist/${d}`);if(v!==200)throw new Error(`${d} answered ${v}`);if(S.length===0)throw new Error(`${d} came back empty`);let T=i[d];if(T?.size===void 0||!T?.sha256)throw new Error(`${d} has no size and hash in the release's file list`);if(S.length!==T.size)throw new Error(`${d} is ${S.length} bytes, the release says ${T.size}`);if((0,Bi.createHash)("sha256").update(S).digest("hex").toLowerCase()!==T.sha256.toLowerCase())throw new Error(`${d} does not match its hash`);(0,c.writeFileSync)((0,p.join)(a,d),S),s.push(d)}if(s.length===0)throw new Error(`There is no bundle published under ${e}`);for(let d of["renderer.js","patcher.js"])if(!s.includes(d))throw new Error(`The release carries no ${d}`);if(!(0,c.readFileSync)((0,p.join)(a,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let l=(0,p.join)(a,".previous");(0,c.mkdirSync)(l,{recursive:!0});let f=[],h=[];try{for(let d of s){let v=(0,p.join)(r,d);(0,c.existsSync)(v)&&((0,c.renameSync)(v,(0,p.join)(l,d)),f.push(d)),(0,c.renameSync)((0,p.join)(a,d),v),h.push(d)}}catch(d){for(let v of h)try{(0,c.unlinkSync)((0,p.join)(r,v))}catch{}for(let v of f)try{(0,c.renameSync)((0,p.join)(l,v),(0,p.join)(r,v))}catch{}throw new Error(`The update could not be put in place (${d.message}). The bundle that was there has been put back.`)}return s}finally{(0,c.rmSync)(a,{recursive:!0,force:!0})}}function Nl(t){y.app.relaunch(),y.app.quit(),setTimeout(()=>y.app.exit(0),3e3)}var io={AppleMusicRichPresence:En,ConsoleShortcuts:Tn,FixSpotifyEmbeds:Zr,FixYoutubeEmbeds:Yr,OpenInApp:Rn,Translate:Mn,VoiceMessages:_n,XSOverlay:Dn,YoutubeAdblock:ni,Clipper:tr};var oo={};for(let[t,e]of Object.entries(io)){let n=Object.entries(e);if(!n.length)continue;let r=oo[t]={};for(let[i,o]of n){let a=`VencordPluginNative_${t}_${i}`;nr.ipcMain.handle(a,o),r[i]=a}}nr.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=oo});ie();u();function rr(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}Ve();var b=require("electron");u();var ao="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var ae=require("fs"),ye=require("fs/promises"),vo=require("os"),an=require("path");u();ie();Ve();var Je=require("electron");u();ie();var ir=require("electron"),Z=["connect-src"],G=[...Z,"img-src"],co=["style-src","font-src"],so=[...G,"media-src"],P=[...G,...co],lo=[...P,"script-src","worker-src"],ar={"http://localhost:*":P,"http://127.0.0.1:*":P,"localhost:*":P,"127.0.0.1:*":P,"*.github.io":P,"github.com":P,"raw.githubusercontent.com":P,"*.gitlab.io":P,"gitlab.com":P,"*.codeberg.page":P,"codeberg.org":P,"*.githack.com":P,"jsdelivr.net":P,"fonts.googleapis.com":co,"i.imgur.com":G,"i.ibb.co":G,"i.pinimg.com":G,"files.catbox.moe":P,"cdn.discordapp.com":P,"media.discordapp.net":G,"cdnjs.cloudflare.com":lo,"cdn.jsdelivr.net":lo,"api.github.com":Z,"ws.audioscrobbler.com":Z,"musicbrainz.org":Z,"*.listenbrainz.org":Z,"coverartarchive.org":Z,"archive.org":Z,"*.archive.org":Z,"translate-pa.googleapis.com":Z,"*.vencord.dev":G,"manti.vendicated.dev":G,"decor.fieryflames.dev":Z,"ugc.decor.fieryflames.dev":G,"sponsor.ajay.app":Z,"dearrow-thumb.ajay.app":G,"usrbg.is-hardly.online":G,"icons.duckduckgo.com":G,"*.tenor.com":so,"*.tenor.co":so},or=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),$l=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},Ul=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),Gl=t=>{let e=or(t,"content-security-policy-report-only");e&&delete t[e];let n=or(t,"content-security-policy");if(n){let r=$l(t[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(J.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(ar))for(let s of a)i(s,o);t[n]=[Ul(r)]}};function uo(){ir.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&Gl(t),e==="stylesheet")){let r=or(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),ir.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function po(){Je.ipcMain.handle("VencordCspRemoveOverride",jl),Je.ipcMain.handle("VencordCspRequestAddOverride",Bl),Je.ipcMain.handle("VencordCspIsDomainAllowed",Hl)}function Wl(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!P.includes(n)))}function zl(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Discord for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let a=e.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function Bl(t,e,n,r){if(!Wl(e,n))return"invalid";let i=new URL(e).host;if(i in J.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await Je.dialog.showMessageBox({...zl(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(J.store.customCspRules[i]=n,"ok"):"unchecked"}function jl(t,e){return e in J.store.customCspRules?(delete J.store.customCspRules[e],!0):!1}function Hl(t,e,n){try{let r=new URL(e).host,i=ar[r]??J.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}u();var Kl=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,Zl=/^\\@/;function sr(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function fo(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function ho(t,e){if(!t)return sr(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return sr(e);let r={},i="",o="";for(let a of n.split(Kl))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace(Zl,"@");return r[i]=o.trim(),delete r[""],sr(e,r)}$e();u();var Xe=require("path");function ve(t,e){let n=(0,Xe.normalize)(t+"/"),r=(0,Xe.join)(t,e),i=(0,Xe.normalize)(r);return i===(0,Xe.normalize)(t)||i.startsWith(n)?i:null}u();var mo=require("electron");function go(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":mo.shell.openExternal(e)}return{action:"deny"}})}var ql=(0,an.join)(__dirname,"renderer.css");(0,ae.mkdirSync)(de,{recursive:!0});po();function yo(){return(0,ye.readFile)(Ne,"utf-8").catch(()=>"")}async function Yl(){let t=await(0,ye.readdir)(de).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await wo(n).then(fo).catch(()=>null);r!=null&&e.push(ho(r,n))}return e}function wo(t){t=t.replace(/\?v=\d+$/,"");let e=ve(de,t);return e?(0,ye.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}b.ipcMain.handle("VencordOpenQuickCss",()=>b.shell.openPath(Ne));b.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!Br.includes(n))throw"Disallowed protocol.";b.shell.openExternal(e).catch(r=>console.error("[Vencord] Failed to open external link",e,r))});b.ipcMain.handle("VencordGetQuickCss",()=>yo());b.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,ae.writeFileSync)(Ne,e));b.ipcMain.handle("VencordGetThemesList",()=>Yl());b.ipcMain.handle("VencordGetThemeData",(t,e)=>wo(e));b.ipcMain.handle("VencordGetThemeSystemValues",()=>{let t=b.systemPreferences.getAccentColor?.()??"";return t.length&&t[0]!=="#"&&(t=`#${t}`),{"os-accent-color":t}});b.ipcMain.handle("VencordOpenThemesFolder",()=>b.shell.openPath(de));b.ipcMain.handle("VencordOpenSettingsFolder",()=>b.shell.openPath(xe));var lr=[];b.ipcMain.handle("VencordInitFileWatchers",({sender:t})=>{lr.forEach(i=>i.close());let e,n;(0,ye.open)(Ne,"a+").then(i=>{i.close(),e=(0,ae.watch)(Ne,{persistent:!1},rr(async()=>{t.postMessage("VencordQuickCssUpdate",await yo())},50))}).catch(()=>{});let r=(0,ae.watch)(de,{persistent:!1},rr(()=>{t.postMessage("VencordThemeUpdate",void 0)}));lr=[e,r,n].filter(Boolean),t.once("destroyed",()=>{e?.close(),r.close(),n?.close(),lr=[]})});b.ipcMain.on("VencordGetMonacoTheme",t=>{t.returnValue=b.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});b.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=b.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new b.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:b.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,an.join)(__dirname,"preload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});go(n),await n.loadURL(`data:text/html;base64,${ao}`)});b.ipcMain.handle("VencordGetRendererCss",()=>(0,ye.readFile)(ql,"utf-8"));b.ipcMain.on("VencordPreloadGetRendererJs",t=>{t.returnValue=(0,ae.readFileSync)((0,an.join)(__dirname,"renderer.js"),"utf-8")});b.ipcMain.on("VencordSupportsWindowsMaterial",t=>{t.returnValue=Number((0,vo.release)().split(".")[2])>=22621});var Me=require("electron"),Ko=require("path"),wr=require("url");ie();$e();u();var fn=require("electron");u();var xo=require("module"),Jl=(0,xo.createRequire)("/"),Qe,ln,ur,Xl=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{Qe=Jl("worker_threads"),ln=Qe.Worker,ur=Qe.isMarkedAsUntransferable}catch{}var Ql=ln?function(t,e,n,r,i){var o=!1,a=new ln(t+Xl,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return ur&&(r=r.filter(function(s){return!ur(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,ln.prototype.terminate.call(a)},a}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},_=Uint8Array,Re=Uint16Array,Eo=Int32Array,pr=new _([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),fr=new _([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),To=new _([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),ko=function(t,e){for(var n=new Re(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new Eo(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},Qe=ko(pr,2),hr=Qe.b,ec=Qe.r;hr[28]=258,ec[258]=28;var Po=ko(fr,0),Io=Po.b,kd=Po.r,dn=new Re(32768);for(w=0;w<32768;++w)se=(w&43690)>>1|(w&21845)<<1,se=(se&52428)>>2|(se&13107)<<2,se=(se&61680)>>4|(se&3855)<<4,dn[w]=((se&65280)>>8|(se&255)<<8)>>1;var se,w,et=(function(t,e,n){for(var r=t.length,i=0,o=new Re(e);i<r;++i)t[i]&&++o[t[i]-1];var a=new Re(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new Re(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var f=i<<4|t[i],h=e-t[i],d=a[t[i]-1]++<<h,v=d|(1<<h)-1;d<=v;++d)s[dn[d]>>l]=f}else for(s=new Re(r),i=0;i<r;++i)t[i]&&(s[i]=dn[a[t[i]-1]++]>>15-t[i]);return s}),_t=new _(288);for(w=0;w<144;++w)_t[w]=8;var w;for(w=144;w<256;++w)_t[w]=9;var w;for(w=256;w<280;++w)_t[w]=7;var w;for(w=280;w<288;++w)_t[w]=8;var w,Ao=new _(32);for(w=0;w<32;++w)Ao[w]=5;var w;var Co=et(_t,9,1);var Ro=et(Ao,5,1),cn=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},W=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},un=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},Mo=function(t){return(t+7)/8|0},pn=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new _(t.subarray(e,n))};var _o=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],A=function(t,e,n){var r=new Error(e||_o[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,A),!n)throw r;return r},Do=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new _(0);var a=!n,s=a||e.i!=2,l=e.i;a&&(n=new _(i*3));var f=function(kr){var Pr=n.length;if(kr>Pr){var Ir=new _(Math.max(Pr*2,kr));Ir.set(n),n=Ir}},h=e.f||0,d=e.p||0,v=e.b||0,S=e.l,T=e.d,D=e.m,C=e.n,k=i*8;do{if(!S){h=W(t,d,1);var le=W(t,d+1,3);if(d+=3,le)if(le==1)S=Co,T=Ro,D=9,C=5;else if(le==2){var tt=W(t,d,31)+257,Dt=W(t,d+10,15)+4,be=tt+W(t,d+5,31)+1;d+=14;for(var N=new _(be),De=new _(19),I=0;I<Dt;++I)De[To[I]]=W(t,d+I*3,7);d+=Dt*3;for(var nt=cn(De),Zo=(1<<nt)-1,qo=et(De,nt,1),I=0;I<be;){var br=qo[W(t,d,Zo)];d+=br&15;var R=br>>4;if(R<16)N[I++]=R;else{var Oe=0,Ot=0;for(R==16?(Ot=3+W(t,d,3),d+=2,Oe=N[I-1]):R==17?(Ot=3+W(t,d,7),d+=3):R==18&&(Ot=11+W(t,d,127),d+=7);Ot--;)N[I++]=Oe}}var Sr=N.subarray(0,tt),ce=N.subarray(tt);D=cn(Sr),C=cn(ce),S=et(Sr,D,1),T=et(ce,C,1)}else A(1);else{var R=Mo(d)+4,re=t[R-4]|t[R-3]<<8,_e=R+re;if(_e>i){l&&A(0);break}s&&f(v+re),n.set(t.subarray(R,_e),v),e.b=v+=re,e.p=d=_e*8,e.f=h;continue}if(d>k){l&&A(0);break}}s&&f(v+131072);for(var Yo=(1<<D)-1,Jo=(1<<C)-1,hn=d;;hn=d){var Oe=S[un(t,d)&Yo],Le=Oe>>4;if(d+=Oe&15,d>k){l&&A(0);break}if(Oe||A(2),Le<256)n[v++]=Le;else if(Le==256){hn=d,S=null;break}else{var xr=Le-254;if(Le>264){var I=Le-257,rt=pr[I];xr=W(t,d,(1<<rt)-1)+hr[I],d+=rt}var mn=T[un(t,d)&Jo],gn=mn>>4;mn||A(3),d+=mn&15;var ce=Io[gn];if(gn>3){var rt=fr[gn];ce+=un(t,d)&(1<<rt)-1,d+=rt}if(d>k){l&&A(0);break}s&&f(v+131072);var Er=v+xr;if(v<ce){var Tr=o-ce,Xo=Math.min(ce,Er);for(Tr+v<0&&A(3);v<Xo;++v)n[v]=r[Tr+v]}for(;v<Er;++v)n[v]=n[v-ce]}}e.l=S,e.p=hn,e.b=v,e.f=h,S&&(h=1,e.m=D,e.d=T,e.n=C)}while(!h);return v!=n.length&&a?pn(n,0,v):n.subarray(0,v)};var tc=new _(0);var nc=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},bo=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){e+=";"+l+"=";var f=s.toString();if(s.prototype)if(f.indexOf("[native code]")!=-1){var h=f.indexOf(" ",8)+1;e+=f.slice(h,f.indexOf("(",h))}else{e+=f;for(var d in s.prototype)e+=";"+l+".prototype."+d+"="+s.prototype[d].toString()}else e+=f}else n[l]=s}return e},sn=[],rc=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},ic=function(t,e,n,r){if(!sn[n]){for(var i="",o={},a=t.length-1,s=0;s<a;++s)i=bo(t[s],i,o);sn[n]={c:bo(t[a],i,o),e:o}}var l=nc({},sn[n].e);return Ql(sn[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,rc(l),r)},oc=function(){return[_,Re,Eo,pr,fr,To,hr,Io,Co,Ro,dn,_o,et,cn,W,un,Mo,pn,A,Do,mr,Oo,Lo]};var Oo=function(t){return postMessage(t,[t.buffer])},Lo=function(t){return t&&{out:t.size&&new _(t.size),dictionary:t.dictionary}},ac=function(t,e,n,r,i,o){var a=ic(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([t,e],e.consume?[t.buffer]:[]),function(){a.terminate()}};var ee=function(t,e){return t[e]|t[e+1]<<8},z=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},cr=function(t,e){return z(t,e)+z(t,e+4)*4294967296};function sc(t,e,n){return n||(n=e,e={}),typeof n!="function"&&A(7),ac(t,e,[oc],function(r){return Oo(mr(r.data[0],Lo(r.data[1])))},1,n)}function mr(t,e){return Do(t,{i:2},e&&e.out,e&&e.dictionary)}var dr=typeof TextDecoder<"u"&&new TextDecoder,lc=0;try{dr.decode(tc,{stream:!0}),lc=1}catch{}var cc=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:pn(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function uc(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(dr)return dr.decode(t);var i=cc(t),o=i.s,n=i.r;return n.length&&A(8),o}}var dc=function(t,e){return e+30+ee(t,e+26)+ee(t,e+28)},pc=function(t,e,n){var r=ee(t,e+28),i=ee(t,e+30),o=uc(t.subarray(e+46,e+46+r),!(ee(t,e+8)&2048)),a=e+46+r,s=fc(t,a,i,n,z(t,e+20),z(t,e+24),z(t,e+42)),l=s[0],f=s[1],h=s[2];return[ee(t,e+10),l,f,o,a+i+ee(t,e+32),h]},fc=function(t,e,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,f=a==4294967295,h=e+n,d=s+l+f;if(r&&d){for(;e+4<h;e+=4+ee(t,e+2))if(ee(t,e)==1)return[s?cr(t,e+4+8*l):i,l?cr(t,e+4):o,f?cr(t,e+4+8*(l+s)):a,1];r<2&&A(13)}return[i,o,a,0]};var So=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function Vo(t,e,n){n||(n=e,e={}),typeof n!="function"&&A(7);var r=[],i=function(){for(var C=0;C<r.length;++C)r[C]()},o={},a=function(C,k){So(function(){n(C,k)})};So(function(){a=n});for(var s=t.length-22;z(t,s)!=101010256;--s)if(!s||t.length-s>65558)return a(A(13,0,1),null),i;var l=ee(t,s+8);if(l){var f=l,h=z(t,s+16),d=z(t,s-20)==117853008;if(d){var v=z(t,s-12);d=z(t,v)==101075792,d&&(f=l=z(t,v+32),h=z(t,v+48))}for(var S=e&&e.filter,T=function(C){var k=pc(t,h,d),le=k[0],R=k[1],re=k[2],_e=k[3],tt=k[4],Dt=k[5],be=dc(t,Dt);h=tt;var N=function(I,nt){I?(i(),a(I,null)):(nt&&(o[_e]=nt),--l||a(null,o))};if(!S||S({name:_e,size:R,originalSize:re,compression:le}))if(!le)N(null,pn(t,be,be+R));else if(le==8){var De=t.subarray(be,be+R);if(re<524288||R>.8*re)try{N(null,mr(De,{out:new _(re)}))}catch(I){N(I,null)}else r.push(sc(De,{size:re},N))}else N(A(14,"unknown compression type "+le,1),null);else N(null,null)},D=0;D<f;++D)T(D)}else a(null,{});return i}var $o=require("fs"),te=require("fs/promises"),gr=require("path");$e();u();function Fo(t){function e(a,s,l,f){let h=0;return h+=a<<0,h+=s<<8,h+=l<<16,h+=f<<24>>>0,h}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let a=e(t[8],t[9],t[10],t[11]),s=e(t[12],t[13],t[14],t[15]),l=16+a+s;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}u();var hc=require("original-fs");async function mc(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function No(t,e){let r=await(await mc(t,e)).arrayBuffer();return Buffer.from(r)}var gc=(0,gr.join)(Ft,"ExtensionCache");async function vc(t,e){return await(0,te.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{Vo(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let d=ve(e,a);if(!d)throw new Error(`Path traversal detected: "${a}"`);return void await(0,te.mkdir)(d,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),f=ve(e,l);if(!f)throw new Error(`Path traversal detected: "${a}"`);let h=ve(e,a);if(!h)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,te.mkdir)(f,{recursive:!0}),await(0,te.writeFile)(h,o[a])})).then(()=>n()).catch(a=>{(0,te.rm)(e,{recursive:!0,force:!0}),r(a)})})})}async function Uo(t){let e=(0,gr.join)(gc,t);try{await(0,te.access)(e,$o.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await No(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await vc(Fo(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}fn.session.defaultSession.extensions?fn.session.defaultSession.extensions.loadExtension(e):fn.session.defaultSession.loadExtension(e)}Nt||Me.app.whenReady().then(()=>{Me.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=ve(de,n);return r?Me.net.fetch((0,wr.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return Me.net.fetch((0,wr.pathToFileURL)((0,Ko.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{M.store.enableReactDevtools&&Uo("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}uo()});Ho();
//# sourceURL=file:///VencordPatcher
//# sourceMappingURL=vencord://patcher.js.map
/*! For license information please see patcher.js.LEGAL.txt */

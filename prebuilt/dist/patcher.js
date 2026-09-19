// Vencord 59a5428
// Standalone: false
// Platform: win32
// Updater Disabled: false
"use strict";var Yo=Object.create;var Lt=Object.defineProperty;var Jo=Object.getOwnPropertyDescriptor;var Xo=Object.getOwnPropertyNames;var Qo=Object.getPrototypeOf,ea=Object.prototype.hasOwnProperty;var B=(t,e,n)=>()=>{if(n)throw n[0];try{return t&&(e=t(t=0)),e}catch(r){throw n=[r],r}};var Se=(t,e)=>{for(var n in e)Lt(t,n,{get:e[n],enumerable:!0})},Pr=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Xo(e))!ea.call(t,i)&&i!==n&&Lt(t,i,{get:()=>e[i],enumerable:!(r=Jo(e,i))||r.enumerable});return t};var gn=(t,e,n)=>(n=t!=null?Yo(Qo(t)):{},Pr(e||!t||!t.__esModule?Lt(n,"default",{value:t,enumerable:!0}):n,t)),vn=t=>Pr(Lt({},"__esModule",{value:!0}),t);var u=B(()=>{"use strict"});var Ve=B(()=>{"use strict";u()});function it(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var Ir=B(()=>{"use strict";u()});var oa={};function Fe(...t){let e={cwd:Mr};return wn?yn("flatpak-spawn",["--host","git",...t],e):yn("git",t,e)}async function ta(){return(await Fe("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function na(){await Fe("fetch");let t=(await Fe("branch","--show-current")).stdout.trim();if(!((await Fe("ls-remote","origin",t)).stdout.length>0))return[];let r=(await Fe("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,a,...s]=i.split("/");return{hash:a,author:o,message:s.join("/").split(`
`)[0]}}):[]}async function ra(){return(await Fe("pull")).stdout.includes("Fast-forward")}async function ia(){return!(await yn(wn?"flatpak-spawn":"node",wn?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:Mr})).stderr.includes("Build failed")}var Ar,ot,Cr,Rr,Mr,yn,wn,_r=B(()=>{"use strict";u();Ve();Ar=require("child_process"),ot=require("electron"),Cr=require("path"),Rr=require("util");Ir();Mr=(0,Cr.join)(__dirname,".."),yn=(0,Rr.promisify)(Ar.execFile),wn=!1;ot.ipcMain.handle("VencordGetRepo",it(ta));ot.ipcMain.handle("VencordGetUpdates",it(na));ot.ipcMain.handle("VencordUpdate",it(ra));ot.ipcMain.handle("VencordBuild",it(ia))});var En,Nr,at,Ur=B(()=>{"use strict";u();En=Symbol("SettingsStore.isProxy"),Nr=Symbol("SettingsStore.getRawTarget"),at=class{pathListeners=new Map;prefixListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===En)return!0;if(r===Nr)return n;let o=Reflect.get(n,r,i),a=e.proxyContexts.get(n);if(a==null)return o;let{root:s,path:l}=a;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:s,path:l})),typeof o=="object"&&o!==null&&!o[En]){let h=`${l}${l&&"."}${r}`;return e.makeProxy(o,s,h)}return o},set(n,r,i){if(i?.[En]&&(i=i[Nr]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:a,path:s}=o,l=`${s}${s&&"."}${r}`;return e.notifyListeners(l,i,a),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:a}=i,s=`${a}${a&&"."}${r}`;return e.notifyListeners(s,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyPrefixListeners(e,n,r){for(let i=1;i<=n.length;i++){let o=n.slice(0,i).join(".");this.prefixListeners.get(o)?.forEach(a=>a(r,e))}}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),a=o.join("."),s=o.reduce((l,h)=>l[h],r);this.globalListeners.forEach(l=>l(r,a)),this.pathListeners.get(a)?.forEach(l=>l(s))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n)),this.notifyPrefixListeners(e,i,n)}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r)),this.notifyPrefixListeners(n,i,r)}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}addPrefixChangeListener(e,n){let r=this.prefixListeners.get(e)??new Set;r.add(n),this.prefixListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}removePrefixChangeListener(e,n){let r=this.prefixListeners.get(e);r&&(r.delete(n),r.size||this.prefixListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}}});function kn(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},kn(t[n],r)):t[n]??=r}return t}var $r=B(()=>{"use strict";u()});var Gr,ue,Ft,xe,de,Ne,Pn,In,zr,Nt,Ue=B(()=>{"use strict";u();Gr=require("electron"),ue=require("path"),Ft=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,ue.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,ue.join)(Gr.app.getPath("userData"),"..","Vencord")),xe=(0,ue.join)(Ft,"settings"),de=(0,ue.join)(Ft,"themes"),Ne=(0,ue.join)(xe,"quickCss.css"),Pn=(0,ue.join)(xe,"settings.json"),In=(0,ue.join)(xe,"native-settings.json"),zr=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"],Nt=process.argv.includes("--vanilla")});function Wr(t,e){try{return JSON.parse((0,Te.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var An,Te,M,ca,Br,J,ie=B(()=>{"use strict";u();Ve();Ur();$r();An=require("electron"),Te=require("fs");Ue();(0,Te.mkdirSync)(xe,{recursive:!0});M=new at(Wr("renderer",Pn));M.addGlobalChangeListener(()=>{try{(0,Te.writeFileSync)(Pn,JSON.stringify(M.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});An.ipcMain.on("VencordGetSettings",t=>t.returnValue=M.plain);An.ipcMain.handle("VencordSetSettings",(t,e,n)=>{M.setData(e,n)});ca={plugins:{},customCspRules:{}},Br=Wr("native",In);kn(Br,ca);J=new at(Br);J.addGlobalChangeListener(()=>{try{(0,Te.writeFileSync)(In,JSON.stringify(J.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}})});function No(t,e,n){let r=e;if(e in t)return void n(t[r]);Object.defineProperty(t,e,{set(i){delete t[r],t[r]=i,n(i)},configurable:!0,enumerable:!1})}var Uo=B(()=>{"use strict";u()});var dc={};function uc(t,e){let n=t.slice(4).split(".").map(Number),r=e.slice(4).split(".").map(Number);for(let i=0;i<r.length;i++){if(n[i]>r[i])return!0;if(n[i]<r[i])return!1}return!1}function $o(){if(!process.env.DISABLE_UPDATER_AUTO_PATCHING)try{let t=(0,q.dirname)(process.execPath),e=(0,q.basename)(t),n=(0,q.join)(t,".."),r=(0,ne.readdirSync)(n).reduce((h,f)=>f.startsWith("app-")&&uc(f,h)?f:h,e);if(r===e)return;let i=(0,q.join)(n,e,"resources"),o=(0,q.join)(i,"app.asar"),a=(0,q.join)(n,r,"resources"),s=(0,q.join)(a,"app.asar"),l=(0,q.join)(a,"_app.asar");if(!(0,ne.existsSync)(o)||!(0,ne.existsSync)(s)||(0,ne.existsSync)(l))return;console.info(`[Vencord] Detected Host Update (${e} -> ${r}). Repatching...`),(0,ne.renameSync)(s,l),(0,ne.copyFileSync)(o,s)}catch(t){console.error("[Vencord] Failed to repatch latest host update",t)}}var Go,mr,ne,q,zo=B(()=>{"use strict";u();Go=require("electron"),mr=gn(require("events")),ne=require("original-fs"),q=require("path");mr.default.prototype.emit=new Proxy(mr.default.prototype.emit,{apply(t,e,n){return n[0]==="host-updated"&&$o(),Reflect.apply(t,e,n)}}),Go.app.on("before-quit",$o)});var mc={};var Y,we,pc,hc,gr,fc,Wo=B(()=>{"use strict";u();Uo();Y=gn(require("electron")),we=require("path");ie();Ue();console.log("[Vencord] Starting up...");pc=require.main.filename,hc=require.main.path.endsWith("app.asar")?"_app.asar":"app.asar",gr=(0,we.join)((0,we.dirname)(pc),"..",hc),fc=require((0,we.join)(gr,"package.json"));require.main.filename=(0,we.join)(gr,fc.main);Y.app.setAppPath(gr);if(Nt)console.log("[Vencord] Running in vanilla mode. Not loading Vencord");else{let t=M.store;if(zo(),t.winCtrlQ){let r=Y.Menu.buildFromTemplate;Y.Menu.buildFromTemplate=function(i){if(i[0]?.label==="&File"){let{submenu:o}=i[0];Array.isArray(o)&&o.push({label:"Quit (Hidden)",visible:!1,acceleratorWorksWhenHidden:!0,accelerator:"Control+Q",click:()=>Y.app.quit()})}return r.call(this,i)}}class e extends Y.default.BrowserWindow{constructor(i){if(!i?.webPreferences?.preload||!i.title){super(i);return}let{frameless:o,winNativeTitleBar:a,disableMinSize:s,transparent:l,macosVibrancyStyle:h,windowsMaterial:f}=t,d=i.webPreferences.preload;i.webPreferences.preload=(0,we.join)(__dirname,"preload.js"),i.webPreferences.sandbox=!1,o?i.frame=!1:a&&delete i.frame,s&&(i.minWidth=0,i.minHeight=0),l&&(i.transparent=!0,i.backgroundColor="#00000000"),f&&f!=="none"&&(i.backgroundMaterial=f,i.backgroundColor="#00000000"),process.env.DISCORD_PRELOAD=d,super(i),s&&(this.setMinimumSize=(v,S)=>{})}}Object.assign(e,Y.default.BrowserWindow),Object.defineProperty(e,"name",{value:"BrowserWindow",configurable:!0});let n=require.resolve("electron");delete require.cache[n].exports,require.cache[n].exports={...Y.default,BrowserWindow:e},No(global,"appSettings",r=>{r.set("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING",!0)}),process.env.DATA_DIR=(0,we.join)(Y.app.getPath("userData"),"..","Vencord")}console.log("[Vencord] Loading original Discord app.asar");require(require.main.filename)});u();u();u();_r();u();Ve();var er=require("electron");u();var xn={};Se(xn,{fetchTrackData:()=>sa});u();u();u();var Dr="59a5428";u();var bn="Vendicated/Vencord";var Or=`Vencord/${Dr}${bn?` (https://github.com/${bn})`:""}`;var Lr=require("child_process"),Vr=require("util"),Fr=(0,Vr.promisify)(Lr.execFile);async function Sn(t){let{stdout:e}=await Fr("osascript",t.map(n=>["-e",n]).flat());return e}var j=null;async function aa({id:t,name:e,artist:n,album:r}){if(t===j?.id){if("data"in j)return j.data;if("failures"in j&&j.failures>=5)return null}try{let i=new URL("https://itunes.apple.com/search");i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("media","music"),i.searchParams.set("entity","song");let o=await fetch(i,{headers:{"user-agent":Or}}).then(s=>s.json()).then(s=>s.results.find(l=>l.collectionName===r)||s.results[0]),a=await fetch(o.artistViewUrl).then(s=>s.text()).then(s=>{let l=s.match(/<meta property="og:image" content="(.+?)">/);return l?l[1].replace(/[0-9]+x.+/,"220x220bb-60.png"):void 0}).catch(()=>{});return j={id:t,data:{appleMusicLink:o.trackViewUrl,appleMusicArtistLink:o.artistViewUrl,songLink:`https://song.link/i/${new URL(o.trackViewUrl).searchParams.get("i")}`,albumArtwork:o.artworkUrl100.replace("100x100","512x512"),artistArtwork:a}},j.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),j={id:t,failures:(t===j?.id&&"failures"in j?j.failures:0)+1},null}}async function sa(){try{await Fr("pgrep",["^Music$"])}catch{return null}if(await Sn(['tell application "Music"',"get player state","end tell"]).then(f=>f.trim())!=="playing")return null;let e=await Sn(['tell application "Music"',"get player position","end tell"]).then(f=>Number.parseFloat(f.trim())),n=await Sn(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,a,s]=n.split(`
`).filter(f=>!!f),l=Number.parseFloat(s),h=await aa({id:r,name:i,artist:a,album:o});return{name:i,album:o,artist:a,playerPosition:e,duration:l,...h}}var Tn={};Se(Tn,{initDevtoolsOpenEagerLoad:()=>la});u();function la(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var Hr={};u();ie();var $t=require("electron"),Ut=[];function jr(){let t=[];for(let e=Ut.length-1;e>=0;e--){let{processId:n,routingId:r}=Ut[e],i=$t.webFrameMain.fromId(n,r);if(!i){Ut.splice(e,1);continue}t.push(i)}return t}$t.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){jr();let{routingId:i,processId:o}=r;Ut.push({routingId:i,processId:o});let a=M.store.plugins?.FixSpotifyEmbeds;if(!a?.enabled)return;r.executeJavaScript(`
                    globalThis._vcVolume = ${a.volume/100};
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = _vcVolume;
                        return original.apply(this, arguments);
                    }
                `)}})})});M.addChangeListener("plugins.FixSpotifyEmbeds.volume",t=>{try{jr().forEach(e=>e.executeJavaScript(`globalThis._vcVolume = ${t/100}`))}catch(e){console.error("FixSpotifyEmbeds: Failed to update volume",e)}});var Zr={};u();ie();var Kr=require("electron");Kr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!M.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})});var Cn={};Se(Cn,{resolveRedirect:()=>da});u();var qr=require("https"),ua=/^https:\/\/(spotify\.link|s\.team)\/.+$/;function Yr(t){return new Promise((e,n)=>{let r=(0,qr.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?Yr(i.headers.location):t)});r.on("error",n),r.end()})}async function da(t,e){return ua.test(e)?Yr(e):e}var Rn={};Se(Rn,{makeDeeplTranslateRequest:()=>pa,makeKagiTranslateRequest:()=>ha});u();async function pa(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),a=await o.text();return{status:o.status,data:a}}catch(o){return{status:-1,data:String(o)}}}async function ha(t,e,n,r,i){let o="https://translate.kagi.com/api/translate";try{let a=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json",Cookie:`kagi_session=${e}`},body:JSON.stringify({text:n,from:r,to:i,model:"standard"})}),s=await a.json();return{status:a.status,data:s}}catch(a){return{status:-1,data:String(a)}}}var Mn={};Se(Mn,{readRecording:()=>fa});u();var Jr=require("electron"),Gt=require("fs/promises"),st=require("path");async function fa(t,e){e=(0,st.normalize)(e);let n=(0,st.basename)(e),r=(0,st.normalize)(Jr.app.getPath("userData")+"/");if(!/^\d*recording\.ogg$/.test(n)||!e.startsWith(r))return null;try{let i=await(0,Gt.readFile)(e);return(0,Gt.rm)(e).catch(()=>{}),new Uint8Array(i.buffer)}catch{return null}}var _n={};Se(_n,{closeSocket:()=>ga,sendToOverlay:()=>ma});u();var Xr=require("dgram"),zt=null;function ma(t,e){e.messageType=e.type;let n=JSON.stringify(e);zt??=(0,Xr.createSocket)("udp4"),zt.send(n,42069,"127.0.0.1")}function ga(){zt?.close(),zt=null}var ei={};u();ie();var Qr=require("electron");u();var Dn=`"use strict";(()=>{if(window.adguardInjected)return;window.adguardInjected=!0;const c=["#__ffYoutube1","#__ffYoutube2","#__ffYoutube3","#__ffYoutube4","#feed-pyv-container","#feedmodule-PRO","#homepage-chrome-side-promo","#merch-shelf","#offer-module",'#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',"#pla-shelf","#premium-yva","#promo-info","#promo-list","#promotion-shelf","#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer","#search-pva","#shelf-pyv-container","#video-masthead","#watch-branded-actions","#watch-buy-urls","#watch-channel-brand-div","#watch7-branded-banner","#YtKevlarVisibilityIdentifier","#YtSparklesVisibilityIdentifier",".carousel-offer-url-container",".companion-ad-container",".GoogleActiveViewElement",'.list-view[style="margin: 7px 0pt;"]',".promoted-sparkles-text-search-root-container",".promoted-videos",".searchView.list-view",".sparkles-light-cta",".watch-extra-info-column",".watch-extra-info-right",".ytd-carousel-ad-renderer",".ytd-compact-promoted-video-renderer",".ytd-companion-slot-renderer",".ytd-merch-shelf-renderer",".ytd-player-legacy-desktop-watch-ads-renderer",".ytd-promoted-sparkles-text-search-renderer",".ytd-promoted-video-renderer",".ytd-search-pyv-renderer",".ytd-video-masthead-ad-v3-renderer",".ytp-ad-action-interstitial-background-container",".ytp-ad-action-interstitial-slot",".ytp-ad-image-overlay",".ytp-ad-overlay-container",".ytp-ad-progress",".ytp-ad-progress-list",'[class*="ytd-display-ad-"]','[layout*="display-ad-"]','a[href^="http://www.youtube.com/cthru?"]','a[href^="https://www.youtube.com/cthru?"]',"ytd-action-companion-ad-renderer","ytd-banner-promo-renderer","ytd-compact-promoted-video-renderer","ytd-companion-slot-renderer","ytd-display-ad-renderer","ytd-promoted-sparkles-text-search-renderer","ytd-promoted-sparkles-web-renderer","ytd-search-pyv-renderer","ytd-single-option-survey-renderer","ytd-video-masthead-ad-advertiser-info-renderer","ytd-video-masthead-ad-v3-renderer","YTM-PROMOTED-VIDEO-RENDERER"],l=()=>{const e=c;if(!e)return;const t=e.join(", ")+" { display: none!important; }",r=document.createElement("style");r.textContent=t,document.head.appendChild(r)},p=e=>{new MutationObserver(r=>{e(r)}).observe(document.documentElement,{childList:!0,subtree:!0})},a=()=>{const e=document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");e.length!==0&&e.forEach(t=>{if(t.parentNode&&t.parentNode.parentNode){const r=t.parentNode.parentNode;r.localName==="ytd-rich-item-renderer"&&(r.style.display="none")}})},s=()=>{if(document.querySelector(".ad-showing")){const e=document.querySelector("video");e&&e.duration&&(e.currentTime=e.duration,setTimeout(()=>{const t=document.querySelector("button.ytp-ad-skip-button");t&&t.click()},100))}},d=(e,t,r)=>{if(!e)return!1;let n=!1;for(const o in e)e.hasOwnProperty(o)&&o===t?(e[o]=r,n=!0):e.hasOwnProperty(o)&&typeof e[o]=="object"&&d(e[o],t,r)&&(n=!0);return n},i=(e,t)=>{const r=JSON.parse;JSON.parse=(...n)=>{const o=r.apply(this,n);return d(o,e,t),o},Response.prototype.json=new Proxy(Response.prototype.json,{async apply(...n){const o=await Reflect.apply(...n);return d(o,e,t),o}})};i("adPlacements",[]),i("playerAds",[]),l(),a(),s(),p(()=>{a(),s()})})();
`;Qr.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{M.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")?r.executeJavaScript(Dn):r.parent?.url.includes("youtube.com/embed/")&&r.parent.executeJavaScript(Dn))})})});var Qn={};Se(Qn,{answerOverlayAction:()=>El,armDisplayMedia:()=>qs,checkUpdate:()=>Il,closeStudioOverlay:()=>bl,deleteClip:()=>Is,disarmDisplayMedia:()=>Ys,downloadUpdate:()=>Cl,dropOverlayWaiters:()=>Tl,emptyTrash:()=>Ps,focusClient:()=>kl,gameFeedStatus:()=>nl,getActiveScreen:()=>Zs,getCaptureSources:()=>Hs,getClipDirectory:()=>zs,getMemoryReport:()=>Ks,getPlatformInfo:()=>js,hideClipOverlay:()=>ml,hideVrPanel:()=>cl,listClips:()=>gs,listTrash:()=>ks,notifyClipSaved:()=>fl,openClipDirectory:()=>Bs,openStudioOverlay:()=>wl,openVrBindings:()=>sl,pickAudioFiles:()=>Os,pickClipDirectory:()=>Ws,pickImageFiles:()=>Fs,pickVideoFiles:()=>Ms,readAudioFile:()=>Vs,readClip:()=>vs,readImageFile:()=>$s,readLibrary:()=>Cs,readVideoFile:()=>Ds,readVoiceTrack:()=>fs,registerShortcuts:()=>Xs,relaunchClient:()=>Rl,releaseClipPath:()=>us,renameClip:()=>As,reserveClipPath:()=>cs,restoreClip:()=>Es,revealClip:()=>Gs,saveClip:()=>ls,saveVoiceTrack:()=>hs,shareClip:()=>bs,showClipOverlay:()=>hl,showVrPanel:()=>ll,startGameFeeds:()=>el,startVrBridge:()=>il,stopGameFeeds:()=>tl,stopVrBridge:()=>ol,studioOverlayUp:()=>Sl,trashClip:()=>Ts,unregisterShortcuts:()=>Jn,vrBridgeStatus:()=>al,waitForGameEvent:()=>rl,waitForOverlayAction:()=>xl,waitForShortcut:()=>Qs,waitForVrEvent:()=>ul,writeLibrary:()=>Rs});u();var zi=require("crypto"),y=require("electron"),c=require("fs"),nn=require("https"),p=require("path");u();var H=require("fs"),ri=require("http"),ii=require("https"),oi=require("os"),ht=require("path"),ti=34765,va=6,ai=256*1024,ya=2e3,wa=1500,ba="127.0.0.1",Sa=2999,xa="gamestate_integration_clipper.cfg",pe=null,Ge=0,Bt="",ze=null,dt=[],Ta=12,pt=[],We=[],Be={cs2:!1,league:!1};function jt(t){dt.length>=Ta||dt.includes(t)||dt.push(t)}var Ht=Promise.resolve();function lt(t){let e=We.shift();if(e){e(t);return}pt.push(t),pt.length>16&&pt.shift()}var T={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0};function si(){T={kills:-1,deaths:-1,round:-1,roundKills:0,announced:0}}function Ea(t){return t>=5?"an ace in Counter-Strike 2":t===4?"a 4K in Counter-Strike 2":"a 3K in Counter-Strike 2"}function ka(t){let e=t.provider?.steamid,{player:n}=t;if(!n||!e||!n.steamid||n.steamid!==e)return;let r=n.match_stats;if(!r||typeof r.kills!="number"||typeof r.deaths!="number")return;let i=typeof t.map?.round=="number"?t.map.round:T.round;(r.kills<T.kills||r.deaths<T.deaths)&&si();let o=T.kills<0;i!==T.round&&(T.round=i,T.roundKills=0,T.announced=0);let a=r.kills-Math.max(0,T.kills),s=r.deaths-Math.max(0,T.deaths);if(T.kills=r.kills,T.deaths=r.deaths,o)return;a>0&&(T.roundKills+=a,T.roundKills>=3&&T.roundKills>T.announced?(T.announced=T.roundKills,lt({kind:"multikill",note:Ea(T.roundKills)})):lt({kind:"kill",note:a>1?"a double kill in Counter-Strike 2":"a kill in Counter-Strike 2"})),s>0&&lt({kind:"death",note:"your death in Counter-Strike 2"});let l=t.round?.win_team;l&&n.team&&l===n.team&&t.round?.phase==="over"&&T.roundKills>0&&lt({kind:"roundwin",note:"a round you won in Counter-Strike 2"})}function Pa(){return new Promise(t=>{let e=0,n=(0,ri.createServer)((r,i)=>{if(r.method!=="POST"){i.writeHead(405).end();return}let o="",a=!1;r.setEncoding("utf8"),r.on("data",s=>{a||(o+=s,o.length>ai&&(a=!0,o="",r.destroy()))}),r.on("end",()=>{if(i.writeHead(200).end(),!a)try{ka(JSON.parse(o))}catch{}}),r.on("error",()=>{})});n.on("error",r=>{if(r.code==="EADDRINUSE"&&++e<va){n.listen(ti+e,"127.0.0.1");return}jt(`The Counter-Strike listener could not open a port (${r.code??r.message})`);try{n.close()}catch{}pe===n&&(pe=null,Ge=0,Be={...Be,cs2:!1}),t(0)}),n.on("listening",()=>{pe=n,t(n.address().port)}),n.listen(ti,"127.0.0.1")})}function Ia(){let t=[],e=(0,oi.homedir)();{let r=[process.env["ProgramFiles(x86)"],process.env.ProgramW6432,process.env.ProgramFiles];for(let i of r)i&&t.push((0,ht.join)(i,"Steam"))}let n=[];for(let r of t)if((0,H.existsSync)(r)){n.push(r);try{let i=(0,H.readFileSync)((0,ht.join)(r,"steamapps","libraryfolders.vdf"),"utf8");for(let o of i.matchAll(/"path"\s+"([^"]+)"/g)){let a=o[1].replace(/\\\\/g,"\\");a&&!n.includes(a)&&n.push(a)}}catch{}}return n}function Aa(){for(let t of Ia()){let e=(0,ht.join)(t,"steamapps","common","Counter-Strike Global Offensive","game","csgo","cfg");if((0,H.existsSync)(e))return e}return""}function Ca(t){let e=Aa();if(!e)return jt("Counter-Strike 2 is not installed where Steam usually puts it, so its config was not written"),"";let n=(0,ht.join)(e,xa),r=`"Clipper"
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
`;try{return(0,H.mkdirSync)(e,{recursive:!0}),(0,H.writeFileSync)(n,r,"utf8"),n}catch(i){return jt(`Counter-Strike 2's config could not be written (${i.message})`),""}}function Ra(){let t=Bt;if(Bt="",!!t)try{(0,H.unlinkSync)(t)}catch{}}var ct="",$e=-1,On=!1,Wt=!1;function ut(t){return t.split("#")[0].trim().toLowerCase()}function ni(t){return new Promise(e=>{let n=(0,ii.get)({host:ba,port:Sa,path:t,rejectUnauthorized:!1,timeout:wa},r=>{if(r.statusCode!==200){r.resume(),e(null);return}let i="";r.setEncoding("utf8"),r.on("data",o=>{i+=o,i.length>ai&&n.destroy()}),r.on("end",()=>{try{e(JSON.parse(i))}catch{e(null)}})});n.on("timeout",()=>n.destroy()),n.on("error",()=>e(null))})}function Ma(t,e){let n=t.EventName??"",r=ut(t.KillerName??"");switch(n){case"ChampionKill":return r===e?{kind:"kill",note:"a kill in League of Legends"}:ut(t.VictimName??"")===e?{kind:"death",note:"your death in League of Legends"}:null;case"Multikill":return r!==e?null:{kind:"multikill",note:`a ${t.KillStreak??3}-kill run in League of Legends`};case"Ace":return ut(t.Acer??"")!==e?null:{kind:"multikill",note:"an ace in League of Legends"};case"FirstBlood":return ut(t.Recipient??"")!==e?null:{kind:"kill",note:"first blood in League of Legends"};case"DragonKill":return r!==e?null:{kind:"objective",note:`${t.DragonType?`the ${t.DragonType.toLowerCase()} dragon`:"a dragon"} in League of Legends`};case"BaronKill":return r!==e?null:{kind:"objective",note:"baron in League of Legends"};case"HeraldKill":return r!==e?null:{kind:"objective",note:"the herald in League of Legends"};case"TurretKilled":case"InhibKilled":return r!==e?null:{kind:"objective",note:"a structure in League of Legends"};default:return null}}async function _a(){if(!Wt){Wt=!0;try{if(!ct){let r=await ni("/liveclientdata/activeplayername");if(typeof r!="string"||!r)return;ct=ut(r),$e=-1}let t=await ni("/liveclientdata/eventdata");if(!t?.Events){ct="";return}let e=$e<0,n=$e;for(let r of t.Events){let i=typeof r.EventID=="number"?r.EventID:-1;if(i<=$e||(n=Math.max(n,i),e))continue;let o=Ma(r,ct);o&&lt(o)}$e=n}finally{Wt=!1}}}function Da(){ct="",$e=-1,Wt=!1,ze=setInterval(()=>{_a().catch(t=>{On||(On=!0,jt(`League of Legends could not be read (${t.message})`))})},ya)}function Oa(t){return t.cs2!==Be.cs2||t.league!==Be.league?!1:(!t.cs2||pe!==null)&&(!t.league||ze!==null)}function li(t){let e=Ht.then(async()=>(Oa(t)||(ci(),dt=[],t.cs2&&(si(),Ge=await Pa(),Ge&&(Bt=Ca(Ge))),t.league&&Da(),Be={cs2:t.cs2&&pe!==null,league:t.league}),Kt()));return Ht=e.catch(()=>{}),e}function ci(){if(Be={cs2:!1,league:!1},ze&&clearInterval(ze),ze=null,On=!1,pe)try{pe.close()}catch{}pe=null,Ge=0,Ra(),pt=[];let t=We;We=[];for(let e of t)e(null)}function Ln(){let t=Ht.then(()=>ci());return Ht=t.catch(()=>{}),t}function Kt(){return{port:Ge,configPath:Bt,league:ze!==null,problems:[...dt]}}function ui(t){let e=pt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{We=We.filter(a=>a!==i),i(null)},t);We.push(i)})}u();var he=require("electron"),Yt=require("fs"),mt=require("path"),di=require("url"),Zt=24,pi=2600,qt=220,La=300,Va=56,Vn=!0;function Jt(){return Vn}var Pe=null,Ee=null,ft=null,ke=null;function Fa(){return!!Pe&&!Pe.isDestroyed()}function Ie(){Ee&&(clearTimeout(Ee),Ee=null);let t=Pe;Pe=null,t&&!t.isDestroyed()&&t.destroy()}function je(){ke&&(clearTimeout(ke),ke=null);let t=ft;ft=null,t&&!t.isDestroyed()&&t.destroy()}function Na(t,e,n){let i=he.screen.getDisplayNearestPoint(he.screen.getCursorScreenPoint()).workArea,o=t==="top-left"||t==="bottom-left",a=t==="top-left"||t==="top-right";return{x:Math.round(o?i.x+Zt:i.x+i.width-e-Zt),y:Math.round(a?i.y+Zt:i.y+i.height-n-Zt)}}function gt(t,e){let n=(0,mt.join)(he.app.getPath("userData"),"clipper-overlay");(0,Yt.mkdirSync)(n,{recursive:!0});let r=(0,mt.join)(n,t);return(0,Yt.writeFileSync)(r,e,"utf8"),r}function hi(t,e,n,r){let{x:i,y:o}=Na(r,e,n),a=new he.BrowserWindow({width:e,height:n,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,focusable:!1,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return a.setAlwaysOnTop(!0,"screen-saver"),a.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),a.setIgnoreMouseEvents(!0,{forward:!0}),a.loadFile(t).then(()=>{a.isDestroyed()||a.showInactive()}).catch(()=>{a.isDestroyed()||a.destroy()}),a}function fi(t){return`<meta charset="utf-8">
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
</style>`}function X(t){return JSON.stringify(t).replace(/</g,"\\u003c")}function Ua(t,e){return`<!doctype html>
<html>
<head>
${fi(`.card { background: #000; }
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

    video.src = ${X((0,di.pathToFileURL)(t).href)};

    // Autoplay with sound is only allowed after a gesture, and this window
    // never gets one. Muted playback is always allowed, so it is the fallback
    // rather than a reason to show nothing.
    video.play().catch(function () {
        video.muted = true;
        video.play().catch(leave);
    });
</script>
</body>
</html>`}function $a(t,e){return`<!doctype html>
<html>
<head>
${fi(`.card {
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
    }, ${pi});
</script>
</body>
</html>`}function mi(t,e){if(!Vn)return!1;Ie(),je();let n=Math.max(200,Math.round(e.width)),r=Math.round(n*9/16),i=hi(gt("clip.html",Ua(t,e)),n,r,e.corner);Pe=i,i.on("closed",()=>{Pe===i&&(Pe=null,Ee&&(clearTimeout(Ee),Ee=null))});let o=(e.seconds>0?e.seconds:300)+10;return Ee=setTimeout(()=>Ie(),o*1e3),!0}function gi(t,e,n){if(!Vn||Fa())return!1;je();let r=hi(gt("toast.html",$a(t,e)),La,Va,n);return ft=r,r.on("closed",()=>{ft===r&&(ft=null,ke&&(clearTimeout(ke),ke=null))}),ke=setTimeout(()=>je(),pi+4e3),!0}he.app.on("will-quit",()=>{Ie(),je()});u();var Q=require("electron"),vi=require("url");var Fn="VencordClipperOverlayAction",yi="VencordClipperOverlayReply",Ga=108,O=null;function Nn(){return!!O&&!O.isDestroyed()}function yt(){let t=O;O=null,t&&!t.isDestroyed()&&t.destroy()}var He=[],vt=[];function za(t){let e=He.shift();if(e){e(t);return}vt.push(t),vt.length>4&&vt.shift()}function wi(t){let e=vt.shift();return e?Promise.resolve(e):new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{He=He.filter(a=>a!==i),i(null)},t);He.push(i)})}function bi(){vt=[];let t=He;He=[];for(let e of t)e(null)}function Si(t){!O||O.isDestroyed()||O.webContents.send(yi,t)}Q.ipcMain.removeAllListeners(Fn);Q.ipcMain.on(Fn,(t,e,n)=>{if(!O||O.isDestroyed()||t.sender!==O.webContents)return;let r=String(e??"");if(r==="close"){yt();return}if(r!=="cut"&&r!=="send"&&r!=="delete"&&r!=="open"&&r!=="link")return;let i=n??{},o=Number(i.from),a=Number(i.to);za({kind:r,clip:String(i.clip??""),from:Number.isFinite(o)?Math.max(0,o):0,to:Number.isFinite(a)?Math.max(0,a):0})});function Wa(t,e){let{workArea:n}=Q.screen.getDisplayNearestPoint(Q.screen.getCursorScreenPoint());return{x:Math.round(n.x+(n.width-t)/2),y:Math.round(n.y+(n.height-e)/2)}}var Ba=`"use strict";
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("clipper", {
    act(kind, payload) {
        ipcRenderer.send(${X(Fn)}, String(kind), payload);
    },
    onReply(handler) {
        ipcRenderer.on(${X(yi)}, (_event, reply) => handler(reply));
    }
});
`;function ja(t,e){return`<!doctype html>
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
    var clip = ${X({name:t.name,url:(0,vi.pathToFileURL)(t.path).href,markers:t.markers})};
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
</html>`}function xi(t,e){if(!Jt())return!1;yt(),Ie(),je();let n=Math.max(360,Math.round(e.width)),r=Math.round(n*9/16)+Ga,{x:i,y:o}=Wa(n,r),a=gt("studio-preload.js",Ba),s=gt("studio.html",ja(t,e)),l=new Q.BrowserWindow({width:n,height:r,x:i,y:o,frame:!1,transparent:!0,backgroundColor:"#00000000",resizable:!1,movable:!1,minimizable:!1,maximizable:!1,fullscreenable:!1,skipTaskbar:!0,hasShadow:!1,alwaysOnTop:!0,show:!1,webPreferences:{preload:a,nodeIntegration:!1,contextIsolation:!0,sandbox:!0,backgroundThrottling:!1}});return O=l,l.setAlwaysOnTop(!0,"screen-saver"),l.setVisibleOnAllWorkspaces(!0,{visibleOnFullScreen:!0}),l.on("closed",()=>{O===l&&(O=null)}),l.loadFile(s).then(()=>{l.isDestroyed()||(l.show(),l.focus())}).catch(()=>{l.isDestroyed()||l.destroy()}),!0}Q.app.on("will-quit",()=>yt());u();function K(t){return`${t.replace(/\.(webm|mp4)$/i,"")}.thumb.jpg`}u();var Mi=require("child_process"),_i=require("electron"),Wn=require("fs"),Tt=require("path");u();var Ha=`
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
`,Ti=`# Vencord Clipper - SteamVR bridge. Generated; edits are overwritten.
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
${Ha}
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
`;u();var ki=require("electron"),$=require("fs"),U=require("path"),Xt="vencord.clipper",fe="/actions/clipper",wt=["save","mark","toggle","pov"],Ka=["save","mark"],Za={save:"Save a clip",mark:"Drop a marker",toggle:"Start / stop the clip buffer",pov:"Ask the call for their angle"};function Un(){let t=(0,U.join)(ki.app.getPath("userData"),"clipper-vr");return(0,$.mkdirSync)(t,{recursive:!0}),t}function qa(){let t=(0,U.join)(process.env.LOCALAPPDATA??"","openvr","openvrpaths.vrpath");try{let n=JSON.parse((0,$.readFileSync)(t,"utf8")).runtime;if(Array.isArray(n)){for(let r of n)if(typeof r=="string"&&(0,$.existsSync)((0,U.join)(r,"bin","win64","openvr_api.dll")))return r}}catch{}let e=(0,U.join)(process.env["ProgramFiles(x86)"]??"C:\\Program Files (x86)","Steam","steamapps","common","SteamVR");return(0,$.existsSync)((0,U.join)(e,"bin","win64","openvr_api.dll"))?e:null}function Pi(){let t=qa();return t&&(0,U.join)(t,"bin","win64","openvr_api.dll")}var Ya=.4,Ja={save:"double",mark:"long"};function Xa(t,e,n){return{path:t,mode:"button",inputs:{[e]:{output:`${fe}/in/${n}`}},parameters:e==="long"?{long_press_delay:Ya}:{}}}function Ei(t,e){return{app_key:Xt,controller_type:t,description:"Where Clipper's two default binds start out. Change them here, and add the rest.",name:"Clipper defaults",action_manifest_version:0,bindings:{[fe]:{sources:Ka.map(n=>Xa(e[n],Ja[n],n))}}}}function Ii(){let t=Un(),e={language_tag:"en_US",[fe]:"Clipper"};for(let o of wt)e[`${fe}/in/${o}`]=Za[o];let n={default_bindings:[{controller_type:"knuckles",binding_url:"bindings_knuckles.json"},{controller_type:"oculus_touch",binding_url:"bindings_oculus_touch.json"}],action_sets:[{name:fe,usage:"leftright"}],actions:wt.map(o=>({name:`${fe}/in/${o}`,type:"boolean",requirement:"optional"})),localization:[e]},r={save:"/user/hand/right/input/b",mark:"/user/hand/right/input/a"};(0,$.writeFileSync)((0,U.join)(t,"bindings_knuckles.json"),JSON.stringify(Ei("knuckles",r),null,4),"utf8"),(0,$.writeFileSync)((0,U.join)(t,"bindings_oculus_touch.json"),JSON.stringify(Ei("oculus_touch",r),null,4),"utf8");let i=(0,U.join)(t,"actions.json");return(0,$.writeFileSync)(i,JSON.stringify(n,null,4),"utf8"),i}function Ai(t){let e={source:"builtin",applications:[{app_key:Xt,launch_type:"binary",binary_path_windows:t,is_dashboard_overlay:!1,strings:{en_us:{name:"Clipper",description:"Clip what just happened, from the controller."}}}]},n=(0,U.join)(Un(),"clipper.vrmanifest");return(0,$.writeFileSync)(n,JSON.stringify(e,null,4),"utf8"),n}function $n(){return(0,U.join)(Un(),"bridge.ps1")}var Qa=15e3,es=45e3,Ci=3,ts=3,ns=2e3,V=null,xt=!1,oe="",L="",Ae="",Ce=!1,zn=0,Di=0,Ke=null,bt=[],St=null,me=[],Qt=Promise.resolve();function Ri(t){let e=me.shift();if(e){e(t);return}if(t.kind==="motion"){St=t;return}bt.push(t.action),bt.length>8&&bt.shift()}function rs(t){let e=t.trim();if(!e.startsWith("{"))return!1;let n;try{n=JSON.parse(e)}catch{return!1}if(n.t==="ready")return oe=String(n.runtime??""),L="",Ae="",Ce=!1,!0;if(n.t==="waiting")return oe="",L="",Ae=String(n.reason??""),!0;if(n.t==="warning")return L=String(n.message??"The SteamVR bridge reported something wrong without saying what"),!0;if(n.t==="error")return L=String(n.message??"The SteamVR bridge failed for a reason it did not give"),Ce=!oe||++Di>=ts,!0;if(n.t==="action"){let r=wt.find(i=>i===n.name);return r&&Ri({kind:"action",action:r}),!1}return n.t==="motion"&&Ri({kind:"motion",hands:Number(n.hands)||0,head:Number(n.head)||0}),!1}function Gn(){Ke||!xt||Ce||(Ke=setTimeout(()=>{Ke=null,xt&&Oi()},Qa))}function Oi(){if(V)return Promise.resolve();let t=Pi();if(!t)return Gn(),Promise.resolve();let e;try{let n=$n();(0,Wn.writeFileSync)(n,Ti,"utf8");let r=(0,Tt.join)(process.env.SystemRoot??"C:\\Windows","System32","WindowsPowerShell","v1.0","powershell.exe");e=(0,Mi.spawn)(r,["-NoProfile","-NonInteractive","-ExecutionPolicy","Bypass","-File",n,"-Api",t,"-Actions",Ii(),"-Manifest",Ai(r),"-AppKey",Xt,"-ActionList",[fe,...wt].join("|")],{windowsHide:!0,stdio:["pipe","pipe","pipe"]})}catch(n){return L=`The SteamVR bridge could not be started (${n.message}).`,Gn(),Promise.resolve()}return V=e,oe="",Ae="",Ce=!1,new Promise(n=>{let r=!1,i=()=>{r||(r=!0,clearTimeout(o),n())},o=setTimeout(()=>{L="The SteamVR bridge did not come up. Compiling it may have failed; nothing else is affected.",i()},es),a="";e.stdout?.on("data",s=>{a+=s.toString("utf8");let l=a.split(`
`);a=l.pop()??"";for(let h of l)rs(h)&&i()}),e.stderr?.on("data",s=>{L||(L=s.toString("utf8").trim().slice(0,300))}),e.on("error",s=>{L=`The SteamVR bridge could not be started (${s.message}).`,i()}),e.on("exit",()=>{V===e&&(!oe&&!Ae&&!Ce?++zn>=Ci&&(Ce=!0,L||(L=`The SteamVR bridge stopped ${Ci} times without saying why. Switch the VR controls off and on again to try it once more.`)):zn=0,V=null,oe="",Ae="");let s=me;me=[];for(let l of s)l(null);i(),Gn()})})}function Li(){Ke&&(clearTimeout(Ke),Ke=null);let t=V;V=null,oe="",Ae="",Ce=!1,zn=0,Di=0,bt=[],St=null;let e=me;me=[];for(let r of e)r(null);if(!t)return;try{t.stdin?.end()}catch{}let n=setTimeout(()=>{try{t.kill()}catch{}},ns);t.on("exit",()=>clearTimeout(n))}function Vi(t){let e=Qt.then(async()=>(xt=t,t?(await Oi(),en()):(Li(),L="",en())));return Qt=e.catch(()=>{}),e}function Bn(){let t=Qt.then(()=>{xt=!1,Li()});return Qt=t.catch(()=>{}),t}function en(){return{running:V!==null&&oe!=="",wanted:xt,runtime:oe,problem:L,waiting:Ae}}function Fi(){if(!V?.stdin?.writable)return!1;try{return V.stdin.write(`bindings
`),!0}catch{return!1}}var is=0;function Ni(t,e,n,r){if(!V?.stdin?.writable||e<=0||n<=0||t.length!==e*n*4)return!1;let i=(0,Tt.join)((0,Tt.dirname)($n()),`panel-${is++%8}.rgba`);try{return(0,Wn.writeFileSync)(i,t),V.stdin.write(`panel ${e} ${n} ${Math.round(r)} ${i}
`),!0}catch{return!1}}function Ui(){if(!V?.stdin?.writable)return!1;try{return V.stdin.write(`panelhide
`),!0}catch{return!1}}function $i(t=3e4){let e=bt.shift();if(e)return Promise.resolve({kind:"action",action:e});if(St){let n=St;return St=null,Promise.resolve(n)}return new Promise(n=>{let r=!1,i=a=>{r||(r=!0,clearTimeout(o),n(a))},o=setTimeout(()=>{me=me.filter(a=>a!==i),i(null)},t);me.push(i)})}_i.app.on("will-quit",()=>{Bn()});var Wi=!0,Yn=!1,jn=500*1024*1024,Bi=/vesktop|equibop/i.test(y.app.getName());function x(t){let e=t?.trim(),n=e&&(0,p.isAbsolute)(e)?e:(0,p.join)(y.app.getPath("videos"),"DiscordClips"),r=n.toLowerCase().replace(/[\\/]+$/,"");for(let i of os()){let o=i.toLowerCase().replace(/[\\/]+$/,"");if(r===o||r.startsWith(`${o}\\`)||r.startsWith(`${o}/`))throw new Error("That folder is not a place for clips")}return n}function os(){let t=[];for(let e of["SystemRoot","windir","ProgramFiles","ProgramFiles(x86)","ProgramW6432"]){let n=process.env[e]?.trim();n&&t.push(n)}try{t.push(Xn())}catch{}return t}var as=/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;function F(t){let n=(0,p.basename)(String(t??"").replace(/[\\/]/g,"_")).trim().replace(/[<>:"|?*\x00-\x1f]/g,"_").replace(/^\.+/,""),r=/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.exec(n);return r?`${as.test(r[1])?`_${r[1]}`:r[1]}.${r[2].toLowerCase()}`:null}function ji(t){return F(t)??`clip-${Date.now()}.webm`}function At(t,e){let n=(0,p.extname)(e),r=e.slice(0,e.length-n.length),i=(0,p.join)(t,e),o=2;for(;(0,c.existsSync)(i)&&o<1e3;)i=(0,p.join)(t,`${r} (${o++})${n}`);if((0,c.existsSync)(i))throw new Error(`No free name left for ${e}; rename or clear the folder`);return i}var Ze=new Map;function ss(t,e){let n=`${t}.tmp-${process.pid}-${Date.now()}`;(0,c.writeFileSync)(n,Buffer.from(e));try{(0,c.renameSync)(n,t)}catch(r){try{(0,c.unlinkSync)(n)}catch{}throw r}}function ls(t,e,n,r,i=!1){if(r.length>jn)throw new Error("That clip is too large to write");let o=x(e);(0,c.mkdirSync)(o,{recursive:!0});let a=ji(n),s=(0,p.join)(o,a),l=(Ze.get(s)??Promise.resolve()).catch(()=>{}).then(async()=>{let h=i?At(o,a):(0,p.join)(o,a);return ss(h,r),h});return l.then(()=>{Ze.get(s)===l&&Ze.delete(s)},()=>{Ze.get(s)===l&&Ze.delete(s)}),Ze.set(s,l),l}var Et=new Set;function cs(t,e,n){let r=x(e);(0,c.mkdirSync)(r,{recursive:!0});let i=At(r,ji(n));if(!Et.has(i))return Et.add(i),i;let o=(0,p.extname)(i),a=i.slice(0,i.length-o.length),s=1,l=`${a}-${s}${o}`;for(;Et.has(l)||(0,c.existsSync)(l);)l=`${a}-${++s}${o}`;return Et.add(l),l}function us(t,e){Et.delete(e)}var Ct="voices";function ds(t,e){let n=F(t);return!n||!/^\d{1,25}$/.test(String(e??""))?null:`${n.slice(0,n.length-(0,p.extname)(n).length)}.${e}.webm`}function ps(t,e){let n=F(e);if(!n)return[];let r=(0,p.join)(x(t),Ct);if(!(0,c.existsSync)(r))return[];let i=`${n.slice(0,n.length-(0,p.extname)(n).length)}.`,o=[];for(let a of(0,c.readdirSync)(r,{withFileTypes:!0})){if(!a.isFile()||!a.name.startsWith(i)||!a.name.toLowerCase().endsWith(".webm"))continue;let s=a.name.slice(i.length,a.name.length-5);/^\d{1,25}$/.test(s)&&o.push({userId:s,file:a.name})}return o}function hs(t,e,n,r,i){let o=ds(n,r);if(!o)return null;let a=(0,p.join)(x(e),Ct);(0,c.mkdirSync)(a,{recursive:!0});let s=(0,p.join)(a,o);return(0,c.writeFileSync)(s,Buffer.from(i)),s}function fs(t,e,n){let r=(0,p.basename)(String(n??"").replace(/[\\/]/g,"_"));if(!r.toLowerCase().endsWith(".webm")||r.includes(".."))throw new Error("not a voice track");return new Uint8Array((0,c.readFileSync)((0,p.join)(x(e),Ct,r)))}function ms(t,e){let n=(0,p.join)(x(t),Ct);for(let{file:r}of ps(t,e))try{(0,c.unlinkSync)((0,p.join)(n,r))}catch{}}function gs(t,e){let n=x(e);if(!(0,c.existsSync)(n))return[];try{Zi(n)}catch{}let r=[],i=new Set,o=(0,c.readdirSync)(n,{withFileTypes:!0});for(let a of o)a.isFile()&&i.add(a.name);for(let a of o){if(!a.isFile()||!/\.(webm|mp4)$/i.test(a.name))continue;let s=(0,p.join)(n,a.name);try{let l=(0,c.statSync)(s),h=K(a.name);r.push({name:a.name,path:s,size:l.size,modified:l.mtimeMs,...i.has(h)?{thumb:h}:{}})}catch{}}return r.sort((a,s)=>s.modified-a.modified)}function vs(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");let i=(0,p.join)(x(e),r),o=(0,c.openSync)(i,"r");try{let{size:a}=(0,c.fstatSync)(o);if(a>jn)throw new Error("That clip is too large to open");let s=new Uint8Array((0,c.readFileSync)(o));if(s.length>jn)throw new Error("That clip is too large to open");return s}finally{(0,c.closeSync)(o)}}var Gi=200*1024*1024,ys="https://catbox.moe/user/api.php",ws=1024*1024;function bs(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");if(!/\.(webm|mp4)$/i.test(r))throw new Error("Only video clips can be shared as a link");let i=(0,p.join)(x(e),r),o=(0,c.openSync)(i,"r"),a;try{let{size:d}=(0,c.fstatSync)(o);if(d>Gi)throw new Error("That clip is over 200MB - shorten it in the studio first");if(a=(0,c.readFileSync)(o),a.length>Gi)throw new Error("That clip is over 200MB - shorten it in the studio first")}finally{(0,c.closeSync)(o)}let s=`clipper-${Date.now().toString(16)}-${Math.floor(Math.random()*4294967295).toString(16)}`,l=r.toLowerCase().endsWith(".mp4")?"video/mp4":"video/webm",h=Buffer.from(`--${s}\r
Content-Disposition: form-data; name="reqtype"\r
\r
fileupload\r
--${s}\r
Content-Disposition: form-data; name="fileToUpload"; filename="${r}"\r
Content-Type: ${l}\r
\r
`,"utf8"),f=Buffer.from(`\r
--${s}--\r
`,"utf8");return new Promise((d,v)=>{let S=(0,nn.request)(ys,{method:"POST",headers:{"User-Agent":Ji,"Content-Type":`multipart/form-data; boundary=${s}`,"Content-Length":h.length+a.length+f.length}},E=>{let D=[],C=0;E.on("data",k=>{if(C+=k.length,C>ws){E.destroy(new Error("The host answered with more than a link"));return}D.push(k)}),E.on("end",()=>{let k=Buffer.concat(D).toString("utf8").trim();(E.statusCode??0)!==200?v(new Error(`The host answered ${E.statusCode??"?"} - try again later`)):/^https:\/\//.test(k)?d(k):v(new Error("The host did not return a link - try again later"))}),E.on("error",v)});S.setTimeout(3e5,()=>S.destroy(new Error("The upload timed out - try again on a faster connection"))),S.on("error",v),S.write(h),S.write(a),S.end(f)})}var Ss=".trash",Hi=".trash.json",xs=168*3600*1e3;function Rt(t){return(0,p.join)(t,Ss)}function Mt(t){let e;try{e=JSON.parse((0,c.readFileSync)((0,p.join)(t,Hi),"utf8"))}catch{return{}}if(!e||typeof e!="object")return{};let n={};for(let[r,i]of Object.entries(e))/^([\w.\-+ ()[\]]{1,120})\.(webm|mp4|png|jpg|gif)$/i.test(r)&&(!i||typeof i!="object"||i.stored!==r||(n[r]=i));return n}function Pt(t,e){(0,c.mkdirSync)(t,{recursive:!0}),(0,c.writeFileSync)((0,p.join)(t,Hi),JSON.stringify(e))}function Ki(t,e){if(!e)return;let n=(0,p.join)(t,Ct),r;try{r=(0,c.readdirSync)(n)}catch{return}for(let i of r)if(i.startsWith(`${e}.`)&&i.toLowerCase().endsWith(".webm"))try{(0,c.unlinkSync)((0,p.join)(n,i))}catch{}}function Zi(t){let e=Rt(t);if(!(0,c.existsSync)(e))return;let n=Mt(e),r=Date.now(),i=!1;for(let[o,a]of Object.entries(n))if(!(!a||r-(a.deletedAt??0)<xs)){for(let s of[o,K(o)])try{(0,c.unlinkSync)((0,p.join)(e,s))}catch{}Ki(t,(a.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,"")),delete n[o],i=!0}i&&Pt(e,n)}function Ts(t,e,n,r){let i=F(n);if(!i)throw new Error("That is not a clip name");if(r!==null&&(typeof r!="string"||r.length>1024*1024))throw new Error("That metadata is not metadata");let o=x(e),a=(0,p.join)(o,i);if(!(0,c.existsSync)(a))throw new Error("That clip is already gone");let s=Rt(o);(0,c.mkdirSync)(s,{recursive:!0});let l=At(s,i).split(/[\\/]/).pop()||i;(0,c.renameSync)(a,(0,p.join)(s,l));let h=K(i);if((0,c.existsSync)((0,p.join)(o,h)))try{(0,c.renameSync)((0,p.join)(o,h),(0,p.join)(s,K(l)))}catch{}let f=Mt(s);f[l]={stored:l,name:i,deletedAt:Date.now(),meta:r},Pt(s,f)}function Es(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");let i=x(e),o=Rt(i),a=Mt(o),s=a[r];if(!s||!(0,c.existsSync)((0,p.join)(o,r)))throw delete a[r],Pt(o,a),new Error("That clip is no longer in the trash");let l=At(i,s.name).split(/[\\/]/).pop()||s.name;(0,c.renameSync)((0,p.join)(o,r),(0,p.join)(i,l));let h=K(r);if((0,c.existsSync)((0,p.join)(o,h)))try{(0,c.renameSync)((0,p.join)(o,h),(0,p.join)(i,K(l)))}catch{}return delete a[r],Pt(o,a),{name:l,meta:s.meta??null}}function ks(t,e){let n=x(e);Zi(n);let r=Rt(n),i=Mt(r),o=[];for(let[a,s]of Object.entries(i)){if(!s)continue;let l=0;try{l=(0,c.statSync)((0,p.join)(r,a)).size}catch{delete i[a];continue}let h="";try{let f=s.meta?JSON.parse(s.meta):null;f&&typeof f.game=="string"&&(h=f.game)}catch{}o.push({stored:a,name:s.name??a,size:l,deletedAt:s.deletedAt??0,game:h})}return o.sort((a,s)=>a.deletedAt-s.deletedAt)}function Ps(t,e){let n=x(e),r=Rt(n);if((0,c.existsSync)(r)){for(let[i,o]of Object.entries(Mt(r))){for(let a of[i,K(i)])try{(0,c.unlinkSync)((0,p.join)(r,a))}catch{}o&&Ki(n,(o.name??"").replace(/\.(webm|mp4|png|jpg|gif)$/i,""))}Pt(r,{})}}async function Is(t,e,n){let r=x(e),i=F(n);if(!i)throw new Error("That is not a clip name");let o=(0,p.join)(r,i);try{await y.shell.trashItem(o)}catch{(0,c.unlinkSync)(o)}ms(e,i);let a=(0,p.join)(r,K(i));if((0,c.existsSync)(a))try{await y.shell.trashItem(a)}catch{try{(0,c.unlinkSync)(a)}catch{}}}function As(t,e,n,r){let i=x(e),o=F(n);if(!o)throw new Error("That is not a clip name");let a=(0,p.join)(i,o),s=(0,p.extname)(o),l=F(r.toLowerCase().endsWith(s)?r:r+s);if(!l)throw new Error("That name cannot be used. Keep it under 120 characters, with letters, digits, spaces or - _ . + ( ) [ ]");if(l===o)return o;let f=l.toLowerCase()===o.toLowerCase()?(0,p.join)(i,l):At(i,l);(0,c.renameSync)(a,f);let d=(0,p.join)(i,K(o));if((0,c.existsSync)(d))try{(0,c.renameSync)(d,(0,p.join)(i,K((0,p.basename)(f))))}catch{}return(0,p.basename)(f)}var qi="clipper-library.json";function Cs(t,e){let n=(0,p.join)(x(e),qi);if(!(0,c.existsSync)(n))return"";try{return(0,c.readFileSync)(n,"utf8")}catch{return""}}function Rs(t,e,n){let r=x(e);(0,c.mkdirSync)(r,{recursive:!0});let i=(0,p.join)(r,qi),o=`${i}.tmp`;(0,c.writeFileSync)(o,String(n??""),"utf8"),(0,c.renameSync)(o,i)}async function Ms(t){let e=await y.dialog.showOpenDialog({title:"Add videos to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Video",extensions:["mp4","webm","mkv","mov","m4v"]}]});return e.canceled?[]:e.filePaths}var _s=512*1024*1024;function Ds(t,e){if(!(0,p.isAbsolute)(e)||!/\.(mp4|webm|mkv|mov|m4v)$/i.test(e))throw new Error("Not a video file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>_s){let i=Math.round(r/1048576);throw new Error(`That video is ${i} MB; imports are capped at 512 MB. Trim it or lower its bitrate first.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function Os(t){let e=await y.dialog.showOpenDialog({title:"Add sounds to the timeline",properties:["openFile","multiSelections"],filters:[{name:"Audio",extensions:["mp3","wav","ogg","opus","m4a","aac","flac","webm"]}]});return e.canceled?[]:e.filePaths}var Ls=64*1024*1024;function Vs(t,e){if(!(0,p.isAbsolute)(e)||!/\.(mp3|wav|ogg|opus|m4a|aac|flac|webm)$/i.test(e))throw new Error("Not an audio file");let n=(0,c.openSync)(e,"r");try{let{size:r}=(0,c.fstatSync)(n);if(r>Ls){let i=Math.round(r/1048576);throw new Error(`That sound is ${i} MB; the timeline caps them at 64 MB.`)}return new Uint8Array((0,c.readFileSync)(n))}finally{(0,c.closeSync)(n)}}async function Fs(t){let e=await y.dialog.showOpenDialog({title:"Add pictures and clips to the montage",properties:["openFile","multiSelections"],filters:[{name:"Pictures and clips",extensions:["png","jpg","jpeg","webp","gif","avif","bmp","mp4","webm"]},{name:"Pictures",extensions:["png","jpg","jpeg","webp","gif","avif","bmp"]},{name:"Clips",extensions:["mp4","webm"]}]});return e.canceled?[]:e.filePaths}var Ns=24*1024*1024,Us=64*1024*1024;function $s(t,e){if(!(0,p.isAbsolute)(e)||!/\.(png|jpe?g|webp|gif|avif|bmp|mp4|webm)$/i.test(e))throw new Error("Not a picture or a clip");let n=/\.(mp4|webm)$/i.test(e),r=n?Us:Ns,i=(0,c.openSync)(e,"r");try{let{size:o}=(0,c.fstatSync)(i);if(o>r){let a=Math.round(o/1048576),s=Math.round(r/(1024*1024));throw new Error(`That ${n?"clip":"picture"} is ${a} MB; the montage caps them at ${s} MB.`)}return new Uint8Array((0,c.readFileSync)(i))}finally{(0,c.closeSync)(i)}}function Gs(t,e,n){let r=F(n);if(!r)throw new Error("That is not a clip name");y.shell.showItemInFolder((0,p.join)(x(e),r))}function zs(t,e){return x(e)}async function Ws(t,e){let n=await y.dialog.showOpenDialog({title:"Where should clips be saved?",defaultPath:x(e),properties:["openDirectory","createDirectory"]});return n.canceled?"":n.filePaths[0]??""}function Bs(t,e){let n=x(e);(0,c.mkdirSync)(n,{recursive:!0}),y.shell.openPath(n)}function js(t){return{platform:"win32",wayland:Yn,vesktop:Bi,overlay:Jt()}}var ge=new Set;async function Hs(t,e=!0){if(Yn)return[];let n=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:e?{width:320,height:180}:{width:0,height:0},fetchWindowIcons:!1});if(ge.size){let i=new Set(n.map(o=>o.id));for(let o of ge)i.has(o)||ge.delete(o)}let r=[];for(let i of n){let o=i.id.startsWith("screen:");if(!e){if(!o&&ge.has(i.id))continue;r.push({id:i.id,name:i.name,thumbnail:""});continue}let a=i.thumbnail.isEmpty();if(Wi&&!o&&a){ge.add(i.id);continue}ge.delete(i.id),r.push({id:i.id,name:i.name,thumbnail:a?"":i.thumbnail.toDataURL(),capturable:!0})}return r}async function Ks(t){try{return y.app.getAppMetrics().map(e=>({type:e.serviceName||e.type,mb:Math.round((e.memory?.workingSetSize??0)/1024)})).filter(e=>e.mb>0).sort((e,n)=>n.mb-e.mb)}catch{return[]}}async function Zs(t){if(Yn)return"";let e=await y.desktopCapturer.getSources({types:["screen"],thumbnailSize:{width:0,height:0}});if(!e.length)return"";try{let n=y.screen.getDisplayNearestPoint(y.screen.getCursorScreenPoint()),r=e.find(i=>i.display_id===String(n.id));if(r)return r.id}catch{}return e[0].id}var Hn="",Kn=!1;function qs(t,e,n=!0){return!n||Bi?!1:(Hn=e??"",Kn=!0,y.session.defaultSession.setDisplayMediaRequestHandler(async(r,i)=>{let o=await y.desktopCapturer.getSources({types:["screen","window"],thumbnailSize:{width:0,height:0}}),a=o.find(h=>h.id===Hn),l=(a&&!ge.has(a.id)?a:void 0)??o.find(h=>h.id.startsWith("screen:"))??o.find(h=>!ge.has(h.id));if(!l){i({});return}i(Wi&&l.id.startsWith("screen:")?{video:l,audio:"loopback"}:{video:l})},{useSystemPicker:!1}),!0)}function Ys(t){Hn="",Kn&&(Kn=!1,y.session.defaultSession.setDisplayMediaRequestHandler(null))}var Zn=new Map,qe=[],kt=[];function Js(t){let e=qe.shift();if(e){e(t);return}kt.push(t),kt.length>8&&kt.shift()}function Xs(t,e){Jn();let n=[];for(let[r,i]of Object.entries(e)){if(!i)continue;let o=!1;try{o=y.globalShortcut.register(i,()=>Js(r))}catch{o=!1}o?Zn.set(r,i):n.push(i)}return n}function Jn(t){for(let n of Zn.values())try{y.globalShortcut.unregister(n)}catch{}Zn.clear(),kt=[];let e=qe;qe=[];for(let n of e)n(null)}function Qs(t,e=3e4){let n=kt.shift();return n?Promise.resolve(n):new Promise(r=>{let i=!1,o=s=>{i||(i=!0,clearTimeout(a),r(s))},a=setTimeout(()=>{qe=qe.filter(s=>s!==o),o(null)},e);qe.push(o)})}y.app.on("will-quit",()=>Jn());function el(t,e){return li(e)}function tl(t){return Ln()}function nl(t){return Kt()}function rl(t,e=3e4){return ui(e)}function il(t,e){return Vi(e)}function ol(t){return Bn()}function al(t){return en()}function sl(t){return Fi()}function ll(t,e,n,r,i){return Ni(new Uint8Array(e),n,r,i)}function cl(t){return Ui()}function ul(t,e=3e4){return $i(e)}y.app.on("will-quit",()=>{Ln()});var dl=["top-left","top-right","bottom-left","bottom-right"];function Ye(t,e,n,r){let i=Number(t);return Number.isFinite(i)?Math.min(n,Math.max(e,Math.round(i))):r}function Yi(t){return dl.includes(t)?t:"bottom-right"}function pl(t){return{corner:Yi(t?.corner),width:Ye(t?.width,200,1280,420),volume:Ye(t?.volume,0,100,0),seconds:Ye(t?.seconds,0,300,10)}}function qn(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function hl(t,e,n,r){let i=F(n);if(!i)return!1;let o=(0,p.join)(x(e),i);return(0,c.existsSync)(o)?mi(o,pl(r)):!1}function fl(t,e,n,r){return y.BrowserWindow.getFocusedWindow()||Nn()?!1:gi(qn(e,60),qn(n,90),Yi(r))}function ml(t){Ie()}var gl=200;function vl(t){return Array.isArray(t)?t.map(Number).filter(e=>Number.isFinite(e)&&e>=0).slice(0,gl):[]}function yl(t){return{width:Ye(t?.width,360,1600,720),volume:Ye(t?.volume,0,100,0)}}function wl(t,e,n,r,i){let o=F(n);if(!o)return!1;let a=(0,p.join)(x(e),o);return(0,c.existsSync)(a)?xi({name:o,path:a,markers:vl(r)},yl(i)):!1}function bl(t){yt()}function Sl(t){return Nn()}function xl(t,e=3e4){return wi(Ye(e,1e3,12e4,3e4))}function Tl(t){bi()}function El(t,e,n,r){Si({ok:!!e,message:qn(n,120),close:!!r})}function kl(t){let e=y.BrowserWindow.fromWebContents(t.sender);!e||e.isDestroyed()||(e.isMinimized()&&e.restore(),e.show(),e.focus())}var It="kebab1337420/Clibab",Ji=`VencordClipper (+https://github.com/${It})`,tn=256*1024*1024;function rn(t,e=0){return new Promise((n,r)=>{let i=(0,nn.get)(t,{headers:{"User-Agent":Ji,Accept:"*/*"}},o=>{let a=o.statusCode??0,{location:s}=o.headers;if(a>=300&&a<400&&s){o.resume(),e>=5?r(new Error(`Too many redirects for ${t}`)):n(rn(new URL(s,t).toString(),e+1));return}let l=[],h=0,{"content-length":f}=o.headers;if(f&&Number(f)>tn){o.destroy(new Error(`${t} answered ${f} bytes, over the ${tn} byte cap`));return}o.on("data",d=>{if(h+=d.length,h>tn){o.destroy(new Error(`${t} exceeded the ${tn} byte cap`));return}l.push(d)}),o.on("end",()=>n({status:a,body:Buffer.concat(l)})),o.on("error",r)});i.setTimeout(6e4,()=>i.destroy(new Error(`${t} timed out`))),i.on("error",r)})}async function Pl(t){let{status:e,body:n}=await rn(t);if(e!==200)throw new Error(`${t} answered ${e}`);return n}function Xn(){return __dirname}function Xi(t){return(0,c.existsSync)((0,p.join)(t,"patcher.js"))&&(0,c.existsSync)((0,p.join)(t,"renderer.js"))}function Qi(t){try{return(0,c.accessSync)(t,c.constants.W_OK),!0}catch{return!1}}function eo(t,e){let n=o=>o.replace(/^v/i,"").split(/[.\-+]/).map(a=>Number(a)||0),r=n(t),i=n(e);for(let o=0;o<3;o++)if((r[o]??0)!==(i[o]??0))return(r[o]??0)>(i[o]??0);return!1}async function Il(t,e){let n=await Pl(`https://api.github.com/repos/${It}/releases/latest`),r=JSON.parse(n.toString("utf8")),i=String(r.tag_name??""),o=i.replace(/^v/i,""),a=Xn();return{version:o,tag:i,available:!!o&&eo(o,e),notes:String(r.body??"").trim().slice(0,1200),url:String(r.html_url??`https://github.com/${It}/releases`),directory:a,writable:Xi(a)&&Qi(a)}}async function Al(t){let{status:e,body:n}=await rn(`https://raw.githubusercontent.com/${It}/${t}/prebuilt/build-info.json`);if(e===404)return null;if(e!==200)throw new Error(`The release's file list answered ${e}, so there is nothing to check the bundle against`);let r;try{({files:r}=JSON.parse(n.toString("utf8")))}catch{throw new Error("The release's file list could not be read, so there is nothing to check the bundle against")}if(!r||typeof r!="object")throw new Error("The release's file list names no files");return r}async function Cl(t,e,n){if(!/^[\w.-]{1,40}$/.test(e))throw new Error(`Refusing to fetch a release named ${e}`);if(!eo(e.replace(/^v/i,""),String(n??"")))throw new Error(`Refusing to install ${e}: it is not newer than the installed bundle`);let r=Xn();if(!Xi(r))throw new Error(`No installed bundle at ${r}`);if(!Qi(r))throw new Error(`${r} is read-only`);let i=await Al(e);if(!i)throw new Error(`The release under ${e} carries no file list; refusing to install it unchecked`);let o=Object.keys(i),a=(0,p.join)(r,".clipper-update");(0,c.rmSync)(a,{recursive:!0,force:!0}),(0,c.mkdirSync)(a,{recursive:!0});try{let s=[];for(let d of o){if(d!==(0,p.basename)(d)||d.startsWith("."))throw new Error(`Refusing a release file named ${d}`);let{status:v,body:S}=await rn(`https://raw.githubusercontent.com/${It}/${e}/prebuilt/dist/${d}`);if(v!==200)throw new Error(`${d} answered ${v}`);if(S.length===0)throw new Error(`${d} came back empty`);let E=i[d];if(E?.size===void 0||!E?.sha256)throw new Error(`${d} has no size and hash in the release's file list`);if(S.length!==E.size)throw new Error(`${d} is ${S.length} bytes, the release says ${E.size}`);if((0,zi.createHash)("sha256").update(S).digest("hex").toLowerCase()!==E.sha256.toLowerCase())throw new Error(`${d} does not match its hash`);(0,c.writeFileSync)((0,p.join)(a,d),S),s.push(d)}if(s.length===0)throw new Error(`There is no bundle published under ${e}`);for(let d of["renderer.js","patcher.js"])if(!s.includes(d))throw new Error(`The release carries no ${d}`);if(!(0,c.readFileSync)((0,p.join)(a,"renderer.js")).includes("Clipper"))throw new Error("There is no Clipper in that release's renderer");let l=(0,p.join)(a,".previous");(0,c.mkdirSync)(l,{recursive:!0});let h=[],f=[];try{for(let d of s){let v=(0,p.join)(r,d);(0,c.existsSync)(v)&&((0,c.renameSync)(v,(0,p.join)(l,d)),h.push(d)),(0,c.renameSync)((0,p.join)(a,d),v),f.push(d)}}catch(d){for(let v of f)try{(0,c.unlinkSync)((0,p.join)(r,v))}catch{}for(let v of h)try{(0,c.renameSync)((0,p.join)(l,v),(0,p.join)(r,v))}catch{}throw new Error(`The update could not be put in place (${d.message}). The bundle that was there has been put back.`)}return s}finally{(0,c.rmSync)(a,{recursive:!0,force:!0})}}function Rl(t){y.app.relaunch(),y.app.quit(),setTimeout(()=>y.app.exit(0),3e3)}var to={AppleMusicRichPresence:xn,ConsoleShortcuts:Tn,FixSpotifyEmbeds:Hr,FixYoutubeEmbeds:Zr,OpenInApp:Cn,Translate:Rn,VoiceMessages:Mn,XSOverlay:_n,YoutubeAdblock:ei,Clipper:Qn};var no={};for(let[t,e]of Object.entries(to)){let n=Object.entries(e);if(!n.length)continue;let r=no[t]={};for(let[i,o]of n){let a=`VencordPluginNative_${t}_${i}`;er.ipcMain.handle(a,o),r[i]=a}}er.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=no});ie();u();function tr(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}Ve();var b=require("electron");u();var ro="PCFkb2N0eXBlIGh0bWw+PGh0bWwgbGFuZz0iZW4iPjxoZWFkPjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij48dGl0bGU+VmVuY29yZCBRdWlja0NTUyBFZGl0b3I8L3RpdGxlPjxsaW5rIHJlbD0ic3R5bGVzaGVldCIgaHJlZj0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvZWRpdG9yL2VkaXRvci5tYWluLmNzcyIgaW50ZWdyaXR5PSJzaGEyNTYtdGlKUFEyTzA0ei9wWi9Bd2R5SWdock9NemV3ZitQSXZFbDFZS2JRdnNaaz0iIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIHJlZmVycmVycG9saWN5PSJuby1yZWZlcnJlciI+PHN0eWxlPiNjb250YWluZXIsYm9keSxodG1se3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21hcmdpbjowO3BhZGRpbmc6MDtvdmVyZmxvdzpoaWRkZW59PC9zdHlsZT48L2hlYWQ+PGJvZHk+PGRpdiBpZD0iY29udGFpbmVyIj48L2Rpdj48c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMvbG9hZGVyLmpzIiBpbnRlZ3JpdHk9InNoYTI1Ni1LY1U0OFRHcjg0cjd1bkY3SjVJZ0JvOTVhZVZyRWJyR2UwNFM3VGNGVWpzPSIgY3Jvc3NvcmlnaW49ImFub255bW91cyIgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIj48L3NjcmlwdD48c2NyaXB0PnJlcXVpcmUuY29uZmlnKHtwYXRoczp7dnM6Imh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vbW9uYWNvLWVkaXRvckAwLjUwLjAvbWluL3ZzIn19KSxyZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sKCgpPT57Z2V0Q3VycmVudENzcygpLnRoZW4oKGU9Pnt2YXIgdD1tb25hY28uZWRpdG9yLmNyZWF0ZShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29udGFpbmVyIikse3ZhbHVlOmUsbGFuZ3VhZ2U6ImNzcyIsdGhlbWU6Z2V0VGhlbWUoKX0pO3Qub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCgpPT5zZXRDc3ModC5nZXRWYWx1ZSgpKSkpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCJyZXNpemUiLCgoKT0+e3QubGF5b3V0KCl9KSl9KSl9KSk8L3NjcmlwdD48L2JvZHk+PC9odG1sPg==";var ae=require("fs"),ye=require("fs/promises"),fo=require("os"),on=require("path");u();ie();Ve();var Je=require("electron");u();ie();var nr=require("electron"),Z=["connect-src"],G=[...Z,"img-src"],ao=["style-src","font-src"],io=[...G,"media-src"],P=[...G,...ao],oo=[...P,"script-src","worker-src"],ir={"http://localhost:*":P,"http://127.0.0.1:*":P,"localhost:*":P,"127.0.0.1:*":P,"*.github.io":P,"github.com":P,"raw.githubusercontent.com":P,"*.gitlab.io":P,"gitlab.com":P,"*.codeberg.page":P,"codeberg.org":P,"*.githack.com":P,"jsdelivr.net":P,"fonts.googleapis.com":ao,"i.imgur.com":G,"i.ibb.co":G,"i.pinimg.com":G,"files.catbox.moe":P,"cdn.discordapp.com":P,"media.discordapp.net":G,"cdnjs.cloudflare.com":oo,"cdn.jsdelivr.net":oo,"api.github.com":Z,"ws.audioscrobbler.com":Z,"musicbrainz.org":Z,"*.listenbrainz.org":Z,"coverartarchive.org":Z,"archive.org":Z,"*.archive.org":Z,"translate-pa.googleapis.com":Z,"*.vencord.dev":G,"manti.vendicated.dev":G,"decor.fieryflames.dev":Z,"ugc.decor.fieryflames.dev":G,"sponsor.ajay.app":Z,"dearrow-thumb.ajay.app":G,"usrbg.is-hardly.online":G,"icons.duckduckgo.com":G,"*.tenor.com":io,"*.tenor.co":io},rr=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),Ml=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},_l=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),Dl=t=>{let e=rr(t,"content-security-policy-report-only");e&&delete t[e];let n=rr(t,"content-security-policy");if(n){let r=Ml(t[n][0]),i=(o,...a)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...a)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:","vesktop:");for(let[o,a]of Object.entries(J.store.customCspRules))for(let s of a)i(s,o);for(let[o,a]of Object.entries(ir))for(let s of a)i(s,o);t[n]=[_l(r)]}};function so(){nr.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&Dl(t),e==="stylesheet")){let r=rr(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),nr.session.defaultSession.webRequest.onHeadersReceived=()=>{}}function lo(){Je.ipcMain.handle("VencordCspRemoveOverride",Fl),Je.ipcMain.handle("VencordCspRequestAddOverride",Vl),Je.ipcMain.handle("VencordCspIsDomainAllowed",Nl)}function Ol(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!P.includes(n)))}function Ll(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Discord for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let a=e.filter(s=>s!=="connect-src").map(s=>{switch(s){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${s}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${a}

${o}`,{message:i,detail:o}}async function Vl(t,e,n,r){if(!Ol(e,n))return"invalid";let i=new URL(e).host;if(i in J.store.customCspRules)return"conflict";let{checkboxChecked:o,response:a}=await Je.dialog.showMessageBox({...Ll(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return a!==1?"cancelled":o?(J.store.customCspRules[i]=n,"ok"):"unchecked"}function Fl(t,e){return e in J.store.customCspRules?(delete J.store.customCspRules[e],!0):!1}function Nl(t,e,n){try{let r=new URL(e).host,i=ir[r]??J.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}u();var Ul=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,$l=/^\\@/;function or(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function co(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function uo(t,e){if(!t)return or(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return or(e);let r={},i="",o="";for(let a of n.split(Ul))if(a.length!==0)if(a.charAt(0)==="@"&&a.charAt(1)!==" "){r[i]=o.trim();let s=a.indexOf(" ");i=a.substring(1,s),o=a.substring(s+1)}else o+=" "+a.replace("\\n",`
`).replace($l,"@");return r[i]=o.trim(),delete r[""],or(e,r)}Ue();u();var Xe=require("path");function ve(t,e){let n=(0,Xe.normalize)(t+"/"),r=(0,Xe.join)(t,e),i=(0,Xe.normalize)(r);return i===(0,Xe.normalize)(t)||i.startsWith(n)?i:null}u();var po=require("electron");function ho(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":po.shell.openExternal(e)}return{action:"deny"}})}var Gl=(0,on.join)(__dirname,"renderer.css");(0,ae.mkdirSync)(de,{recursive:!0});lo();function mo(){return(0,ye.readFile)(Ne,"utf-8").catch(()=>"")}async function zl(){let t=await(0,ye.readdir)(de).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await go(n).then(co).catch(()=>null);r!=null&&e.push(uo(r,n))}return e}function go(t){t=t.replace(/\?v=\d+$/,"");let e=ve(de,t);return e?(0,ye.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}b.ipcMain.handle("VencordOpenQuickCss",()=>b.shell.openPath(Ne));b.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!zr.includes(n))throw"Disallowed protocol.";b.shell.openExternal(e).catch(r=>console.error("[Vencord] Failed to open external link",e,r))});b.ipcMain.handle("VencordGetQuickCss",()=>mo());b.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,ae.writeFileSync)(Ne,e));b.ipcMain.handle("VencordGetThemesList",()=>zl());b.ipcMain.handle("VencordGetThemeData",(t,e)=>go(e));b.ipcMain.handle("VencordGetThemeSystemValues",()=>{let t=b.systemPreferences.getAccentColor?.()??"";return t.length&&t[0]!=="#"&&(t=`#${t}`),{"os-accent-color":t}});b.ipcMain.handle("VencordOpenThemesFolder",()=>b.shell.openPath(de));b.ipcMain.handle("VencordOpenSettingsFolder",()=>b.shell.openPath(xe));var ar=[];b.ipcMain.handle("VencordInitFileWatchers",({sender:t})=>{ar.forEach(i=>i.close());let e,n;(0,ye.open)(Ne,"a+").then(i=>{i.close(),e=(0,ae.watch)(Ne,{persistent:!1},tr(async()=>{t.postMessage("VencordQuickCssUpdate",await mo())},50))}).catch(()=>{});let r=(0,ae.watch)(de,{persistent:!1},tr(()=>{t.postMessage("VencordThemeUpdate",void 0)}));ar=[e,r,n].filter(Boolean),t.once("destroyed",()=>{e?.close(),r.close(),n?.close(),ar=[]})});b.ipcMain.on("VencordGetMonacoTheme",t=>{t.returnValue=b.nativeTheme.shouldUseDarkColors?"vs-dark":"vs-light"});b.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=b.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new b.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,backgroundColor:b.nativeTheme.shouldUseDarkColors?"#1e1e1e":"white",webPreferences:{preload:(0,on.join)(__dirname,"preload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});ho(n),await n.loadURL(`data:text/html;base64,${ro}`)});b.ipcMain.handle("VencordGetRendererCss",()=>(0,ye.readFile)(Gl,"utf-8"));b.ipcMain.on("VencordPreloadGetRendererJs",t=>{t.returnValue=(0,ae.readFileSync)((0,on.join)(__dirname,"renderer.js"),"utf-8")});b.ipcMain.on("VencordSupportsWindowsMaterial",t=>{t.returnValue=Number((0,fo.release)().split(".")[2])>=22621});var Me=require("electron"),Bo=require("path"),vr=require("url");ie();Ue();u();var pn=require("electron");u();var wo=require("module"),Wl=(0,wo.createRequire)("/"),Qe,sn,lr,Bl=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{Qe=Wl("worker_threads"),sn=Qe.Worker,lr=Qe.isMarkedAsUntransferable}catch{}var jl=sn?function(t,e,n,r,i){var o=!1,a=new sn(t+Bl,{eval:!0}).on("error",function(s){return i(s,null)}).on("message",function(s){return i(null,s)}).on("exit",function(s){s&&!o&&i(new Error("exited with code "+s),null)});return lr&&(r=r.filter(function(s){return!lr(s)})),a.postMessage(n,r),a.terminate=function(){return o=!0,sn.prototype.terminate.call(a)},a}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},_=Uint8Array,Re=Uint16Array,bo=Int32Array,ur=new _([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),dr=new _([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),So=new _([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),xo=function(t,e){for(var n=new Re(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new bo(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},Qe=xo(ur,2),pr=Qe.b,Hl=Qe.r;pr[28]=258,Hl[258]=28;var To=xo(dr,0),Eo=To.b,vd=To.r,un=new Re(32768);for(w=0;w<32768;++w)se=(w&43690)>>1|(w&21845)<<1,se=(se&52428)>>2|(se&13107)<<2,se=(se&61680)>>4|(se&3855)<<4,un[w]=((se&65280)>>8|(se&255)<<8)>>1;var se,w,et=(function(t,e,n){for(var r=t.length,i=0,o=new Re(e);i<r;++i)t[i]&&++o[t[i]-1];var a=new Re(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;var s;if(n){s=new Re(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var h=i<<4|t[i],f=e-t[i],d=a[t[i]-1]++<<f,v=d|(1<<f)-1;d<=v;++d)s[un[d]>>l]=h}else for(s=new Re(r),i=0;i<r;++i)t[i]&&(s[i]=un[a[t[i]-1]++]>>15-t[i]);return s}),_t=new _(288);for(w=0;w<144;++w)_t[w]=8;var w;for(w=144;w<256;++w)_t[w]=9;var w;for(w=256;w<280;++w)_t[w]=7;var w;for(w=280;w<288;++w)_t[w]=8;var w,ko=new _(32);for(w=0;w<32;++w)ko[w]=5;var w;var Po=et(_t,9,1);var Io=et(ko,5,1),ln=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},z=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},cn=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},Ao=function(t){return(t+7)/8|0},dn=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new _(t.subarray(e,n))};var Co=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],A=function(t,e,n){var r=new Error(e||Co[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,A),!n)throw r;return r},Ro=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new _(0);var a=!n,s=a||e.i!=2,l=e.i;a&&(n=new _(i*3));var h=function(Tr){var Er=n.length;if(Tr>Er){var kr=new _(Math.max(Er*2,Tr));kr.set(n),n=kr}},f=e.f||0,d=e.p||0,v=e.b||0,S=e.l,E=e.d,D=e.m,C=e.n,k=i*8;do{if(!S){f=z(t,d,1);var le=z(t,d+1,3);if(d+=3,le)if(le==1)S=Po,E=Io,D=9,C=5;else if(le==2){var tt=z(t,d,31)+257,Dt=z(t,d+10,15)+4,be=tt+z(t,d+5,31)+1;d+=14;for(var N=new _(be),De=new _(19),I=0;I<Dt;++I)De[So[I]]=z(t,d+I*3,7);d+=Dt*3;for(var nt=ln(De),jo=(1<<nt)-1,Ho=et(De,nt,1),I=0;I<be;){var yr=Ho[z(t,d,jo)];d+=yr&15;var R=yr>>4;if(R<16)N[I++]=R;else{var Oe=0,Ot=0;for(R==16?(Ot=3+z(t,d,3),d+=2,Oe=N[I-1]):R==17?(Ot=3+z(t,d,7),d+=3):R==18&&(Ot=11+z(t,d,127),d+=7);Ot--;)N[I++]=Oe}}var wr=N.subarray(0,tt),ce=N.subarray(tt);D=ln(wr),C=ln(ce),S=et(wr,D,1),E=et(ce,C,1)}else A(1);else{var R=Ao(d)+4,re=t[R-4]|t[R-3]<<8,_e=R+re;if(_e>i){l&&A(0);break}s&&h(v+re),n.set(t.subarray(R,_e),v),e.b=v+=re,e.p=d=_e*8,e.f=f;continue}if(d>k){l&&A(0);break}}s&&h(v+131072);for(var Ko=(1<<D)-1,Zo=(1<<C)-1,hn=d;;hn=d){var Oe=S[cn(t,d)&Ko],Le=Oe>>4;if(d+=Oe&15,d>k){l&&A(0);break}if(Oe||A(2),Le<256)n[v++]=Le;else if(Le==256){hn=d,S=null;break}else{var br=Le-254;if(Le>264){var I=Le-257,rt=ur[I];br=z(t,d,(1<<rt)-1)+pr[I],d+=rt}var fn=E[cn(t,d)&Zo],mn=fn>>4;fn||A(3),d+=fn&15;var ce=Eo[mn];if(mn>3){var rt=dr[mn];ce+=cn(t,d)&(1<<rt)-1,d+=rt}if(d>k){l&&A(0);break}s&&h(v+131072);var Sr=v+br;if(v<ce){var xr=o-ce,qo=Math.min(ce,Sr);for(xr+v<0&&A(3);v<qo;++v)n[v]=r[xr+v]}for(;v<Sr;++v)n[v]=n[v-ce]}}e.l=S,e.p=hn,e.b=v,e.f=f,S&&(f=1,e.m=D,e.d=E,e.n=C)}while(!f);return v!=n.length&&a?dn(n,0,v):n.subarray(0,v)};var Kl=new _(0);var Zl=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},vo=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),a=0;a<r.length;++a){var s=r[a],l=o[a];if(typeof s=="function"){e+=";"+l+"=";var h=s.toString();if(s.prototype)if(h.indexOf("[native code]")!=-1){var f=h.indexOf(" ",8)+1;e+=h.slice(f,h.indexOf("(",f))}else{e+=h;for(var d in s.prototype)e+=";"+l+".prototype."+d+"="+s.prototype[d].toString()}else e+=h}else n[l]=s}return e},an=[],ql=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},Yl=function(t,e,n,r){if(!an[n]){for(var i="",o={},a=t.length-1,s=0;s<a;++s)i=vo(t[s],i,o);an[n]={c:vo(t[a],i,o),e:o}}var l=Zl({},an[n].e);return jl(an[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,ql(l),r)},Jl=function(){return[_,Re,bo,ur,dr,So,pr,Eo,Po,Io,un,Co,et,ln,z,cn,Ao,dn,A,Ro,hr,Mo,_o]};var Mo=function(t){return postMessage(t,[t.buffer])},_o=function(t){return t&&{out:t.size&&new _(t.size),dictionary:t.dictionary}},Xl=function(t,e,n,r,i,o){var a=Yl(n,r,i,function(s,l){a.terminate(),o(s,l)});return a.postMessage([t,e],e.consume?[t.buffer]:[]),function(){a.terminate()}};var ee=function(t,e){return t[e]|t[e+1]<<8},W=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},sr=function(t,e){return W(t,e)+W(t,e+4)*4294967296};function Ql(t,e,n){return n||(n=e,e={}),typeof n!="function"&&A(7),Xl(t,e,[Jl],function(r){return Mo(hr(r.data[0],_o(r.data[1])))},1,n)}function hr(t,e){return Ro(t,{i:2},e&&e.out,e&&e.dictionary)}var cr=typeof TextDecoder<"u"&&new TextDecoder,ec=0;try{cr.decode(Kl,{stream:!0}),ec=1}catch{}var tc=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:dn(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function nc(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(cr)return cr.decode(t);var i=tc(t),o=i.s,n=i.r;return n.length&&A(8),o}}var rc=function(t,e){return e+30+ee(t,e+26)+ee(t,e+28)},ic=function(t,e,n){var r=ee(t,e+28),i=ee(t,e+30),o=nc(t.subarray(e+46,e+46+r),!(ee(t,e+8)&2048)),a=e+46+r,s=oc(t,a,i,n,W(t,e+20),W(t,e+24),W(t,e+42)),l=s[0],h=s[1],f=s[2];return[ee(t,e+10),l,h,o,a+i+ee(t,e+32),f]},oc=function(t,e,n,r,i,o,a){var s=i==4294967295,l=o==4294967295,h=a==4294967295,f=e+n,d=s+l+h;if(r&&d){for(;e+4<f;e+=4+ee(t,e+2))if(ee(t,e)==1)return[s?sr(t,e+4+8*l):i,l?sr(t,e+4):o,h?sr(t,e+4+8*(l+s)):a,1];r<2&&A(13)}return[i,o,a,0]};var yo=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function Do(t,e,n){n||(n=e,e={}),typeof n!="function"&&A(7);var r=[],i=function(){for(var C=0;C<r.length;++C)r[C]()},o={},a=function(C,k){yo(function(){n(C,k)})};yo(function(){a=n});for(var s=t.length-22;W(t,s)!=101010256;--s)if(!s||t.length-s>65558)return a(A(13,0,1),null),i;var l=ee(t,s+8);if(l){var h=l,f=W(t,s+16),d=W(t,s-20)==117853008;if(d){var v=W(t,s-12);d=W(t,v)==101075792,d&&(h=l=W(t,v+32),f=W(t,v+48))}for(var S=e&&e.filter,E=function(C){var k=ic(t,f,d),le=k[0],R=k[1],re=k[2],_e=k[3],tt=k[4],Dt=k[5],be=rc(t,Dt);f=tt;var N=function(I,nt){I?(i(),a(I,null)):(nt&&(o[_e]=nt),--l||a(null,o))};if(!S||S({name:_e,size:R,originalSize:re,compression:le}))if(!le)N(null,dn(t,be,be+R));else if(le==8){var De=t.subarray(be,be+R);if(re<524288||R>.8*re)try{N(null,hr(De,{out:new _(re)}))}catch(I){N(I,null)}else r.push(Ql(De,{size:re},N))}else N(A(14,"unknown compression type "+le,1),null);else N(null,null)},D=0;D<h;++D)E(D)}else a(null,{});return i}var Vo=require("fs"),te=require("fs/promises"),fr=require("path");Ue();u();function Oo(t){function e(a,s,l,h){let f=0;return f+=a<<0,f+=s<<8,f+=l<<16,f+=h<<24>>>0,f}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let a=e(t[8],t[9],t[10],t[11]),s=e(t[12],t[13],t[14],t[15]),l=16+a+s;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}u();var ac=require("original-fs");async function sc(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function Lo(t,e){let r=await(await sc(t,e)).arrayBuffer();return Buffer.from(r)}var lc=(0,fr.join)(Ft,"ExtensionCache");async function cc(t,e){return await(0,te.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{Do(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async a=>{if(a.startsWith("_metadata/"))return;if(a.includes("\0"))throw new Error(`Invalid filename: "${a}"`);if(a.endsWith("/")){let d=ve(e,a);if(!d)throw new Error(`Path traversal detected: "${a}"`);return void await(0,te.mkdir)(d,{recursive:!0})}let l=a.split("/").slice(0,-1).join("/"),h=ve(e,l);if(!h)throw new Error(`Path traversal detected: "${a}"`);let f=ve(e,a);if(!f)throw new Error(`Path traversal detected: "${a}"`);l&&await(0,te.mkdir)(h,{recursive:!0}),await(0,te.writeFile)(f,o[a])})).then(()=>n()).catch(a=>{(0,te.rm)(e,{recursive:!0,force:!0}),r(a)})})})}async function Fo(t){let e=(0,fr.join)(lc,t);try{await(0,te.access)(e,Vo.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await Lo(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await cc(Oo(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}pn.session.defaultSession.extensions?pn.session.defaultSession.extensions.loadExtension(e):pn.session.defaultSession.loadExtension(e)}Nt||Me.app.whenReady().then(()=>{Me.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=ve(de,n);return r?Me.net.fetch((0,vr.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return Me.net.fetch((0,vr.pathToFileURL)((0,Bo.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{M.store.enableReactDevtools&&Fo("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}so()});Wo();
//# sourceURL=file:///VencordPatcher
//# sourceMappingURL=vencord://patcher.js.map
/*! For license information please see patcher.js.LEGAL.txt */

/* Fresh: Flashes, короткие вертикальные видео.
   Видео лежит на GitHub (его туда кладёт Edge Function upload-video),
   название, обложка и просмотры хранятся в таблице flashes (Supabase).
   Внизу панель: Главная / Flashes (лента) / История.
   Все лимиты меняются здесь: */
(function(){
const LIM={
  maxSec:60,     // длительность, секунд
  maxMB:25,      // вес видео, МБ
  maxSide:720,   // качество: меньшая сторона кадра (720x1280)
  coverMB:5,     // вес своей обложки, МБ
  titleMax:100, descMax:1000, tagsMax:10,
  freshMin:3     // сколько минут после загрузки видео «обрабатывается»
};
const FN='upload-video';
const URL_OK=/^https:\/\/[a-z0-9-]+\.github\.io\//i;
const COVER_OK=/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/;
const COLS='id,user_id,author,title,description,tags,url,cover,dur,w,h,views,likes,created_at';
const $=s=>document.querySelector(s);
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const mmss=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
const mb=b=>(b/1048576).toFixed(1).replace('.',',');
const dt=s=>new Date(s).toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
const vw=n=>{n=n||0;if(n<1000)return String(n);if(n<1e6)return (n/1000).toFixed(1).replace('.',',')+' тыс.';return (n/1e6).toFixed(1).replace('.',',')+' млн'};
const pluralR=n=>{const a=n%10,b=n%100;return a===1&&b!==11?'ответ':(a>=2&&a<=4&&(b<12||b>14))?'ответа':'ответов'};

/* ---------- иконки ---------- */
const sv=(p,c)=>'<svg'+(c?' class="'+c+'"':'')+' viewBox="0 0 24 24" fill="currentColor"><path d="'+p+'"/></svg>';
const P_UP='M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z';
const P_BUB='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z';
const IC={
  home:sv('M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z'),
  bolt:sv('M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z'),
  hist:sv('M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z'),
  like:sv('M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z'),
  cm:sv('M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'),
  up:sv(P_UP),
  down:sv(P_UP,'fm-dn'),
  rep:sv(P_BUB)
};

/* ---------- стили ---------- */
const st=document.createElement('style');
st.textContent=`
#v-fm{padding-bottom:80px}
.fm-hero{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;background:linear-gradient(110deg,#fff 35%,#d7f3fc);border-radius:28px;padding:28px 34px;box-shadow:0 6px 30px rgba(0,0,0,.04)}
.fm-hero small{display:flex;gap:10px;align-items:center;color:var(--cy);font-weight:600;font-size:13px}
.fm-hero small svg{width:24px;height:24px}
.fm-hero h1{font-weight:800;font-size:36px;color:#34404e;margin:6px 0 8px}
.fm-hero p{font-size:14px;color:#7b838c;max-width:560px;line-height:1.5}
.fm-msg{margin-top:14px;padding:12px 18px;border-radius:16px;background:#e7f6e5;color:var(--ok);font-weight:600;font-size:13px}
.fm-msg:empty{display:none}
.fm-panel{background:rgba(255,255,255,.75);backdrop-filter:blur(10px);border-radius:25px;padding:22px;box-shadow:0 6px 30px rgba(0,0,0,.04);margin-top:18px}
.fm-rules{font-size:12px;color:var(--mu);margin-bottom:14px;line-height:1.5}
.fm-info{font-size:13px;color:#566170;margin:10px 0 0;line-height:1.6}
.fm-err{color:#d97706;font-weight:600;font-size:13px;margin:10px 0 0;min-height:18px}
.fm-form{display:flex;gap:22px;margin-top:14px;flex-wrap:wrap}
.fm-cvi{flex:none;width:120px;aspect-ratio:9/16;border-radius:14px;background:#eaf6fd center top/cover no-repeat}
.fm-fld{flex:1;min-width:240px}
.fm-fld .l{display:block;font-weight:600;font-size:13px;margin:12px 0 6px}
.fm-fld .l:first-child{margin-top:0}
.fm-fld input.t,.fm-fld textarea{width:100%;border:1px solid #dfe5ea;border-radius:12px;padding:12px;font:inherit;outline:0}
.fm-fld textarea{height:80px;resize:vertical}
.fm-fld input[type=range]{width:100%;margin-bottom:8px}
.fm-row{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
.fm-btn{height:40px;padding:0 22px;border-radius:20px;background:var(--cy);color:#fff;font-weight:700;font-size:14px}
.fm-btn.g{background:#eef3f8;color:#566170}
.fm-btn.r{background:#e5314a;color:#fff}
.fm-btn:disabled{background:#e9eef2;color:#a9b2bb}
.fm-bar{margin:22px 0 4px}
.fm-q{width:100%;height:46px;border:1px solid #e3e8ee;border-radius:18px;padding:0 18px;font:inherit;color:#566170;background:#fff;outline:0}
.fm-g{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-top:14px}
@media(max-width:640px){.fm-g{grid-template-columns:repeat(2,1fr)}}
.fm-c{background:#fff;border-radius:22px;box-shadow:0 6px 30px rgba(0,0,0,.04);overflow:hidden;cursor:pointer}
.fm-th{position:relative;aspect-ratio:9/16;background:#eaf6fd center top/cover no-repeat}
.fm-th i{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(255,255,255,.9);display:grid;place-items:center;opacity:0;transition:opacity .15s}
.fm-th i::after{content:"";border-left:14px solid var(--cy);border-top:8px solid transparent;border-bottom:8px solid transparent;margin-left:4px}
.fm-c:hover .fm-th i{opacity:1}
.fm-du{position:absolute;right:8px;bottom:8px;background:rgba(20,40,60,.78);color:#fff;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}
.fm-nw{position:absolute;left:8px;top:8px;background:#fff4e0;color:#c9730f;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}
.fm-in{padding:12px 14px 14px}
.fm-in b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:14px;font-weight:600;line-height:1.3}
.fm-in small{display:block;color:var(--mu);font-size:11px;margin-top:4px}
.fm-tg{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.fm-tg span{background:var(--pl);color:var(--bt);border-radius:10px;padding:2px 9px;font-size:11px;font-weight:600;cursor:pointer}
.fm-ds{font-size:14px;line-height:1.6;color:#566170;margin-top:12px}
.fm-tabs{display:flex;gap:10px;margin-top:14px}
.fm-tabs button{height:36px;padding:0 18px;border-radius:12px;background:#fff;color:#566170;font-weight:600;font-size:14px}
.fm-tabs button.on{background:#34404e;color:#fff}

/* нижняя панель */
.fm-nav{position:fixed;left:0;right:0;bottom:0;height:56px;z-index:1000;display:flex;justify-content:center;background:#fff;border-top:1px solid #e3e8ee}
.fm-nav button{flex:1;max-width:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#566170;font-size:11px;font-weight:600}
.fm-nav svg{width:24px;height:24px}
.fm-nav button.on{color:var(--cy)}
body.menu .fm-nav{display:none}

/* лента Flashes */
#fm-feed{position:fixed;left:0;right:0;top:0;bottom:56px;z-index:998;background:#0a0e14}
#fm-feed[hidden]{display:none}
.fm-fe{height:100%;display:grid;place-items:center;color:#fff;text-align:center;padding:24px;font-weight:600}
.fm-sc{position:relative;height:100%;overflow-y:auto;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none}
.fm-sc::-webkit-scrollbar{display:none}
.fm-it{height:100%;box-sizing:border-box;padding:6px 0;scroll-snap-align:start;scroll-snap-stop:always;display:flex;align-items:center;justify-content:center}
.fm-pv{position:relative;height:100%;aspect-ratio:9/16;max-width:100%;border-radius:20px;overflow:hidden;background:#000}
.fm-pv video{width:100%;height:100%;object-fit:cover;object-position:top;display:block;cursor:pointer}
@media(max-width:640px){.fm-it{padding:0}.fm-pv{border-radius:0}}
.fm-pe{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;color:#fff;font-weight:600;background:rgba(0,0,0,.7);z-index:1}
.fm-pe[hidden]{display:none}
.fm-dl{position:absolute;top:10px;left:10px;z-index:3;height:34px;padding:0 16px;font-size:13px}
.fm-bt{position:absolute;left:0;right:64px;bottom:0;padding:50px 14px 16px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.7));z-index:2}
.fm-au{font-weight:700;font-size:15px}
.fm-tt{display:block;margin-top:6px;font-size:14px;font-weight:600;cursor:pointer}
.fm-bt .fm-tg span{background:none;color:#fff;padding:0;margin-right:4px}
.fm-side{position:absolute;right:8px;bottom:80px;display:flex;flex-direction:column;gap:18px;align-items:center;color:#fff;z-index:2;font-size:12px;font-weight:600;text-align:center}
.fm-lk{display:flex;flex-direction:column;align-items:center;gap:4px;color:#fff}
.fm-lk svg{width:30px;height:30px}
.fm-lk.on{color:#3fc3ee}

/* панель комментариев и описания */
.fm-dp{position:absolute;left:0;right:0;bottom:0;height:72%;background:#fff;border-radius:20px 20px 0 0;display:flex;flex-direction:column;overflow:hidden;z-index:5}
.fm-dp[hidden]{display:none}
@media(orientation:landscape){.fm-dp{left:auto;top:0;height:100%;width:min(460px,42vw);border-radius:20px 0 0 20px}}
.fm-dh{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid #eef1f4}
.fm-dh b{flex:1;font-size:17px}
.fm-xx2{width:34px;height:34px;font-size:18px;color:#566170}
.fm-db{flex:1;overflow:auto;padding:14px 16px}
.fm-cm{display:flex;gap:12px;margin-bottom:16px}
.fm-av{flex:none;width:40px;height:40px;border-radius:50%;color:#fff;font-weight:700;font-size:16px;display:grid;place-items:center}
.fm-cb{flex:1;min-width:0}
.fm-ch{font-size:12px;color:var(--mu)}
.fm-ch b{color:#34404e;font-size:13px;margin-right:6px}
.fm-cb p{margin:3px 0 0;font-size:14px;line-height:1.4;word-break:break-word;white-space:pre-wrap}
.fm-ca{display:flex;align-items:center;gap:2px;margin-top:4px;color:#566170}
.fm-ca button{display:flex;align-items:center;gap:6px;height:34px;padding:0 10px;border-radius:17px;font-size:13px;color:inherit}
.fm-ca button svg{width:20px;height:20px}
.fm-ca button.on{color:var(--cy)}
.fm-ca .fm-cd{margin-left:auto;font-size:12px;color:var(--mu)}
.fm-dn{transform:rotate(180deg)}
.fm-rl{color:var(--bt);font-weight:600;font-size:13px;padding:4px 0}
.fm-sub{margin:0 0 0 22px;padding-left:12px;border-left:2px solid #eef1f4}
.fm-sub .fm-av{width:30px;height:30px;font-size:13px}
.fm-ce{color:#d97706;font-size:12px;font-weight:600;padding:6px 16px 0}
.fm-ce:empty{display:none}
.fm-cf{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #eef1f4}
.fm-cf input{flex:1;min-width:0;border:1px solid #dfe5ea;border-radius:20px;padding:0 14px;height:40px;font:inherit;outline:0}

/* история */
#fm-hist{padding-top:6px}
.fm-hh{font-size:30px;font-weight:800;color:#34404e;margin:14px 0}
.fm-hg{margin-top:18px}
.fm-hg h3{font-size:17px;font-weight:700;margin:0 0 10px;color:#34404e}
.fm-hr{display:flex;gap:14px;overflow-x:auto;padding-bottom:8px;scrollbar-width:none}
.fm-hr::-webkit-scrollbar{display:none}
.fm-hc{flex:none;width:150px;cursor:pointer}
.fm-hc .fm-th{border-radius:16px;overflow:hidden}
.fm-ho{position:absolute;left:0;right:0;bottom:0;padding:40px 10px 10px;color:#fff;background:linear-gradient(transparent,rgba(0,0,0,.78))}
.fm-ho b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px;font-weight:700;line-height:1.25}
.fm-ho small{display:block;margin-top:3px;font-size:11px;opacity:.9}
.fm-hx{position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:50%;background:rgba(0,0,0,.45);color:#fff;font-size:12px;z-index:2}
@media(max-width:640px){.fm-hero{padding:22px 20px}.fm-hero h1{font-size:28px}}`;
document.head.appendChild(st);

const sec=document.createElement('section');
sec.id='v-fm';sec.hidden=true;
document.querySelector('.main').appendChild(sec);

/* ---------- состояние и связь с Supabase ---------- */
let list=[],q='',hq='',uid=null,loadErr=false,loaded=false,msgT=null;
let tab='all',view='home',io=null;
let openId=null,cms=[],cmFor=null,cmMode='c',cmParent=null,cmNew=true,myVotes={};
const extra={},ccount={},seen=new Set(),likedSet=new Set();
const byId=id=>list.find(a=>String(a.id)===String(id))||extra[id];
const ready=()=>new Promise(ok=>{
  if(window.SB)return ok(window.SB);
  let n=0;const t=setInterval(()=>{if(window.SB||++n>120){clearInterval(t);ok(window.SB||null)}},250);
});
const say=t=>{const m=$('#fm-msg');if(!m)return;m.textContent=t;clearTimeout(msgT);msgT=setTimeout(()=>{m.textContent=''},9000)};
const fnErr=async e=>{try{const j=await e.context.json();if(j&&j.error)return j.error}catch(x){}return 'Не удалось загрузить видео. Проверь интернет и попробуй ещё раз.'};
const fresh=x=>Date.now()-new Date(x.created_at)<LIM.freshMin*60000;
const waitTxt=s=>{const t=Math.ceil(s/60),h=Math.floor(t/60),m=t%60;return h?h+' ч '+m+' мин':m+' мин'};
const parseTags=s=>[...new Set(s.split(/[\s,]+/)
  .map(x=>x.replace(/^#+/,'').toLowerCase().replace(/[^a-zа-яё0-9_]/g,'').slice(0,30))
  .filter(Boolean))];
const setN=(attr,id,txt)=>{const e=sec.querySelector('['+attr+'="'+id+'"]');if(e)e.textContent=txt};
const twice=(b,t0,t1)=>{
  if(!b.dataset.sure){
    b.dataset.sure='1';b.textContent=t1;b.classList.add('r');
    setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent=t0;b.classList.remove('r')}},4000);
    return false;
  }
  return true;
};

/* ---------- история просмотров (хранится на устройстве) ---------- */
const hk=()=>'fm_hist_'+(uid||'guest');
const getHist=()=>{try{const a=JSON.parse(localStorage.getItem(hk())||'[]');return Array.isArray(a)?a:[]}catch(x){return[]}};
const putHist=a=>{try{localStorage.setItem(hk(),JSON.stringify(a.slice(0,200)))}catch(x){}};
const addHist=id=>{const a=getHist().filter(o=>String(o.id)!==String(id));a.unshift({id:String(id),t:Date.now()});putHist(a)};

/* ---------- разбор видео и обложек ---------- */
const probe=f=>new Promise((ok,no)=>{
  const v=document.createElement('video'),u=URL.createObjectURL(f);
  v.preload='auto';v.muted=true;v.playsInline=true;
  const t=setTimeout(()=>{URL.revokeObjectURL(u);no()},8000);
  v.onloadedmetadata=()=>{clearTimeout(t);ok({v,u,dur:v.duration,w:v.videoWidth,h:v.videoHeight})};
  v.onerror=()=>{clearTimeout(t);URL.revokeObjectURL(u);no()};
  v.src=u;
});
const shot=(src,w,h)=>{
  const k=Math.min(1,640/Math.max(w,h)),c=document.createElement('canvas');
  c.width=Math.round(w*k);c.height=Math.round(h*k);
  c.getContext('2d').drawImage(src,0,0,c.width,c.height);
  return c.toDataURL('image/jpeg',.72);
};
const frame=(v,t)=>new Promise(ok=>{
  let done=false;const fin=()=>{if(!done){done=true;ok(shot(v,v.videoWidth,v.videoHeight))}};
  v.addEventListener('seeked',fin,{once:true});setTimeout(fin,2500);
  v.currentTime=t;
});
const imgCover=f=>new Promise((ok,no)=>{
  const i=new Image(),u=URL.createObjectURL(f);
  i.onload=()=>{URL.revokeObjectURL(u);ok(shot(i,i.width,i.height))};
  i.onerror=()=>{URL.revokeObjectURL(u);no()};
  i.src=u;
});

/* ---------- страница ---------- */
function shell(){
  view='home';openId=null;cmFor=null;cmMode='c';cmParent=null;
  if(io){io.disconnect();io=null}
  sec.innerHTML=`<div id="fm-home"><div class="fm-hero"><div><small>${window.MS?MS.ic('fresh'):''}Видео</small><h1>Fresh</h1>
    <p>Короткие вертикальные видео: до ${LIM.maxSec} секунд, качество до ${LIM.maxSide}p. Квадратные тоже подходят.</p></div>
    <button class="sw" id="fm-new">Загрузить Flash</button></div>
    <div class="fm-msg" id="fm-msg"></div>
    <div class="fm-panel" id="fm-up" hidden>
      <div class="fm-rules">До ${LIM.maxSec} секунд, до ${LIM.maxMB} МБ, вертикальное или квадратное, не выше ${LIM.maxSide}p (720×1280), формат mp4 или mov. Чтобы видео прошло, сними его в настройках камеры в качестве HD (720p).</div>
      <div class="fm-err" id="lim"></div>
      <label class="fm-btn g" id="vfl" style="display:inline-flex;align-items:center;cursor:pointer">Выбрать видео<input type="file" id="vf" accept="video/mp4,video/quicktime,.mp4,.mov" hidden></label>
      <div class="fm-info" id="info"></div>
      <div class="fm-err" id="e"></div>
      <div class="fm-form" id="form" hidden>
        <div class="fm-cvi" id="cvi"></div>
        <div class="fm-fld">
          <span class="l">Обложка: выбери кадр или свою картинку</span>
          <input type="range" id="sl" min="0" max="1" step="0.1" value="0">
          <label class="fm-btn g" style="display:inline-flex;align-items:center;cursor:pointer">Своя картинка<input type="file" id="cf" accept="image/*" hidden></label>
          <label class="l" for="ti">Название</label><input class="t" id="ti" maxlength="${LIM.titleMax}" placeholder="Например: Опыт с водой">
          <label class="l" for="de">Описание</label><textarea id="de" maxlength="${LIM.descMax}" placeholder="О чём это видео?"></textarea>
          <label class="l" for="tg">Хэштеги</label><input class="t" id="tg" placeholder="#физика #опыт (до ${LIM.tagsMax})">
        </div>
      </div>
      <div class="fm-row"><button class="fm-btn" id="pub" disabled>Опубликовать</button><button class="fm-btn g" id="cn">Отмена</button></div>
    </div>
    <div class="fm-bar"><input class="fm-q" id="fm-q" placeholder="Поиск по названию, автору или #хэштегу" value="${esc(q)}"></div>
    <div class="fm-tabs"><button data-tab="all" class="${tab==='all'?'on':''}">Все</button><button data-tab="vid" class="${tab==='vid'?'on':''}">Видео</button><button data-tab="fl" class="${tab==='fl'?'on':''}">Flashes</button></div>
    <div id="fm-list"></div></div>
    <div id="fm-feed" hidden></div>
    <div id="fm-hist" hidden></div>
    <nav class="fm-nav"><button data-nav="home" class="on">${IC.home}Главная</button><button data-nav="feed">${IC.bolt}Flashes</button><button data-nav="hist">${IC.hist}История</button></nav>`;
  $('#fm-feed').addEventListener('error',ev=>{
    if(ev.target.tagName==='VIDEO'){const pe=ev.target.parentNode.querySelector('.fm-pe');if(pe)pe.hidden=false}
  },true);
  initUpload();
}

function setView(v,startId){
  if(!$('#fm-home'))return;
  view=v;
  $('#fm-home').hidden=v!=='home';
  $('#fm-feed').hidden=v!=='feed';
  $('#fm-hist').hidden=v!=='hist';
  sec.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('on',b.dataset.nav===v));
  if(v!=='feed'){
    if(io){io.disconnect();io=null}
    $('#fm-feed').innerHTML='';openId=null;cmFor=null;
  }
  if(v==='feed')buildFeed(startId);
  if(v==='hist')renderHist();
  if(v==='home')paint();
  window.scrollTo(0,0);
}

const bg=c=>COVER_OK.test(c||'')?` style="background-image:url('${c}')"`:'';
const card=x=>`<div class="fm-c" data-o="${esc(x.id)}"><div class="fm-th"${bg(x.cover)}>${fresh(x)?'<span class="fm-nw">Обрабатывается</span>':''}<i></i><span class="fm-du">${mmss(x.dur)}</span></div>
  <div class="fm-in"><b>${esc(x.title)}</b><small>${esc(x.author)}</small><small>${x.views||0} просм., ${dt(x.created_at)}</small>
  ${(x.tags||[]).length?`<div class="fm-tg">${x.tags.slice(0,3).map(t=>`<span data-tag="${esc(t)}">#${esc(t)}</span>`).join('')}</div>`:''}</div></div>`;

function paint(){
  const box=$('#fm-list');if(!box)return;
  if(tab==='vid'){box.innerHTML='<div class="fr">Тут пока ничего нет.</div>';return}
  const s=q.replace(/^#/,'').toLowerCase();
  const f=list.filter(x=>!s||(x.title||'').toLowerCase().includes(s)||(x.author||'').toLowerCase().includes(s)||(x.tags||[]).some(t=>t.includes(s)));
  box.innerHTML=f.length?`<div class="fm-g">${f.map(card).join('')}</div>`
    :`<div class="fr">${loadErr?'Flashes не загрузились. Обнови страницу.':list.length?'Ничего не найдено.':'Здесь пока пусто. Загрузи первый Flash!'}</div>`;
}

const PAGE=60;let loadTk=0;
async function loadList(){
  const S=await ready();loadErr=false;
  if(!S){loadErr=true;loaded=true;list=[];return paint()}
  const tk=++loadTk;
  let from=0,all=[];
  try{
    if(!uid){const u=await S.auth.getUser();uid=u.data&&u.data.user?u.data.user.id:null}
    for(;;){
      const r=await S.from('flashes').select(COLS)
        .order('created_at',{ascending:false}).order('id',{ascending:false})
        .range(from,from+PAGE-1);
      if(r.error)throw r.error;
      if(tk!==loadTk)return;
      const rows=r.data||[];
      all=all.concat(rows);list=all.slice();
      if(from===0){loaded=true;paint();if(view==='feed'&&!$('#fm-sc'))buildFeed()}
      else{paint();addToFeed(rows)}
      if(rows.length<PAGE)break;
      from+=PAGE;
    }
  }catch(e){
    if(tk!==loadTk)return;
    if(!all.length){list=[];loadErr=true}
    loaded=true;paint();
  }
}
function addToFeed(rows){
  const sc=$('#fm-sc');if(!sc||!io)return;
  const have=new Set([...sc.children].map(c=>c.dataset.id));
  rows.filter(x=>URL_OK.test(x.url||'')&&!have.has(String(x.id))).forEach(x=>{
    sc.insertAdjacentHTML('beforeend',item(x));
    io.observe(sc.lastElementChild);
  });
}

/* ---------- загрузка ---------- */
function initUpload(){
  const box=$('#fm-up'),g=s=>box.querySelector(s);
  let P=null,cover='',busy=false;
  const err=t=>{g('#e').textContent=t||''};
  const setCover=d=>{cover=d;g('#cvi').style.backgroundImage="url('"+d+"')"};
  const drop=()=>{
    if(P){URL.revokeObjectURL(P.u);P=null}
    cover='';g('#vf').value='';g('#cf').value='';g('#info').textContent='';err();
    g('#form').hidden=true;g('#pub').disabled=true;
    g('#ti').value='';g('#de').value='';g('#tg').value='';
  };
  const checkLimit=async()=>{
    g('#lim').textContent='';g('#vfl').hidden=false;
    const S=await ready();if(!S)return;
    try{
      const r=await S.rpc('flash_wait');
      const left=r&&!r.error?Number(r.data)||0:0;
      if(left>0){g('#lim').textContent='Два Flash в сутки. Следующий можно загрузить через '+waitTxt(left)+'.';g('#vfl').hidden=true}
    }catch(x){}
  };
  $('#fm-new').onclick=()=>{box.hidden=!box.hidden;if(!box.hidden){box.scrollIntoView({behavior:'smooth',block:'nearest'});checkLimit()}};
  g('#cn').onclick=()=>{if(busy)return;drop();box.hidden=true};

  g('#vf').onchange=async e=>{
    const f=e.target.files[0];if(!f||busy)return;
    err();g('#form').hidden=true;g('#pub').disabled=true;
    if(P){URL.revokeObjectURL(P.u);P=null}
    g('#info').textContent='Проверяем видео…';
    const bad=t=>{g('#info').textContent='';err(t)};
    const ext=(f.name.split('.').pop()||'').toLowerCase();
    if(!['mp4','mov'].includes(ext))return bad('Нужен файл mp4 или mov.');
    if(f.size>LIM.maxMB*1048576)return bad('Файл весит '+mb(f.size)+' МБ, а можно не больше '+LIM.maxMB+' МБ.');
    let p;try{p=await probe(f)}catch(x){return bad('Не удалось прочитать видео. Нужен mp4 (H.264).')}
    const no=t=>{URL.revokeObjectURL(p.u);bad(t)};
    if(!isFinite(p.dur)||p.dur<=0)return no('Не удалось определить длительность видео.');
    if(p.dur>LIM.maxSec+.5)return no('Видео длится '+mmss(p.dur)+', а можно не больше '+mmss(LIM.maxSec)+'.');
    if(p.w>p.h)return no('Видео горизонтальное. В Flashes можно только вертикальные и квадратные.');
    if(Math.min(p.w,p.h)>LIM.maxSide)return no('Качество '+p.w+'×'+p.h+' выше '+LIM.maxSide+'p. Сними заново в HD (720p): в настройках камеры выбери «HD», а не «FHD» или «4K».');
    P={...p,f};
    g('#info').textContent=f.name+': '+mmss(p.dur)+', '+p.w+'×'+p.h+', '+mb(f.size)+' МБ, '+(p.h>p.w?'вертикальное':'квадратное');
    const sl=g('#sl');sl.max=p.dur.toFixed(1);sl.value=Math.min(1,p.dur/2);
    g('#form').hidden=false;g('#pub').disabled=false;
    setCover(await frame(p.v,+sl.value));
  };
  g('#sl').onchange=async e=>{if(P&&!busy)setCover(await frame(P.v,+e.target.value))};
  g('#cf').onchange=async e=>{
    const f=e.target.files[0];if(!f)return;err();
    if(f.size>LIM.coverMB*1048576)return err('Обложка весит больше '+LIM.coverMB+' МБ.');
    try{setCover(await imgCover(f))}catch(x){err('Не удалось открыть картинку.')}
  };

  g('#pub').onclick=async()=>{
    if(busy)return;err();
    const title=g('#ti').value.trim(),desc=g('#de').value.trim(),tags=parseTags(g('#tg').value);
    if(!P)return err('Сначала выбери видео.');
    if(title.length<3)return err('Напиши название: минимум 3 символа.');
    if(tags.length>LIM.tagsMax)return err('Хэштегов не больше '+LIM.tagsMax+'.');
    const S=await ready();if(!S)return err('Нет связи с сервером. Обнови страницу.');
    busy=true;const b=g('#pub');b.disabled=true;b.textContent='Загружаем…';
    g('#info').textContent='Загружаем видео, не закрывай страницу. Это может занять до минуты.';
    const fail=t=>{busy=false;b.disabled=false;b.textContent='Опубликовать';g('#info').textContent='';err(t)};
    try{
      const fd=new FormData();fd.append('file',P.f,P.f.name);
      const up=await S.functions.invoke(FN,{body:fd});
      if(up.error)return fail(await fnErr(up.error));
      const url=up.data&&up.data.url;
      if(!url||!URL_OK.test(url))return fail('Сервер вернул странный ответ. Попробуй ещё раз.');
      const ins=await S.from('flashes').insert({author:window.ME_NAME||'Участник',title,description:desc,tags,url,cover,dur:P.dur,w:P.w,h:P.h,size:P.f.size});
      if(ins.error)return fail('Видео загружено, но запись не сохранилась. Сообщи об этом.');
    }catch(x){return fail('Что-то пошло не так. Попробуй ещё раз.')}
    busy=false;b.textContent='Опубликовать';drop();box.hidden=true;
    say('Flash опубликован. Видео заработает по ссылке через 1–2 минуты.');
    loadList();
  };
}

/* ---------- лента Flashes ---------- */
const item=x=>{
  const mine=uid&&x.user_id===uid,id=esc(x.id);
  return `<div class="fm-it" data-id="${id}"><div class="fm-pv"><video data-src="${esc(x.url)}" preload="none" loop playsinline></video>
  <div class="fm-pe" hidden>Видео ещё обрабатывается. Подожди минуту-две и открой снова.</div>
  ${mine?'<button class="fm-btn g fm-dl" data-del>Удалить</button>':''}
  <div class="fm-side"><button class="fm-lk${likedSet.has(String(x.id))?' on':''}" data-like>${IC.like}<span data-ln="${id}">${x.likes||0}</span></button>
  <button class="fm-lk" data-cm>${IC.cm}<span data-cn="${id}">${ccount[x.id]||0}</span></button>
  <div data-vn="${id}">${x.views||0} просм.</div></div>
  <div class="fm-bt"><div class="fm-au">${esc(x.author)}</div><b class="fm-tt" data-info>${esc(x.title)}</b>
  ${(x.tags||[]).length?`<div class="fm-tg">${x.tags.map(t=>`<span data-tag="${esc(t)}">#${esc(t)}</span>`).join('')}</div>`:''}</div></div></div>`;
};

function buildFeed(startId){
  const fe=$('#fm-feed');if(!fe)return;
  if(io){io.disconnect();io=null}
  openId=null;cmFor=null;
  const items=list.filter(x=>URL_OK.test(x.url||''));
  if(startId!=null&&!items.some(x=>String(x.id)===String(startId))){
    const ex=extra[startId];if(ex&&URL_OK.test(ex.url||''))items.unshift(ex);
  }
  if(!items.length){
    fe.innerHTML=`<div class="fm-fe">${!loaded?'Загружаем…':loadErr?'Flashes не загрузились. Обнови страницу.':'Здесь пока пусто. Загрузи первый Flash!'}</div>`;
    return;
  }
  fe.innerHTML=`<div class="fm-sc" id="fm-sc">${items.map(item).join('')}</div><div class="fm-dp" id="fm-dp" hidden></div>`;
  const sc=$('#fm-sc');
  if(startId!=null){const el=[...sc.children].find(c=>c.dataset.id===String(startId));if(el)sc.scrollTop=el.offsetTop}
  io=new IntersectionObserver(es=>es.forEach(en=>{
    if(en.isIntersecting)activate(en.target);
    else{const v=en.target.querySelector('video');if(v)v.pause()}
  }),{root:sc,threshold:.6});
  [...sc.children].forEach(c=>io.observe(c));
  const ids=items.map(x=>x.id);
  ready().then(S=>S&&S.from('flash_likes').select('flash_id').in('flash_id',ids)).then(r=>{
    if(r&&r.data){
      r.data.forEach(o=>likedSet.add(String(o.flash_id)));
      fe.querySelectorAll('.fm-it').forEach(it=>{if(likedSet.has(it.dataset.id)){const b=it.querySelector('[data-like]');if(b)b.classList.add('on')}});
    }
  }).catch(()=>{});
}

const loadVid=v=>{if(!v.getAttribute('src'))v.src=v.dataset.src};
function activate(it){
  const id=it.dataset.id,v=it.querySelector('video'),x=byId(id);
  if(openId!==id){openId=id;closePanel()}
  loadVid(v);
  const p=v.play();if(p&&p.catch)p.catch(()=>{v.muted=true;v.play().catch(()=>{})});
  const nx=it.nextElementSibling;
  if(nx){const nv=nx.querySelector('video');if(nv&&!nv.getAttribute('src')){nv.preload='metadata';nv.src=nv.dataset.src}}
  if(!seen.has(id)&&x){
    seen.add(id);x.views=(x.views||0)+1;
    setN('data-vn',id,x.views+' просм.');
    addHist(id);
    ready().then(S=>S&&S.rpc('flash_view',{fid:id})).catch(()=>{});
  }
  countCm(id);
}
async function countCm(id){
  if(ccount[id]!=null)return;
  const S=await ready();if(!S)return;
  try{
    const r=await S.from('flash_comments').select('id',{count:'exact',head:true}).eq('flash_id',id);
    if(r.error)return;
    ccount[id]=r.count||0;setN('data-cn',id,ccount[id]);
  }catch(e){}
}

/* ---------- комментарии ---------- */
const ava=n=>{
  const s=String(n||'?').trim()||'?';let h=0;
  for(const ch of s)h=(h*31+ch.charCodeAt(0))%360;
  return `<span class="fm-av" style="background:hsl(${h},55%,48%)">${esc(s.charAt(0).toUpperCase())}</span>`;
};
const kids=id=>cms.filter(c=>c.parent_id&&String(c.parent_id)===String(id))
  .sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));

function cmItem(c,showRl){
  const my=myVotes[c.id]||0,n=showRl?kids(c.id).length:0;
  return `<div class="fm-cm">${ava(c.author)}<div class="fm-cb">
  <div class="fm-ch"><b>${esc(c.author)}</b>${dt(c.created_at)}</div>
  <p>${esc(c.text)}</p>
  <div class="fm-ca">${cmNew?`<button class="${my===1?'on':''}" data-cv="1" data-cid="${esc(c.id)}">${IC.up}<span>${c.likes>0?c.likes:''}</span></button>
  <button class="${my===-1?'on':''}" data-cv="-1" data-cid="${esc(c.id)}">${IC.down}</button>
  <button data-crep="${esc(c.id)}">${IC.rep}</button>`:''}
  ${uid&&c.user_id===uid?`<button class="fm-cd" data-cdel="${esc(c.id)}">Удалить</button>`:''}</div>
  ${n?`<button class="fm-rl" data-copen="${esc(c.id)}">${n} ${pluralR(n)} ›</button>`:''}</div></div>`;
}
const cmForm=ph=>`<div class="fm-ce" id="cm-e"></div><div class="fm-cf"><input id="cm-t" maxlength="500" placeholder="${ph}"><button class="fm-btn" data-csend>Отправить</button></div>`;

function showComments(){
  const dp=$('#fm-dp');if(!dp)return;
  const tops=cms.filter(c=>!c.parent_id);
  dp.innerHTML=`<div class="fm-dh"><b>Комментарии ${cms.length}</b><button class="fm-xx2" data-dx>✕</button></div>
  <div class="fm-db">${tops.length?tops.map(c=>cmItem(c,true)).join(''):'<p class="fm-ds">Комментариев пока нет. Напиши первый!</p>'}</div>`+cmForm('Введите текст комментария');
}
function showReplies(){
  const dp=$('#fm-dp');if(!dp)return;
  const p=cms.find(c=>String(c.id)===String(cmParent));
  if(!p){cmMode='c';cmParent=null;return showComments()}
  dp.innerHTML=`<div class="fm-dh"><button class="fm-xx2" data-cback>←</button><b>Ответы</b><button class="fm-xx2" data-dx>✕</button></div>
  <div class="fm-db">${cmItem(p,false)}${kids(p.id).map(c=>`<div class="fm-sub">${cmItem(c,false)}</div>`).join('')}</div>`+cmForm('Ваш ответ…');
}
function showInfo(){
  const dp=$('#fm-dp'),x=byId(openId);if(!dp||!x)return;
  dp.innerHTML=`<div class="fm-dh"><b>Описание</b><button class="fm-xx2" data-dx>✕</button></div><div class="fm-db"><b>${esc(x.title)}</b><small style="display:block;color:var(--mu);margin-top:6px">${x.views||0} просм., ${dt(x.created_at)}</small><p class="fm-ds">${x.description?esc(x.description).replace(/\n/g,'<br>'):'Описания нет.'}</p></div>`;
}
function renderPanel(keep){
  const dp=$('#fm-dp');if(!dp||dp.hidden)return;
  const old=dp.querySelector('.fm-db'),sy=keep&&old?old.scrollTop:0;
  const ti=$('#cm-t'),tx=keep&&ti?ti.value:'';
  if(cmMode==='i')showInfo();else if(cmMode==='r')showReplies();else showComments();
  const nb=dp.querySelector('.fm-db');if(nb)nb.scrollTop=sy;
  const ni=$('#cm-t');if(ni&&tx)ni.value=tx;
}
function openPanel(m){
  const dp=$('#fm-dp');if(!dp||!openId)return;
  dp.hidden=false;
  if(m==='c'){
    cmMode='c';cmParent=null;
    if(cmFor!==openId){cms=[];myVotes={};cmFor=openId}
    renderPanel();loadComments(openId);
  }else{cmMode='i';renderPanel()}
}
function closePanel(){const dp=$('#fm-dp');if(dp)dp.hidden=true}

async function loadComments(id){
  const S=await ready();if(!S)return;
  const base='id,user_id,author,text,created_at';
  let r=await S.from('flash_comments').select(base+',parent_id,likes,dislikes').eq('flash_id',id).order('created_at',{ascending:false}).limit(300);
  if(r.error){
    cmNew=false;
    r=await S.from('flash_comments').select(base).eq('flash_id',id).order('created_at',{ascending:false}).limit(300);
  }else cmNew=true;
  if(cmFor!==id)return;
  cms=r.data||[];
  if(cmNew&&cms.length){
    try{
      const v=await S.from('flash_comment_votes').select('comment_id,v').in('comment_id',cms.map(c=>c.id));
      myVotes={};(v.data||[]).forEach(o=>{myVotes[o.comment_id]=o.v});
    }catch(e){}
    if(cmFor!==id)return;
  }
  ccount[id]=cms.length;setN('data-cn',id,cms.length);
  renderPanel(true);
}

/* ---------- история: экран ---------- */
async function renderHist(){
  const box=$('#fm-hist');if(!box)return;
  box.innerHTML=`<h1 class="fm-hh">История</h1><input class="fm-q" id="fm-hq" placeholder="Искать в истории просмотра" value="${esc(hq)}"><div id="fm-hl"></div>`;
  const S=await ready(),miss=getHist().map(o=>o.id).filter(id=>!byId(id)).slice(0,60);
  if(S&&miss.length){
    try{
      const r=await S.from('flashes').select(COLS).in('id',miss);
      (r.data||[]).forEach(x=>{extra[x.id]=x});
    }catch(e){}
  }
  if(view==='hist')paintHist();
}
function paintHist(){
  const box=$('#fm-hl');if(!box)return;
  const all=getHist().map(o=>({o,x:byId(o.id)})).filter(a=>a.x);
  if(!all.length){box.innerHTML='<div class="fr">История пуста. Открой любой Flash, и он появится здесь.</div>';return}
  const s=hq.replace(/^#/,'').toLowerCase();
  const h=all.filter(a=>!s||(a.x.title||'').toLowerCase().includes(s)||(a.x.author||'').toLowerCase().includes(s)||(a.x.tags||[]).some(t=>t.includes(s)));
  if(!h.length){box.innerHTML='<div class="fr">Ничего не найдено.</div>';return}
  const n=new Date(),y=new Date(n);y.setDate(n.getDate()-1);
  const lab=d=>d.toDateString()===n.toDateString()?'Сегодня':d.toDateString()===y.toDateString()?'Вчера':dt(d);
  const groups=[];
  h.forEach(a=>{
    const d=new Date(a.o.t),k=d.toDateString();
    let g=groups[groups.length-1];
    if(!g||g.k!==k){g={k,d,items:[]};groups.push(g)}
    g.items.push(a.x);
  });
  box.innerHTML=groups.map(g=>`<div class="fm-hg"><h3>${lab(g.d)}</h3><div class="fm-hr">${g.items.map(x=>
    `<div class="fm-hc" data-o="${esc(x.id)}"><div class="fm-th"${bg(x.cover)}><button class="fm-hx" data-hdel="${esc(x.id)}">✕</button>
    <div class="fm-ho"><b>${esc(x.title)}</b><small>${vw(x.views)} просм.</small></div></div></div>`).join('')}</div></div>`).join('')
    +'<div class="fm-row"><button class="fm-btn g" data-hclear>Очистить историю</button></div>';
}

/* ---------- клики ---------- */
sec.addEventListener('click',async e=>{
  const t=e.target;
  const nv=t.closest('[data-nav]');
  if(nv)return setView(nv.dataset.nav);
  const tg=t.closest('[data-tag]');
  if(tg){q='#'+tg.dataset.tag;setView('home');const i=$('#fm-q');if(i)i.value=q;return paint()}
  if(t.tagName==='VIDEO'){
    if(t.muted){t.muted=false;t.play()}else if(t.paused)t.play();else t.pause();
    return;
  }
  const hd=t.closest('[data-hdel]');
  if(hd){putHist(getHist().filter(o=>String(o.id)!==String(hd.dataset.hdel)));return paintHist()}
  const hc=t.closest('[data-hclear]');
  if(hc){if(twice(hc,'Очистить историю','Точно очистить?')){putHist([]);paintHist()}return}

  const lk=t.closest('[data-like]');
  if(lk){
    const it=lk.closest('.fm-it'),id=it?it.dataset.id:null;
    if(!id||lk.dataset.busy)return;
    lk.dataset.busy='1';
    const S=await ready();
    if(S){
      const r=await S.rpc('flash_like',{fid:id});
      if(!r.error&&r.data){
        lk.classList.toggle('on',r.data.liked);
        if(r.data.liked)likedSet.add(String(id));else likedSet.delete(String(id));
        setN('data-ln',id,r.data.likes);
        const x=byId(id);if(x)x.likes=r.data.likes;
      }
    }
    delete lk.dataset.busy;return;
  }
  const inf=t.closest('[data-info]');
  if(inf){const it=inf.closest('.fm-it');if(it)openId=it.dataset.id;return openPanel('i')}
  const cmb=t.closest('[data-cm]');
  if(cmb){const it=cmb.closest('.fm-it');if(it)openId=it.dataset.id;return openPanel('c')}
  if(t.closest('[data-dx]'))return closePanel();
  if(t.closest('[data-cback]')){cmMode='c';cmParent=null;return renderPanel(false)}
  const co=t.closest('[data-copen]');
  if(co){cmMode='r';cmParent=co.dataset.copen;return renderPanel(false)}
  const rp=t.closest('[data-crep]');
  if(rp){
    const c=cms.find(a=>String(a.id)===String(rp.dataset.crep));if(!c)return;
    if(cmMode!=='r'){cmMode='r';cmParent=c.parent_id||c.id;renderPanel(false)}
    const inp=$('#cm-t');
    if(inp){if(c.parent_id&&!inp.value)inp.value='@'+c.author+' ';inp.focus()}
    return;
  }
  const cv=t.closest('[data-cv]');
  if(cv){
    if(cv.dataset.busy)return;
    cv.dataset.busy='1';
    const S=await ready(),cid=cv.dataset.cid;
    if(S){
      const r=await S.rpc('flash_comment_vote',{cid:String(cid),val:+cv.dataset.cv});
      if(!r.error&&r.data){
        const c=cms.find(a=>String(a.id)===String(cid));
        if(c){c.likes=r.data.likes;c.dislikes=r.data.dislikes}
        if(r.data.my)myVotes[cid]=r.data.my;else delete myVotes[cid];
        renderPanel(true);
      }
    }
    delete cv.dataset.busy;return;
  }
  const cs=t.closest('[data-csend]');
  if(cs){
    const inp=$('#cm-t'),v=inp?inp.value.trim():'';
    if(!v||!openId||cs.dataset.busy)return;
    cs.dataset.busy='1';
    const S=await ready();
    if(S){
      const row={flash_id:openId,author:window.ME_NAME||'Участник',text:v};
      if(cmMode==='r'&&cmParent)row.parent_id=cmParent;
      const r=await S.from('flash_comments').insert(row);
      if(r.error){const ce=$('#cm-e');if(ce)ce.textContent='Не удалось отправить. Попробуй ещё раз.'}
      else{if(inp)inp.value='';await loadComments(openId)}
    }
    delete cs.dataset.busy;return;
  }
  const cd=t.closest('[data-cdel]');
  if(cd){
    const S=await ready();
    if(S){
      await S.from('flash_comments').delete().eq('id',cd.dataset.cdel);
      if(String(cmParent)===String(cd.dataset.cdel)){cmMode='c';cmParent=null}
      loadComments(openId);
    }
    return;
  }
  const c=t.closest('[data-o]');
  if(c)return setView('feed',c.dataset.o);
  const d=t.closest('[data-del]');
  if(d){
    if(!twice(d,'Удалить','Точно удалить?'))return;
    const it=d.closest('.fm-it'),id=it?it.dataset.id:null;
    const S=await ready();if(!S||!id)return;
    const r=await S.from('flashes').delete().eq('id',id);
    if(r.error)return say('Не удалось удалить Flash.');
    setView('home');say('Flash удалён.');loadList();
    return;
  }
  const tb=t.closest('[data-tab]');
  if(tb){tab=tb.dataset.tab;sec.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b===tb));return paint()}
});
sec.addEventListener('input',e=>{
  if(e.target.id==='fm-q'){q=e.target.value;paint()}
  if(e.target.id==='fm-hq'){hq=e.target.value;paintHist()}
});
sec.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.id==='cm-t'){const b=sec.querySelector('[data-csend]');if(b)b.click()}
});

/* когда раздел закрывают через меню, останавливаем видео */
new MutationObserver(()=>{
  if(!sec.getClientRects().length&&view!=='home')setView('home');
}).observe(sec,{attributes:true,attributeFilter:['hidden','class','style']});

/* ---------- открыть конкретный Flash из профиля ---------- */
window.FM={open:id=>{
  MS.show('fm');
  let n=0;
  const t=setInterval(async()=>{
    if(!($('#fm-home')&&loaded)){if(++n>80)clearInterval(t);return}
    clearInterval(t);
    if(!byId(id)){
      const S=await ready();
      try{const r=await S.from('flashes').select(COLS).eq('id',id).maybeSingle();if(r.data)extra[r.data.id]=r.data}catch(e){}
    }
    setView('feed',id);
  },150);
}};

/* ---------- подключение к меню ---------- */
window.RV=window.RV||{};
window.RV.fm=()=>{shell();loadList()};
const drawer=$('#drawer');
if(drawer)drawer.addEventListener('click',e=>{
  const b=e.target.closest('.mi');
  if(b&&b.textContent.trim()==='Fresh'){document.body.classList.remove('menu');MS.show('fm')}
});
})();

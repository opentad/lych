/* Fresh: Flashes, короткие вертикальные видео.
   Видео лежит на GitHub (его туда кладёт Edge Function upload-video),
   название, обложка и просмотры хранятся в таблице flashes (Supabase).
   Внизу панель: Главная / Flashes (лента) / История.
   Статистика автора: кнопка «Статистика» на главной и на своём Flash в ленте
   (нужен SQL из freshmilk_stats.sql).
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
const COIN_VIEWS=20; // 1 монета за столько просмотров
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
const fmtN=n=>Number(n||0).toLocaleString('ru-RU');
const pluralR=n=>{const a=n%10,b=n%100;return a===1&&b!==11?'ответ':(a>=2&&a<=4&&(b<12||b>14))?'ответа':'ответов'};
const hue=s=>{let h=0;for(const ch of String(s||'?'))h=(h*31+ch.charCodeAt(0))%360;return h};

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
.fm-hb{display:flex;gap:10px;flex-wrap:wrap}
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

/* сетка Flashes: без белой подложки, подпись внутри кадра внизу */
.fm-g{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:14px}
.fm-c{border-radius:16px;overflow:hidden;cursor:pointer;background:none;box-shadow:none;content-visibility:auto;contain-intrinsic-size:auto 240px;-webkit-tap-highlight-color:transparent}
.fm-th{position:relative;aspect-ratio:9/16;background:#e4edf3 center top/cover no-repeat;overflow:hidden}
.fm-du{position:absolute;right:8px;top:8px;background:rgba(20,40,60,.7);color:#fff;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}
.fm-nw{position:absolute;left:8px;top:8px;background:#fff4e0;color:#c9730f;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:600}
.fm-ov{position:absolute;left:0;right:0;bottom:0;padding:34px 10px 9px;color:#fff;background:linear-gradient(to top,rgba(0,0,0,.6),rgba(0,0,0,.3) 55%,rgba(0,0,0,0));text-shadow:0 1px 3px rgba(0,0,0,.6)}
.fm-ov b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:13px;font-weight:700;line-height:1.25}
.fm-ov small{display:block;margin-top:3px;font-size:11px;opacity:.92;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fm-tg{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.fm-tg span{background:var(--pl);color:var(--bt);border-radius:10px;padding:2px 9px;font-size:11px;font-weight:600;cursor:pointer}
.fm-ds{font-size:14px;line-height:1.6;color:#566170;margin-top:12px}
.fm-tabs{display:flex;gap:10px;margin-top:14px}
.fm-tabs button{height:36px;padding:0 18px;border-radius:12px;background:#fff;color:#566170;font-weight:600;font-size:14px}
.fm-tabs button.on{background:#34404e;color:#fff}

/* нижняя панель */
.fm-nav{position:fixed;left:0;right:0;bottom:0;height:calc(56px + env(safe-area-inset-bottom,0px));padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box;z-index:1000;display:flex;justify-content:center;background:#fff;border-top:1px solid #e3e8ee}
.fm-nav button{flex:1;max-width:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#566170;font-size:11px;font-weight:600}
.fm-nav svg{width:24px;height:24px}
.fm-nav button.on{color:var(--cy)}
body.menu .fm-nav{display:none}

/* лента Flashes */
#fm-feed{position:fixed;left:0;right:0;top:0;bottom:calc(56px + env(safe-area-inset-bottom,0px));z-index:998;background:#0a0e14}
#fm-feed[hidden]{display:none}
.fm-fe{height:100%;display:grid;place-items:center;color:#fff;text-align:center;padding:24px;font-weight:600}
.fm-sc{position:relative;height:100%;overflow-y:auto;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none}
.fm-sc::-webkit-scrollbar{display:none}
.fm-it{height:100%;box-sizing:border-box;padding:6px 0;scroll-snap-align:start;scroll-snap-stop:always;display:flex;align-items:center;justify-content:center}
.fm-pv{position:relative;height:100%;aspect-ratio:9/16;max-width:100%;border-radius:20px;overflow:hidden;background:#000}
.fm-pv video{width:100%;height:100%;object-fit:cover;object-position:top;display:block;cursor:pointer}
/* мягкое затемнение только снизу и на всю ширину: без резкого края справа, белые видео не грязнятся */
.fm-pv::after{content:"";position:absolute;left:0;right:0;bottom:0;height:44%;pointer-events:none;z-index:1;background:linear-gradient(to top,rgba(0,0,0,.5) 0%,rgba(0,0,0,.4) 22%,rgba(0,0,0,.22) 50%,rgba(0,0,0,.08) 78%,rgba(0,0,0,0) 100%)}
@media(max-width:640px){.fm-it{padding:0}.fm-pv{border-radius:0}}
.fm-pe{position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;color:#fff;font-weight:600;background:rgba(0,0,0,.7);z-index:1}
.fm-pe[hidden]{display:none}
.fm-own{position:absolute;top:10px;left:10px;z-index:3;display:flex;gap:8px}
.fm-own .fm-btn{height:34px;padding:0 14px;font-size:13px;background:rgba(0,0,0,.45);color:#fff;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.fm-own .fm-btn.r{background:#e5314a}
.fm-bt{position:absolute;left:0;right:64px;bottom:0;padding:20px 14px 16px;color:#fff;z-index:2;text-shadow:0 1px 3px rgba(0,0,0,.75),0 0 8px rgba(0,0,0,.35)}
.fm-au{display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px}
.fm-an{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fm-ab{position:relative;flex:none;width:36px;height:36px;text-shadow:none}
.fm-aa{display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background-size:cover;background-position:center;color:#fff;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 0 0 1.5px rgba(255,255,255,.9),0 1px 6px rgba(0,0,0,.45)}
.fm-plus{position:absolute;right:-5px;bottom:-5px;width:20px;height:20px;box-sizing:border-box;border-radius:50%;background:var(--cy);border:2px solid #fff;cursor:pointer;font-size:0;box-shadow:0 1px 4px rgba(0,0,0,.4)}
.fm-plus::before,.fm-plus::after{content:"";position:absolute;left:50%;top:50%;background:#fff;border-radius:1px;transform:translate(-50%,-50%)}
.fm-plus::before{width:8px;height:2px}
.fm-plus::after{width:2px;height:8px}
.fm-tt{display:block;margin-top:8px;font-size:14px;font-weight:600;cursor:pointer}
.fm-bt .fm-tg span{background:none;color:#fff;padding:0;margin-right:4px}
.fm-side{position:absolute;right:8px;bottom:80px;display:flex;flex-direction:column;gap:18px;align-items:center;color:#fff;z-index:2;font-size:12px;font-weight:600;text-align:center;text-shadow:0 1px 3px rgba(0,0,0,.75),0 0 8px rgba(0,0,0,.4)}
.fm-lk{display:flex;flex-direction:column;align-items:center;gap:4px;color:#fff}
.fm-lk svg{width:30px;height:30px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.65)) drop-shadow(0 0 5px rgba(0,0,0,.4))}
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

/* статистика */
#fm-stats{padding-top:6px}
.fm-sh{display:flex;align-items:center;gap:12px;margin:12px 0 4px}
.fm-sh h1{flex:1;min-width:0;font-size:26px;font-weight:800;color:#34404e;overflow-wrap:anywhere}
.fm-sp{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
.fm-sp button{height:34px;padding:0 14px;border-radius:17px;background:#fff;color:#566170;font-weight:600;font-size:13px}
.fm-sp button.on{background:#34404e;color:#fff}
.fm-kp{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.fm-k{background:#fff;border-radius:18px;padding:14px;box-shadow:0 6px 30px rgba(0,0,0,.04)}
.fm-k b{display:block;font-size:22px;font-weight:800;color:#34404e}
.fm-k small{color:var(--mu);font-size:12px}
.fm-box{background:#fff;border-radius:22px;padding:16px;margin-top:14px;box-shadow:0 6px 30px rgba(0,0,0,.04)}
.fm-box h3{font-size:16px;font-weight:800;margin:0 0 6px;color:#34404e}
.fm-box .fm-ds{margin:0 0 10px;font-size:13px}
.fm-hl{font-size:15px;color:#34404e;line-height:1.5}
.fm-hl b{color:#e5314a}
.fm-cv{display:block;width:100%;height:130px;overflow:visible}
.fm-cv polyline{fill:none;stroke:var(--cy);stroke-width:2.5;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.fm-cv polygon{fill:rgba(63,195,238,.16)}
.fm-cv line{vector-effect:non-scaling-stroke}
.fm-bl{display:flex;justify-content:space-between;color:var(--mu);font-size:11.5px;margin-top:6px;gap:8px}
.fm-bs{display:flex;align-items:flex-end;gap:3px;height:120px}
.fm-b1{flex:1;min-width:4px;height:100%;display:flex;align-items:flex-end}
.fm-b1 i{display:block;width:100%;background:#9fdcf3;border-radius:4px 4px 0 0}
.fm-b1.top i{background:var(--cy)}
.fm-bt3{margin-top:12px;display:grid;gap:6px;font-size:13px;color:#566170}
.fm-bt3 b{color:#34404e}
.fm-ir{display:flex;align-items:center;gap:10px;width:100%;padding:12px 0;text-align:left;color:#34404e;border-top:1px solid #eef1f4}
.fm-ir:first-of-type{border-top:0}
.fm-iq{flex:1;min-width:0}
.fm-iq b{display:block;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fm-iq small{display:block;color:var(--mu);font-size:12px;margin-top:3px}

@media(max-width:900px){.fm-g{grid-template-columns:repeat(4,1fr)}}
@media(max-width:640px){
  .fm-hero{padding:20px;border-radius:22px}.fm-hero h1{font-size:26px}
  .fm-panel{padding:16px;border-radius:20px}
  .fm-g{grid-template-columns:repeat(3,1fr);gap:6px}
  .fm-c{border-radius:12px}
  .fm-ov{padding:22px 6px 6px}
  .fm-ov b{font-size:11px;line-height:1.2}
  .fm-ov small{font-size:9.5px;margin-top:2px}
  .fm-du{right:5px;top:5px;font-size:9px;padding:1px 6px}
  .fm-nw{left:5px;top:5px;font-size:8.5px;padding:1px 6px}
  .fm-hc{width:112px}
  .fm-ho{padding:28px 7px 7px}.fm-ho b{font-size:11.5px}.fm-ho small{font-size:10px}
  .fm-kp{grid-template-columns:repeat(2,1fr)}
  .fm-sh h1{font-size:21px}
}`;
document.head.appendChild(st);

const sec=document.createElement('section');
sec.id='v-fm';sec.hidden=true;
document.querySelector('.main').appendChild(sec);

/* ---------- состояние и связь с Supabase ---------- */
let list=[],q='',hq='',uid=null,loadErr=false,loaded=false,msgT=null;
let tab='all',view='home',io=null;
let openId=null,cms=[],cmFor=null,cmMode='c',cmParent=null,cmNew=true,myVotes={};
let stP='week',stF=null,stTk=0,feedTk=0,cur=null,sgP=null;
const extra={},ccount={},seen=new Set(),likedSet=new Set();
const profMap={},followSet=new Set(),fKnown=new Set();
const sg={w:{},l:likedSet,c:new Set()};
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
  view='home';openId=null;cmFor=null;cmMode='c';cmParent=null;cur=null;
  if(io){io.disconnect();io=null}
  sec.innerHTML=`<div id="fm-home"><div class="fm-hero"><div><small>${window.MS?MS.ic('fresh'):''}Видео</small><h1>Fresh</h1>
    <p>Короткие вертикальные видео: до ${LIM.maxSec} секунд, качество до ${LIM.maxSide}p. Квадратные тоже подходят.</p></div>
    <div class="fm-hb"><button class="sw" id="fm-new">Загрузить Flash</button><button class="sw" id="fm-stbtn">Статистика</button></div></div>
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
    <div id="fm-stats" hidden></div>
    <nav class="fm-nav"><button data-nav="home" class="on">${IC.home}Главная</button><button data-nav="feed">${IC.bolt}Flashes</button><button data-nav="hist">${IC.hist}История</button></nav>`;
  const fe=$('#fm-feed');
  fe.addEventListener('error',ev=>{
    if(ev.target.tagName==='VIDEO'){const pe=ev.target.parentNode.querySelector('.fm-pe');if(pe)pe.hidden=false}
  },true);
  /* до какой секунды человек досмотрел текущий Flash */
  fe.addEventListener('timeupdate',ev=>{
    const v=ev.target;if(!cur||v.tagName!=='VIDEO')return;
    const it=v.closest('.fm-it');
    if(it&&it.dataset.id===cur.id&&v.currentTime>cur.max)cur.max=v.currentTime;
  },true);
  initUpload();
}

function setView(v,startId){
  if(!$('#fm-home'))return;
  if(view==='feed'&&v!=='feed')flush();
  view=v;
  $('#fm-home').hidden=v!=='home';
  $('#fm-feed').hidden=v!=='feed';
  $('#fm-hist').hidden=v!=='hist';
  $('#fm-stats').hidden=v!=='stats';
  sec.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('on',b.dataset.nav===v));
  if(v!=='feed'){
    if(io){io.disconnect();io=null}
    $('#fm-feed').innerHTML='';openId=null;cmFor=null;
  }
  if(v==='feed'){sgP=null;buildFeed(startId)}
  if(v==='hist')renderHist();
  if(v==='home')paint();
  if(v==='stats')renderStats();
  window.scrollTo(0,0);
}

const bg=c=>COVER_OK.test(c||'')?` style="background-image:url('${c}')"`:'';
const card=x=>`<div class="fm-c" data-o="${esc(x.id)}"><div class="fm-th"${bg(x.cover)}>${fresh(x)?'<span class="fm-nw">Обработка</span>':''}<span class="fm-du">${mmss(x.dur)}</span>
  <div class="fm-ov"><b>${esc(x.title)}</b><small>${esc(x.author)} · ${vw(x.views)} просм.</small></div></div></div>`;

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
      await new Promise(ok=>setTimeout(ok,250));
      if(tk!==loadTk)return;
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
  const add=rows.filter(x=>URL_OK.test(x.url||'')&&!have.has(String(x.id)));
  add.forEach(x=>{
    sc.insertAdjacentHTML('beforeend',item(x));
    io.observe(sc.lastElementChild);
  });
  if(add.length)loadAuthors(add);
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

/* ---------- автор: аватарка и плюсик подписки ---------- */
const canFollow=id=>!!(uid&&id&&id!==uid&&fKnown.has(id)&&!followSet.has(id));
const avInner=(id,nm)=>{
  const p=profMap[id]||{},url=p.avatar_url;
  const s=`background-color:hsl(${hue(nm)},55%,48%);`+(url?`background-image:url('${esc(url)}')`:'');
  return `<span class="fm-aa" data-prof="${esc(id)}" style="${s}">${url?'':esc(String(nm||'?').trim().charAt(0).toUpperCase())}</span>`
    +(canFollow(id)?`<b class="fm-plus" data-fol="${esc(id)}">+</b>`:'');
};
function paintAuthor(id){
  sec.querySelectorAll('.fm-ab').forEach(e=>{if(e.dataset.au===id)e.innerHTML=avInner(id,e.dataset.nm)});
}
async function loadAuthors(rows){
  const S=await ready();if(!S)return;
  if(!uid){try{const u=await S.auth.getUser();uid=u.data&&u.data.user?u.data.user.id:null}catch(e){}}
  const ids=[...new Set(rows.map(x=>x.user_id).filter(Boolean).map(String))];
  const need=ids.filter(i=>!(i in profMap));
  const ch=a=>{const o=[];for(let i=0;i<a.length;i+=80)o.push(a.slice(i,i+80));return o};
  try{
    await Promise.all(ch(need).map(async c=>{
      const r=await S.from('profiles').select('id,avatar_url').in('id',c);
      (r.data||[]).forEach(p=>{profMap[String(p.id)]=p});
      c.forEach(i=>{if(!(i in profMap))profMap[i]={}});
    }));
    if(uid){
      await Promise.all(ch(ids).map(async c=>{
        const r=await S.from('follows').select('followee').eq('follower',uid).in('followee',c);
        if(r.error)return;
        (r.data||[]).forEach(o=>followSet.add(String(o.followee)));
        c.forEach(i=>fKnown.add(i));
      }));
    }
  }catch(e){}
  ids.forEach(paintAuthor);
}

/* ---------- рекомендации: что смотрел, где держал внимание, лайки, комментарии ---------- */
function loadSig(){
  if(sgP)return sgP;
  return sgP=(async()=>{
    const S=await ready();if(!S)return;
    if(!uid){try{const u=await S.auth.getUser();uid=u.data&&u.data.user?u.data.user.id:null}catch(e){}}
    if(!uid)return;
    try{
      const [a,b,c]=await Promise.all([
        S.from('flash_watch').select('flash_id,sec,dur').eq('user_id',uid).order('created_at',{ascending:false}).limit(400),
        S.from('flash_likes').select('flash_id').eq('user_id',uid).limit(500),
        S.from('flash_comments').select('flash_id').eq('user_id',uid).limit(300)]);
      (a.data||[]).forEach(o=>{
        const id=String(o.flash_id),f=o.dur>0?Math.min(1,o.sec/o.dur):0;
        sg.w[id]=Math.max(sg.w[id]||0,f);
      });
      (b.data||[]).forEach(o=>likedSet.add(String(o.flash_id)));
      (c.data||[]).forEach(o=>sg.c.add(String(o.flash_id)));
    }catch(e){}
  })();
}
function rank(items){
  const tg={},au={};
  const add=(x,w)=>{
    (x.tags||[]).forEach(t=>{tg[t]=(tg[t]||0)+w});
    if(x.user_id)au[x.user_id]=(au[x.user_id]||0)+w;
  };
  Object.keys(sg.w).forEach(id=>{
    const x=byId(id);if(!x)return;
    const f=sg.w[id];
    add(x,f>=.8?2:f>=.4?1:f<.15?-1:0);   /* досмотрел: плюс, бросил сразу: минус */
  });
  likedSet.forEach(id=>{const x=byId(id);if(x)add(x,3)});
  sg.c.forEach(id=>{const x=byId(id);if(x)add(x,4)});
  const now=Date.now();
  return items.map(x=>{
    const id=String(x.id),w=sg.w[id];
    let s=0;
    (x.tags||[]).forEach(t=>{s+=Math.max(-3,Math.min(6,tg[t]||0))*.6});
    s+=Math.max(-3,Math.min(8,au[x.user_id]||0))*.8;
    s+=Math.log10((x.views||0)+10)*.8+Math.log10((x.likes||0)+1)*.6;
    s+=Math.max(0,3-(now-new Date(x.created_at))/864e5/3)*.5;
    if(w!=null)s-=3+w*2;                  /* уже смотрел: ниже в ленте */
    if(likedSet.has(id))s-=1;
    s+=Math.random()*1.2;
    return {x,s};
  }).sort((a,b)=>b.s-a.s).map(a=>a.x);
}

/* ---------- запись просмотра для статистики ---------- */
function startCur(id){
  const x=byId(id);
  cur={id:String(id),sid:Math.random().toString(36).slice(2)+Date.now().toString(36),max:0,t0:Date.now(),sent:-1,dur:x&&+x.dur?+x.dur:0};
}
function sendCur(c){
  if(!c||Date.now()-c.t0<800)return;
  const sec=Math.round(c.max*10)/10;
  if(sec===c.sent)return;
  c.sent=sec;
  ready().then(S=>S&&S.rpc('flash_watch_log',{p_fid:c.id,p_s:sec,p_sid:c.sid})).catch(()=>{});
}
function flush(){
  const c=cur;if(!c)return;
  cur=null;
  if(Date.now()-c.t0<800)return;
  sendCur(c);
  if(c.dur)sg.w[c.id]=Math.max(sg.w[c.id]||0,Math.min(1,c.max/c.dur));
}
setInterval(()=>{if(cur)sendCur(cur)},5000);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&cur)sendCur(cur)});
window.addEventListener('pagehide',()=>{if(cur)sendCur(cur)});

/* ---------- лента Flashes ---------- */
const item=x=>{
  const mine=uid&&x.user_id===uid,id=esc(x.id),au=x.user_id?String(x.user_id):'';
  const abv=au?`<span class="fm-ab" data-au="${esc(au)}" data-nm="${esc(x.author)}">${avInner(au,x.author)}</span>`:'';
  return `<div class="fm-it" data-id="${id}"><div class="fm-pv"><video data-src="${esc(x.url)}" preload="none" loop playsinline></video>
  <div class="fm-pe" hidden>Видео ещё обрабатывается. Подожди минуту-две и открой снова.</div>
  ${mine?'<div class="fm-own"><button class="fm-btn g" data-fst>Статистика</button><button class="fm-btn g" data-del>Удалить</button></div>':''}
  <div class="fm-side"><button class="fm-lk${likedSet.has(String(x.id))?' on':''}" data-like>${IC.like}<span data-ln="${id}">${x.likes||0}</span></button>
  <button class="fm-lk" data-cm>${IC.cm}<span data-cn="${id}">${ccount[x.id]||0}</span></button>
  <div data-vn="${id}">${x.views||0} просм.</div></div>
  <div class="fm-bt"><div class="fm-au"><span class="fm-an">${esc(x.author)}</span>${abv}</div><b class="fm-tt" data-info>${esc(x.title)}</b>
  ${(x.tags||[]).length?`<div class="fm-tg">${x.tags.map(t=>`<span data-tag="${esc(t)}">#${esc(t)}</span>`).join('')}</div>`:''}</div></div></div>`;
};

async function buildFeed(startId){
  const fe=$('#fm-feed');if(!fe)return;
  const tk=++feedTk;
  flush();
  if(io){io.disconnect();io=null}
  openId=null;cmFor=null;
  if(!$('#fm-sc'))fe.innerHTML='<div class="fm-fe">Загружаем…</div>';
  await Promise.race([loadSig(),new Promise(ok=>setTimeout(ok,1200))]);
  if(tk!==feedTk||view!=='feed'||!$('#fm-feed'))return;
  const items=rank(list.filter(x=>URL_OK.test(x.url||'')));
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
  loadAuthors(items);
}

const loadVid=v=>{if(!v.getAttribute('src'))v.src=v.dataset.src};
function activate(it){
  const id=it.dataset.id,v=it.querySelector('video'),x=byId(id);
  if(openId!==id){flush();startCur(id);openId=id;closePanel()}
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
  const s=String(n||'?').trim()||'?';
  return `<span class="fm-av" style="background:hsl(${hue(s)},55%,48%)">${esc(s.charAt(0).toUpperCase())}</span>`;
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

/* ---------- статистика автора ---------- */
const MON=['янв','фев','мар','апр','мая','июн','июл','авг','сен','окт','ноя','дек'];
const bkOf=p=>p==='week'||p==='month'?'day':p==='quarter'?'week':'month';
const bLabel=(t,bk)=>{
  const d=new Date(t+'T00:00:00');if(isNaN(d))return t;
  if(bk==='month')return d.toLocaleDateString('ru-RU',{month:'long',year:'numeric'}).replace(' г.','');
  const s=d.getDate()+' '+MON[d.getMonth()];
  return bk==='week'?'неделя с '+s:s;
};
function openStats(fid){
  stF=fid==null?null:String(fid);
  setView('stats');
}
function barsHtml(tl,bk){
  if(!tl||!tl.length)return '<div class="fr">Пока нет данных за этот период.</div>';
  const mx=Math.max(...tl.map(o=>o.v))||1,bi=tl.findIndex(o=>o.v===mx);
  const best={month:'Лучший месяц',week:'Лучшая неделя',day:'Лучший день'}[bk];
  const top=tl.slice().sort((a,b)=>b.v-a.v).slice(0,3);
  return `<div class="fm-bs">${tl.map((o,i)=>`<div class="fm-b1${i===bi?' top':''}" title="${esc(bLabel(o.t,bk))}: ${o.v}"><i style="height:${Math.max(3,Math.round(o.v/mx*100))}%"></i></div>`).join('')}</div>
  <div class="fm-bl"><span>${esc(bLabel(tl[0].t,bk))}</span><span>${esc(bLabel(tl[tl.length-1].t,bk))}</span></div>
  <div class="fm-bt3"><div>${best}: <b>${esc(bLabel(tl[bi].t,bk))}</b></div>${top.map((o,i)=>`<div>${i+1}. ${esc(bLabel(o.t,bk))}: ${fmtN(o.v)} просм., ≈ ${fmtN(Math.floor(o.v/COIN_VIEWS))} мон.</div>`).join('')}</div>`;
}
function curveHtml(cv,single,dropS){
  const pts=(cv||[]).filter(o=>o.p!=null);
  if(pts.length<2)return '<div class="fr">Пока мало данных.</div>';
  const W=300,H=110,n=pts.length-1;
  const X=i=>Math.round(i/n*W*10)/10,Y=p=>Math.round((H-p/100*H)*10)/10;
  const line=pts.map((o,i)=>X(i)+','+Y(o.p)).join(' ');
  let mark='';
  if(single&&dropS!=null){
    const idx=pts.findIndex(o=>o.s===dropS);
    if(idx>=0)mark=`<line x1="${X(idx)}" x2="${X(idx)}" y1="0" y2="${H}" stroke="#e5314a" stroke-width="1.5" stroke-dasharray="4 3"/>`;
  }
  const last=pts[pts.length-1].s;
  return `<svg class="fm-cv" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><polygon points="0,${H} ${line} ${W},${H}"/><polyline points="${line}"/>${mark}</svg>
  <div class="fm-bl"><span>${single?'0 с':'начало'}</span><span>${single?last+' с':'конец видео'}</span></div>`;
}
async function renderStats(){
  const box=$('#fm-stats');if(!box)return;
  const tk=++stTk,single=stF!=null,x=single?byId(stF):null;
  const pers=[['week','Неделя'],['month','Месяц'],['quarter','3 месяца'],['year','Год'],['all','Всё время']];
  box.innerHTML=`<div class="fm-sh"><button class="fm-btn g" data-sback>← Назад</button><h1>${single?esc(x?x.title:'Flash'):'Статистика'}</h1></div>
  <div class="fm-sp">${pers.map(p=>`<button data-sp="${p[0]}" class="${stP===p[0]?'on':''}">${p[1]}</button>`).join('')}</div>
  <div id="fm-sb"><div class="fr">Загружаем…</div></div>`;
  const S=await ready();if(tk!==stTk)return;
  const sb=$('#fm-sb');if(!sb)return;
  if(!S){sb.innerHTML='<div class="fr">Нет связи с сервером. Обнови страницу.</div>';return}
  let r;
  try{r=await S.rpc('flash_stats',{p_fid:single?String(stF):null,p_per:stP})}catch(e){r={error:e}}
  if(tk!==stTk)return;
  if(r.error){
    sb.innerHTML='<div class="fr">'+(/flash_stats|function|schema cache|flash_watch/i.test(String(r.error.message||r.error))?'Сначала выполни SQL для статистики в Supabase.':'Не удалось загрузить статистику. Попробуй ещё раз.')+'</div>';
    return;
  }
  const d=r.data;
  if(!d||d.error==='login'){sb.innerHTML='<div class="fr">Войди в аккаунт, чтобы видеть статистику.</div>';return}
  const bk=bkOf(stP);
  const cards=[['Просмотры',fmtN(d.views)],['Монеты ≈',fmtN(Math.floor((d.views||0)/COIN_VIEWS))],['Удержание',d.avg_pct+'%'],['Досмотрели',d.done+'%'],['Ср. время',d.avg_sec+' с'],['Лайки (всего)',fmtN(d.likes)],['Комментарии',fmtN(d.comments)]];
  let h=`<div class="fm-kp">${cards.map(c=>`<div class="fm-k"><b>${c[1]}</b><small>${c[0]}</small></div>`).join('')}</div>`;
  if(!d.views){
    h+='<div class="fm-box"><div class="fr">За этот период просмотров пока нет. Статистика считается чужими просмотрами и копится с момента подключения.</div></div>';
  }else{
    if(single&&d.drop_s!=null)h+=`<div class="fm-box fm-hl">Чаще всего зрители уходят на <b>${d.drop_s}-й секунде</b> (${d.drop_p}% просмотров)</div>`;
    h+=`<div class="fm-box"><h3>Удержание</h3><p class="fm-ds">${single?'Сколько зрителей ещё смотрит на каждой секунде. Красная линия: самый частый момент ухода.':'Сколько зрителей доходит до каждой части видео, в среднем по всем Flash.'}</p>${curveHtml(d.curve,single,d.drop_s)}</div>`;
    h+=`<div class="fm-box"><h3>Просмотры по времени</h3>${barsHtml(d.timeline,bk)}</div>`;
  }
  if(!single&&d.items&&d.items.length){
    h+=`<div class="fm-box"><h3>Каждый Flash</h3>${d.items.map(o=>`<button class="fm-ir" data-sf="${esc(o.id)}"><span class="fm-iq"><b>${esc(o.title)}</b><small>${fmtN(o.views)} просм. · удержание ${o.pct}% · ${o.drop_s!=null?'уходят на '+o.drop_s+' с':'уходов пока нет'}</small></span><span>›</span></button>`).join('')}</div>`;
  }
  h+=`<div class="fm-info">Монеты: 1 за каждые ${COIN_VIEWS} просмотров. Свои просмотры не считаются.</div>`;
  sb.innerHTML=h;
}

/* ---------- клики ---------- */
sec.addEventListener('click',async e=>{
  const t=e.target;
  const nv=t.closest('[data-nav]');
  if(nv)return setView(nv.dataset.nav);
  if(t.closest('#fm-stbtn'))return openStats(null);
  const fst=t.closest('[data-fst]');
  if(fst){const it=fst.closest('.fm-it');if(it)openStats(it.dataset.id);return}
  if(t.closest('[data-sback]')){if(stF!=null){stF=null;return renderStats()}return setView('home')}
  const sp=t.closest('[data-sp]');
  if(sp){stP=sp.dataset.sp;return renderStats()}
  const sf=t.closest('[data-sf]');
  if(sf){stF=sf.dataset.sf;return renderStats()}
  const tg=t.closest('[data-tag]');
  if(tg){q='#'+tg.dataset.tag;setView('home');const i=$('#fm-q');if(i)i.value=q;return paint()}
  const fol=t.closest('[data-fol]');
  if(fol){
    const id=fol.dataset.fol;if(!id)return;
    followSet.add(id);paintAuthor(id);
    const S=await ready();let ok=false;
    if(S){const r=await S.from('follows').insert({followee:id});ok=!r.error||r.error.code==='23505'}
    if(!ok){followSet.delete(id);paintAuthor(id)}
    return;
  }
  const pf=t.closest('[data-prof]');
  if(pf){
    const id=pf.dataset.prof;
    if(window.MS&&window.PF){MS.show('prof');setTimeout(()=>window.PF.open(id),80)}
    return;
  }
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

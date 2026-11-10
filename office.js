/* MilkOffice: вкладки Главная / Финансы / Команда / Бизнесы (модераторам) / Вакансии / Студия / Инструменты (всем) */
(function(){
/* Размер панели Милки. 0 = определить само. Если будет зазор или наезд, впиши числа в пикселях:
   PANEL_W: ширина боковой панели (компьютер), PANEL_H: высота верхней панели (телефон) */
const PANEL_W=0,PANEL_H=0;

const st=document.createElement('style');
st.textContent=`
.of-tabs{display:flex;gap:8px;margin:14px 0;overflow-x:auto;scrollbar-width:none}
.of-tabs button{display:flex;gap:8px;align-items:center;height:42px;padding:0 16px;border-radius:14px;background:var(--card);border:1px solid var(--ln);color:var(--mu);font-weight:700;white-space:nowrap;cursor:pointer}
.of-tabs button.on{background:rgba(185,166,232,.16);color:var(--lav);border-color:rgba(185,166,232,.4)}
.of-tabs svg,.of-i svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.of-m{font-size:13px;font-weight:600;color:var(--ok);margin:0 0 10px}.of-m:empty{display:none}.of-m.e{color:var(--rose)}
.ofp{background:var(--card);border:1px solid var(--ln);color:var(--tx);border-radius:20px;padding:18px;box-shadow:0 6px 30px rgba(0,0,0,.35);margin-bottom:14px}
.ofp h3{font-size:17px;font-weight:800;margin:0 0 10px}
.ofp small{display:block;color:var(--mu);font-size:12px}
.ofp.of-wn{background:rgba(243,166,189,.12);border-color:rgba(243,166,189,.35);color:var(--rose);font-weight:600;font-size:13.5px;line-height:1.5}
.of-p{font-size:14px;line-height:1.5;color:#b8c0dc;margin:0}
.of-em{text-align:center;color:var(--mu);padding:22px 0}
.of-g{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
@media(max-width:700px){.of-g{grid-template-columns:1fr 1fr}}
.of-g .ofp{margin:0}.of-g b{display:block;font-size:22px;font-weight:800;margin-top:4px}
.up{color:var(--ok)}.dn{color:var(--rose)}
.of-ch{display:flex;gap:6px;align-items:flex-end;height:80px}
.of-ch i{flex:1;background:var(--ok);border-radius:4px 4px 0 0}.of-ch i.n{background:var(--rose)}
.of-r{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid var(--ln);font-size:14px}
.of-r:first-of-type{border-top:0}
.of-r>span{min-width:0;overflow-wrap:anywhere}
.of-r small{display:block}
.of-in,.ofp select,.ofp textarea{width:100%;border:1px solid var(--ln);border-radius:12px;padding:11px;font:inherit;outline:0;background:rgba(255,255,255,.05);color:var(--tx);margin:6px 0}
.ofp select option{background:#121a33;color:#e8ecf8}
.ofp textarea{height:70px;resize:none}
.of-bt{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
.of-bt button{height:38px;padding:0 16px;border-radius:12px;border:0;font-weight:700;cursor:pointer;background:var(--grad);color:#fff}
.of-bt button.g{background:rgba(255,255,255,.08);color:#b8c0dc}.of-bt button.r{background:#e5314a}
.of-tag{display:inline-block;background:rgba(79,124,255,.16);color:var(--bt);border-radius:10px;padding:2px 9px;font-size:11px;font-weight:700;margin-right:6px}
.of-tag.w{background:rgba(243,166,189,.16);color:var(--rose)}
.ofg{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:14px}@media(max-width:700px){.ofg{grid-template-columns:1fr}}
.ofc{background:var(--card);border:1px solid var(--ln);backdrop-filter:blur(10px);border-radius:20px;box-shadow:0 6px 30px rgba(0,0,0,.35);overflow:hidden;text-align:center;padding-bottom:18px}
.ofc .ban{height:150px;font-size:60px;display:grid;place-items:center}.ofc h3{font-size:18px;font-weight:700;margin:14px 8px 4px}.ofc p{font-size:12px;color:var(--mu);margin:0 14px 14px;line-height:1.5}
.of-fs{position:fixed;z-index:5;background:var(--bg)}
.of-fs iframe{display:block;width:100%;height:100%;border:0;background:#fff}
.obh{background:var(--card);border:1px solid var(--ln);border-radius:24px;box-shadow:0 6px 30px rgba(0,0,0,.35);overflow:hidden;margin-bottom:14px}
.obh-cv{height:170px;background:linear-gradient(120deg,#8fd3f0,#a99bf0) center/cover no-repeat}
.obh-bd{display:flex;gap:20px;align-items:flex-start;padding:0 24px 22px;flex-wrap:wrap}
.obh-av{flex:none;width:120px;height:120px;border-radius:50%;margin-top:-52px;border:6px solid var(--s2);display:grid;place-items:center;color:#fff;font-size:40px;font-weight:700;background-size:cover;background-position:center;box-shadow:0 0 0 3px rgba(185,166,232,.3)}
.obh-w{flex:1 1 240px;min-width:0;padding-top:14px}
.obh-w h2{font-size:24px;font-weight:800;line-height:1.2;margin:0;overflow-wrap:anywhere}
.obh-nk{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:6px;color:var(--mu);font-size:13px}
.obh-w .of-bt{margin-top:12px}
.obh-w .of-bt button.g{height:34px;padding:0 13px;font-size:12.5px}
.obh-ss{display:flex;gap:22px;margin-top:10px}
.obh-ss b{display:block;font-size:19px;font-weight:800}.obh-ss small{display:block;font-size:11.5px;color:var(--mu)}
#v-office [hidden]{display:none!important}
.obt{display:flex;margin:4px 0 14px}
.obt button{padding:6px 26px;font-size:17px;font-weight:700;color:var(--mu);background:transparent;border:0;border-left:1px solid var(--ln);cursor:pointer}
.obt button:first-child{border-left:0}.obt button.on{color:var(--lav)}
.obp-h{display:flex;gap:12px;align-items:center;margin-bottom:10px}
.obp-a{width:44px;height:44px;border-radius:50%;flex:none;display:grid;place-items:center;color:#fff;font-weight:700;background-size:cover;background-position:center}
.obp-h small{color:var(--mu);font-size:12px}
.obp p{line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;margin:0}
.obp img.pi{display:block;max-width:100%;border-radius:14px;margin-top:10px}
.obp-ac{display:flex;gap:10px;margin-top:12px}
.obp-ac button{display:flex;gap:7px;align-items:center;height:38px;padding:0 14px;border-radius:12px;background:rgba(255,255,255,.06);color:var(--mu);font-weight:700;border:0;cursor:pointer}
.obp-ac button.on{color:#f45b97;background:rgba(243,166,189,.14)}
.obp-ac svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.obp-pv{display:flex;gap:12px;align-items:center;margin-top:10px}
.obp-pv img{width:64px;height:64px;border-radius:12px;object-fit:cover}
.obp-pv button{height:34px;padding:0 14px;border-radius:12px;border:0;background:rgba(255,255,255,.08);color:#b8c0dc;font-weight:700;cursor:pointer}
.obf{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
@media(max-width:700px){.obf{grid-template-columns:repeat(2,1fr)}}
.obf-i{position:relative;aspect-ratio:9/16;border-radius:18px;overflow:hidden;background:#222 center/cover;border:0;padding:0;cursor:pointer}
.obf-i span{position:absolute;left:0;right:0;bottom:0;padding:26px 10px 10px;color:#fff;font-size:12.5px;font-weight:600;text-align:left;background:linear-gradient(transparent,rgba(0,0,0,.65));overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.ofl{display:inline-flex;align-items:center;height:38px;padding:0 16px;border-radius:12px;background:rgba(255,255,255,.08);color:#b8c0dc;font-weight:700;cursor:pointer;margin:6px 0}
.ou-rules{display:block;margin-bottom:8px}
.ou-row{display:flex;gap:18px;flex-wrap:wrap;margin-top:8px}
.ou-cv{flex:none;width:110px;aspect-ratio:9/16;border-radius:14px;background:#1a2342 center top/cover}
.ou-f{flex:1;min-width:220px}.ou-f input[type=range]{width:100%;margin:6px 0}
.ofs{display:grid;grid-template-columns:3fr 2fr;gap:14px;margin-bottom:14px}
@media(max-width:700px){.ofs{grid-template-columns:1fr}}
.ofs-c{display:flex;flex-direction:column;justify-content:flex-end;gap:6px;text-align:left;min-height:120px;padding:20px;border-radius:22px;border:0;cursor:pointer;background:var(--card);border:1px solid var(--ln);color:var(--tx);box-shadow:0 6px 30px rgba(0,0,0,.35)}
.ofs-c.big{min-height:170px;background:linear-gradient(135deg,rgba(79,124,255,.3),rgba(185,166,232,.24) 55%,rgba(243,166,189,.2))}
.ofs-c h3{font-size:20px;font-weight:800;margin:0;overflow-wrap:anywhere}
.ofs-c.big h3{font-size:24px}
.ofs-c span{font-size:13px;color:var(--mu)}
.ofs-c em{font-style:normal;font-size:12.5px;font-weight:700;color:var(--ok)}
.of-bar{display:flex;gap:3px;align-items:flex-end;height:96px;margin-top:8px}
.of-bar i{flex:1;min-width:2px;border-radius:3px 3px 0 0;background:var(--cy)}
.of-bar i.l{background:var(--rose)}.of-bar i.c{background:var(--lav)}
.of-bl{display:flex;justify-content:space-between;font-size:11px;color:var(--mu);margin-top:4px}
.of-pk{font-size:13px;color:#b8c0dc;margin:2px 0 4px}
@media(max-width:700px){.obh-cv{height:120px}.obh-av{width:92px;height:92px;margin-top:-40px;font-size:30px}.obh-bd{padding:0 16px 18px;gap:14px}.obh-w h2{font-size:20px}}`;
document.head.appendChild(st);
/* окно раздела: создаём само, если его ещё нет в index.html */
if(!document.getElementById('v-office')){const sc=document.createElement('section');sc.id='v-office';sc.hidden=true;document.querySelector('.main').appendChild(sc)}

const root=()=>document.getElementById('v-office');
const $=s=>root().querySelector(s);
const esc=t=>String(t==null?'':t).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const IC={home:'M3 11l9-8 9 8M5 10v10h14V10',fin:'M4 20V10M10 20V4M16 20v-8M22 20H2',
  team:'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 11a2.5 2.5 0 1 0 0-5M21 19c0-2-1.5-3.5-4-4',
  jobs:'M4 8h16v11H4zM9 8V5h6v3M4 13h16',all:'M4 5h16v14H4zM4 10h16M9 5v14',
  tools:'M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10',
  cos:'M4 21V8l8-5 8 5v13M9 21v-6h6v6',fm:'M5 4h14v16H5zM10 9l5 3-5 3z'};
const ic=k=>`<svg viewBox="0 0 24 24"><path d="${IC[k]}"/></svg>`;
/* картинка для карточки 3D-песочницы (рисуется кодом, отдельный файл не нужен) */
const ART3D='<svg viewBox="0 0 160 120" width="160" height="120" fill="none" stroke-linejoin="round" stroke-linecap="round"><path d="M70 14l38 19v42L70 94 32 75V33z" fill="#ffffff" fill-opacity=".6" stroke="#1f6e43" stroke-width="3"/><path d="M32 33l38 19 38-19M70 52v42" stroke="#1f6e43" stroke-width="3"/><path d="M70 14l38 19-38 19-38-19z" fill="#2f8f5b" fill-opacity=".35"/><circle cx="122" cy="88" r="18" fill="#e8923a" stroke="#c4701f" stroke-width="3"/><ellipse cx="122" cy="88" rx="18" ry="6" stroke="#c4701f" stroke-width="2"/></svg>';
const CARDS=[{id:'sandbox3d',art:ART3D,bg:'linear-gradient(160deg,#d9f2e3,#8fd4ad)',title:'3D-песочница',
  text:'Лепи фигуры, красься, объединяй и вырезай. Готовые модели людей и животных. Скачивай .glb, .obj, .stl для игр и 3D-печати. Работа сохраняется сама.',
  url:'tools/sandbox3d.html'}];
const BLOG=['Маркетолог','Копирайтёр','Директор'];
const fd=t=>t?new Date(t).toLocaleDateString('ru-RU'):'';
const kp=n=>{n=Math.abs(+n||0);const a=n%10,b=n%100;return a===1&&b!==11?'коин':(a>=2&&a<=4&&(b<12||b>14))?'коина':'коинов'};
const mk=n=>(+n||0)+' '+kp(n);
const KIND=k=>({npd:'ИП на НПД',ip:'ИП',ooo:'ООО'})[String(k||'').toLowerCase()]||String(k||'');
const lk=b=>String(b&&b.kind||'').toLowerCase();
const canHire=b=>!!b&&lk(b)!=='npd';
const norm=o=>{if(o){o.staff=o.staff||[];o.offers=o.offers||[];o.founds=o.founds||[]}return o};
let O=null,tab='jobs',FB=null,applyFor=null,view=null,qAll='',fineFor=null,stF='act',SC=null,UPB=null;
const R=async(n,a)=>{const r=await window.SB.rpc(n,a||{});if(r.error)throw r.error;return r.data};
const say=(t,bad)=>{const m=$('#of-m');if(m){m.textContent=t||'';m.className='of-m'+(bad?' e':'')}};
const own=()=>O&&O.own&&O.own.status==='active'?O.own:null;
/* бизнес, которым я управляю: свой или как директор */
const mgrBiz=()=>{const o=own();if(o)return o;const s=O.staff.find(x=>x.role==='Директор');return s?{id:s.biz_id,kind:s.kind,name:s.name}:null};
/* бизнес, чьи финансы я вижу: свой, как директор или как бухгалтер */
const finBiz=()=>{const o=own();if(o)return o;const s=O.staff.find(x=>x.role==='Директор'||x.role==='Бухгалтер');if(s)return{id:s.biz_id,kind:s.kind,name:s.name};const f=O.founds[0];return f?{id:f.biz_id,kind:'ooo',name:f.name}:null};
const tabs=()=>{
  const t=[];
  if(own()||O.staff.length||O.offers.length||O.founds.length)t.push(['home','Главная']);
  if(finBiz())t.push(['fin','Финансы']);
  if(mgrBiz()||O.staff.length)t.push(['team','Команда']);
  if(O.mod)t.push(['all','Бизнесы']);
  t.push(['jobs','Вакансии']);
  t.push(['cos','Компании']);
  t.push(['fm','Студия']);
  t.push(['tools','Инструменты']);
  return t;
};
const twice=(b,t1)=>{
  if(!b.dataset.sure){b.dataset.sure='1';b.dataset.t0=b.textContent;b.textContent=t1;
    setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent=b.dataset.t0}},4000);return false}
  return true;
};

function shell(){
  root().innerHTML='<h2 class="sec" style="margin-top:0">MilkOffice</h2><div class="of-tabs">'+
    tabs().map(t=>`<button data-ot="${t[0]}" class="${tab===t[0]?'on':''}">${ic(t[0])}<span>${t[1]}</span></button>`).join('')+
    '</div><div class="of-m" id="of-m"></div><div id="of-b"></div>';
  show();
}
async function show(){
  const b=$('#of-b');if(!b)return;
  b.innerHTML='<div class="of-em">Загружаем…</div>';
  try{
    if(view&&view.t==='blog')await blogView(view.b,view.n);
    else await ({home,fin,team,all,jobs,cos:companies,fm:studio,tools}[tab])();
  }catch(e){b.innerHTML='';say(e.message||'Не получилось',1)}
}

/* ---------- Страница компании: шапка, публикации, Fresh ---------- */
const okImg=u=>/^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(u||'')?u:'';
const PL=['#17b3e6','#8774e1','#e5617a','#5cc08a','#f0a04b','#4a8fd9'];
const hue=t=>{let x=7;for(const c of String(t))x=(x*31+c.charCodeAt(0))>>>0;return PL[x%PL.length]};
let UID=null,pg='posts',PI=null,PD='',PS=[],LK=new Set(),PB={};
const cn=x=>x&&x[0]?x[0].count:0;
const cnt=r=>r&&!r.error&&r.count||0;
const getUser=async()=>{if(!UID){const u=await window.SB.auth.getUser();UID=u.data&&u.data.user||null}return UID};
const canPost=bid=>!!bid&&((own()&&own().id===bid)||O.founds.some(f=>f.biz_id===bid)||O.staff.some(s=>s.biz_id===bid&&BLOG.includes(s.role)));
const postBiz=()=>{const o=own();if(o)return o;const s=O.staff.find(x=>BLOG.includes(x.role));if(s)return{id:s.biz_id,kind:s.kind,name:s.name};const f=O.founds[0];return f?{id:f.biz_id,kind:'ooo',name:f.name}:null};
const keepDraft=()=>{const t=$('#of-pt');if(t)PD=t.value};
const mmss=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
const parseTags=s=>[...new Set(s.split(/[\s,]+/).map(x=>x.replace(/^#+/,'').toLowerCase().replace(/[^a-zа-яё0-9_]/g,'').slice(0,30)).filter(Boolean))];
async function getBlog(bid){
  const SB=window.SB;
  let r=await SB.from('biz_blogs').select('title,avatar_url,cover_url').eq('biz_id',bid).maybeSingle();
  if(r.error){r=await SB.from('biz_blogs').select('title').eq('biz_id',bid).maybeSingle();if(r.data)r.data.nomedia=true}
  return r.data||null;
}
async function pageStats(bid){
  const SB=window.SB,u=await getUser();
  const [a,b,c,d]=await Promise.all([
    SB.from('posts').select('id',{count:'exact',head:true}).eq('biz_id',bid),
    SB.from('biz_follows').select('user_id',{count:'exact',head:true}).eq('biz_id',bid),
    SB.from('flashes').select('id',{count:'exact',head:true}).eq('biz_id',bid),
    u?SB.from('biz_follows').select('user_id').match({biz_id:bid,user_id:u.id}).maybeSingle():null]);
  return {np:cnt(a),nf:cnt(b),nfl:cnt(c),fw:!!(d&&d.data)};
}
function blogHead(bid,bl,kind,st,go,name){
  const m=mgrBiz(),ed=!!m&&m.id===bid&&!bl.nomedia,av=okImg(bl.avatar_url),cv=okImg(bl.cover_url),t=bl.title||name||'',mine=!!own()&&own().id===bid;
  const bt=(go?`<button data-oa="blog" data-b="${bid}" data-n="${esc(t)}">Открыть страницу</button>`:'')+
    (!go&&!mine?`<button class="${st.fw?'g':''}" data-oa="sub" data-b="${bid}">${st.fw?'Вы подписаны':'Подписаться'}</button>`:'')+
    (ed?`<button class="g" data-oa="bmav" data-b="${bid}">${av?'Сменить фото':'Добавить фото'}</button><button class="g" data-oa="bmcv" data-b="${bid}">${cv?'Сменить баннер':'Добавить баннер'}</button>${av?`<button class="g" data-oa="bmavx" data-b="${bid}">Убрать фото</button>`:''}${cv?`<button class="g" data-oa="bmcvx" data-b="${bid}">Убрать баннер</button>`:''}`:'');
  return `<div class="obh"><div class="obh-cv"${cv?` style="background-image:url('${cv}')"`:''}></div><div class="obh-bd"><span class="obh-av" style="background-color:${hue(t)};${av?`background-image:url('${av}')`:''}">${av?'':esc((t.trim()[0]||'?').toUpperCase())}</span><div class="obh-w"><h2>${esc(t)}</h2><div class="obh-nk">${kind?`<span class="of-tag" style="margin:0">${esc(kind)}</span>`:''}</div><div class="obh-ss"><div><b>${st.np}</b><small>публикаций</small></div><div><b>${st.nf}</b><small>подписчиков</small></div><div><b>${st.nfl}</b><small>Flashes</small></div></div>${bt?`<div class="of-bt">${bt}</div>`:''}</div></div></div>`;
}
/* картинки */
function cropJpeg(file,w,h,q){
  return new Promise((ok,no)=>{
    const u=URL.createObjectURL(file),im=new Image();
    im.onload=()=>{URL.revokeObjectURL(u);const c=document.createElement('canvas');c.width=w;c.height=h;const k=Math.max(w/im.width,h/im.height),sw=w/k,sh=h/k;
      c.getContext('2d').drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,0,0,w,h);ok(c.toDataURL('image/jpeg',q))};
    im.onerror=()=>{URL.revokeObjectURL(u);no(new Error('Не удалось открыть картинку'))};
    im.src=u;
  });
}
function shrink(f,max){
  return new Promise((res,rej)=>{
    const u=URL.createObjectURL(f),im=new Image();
    im.onload=()=>{URL.revokeObjectURL(u);const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?res(b):rej(new Error('сжатие')),'image/jpeg',.82)};
    im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('не картинка'))};
    im.src=u;
  });
}
function pick(cb){const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>{if(i.files[0])cb(i.files[0])};i.click()}
/* видео (как в Fresh) */
const probe=f=>new Promise((ok,no)=>{const v=document.createElement('video'),u=URL.createObjectURL(f);v.preload='auto';v.muted=true;v.playsInline=true;const t=setTimeout(()=>{URL.revokeObjectURL(u);no()},8000);v.onloadedmetadata=()=>{clearTimeout(t);ok({v,u,dur:v.duration,w:v.videoWidth,h:v.videoHeight})};v.onerror=()=>{clearTimeout(t);URL.revokeObjectURL(u);no()};v.src=u});
const shot=(src,w,h)=>{const k=Math.min(1,640/Math.max(w,h)),c=document.createElement('canvas');c.width=Math.round(w*k);c.height=Math.round(h*k);c.getContext('2d').drawImage(src,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.72)};
const frame=(v,t)=>new Promise(ok=>{let d=false;const fin=()=>{if(!d){d=true;ok(shot(v,v.videoWidth,v.videoHeight))}};v.addEventListener('seeked',fin,{once:true});setTimeout(fin,2500);v.currentTime=t});
const imgCover=f=>new Promise((ok,no)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{URL.revokeObjectURL(u);ok(shot(i,i.width,i.height))};i.onerror=()=>{URL.revokeObjectURL(u);no()};i.src=u});

/* ---------- Главная ---------- */
async function home(){
  const o=own(),SB=window.SB;let h='';
  if(O.offers.length)h+='<div class="ofp"><h3>Вам предлагают долю</h3>'+O.offers.map(f=>`<div class="of-r" style="display:block"><b>${esc(f.name)}</b><small>${esc(f.from_name||'Игрок')} отдаёт вам ${f.share}% ${f.price>0?'за '+mk(f.price):'бесплатно'}. Вы станете сооснователем.</small><div class="of-bt"><button data-oa="offyes" data-id="${f.id}">Принять</button><button class="g" data-oa="offno" data-id="${f.id}">Отказаться</button></div></div>`).join('')+'</div>';
  if(o){
    h+=`<div class="ofp"><h3>${esc(o.name)} <span class="of-tag">${esc(KIND(o.kind))}</span></h3><p class="of-p">Баланс счёта: ${mk(o.balance)}.${lk(o)==='npd'?' Сотрудников нанимать нельзя.':''}</p></div>`;
    if(o.frozen)h+=`<div class="ofp of-wn">Счёт заморожен: не хватает денег на взнос, зарплату или штраф.${o.debt>0?' Штраф: '+mk(o.debt)+(o.debt_note?' ('+esc(o.debt_note)+')':'')+'.':''} Пополни счёт в Банке.${lk(o)==='ooo'?' Если долги не оплатить 30 дней, компания закроется.':''}</div>`;
    const bl=await getBlog(o.id);
    if(bl)h+=blogHead(o.id,bl,KIND(o.kind),await pageStats(o.id),true,o.name);
    else h+=`<div class="ofp"><h3>Страница компании</h3><p class="of-p">Страница получит название вашего бизнеса: «${esc(o.name)}». Название потом не меняется.</p><div class="of-bt"><button data-oa="blogmk">Создать страницу</button></div></div>`;
  }else if(O.own){
    const S={pending:'заявка на проверке',rejected:'заявка отклонена',closed:'компания закрыта'}[O.own.status]||O.own.status;
    h+=`<div class="ofp"><h3>Ваш бизнес «${esc(O.own.name)}»</h3><p class="of-p">Статус: ${esc(S)}.${O.own.reason?' '+esc(O.own.reason)+'.':''}${O.own.status==='pending'?' Разделы Офиса откроются после одобрения.':''}</p></div>`;
  }
  if(O.staff.length)h+='<div class="ofp"><h3>Где вы работаете</h3>'+O.staff.map(s=>`<div class="of-r"><span><b>${esc(s.name)}</b> <span class="of-tag">${esc(KIND(s.kind))}</span><small>${esc(s.role)}${s.salary?', '+mk(s.salary)+' в месяц':''}</small></span><div class="of-bt" style="margin:0"><button class="g" data-oa="blog" data-b="${s.biz_id}" data-n="${esc(s.name)}">Страница</button></div></div>`).join('')+'</div>';
  if(o&&lk(o)==='ooo')h+=await founders(o.id,o.name);
  for(const f of O.founds)h+=await founders(f.biz_id,f.name);
  $('#of-b').innerHTML=h||'<div class="of-em">Пока здесь пусто</div>';
}

async function founders(bid,name){
  let d;try{d=await R('biz_founders_info',{p_bid:bid})}catch(e){return ''}
  const rows=(d.list||[]).map(x=>`<div class="of-r"><span><b>${esc(x.name||'Игрок')}</b>${x.nick?' @'+esc(x.nick):''}<small>${x.is_owner?'Главный владелец':'Сооснователь'}</small></span><b>${x.share}%</b></div>`).join('');
  const out=(d.out||[]).map(x=>`<div class="of-r"><span>Предложено: ${esc(x.to_name||'игроку')}, ${x.share}%${x.price>0?' за '+mk(x.price):' бесплатно'}</span><div class="of-bt" style="margin:0"><button class="g" data-oa="offx" data-id="${x.id}">Отозвать</button></div></div>`).join('');
  return `<div class="ofp"><h3>Сооснователи: ${esc(name)}</h3>${rows}<small style="margin-top:8px">Твоя доля: ${d.me}%. Прибыль делится по долям: когда главный владелец выводит деньги со счёта, каждый получает свою часть.</small>${out?'<h3 style="margin-top:14px">Мои предложения</h3>'+out:''}<h3 style="margin-top:14px">Предложить долю</h3><input class="of-in" id="of-on-${bid}" placeholder="Ник игрока" autocomplete="off"><input class="of-in" id="of-os-${bid}" type="number" min="1" max="49" placeholder="Сколько % отдать"><input class="of-in" id="of-op-${bid}" type="number" min="0" placeholder="Цена в коинах (0 — бесплатно)"><small>Можно позвать сооснователя или продать часть своей доли. Главный владелец всегда держит не меньше 51%. Всего сооснователей до 5.</small><div class="of-bt"><button data-oa="offmk" data-b="${bid}">Предложить</button></div></div>`;
}

/* ---------- Страница компании (как профиль) ---------- */
const SVH='<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z"/></svg>';
const SVC='<svg viewBox="0 0 24 24"><path d="M5 5h14v10H10l-5 4z"/></svg>';
const dots=h=>window.CMT&&CMT.dots?CMT.dots(h):'';
const cmH=x=>window.CMT&&CMT.html?CMT.html(x.id,x.user_id,false):'';
const cmN=id=>window.CMT&&CMT.n?CMT.n(id):0;
const isMod=()=>!!(window.CMT&&CMT.mod&&CMT.mod());
function postsHtml(){
  const av=okImg(PB.av),me=UID;
  return PS.map(x=>{
    const mine=me&&x.user_id===me.id;
    return `<article class="ofp obp"><div class="obp-h"><span class="obp-a" style="background-color:${hue(PB.title)};${av?`background-image:url('${av}')`:''}">${av?'':esc((PB.title||'?').trim()[0]||'?')}</span><div style="flex:1;min-width:0"><b>${esc(PB.title)}</b>${PB.kind?`<span class="of-tag" style="margin:0 0 0 6px">${esc(PB.kind)}</span>`:''}<small style="display:block">${fd(x.created_at)}</small></div>${dots((mine?'':`<button data-pm="${x.id}">Пожаловаться</button>`)+(mine||isMod()?`<button data-del="${x.id}" data-danger>Удалить</button>`:''))}</div>${(x.body||'').trim()?`<p>${esc(x.body)}</p>`:''}${x.image_url?`<img class="pi" src="${esc(x.image_url)}" alt="" loading="lazy">`:''}<div class="obp-ac"><button data-oa="plk" data-id="${x.id}" class="${LK.has(x.id)?'on':''}">${SVH}${cn(x.post_likes)}</button><button disabled>${SVC}${cmN(x.id)}</button></div>${cmH(x)}</article>`;
  }).join('')||'<div class="ofp"><div class="of-em">Публикаций пока нет</div></div>';
}
function drawPosts(){const e=document.getElementById('of-posts');if(e)e.innerHTML=postsHtml()}
async function pagePosts(bid,b0,kind,can,me){
  const SB=window.SB;
  const r=await SB.from('posts').select('id,user_id,body,image_url,created_at,post_likes(count),post_comments(count)').eq('biz_id',bid).order('created_at',{ascending:false}).limit(50);
  PS=r.data||[];PB={title:b0.title,av:b0.avatar_url,kind};LK=new Set();
  const ids=PS.map(x=>x.id);
  if(ids.length&&me){const l=await SB.from('post_likes').select('post_id').eq('user_id',me.id).in('post_id',ids);(l.data||[]).forEach(z=>LK.add(z.post_id))}
  if(me&&window.CMT&&CMT.load){try{await CMT.load(SB,me,ids,drawPosts)}catch(e){}}
  const comp=can?`<div class="ofp"><textarea id="of-pt" maxlength="2000" placeholder="Что нового в компании?"></textarea>${PI?`<div class="obp-pv"><img src="${PI.url}" alt=""><button data-oa="prm">Убрать фото</button></div>`:''}<div class="of-bt"><button class="g" data-oa="pph">Фото</button><button data-oa="post" data-b="${bid}">Опубликовать</button></div></div>`:'';
  return comp+'<div id="of-posts">'+postsHtml()+'</div>';
}
async function pageFlashes(bid,can){
  const r=await window.SB.from('flashes').select('id,title,cover,dur,views,likes,created_at').eq('biz_id',bid).order('created_at',{ascending:false}).limit(60);
  const L=r.data||[];
  return (can?'<div class="of-bt" style="margin:0 0 12px"><button data-oa="tofm">Загрузить Flash и смотреть статистику</button></div>':'')+
    (L.length?'<div class="obf">'+L.map(x=>{const c=okImg(x.cover);return `<button class="obf-i" data-oa="fl" data-id="${esc(x.id)}"${c?` style="background-image:url('${c}')"`:''}><span>${esc(x.title)}</span></button>`}).join('')+'</div>':'<div class="ofp"><div class="of-em">Flashes пока нет</div></div>');
}
async function blogView(bid,name){
  const box=$('#of-b'),b0=await getBlog(bid);
  if(!b0){box.innerHTML='<button class="back" data-oa="back">← Назад</button><div class="ofp"><h3>'+esc(name)+'</h3><p class="of-p">Страницы пока нет.</p></div>';return}
  const me=await getUser(),st=await pageStats(bid),can=canPost(bid);
  const sf=O.staff.find(s=>s.biz_id===bid),kd=own()&&own().id===bid?own().kind:(sf?sf.kind:''),kind=kd?KIND(kd):'';
  const tb='<div class="obt">'+[['posts','Публикации'],['fm','Fresh']].map(([k,l])=>`<button data-oa="pgt" data-k="${k}" class="${pg===k?'on':''}">${l}</button>`).join('')+'</div>';
  const body=pg==='fm'?await pageFlashes(bid,can):await pagePosts(bid,b0,kind,can,me);
  box.innerHTML='<button class="back" data-oa="back">← Назад</button>'+blogHead(bid,b0,kind,st,false,name)+tb+body;
  if(pg==='posts'&&PD){const t=$('#of-pt');if(t)t.value=PD}
}

/* ---------- Компании (видят все) ---------- */
async function companies(){
  let r=await window.SB.from('biz_blogs').select('biz_id,title,avatar_url,cover_url').limit(200),L=r.data;
  if(r.error){r=await window.SB.from('biz_blogs').select('biz_id,title').limit(200);L=r.data}
  L=L||[];
  $('#of-b').innerHTML=L.length?'<div class="ofg" style="margin-top:0">'+L.map(b=>{const c=okImg(b.cover_url),a=okImg(b.avatar_url);
    return `<article class="ofc"><div class="ban" style="${c?`background:center/cover url('${c}')`:'background:linear-gradient(120deg,#8fd3f0,#a99bf0)'}"><span class="obh-av" style="margin:0;width:84px;height:84px;font-size:30px;background-color:${hue(b.title)};${a?`background-image:url('${a}')`:''}">${a?'':esc((b.title||'?').trim()[0]||'?')}</span></div><h3>${esc(b.title)}</h3><button class="join" data-oa="blog" data-b="${b.biz_id}" data-n="${esc(b.title)}">Открыть</button></article>`}).join('')+'</div>'
    :'<div class="of-em">Страниц компаний пока нет</div>';
}

/* ---------- Студия Fresh: загрузка видео и статистика (личная и корпоративная) ---------- */
const upForm=bid=>`<div class="ofp" id="ou" hidden><small class="ou-rules">До 60 секунд, до 25 МБ, вертикальное или квадратное, не выше 720p, mp4 или mov. ${bid?'Один Flash в сутки':'Два Flash в сутки'}. Чтобы видео прошло, сними его в HD (720p).</small><div class="of-m e" id="ou-lim"></div><label class="ofl" id="ou-vl">Выбрать видео<input type="file" id="ou-vf" accept="video/mp4,video/quicktime,.mp4,.mov" hidden></label><div class="of-p" id="ou-info"></div><div class="of-m e" id="ou-e"></div><div id="ou-form" hidden><div class="ou-row"><div class="ou-cv" id="ou-cvi"></div><div class="ou-f"><small>Обложка: выбери кадр или свою картинку</small><input type="range" id="ou-sl" min="0" max="1" step="0.1" value="0"><label class="ofl">Своя картинка<input type="file" id="ou-cf" accept="image/*" hidden></label><input class="of-in" id="ou-ti" maxlength="100" placeholder="Название"><textarea id="ou-de" maxlength="1000" placeholder="Описание"></textarea><input class="of-in" id="ou-tg" placeholder="#хэштеги, до 10"></div></div></div><div class="of-bt"><button id="ou-pub" disabled>Опубликовать</button><button class="g" id="ou-cn">Отмена</button></div></div>`;
async function upLimit(){
  const l=document.getElementById('ou-lim'),v=document.getElementById('ou-vl');if(!l)return;
  l.textContent='';v.hidden=false;
  try{const left=Number(await R('flash_wait'))||0;if(left>0){const t=Math.ceil(left/60),h=Math.floor(t/60);l.textContent=(UPB?'Один':'Два')+' Flash в сутки. Следующий можно загрузить через '+(h?h+' ч '+(t%60)+' мин':t+' мин')+'.';v.hidden=true}}catch(e){}
}
function initUp(bid){
  const g=id=>document.getElementById(id);let P=null,cover='',busy=false;
  const err=t=>{g('ou-e').textContent=t||''};
  const setC=d=>{cover=d;g('ou-cvi').style.backgroundImage="url('"+d+"')"};
  const drop=()=>{if(P){URL.revokeObjectURL(P.u);P=null}cover='';g('ou-vf').value='';g('ou-cf').value='';g('ou-info').textContent='';err();g('ou-form').hidden=true;g('ou-pub').disabled=true;g('ou-ti').value='';g('ou-de').value='';g('ou-tg').value=''};
  g('ou-cn').onclick=()=>{if(busy)return;drop();g('ou').hidden=true};
  g('ou-vf').onchange=async e=>{
    const f=e.target.files[0];if(!f||busy)return;
    err();g('ou-form').hidden=true;g('ou-pub').disabled=true;if(P){URL.revokeObjectURL(P.u);P=null}
    g('ou-info').textContent='Проверяем видео…';
    const bad=t=>{g('ou-info').textContent='';err(t)},ext=(f.name.split('.').pop()||'').toLowerCase();
    if(!['mp4','mov'].includes(ext))return bad('Нужен файл mp4 или mov.');
    if(f.size>25*1048576)return bad('Файл весит '+(f.size/1048576).toFixed(1).replace('.',',')+' МБ, а можно не больше 25 МБ.');
    let p;try{p=await probe(f)}catch(x){return bad('Не удалось прочитать видео. Нужен mp4 (H.264).')}
    const no=t=>{URL.revokeObjectURL(p.u);bad(t)};
    if(!isFinite(p.dur)||p.dur<=0)return no('Не удалось определить длительность видео.');
    if(p.dur>60.5)return no('Видео длится '+mmss(p.dur)+', а можно не больше 1:00.');
    if(p.w>p.h)return no('Видео горизонтальное. Нужны вертикальные или квадратные.');
    if(Math.min(p.w,p.h)>720)return no('Качество '+p.w+'×'+p.h+' выше 720p. Сними заново в HD (720p).');
    P={...p,f};
    g('ou-info').textContent=f.name+': '+mmss(p.dur)+', '+p.w+'×'+p.h;
    const sl=g('ou-sl');sl.max=p.dur.toFixed(1);sl.value=Math.min(1,p.dur/2);
    g('ou-form').hidden=false;g('ou-pub').disabled=false;setC(await frame(p.v,+sl.value));
  };
  g('ou-sl').onchange=async e=>{if(P&&!busy)setC(await frame(P.v,+e.target.value))};
  g('ou-cf').onchange=async e=>{const f=e.target.files[0];if(!f)return;err();if(f.size>5*1048576)return err('Обложка весит больше 5 МБ.');try{setC(await imgCover(f))}catch(x){err('Не удалось открыть картинку.')}};
  g('ou-pub').onclick=async()=>{
    if(busy||!P)return;err();
    const title=g('ou-ti').value.trim(),desc=g('ou-de').value.trim(),tags=parseTags(g('ou-tg').value);
    if(title.length<3)return err('Напиши название: минимум 3 символа.');
    if(tags.length>10)return err('Хэштегов не больше 10.');
    busy=true;const b=g('ou-pub');b.disabled=true;b.textContent='Загружаем…';g('ou-info').textContent='Загружаем видео, не закрывай страницу. Это может занять до минуты.';
    const fail=t=>{busy=false;b.disabled=false;b.textContent='Опубликовать';g('ou-info').textContent='';err(t)};
    try{
      const fd2=new FormData();fd2.append('file',P.f,P.f.name);
      const up=await window.SB.functions.invoke('upload-video',{body:fd2});
      if(up.error){let m='Не удалось загрузить видео. Проверь интернет и попробуй ещё раз.';try{const j=await up.error.context.json();if(j&&j.error)m=j.error}catch(x){}return fail(m)}
      const url=up.data&&up.data.url;
      if(!url||!/^https:\/\/[a-z0-9-]+\.github\.io\//i.test(url))return fail('Сервер вернул странный ответ. Попробуй ещё раз.');
      if(bid)await R('biz_flash_make',{p_bid:bid,p_title:title,p_desc:desc,p_tags:tags,p_url:url,p_cover:cover,p_dur:P.dur,p_w:P.w,p_h:P.h,p_size:P.f.size});
      else{
        const ins=await window.SB.from('flashes').insert({author:window.ME_NAME||'Участник',title,description:desc,tags,url,cover,dur:P.dur,w:P.w,h:P.h,size:P.f.size});
        if(ins.error)throw new Error('Видео загружено, но запись не сохранилась. Сообщи об этом.');
      }
    }catch(x){return fail((x&&x.message)||'Что-то пошло не так.')}
    busy=false;say('Flash опубликован. Видео заработает по ссылке через 1–2 минуты.');show();
  };
}

const pad2=n=>String(n).padStart(2,'0');
function bars(v,a,b,cls){const mx=Math.max(1,...v);return '<div class="of-bar">'+v.map(n=>`<i class="${cls||''}" style="height:${n?Math.max(5,n/mx*100):2}%" title="${n}"></i>`).join('')+'</div><div class="of-bl"><span>'+a+'</span><span>'+b+'</span></div>'}
function daysBlock(days){
  const m={};(days||[]).forEach(x=>{m[String(x.d).slice(0,10)]=+x.n||0});
  const keys=[],v=[];
  for(let i=13;i>=0;i--){const k=new Date(Date.now()-i*864e5).toISOString().slice(0,10);keys.push(k);v.push(m[k]||0)}
  const tot=v.reduce((a,b)=>a+b,0),f=k=>k.slice(8,10)+'.'+k.slice(5,7);
  if(!tot)return '<div class="ofp"><h3>Просмотры по дням</h3><div class="of-em" style="padding:10px 0">Пока нет данных. Здесь считаются просмотры за последние 14 дней.</div></div>';
  const pk=v.indexOf(Math.max(...v));
  return `<div class="ofp"><h3>Просмотры по дням</h3><div class="of-pk">Больше всего: ${f(keys[pk])} (${v[pk]})</div>${bars(v,f(keys[0]),f(keys[13]))}</div>`;
}
function secBlock(ev,kind,title,cls){
  const a=(ev||[]).filter(e=>e.k===kind);
  if(!a.length)return `<div class="ofp"><h3>${title}</h3><div class="of-em" style="padding:10px 0">Пока нет данных. Они появятся, когда зрители начнут смотреть.</div></div>`;
  const N=Math.min(61,Math.max(...a.map(e=>+e.s))+1),v=Array(N).fill(0);
  a.forEach(e=>{if(+e.s<N)v[+e.s]+=(+e.n||0)});
  const tot=v.reduce((x,y)=>x+y,0),pk=v.indexOf(Math.max(...v));
  return `<div class="ofp"><h3>${title}</h3><div class="of-pk">Чаще всего: около ${pk} с (${v[pk]} из ${tot})</div>${bars(v,'0 с',(N-1)+' с',cls)}</div>`;
}
function statsHtml(ST){
  if(!ST)return '<div class="ofp"><small>Подробная статистика появится после обновления базы данных.</small></div>';
  const ev=ST.ev||[];
  return daysBlock(ST.days)+secBlock(ev,'skip','На какой секунде пролистывают','')+secBlock(ev,'like','На какой секунде ставят лайк','l')+secBlock(ev,'comment','На какой секунде комментируют','c');
}
const FC='id,title,dur,views,likes,created_at';
const sum=(a,f)=>a.reduce((s,x)=>s+(+f(x)||0),0);
const earn=a=>a.reduce((s,x)=>s+Math.floor((+x.views||0)/20),0);
const pcn=(a,b)=>b?(a/b*100).toFixed(1).replace('.',',')+'%':'0%';
const scard=(t,v)=>`<div class="ofp"><small>${t}</small><b>${v}</b></div>`;
async function studio(){
  const box=$('#of-b'),SB=window.SB,u=await getUser();
  if(!u){box.innerHTML='<div class="of-em">Чтобы открыть студию, войди в аккаунт.</div>';return}
  /* монетизация: 1 монета за 20 просмотров. Личные Flashes: на личный счёт, корпоративные: на счёт компании */
  try{const c=await R('flash_collect');if(c&&(c.coins>0||c.biz>0)){say((c.coins>0?'Начислено '+mk(c.coins)+' на личный счёт в Банке. ':'')+(c.biz>0?'На счёт компании начислено '+mk(c.biz)+'.':''));if(c.biz>0)O=norm(await R('biz_office'));if(window.COIN)COIN.sync()}}catch(e){}
  const m=postBiz(),bl=m?await getBlog(m.id):null,biz=bl?{id:m.id,title:bl.title}:null;
  const mr=await SB.from('flashes').select(FC).eq('user_id',u.id).is('biz_id',null).order('created_at',{ascending:false}).limit(100);
  const ML=mr.data||[],both=!!biz&&ML.length>0;
  const sc=both?SC:(biz?'biz':'me');
  /* есть и личный, и корпоративный Fresh: сетка из двух пунктов, личный больше и первый */
  if(!sc){
    const br=await SB.from('flashes').select('views').eq('biz_id',biz.id).limit(1000),BL=br.data||[];
    const one=(k,t,L,big)=>`<button class="ofs-c${big?' big':''}" data-oa="sc" data-k="${k}"><h3>${esc(t)}</h3><span>${L.length} Flashes · ${sum(L,x=>x.views)} просмотров</span><em>Заработано: ${mk(earn(L))}</em></button>`;
    box.innerHTML='<div class="ofs">'+one('me','Личный Fresh',ML,1)+one('biz',biz.title,BL,0)+'</div>';
    return;
  }
  const isB=sc==='biz',bid=isB?biz.id:null;
  UPB=bid;
  let F=ML,Pp=[],W=[];
  if(isB){
    const [fl,ps,fw]=await Promise.all([
      SB.from('flashes').select(FC).eq('biz_id',bid).order('created_at',{ascending:false}).limit(100),
      SB.from('posts').select('id,body,created_at,post_likes(count),post_comments(count)').eq('biz_id',bid).order('created_at',{ascending:false}).limit(100),
      SB.from('biz_follows').select('created_at').eq('biz_id',bid).limit(5000)]);
    F=fl.data||[];Pp=ps.data||[];W=fw.data||[];
  }
  const fc={};
  if(F.length){const c=await SB.from('flash_comments').select('flash_id').in('flash_id',F.map(x=>x.id)).limit(5000);(c.data||[]).forEach(z=>{fc[z.flash_id]=(fc[z.flash_id]||0)+1})}
  const views=sum(F,x=>x.views),fL=sum(F,x=>x.likes),fC=sum(Object.values(fc),x=>x),pL=sum(Pp,x=>cn(x.post_likes)),pC=sum(Pp,x=>cn(x.post_comments));
  let ST=null;try{ST=await R('flash_stats',{p_biz:bid})}catch(e){}
  const title=isB?biz.title:'Личный Fresh';
  const cards=[scard('Заработано',mk(earn(F))),scard('Просмотры Flashes',views),scard(isB?'Лайки (видео и посты)':'Лайки',fL+pL),scard('Комментарии',fC+pC),scard('Вовлечённость видео',pcn(fL+fC,views)),scard('Просмотров на Flash',F.length?Math.round(views/F.length):0),scard('Flashes',F.length)];
  if(isB)cards.unshift(scard('Подписчики',W.length));
  if(isB)cards.push(scard('Публикаций',Pp.length));
  box.innerHTML=(both?'<button class="back" data-oa="scback">← Назад</button>':'')+
    `<div class="ofp"><h3>${esc(title)}</h3><p class="of-p">${isB?'Видео компании и их статистика. Flashes видны в общем Fresh и на странице компании.':'Твои Flashes и их статистика.'} За каждые 20 просмотров начисляется 1 коин, он сам приходит ${isB?'на счёт компании':'на твой личный счёт в Банке'}.</p><div class="of-bt"><button data-oa="upt">Загрузить Flash</button>${isB?`<button class="g" data-oa="blog" data-b="${bid}" data-n="${esc(biz.title)}">Страница компании</button>`:''}</div></div>`+upForm(bid)+
    `<div class="of-g">${cards.join('')}</div>`+statsHtml(ST)+
    (isB?`<div class="ofp"><h3>Новые подписчики за 14 дней</h3>${chart(W.map(w=>({created_at:w.created_at,amount:1})))}</div>`:'')+
    `<div class="ofp"><h3>Flashes</h3>${F.map(x=>{const c=fc[x.id]||0;return `<div class="of-r"><span><b>${esc(x.title)}</b><small>${fd(x.created_at)} · ${x.views||0} просм. · ${x.likes||0} лайков · ${c} комм. · заработано ${mk(Math.floor((+x.views||0)/20))}</small></span><div class="of-bt" style="margin:0"><button class="g" data-oa="fl" data-id="${esc(x.id)}">Открыть</button><button class="g" data-oa="fdel" data-id="${esc(x.id)}">Удалить</button></div></div>`}).join('')||'<div class="of-em">Flashes пока нет</div>'}</div>`+
    (isB?`<div class="ofp"><h3>Публикации</h3>${Pp.map(x=>`<div class="of-r"><span><b>${esc((x.body||'').trim().slice(0,60)||'Фото')}</b><small>${fd(x.created_at)} · ${cn(x.post_likes)} лайков · ${cn(x.post_comments)} комм.</small></span></div>`).join('')||'<div class="of-em">Публикаций пока нет</div>'}</div>`:'');
  initUp(bid);
}


/* ---------- Финансы ---------- */
function chart(ops){
  const m={},now=new Date();now.setHours(0,0,0,0);
  for(let i=0;i<14;i++){const d=new Date(now);d.setDate(d.getDate()-i);m[d.toDateString()]=0}
  ops.forEach(o=>{const k=new Date(o.created_at);k.setHours(0,0,0,0);const s=k.toDateString();if(s in m)m[s]+=+o.amount});
  const v=Object.values(m).reverse(),mx=Math.max(1,...v.map(Math.abs));
  return '<div class="of-ch">'+v.map(n=>`<i class="${n<0?'n':''}" style="height:${Math.max(3,Math.abs(n)/mx*76)}px"></i>`).join('')+'</div>';
}
async function fin(){
  const m=finBiz(),bid=FB||(m&&m.id);
  if(!bid){$('#of-b').innerHTML='<div class="of-em">Нет доступа</div>';return}
  const d=await R('biz_fin',{bid}),ops=d.ops||[],lim=Date.now()-30*864e5;
  let inc=0,exp=0;
  ops.forEach(o=>{if(new Date(o.created_at)>=lim){const a=+o.amount;if(a>0)inc+=a;else exp-=a}});
  $('#of-b').innerHTML=(FB?'<button class="back" data-oa="all">← К списку</button>':'')+
    (d.frozen?`<div class="ofp of-wn">Счёт заморожен: не хватает денег на взнос, зарплату или штраф.${d.debt>0?' Штраф: '+mk(d.debt)+'.':''}</div>`:'')+
    `<div class="of-g"><div class="ofp"><small>Баланс · ${esc(KIND(d.kind))}</small><b>${mk(d.balance)}</b><small>Счёт ${esc(d.acc||'')}</small></div>`+
    `<div class="ofp"><small>Доходы за 30 дней</small><b class="up">+${inc}</b></div>`+
    `<div class="ofp"><small>Расходы за 30 дней</small><b class="dn">−${exp}</b></div>`+
    `<div class="ofp"><small>Прибыль за 30 дней</small><b class="${inc-exp<0?'dn':'up'}">${inc-exp}</b></div></div>`+
    (d.payroll>0?`<div class="ofp"><small>Зарплаты сотрудникам в месяц</small><b>${mk(d.payroll)}</b></div>`:'')+
    `<div class="ofp"><h3>Движение за 14 дней</h3>${chart(ops)}</div>`+
    `<div class="ofp"><h3>Операции</h3>${ops.length?ops.slice(0,50).map(o=>`<div class="of-r"><span>${esc(o.title)}<small>${fd(o.created_at)}</small></span><b class="${+o.amount<0?'dn':'up'}">${+o.amount>0?'+':''}${o.amount}</b></div>`).join(''):'<div class="of-em">Операций пока нет</div>'}</div>`+
    (d.fee_until?`<div class="ofp"><small>Квартальный взнос оплачен до ${fd(d.fee_until)}</small></div>`:'');
}

/* ---------- Команда ---------- */
async function team(){
  const m=mgrBiz();let h='';
  if(m){
    if(!canHire(m))h+='<div class="ofp"><h3>Команда</h3><p class="of-p">ИП на НПД работает один: на этом налоге нанимать сотрудников нельзя. Чтобы нанимать, открой ИП или ООО.</p></div>';
    else{
      const d=await R('biz_team',{bid:m.id});
      h+=`<div class="ofp"><h3>Новая вакансия</h3><select id="of-vr">${(d.roles||[]).map(r=>`<option>${esc(r)}</option>`).join('')}</select><textarea id="of-vd" maxlength="500" placeholder="Что делать и что нужно уметь."></textarea><input class="of-in" id="of-vs" type="number" min="0" max="100000" placeholder="Зарплата в месяц, коинов"><label style="display:flex;gap:8px;align-items:center;font-size:13px;margin:6px 0"><input type="checkbox" id="of-vn"> Зарплату можно обсудить</label><small>${lk(m)==='ip'?'ИП нанимает до 3 человек. ':''}Зарплата выплачивается раз в месяц со счёта проекта сама.</small><div class="of-bt"><button data-oa="vacmk">Опубликовать</button></div></div>`;
      h+='<div class="ofp"><h3>Открытые вакансии</h3>'+((d.vacs||[]).map(v=>`<div class="of-r"><span><span class="of-tag">${esc(v.role)}</span>${esc(v.descr)}<small>${mk(v.salary)} в месяц, ${v.negotiable?'можно обсудить':'без обсуждения'}</small></span><div class="of-bt" style="margin:0"><button class="g" data-oa="vacx" data-id="${v.id}">Закрыть</button></div></div>`).join('')||'<div class="of-em">Нет открытых вакансий</div>')+'</div>';
      h+='<div class="ofp"><h3>Отклики</h3>'+((d.apps||[]).map(a=>`<div class="of-r" style="display:block"><b>${esc(a.name||'Без имени')}</b> <span class="of-tag">${esc(a.role)}</span><small>${esc(a.msg)}</small>${a.negotiable?`<small>Зарплата в вакансии: ${mk(a.salary)}, можно обсудить</small><input class="of-in" id="of-s${a.id}" type="number" min="0" value="${+a.salary||0}" placeholder="Договорённая зарплата в месяц, коинов">`:`<small>Зарплата без обсуждения: ${mk(a.salary)} в месяц</small>`}<div class="of-bt"><button data-oa="yes" data-id="${a.id}">Принять</button><button class="g" data-oa="no" data-id="${a.id}">Отклонить</button></div></div>`).join('')||'<div class="of-em">Откликов пока нет</div>')+'</div>';
      h+='<div class="ofp"><h3>Сотрудники</h3>'+((d.staff||[]).map(s=>`<div class="of-r"><span><b>${esc(s.name||'Без имени')}</b><small>${esc(s.role)}${s.salary?', '+mk(s.salary)+' в месяц':''}</small></span>${s.role==='Директор'&&!own()?'':`<div class="of-bt" style="margin:0"><button class="g" data-oa="end" data-id="${s.id}">Уволить</button></div>`}</div>`).join('')||'<div class="of-em">Пока никого</div>')+'</div>';
    }
  }
  const mine=O.staff.filter(s=>!(own()&&own().id===s.biz_id));
  if(mine.length)h+='<div class="ofp"><h3>Мои места работы</h3>'+mine.map(s=>`<div class="of-r"><span><b>${esc(s.name)}</b> <span class="of-tag">${esc(KIND(s.kind))}</span><small>${esc(s.role)}${s.salary?', '+mk(s.salary)+' в месяц':''}</small></span><div class="of-bt" style="margin:0"><button class="g" data-oa="end" data-id="${s.id}">Уволиться</button></div></div>`).join('')+'</div>';
  $('#of-b').innerHTML=h||'<div class="of-em">Пока пусто</div>';
}

/* ---------- Бизнесы (модераторам) ---------- */
async function all(){
  FB=null;
  const L=await R('biz_all');
  const SF={act:b=>b.status==='active',pend:b=>b.status==='pending',old:b=>b.status==='rejected'||b.status==='closed'};
  const f=L.filter(SF[stF]).filter(b=>!qAll||(b.name+' '+(b.owner_name||'')+' '+(b.acc||'')).toLowerCase().includes(qAll));
  const chips='<div class="of-bt" style="margin:0 0 8px">'+[['act','Работают'],['pend','На проверке'],['old','Отклонённые и закрытые']].map(([k,l])=>`<button class="${stF===k?'':'g'}" data-oa="stf" data-k="${k}">${l} · ${L.filter(SF[k]).length}</button>`).join('')+'</div>';
  $('#of-b').innerHTML=chips+`<input class="of-in" id="of-q" placeholder="Поиск по названию, владельцу или счёту" value="${esc(qAll)}"><div class="ofp">`+
    (f.map(b=>`<div class="of-r" style="display:block"><b>${esc(b.name)}</b> <span class="of-tag">${esc(KIND(b.kind))}</span><span class="of-tag">${esc(b.status)}</span>${b.frozen?'<span class="of-tag w">заморожен</span>':''}${b.debt>0?'<span class="of-tag w">штраф '+b.debt+'</span>':''}<small>Владелец: ${esc(b.owner_name||'—')}. Счёт: ${esc(b.acc||'нет')}. Баланс: ${mk(b.balance)}. ${esc(b.activity||'')}</small>`+
      (fineFor===b.id
        ?`<input class="of-in" id="of-fa" type="number" min="1" placeholder="Сумма штрафа, коинов"><input class="of-in" id="of-fr" maxlength="100" placeholder="Причина штрафа"><div class="of-bt"><button class="r" data-oa="fineok" data-b="${b.id}">Выписать штраф</button><button class="g" data-oa="finex">Отмена</button></div>`
        :stF==='old'?`<div class="of-bt"><button class="r" data-oa="bizdel" data-b="${b.id}">Удалить из списка</button></div>`
        :`<div class="of-bt"><button class="g" data-oa="fin" data-b="${b.id}">Финансы</button><button class="g" data-oa="blog" data-b="${b.id}" data-n="${esc(b.name)}">Страница</button>${b.status==='active'?`<button class="g" data-oa="fine" data-b="${b.id}">Штраф</button>`:''}</div>`)+
      '</div>').join('')||'<div class="of-em">Ничего не найдено</div>')+'</div>';
}

/* ---------- Вакансии (видят все) ---------- */
async function jobs(){
  const L=await R('biz_jobs');
  const lab={new:'Отклик отправлен',yes:'Принят',no:'Отклонён'};
  $('#of-b').innerHTML=(!tabs().some(x=>x[0]==='home')?'<div class="ofp"><p class="of-p">Разделы про бизнес открываются владельцам бизнесов и их сотрудникам. Здесь можно найти работу в ИП или ООО, а во вкладке «Инструменты» есть программы для работы. Во вкладке «Студия» можно загружать свои Flashes и получать коины за просмотры.</p></div>':'')+
    (L.map(v=>`<div class="ofp"><h3>${esc(v.name)} <span class="of-tag">${esc(v.role)}</span></h3><p class="of-p">${esc(v.descr)}</p><small style="margin-top:6px"><b>${mk(v.salary)} в месяц</b>, ${v.negotiable?'можно обсудить':'без обсуждения'}</small>`+
      (v.my?`<small style="margin-top:8px">${lab[v.my]||''}</small>`
        :applyFor===v.id?`<textarea id="of-am" maxlength="500" placeholder="Расскажи о себе и опыте"></textarea><div class="of-bt"><button data-oa="send" data-id="${v.id}">Отправить</button><button class="g" data-oa="applyx">Отмена</button></div>`
        :`<div class="of-bt"><button data-oa="apply" data-id="${v.id}">Откликнуться</button></div>`)+'</div>').join('')||'<div class="of-em">Открытых вакансий пока нет</div>');
}

/* ---------- Инструменты (видят все) ---------- */
async function tools(){
  $('#of-b').innerHTML='<div class="ofg" style="margin-top:0">'+CARDS.map(c=>`<article class="ofc"><div class="ban" style="background:${c.bg}">${c.art}</div><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p><button class="join" data-oa="tool" data-id="${c.id}">Открыть</button></article>`).join('')+'</div>';
}

/* инструмент на весь экран, видна только панель Милки */
function fit(){
  const w=document.getElementById('of-fs'),r=root();if(!w||!r)return;
  const rc=r.getBoundingClientRect();
  if(innerWidth>700){w.style.left=(PANEL_W||Math.max(0,Math.round(rc.left)))+'px';w.style.top='0';}
  else{w.style.left='0';w.style.top=(PANEL_H||Math.max(0,Math.round(rc.top)))+'px';}
  w.style.right='0';w.style.bottom='0';
}
addEventListener('resize',fit);
function openTool(c){
  scrollTo(0,0);
  root().innerHTML='<div class="of-fs" id="of-fs"><iframe src="'+esc(c.url)+'" allow="fullscreen;autoplay;clipboard-read;clipboard-write"></iframe></div>';
  /* точка отсчёта берётся от пустого корня, поэтому замеряем после вставки */
  fit();
}

/* ---------- клики ---------- */
document.addEventListener('click',async e=>{
  const r=root();if(!r||!r.contains(e.target))return;
  const t=e.target,ot=t.closest('[data-ot]');
  if(ot){tab=ot.dataset.ot;FB=null;view=null;applyFor=null;fineFor=null;SC=null;shell();return}
  if(view&&view.t==='blog')keepDraft();
  const pm=t.closest('[data-pm]');
  if(pm){const pp=PS.find(z=>String(z.id)===pm.dataset.pm);if(window.CMT&&CMT.report)CMT.report('post',+pm.dataset.pm,pp?pp.user_id:'');return}
  const dl=t.closest('[data-del]');
  if(dl&&view&&view.t==='blog'){
    try{
      if(!twice(dl,'Точно?'))return;
      const SB=window.SB,pid=+dl.dataset.del,pp=PS.find(z=>z.id===pid),r=await SB.from('posts').delete().eq('id',pid).select();
      if(r.error||!(r.data||[]).length){say('Не удалось удалить',1);return}
      const fp=pp&&pp.image_url?(pp.image_url.split('/posts/')[1]||''):'';
      if(fp)SB.storage.from('posts').remove([decodeURIComponent(fp.split('?')[0])]);
      say('Удалено');show();
    }catch(err){say(err.message||'Не получилось',1)}
    return;
  }
  const b=t.closest('[data-oa]');if(!b)return;
  const a=b.dataset.oa,id=b.dataset.id;
  try{
    if(a==='back'){view=null;show();return}
    if(a==='tool'){
      const c=CARDS.find(x=>x.id===id);if(!c)return;
      openTool(c);return;
    }
    if(a==='blog'){pg='posts';PD='';if(PI){URL.revokeObjectURL(PI.url);PI=null}view={t:'blog',b:+b.dataset.b,n:b.dataset.n};show();return}
    if(a==='fin'){FB=+b.dataset.b;tab='fin';shell();return}
    if(a==='all'){FB=null;tab='all';shell();return}
    if(a==='stf'){stF=b.dataset.k;show();return}
    if(a==='bizdel'){
      if(!twice(b,'Точно?'))return;
      await R('biz_forget',{p_id:+b.dataset.b});say('Удалено');show();return;
    }
    if(a==='fine'){fineFor=+b.dataset.b;show();return}
    if(a==='finex'){fineFor=null;show();return}
    if(a==='fineok'){
      await R('biz_fine',{p_id:+b.dataset.b,p_amt:+($('#of-fa').value||0),p_reason:$('#of-fr').value});
      fineFor=null;say('Штраф выписан');show();return;
    }
    if(a==='bmav'||a==='bmcv'){
      const isA=a==='bmav',bd=+b.dataset.b;
      pick(async f=>{try{say('Загружаем…');const d=await cropJpeg(f,isA?320:1600,isA?320:400,isA?.86:.8);await R('biz_blog_media',{p_bid:bd,p_which:isA?'avatar':'cover',p_data:d});say('Сохранено');show()}catch(err){say(err.message||'Не получилось',1)}});
      return;
    }
    if(a==='bmavx'||a==='bmcvx'){await R('biz_blog_media',{p_bid:+b.dataset.b,p_which:a==='bmavx'?'avatar':'cover',p_data:''});say('Убрано');show();return}
    if(a==='pgt'){pg=b.dataset.k;show();return}
    if(a==='tofm'){SC='biz';tab='fm';view=null;shell();return}
    if(a==='sc'){SC=b.dataset.k;show();return}
    if(a==='scback'){SC=null;show();return}
    if(a==='upt'){const f=document.getElementById('ou');f.hidden=!f.hidden;if(!f.hidden){f.scrollIntoView({behavior:'smooth',block:'nearest'});upLimit()}return}
    if(a==='fl'){if(window.FM&&FM.open)FM.open(id);return}
    if(a==='fdel'){
      if(!twice(b,'Точно?'))return;
      const r=await window.SB.from('flashes').delete().eq('id',id);
      if(r.error)throw r.error;say('Flash удалён');show();return;
    }
    if(a==='sub'){
      const SB=window.SB,u=await getUser(),bd=+b.dataset.b,on=b.classList.contains('g');
      const r=on?await SB.from('biz_follows').delete().match({biz_id:bd,user_id:u.id}):await SB.from('biz_follows').insert({biz_id:bd});
      if(r.error)throw r.error;show();return;
    }
    if(a==='pph'){
      pick(async f=>{try{const bl=await shrink(f,1280);if(PI)URL.revokeObjectURL(PI.url);PI={blob:bl,url:URL.createObjectURL(bl)};show()}catch(err){say('Не удалось открыть картинку',1)}});
      return;
    }
    if(a==='prm'){if(PI)URL.revokeObjectURL(PI.url);PI=null;show();return}
    if(a==='plk'){
      const SB=window.SB,u=await getUser(),pid=+id,p=PS.find(z=>z.id===pid);if(!p||!u)return;
      const on=LK.has(pid);p.post_likes=[{count:cn(p.post_likes)+(on?-1:1)}];on?LK.delete(pid):LK.add(pid);drawPosts();
      const r=on?await SB.from('post_likes').delete().match({post_id:pid,user_id:u.id}):await SB.from('post_likes').insert({post_id:pid});
      if(r.error)say('Не получилось: '+r.error.message,1);
      return;
    }
    if(a==='post'){
      const v=(($('#of-pt')||{}).value||'').trim();if(!v&&!PI)return;
      b.disabled=true;const SB=window.SB,u=await getUser();let url=null,path=null;
      if(PI){
        path=u.id+'/'+Date.now()+'.jpg';
        const up=await SB.storage.from('posts').upload(path,PI.blob,{contentType:'image/jpeg',cacheControl:'3600'});
        if(up.error)throw up.error;
        url=SB.storage.from('posts').getPublicUrl(path).data.publicUrl;
      }
      try{await R('biz_page_post',{p_bid:+b.dataset.b,p_body:v||' ',p_image:url})}catch(err){if(path)SB.storage.from('posts').remove([path]);throw err}
      if(PI)URL.revokeObjectURL(PI.url);PI=null;PD='';say('Опубликовано');show();return;
    }
    if(a==='blogmk'){await R('biz_blog_make',{bid:own().id});say('Блог создан');show();return}
    if(a==='vacmk'){const m=mgrBiz();const vs=$('#of-vs').value;await R('biz_vac_create',{bid:m.id,prole:$('#of-vr').value,pdescr:$('#of-vd').value,psalary:vs===''?null:+vs,pnego:$('#of-vn').checked});say('Вакансия опубликована');show();return}
    if(a==='vacx'){await R('biz_vac_close',{vid:+id});show();return}
    if(a==='yes'||a==='no'){
      const s=document.getElementById('of-s'+id);
      await R('biz_app_decide',{aid:+id,ok:a==='yes',sal:a==='yes'?(+(s&&s.value)||0):0});
      say(a==='yes'?'Сотрудник принят':'Отклик отклонён');show();return;
    }
    if(a==='end'){
      if(!twice(b,'Точно?'))return;
      await R('biz_staff_end',{sid:+id});
      O=norm(await R('biz_office'));say('Готово');
      if(!tabs().some(x=>x[0]===tab))tab=tabs()[0][0];
      shell();return;
    }
    if(a==='offmk'){
      const bd=+b.dataset.b,g=k=>document.getElementById(k+bd).value;
      await R('biz_offer_make',{p_bid:bd,p_nick:g('of-on-'),p_share:+g('of-os-'),p_price:+(g('of-op-')||0)});
      say('Предложение отправлено');show();return;
    }
    if(a==='offx'){await R('biz_offer_cancel',{p_id:+id});say('Предложение отозвано');show();return}
    if(a==='offyes'||a==='offno'){
      await R('biz_offer_answer',{p_id:+id,p_ok:a==='offyes'});
      O=norm(await R('biz_office'));
      if(!tabs().some(x=>x[0]===tab))tab=tabs()[0][0];
      shell();say(a==='offyes'?'Вы теперь сооснователь':'Вы отказались');return;
    }
    if(a==='apply'){applyFor=+id;show();return}
    if(a==='applyx'){applyFor=null;show();return}
    if(a==='send'){await R('biz_apply',{vid:+id,pmsg:$('#of-am').value});applyFor=null;say('Отклик отправлен');show();return}
  }catch(err){if(b)b.disabled=false;say(err.message||'Не получилось',1)}
});
document.addEventListener('input',e=>{
  if(e.target.id==='of-q'){qAll=e.target.value.trim().toLowerCase();const p=e.target.selectionStart;all().then(()=>{const q=$('#of-q');if(q){q.focus();q.setSelectionRange(p,p)}})}
});

async function init0(){
  const r=root();if(!r)return;
  r.innerHTML='<h2 class="sec" style="margin-top:0">MilkOffice</h2><div class="of-em">Загружаем…</div>';
  try{O=await R('biz_office')}catch(e){O=null}
  if(!O){r.innerHTML='<h2 class="sec" style="margin-top:0">MilkOffice</h2><div class="ofp"><p class="of-p">Чтобы открыть Офис, войди в аккаунт.</p></div>';return}
  norm(O);FB=null;view=null;applyFor=null;fineFor=null;SC=null;
  tab=tabs()[0][0];
  if(want){pg='posts';PD='';if(PI){URL.revokeObjectURL(PI.url);PI=null}view={t:'blog',b:want.b,n:want.n};want=null}
  shell();
}
let want=null,initBusy=false;
async function init(){if(initBusy)return;initBusy=true;try{await init0()}finally{initBusy=false}}
/* открыть страницу компании из других разделов (например, из ленты) */
window.OF={open:(b,n)=>{
  want={b:+b,n:n||''};
  if(window.MS&&MS.show)MS.show('office');
  setTimeout(()=>{if(want&&!initBusy)init()},300);
}};
window.RV=window.RV||{};
window.RV.office=init;
})();

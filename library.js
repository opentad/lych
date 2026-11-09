(function(){
const $=s=>document.querySelector(s);
let books=[],my={},meId=null,loading=true,errT='';
let lk=new Set(),prog={},pgT=0,bought=new Set();
const esc=t=>String(t==null?'':t).replace(/[<>&"]/g,m=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[m]));
const hue=t=>{let x=7;for(const ch of t)x=(x*31+ch.charCodeAt(0))>>>0;return x%360};
const cover=(b,cls)=>{if(b.cover)return `<div class="lb-cv ${cls||''}" style="background:url(${b.cover}) center/cover"></div>`;const h=hue(b.title);return `<div class="lb-cv ${cls||''}" style="background:linear-gradient(160deg,hsl(${h},70%,62%),hsl(${(h+35)%360},65%,44%))"><span>${esc(b.title)}</span></div>`};
const who=()=>(window.ME_NAME||'').trim()||'Автор';
const per=()=>window.matchMedia('(max-width:700px)').matches?1:2;
const avg=b=>b.rc?(b.rs/b.rc).toFixed(1).replace('.',',')+' ★ · оценок: '+b.rc:'Пока нет оценок';
const getSB=()=>new Promise(res=>{let n=0;const t=setInterval(()=>{if(window.SB){clearInterval(t);res(window.SB)}else if(++n>60){clearInterval(t);res(null)}},100)});
const PLUS='<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
const PEN='<svg viewBox="0 0 24 24"><path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1zM14.5 6.5l3 3"/></svg>';
const UPL='<svg viewBox="0 0 24 24"><path d="M7.5 3.5h6.8l4.7 4.7v9.8a3 3 0 0 1-3 3H7.5a3 3 0 0 1-3-3V6.5a3 3 0 0 1 3-3zM12 17v-6M9.5 13.5L12 11l2.5 2.5"/></svg>';
const BACK='<svg viewBox="0 0 24 24"><path d="M12 6l-6 6 6 6M19 6l-6 6 6 6"/></svg>';
const DOTS='<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>';
const TRS='<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>';
const ARC='<svg viewBox="0 0 24 24"><path d="M3 5h18v4H3zM5 9v10h14V9M10 13h4"/></svg>';
const EYE='<svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const HRT='<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3 5 6.5 5c2.1 0 3.9 1.2 5.5 3 1.6-1.8 3.4-3 5.5-3C21 5 22.8 8.6 21.5 11.8 19.5 16.4 12 21 12 21z"/></svg>';
const hr=id=>`<span class="lb-hr${lk.has(id)?' on':''}" data-h="${id}" role="button" aria-label="Нравится">${HRT}</span>`;

const st=document.createElement('style');st.textContent=`
#v-lib{padding-bottom:70px}
.sw svg{width:15px;height:15px}
.lb-hb{display:flex;gap:10px;flex-wrap:wrap}
.lb-top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.lb-ok{margin-top:16px;padding:12px 18px;border-radius:14px;background:#e7f6e5;color:var(--ok);font-weight:600;font-size:13px}
.lb-ok.bad{background:#fff1e0;color:#d97706}
.lb-g{display:grid;grid-template-columns:300px 1fr;gap:22px;margin-top:22px;align-items:start}
.lb-books{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.lb-b{text-align:left;background:#fff;border-radius:20px;padding:12px;box-shadow:0 6px 30px rgba(0,0,0,.04)}
.lb-b b{display:block;font-size:14px;font-weight:600;margin:10px 4px 2px;line-height:1.25;color:#34404e}
.lb-b small{display:block;font-size:11px;color:var(--mu);margin:0 4px 4px}
.lb-cv{position:relative;border-radius:6px 12px 12px 6px;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,.15)}
.lb-cv::before{content:'';position:absolute;left:0;top:0;bottom:0;width:8%;background:rgba(0,0,0,.18)}
.lb-cv span{position:relative;padding:0 14px;line-height:1.2;font-size:15px}
.lb-b .lb-cv{aspect-ratio:3/4}
.lb-it{display:flex;gap:10px;align-items:center;width:100%;text-align:left;padding:8px;border:1px solid var(--ln);border-radius:14px;margin-bottom:8px;cursor:pointer}
.lb-it .lb-cv{width:42px;height:56px;flex:none}.lb-it .lb-cv span{font-size:6px;padding:0 4px}
.lb-it div{flex:1;min-width:0}.lb-it b{display:block;font-size:13px;font-weight:600;line-height:1.2}
.lb-it small{display:block;font-size:10px;color:var(--mu);margin-top:3px}
.lb-it em{font-style:normal;font-size:11px;font-weight:700;color:var(--bt)}
.lb-n{width:14px;font-style:normal;font-weight:700;color:var(--cy);font-size:13px}
.lb-ed{width:36px;height:36px;border-radius:50%;background:var(--pl);color:var(--cy);display:grid;place-items:center;flex:none}.lb-ed svg{width:16px;height:16px}
.lb-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.lb-bar .r{display:flex;gap:10px;flex-wrap:wrap}
.lb-btn{height:36px;padding:0 18px;border-radius:18px;background:var(--cy);color:#fff;font-weight:600;font-size:13px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer}
.lb-btn.gn{background:#2fbf5a}.lb-btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.lb-btn:disabled{opacity:.6}
.lb-btn.big{height:46px;padding:0 38px;font-size:15px;align-self:flex-start;margin-top:14px}
.lb-info{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 110px);border-radius:25px;overflow:hidden;background:#fff;box-shadow:0 6px 30px rgba(0,0,0,.08)}
.lb-l{background:radial-gradient(circle at 30% 20%,#1c3a5c,#0b1626);display:grid;place-items:center;padding:30px}
.lb-l .lb-cv{width:min(100%,340px,calc(60vh*.75));aspect-ratio:3/4;box-shadow:0 20px 60px rgba(0,0,0,.6)}
.lb-l .lb-cv span{font-size:26px}
.lb-r{padding:40px 36px;display:flex;flex-direction:column;gap:8px;overflow:auto}
.lb-r h1{font-weight:800;font-size:30px;color:#34404e;margin:0;line-height:1.15}
.lb-au{font-size:13px;color:var(--mu)}
.lb-r h3{font-size:14px;font-weight:600;color:var(--hd);margin-top:14px}
.lb-r p{font-size:14px;line-height:1.7;color:#566170}
.lb-stars{display:flex;gap:2px;align-items:center;margin-top:10px}
.lb-st{font-size:32px;line-height:1;color:#d5dbe0;padding:0 2px}.lb-st.on{color:#f5b81c}
.lb-avg{font-size:13px;font-weight:600;color:#566170}
.lb-tt{display:flex;align-items:center;gap:10px;justify-content:center;margin:20px 0 6px}
.lb-tt h2{font-size:22px;font-weight:700;color:#fff}
.lb-tt input{font:inherit;font-size:22px;font-weight:700;color:#fff;border:0;border-bottom:2px solid var(--cy);outline:0;background:transparent;text-align:center;max-width:80vw}
.lb-pen{width:34px;height:34px;border-radius:50%;background:var(--pl);color:var(--cy);display:grid;place-items:center}.lb-pen svg{width:16px;height:16px}
.lb-desc{display:block;width:100%;max-width:980px;margin:6px auto 0;height:56px;border:1px solid #dfe5ea;border-radius:14px;padding:10px 14px;font:inherit;font-size:13px;resize:none;outline:0;background:#fff}
.lb-sp{display:grid;grid-template-columns:1fr 1fr;max-width:980px;margin:10px auto 0;background:#fffdf7;border-radius:18px;box-shadow:0 14px 50px rgba(0,0,0,.12);overflow:hidden;position:relative}
.lb-sp::after{content:'';position:absolute;left:50%;top:0;bottom:0;width:40px;margin-left:-20px;background:linear-gradient(90deg,transparent,rgba(0,0,0,.08),transparent);pointer-events:none}
.lb-sp.one{grid-template-columns:1fr;max-width:560px}
.lb-sp.one::after{display:none}.lb-sp.one .pgw+.pgw{display:none}
.pgw{position:relative}
.pg{display:block;width:100%;height:min(60vh,470px);border:0;outline:0;resize:none;background:transparent;padding:30px 32px 10px;font:inherit;font-size:14px;line-height:1.7;color:#34404e;overflow:hidden;scrollbar-width:none}
.pg::-webkit-scrollbar{display:none;width:0;height:0}
.pn{text-align:center;font-size:11px;color:var(--mu);padding:0 0 12px}
.meas{position:absolute;left:0;top:0;visibility:hidden;pointer-events:none}
.lb-nav{display:flex;gap:16px;justify-content:center;align-items:center;margin:18px 0;font-size:13px;color:#566170}
.lb-nav .go:disabled{opacity:.4}
.lb-sh{margin:22px 0 8px;font-size:13px;font-weight:600;color:#9aa4ae}
.lb-hint{font-size:11px;color:#9aa4ae;margin:-2px 0 10px}
.lb-it{position:relative}
.lb-ed svg,.lb-mn svg{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.lb-mn{position:absolute;right:8px;top:48px;z-index:5;background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.18);padding:6px;min-width:170px}
.lb-mn button{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border-radius:10px;font-size:13px;text-align:left;color:#34404e}
.lb-mn button:hover{background:var(--pl)}
.lb-mn svg{width:16px;height:16px}
.lb-mn .red{color:#e5484d}
.lb-tabs{display:flex;justify-content:center;margin:18px 0 0;font-size:14px;font-weight:600}
.lb-tabs button{padding:4px 16px;color:#9aa4ae}
.lb-tabs button+button{border-left:1.5px solid #d5dbe0}
.lb-tabs .on{color:var(--cy)}
#lb-cvp{display:flex;flex-direction:column;align-items:center;gap:14px;margin:14px 0}
#lb-cvp[hidden],.lb-rg[hidden]{display:none}
.lb-cvw .lb-cv{width:240px;aspect-ratio:3/4}
.lb-cvw canvas{width:240px;border-radius:6px 12px 12px 6px;box-shadow:0 4px 14px rgba(0,0,0,.15)}
.lb-rg{display:flex;flex-direction:column;gap:8px;width:240px;font-size:12px;color:#566170}
.lb-rg input{width:100%}
.lb-fin{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:6px 0}
.lb-btn.gr{background:#fff;color:var(--cy);border:1.5px solid var(--cy)}
.lb-md{position:fixed;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;z-index:999;padding:20px}
.lb-mb{background:linear-gradient(160deg,#17294a,#0b1626);border:1px solid rgba(255,255,255,.12);box-shadow:0 20px 60px rgba(0,0,0,.5);border-radius:20px;padding:24px;max-width:340px;width:100%;text-align:center;color:#e8eef7}
.lb-mb p{font-size:14px;line-height:1.5;color:#e8eef7;margin-bottom:18px}
.lb-mb div{display:flex;gap:10px;justify-content:center}
.lb-mb label{color:#dfe8f4}
.lb-mb input[type=radio]{accent-color:var(--cy)}
.lb-mb textarea{background:rgba(255,255,255,.06);color:#e8eef7;border-color:rgba(255,255,255,.18)!important}
.lb-mb textarea::placeholder{color:#8fa0b8}
.lb-mb .lb-btn.gr{background:transparent;color:var(--cy)}
.lb-btn.rd{background:#e5484d}
@media(max-width:820px){.lb-g{grid-template-columns:1fr}}
@media(max-width:700px),(orientation:portrait){.lb-info{grid-template-columns:1fr;min-height:0}.lb-l{padding:24px}.lb-r{padding:24px 20px}}
@media(max-width:560px){.lb-books{grid-template-columns:repeat(2,1fr)}.pg{padding:24px 20px 10px}}`;
document.head.appendChild(st);

const sec=document.createElement('section');sec.id='v-lib';sec.hidden=true;$('.main').appendChild(sec);
let ret='list',mode='list',cur=null,pages=[''],sp=0,title='Без названия',desc='',ro=false,tas=[],meas=null,flash='',fbad=0,lastP=per(),busy=false;
const note=(t,bad)=>{flash=t;fbad=bad?1:0};
const banner=()=>{const h=flash?`<div class="lb-ok${fbad?' bad':''}">${esc(flash)}</div>`:'';flash='';return h};

async function load(){
  loading=true;errT='';
  const SB=await getSB();
  if(!SB){loading=false;errT='Нет связи с сервером. Проверь интернет и обнови страницу.';return}
  const u=(await SB.auth.getUser()).data.user;meId=u?u.id:null;
  if(meId)await SB.from('library_books').delete().eq('user_id',meId).eq('status','archived').lt('archived_at',new Date(Date.now()-90*864e5).toISOString());
  const [b,r,l,pg,bu]=await Promise.all([
    SB.from('library_books').select('id,user_id,title,author,descr,reads,created_at,status,cover,archived_at,genres,price,free_pages').order('created_at',{ascending:false}).limit(300),
    SB.from('library_rates').select('book_id,rating,user_id'),
    SB.from('library_likes').select('book_id'),
    SB.from('library_progress').select('book_id,page'),
    SB.from('library_buys').select('book_id')]);
  loading=false;
  if(b.error){books=[];errT='Не удалось загрузить книги: '+b.error.message+'. Проверь, что SQL выполнен.';return}
  const R={};my={};
  lk=new Set((l.data||[]).map(x=>x.book_id));
  bought=new Set((bu.data||[]).map(x=>x.book_id));
  prog={};(pg.data||[]).forEach(x=>{prog[x.book_id]=x.page});
  (r.data||[]).forEach(x=>{const s=R[x.book_id]||(R[x.book_id]={s:0,c:0});s.s+=x.rating;s.c++;if(x.user_id===meId)my[x.book_id]=x.rating});
  books=b.data.map(x=>({status:x.status||'published',cover:x.cover,genres:x.genres||[],price:x.price||0,fp:x.free_pages||0,id:x.id,uid:x.user_id,title:x.title,author:x.author||'Автор',desc:x.descr,reads:x.reads||0,date:Date.parse(x.created_at),rs:(R[x.id]||{s:0}).s,rc:(R[x.id]||{c:0}).c}));
}
const refresh=()=>load().then(()=>{if(!sec.hidden&&(mode==='list'||mode==='mine'||mode==='liked'))render(1)});

function listV(){
  const pub=books.filter(b=>b.status==='published'),top=[...pub].sort((a,b)=>b.reads-a.reads).slice(0,5),all=pub,ok=banner();
  const em=loading?'Загружаем…':'Пока пусто';
  sec.innerHTML=`<div class="top lb-top"><div class="lb-hb"><button class="lb-btn gr" data-a="mine">Мои работы</button></div><div class="lb-hb"><button class="lb-btn gr lb-hbtn" data-a="liked" aria-label="Понравившиеся">${HRT}</button><button class="lb-btn" data-a="new">${PLUS}Загрузить</button></div></div>${ok}${errT?`<div class="lb-ok bad">${esc(errT)}</div>`:''}
  <div class="lb-g"><section class="card"><div class="hd"><h2>Топ книг недели</h2></div><div class="hd2">Самые читаемые</div>${top.length?top.map((b,i)=>`<button class="lb-it" data-o="${b.id}"><i class="lb-n">${i+1}</i>${cover(b)}<div><b>${esc(b.title)}</b><small>${esc(b.author)}</small></div><em>Открыть ›</em></button>`).join(''):'<div class="fr">'+em+'</div>'}</section>
  <section>${all.length?`<div class="lb-books">${all.map(b=>`<button class="lb-b" data-o="${b.id}">${hr(b.id)}${cover(b)}<b>${esc(b.title)}</b><small>${esc(b.author)}</small></button>`).join('')}</div>`:'<div class="card">'+(loading?'Загружаем…':'Книг пока нет. Нажми «Загрузить» и опубликуй первую!')+'</div>'}</section></div>`;
}
let menuId=0;
const AP=[['edit',PEN,'Редактировать'],['arch',ARC,'В архив'],['del',TRS,'Удалить']];
const AD=[['edit',PEN,'Редактировать'],['pub',UPL,'Опубликовать'],['del',TRS,'Удалить']];
const AA=[['pub',UPL,'Опубликовать'],['edit',PEN,'Редактировать'],['del',TRS,'Удалить']];
function mineV(){
  const mb=books.filter(b=>meId&&b.uid===meId),ok=banner();
  const P=mb.filter(b=>b.status==='published'),D=mb.filter(b=>b.status==='draft'),A=mb.filter(b=>b.status==='archived');
  const row=(b,i,acts)=>`<div class="lb-it" data-o="${b.id}"><i class="lb-n">${i+1}</i>${cover(b)}<div><b>${esc(b.title)}</b><small>${esc(b.author)}</small></div><button class="lb-ed" data-m="${b.id}" aria-label="Меню">${DOTS}</button>${menuId===b.id?`<div class="lb-mn">${acts.map(a=>`<button data-act="${a[0]}" data-id="${b.id}"${a[0]==='del'?' class="red"':''}>${a[1]}${a[2]}</button>`).join('')}</div>`:''}</div>`;
  const sect=(name,list,acts,hint,always)=>(list.length||always)?`<div class="lb-sh">${name}</div>${hint?'<div class="lb-hint">'+hint+'</div>':''}${list.length?list.map((b,i)=>row(b,i,acts)).join(''):'<div class="fr">Пока пусто</div>'}`:'';
  const body=!meId&&!loading?'<div class="fr">Войди в аккаунт, чтобы видеть свои работы.</div>':sect('Опубликованные',P,AP,'',1)+sect('Черновики',D,AD,'',1)+sect('Архив',A,AA,'Если книгу не трогать 90 дней, она удалится автоматически.');
  sec.innerHTML=`<div class="top"><div><div class="cap">Библиотека</div><h1>Мои работы</h1></div><div class="lb-hb"><button class="back" id="lb-back" style="margin:0">${BACK}Назад</button><button class="lb-btn" data-a="new">${PLUS}Загрузить</button></div></div>${ok}<section class="card" style="margin-top:22px;max-width:560px">${body}</section>`;
}

let tab='book',ccov='',cimg=null,cz=1,cx=.5,cy=.5,gen=[],gOpen=false,gTmp=[],paid=false,price=20,freeOn=false,freeN=10;

const render=keep=>{if(mode==='list'||mode==='mine'||mode==='liked')ret=mode;mode==='liked'?likedV():mode==='list'?listV():mode==='mine'?mineV():mode==='info'?infoV():editV();if(!keep)window.scrollTo(0,0)};
const msg=(t,ok)=>{const m=$('#lb-msg');if(m){m.className='fb '+(ok?'ok2':'bad');m.textContent=t}};
function editTitle(){
  const box=$('#lb-tt');box.innerHTML='<input maxlength="60" value="'+esc(title)+'">';
  const i=box.firstChild;let d=0;i.focus();i.select();
  i.onblur=()=>{if(d)return;d=1;title=i.value.trim()||'Без названия';tt()};
  i.onkeydown=e=>{if(e.key==='Enter')i.blur()};
}
function fits(t){meas.value=t;return meas.scrollHeight<=meas.clientHeight+1}
function paginate(text){
  const tk=text.match(/\S+\s*|\s+/g)||[],out=[];let i=0;
  while(i<tk.length){
    let lo=1,hi=tk.length-i,best=0;
    while(lo<=hi){const m=(lo+hi)>>1;if(fits(tk.slice(i,i+m).join(''))){best=m;lo=m+1}else hi=m-1}
    if(!best){const w=tk[i];let a=1,b=w.length,c=1;while(a<=b){const m=(a+b)>>1;if(fits(w.slice(0,m))){c=m;a=m+1}else b=m-1}
      out.push(w.slice(0,c));tk[i]=w.slice(c);if(!tk[i])i++;continue}
    out.push(tk.slice(i,i+best).join(''));i+=best;
  }
  return out.length?out:[''];
}

const ask=(t,ok,red)=>new Promise(res=>{
  const d=document.createElement('div');d.className='lb-md';
  d.innerHTML=`<div class="lb-mb"><p>${esc(t)}</p><div><button class="lb-btn gr" data-v="0">Отмена</button><button class="lb-btn${red?' rd':' gn'}" data-v="1">${esc(ok)}</button></div></div>`;
  d.onclick=e=>{const v=e.target.closest('[data-v]');if(v||e.target===d){d.remove();res(!!v&&v.dataset.v==='1')}};
  document.body.appendChild(d);
});
async function save(status){
  if(busy)return;
  const text=pages.join('').trim();
  if(title==='Без названия'){msg('Дай книге название: карандашик над разворотом.',0);return}
  if(paid&&!(price>=20)){msg('Цена не может быть меньше 20.',0);return}
  if(status==='published'&&text.length<20){msg('Напиши хотя бы пару предложений.',0);return}
  if(status==='published'&&!(cur&&cur.status==='published')&&!(await ask('Опубликовать книгу «'+title+'»? Её увидят все участники.','Опубликовать')))return;
  const SB=await getSB(),u=SB?(await SB.auth.getUser()).data.user:null;
  if(!u){msg('Чтобы сохранить, войди в аккаунт.',0);return}
  busy=true;['#lb-pub','#lb-draft'].forEach(s=>{const x=$(s);if(x)x.disabled=true});msg('Сохраняем…',1);
  const d={title,body:text,descr:desc.trim(),genres:gen,price:paid?price:0,free_pages:paid&&freeOn?freeN:0,cover:ccov||null,status,archived_at:null,deco:fixDeco()};
  const r=cur?await SB.from('library_books').update(d).eq('id',cur.id).select('id')
    :await SB.from('library_books').insert({...d,author:who()}).select('id');
  busy=false;
  if(r.error||!(r.data||[]).length){['#lb-pub','#lb-draft'].forEach(s=>{const x=$(s);if(x)x.disabled=false});msg('Не получилось: '+(r.error?r.error.message:'нет прав'),0);return}
  note(status==='draft'?'Черновик сохранён ✓':cur?'Изменения сохранены ✓':'Книга «'+title+'» опубликована ✓');
  mode=(status==='published'&&!cur)?'list':'mine';cur=null;
  await load();render();
}
async function act(a,id){
  const b=books.find(x=>x.id===id);if(!b)return;menuId=0;
  if(a==='edit'){editBook(id);return}
  if(a==='del'&&!(await ask('Удалить «'+b.title+'» навсегда? Это нельзя отменить.','Удалить',1)))return;
  if(a==='pub'&&!(await ask('Опубликовать «'+b.title+'»? Её увидят все пользователи платформы.','Опубликовать')))return;
  const SB=await getSB();if(!SB)return;
  const r=a==='del'?await SB.from('library_books').delete().eq('id',id)
    :await SB.from('library_books').update(a==='arch'?{status:'archived',archived_at:new Date().toISOString()}:{status:'published',archived_at:null}).eq('id',id);
  if(r.error)note('Не получилось: '+r.error.message,1);else note(a==='del'?'Книга удалена':a==='arch'?'Книга в архиве':'Книга опубликована ✓');
  await load();render(1);
}
const loadM=()=>new Promise((ok,no)=>{if(window.mammoth)return ok();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});

sec.addEventListener('click',e=>{
  const c=k=>e.target.closest(k);
  if(c('[data-act]')){act(c('[data-act]').dataset.act,+c('[data-act]').dataset.id);return}
  if(c('[data-m]')){const i=+c('[data-m]').dataset.m;menuId=menuId===i?0:i;render(1);return}
  if(menuId&&!c('.lb-mn')){menuId=0;render(1);return}
  if(c('[data-t]')){tab=c('[data-t]').dataset.t;$('#lb-cvp').hidden=tab!=='cover';$('#lb-bk').hidden=tab!=='book';sec.querySelectorAll('.lb-tabs button').forEach(x=>x.classList.toggle('on',x.dataset.t===tab));if(tab==='book')fill();return}
  if(c('#lb-imgb')){$('#lb-img').click();return}
  if(c('#lb-draft')){save('draft');return}
  if(c('[data-e]'))editBook(+c('[data-e]').dataset.e);
  else if(c('[data-a="mine"]')){mode='mine';render()}
  else if(c('[data-o]'))openBook(+c('[data-o]').dataset.o);
  else if(c('[data-a="new"]'))newBook();
  else if(c('[data-r]'))rate(+c('[data-r]').dataset.r);
  else if(c('#lb-read'))readBook();
  else if(c('#lb-back')){mode=mode==='read'?'info':((mode==='info'||mode==='edit')&&(ret==='mine'||ret==='liked'))?ret:'list';render()}
  else if(c('#lb-pen'))editTitle();
  else if(c('#lb-pv')){sp=Math.max(0,sp-1);fill()}
  else if(c('#lb-nx')){if(per()*(sp+1)<pages.length){sp++;fill()}}
  else if(c('#lb-word'))$('#lb-file').click();
  else if(c('#lb-pub'))save('published');
});
sec.addEventListener('input',e=>{
  const ta=e.target;
  if(ta.id==='lb-z'||ta.id==='lb-x'||ta.id==='lb-y'){cz=+$('#lb-z').value;cx=+$('#lb-x').value;cy=+$('#lb-y').value;drawCov();return}
  if(ta.id==='lb-desc'){desc=ta.value;return}
  if(!ta.classList.contains('pg')||ta.classList.contains('meas')||ro)return;
  const P=per(),k=+ta.dataset.i,p=P*sp+k,caret=ta.selectionStart;
  while(pages.length<=p)pages.push('');
  pages[p]=ta.value;
  const np=paginate(pages.slice(p).join(''));pages.splice(p,pages.length-p,...np);
  if(P===2&&pages.length%2)pages.push('');
  if(np.length>1&&caret>np[0].length){
    const off=caret-np[0].length;let nk=k+1;if(nk>=P){sp++;nk=0}
    fill();tas[nk].focus();tas[nk].setSelectionRange(off,off);
  }else{fill();ta.setSelectionRange(caret,caret)}
});
sec.addEventListener('change',async e=>{
  if(e.target.id==='lb-img'){const f=e.target.files[0];if(!f)return;const im=new Image();im.onload=()=>{cimg=im;cz=1;cx=.5;cy=.5;$('#lb-z').value=1;$('#lb-x').value=.5;$('#lb-y').value=.5;covPrev()};im.src=URL.createObjectURL(f);e.target.value='';return}
  if(e.target.id!=='lb-file')return;const f=e.target.files[0];if(!f)return;
  msg('Читаю файл…',1);
  try{
    await loadM();
    const r=await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()});
    pages=paginate(r.value.trim());if(per()===2&&pages.length%2)pages.push('');sp=0;
    if(title==='Без названия'){title=f.name.replace(/\.docx$/i,'');tt()}
    fill();msg('Готово. Страниц: '+pages.length,1);
  }catch(err){msg('Не получилось прочитать файл. Нужен формат .docx',0)}
  e.target.value='';
});
addEventListener('resize',()=>{
  if(sec.hidden||(mode!=='edit'&&mode!=='read')||tab==='cover'||tab==='pay')return;
  const P=per();if(P===lastP)return;lastP=P;
  pages=paginate(pages.join(''));if(P===2&&pages.length%2)pages.push('');sp=0;fill();
});
document.addEventListener('sb',()=>{if(!sec.hidden)refresh()});
window.RV=window.RV||{};window.RV.lib=()=>{mode='list';render();refresh()};

/* ===== ОФОРМЛЕНИЕ КНИГИ ===== */
const lkf=document.createElement('link');lkf.rel='stylesheet';
lkf.href='https://fonts.googleapis.com/css2?family=Literata:wght@400;500&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=EB+Garamond:wght@400;500&family=Cormorant+Garamond:wght@500;600&family=Playfair+Display:wght@400;500&display=swap';
document.head.appendChild(lkf);
const st2=document.createElement('style');st2.textContent=`
.lb-sp .pg{font-size:var(--fs,14px)}
.lb-sd{display:none;background:#fff;border-radius:18px;padding:14px;box-shadow:0 6px 30px rgba(0,0,0,.05);margin:14px auto 0;max-width:560px}
#lb-bk.deco .lb-sd{display:block}
#lb-bk.side{display:grid;grid-template-columns:190px auto 190px;grid-template-areas:'fp mid sk';gap:18px;justify-content:center;align-items:start}
#lb-bk.side .lb-sd{margin:10px 0 0;max-width:none}
.lb-fp{grid-area:fp}.lb-mid{grid-area:mid}.lb-sk{grid-area:sk}
.lb-sd .lb-sh{margin:0 0 10px}
.fnb{display:flex;gap:8px;align-items:baseline;width:100%;text-align:left;padding:9px 10px;border-radius:12px;font-size:15px;color:#34404e}
.fnb.on{background:var(--pl);color:var(--bt)}
.skg{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.skb{padding:8px;border:1px solid var(--ln);border-radius:12px;background:#fafcfd}
@media(max-width:900px){.skg{grid-template-columns:repeat(3,1fr)}}
.lb-im{display:flex;flex-direction:column;align-items:center;gap:6px;margin:14px 0 4px}
.lb-im small{font-size:11px;color:#9aa4ae}
#lb-pic svg{width:22px;height:22px}
.stl{position:absolute;inset:0;pointer-events:none;container-type:inline-size}
.stk{position:absolute;pointer-events:auto;box-sizing:border-box;display:flex;align-items:center;color:#34404e}
.stk.on{outline:1.5px dashed var(--cy)}
.stk textarea.stt{position:relative;z-index:1;flex:1;min-width:0;width:100%;height:100%;border:0;outline:0;background:transparent;resize:none;overflow:hidden;text-align:center;font-family:inherit;font-style:inherit;font-weight:inherit;font-size:3.2cqw;line-height:1.25;color:inherit;padding:.5em .6em;cursor:text}
@supports (field-sizing:content){.stk textarea.stt{height:auto;max-height:100%;flex:none;field-sizing:content}}
.stk textarea[readonly]{pointer-events:none}
.stk .sg,.stk .sx,.stk .sr{display:none;position:absolute;z-index:4;width:24px;height:24px;border-radius:50%;background:var(--cy);color:#fff;font-style:normal;font-size:13px;line-height:1;place-items:center;box-shadow:0 2px 6px rgba(0,0,0,.3);touch-action:none;cursor:pointer}
.stk.on .sg,.stk.on .sx,.stk.on .sr,.stk:hover .sg,.stk:hover .sx,.stk:hover .sr{display:grid}
.stk .sg{left:-9px;top:-9px;cursor:grab}.stk .sx{right:-9px;top:-9px;background:#e5484d}.stk .sr{right:-9px;bottom:-9px;cursor:nwse-resize}
.k-img{box-shadow:0 4px 14px rgba(0,0,0,.2)}.k-img img{width:100%;height:100%;display:block;pointer-events:none}
.k-bubble{background:#fff;border:2px solid #34404e;border-radius:18px}
.k-bubble::after{content:'';position:absolute;left:16%;bottom:-10px;width:14px;height:14px;background:#fff;border-right:2px solid #34404e;border-bottom:2px solid #34404e;transform:rotate(45deg)}
.k-think{background:#f3f0ff;border:2px solid #7b6cf6;border-radius:50%/60%}
.k-think::after{content:'';position:absolute;left:14%;bottom:-14px;width:11px;height:11px;border-radius:50%;background:#f3f0ff;border:2px solid #7b6cf6}
.k-n1,.k-n2,.k-n3{border-radius:3px 3px 3px 18px;box-shadow:0 6px 14px rgba(0,0,0,.18);transform:rotate(-2deg)}
.k-n1{background:#fff3a8}.k-n2{background:#ffd3de}.k-n3{background:#c9f3dc}
.k-rib::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,#0ad1f8,#17b3e6);clip-path:polygon(0 0,100% 0,96% 50%,100% 100%,0 100%,4% 50%)}
.k-plate{background:linear-gradient(135deg,#ffe8c8,#fdd9a8);border-radius:14px;box-shadow:0 3px 10px rgba(0,0,0,.12)}
.k-mark{background:linear-gradient(transparent 35%,#ffe240 35%,#ffe240 90%,transparent 90%)}
.k-frame{background:#f1fcff;border-left:6px solid var(--cy);border-radius:4px 14px 14px 4px}
.k-tape{background:repeating-linear-gradient(135deg,#ffe27a 0 10px,#fff3b8 10px 20px);transform:rotate(-3deg);box-shadow:0 2px 6px rgba(0,0,0,.15)}
.k-badge{background:#e5484d;border-radius:50%}
.k-rib,.k-badge{color:#fff}
.k-rib textarea.stt,.k-plate textarea.stt,.k-badge textarea.stt,.k-mark textarea.stt{font-weight:700}
.k-rib textarea.stt,.k-plate textarea.stt{font-size:4.2cqw}
.k-badge textarea.stt{font-size:6cqw}
.k-rib textarea.stt,.k-plate textarea.stt,.k-mark textarea.stt,.k-tape textarea.stt,.k-badge textarea.stt{padding:.15em .5em}
.pv{position:relative;width:100%;height:46px;justify-content:center;font-size:12px;pointer-events:none;transform:none!important}
.pv span{position:relative;z-index:1}
.pv.k-badge{width:46px;margin:0 auto}`;
document.head.appendChild(st2);

const IMGI='<svg viewBox="0 0 24 24"><path d="M12.5 19H5.5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v6"/><circle cx="8.5" cy="9" r="1.4"/><path d="M3.5 16l4.2-4.2 3.3 3.3 2-2"/><circle cx="18.5" cy="18.5" r="4.5" fill="currentColor" stroke="none"/><path d="M18.5 16.3v4.4M16.3 18.5h4.4" stroke="#fff"/></svg>';
const FN=[
['def','Стандартный','Montserrat,system-ui,sans-serif','normal',400,14],
['lit','Literata','Literata,Georgia,serif','normal',400,14],
['pts','PT Serif',"'PT Serif',Georgia,serif",'normal',400,14],
['lor','Lora','Lora,Georgia,serif','normal',400,14],
['loi','Lora курсив','Lora,Georgia,serif','italic',400,14],
['gar','EB Garamond',"'EB Garamond',Georgia,serif",'normal',400,16],
['cor','Cormorant тонкий',"'Cormorant Garamond',Georgia,serif",'normal',500,17],
['ply','Playfair',"'Playfair Display',Georgia,serif",'normal',400,14]];
const SK=[['bubble','Реплика','Привет!',44,17],['think','Мысль','Хм…',44,17],['n1','Заметка','Заметка',30,22],['n2','Розовая','Заметка',30,22],['n3','Мятная','Заметка',30,22],['rib','Лента','Заголовок',62,9],['plate','Плашка','Заголовок',62,9],['mark','Маркер','Важное',50,7],['frame','Цитата','Цитата',62,15],['tape','Скотч','Подпись',36,6],['badge','Значок','!',14,14]];
let deco={font:'def',st:[]};
const num=(v,a,b,d)=>Math.min(b,Math.max(a,+v||d));
const normDeco=d=>({font:FN.some(f=>f[0]===(d&&d.font))?d.font:'def',st:((d&&Array.isArray(d.st))?d.st:[]).slice(0,80).map(o=>({id:String(o.id||'').replace(/\W/g,'').slice(0,20)||('s'+Math.random().toString(36).slice(2,8)),p:num(o.p,0,9999,0),t:(o.t==='img'||SK.some(k=>k[0]===o.t))?o.t:'n1',x:num(o.x,0,95,10),y:num(o.y,0,95,10),w:num(o.w,8,100,30),h:num(o.h,4,100,10),txt:String(o.txt||'').slice(0,120),src:/^data:image\//.test(o.src||'')?o.src:'',ar:num(o.ar,.1,10,1)}))});
const fixDeco=()=>({font:deco.font,st:deco.st.map(o=>({...o,p:Math.min(o.p,Math.max(0,pages.length-1))}))});

function styleFont(){const s=sec.querySelector('.lb-sp');if(!s)return;const f=FN.find(x=>x[0]===deco.font)||FN[0];s.style.fontFamily=f[2];s.style.fontStyle=f[3];s.style.fontWeight=f[4];s.style.setProperty('--fs',f[5]+'px')}
const loadFont=()=>{const f=FN.find(x=>x[0]===deco.font)||FN[0];return Promise.race([document.fonts.load(f[3]+' '+f[4]+' 16px '+f[2].split(',')[0],'Аб'),new Promise(r=>setTimeout(r,2000))]).catch(()=>{})};
function repag(){pages=paginate(pages.join(''));if(per()===2&&pages.length%2)pages.push('');if(per()*sp>=pages.length)sp=Math.max(0,Math.ceil(pages.length/per())-1)}
async function setFont(id){deco.font=id;renderSide();styleFont();await loadFont();if(!sec.querySelector('.lb-sp')||tab==='cover'||tab==='pay')return;repag();fill()}

function renderSide(){
  const fp=$('#lb-fp'),sk=$('#lb-sk');if(!fp||!sk)return;
  fp.innerHTML='<div class="lb-sh">Шрифт</div>'+FN.map(f=>`<button class="fnb${f[0]===deco.font?' on':''}" data-f="${f[0]}" style="font-family:${f[2]};font-style:${f[3]};font-weight:${f[4]}"><b>Аа</b> ${f[1]}</button>`).join('');
  sk.innerHTML='<div class="lb-sh">Стикеры</div><div class="skg">'+SK.map(k=>`<button class="skb" data-sk="${k[0]}"><span class="stk k-${k[0]} pv"><span>${k[1]}</span></span></button>`).join('')+'</div><div class="lb-hint" style="margin-top:10px">Нажми на стикер, он появится на странице. Двигай за ✥, меняй размер за уголок, пиши прямо на нём.</div>';
}
const stHTML=p=>deco.st.filter(o=>(o.p>=pages.length?pages.length-1:o.p)===p).map(o=>{
  const ctl=ro?'':'<i class="sg">✥</i><i class="sx">×</i><i class="sr">⇲</i>';
  const inner=o.t==='img'?'<img src="'+esc(o.src)+'" alt="" draggable="false">':'<textarea class="stt" rows="1" maxlength="120" placeholder="Пиши…"'+(ro?' readonly':'')+'>'+esc(o.txt)+'</textarea>';
  return '<div class="stk k-'+o.t+'" data-k="'+o.id+'" style="left:'+o.x+'%;top:'+o.y+'%;width:'+o.w+'%;height:'+o.h+'cqw">'+inner+ctl+'</div>';
}).join('');
function addSt(t,x){
  if(deco.st.length>=80){msg('Слишком много стикеров.',0);return}
  const T=SK.find(k=>k[0]===t),n=deco.st.length%5;
  deco.st.push({id:'s'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),p:per()*sp,t,x:15+n*5,y:12+n*8,w:T?T[3]:40,h:T?T[4]:30,txt:T?T[2]:'',src:'',ar:1,...x});
  fill();
}

function fill(){
  const P=per(),pn=sec.querySelectorAll('.pn'),ly=sec.querySelectorAll('.stl');
  sec.querySelector('.lb-sp').classList.toggle('one',P===1);
  [0,1].forEach(k=>{const v=pages[P*sp+k]||'';if(tas[k].value!==v)tas[k].value=v;tas[k].scrollTop=0;pn[k].textContent=P*sp+k+1;ly[k].innerHTML=stHTML(P*sp+k)});
  $('#lb-n').textContent=(P===1?(sp+1):(2*sp+1)+'–'+Math.min(2*sp+2,pages.length))+' из '+pages.length;
  $('#lb-pv').disabled=sp===0;$('#lb-nx').disabled=P*(sp+1)>=pages.length;
  if(ro&&cur)saveProg(P*sp);
}
async function fetchText(){
  const SB=await getSB();if(!SB)return false;
  let r=await SB.from('library_books').select('body,deco').eq('id',cur.id).single();
  if(r.error)r=await SB.from('library_books').select('body').eq('id',cur.id).single();
  if(r.error)return false;
  cur.text=r.data.body;cur.deco=r.data.deco||null;return true;
}
const owns=b=>b.price<=0||bought.has(b.id)||b.uid===meId;
async function readBook(){
  const SB0=await getSB(),u0=SB0?(await SB0.auth.getUser()).data.user:null;
  if(!u0){msg('Чтобы читать книги, войди в аккаунт.',0);return}
  meId=u0.id;
  if(!owns(cur)&&!(cur.fp>0)){msg('Эта книга платная. Нажми «Купить».',0);return}
  if(!await fetchText()){msg('Не получилось открыть книгу. Попробуй ещё раз.',0);return}
  if(window.SB)window.SB.rpc('lib_read',{bid:cur.id}).then(()=>{});
  title=cur.title;ro=true;sp=Math.floor((prog[cur.id]||0)/per());tab='book';deco=normDeco(cur.deco);mode='read';render();
  if(per()*sp>=pages.length){sp=0;fill()}
  if(!owns(cur))msg('Это ознакомительный фрагмент: первые '+cur.fp+' страниц. Чтобы читать дальше, купи книгу.',1);
}
async function editBook(id){
  cur=books.find(b=>b.id===id);if(!cur)return;
  if(!await fetchText()){note('Не получилось открыть книгу для изменения.',1);render();return}
  title=cur.title;desc=cur.desc||'';gen=[...(cur.genres||[])];gOpen=false;
  paid=cur.price>0;price=cur.price>0?cur.price:20;freeOn=cur.fp>0;freeN=cur.fp>0?cur.fp:10;
  ccov=cur.cover||'';cimg=null;tab='book';sp=0;ro=false;deco=normDeco(cur.deco);mode='edit';render();
}
function newBook(){cur=null;title='Без названия';ccov='';cimg=null;tab='book';desc='';gen=[];gOpen=false;paid=false;price=20;freeOn=false;freeN=10;pages=[''];sp=0;ro=false;deco=normDeco(null);mode='edit';render()}
function drawCov(){
  const c=$('#lb-cvs');if(!c||!cimg)return;const g=c.getContext('2d');g.imageSmoothingQuality='high';
  g.fillStyle='#fff';g.fillRect(0,0,480,640);
  const s=Math.max(480/cimg.width,640/cimg.height)*cz,w=cimg.width*s,h=cimg.height*s;
  g.drawImage(cimg,(480-w)*cx,(640-h)*cy,w,h);
  ccov=c.toDataURL('image/jpeg',.88);
}
function covPrev(){
  const p=$('#lb-prev');if(!p)return;
  if(cimg){p.innerHTML='<canvas id="lb-cvs" width="480" height="640"></canvas>';drawCov()}
  else p.innerHTML=cover({title,cover:ccov});
  $('#lb-rg').hidden=!cimg;
}
function editV(){
  const ph=ro?'':' placeholder="Пиши здесь…"',r=ro?' readonly':'';
  lastP=per();
  sec.innerHTML=`<div class="lb-bar"><button class="back" id="lb-back" style="margin:0">${BACK}Назад</button><div class="r">${ro?'':`<button class="lb-btn" id="lb-word">${UPL}Загрузить из Word</button><label class="lb-sw"><input type="checkbox" id="lb-paid"${paid?' checked':''}><i></i>Сделать платной</label>`}</div></div>
  ${ro?'':`<div class="lb-tabs"><button data-t="cover">Обложка</button><button data-t="book" class="on">Книга</button><button data-t="deco">Оформление</button><button data-t="pay"${paid?'':' hidden'}>Оплата</button></div>`}
  <div class="lb-tt" id="lb-tt"></div>
  <div id="lb-cvp" hidden><div class="lb-cvw" id="lb-prev"></div><button class="lb-btn" id="lb-imgb">Загрузить картинку</button><div class="lb-rg" id="lb-rg" hidden><label>Размер<input type="range" id="lb-z" min="0.5" max="3" step="0.05" value="1"></label><label>Влево — вправо<input type="range" id="lb-x" min="0" max="1" step="0.01" value="0.5"></label><label>Вверх — вниз<input type="range" id="lb-y" min="0" max="1" step="0.01" value="0.5"></label></div></div>
  <div id="lb-pay" hidden></div>
  <div id="lb-bk"><div class="lb-mid">
  <div class="lb-sp"><div class="pgw"><textarea class="pg meas" tabindex="-1" aria-hidden="true"></textarea><textarea class="pg" data-i="0"${r}${ph}></textarea><div class="stl"></div><div class="pn"></div></div><div class="pgw"><textarea class="pg" data-i="1"${r}></textarea><div class="stl"></div><div class="pn"></div></div></div>
  <div class="lb-nav"><button class="go" id="lb-pv">‹</button><span id="lb-n"></span><button class="go" id="lb-nx">›</button></div>${ro?'':'<textarea class="lb-desc" id="lb-desc" maxlength="500" placeholder="Описание книги: о чём она (по желанию)"></textarea><div id="lb-gn"></div>'}</div>${ro?'':'<div class="lb-sd lb-fp" id="lb-fp"></div><div class="lb-sd lb-sk" id="lb-sk"></div>'}</div>
  ${ro?'':`<div class="lb-im" id="lb-im"><button class="lb-btn gr" id="lb-pic">${IMGI}Загрузить изображение</button><small>1 изображение на 10 страниц</small></div>
  <div class="lb-fin">${cur&&cur.status==='published'?'':'<button class="lb-btn gr" id="lb-draft">Сохранить черновик</button>'}<button class="lb-btn gn" id="lb-pub">${cur&&cur.status==='published'?'Сохранить':'Опубликовать'}</button></div>`}
  <div class="fb" id="lb-msg" style="text-align:center"></div>
  <input type="file" id="lb-file" accept=".docx" hidden><input type="file" id="lb-img" accept="image/*" hidden><input type="file" id="lb-picf" accept="image/*" hidden>`;
  tas=[...sec.querySelectorAll('textarea.pg:not(.meas)')];meas=sec.querySelector('.meas');
  if(!ro)sec.querySelector('#lb-desc').value=desc;
  styleFont();
  if(mode==='read'||cur)pages=paginate(cur.text);
  if(mode==='read'&&!owns(cur))pages=pages.slice(0,Math.max(1,cur.fp));
  if(per()===2&&pages.length%2)pages.push('');
  tt();renderSide();fill();genV();
  if(deco.font!=='def')loadFont().then(()=>{if(sec.querySelector('.lb-sp')&&tab!=='cover'&&tab!=='pay'){repag();fill()}});
}

/* обработчики */
sec.addEventListener('click',e=>{
  const c=k=>e.target.closest(k);
  if(c('.sx')){const k=c('.stk').dataset.k;deco.st=deco.st.filter(o=>o.id!==k);fill();return}
  if(c('[data-f]')){setFont(c('[data-f]').dataset.f);return}
  if(c('[data-sk]')){addSt(c('[data-sk]').dataset.sk);return}
  if(c('#lb-pic')){$('#lb-picf').click();return}
  if(c('[data-t]'))tabFix();
});
sec.addEventListener('input',e=>{
  const t=e.target;if(!t.classList||!t.classList.contains('stt'))return;
  const o=deco.st.find(q=>q.id===t.closest('.stk').dataset.k);if(o)o.txt=t.value;
});
sec.addEventListener('change',e=>{
  if(e.target.id!=='lb-picf')return;
  const f=e.target.files[0];e.target.value='';if(!f)return;
  const lim=Math.max(1,Math.ceil(pages.length/10)),n=deco.st.filter(o=>o.t==='img').length;
  if(n>=lim){msg('Лимит: 1 изображение на 10 страниц. Сейчас можно картинок: '+lim+', уже стоит: '+n+'.',0);return}
  const im=new Image();
  im.onload=()=>{
    const k=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement('canvas');
    c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
    const ar=c.width/c.height,w=Math.min(40,70*ar);
    addSt('img',{src:c.toDataURL(f.type==='image/png'?'image/png':'image/jpeg',.85),ar,w,h:w/ar,txt:''});
    msg('Картинка добавлена на страницу. Двигай за ✥, меняй размер за уголок.',1);
  };
  im.onerror=()=>msg('Это не картинка.',0);
  im.src=URL.createObjectURL(f);
});
let dg=null;
sec.addEventListener('pointerdown',e=>{
  const s=e.target.closest('.stk');
  sec.querySelectorAll('.stk.on').forEach(x=>{if(x!==s)x.classList.remove('on')});
  if(!s||ro)return;s.classList.add('on');
  const m=e.target.closest('.sg')?'m':e.target.closest('.sr')?'r':'';if(!m)return;
  const o=deco.st.find(q=>q.id===s.dataset.k);if(!o)return;
  e.preventDefault();e.target.setPointerCapture(e.pointerId);
  dg={m,o,s,r:s.parentElement.getBoundingClientRect(),x:e.clientX,y:e.clientY,ox:o.x,oy:o.y,ow:o.w,oh:o.h};
});
sec.addEventListener('pointermove',e=>{
  if(!dg)return;const o=dg.o,R=dg.r,dx=(e.clientX-dg.x)/R.width*100,dy=(e.clientY-dg.y)/R.width*100,hp=o.h*R.width/R.height;
  if(dg.m==='m'){o.x=Math.min(100-o.w,Math.max(0,dg.ox+dx));o.y=Math.min(100-hp,Math.max(0,dg.oy+dy*R.width/R.height))}
  else{o.w=Math.min(100-o.x,Math.max(10,dg.ow+dx));o.h=o.t==='img'?o.w/(o.ar||1):Math.max(5,dg.oh+dy)}
  const s=dg.s;s.style.left=o.x+'%';s.style.top=o.y+'%';s.style.width=o.w+'%';s.style.height=o.h+'cqw';
});
const dgUp=()=>{dg=null};sec.addEventListener('pointerup',dgUp);sec.addEventListener('pointercancel',dgUp);

/* ===== ПРАВКА: блоки рядом + красивые стикеры ===== */
const st3=document.createElement('style');st3.textContent=`
#lb-bk.side{grid-template-columns:160px auto 170px}
#lb-bk.duo{display:grid;grid-template-columns:1fr 1fr;grid-template-areas:'mid mid' 'fp sk';gap:12px;align-items:start}
#lb-bk.duo .lb-sd{margin:10px 0 0;max-width:none}
.fnb{font-size:14px}
.k-bubble{background:#fff;border:2px solid #3a4658;border-radius:22px;box-shadow:3px 4px 0 rgba(58,70,88,.16);color:#34404e}
.k-bubble::after{border-color:#3a4658;border-radius:0 0 4px 0}
.k-think{background:#f1edff;border:2px solid #8a7cf0;border-radius:50%/58%;color:#4a3fa8;box-shadow:3px 4px 0 rgba(138,124,240,.18)}
.k-think::after{left:12%;bottom:-16px;width:12px;height:12px;border-radius:50%;background:#f1edff;border:2px solid #8a7cf0;box-shadow:-9px 9px 0 -3px #f1edff,-9px 9px 0 -1px #8a7cf0}
.k-n1,.k-n2,.k-n3{border-radius:3px 3px 3px 20px;box-shadow:0 8px 18px rgba(60,50,20,.18)}
.k-n1{background:linear-gradient(160deg,#fff7c2,#ffec8f);transform:rotate(-2deg);color:#4b4630}
.k-n2{background:linear-gradient(160deg,#ffe3ec,#ffc8d8);transform:rotate(1.5deg);color:#6a3248}
.k-n3{background:linear-gradient(160deg,#dcf7e8,#bdeed3);transform:rotate(-1deg);color:#2f5a44}
.k-n1::before,.k-n2::before,.k-n3::before{content:'';position:absolute;left:34%;top:-9px;width:32%;height:16px;transform:rotate(-3deg);box-shadow:0 1px 3px rgba(0,0,0,.12);pointer-events:none;z-index:2}
.k-n1::before{background:repeating-linear-gradient(90deg,rgba(255,150,150,.65) 0 6px,rgba(255,200,200,.65) 6px 12px)}
.k-n2::before{background:repeating-linear-gradient(90deg,rgba(150,190,255,.65) 0 6px,rgba(200,220,255,.65) 6px 12px)}
.k-n3::before{background:repeating-linear-gradient(90deg,rgba(255,215,120,.7) 0 6px,rgba(255,235,170,.7) 6px 12px)}
.k-rib{filter:drop-shadow(0 4px 5px rgba(30,80,120,.25));color:#fff}
.k-rib::before{background:linear-gradient(135deg,#7adcf5,#2f9fe6)}
.k-rib textarea.stt{text-shadow:0 1px 2px rgba(0,60,110,.35)}
.k-plate{background:linear-gradient(135deg,#ffeed6,#ffd9ad);border-radius:16px;box-shadow:0 5px 14px rgba(200,120,40,.22);color:#7a4a1d}
.k-plate::before{content:'';position:absolute;inset:4px;border:1.5px dashed rgba(170,105,40,.5);border-radius:12px;pointer-events:none}
.k-mark{background:linear-gradient(100deg,rgba(255,226,64,0),rgba(255,226,64,.95) 4%,rgba(255,226,64,.85) 96%,rgba(255,226,64,0)) 0 90%/100% 58% no-repeat;transform:rotate(-1deg)}
.k-frame{background:#f4fbff;border-left:5px solid #17b3e6;border-radius:6px 16px 16px 6px;box-shadow:0 4px 12px rgba(23,179,230,.16)}
.k-frame::before{content:'“';position:absolute;left:9px;top:-4px;font:700 40px Georgia,serif;line-height:1;color:#17b3e6;opacity:.45;pointer-events:none}
.k-frame textarea.stt{text-align:left;padding:.5em .6em .5em 1.7em;font-style:italic}
.k-tape{background:none;color:#8a3d5c;transform:rotate(-2deg);box-shadow:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.15))}
.k-tape::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(135deg,#ffd3e5 0 9px,#fff0f7 9px 18px);clip-path:polygon(0 0,2% 25%,0 50%,2% 75%,0 100%,100% 100%,98% 75%,100% 50%,98% 25%,100% 0)}
.k-badge{background:radial-gradient(circle at 35% 30%,#ff9b9b,#e5484d);color:#fff;box-shadow:0 0 0 3px #fff,0 5px 12px rgba(229,72,77,.4)}
.pv{height:42px;margin-top:6px}
.pv.k-badge{width:42px;margin:6px auto 0}
.pv.k-frame span{padding-left:14px}`;
document.head.appendChild(st3);
const wide2=()=>sec.clientWidth>=820;
function fit(){
  const s=sec.querySelector('.lb-sp'),m=sec.querySelector('.lb-mid');if(!s||!m)return;
  s.style.width=s.style.transform=s.style.marginBottom='';m.style.width='';
  if(ro||tab!=='deco'||!wide2())return;
  const w=Math.min(980,sec.clientWidth),k=Math.max(.5,Math.min(.76,(sec.clientWidth-380)/w));
  s.style.width=w+'px';s.style.transformOrigin='top left';s.style.transform='scale('+k+')';
  s.style.marginBottom=(-s.offsetHeight*(1-k))+'px';m.style.width=(w*k)+'px';
}
function layoutDeco(){
  const bk=$('#lb-bk');if(!bk||ro)return;const d=tab==='deco';
  bk.classList.toggle('deco',d);bk.classList.toggle('side',d&&wide2());
  bk.classList.toggle('duo',d&&!wide2()&&sec.clientWidth>=520);
}
function tabFix(){
  const bk=$('#lb-bk');if(!bk||ro)return;const im=$('#lb-im'),fn=sec.querySelector('.lb-fin'),hide=tab==='cover'||tab==='pay';
  bk.hidden=hide;if(im)im.hidden=hide;if(fn)fn.hidden=tab==='pay';
  layoutDeco();payV();
  if(!bk.hidden){fit();fill()}
}
addEventListener('resize',()=>{layoutDeco();fit()});

/* ===== ОТЗЫВЫ ===== */
const st4=document.createElement('style');st4.textContent=`
.rvi{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--ln)}
.rvi:last-child{border:0}
.rva{flex:none;width:40px;height:40px;border-radius:50%;color:#fff;font-weight:700;display:grid;place-items:center}
.rvb{flex:1;min-width:0}
.rvn{font-weight:600;font-size:14px}
.rvn small{font-weight:400;color:var(--mu);font-size:11px;margin-left:8px}
.rvm{background:var(--pl);color:var(--bt);border-radius:9px;padding:1px 8px;font-size:10px;font-weight:600;margin-left:6px}
.rvs{color:#f5b81c;font-size:15px;letter-spacing:1px}
.rvs i{font-style:normal;color:#d5dbe0}
.rvt{font-size:14px;line-height:1.6;color:#566170;margin-top:4px;white-space:pre-wrap;overflow-wrap:anywhere}`;
document.head.appendChild(st4);
let pend=0,rtxt='',revs=[];

function openBook(id){cur=books.find(b=>b.id===id);if(!cur)return;pend=0;rtxt='';revs=[];mode='info';render()}
function buyV(b){
  const rd=`<button class="lb-btn big" id="lb-read">${prog[b.id]>0?'Продолжить · стр. '+(prog[b.id]+1):'Читать'}</button>`;
  if(owns(b))return rd;
  const buy=`<button class="lb-btn big gn" id="lb-buy">Купить за ${b.price} <span class="coin"></span></button>`;
  return b.fp>0?`<div class="lb-buyrow"><div class="lb-rdw">${rd}<small>Первые ${b.fp} страниц</small></div>${buy}</div>`:buy;
}
function infoV(){
  const b=cur,mine=my[b.id]||0,dt=new Date(b.date).toLocaleDateString('ru'),sh=pend||mine;
  sec.innerHTML=`<button class="back" id="lb-back" style="margin:0 0 12px">${BACK}Назад</button>
  <div class="lb-info"><div class="lb-l">${cover(b)}</div><div class="lb-r"><div class="lb-au">${esc(b.author)} · опубликовано ${dt}</div><h1>${esc(b.title)}</h1>
  <div class="lb-stars">${[1,2,3,4,5].map(i=>`<button class="lb-st${i<=sh?' on':''}" data-r="${i}" aria-label="Оценка ${i}">★</button>`).join('')}</div>
  <div class="lb-avg">${avg(b)}${mine?' · твоя оценка: '+mine:' · нажми на звезду, чтобы оценить'}</div>
  <div class="lb-avg lb-eye">${EYE}${b.reads||0} · уникальных просмотров<button class="lb-hrt${lk.has(b.id)?' on':''}" data-h="${b.id}">${HRT} Нравится</button></div><div id="lb-rf"></div><div class="fb" id="lb-msg"></div>
  ${b.genres&&b.genres.length?'<div class="lb-gc">'+b.genres.map(g=>'<span>'+esc(g)+'</span>').join('')+'</div>':''}<h3>Описание</h3><p>${b.desc?esc(b.desc).replace(/\n/g,'<br>'):'Описания нет.'}</p>
  ${buyV(b)}</div></div>
  <section class="card" style="margin-top:22px"><div class="hd"><h2>Отзывы</h2><span id="lb-rc"></span></div><div id="lb-rv"><div class="fr">Загружаем…</div></div></section>`;
  revForm();loadRev();
}
function rate(r){
  if(!meId){msg('Чтобы оценить книгу, войди в аккаунт.',0);return}
  const old=revs.find(x=>x.user_id===meId);
  if(!pend&&old)rtxt=old.comment||'';
  pend=r;
  sec.querySelectorAll('.lb-st').forEach(b=>b.classList.toggle('on',+b.dataset.r<=r));
  revForm();const t=$('#lb-rt');if(t)t.focus();
}
async function loadRev(){
  const SB=await getSB(),id=cur&&cur.id;if(!SB||!id)return;
  const r=await SB.from('library_rates').select('user_id,rating,comment,created_at').eq('book_id',id).order('created_at',{ascending:false}).limit(100);
  if(!cur||cur.id!==id||!$('#lb-rv'))return;
  if(r.error){$('#lb-rv').innerHTML='<div class="lb-ok bad">Не удалось загрузить отзывы: '+esc(r.error.message)+'. Проверь, что SQL из шага 1 выполнен.</div>';return}
  revs=r.data||[];
  const ids=[...new Set(revs.map(x=>x.user_id))];
  const P=ids.length?Object.fromEntries(((await SB.from('profiles').select('id,name').in('id',ids)).data||[]).map(x=>[x.id,x.name])):{};
  if(!cur||cur.id!==id||!$('#lb-rv'))return;
  revs.forEach(x=>x.name=(P[x.user_id]||'Участник').trim()||'Участник');
  revs.sort((a,b)=>(b.user_id===meId)-(a.user_id===meId));
  $('#lb-rv').innerHTML=revs.length?revs.map(x=>{
    const h=hue(x.name),n=Math.max(1,Math.min(5,x.rating|0));
    return `<div class="rvi"><div class="rva" style="background:linear-gradient(160deg,hsl(${h},70%,62%),hsl(${(h+35)%360},65%,46%))">${esc(x.name.charAt(0).toUpperCase()||'?')}</div><div class="rvb"><div class="rvn">${esc(x.name)}${x.user_id===meId?'<span class="rvm">твой отзыв</span>':''}<small>${new Date(x.created_at).toLocaleDateString('ru')}</small></div><div class="rvs">${'★'.repeat(n)}<i>${'★'.repeat(5-n)}</i></div>${x.comment?`<div class="rvt">${esc(x.comment)}</div>`:''}</div></div>`}).join(''):'<div class="fr">Отзывов пока нет. Напиши первый отзыв.</div>';
  $('#lb-rc').textContent=revs.length?'Всего: '+revs.length:'';
}
sec.addEventListener('click',async e=>{
  const c=k=>e.target.closest(k);
  if(c('#lb-rx')){pend=0;rtxt='';sec.querySelectorAll('.lb-st').forEach(b=>b.classList.toggle('on',+b.dataset.r<=(my[cur.id]||0)));revForm();return}
  if(c('#lb-rs')){
    const SB=await getSB();if(!SB||!meId||!pend)return;
    const t=($('#lb-rt').value||'').trim().slice(0,500),btn=c('#lb-rs');btn.disabled=true;
    const res=await SB.from('library_rates').upsert({book_id:cur.id,user_id:meId,rating:pend,comment:t||null},{onConflict:'book_id,user_id'});
    if(res.error){btn.disabled=false;msg('Не получилось: '+res.error.message,0);return}
    const old=my[cur.id];if(old)cur.rs-=old;else cur.rc++;cur.rs+=pend;my[cur.id]=pend;
    pend=0;rtxt='';infoV();msg('Спасибо! Отзыв опубликован.',1);
  }
});
sec.addEventListener('input',e=>{if(e.target.id==='lb-rt')rtxt=e.target.value});

/* ===== ЖАЛОБЫ НА КНИГИ ===== */
const st5=document.createElement('style');st5.textContent=`
.lb-th{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.lb-bm{position:relative;display:inline-block;flex:none}
.lb-bm .lb-mn{top:42px;right:0}
.lb-tt .lb-bm{margin-left:4px}
.lb-eye{display:flex;align-items:center;gap:6px;margin-top:6px}.lb-eye svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}`;
document.head.appendChild(st5);
let bmOpen=false,modOK=false,modState=0;
const FLAG='<svg viewBox="0 0 24 24"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>';
const RSN=['Неприемлемый контент','Оскорбления или травля','Спам или реклама','Чужая работа (плагиат)','Другое'];

async function chkMod(){
  const SB=await getSB(),u=SB?(await SB.auth.getUser()).data.user:null;if(!u)return false;
  const r=await SB.from('moderators').select('user_id').eq('user_id',u.id).maybeSingle();
  return !!r.data;
}
function bookMenu(){
  if(meId&&modState===0){modState=1;chkMod().then(v=>{modOK=v;modState=2;bmDraw()})}
  const items=[];
  if(meId&&cur&&cur.uid!==meId)items.push(['rep',FLAG,'Пожаловаться']);
  if(meId&&cur&&modOK)items.push(['mdel',TRS,'Удалить книгу (модератор)']);
  if(!items.length)return '<span class="lb-bm"></span>';
  return `<span class="lb-bm"><button class="lb-ed" data-bm aria-label="Меню">${DOTS}</button>${bmOpen?`<div class="lb-mn">${items.map(a=>`<button data-bk="${a[0]}"${a[0]==='mdel'?' class="red"':''}>${a[1]}${a[2]}</button>`).join('')}</div>`:''}</span>`;
}
const bmDraw=()=>document.querySelectorAll('.lb-bm').forEach(x=>x.outerHTML=bookMenu());
function injectMenu(){
  const h=sec.querySelector('.lb-r h1');
  if(h&&!sec.querySelector('.lb-th')){const w=document.createElement('div');w.className='lb-th';h.replaceWith(w);w.appendChild(h);w.insertAdjacentHTML('beforeend',bookMenu())}
}
function revForm(){
  injectMenu();
  const f=$('#lb-rf');if(!f)return;
  if(!pend){f.innerHTML='';return}
  f.innerHTML=`<textarea id="lb-rt" class="lb-desc" style="max-width:none;margin:10px 0 0;height:90px" maxlength="500" placeholder="Напиши отзыв о книге (по желанию)">${esc(rtxt)}</textarea>
  <div class="lb-hint" style="margin:6px 0 8px">Можно без текста: тогда опубликуется только оценка ${pend} ★</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="lb-btn gn" id="lb-rs">${my[cur.id]?'Сохранить отзыв':'Опубликовать'}</button><button class="lb-btn gr" id="lb-rx">Отмена</button></div>`;
}
function tt(){
  $('#lb-tt').innerHTML='<h2>'+esc(title)+'</h2>'+(ro?bookMenu():'<button class="lb-pen" id="lb-pen" aria-label="Изменить название">'+PEN+'</button>');
}
function reportBook(){
  return new Promise(res=>{
    const d=document.createElement('div');d.className='lb-md';
    d.innerHTML=`<div class="lb-mb" style="text-align:left"><p style="font-weight:700;margin-bottom:10px">Пожаловаться на книгу «${esc(cur.title)}»</p>${RSN.map((t,i)=>`<label style="display:flex;gap:8px;align-items:center;padding:6px 0;font-size:14px"><input type="radio" name="rr" value="${i}"${i?'':' checked'}>${t}</label>`).join('')}<textarea id="rr-t" maxlength="300" placeholder="Что не так? (по желанию)" style="width:100%;height:70px;margin:8px 0 14px;border:1px solid #dfe5ea;border-radius:12px;padding:10px;font:inherit;outline:0"></textarea><div><button class="lb-btn gr" data-v="0">Отмена</button><button class="lb-btn rd" data-v="1">Отправить</button></div></div>`;
    d.onclick=e=>{
      const v=e.target.closest('[data-v]');if(!v&&e.target!==d)return;
      const ok=v&&v.dataset.v==='1',i=d.querySelector('input:checked'),t=d.querySelector('#rr-t').value.trim();
      d.remove();res(ok?RSN[+i.value]+(t?': '+t:''):null);
    };
    document.body.appendChild(d);
  });
}
async function doReport(){
  if(!meId){msg('Чтобы пожаловаться, войди в аккаунт.',0);return}
  const why=await reportBook();if(!why)return;
  const SB=await getSB();
  const r=await SB.from('reports').insert({kind:'book',target_id:cur.id,reason:why.slice(0,300)});
  if(r.error)msg('Не получилось отправить: '+r.error.message,0);else msg('Спасибо! Жалоба отправлена модераторам.',1);
}
async function modDel(){
  if(!(await ask('Удалить книгу «'+cur.title+'» как модератор? Это нельзя отменить.','Удалить',1)))return;
  const SB=await getSB(),id=cur.id;
  const r=await SB.from('library_books').delete().eq('id',id).select('id');
  if(r.error||!(r.data||[]).length){msg('Не получилось удалить: '+(r.error?r.error.message:'нет прав, проверь SQL из шага 1'),0);return}
  await SB.from('reports').update({resolved:true}).eq('kind','book').eq('target_id',id);
  note('Книга удалена модератором');cur=null;mode='list';await load();render();
}
sec.addEventListener('click',e=>{
  const c=k=>e.target.closest(k);
  if(c('[data-bm]')){bmOpen=!bmOpen;bmDraw();return}
  if(c('[data-bk]')){const k=c('[data-bk]').dataset.bk;bmOpen=false;bmDraw();if(k==='rep')doReport();else modDel();return}
  if(bmOpen&&!c('.lb-bm')){bmOpen=false;bmDraw()}
});

/* ===== ЖАНРЫ ===== */
const GN=['Фэнтези','Фантастика','Детектив','Приключения','Ужасы','Юмор','Поэзия','Научпоп','Учебное','Детское','Другое'];
const st6=document.createElement('style');st6.textContent=`
.gn-w{max-width:980px;margin:10px auto 0;position:relative}
.gn-h{display:flex;justify-content:space-between;align-items:center;width:100%;padding:12px 16px;border:1px solid #dfe5ea;border-radius:14px;background:#fff;font-size:13px;text-align:left;color:#34404e}
.gn-l{margin-top:6px;background:#fff;border:1px solid #dfe5ea;border-radius:14px;padding:12px;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px 10px}
.gn-l label{display:flex;gap:8px;align-items:center;font-size:13px;padding:4px 0}
.gn-l .lb-btn{grid-column:1/-1;justify-self:start;margin-top:6px}
.lb-gc{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.lb-gc span{background:var(--pl);color:var(--bt);border-radius:12px;padding:3px 10px;font-size:12px;font-weight:600}`;
document.head.appendChild(st6);
function genV(){
  const b=$('#lb-gn');if(!b)return;
  b.innerHTML=`<div class="gn-w"><button class="gn-h" id="gn-t"><span>Жанр: ${gen.length?esc(gen.join(', ')):'не выбран'}</span><span>${gOpen?'▴':'▾'}</span></button>${gOpen?`<div class="gn-l">${GN.map(g=>`<label><input type="checkbox" data-g="${g}"${gTmp.includes(g)?' checked':''}>${g}</label>`).join('')}<button class="lb-btn gn" id="gn-s">Сохранить</button></div>`:''}</div>`;
}
sec.addEventListener('click',e=>{
  const c=k=>e.target.closest(k);
  if(c('#gn-t')){gTmp=[...gen];gOpen=!gOpen;genV();return}
  if(c('#gn-s')){gen=[...gTmp];gOpen=false;genV()}
});
sec.addEventListener('change',e=>{
  const g=e.target.dataset&&e.target.dataset.g;if(!g)return;
  gTmp=e.target.checked?[...new Set([...gTmp,g])]:gTmp.filter(x=>x!==g);
});

/* ===== ПОНРАВИВШИЕСЯ ===== */
const st7=document.createElement('style');st7.textContent=`
.lb-b{position:relative}
.lb-hr{position:absolute;right:20px;top:20px;z-index:3;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.92);color:#9aa4ae;display:grid;place-items:center;box-shadow:0 2px 8px rgba(0,0,0,.2);cursor:pointer}
.lb-hr svg,.lb-hrt svg,.lb-hbtn svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round}
.lb-hr.on,.lb-hrt.on{color:#e5484d}
.lb-hr.on svg,.lb-hrt.on svg{fill:#e5484d}
.lb-hrt{margin-left:auto;display:inline-flex;gap:6px;align-items:center;font-size:12px;font-weight:600;color:#9aa4ae}
.lb-hbtn{padding:0 14px}`;
document.head.appendChild(st7);
function likedV(){
  const L=books.filter(b=>b.status==='published'&&lk.has(b.id)),ok=banner();
  sec.innerHTML=`<div class="top"><div><div class="cap">Библиотека</div><h1>Понравившиеся</h1></div><div class="lb-hb"><button class="back" id="lb-back" style="margin:0">${BACK}Назад</button></div></div>${ok}<section style="margin-top:22px">${L.length?`<div class="lb-books">${L.map(b=>`<button class="lb-b" data-o="${b.id}">${hr(b.id)}${cover(b)}<b>${esc(b.title)}</b><small>${esc(b.author)}</small></button>`).join('')}</div>`:'<div class="card">'+(meId?'Пока пусто. Нажми на сердечко на книге, и она появится здесь.':'Войди в аккаунт, чтобы видеть понравившиеся.')+'</div>'}</section>`;
}
async function toggleLike(id){
  const bad=t=>document.getElementById('lb-msg')?msg(t,0):alert(t);
  if(!meId){bad('Чтобы отметить книгу, войди в аккаунт.');return}
  const SB=await getSB();if(!SB)return;
  const on=lk.has(id),paint=()=>document.querySelectorAll('[data-h="'+id+'"]').forEach(x=>x.classList.toggle('on',lk.has(id)));
  on?lk.delete(id):lk.add(id);paint();
  const r=on?await SB.from('library_likes').delete().eq('book_id',id).eq('user_id',meId):await SB.from('library_likes').insert({book_id:id});
  if(r.error){on?lk.add(id):lk.delete(id);paint();bad('Не получилось: '+r.error.message)}
}
sec.addEventListener('click',e=>{
  const h=e.target.closest('[data-h]');
  if(h){e.stopPropagation();toggleLike(+h.dataset.h);return}
  if(e.target.closest('[data-a="liked"]')){e.stopPropagation();mode='liked';render()}
},true);

/* ===== ЗАПОМИНАЕМ СТРАНИЦУ ===== */
function saveProg(p){
  if(!cur||!meId)return;const id=cur.id;prog[id]=p;clearTimeout(pgT);
  pgT=setTimeout(async()=>{const SB=await getSB();if(SB)SB.from('library_progress').upsert({book_id:id,user_id:meId,page:p,updated_at:new Date().toISOString()},{onConflict:'book_id,user_id'})},600);
}

/* ===== ПЛАТНЫЕ КНИГИ ===== */
const st8=document.createElement('style');st8.textContent=`
.lb-bar .r{flex-direction:column;align-items:flex-end;gap:6px}
.lb-sw{display:flex;align-items:center;gap:8px;font-size:12px;color:#566170;cursor:pointer;margin-top:2px}
.lb-sw input{display:none}
.lb-sw i{width:36px;height:20px;border-radius:10px;background:#d5dbe0;position:relative;transition:.2s;flex:none}
.lb-sw i::after{content:'';position:absolute;left:2px;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.2s}
.lb-sw input:checked+i{background:var(--cy)}.lb-sw input:checked+i::after{left:18px}
.pay-w{display:flex;gap:30px;justify-content:center;align-items:flex-start;margin:20px auto;max-width:760px}
.pay-w .lb-cv{width:220px;aspect-ratio:3/4;flex:none}
.pay-f{flex:1;min-width:0;display:flex;flex-direction:column;gap:12px;background:#fff;border-radius:20px;padding:22px;box-shadow:0 6px 30px rgba(0,0,0,.05)}
.pay-f h3{font-size:16px;font-weight:700}
.pay-f label.n{display:flex;align-items:center;gap:10px;font-size:13px;color:#566170}
.pay-f input[type=number]{width:100px;height:40px;border:1px solid #dfe5ea;border-radius:12px;padding:0 12px;font:inherit;outline:0}
.pay-f .lb-hint{margin:0}
.lb-buyrow{display:flex;gap:14px;align-items:flex-start;margin-top:14px;flex-wrap:wrap}
.lb-buyrow .big{margin-top:0}
.lb-rdw{display:flex;flex-direction:column;align-items:center;gap:6px}
.lb-rdw small{font-size:11px;color:#9aa4ae}
.lb-btn .coin{width:20px;height:20px;margin:0 0 0 2px;vertical-align:-5px}`;
document.head.appendChild(st8);
function payV(){
  const p=$('#lb-pay');if(!p)return;p.hidden=tab!=='pay';if(tab!=='pay')return;
  p.innerHTML=`<div class="pay-w">${sec.clientWidth>=700?cover({title,cover:ccov}):''}<div class="pay-f"><h3>Оплата</h3>
  <label class="n">Цена: <input type="number" id="lb-pr" min="20" value="${price}"> монет</label><div class="lb-hint">Минимум 20 монет.</div>
  <label class="lb-sw"><input type="checkbox" id="lb-fo"${freeOn?' checked':''}><i></i>Сделать первые страницы бесплатными</label>
  ${freeOn?`<label class="n">Сколько страниц: <input type="number" id="lb-fn" min="1" value="${freeN}"></label>`:''}
  <button class="lb-btn gn" id="lb-ps" style="align-self:flex-start">Сохранить</button></div></div>`;
}
sec.addEventListener('change',e=>{
  const i=e.target.id;
  if(i==='lb-paid'){paid=e.target.checked;const pb=sec.querySelector('[data-t="pay"]'),bb=sec.querySelector('[data-t="book"]');pb.hidden=!paid;(paid?pb:bb).click();return}
  if(i==='lb-pr'){price=Math.max(20,parseInt(e.target.value)||20);e.target.value=price;return}
  if(i==='lb-fn'){freeN=Math.max(1,parseInt(e.target.value)||10);e.target.value=freeN;return}
  if(i==='lb-fo'){freeOn=e.target.checked;payV()}
});
sec.addEventListener('click',async e=>{
  if(e.target.closest('#lb-ps')){save(cur&&cur.status==='published'?'published':'draft');return}
  const bt=e.target.closest('#lb-buy');if(!bt)return;
  if(!meId){msg('Чтобы купить книгу, войди в аккаунт.',0);return}
  if(!(await ask('Купить «'+cur.title+'» за '+cur.price+' монет?','Купить')))return;
  const SB=await getSB();if(!SB)return;bt.disabled=true;
  const r=await SB.rpc('lib_buy',{bid:cur.id});
  if(r.error){bt.disabled=false;msg('Не получилось: '+r.error.message,0);return}
  if(r.data==='nomoney'){bt.disabled=false;msg('Не хватает монет.',0);return}
  bought.add(cur.id);
  document.querySelectorAll('.cn').forEach(n=>{const v=parseInt(String(n.textContent).replace(/\D/g,''));if(!isNaN(v))n.textContent=v-cur.price});
  infoV();msg('Книга куплена! Приятного чтения.',1);
});

window.LBopen=async id=>{
  MS.show('lib');await load();
  if(!books.find(x=>x.id===id)){alert('Книга не найдена: возможно, она уже удалена.');return}
  openBook(id);
};

/* раздел «Жалобы» в модерации маркета теперь знает про книги */
if(window.Market){
  Market.openBookReport=id=>window.LBopen(id);
  Market.loadReports=async function(){
    const el=document.getElementById('reportsQueue'),sb=window.SB;if(!el||!sb||!this.isMod)return;
    const r=await sb.from('reports').select('*').eq('resolved',false).order('id',{ascending:false}).limit(50);
    if(r.error){el.innerHTML='<p style="color:red">'+esc(r.error.message)+'</p>';return}
    const L=r.data||[],ids=k=>L.filter(x=>x.kind===k).map(x=>x.target_id);
    const q=(t,c,k)=>ids(k).length?sb.from(t).select(c).in('id',ids(k)):null;
    const [ps,cs,bs]=await Promise.all([q('posts','id,body,image_url,user_id','post'),q('post_comments','id,body,user_id','comment'),q('library_books','id,title,author,user_id','book')]);
    const M=z=>Object.fromEntries(((z&&z.data)||[]).map(x=>[x.id,x]));
    const T={post:M(ps),comment:M(cs),book:M(bs)};
    const us=[...new Set(L.map(x=>((T[x.kind]||{})[x.target_id]||{}).user_id).filter(Boolean))];
    const nm=us.length?Object.fromEntries(((await sb.from('profiles').select('id,name').in('id',us)).data||[]).map(x=>[x.id,x.name])):{};
    const KN={post:'Публикация',comment:'Комментарий',book:'Книга'};
    el.innerHTML=L.map(x=>{
      const t=(T[x.kind]||{})[x.target_id];
      const body=!t?'<div style="color:#8a94a3;margin:6px 0">Уже удалено</div>'
        :x.kind==='book'?`<div style="font-weight:700;margin:6px 0 2px">«${esc(t.title)}»</div><div style="color:#8a94a3;font-size:13px">Автор: ${esc(nm[t.user_id]||t.author||'Участник')}</div><button onclick="Market.openBookReport(${t.id})" style="margin-top:8px;padding:7px 14px;border:0;border-radius:10px;background:#eef1f6;font-weight:700;cursor:pointer">Открыть книгу</button>`
        :`<div style="font-weight:700;margin:6px 0 2px">${esc(nm[t.user_id]||'Участник')}</div><div style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(t.body)}</div>${t.image_url?`<img src="${esc(t.image_url)}" style="max-width:220px;border-radius:10px;margin-top:8px;display:block">`:''}`;
      return `<div style="background:#fff;border-radius:18px;padding:16px;box-shadow:0 6px 24px rgba(0,0,0,.05)">
        <div style="font-size:12px;color:#8a94a3">${KN[x.kind]||x.kind} · ${esc(x.reason)}</div>${body}
        <div style="display:flex;gap:8px;margin-top:12px">
          ${t?`<button onclick="Market.reportDelete(${x.id},'${x.kind}',${x.target_id})" style="padding:9px 16px;border:0;border-radius:10px;background:#e63946;color:#fff;font-weight:700;cursor:pointer">Удалить</button>`:''}
          <button onclick="Market.reportClose(${x.id})" style="padding:9px 16px;border:0;border-radius:10px;background:#eef1f6;font-weight:700;cursor:pointer">${t?'Отклонить':'Закрыть'}</button>
        </div></div>`;
    }).join('')||'<p style="color:#888">Жалоб нет</p>';
  };
  Market.reportDelete=async function(rid,kind,tid){
    const N={post:'публикацию',comment:'комментарий',book:'книгу'},TB={post:'posts',comment:'post_comments',book:'library_books'};
    if(!confirm('Удалить '+N[kind]+'?'))return;
    const sb=window.SB,r=await sb.from(TB[kind]).delete().eq('id',tid).select();
    if(r.error||!(r.data||[]).length)return alert('Не удалось удалить: '+(r.error?r.error.message:'нет прав, проверь SQL из шага 1'));
    await sb.from('reports').update({resolved:true}).eq('target_id',tid).eq('kind',kind);
    this.loadReports();
  };
}
})();

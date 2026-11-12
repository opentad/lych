/* Милки-соцсеть: профиль (тёмная тема). Секция #v-prof, Supabase через window.SB (из messenger.js). */
(function(){
const H0=location.hash;
const sec=document.createElement('section');sec.id='v-prof';sec.hidden=true;
document.querySelector('.main').appendChild(sec);
sec.innerHTML='<div class="pf-nt" id="pf-nt" hidden></div><div id="pf-c"></div><input type="file" id="pf-file" accept="image/*" hidden><input type="file" id="pf-pfile" accept="image/*" multiple hidden>';
const $=s=>sec.querySelector(s);
const put=h=>{$('#pf-c').innerHTML=h};
const db=()=>window.SB;
  async function upd(p){const r=await db().from('profiles').update(p).eq('id',S.id).select('id');if(!r.error&&!(r.data||[]).length)r.error={message:'сервер не принял изменения (нет прав)'};return r}
const SBU='https://sjwvrljmqpbopbxqkhkl.supabase.co',SBK='sb_publishable_mWqrZq0Vw65Ahk7ZIbtlNQ_owreCtcj';
const BKT='avatars',VIEW=300,CR=130,OUT=800,MAXP=8,MAXO=10;
const PS1='id,body,image_url,images,img_top,poll,repost_of,created_at,post_likes(count),post_comments(count)';
const PS0='id,body,image_url,created_at,post_likes(count),post_comments(count)';
const PSEL='id,body,image_url,images,img_top,poll,repost_of,created_at';

function getSB(){return new Promise(res=>{let n=0;const t=setInterval(()=>{
  if(!window.SB&&window.supabase)window.SB=window.supabase.createClient(SBU,SBK);
  if(window.SB){clearInterval(t);res(window.SB)}else if(++n>60){clearInterval(t);res(null)}},100)})}
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const SF=window.SF||(f=>String(f||'').trim().split(/\s+/).slice(0,2).join(' '));
const PAL=['#f0a04b','#e5617a','#8774e1','#4fb9e6','#5cc08a','#e8793a','#4a8fd9'];
const hs=t=>{let x=7;for(const c of t)x=(x*31+c.charCodeAt(0))>>>0;return x};
const col=n=>PAL[hs(n||'?')%PAL.length];
const ini=n=>(n||'?').split(/[\s,]+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const av=(p,c)=>`<span class="${c}" style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(p.name))}</span>`;
const p2=n=>String(n).padStart(2,'0');
const dt=t=>{const d=new Date(t);return p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()+' '+p2(d.getHours())+':'+p2(d.getMinutes())};
const seen=t=>{const d=Date.now()-Date.parse(t);if(!t||isNaN(d))return'';if(d<75000)return'В сети';const m=Math.floor(d/60000);if(m<60)return'Была '+m+' мин назад';const h=Math.floor(m/60);return h<24?'Была '+h+' ч назад':'Была '+Math.floor(h/24)+' дн назад'};
const cn=x=>x&&x[0]?x[0].count:0;
const postImgs=p=>Array.isArray(p.images)&&p.images.length?p.images:(p.image_url?[p.image_url]:[]);
const IC={
 pen:'M4 20l4-1L19 8l-3-3L5 16z',
 heart:'M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.4-7 10-7 10z',
 cmt:'M5 5h14v10H10l-5 4z',
 trash:'M4 7h16M9 7V4.5h6V7M6.5 7l.9 12.5h9.2L17.5 7',
 cls:'M5 5h14v14H5zM8 9h8M8 13h5',
 coin:'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM9.5 10h4a1.5 1.5 0 0 1 0 3h-3',
 bag:'M6 8h12l-1 11H7zM9 8V6a3 3 0 0 1 6 0v2',
 paint:'M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 0 0 3-3A9 9 0 0 0 12 3z',
 mark:'M7 4h10v16l-5-4-5 4z',
 gift:'M4 10h16v10H4zM3 7h18v3H3zM12 7v13',
 img:'M5 5h14v14H5zM8 9.5h.01M5 17l4.5-4.5 3 3 2.5-2.5 4 4'};
const ic=k=>`<svg viewBox="0 0 24 24"><path d="${IC[k]}"/></svg>`;
IC.cam='M4 8h3l1.5-2h7L17 8h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z';
IC.star='M12 4l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z';
IC.plus='M12 5v14M5 12h14';
IC.poll='M6 19v-7M12 19V5M18 19v-10';
IC.chk='M5 12.5l4.5 4.5L19 7.5';
IC.x='M6 6l12 12M18 6L6 18';
IC.rep='M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4';
IC.flag='M6 4v16M6 5h11l-2 4 2 4H6';
/* иконка для меню «три точки» (самодостаточная, не зависит от CSS) */
const icm=k=>`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:-4px"><path d="${IC[k]}"/></svg>`;
let nt=0;
function note(t){const d=$('#pf-nt');d.textContent=t;d.hidden=false;clearTimeout(nt);nt=setTimeout(()=>d.hidden=true,4000)}
const setHash=k=>{try{history.replaceState(null,'','#/@'+encodeURIComponent(k))}catch(e){}};
new MutationObserver(()=>{if(sec.hidden&&location.hash.indexOf('#/@')===0)try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}).observe(sec,{attributes:true,attributeFilter:['hidden']});

const css=document.createElement('style');
css.textContent=`
#v-prof{--pk:#f45b97;--pkbg:rgba(243,166,189,.14);--pkt:#f3a6bd;--c2:rgba(255,255,255,.06);--pcard:#121a33;--sh:0 6px 30px rgba(0,0,0,.35);--ptx:var(--tx,#e8ecf8);--pmu:var(--mu,#8e98b8);--pln:var(--ln,#243055);padding-bottom:70px;color:var(--ptx)}
#v-prof svg path{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.pf-nt{background:var(--pkbg);color:var(--pkt);border-radius:14px;padding:10px 16px;margin-bottom:12px;font-size:13px;font-weight:600}
.pf-cv{height:230px;border-radius:26px 26px 0 0;background:linear-gradient(120deg,#4f7cff,#8f78c9) center/cover;position:relative;overflow:hidden}
.pf-cv.img{background-size:cover;background-position:center;image-rendering:-webkit-optimize-contrast}
.pf-cv:before,.pf-cv:after{content:"";position:absolute;border-radius:50%;background:rgba(255,255,255,.12)}
.pf-cv:before{width:90px;height:90px;left:44%;top:60px}
.pf-cv:after{width:340px;height:340px;right:-60px;top:-120px}
.pf-cv.img:before,.pf-cv.img:after{display:none}
.pf-hd{position:relative;display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start;background:transparent;border-radius:0 0 26px 26px;padding:0 26px 22px}
.pf-ava{flex:none;width:140px;position:relative;z-index:2}
.pf-big{position:relative;z-index:2;width:140px;height:140px;border-radius:50%;margin-top:-60px;border:0;display:grid;place-items:center;color:#fff;font-size:44px;font-weight:700;background-size:cover;background-position:center;flex:none;box-shadow:0 12px 32px rgba(0,0,0,.45),0 0 28px rgba(185,166,232,.28)}
.pf-big.pf-me{cursor:pointer}
.pf-big.sq{border-radius:28px}
.pf-pl{display:block;width:180px;height:auto;aspect-ratio:500/166;margin:-34px 0 0 -10px;position:relative;z-index:3;object-fit:cover;filter:drop-shadow(0 3px 5px rgba(0,0,0,.3));image-rendering:-webkit-optimize-contrast}
.pf-w{flex:1 1 300px;min-width:0;padding-top:14px}
.pf-w h2{font-size:25px;font-weight:800;line-height:1.2;color:var(--ptx)}
.pf-fio{display:block;font-size:11px;font-weight:300;color:var(--pmu);margin-top:2px}
.pf-nk{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:4px;color:var(--pmu);font-size:13px}
.pf-bd{display:inline-block;background:var(--pkbg);color:var(--pkt);border-radius:10px;padding:2px 10px;font-size:12px;font-weight:600}
.pf-st{margin:10px 0;color:var(--ptx);overflow-wrap:anywhere}
.pf-tg{display:flex;flex-wrap:wrap;gap:8px}
.pf-tg span{background:var(--pkbg);color:var(--pkt);border-radius:14px;padding:5px 13px;font-size:12.5px;font-weight:600}
.pf-ss{display:flex;gap:0;text-align:center}
.pf-ss>div{padding:0 20px;border-left:1px solid var(--pln)}
.pf-ss>div:first-child{border-left:0;padding-left:0}
.pf-ss b{display:block;font-size:21px;font-weight:800;color:var(--ptx)}
.pf-ss small{color:var(--pmu);font-size:11.5px}
.pf-b{height:46px;padding:0 22px;border-radius:15px;background:var(--pk);color:#fff;font-weight:700;display:inline-flex;gap:8px;align-items:center;justify-content:center;cursor:pointer;border:0}
.pf-b.g{background:var(--c2);color:var(--ptx)}
.pf-b:disabled{opacity:.6}
.pf-b svg{width:18px;height:18px}
.pf-bs{display:flex;gap:10px}
.pf-g{display:grid;grid-template-columns:250px minmax(0,1fr) 300px;gap:22px;margin-top:22px;align-items:start}
.pf-g.o{grid-template-columns:minmax(0,1fr) 300px}
.pf-x{background:var(--pcard);border:1px solid var(--pln);border-radius:22px;padding:18px;box-shadow:var(--sh);margin-bottom:18px;color:var(--ptx)}
.pf-mn{padding:10px}
.pf-mi{display:flex;gap:12px;align-items:center;width:100%;padding:12px 14px;border-radius:14px;font-weight:700;color:var(--ptx);text-align:left;cursor:pointer;background:transparent;border:0;font:inherit}
.pf-mi svg{width:20px;height:20px;flex:none}
.pf-mi.on{background:var(--pkbg);color:var(--pkt)}
.pf-mi.off{color:var(--pmu);cursor:default}
.pf-mi small{margin-left:auto;font-size:11px;color:var(--pmu);font-weight:600}
.pf-comp{display:flex;gap:12px;align-items:flex-start}
.pf-comp .in{flex:1;min-width:0}
.pf-comp textarea{width:100%;height:84px;resize:none;background:var(--c2);border:0;border-radius:16px;padding:14px;font:inherit;outline:0;color:var(--ptx)}
.pf-comp .r{display:flex;justify-content:flex-end;margin-top:10px;gap:10px}
.pf-ph{display:flex;gap:12px;align-items:center;margin-bottom:10px}
.pf-ph b{display:block;color:var(--ptx)}.pf-ph small{color:var(--pmu);font-size:12px}
.pf-a{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:14px;background-size:cover;background-position:center;flex:none}
.pf-p p{line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;color:var(--ptx)}
.pf-ac{display:flex;gap:10px;margin-top:12px}
.pf-ac button{display:flex;gap:7px;align-items:center;height:38px;padding:0 14px;border-radius:12px;background:var(--c2);color:var(--pmu);font-weight:700;border:0;cursor:pointer}
.pf-ac button.on{color:var(--pk);background:var(--pkbg)}
.pf-ac button.dg{background:rgba(217,71,95,.2);color:var(--pkt)}
.pf-ac svg{width:18px;height:18px}
.pf-sh{display:flex;justify-content:space-between;margin-bottom:10px}
.pf-sh h3{font-size:16px;font-weight:800;color:var(--ptx)}.pf-sh small{color:var(--pmu)}
.pf-pp{display:flex;gap:12px;align-items:center;width:100%;padding:7px 0;text-align:left;font-weight:600;color:var(--ptx);background:transparent;border:0;cursor:pointer}
.pf-mu{color:var(--pmu)}
.pf-em{color:var(--pmu);text-align:center;padding:24px 0}
.pf-ed{margin-top:18px}
.pf-eh{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.pf-eh h3{font-size:20px;font-weight:800;color:var(--ptx)}.pf-eh small{color:var(--pmu)}
.pf-f{display:grid;grid-template-columns:240px 1fr auto;gap:14px;align-items:center;padding:16px 0;border-top:1px solid var(--pln)}
.pf-f label b{display:block;color:var(--ptx)}.pf-f label small{color:var(--pmu);font-size:12px}
.pf-iw{position:relative}
.pf-f input,.pf-f textarea{width:100%;background:var(--c2);border:1px solid var(--pln);border-radius:14px;padding:15px 16px;font:inherit;outline:0;color:var(--ptx)}
.pf-iw input{padding-right:70px}
.pf-f textarea{height:96px;resize:none}
.pf-cnt{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:12px;color:var(--pmu)}
.pf-m{font-size:12px;margin-top:4px;color:#6fcf8a}.pf-m.e{color:var(--pkt)}
.pf-sw{width:54px;height:30px;border-radius:15px;background:#3a4468;position:relative;border:0;cursor:pointer}
.pf-sw i{position:absolute;left:3px;top:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:transform .15s}
.pf-sw.on{background:var(--pk)}.pf-sw.on i{transform:translateX(24px)}
.pf-cr{margin-top:18px;text-align:center}
.pf-cr h3{font-size:18px;font-weight:800;color:var(--ptx)}
.pf-cr small{display:block;color:var(--pmu);margin-top:2px}
.pf-cr canvas{display:block;width:300px;max-width:100%;height:auto;aspect-ratio:1;margin:12px auto;border-radius:18px;touch-action:none;cursor:grab;background:#1a2342}
.pf-cr input[type=range]{width:min(300px,90%);accent-color:var(--pk)}
.pf-cr .r{display:flex;gap:10px;justify-content:center;margin-top:12px}
.pf-pv{display:flex;gap:12px;align-items:center;margin-top:10px}
.pf-pv img{width:64px;height:64px;border-radius:12px;object-fit:cover}
.pf-pimg{display:block;max-width:100%;border-radius:14px;margin-top:10px}
.pf-modal-bg{position:fixed;inset:0;background:rgba(4,6,14,.65);z-index:9999;display:flex;justify-content:center;align-items:center;padding:16px}
.pf-modal{background:var(--s2,#121a33);border:1px solid var(--pln);color:var(--ptx);border-radius:24px;width:100%;max-width:680px;max-height:85vh;overflow:auto;padding:24px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.pf-modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.pf-modal-head h3{margin:0;font-size:22px;font-weight:800}
.pf-modal-close{border:0;background:var(--c2);color:var(--ptx);width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;font-weight:700}
.pf-p-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.pf-p-card{background:var(--c2);border:1px solid var(--pln);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:10px}
.pf-p-card img{width:100%;height:100px;object-fit:contain;background:rgba(0,0,0,.25);border-radius:12px}
.pf-p-card-title{font-weight:700;font-size:15px;color:var(--ptx)}
.pf-dp{border-radius:20px;overflow:hidden;background:var(--c2);margin-bottom:16px}
.pf-dp-cv{height:150px;background:linear-gradient(120deg,#4f7cff,#8f78c9) center/cover}
.pf-dp-row{display:flex;align-items:flex-end;gap:14px;padding:0 18px 16px}
.pf-dp-av{position:relative;flex:none;width:92px;height:92px;margin-top:-36px;border-radius:50%;border:5px solid var(--s2,#121a33);display:grid;place-items:center;color:#fff;font-size:30px;font-weight:700;background-size:cover;background-position:center;cursor:pointer;overflow:hidden}
.pf-dp-av.sq{border-radius:20px}
.pf-dp-av:after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.45)}
.pf-dp-av svg{position:absolute;z-index:1;width:30px;height:30px;color:#fff}
.pf-dp-nm{font-weight:800;font-size:18px;color:var(--ptx);padding-bottom:6px;min-width:0;overflow-wrap:anywhere}
.pf-dp-pl{display:block;width:150px;height:auto;aspect-ratio:500/166;border-radius:8px;object-fit:cover}
.pf-dt{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px}
.pf-dt-i{display:flex;align-items:center;gap:10px;padding:14px;border-radius:16px;border:1.5px solid var(--pln);background:transparent;font:inherit;color:var(--ptx);cursor:pointer;text-align:left}
.pf-dt-i svg{width:22px;height:22px;flex:none}
.pf-dt-i small{margin-left:auto;font-size:11px;color:var(--pmu)}
.pf-dt-i.on{border-color:var(--pk);background:var(--pkbg);color:var(--pkt)}
.pf-th{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:18px;padding-top:16px;border-top:1px solid var(--pln)}
#v-prof .pf-cv{width:100vw;margin-left:calc(50% - 50vw);border-radius:0;-webkit-mask-image:linear-gradient(to bottom,#000 30%,transparent 100%);mask-image:linear-gradient(to bottom,#000 30%,transparent 100%)}
#v-prof .pf-ava{animation:pfFloat 5s ease-in-out infinite}
@keyframes pfFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@media(prefers-reduced-motion:reduce){#v-prof .pf-ava{animation:none}}
@media(max-width:1100px){.pf-g,.pf-g.o{grid-template-columns:1fr}.pf-mn{display:flex;flex-wrap:wrap}.pf-mi{width:auto}.pf-f{grid-template-columns:1fr}}
@media(max-width:640px){.pf-big{width:108px;height:108px;margin-top:-42px}.pf-cv{height:170px}.pf-ss>div{padding:0 12px}}`;
document.head.appendChild(css);

let tok=0,S=null,delArm=null;
const COLS='id,name,fio,nick,last_seen,status,tags,avatar_url,cover_url,comments_off,plate_url,ava_square,pfst';
async function render(u){
  const tk=++tok;
  put('<div class="pf-x pf-em">Загружаем…</div>');
  const SB=await getSB();if(tk!==tok)return;
  if(!SB){put('<div class="pf-x pf-em">Нет связи с сервером. Проверь интернет и обнови страницу.</div>');return}
  const me=(await SB.auth.getUser()).data.user;if(tk!==tok)return;
  if(!me){put('<div class="pf-x pf-em">Чтобы открыть профиль, войди в аккаунт.<br><button class="pf-b" data-go="1" style="margin:14px auto 0">Войти</button></div>');return}
  const lim=await SB.rpc('am_limited');if(tk!==tok)return;
const key=u||me.id,q=SB.from('profiles').select(COLS);
  const pr=await(/^[0-9a-f-]{36}$/i.test(key)?q.eq('id',key):q.eq('nick',key)).maybeSingle();
  if(tk!==tok)return;
  if(pr.error||!pr.data){put('<div class="pf-x pf-em">'+(pr.error?'Не удалось загрузить: '+esc(pr.error.message)+'. Проверь, что SQL выполнен.':'Профиль не найден.')+'</div>');return}
  if(lim.data===true&&pr.data.id!==me.id){put('<div class="pf-x pf-em">Доступ к чужим профилям для тебя закрыт.</div>');return}
  const pd=pr.data,urls=[pd.plate_url,pd.cover_url].filter(Boolean);
if(urls.length){
  const mi=await SB.from('market_items').select('image_url').in('image_url',urls);
  if(tk!==tok)return;
  if(!mi.error){
    const ok=new Set((mi.data||[]).map(z=>z.image_url)),fix={};
    if(pd.plate_url&&!ok.has(pd.plate_url)){fix.plate_url='';pd.plate_url=''}
    if(pd.cover_url&&!ok.has(pd.cover_url)){fix.cover_url='';pd.cover_url=''}
    if(me.id===pd.id&&Object.keys(fix).length)SB.from('profiles').update(fix).eq('id',me.id).then(()=>{});
  }
}
  const id=pr.data.id,mine=id===me.id;
  let [np,nf,ng,fw,ps,fo,su]=await Promise.all([
    SB.from('posts').select('id',{count:'exact',head:true}).eq('user_id',id),
    SB.from('follows').select('follower',{count:'exact',head:true}).eq('followee',id),
    SB.from('follows').select('followee',{count:'exact',head:true}).eq('follower',id),
    mine?null:SB.from('follows').select('follower').match({follower:me.id,followee:id}).maybeSingle(),
    SB.from('posts').select(PS1).eq('user_id',id).order('created_at',{ascending:false}).limit(50),
    SB.from('follows').select('follower').eq('followee',id).limit(6),
    SB.from('follows').select('followee').eq('follower',id).limit(6)]);
  if(tk!==tok)return;
  if(ps.error&&/images|img_top|poll|repost|column/i.test(ps.error.message)){
    ps=await SB.from('posts').select(PS0).eq('user_id',id).order('created_at',{ascending:false}).limit(50);
    if(tk!==tok)return;
  }
  if(ps.error){put('<div class="pf-x pf-em">Не удалось загрузить: '+esc(ps.error.message)+'</div>');return}
  const ids=ps.data.map(x=>x.id),pids=ps.data.filter(x=>x.poll).map(x=>x.id),fol=(fo.data||[]).map(x=>x.follower),sub=(su.data||[]).map(x=>x.followee),all=[...new Set([...fol,...sub])];
  /* оригиналы пересланных постов и счётчики пересылок */
  const rids=[...new Set(ps.data.map(x=>x.repost_of).filter(Boolean))],ORG={},RC={};
  if(rids.length){
    const o=await SB.from('posts').select('id,user_id,body,image_url,images,img_top,created_at').in('id',rids);
    const od=o.data||[],ou=[...new Set(od.map(z=>z.user_id))];
    const op=ou.length?await SB.from('profiles').select('id,name,fio,avatar_url').in('id',ou):null;
    const PM=Object.fromEntries(((op&&op.data)||[]).map(z=>[z.id,z]));
    od.forEach(z=>{z.au=PM[z.user_id]||{name:'Участник'};ORG[z.id]=z});
  }
  const cids=[...new Set([...ids,...rids])];
  const rcq=cids.length?await SB.from('posts').select('repost_of').in('repost_of',cids):null;
  ((rcq&&rcq.data)||[]).forEach(z=>{RC[z.repost_of]=(RC[z.repost_of]||0)+1});
  if(tk!==tok)return;
  const [lk,nm,,vt]=await Promise.all([
    ids.length?SB.from('post_likes').select('post_id').eq('user_id',me.id).in('post_id',ids):null,
    all.length?SB.from('profiles').select('id,name,avatar_url').in('id',all):null,
    CMT.load(SB,me,ids,()=>S&&draw()),
    pids.length?SB.from('post_poll_votes').select('post_id,opt,user_id').in('post_id',pids):null]);
  if(tk!==tok)return;
  const M=Object.fromEntries(((nm&&nm.data)||[]).map(x=>[x.id,x]));
  const PV={};
  ((vt&&vt.data)||[]).forEach(z=>{const o=PV[z.post_id]=PV[z.post_id]||{c:{},u:new Set(),mine:[]};o.c[z.opt]=(o.c[z.opt]||0)+1;o.u.add(z.user_id);if(z.user_id===me.id)o.mine.push(z.opt)});
  S={me,id,mine,p:pr.data,np:np.count||0,nf:nf.count||0,ng:ng.count||0,fw:!!(fw&&fw.data),posts:ps.data,
     liked:new Set(((lk&&lk.data)||[]).map(x=>x.post_id)),fol:fol.map(i=>M[i]).filter(Boolean),sub:sub.map(i=>M[i]).filter(Boolean),
     ed:false,dsg:false,dk:'status',purchasesList:[],ev:{},fm:{},draft:'',cd:null,crop:null,pimgs:[],pTop:false,poll:null,pollP:false,plus:false,pv:PV,sel:{},orig:ORG,rc:RC,rp:null,rpt:'',bk:undefined};
  setHash(pr.data.nick||id);
  draw();
  loadBk();
}
const mi=(k,t)=>`<div class="pf-mi off">${ic(k)}<span>${t}</span><small>скоро</small></div>`;

function editHtml(){
  const p=S.p,ev=S.ev;
  const F=[['nick','Никнейм','От 5 до 15 символов: латиница, цифры и _',p.nick||'',15],['status','Строка статуса','Показывается рядом с именем',p.status||'',120],['tags','Интересы','Разделяйте запятыми',(p.tags||[]).join(', '),0,1],['name','Имя в чате','От 2 до 30 символов',p.name||'',30]];
  return `<div class="pf-x pf-ed"><div class="pf-eh"><div><h3>Редактировать профиль</h3><small>Каждый параметр сохраняется отдельно</small></div><button class="pf-b g" data-x>Готово</button></div>`+
  `<div class="pf-f"><label><b>Фото профиля</b><small>Выбери фото и обрежь по кругу</small></label><span class="pf-mu">${p.avatar_url?'Фото загружено':'Пока нет фото'}</span><div class="pf-bs"><button class="pf-b" data-ava>Выбрать фото</button>${p.avatar_url?'<button class="pf-b g" data-avarm>Убрать</button>':''}</div></div>`+
  `<div class="pf-f"><label><b>Форма фото</b><small>Как показывать большое фото в профиле</small></label><span></span><div class="pf-bs"><button class="pf-b${p.ava_square?' g':''}" data-shape="0">Круг</button><button class="pf-b${p.ava_square?'':' g'}" data-shape="1">Квадрат</button></div></div>`+
  F.map(f=>{const v=ev[f[0]]!=null?ev[f[0]]:f[3],m=S.fm[f[0]];
    const ctl=f[5]?`<textarea data-k="${f[0]}">${esc(v)}</textarea>`:`<input data-k="${f[0]}" value="${esc(v)}" maxlength="${f[4]}"><span class="pf-cnt" data-c="${f[0]}">${v.length}/${f[4]}</span>`;
    return `<div class="pf-f"><label><b>${f[1]}</b><small>${f[2]}</small></label><div><div class="pf-iw">${ctl}</div><div class="pf-m${m&&m.e?' e':''}">${m?esc(m.t):''}</div></div><button class="pf-b" data-s="${f[0]}">Сохранить</button></div>`}).join('')+
  `<div class="pf-f"><label><b>Комментарии</b><small>Можно запретить комментарии под своими публикациями</small></label><span></span><button class="pf-sw${p.comments_off?' on':''}" data-sw role="switch" aria-checked="${!!p.comments_off}" aria-label="Запретить комментарии"><i></i></button></div></div>`;
}

function cropHtml(){
  const c=S.crop;
  return `<div class="pf-x pf-cr"><h3>Фото профиля</h3><small>Двигай фото пальцем. Квадрат: большое фото в профиле. Пунктирный круг: маленькие аватарки.</small><canvas id="pf-cv" width="${VIEW}" height="${VIEW}"></canvas><input type="range" id="pf-z" min="0" max="100" value="${c.t}" aria-label="Масштаб"><div class="r"><button class="pf-b g" data-cx>Отмена</button><button class="pf-b" data-csv${c.busy?' disabled':''}>${c.busy?'Загружаем…':'Сохранить фото'}</button></div></div>`;
}

function designHtml(){
  const p=S.p,k=S.dk||'status',list=(S.purchasesList||[]).filter(x=>x.kind===k);
  const cards=list.map(it=>{
    const on=k==='banner'?p.cover_url===it.image_url:p.plate_url===it.image_url;
    return `<div class="pf-p-card"><img src="${esc(it.image_url)}" alt=""><div class="pf-p-card-title">${esc(it.title)}</div>`+
      (on?`<button class="pf-b g" style="width:100%;height:38px" data-remove-equipped="${k}">Снять</button>`
         :`<button class="pf-b" style="width:100%;height:38px" data-equip-item="${it.id}" data-kind="${k}" data-url="${esc(it.image_url)}">Установить</button>`)+`</div>`}).join('');
  const tile=(kk,ico,t)=>`<button class="pf-dt-i${k===kk?' on':''}" data-dk="${kk}">${ic(ico)}<b>${t}</b><small>Выбрать из покупок</small></button>`;
  return `<div class="pf-modal-bg" id="pfDsg"><div class="pf-modal">
    <div class="pf-modal-head"><div><h3>Оформление</h3><small class="pf-mu">Настройте вид своей страницы</small></div><button class="pf-modal-close" data-close-dsg>✕</button></div>
    <div class="pf-dp"><div class="pf-dp-cv"${p.cover_url?` style="background-image:url('${esc(p.cover_url)}')"`:''}></div>
      <div class="pf-dp-row"><span class="pf-dp-av${p.ava_square?' sq':''}" data-ava role="button" aria-label="Загрузить фото" style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(p.name))}${ic('cam')}</span>
      <div class="pf-dp-nm">${esc(p.name)}</div>${p.plate_url?`<img class="pf-dp-pl" src="${esc(p.plate_url)}" alt="">`:''}</div></div>
    <div class="pf-dt">${tile('status','star','Статус')}${tile('banner','img','Баннеры')}</div>
    ${cards?`<div class="pf-p-grid">${cards}</div>`:`<div class="pf-em">Пока нет купленных ${k==='banner'?'баннеров':'статусов'}. Загляни в маркетплейс</div>`}
    <div class="pf-th"><div><b>Тип оформления профиля</b><small class="pf-mu" style="display:block">Новый или старый вид страницы</small></div><div class="pf-bs"><button class="pf-b${OLD()?' g':''}" data-pst="new">Новый</button><button class="pf-b${OLD()?'':' g'}" data-pst="old">Старый</button></div></div>
  </div></div>`;
}
  
function paint(){
  const cv=$('#pf-cv');if(!cv||!S||!S.crop)return;
  const c=S.crop,x=cv.getContext('2d');
  x.clearRect(0,0,VIEW,VIEW);
  x.drawImage(c.img,c.x,c.y,c.img.width*c.s,c.img.height*c.s);

  x.save();
  x.fillStyle='rgba(0,0,0,.6)';
  x.beginPath();
  x.rect(0,0,VIEW,VIEW);

  const m=VIEW/2-CR,s2=2*CR;
  x.rect(m,m,s2,s2);
  x.fill('evenodd');
  x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.rect(m,m,s2,s2);x.arc(VIEW/2,VIEW/2,CR,0,Math.PI*2,true);x.fill('evenodd');
  x.strokeStyle='#fff';x.lineWidth=2;x.strokeRect(m,m,s2,s2);
  x.setLineDash([6,5]);x.globalAlpha=.85;x.beginPath();x.arc(VIEW/2,VIEW/2,CR,0,Math.PI*2);x.stroke();
  x.restore();
}

function clampC(c){
  const m=VIEW/2-CR,iw=c.img.width*c.s,ih=c.img.height*c.s;
  c.x=Math.min(m,Math.max(VIEW-m-iw,c.x));
  c.y=Math.min(m,Math.max(VIEW-m-ih,c.y));
}

function zoom(t){
  const c=S.crop,ox=(VIEW/2-c.x)/c.s,oy=(VIEW/2-c.y)/c.s;
  c.t=t;c.s=c.min*(1+3*t/100);
  c.x=VIEW/2-ox*c.s;c.y=VIEW/2-oy*c.s;
  clampC(c);paint();
}

function openCrop(f){
  if(!f||!S||!S.mine)return;
  if(!/^image\//.test(f.type)){note('Выбери картинку: JPG или PNG');return}
  const u=URL.createObjectURL(f),img=new Image();
  img.onload=()=>{
    URL.revokeObjectURL(u);
    const k=Math.min(1,2400/Math.max(img.width,img.height));let src=img;
    if(k<1){const t=document.createElement('canvas');t.width=Math.round(img.width*k);t.height=Math.round(img.height*k);t.getContext('2d').drawImage(img,0,0,t.width,t.height);src=t}
    const min=2*CR/Math.min(src.width,src.height);
    S.crop={img:src,min,s:min,t:0,x:VIEW/2-src.width*min/2,y:VIEW/2-src.height*min/2,busy:false};
    S.dsg=false;clampC(S.crop);draw();
    const el=$('.pf-cr');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
  };
  img.onerror=()=>{URL.revokeObjectURL(u);note('Не удалось открыть картинку')};
  img.src=u;
}

async function saveCropResult(){
  const c=S&&S.crop,SB=db();if(!c||c.busy)return;
  c.busy=true;draw();
  const o=document.createElement('canvas');
  o.width=o.height=OUT;
  const sw=2*CR/c.s;
  o.getContext('2d').drawImage(c.img,(VIEW/2-CR-c.x)/c.s,(VIEW/2-CR-c.y)/c.s,sw,sw,0,0,OUT,OUT);

  const blob=await new Promise(r=>o.toBlob(r,'image/jpeg',.88));
  const path=S.id+'.jpg';
  const u=await SB.storage.from(BKT).upload(path,blob,{upsert:true,contentType:'image/jpeg',cacheControl:'3600'});
  if(u.error){c.busy=false;draw();note('Не загрузилось: '+u.error.message);return}
  const url=SB.storage.from(BKT).getPublicUrl(path).data.publicUrl+'?v='+Date.now();
  const r=await upd({avatar_url:url});
  if(r.error){c.busy=false;draw();note('Не сохранилось: '+r.error.message);return}
  S.p.avatar_url=url;S.crop=null;draw();note('Фото обновлено');
}

async function rmAva(){
  const SB=db(),r=await upd({avatar_url:''});
  if(r.error){note('Не получилось: '+r.error.message);return}
  SB.storage.from(BKT).remove([S.id+'.jpg']);
  S.p.avatar_url=null;draw();note('Фото убрано');
}

  const OLD=()=>!!(S&&S.p&&S.p.pfst==='old');
const css2=document.createElement('style');
css2.textContent=`
.pfo{padding:0}
.pfo-t{position:relative;display:flex;justify-content:space-between;align-items:center;gap:12px}
.pfo-t h2{font-size:28px;font-weight:800;color:var(--ptx);overflow-wrap:anywhere}
.pfo-g{display:grid;grid-template-columns:250px minmax(0,1fr) 300px;grid-template-areas:"lf bn bn" "lf ps rt";gap:22px;margin-top:18px;align-items:start}
.pfo-g.nb{grid-template-areas:"lf ps rt"}
.pfo-lf{grid-area:lf;min-width:0}.pfo-bn{grid-area:bn}.pfo-ps{grid-area:ps;min-width:0}.pfo-rt{grid-area:rt}
.pfo-bn{aspect-ratio:4/1;border-radius:24px;background:center/cover;box-shadow:var(--sh)}
.pfo-aw{position:relative;margin-bottom:14px}
.pfo-av{display:grid;place-items:center;width:100%;aspect-ratio:1;border-radius:50%;color:#fff;font-size:64px;font-weight:700;background-size:cover;background-position:center}
.pfo-av.sq{border-radius:28px}.pfo-av.pf-me{cursor:pointer}
.pfo-pl{position:absolute;left:-8px;top:-14px;width:68%;height:auto;aspect-ratio:500/166;object-fit:cover;filter:drop-shadow(0 3px 5px rgba(0,0,0,.3))}
.pfo-nm{text-align:center}.pfo-nm b{display:block;font-size:17px;color:var(--ptx);overflow-wrap:anywhere}
.pfo-pe{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.pfo-pu{display:flex;flex-direction:column;align-items:center;gap:6px;background:transparent;border:0;cursor:pointer;min-width:0;color:var(--ptx)}
.pfo-pu small{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px}
.pfo-lb{display:block;font-size:11.5px;color:var(--pmu);margin:14px 0 6px}.pfo-lb:first-child{margin-top:0}
.pfo-tx{line-height:1.5;overflow-wrap:anywhere;color:var(--ptx)}
.pfo-bt{display:flex;gap:10px;flex-wrap:wrap}.pfo-bt .pf-b{flex:1 1 120px}
@media(max-width:1100px){.pfo-g,.pfo-g.nb{grid-template-columns:1fr;grid-template-areas:"lf" "bn" "rt" "ps"}.pfo-av{max-width:240px}}`;
document.head.appendChild(css2);

/* ===== Публикации: фото (до 8), опросы и викторины, пересылка ===== */
const css4=document.createElement('style');
css4.textContent=`
.pf-comp .r{justify-content:space-between;align-items:center}
.pf-pw{position:relative}
.pf-plus{width:46px;padding:0}
.pf-plus svg{width:22px;height:22px}
.pf-b.sm{height:36px;padding:0 14px;border-radius:12px;font-size:13px}
.pf-fl{position:absolute;left:0;top:calc(100% + 8px);z-index:50;background:var(--pcard);border:1px solid var(--pln);border-radius:18px;box-shadow:0 12px 40px rgba(0,0,0,.55);padding:8px}
.pf-pm{width:190px}
.pf-pol{width:min(380px,calc(100vw - 56px));max-height:70vh;overflow:auto;padding:14px}
.pf-polh{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.pf-polh b{font-size:16px;font-weight:800;color:var(--ptx)}
.pf-pi{width:100%;background:var(--c2);border:1px solid var(--pln);border-radius:12px;padding:11px 12px;font:inherit;color:var(--ptx);outline:0}
.pf-pol>.pf-pi{margin-bottom:10px}
.pf-por{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.pf-rd{flex:none;width:34px;height:34px;border-radius:50%;border:2px solid var(--pmu);background:transparent;color:transparent;display:grid;place-items:center;cursor:pointer;padding:0}
.pf-rd.on{background:#3ec27a;border-color:#3ec27a;color:#fff}
.pf-rd svg{width:18px;height:18px}
.pf-rm{flex:none;width:34px;height:34px;border:0;border-radius:50%;background:var(--c2);color:var(--pmu);cursor:pointer;display:grid;place-items:center;padding:0}
.pf-rm svg{width:16px;height:16px}
.pf-prow{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:12px 0;font-weight:700;color:var(--ptx)}
.pf-prow small{display:block;color:var(--pmu);font-weight:400;font-size:12px}
.pf-st2{display:flex;gap:10px;align-items:center}
.pf-pdn{width:100%;margin-top:6px}
.pf-pc{display:flex;gap:10px;align-items:center;margin-top:10px;background:var(--c2);border-radius:14px;padding:8px 8px 8px 12px}
.pf-pc svg{width:20px;height:20px;flex:none;color:#6f9bff}
.pf-pc span{flex:1;min-width:0;display:block}
.pf-pc b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ptx)}
.pf-pc small{color:var(--pmu);font-size:12px}
.pf-ths{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
.pf-th1{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:var(--c2)}
.pf-th1 img{width:100%;height:100%;object-fit:cover;display:block}
.pf-th1 button{position:absolute;top:4px;right:4px;width:26px;height:26px;border-radius:50%;border:0;background:rgba(0,0,0,.65);color:#fff;cursor:pointer;display:grid;place-items:center;padding:0}
.pf-th1 button svg{width:14px;height:14px}
.pf-pos{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}
.pf-pos small{color:var(--pmu)}
.pf-gl{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin:10px 0;border-radius:14px;overflow:hidden}
.pf-gl img{width:100%;height:200px;object-fit:cover;display:block;cursor:zoom-in}
.pf-gl.n1{grid-template-columns:1fr}
.pf-gl.n1 img{height:auto;max-height:520px}
.pf-gl.od img:first-child{grid-column:1/-1;height:260px}
.pf-ob{margin-top:10px;border:1px solid var(--pln);background:var(--c2);border-radius:18px;padding:12px}
.pf-obh{display:flex;gap:10px;align-items:center;width:100%;background:transparent;border:0;padding:0;margin-bottom:8px;text-align:left;cursor:pointer;color:var(--ptx);font:inherit}
.pf-obh .pf-a{width:34px;height:34px;font-size:12px}
.pf-obh b{display:block;font-size:14px}
.pf-obh small{color:var(--pmu);font-size:11.5px}
.pf-ob p{font-size:14.5px}
.pf-ob .pf-gl{margin:8px 0 0}
.pf-rpb{margin-top:12px;padding-top:12px;border-top:1px solid var(--pln)}
.pf-rpb textarea{width:100%;height:70px;resize:none;background:var(--c2);border:0;border-radius:14px;padding:12px;font:inherit;outline:0;color:var(--ptx)}
.pf-rpb .r{display:flex;justify-content:flex-end;gap:10px;margin-top:8px;flex-wrap:wrap}
.pf-po{margin-top:12px;display:grid;gap:8px}
.pf-po-q{font-weight:800;color:var(--ptx);overflow-wrap:anywhere}
.pf-po-o,.pf-po-r{position:relative;display:flex;align-items:center;gap:10px;min-height:44px;padding:10px 14px;border-radius:14px;background:var(--c2);border:1px solid var(--pln);color:var(--ptx);font:inherit;text-align:left;overflow:hidden;width:100%}
.pf-po-o{cursor:pointer}
.pf-po-o.on{border-color:#4f7cff}
.pf-po-c{flex:none;width:22px;height:22px;border-radius:50%;border:2px solid var(--pmu);display:grid;place-items:center;color:#fff}
.pf-po-c.sq{border-radius:7px}
.pf-po-o.on .pf-po-c{background:#4f7cff;border-color:#4f7cff}
.pf-po-c svg{width:14px;height:14px}
#v-prof .pf-po-c svg path,#v-prof .pf-po-k svg path{stroke-width:3}
.pf-po-r i{position:absolute;left:0;top:0;bottom:0;background:rgba(79,124,255,.38)}
.pf-po.qz .pf-po-r i{background:rgba(255,255,255,.1)}
.pf-po.qz .pf-po-r.ok i{background:rgba(62,194,122,.4)}
.pf-po.qz .pf-po-r.bad i{background:rgba(229,97,122,.3)}
.pf-po-k{position:relative;z-index:1;flex:none;width:22px;height:22px;display:grid;place-items:center;color:#6f9bff}
.pf-po-k svg{width:18px;height:18px}
.pf-po-r.ok .pf-po-k{color:#3ec27a}
.pf-po-r.bad .pf-po-k{color:#e5617a}
.pf-po-t{position:relative;z-index:1;flex:1;min-width:0;overflow-wrap:anywhere}
.pf-po-p{position:relative;z-index:1;flex:none;font-weight:800;font-size:13px}
.pf-po-f{display:flex;justify-content:space-between;align-items:center;gap:10px;color:var(--pmu);font-size:12px}
.pf-lb{position:fixed;inset:0;z-index:10000;background:rgba(2,4,10,.95);display:flex;align-items:center;justify-content:center;touch-action:pan-y}
.pf-lb img{max-width:100vw;max-height:100vh;object-fit:contain;user-select:none;-webkit-user-select:none}
.pf-lb button{position:absolute;border:0;background:rgba(255,255,255,.16);color:#fff;width:46px;height:46px;border-radius:50%;font-size:24px;font-weight:700;cursor:pointer;display:grid;place-items:center;padding:0}
.pf-lb .x{top:14px;right:14px;font-size:18px}
.pf-lb .pv{left:12px;top:50%;transform:translateY(-50%)}
.pf-lb .nx{right:12px;top:50%;transform:translateY(-50%)}
.pf-lb .ct{position:absolute;top:24px;left:50%;transform:translateX(-50%);color:#fff;font:700 13px system-ui,sans-serif;background:rgba(0,0,0,.4);padding:4px 12px;border-radius:12px}
@media(max-width:640px){.pf-gl img{height:140px}.pf-gl.od img:first-child{height:200px}.pf-ths{grid-template-columns:repeat(3,1fr)}}`;
document.head.appendChild(css4);

function pollPanel(){
  const P=S.poll,n=P.opts.length;
  return `<div class="pf-fl pf-pol"><div class="pf-polh"><b>Опрос</b><button class="pf-b g sm" data-pollrm>Убрать опрос</button></div>
  <input class="pf-pi" data-pq maxlength="200" placeholder="Вопрос" value="${esc(P.q)}">
  ${P.opts.map((t,i)=>`<div class="pf-por">${P.quiz?`<button class="pf-rd${P.ok===i?' on':''}" data-pok="${i}" aria-label="Правильный ответ">${ic('chk')}</button>`:''}<input class="pf-pi" data-po="${i}" maxlength="80" placeholder="Вариант ${i+1}" value="${esc(t)}">${n>2?`<button class="pf-rm" data-pord="${i}" aria-label="Удалить вариант">${ic('x')}</button>`:''}</div>`).join('')}
  ${n<MAXO?`<button class="pf-b g sm" data-poadd>Добавить вариант (${n}/${MAXO})</button>`:''}
  <div class="pf-prow"><div>Викторина<small>${P.quiz?'Отметь галочкой правильный ответ':'С правильным ответом'}</small></div><button class="pf-sw${P.quiz?' on':''}" data-poq role="switch" aria-checked="${!!P.quiz}" aria-label="Викторина"><i></i></button></div>
  ${P.quiz?'':`<div class="pf-prow"><div>Можно выбрать<small>вариантов (по умолчанию 1)</small></div><div class="pf-st2"><button class="pf-b g sm" data-pom="-1">−</button><b>${P.m}</b><button class="pf-b g sm" data-pom="1">+</button></div></div>`}
  <button class="pf-b pf-pdn" data-pdone>Готово</button></div>`;
}

function composerHtml(){
  const {p}=S,P=S.poll,n=S.pimgs.length;
  const menu=S.plus?`<div class="pf-fl pf-pm"><button class="pf-mi" data-pph>${ic('img')}<span>Фото</span></button><button class="pf-mi" data-poll>${ic('poll')}<span>Опрос</span></button></div>`:'';
  const thumbs=n?`<div class="pf-ths">${S.pimgs.map((m,i)=>`<div class="pf-th1"><img src="${esc(m.url)}" alt=""><button data-prmi="${i}" aria-label="Убрать фото">${ic('x')}</button></div>`).join('')}</div>
   <div class="pf-pos"><small>Фото ${n}/${MAXP}:</small><button class="pf-b sm${S.pTop?' g':''}" data-ptop="0">Под текстом</button><button class="pf-b sm${S.pTop?'':' g'}" data-ptop="1">Над текстом</button></div>`:'';
  const chip=P&&!S.pollP?`<div class="pf-pc">${ic('poll')}<span><b>${esc(P.q||'Опрос без вопроса')}</b><small>${P.quiz?'Викторина':'Опрос'} · вариантов: ${P.opts.length}</small></span><button class="pf-b g sm" data-poll>Изменить</button></div>`:'';
  return `<div class="pf-x pf-comp">${av(p,'pf-a')}<div class="in"><textarea id="pf-t" maxlength="2000" placeholder="Что нового?">${esc(S.draft)}</textarea>${thumbs}${chip}<div class="r"><div class="pf-pw"><button class="pf-b g pf-plus" data-plus aria-label="Добавить фото или опрос">${ic('plus')}</button>${menu}${S.pollP&&P?pollPanel():''}</div><button class="pf-b" data-pub>Опубликовать</button></div></div></div>`;
}

function galHtml(x){
  const u=postImgs(x),n=u.length;if(!n)return '';
  return `<div class="pf-gl n${n}${n>1&&n%2?' od':''}">${u.map((s,i)=>`<img src="${esc(s)}" alt="" loading="lazy" data-gal="${x.id}" data-gi="${i}">`).join('')}</div>`;
}

/* вставленный (пересланный) пост: фото сверху/снизу как в оригинале */
function origHtml(o){
  if(!o)return `<div class="pf-ob pf-mu">Публикация недоступна</div>`;
  const au=o.au||{name:'Участник'},tx=o.body.trim()?`<p>${esc(o.body)}</p>`:'',g=galHtml(o);
  return `<div class="pf-ob"><button class="pf-obh" data-open="${o.user_id}">${av(au,'pf-a')}<span><b>${esc(au.name)}</b>${au.fio?`<span class="pf-fio">${esc(SF(au.fio))}</span>`:''}<small>${dt(o.created_at)}</small></span></button>${o.img_top?g+tx:tx+g}</div>`;
}

function pollHtml(x){
  const q=x.poll;if(!q||!q.o)return '';
  const v=S.pv[x.id]||{c:{},u:new Set(),mine:[]},done=v.mine.length>0,n=v.u.size,quiz=!!q.quiz,max=quiz?1:(q.m||1),sel=S.sel[x.id]||[];
  const rows=q.o.map((t,i)=>{
    if(!done){const on=sel.includes(i);return `<button class="pf-po-o${on?' on':''}" data-pv="${x.id}" data-i="${i}"><span class="pf-po-c${max>1?' sq':''}">${on?ic('chk'):''}</span><span class="pf-po-t">${esc(t)}</span></button>`}
    const c=v.c[i]||0,pc=n?Math.round(c/n*100):0,my=v.mine.includes(i),ok=quiz&&q.ok===i,bad=quiz&&my&&!ok;
    const k=quiz?(ok?ic('chk'):bad?ic('x'):''):(my?ic('chk'):'');
    return `<div class="pf-po-r${ok?' ok':''}${bad?' bad':''}"><i style="width:${pc}%"></i><span class="pf-po-k">${k}</span><span class="pf-po-t">${esc(t)}</span><span class="pf-po-p">${pc}%</span></div>`}).join('');
  const go=!done&&max>1?`<button class="pf-b sm" data-pvgo="${x.id}"${sel.length?'':' disabled'}>Ответить</button>`:'';
  const foot=`<div class="pf-po-f"><span>${quiz?'Викторина':'Опрос'} · ${done?'ответили: '+n:(max>1?'выбери до '+max:'выбери один вариант')}</span>${go}</div>`;
  return `<div class="pf-po${quiz?' qz':''}"><div class="pf-po-q">${esc(q.q||'')}</div>${rows}${foot}</div>`;
}

async function castVote(id,arr){
  const SB=db(),r=await SB.from('post_poll_votes').insert(arr.map(o=>({post_id:id,opt:o})));
  if(r.error){note('Не получилось: '+r.error.message);return}
  const v=S.pv[id]=S.pv[id]||{c:{},u:new Set(),mine:[]};
  arr.forEach(o=>{v.c[o]=(v.c[o]||0)+1});v.u.add(S.me.id);v.mine=arr.slice();
  S.sel[id]=[];draw();
}

let LBK=null;
function openGal(urls,i0){
  if(!urls.length)return;
  if(LBK)LBK();
  let i=i0||0;const n=urls.length;
  const d=document.createElement('div');d.className='pf-lb';
  d.innerHTML=`<img alt="">${n>1?'<button class="pv" aria-label="Назад">‹</button><button class="nx" aria-label="Вперёд">›</button><div class="ct"></div>':''}<button class="x" aria-label="Закрыть">✕</button>`;
  document.body.appendChild(d);
  const im=d.querySelector('img'),ct=d.querySelector('.ct');
  const show=()=>{im.src=urls[i];if(ct)ct.textContent=(i+1)+' / '+n};
  const go=k=>{i=(i+k+n)%n;show()};
  const close=()=>{d.remove();document.removeEventListener('keydown',kd);LBK=null};
  const kd=e=>{if(e.key==='Escape')close();else if(n>1&&e.key==='ArrowLeft')go(-1);else if(n>1&&e.key==='ArrowRight')go(1)};
  document.addEventListener('keydown',kd);LBK=close;
  let sx=null;
  d.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  d.addEventListener('touchend',e=>{if(sx==null||n<2)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)go(dx<0?1:-1)},{passive:true});
  d.addEventListener('click',e=>{
    const t=e.target;
    if(t.closest('.x')||t===d)close();
    else if(t.closest('.pv'))go(-1);
    else if(t.closest('.nx'))go(1);
  });
  show();
}

function feedHtml(shown){
  const {p,mine}=S;
  return `${mine?composerHtml():''}
  ${S.posts.map(x=>{
    const top=!!x.img_top,g=galHtml(x),tx=x.body.trim()?`<p>${esc(x.body)}</p>`:'';
    const body=x.repost_of?tx+origHtml(S.orig[x.repost_of]):(top?g+tx:tx+g);
    const rpn=S.rc[x.repost_of||x.id]||0;
    const menuBtns=(mine?'':`<button data-pm="${x.id}">${icm('flag')}Пожаловаться</button>`)+`<button data-rp="${x.id}">${icm('rep')}Переслать на свою страницу</button>`+(mine||CMT.mod()?`<button data-del="${x.id}" data-danger>${icm('trash')}${delArm===x.id?'Точно удалить?':'Удалить'}</button>`:'');
    const rpb=S.rp===x.id?`<div class="pf-rpb"><textarea id="pf-rt" maxlength="2000" placeholder="Добавь свой текст (необязательно)">${esc(S.rpt)}</textarea><div class="r"><button class="pf-b g sm" data-rpx>Отмена</button><button class="pf-b sm" data-rpgo="${x.id}">Переслать на свою страницу</button></div></div>`:'';
    return `<article class="pf-x pf-p"><div class="pf-ph">${av(p,'pf-a')}<div style="flex:1;min-width:0"><b>${esc(shown)}</b>${p.fio?`<span class="pf-fio">${esc(SF(p.fio))}</span>`:''}</div><small class="pf-tm">${dt(x.created_at)}</small>${CMT.dots(menuBtns)}</div>${body}${pollHtml(x)}
   <div class="pf-ac"><button data-like="${x.id}" class="${S.liked.has(x.id)?'on':''}">${ic('heart')}${cn(x.post_likes)}</button><button disabled>${ic('cmt')}${CMT.n(x.id)}</button><button data-rp="${x.id}" class="${S.rp===x.id?'on':''}" aria-label="Переслать">${ic('rep')}${rpn}</button></div>${rpb}${CMT.html(x.id,S.id,S.p.comments_off)}</article>`}).join('')||`<div class="pf-x pf-em">${mine?'Публикаций пока нет. Напиши первую выше.':'Публикаций пока нет.'}</div>`}`;
}

function drawOld(){
  const ta=$('#pf-t');if(ta)S.draft=ta.value;
  const rt=$('#pf-rt');if(rt)S.rpt=rt.value;
  sec.querySelectorAll('[data-k]').forEach(i=>S.ev[i.dataset.k]=i.value);
  const {p,mine}=S,tags=(p.tags||[]).filter(Boolean),sn=mine?'В сети':seen(p.last_seen),shown=p.name,sq=p.ava_square?' sq':'';
  const grp=(t,a,n)=>`<div class="pf-x"><div class="pf-sh"><h3>${t} (${n})</h3></div><div class="pfo-pe">${a.slice(0,3).map(u=>`<button class="pfo-pu" data-open="${u.id}">${av(u,'pf-a')}<small>${esc(u.name)}</small></button>`).join('')||'<small class="pf-mu">Пока никого</small>'}</div></div>`;
  put(`<div class="pfo">
  <div class="pfo-t"><h2>${esc(shown)}</h2>${mine?'':CMT.dots(`<button data-pacc>${icm('flag')}Пожаловаться на аккаунт</button>`+(CMT.mod()&&window.MOD?'<button data-pmore data-danger>Модерация</button>':''))}</div>
  ${mine&&S.crop?cropHtml():''}${mine&&S.ed?editHtml():''}${mine&&S.dsg?designHtml():''}
  <div class="pfo-g${p.cover_url?'':' nb'}">
   <div class="pfo-lf">
    <div class="pfo-aw"><span class="pfo-av${sq}${mine?' pf-me':''}"${mine?' data-ava role="button" aria-label="Сменить фото"':''} style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(shown))}</span>${p.plate_url?`<img class="pfo-pl" src="${esc(p.plate_url)}" alt="">`:''}</div>
    <div class="pf-x pfo-nm"><b>${esc(shown)}</b>${p.fio?`<span class="pf-fio">${esc(SF(p.fio))}</span>`:''}${sn?`<span class="pf-bd" style="margin-top:8px">${sn}</span>`:''}</div>
    ${mine?'':`<button class="pf-b${S.fw?' g':''}" data-follow style="width:100%;margin-bottom:18px">${S.fw?'Вы подписаны':'Подписаться'}</button>`}
    ${grp('Подписки',S.sub,S.ng)}${grp('Подписчики',S.fol,S.nf)}
   </div>
   ${p.cover_url?`<div class="pfo-bn" style="background-image:url('${esc(p.cover_url)}')"></div>`:''}
   <div class="pfo-ps">${feedHtml(shown)}</div>
   <aside class="pfo-rt">
    <div class="pf-x"><small class="pfo-lb">Описание</small><div class="pfo-tx">${p.status?esc(p.status):'<span class="pf-mu">Не заполнено</span>'}</div>
     ${tags.length?`<small class="pfo-lb">Интересы</small><div class="pf-tg">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}
     <small class="pfo-lb">Ник</small><div class="pfo-tx">${p.nick?'@'+esc(p.nick):'<span class="pf-mu">не задан</span>'}</div></div>
    <div class="pfo-bt">${mine?`<button class="pf-b" data-edit>${ic('pen')}Редактировать</button><button class="pf-b g" data-open-dsg>${ic('paint')}Оформление</button>`:`<button class="pf-b g" data-dm>${ic('cmt')}Написать</button><button class="pf-b g" data-gift>${ic('gift')}Подарить</button>`}</div>
   </aside>
  </div></div>`);
  if(S.crop)paint();
}

function draw(){
  if(OLD()){drawOld();return}
  const ta=$('#pf-t');if(ta)S.draft=ta.value;
  const rt=$('#pf-rt');if(rt)S.rpt=rt.value;
  sec.querySelectorAll('[data-k]').forEach(i=>S.ev[i.dataset.k]=i.value);
  const {p,mine}=S,tags=(p.tags||[]).filter(Boolean),sn=mine?'В сети':seen(p.last_seen);
  const btns=mine?`<button class="pf-b" data-edit>${ic('pen')}Редактировать профиль</button>`:
    `<button class="pf-b${S.fw?' g':''}" data-follow>${S.fw?'Вы подписаны':'Подписаться'}</button><button class="pf-b g" data-dm>${ic('cmt')}Написать</button>`;
  const shown=p.name;
  const nick=p.nick?'@'+esc(p.nick):(mine?'ник не задан — задай в редактировании':'');
  const menu=mine?`<aside><div class="pf-x pf-mn"><button class="pf-mi" data-open-dsg>${ic('paint')}<span>Оформление</span></button><button class="pf-mi on" data-edit>${ic('pen')}<span>Редактировать профиль</span></button>${mi('mark','Сохранённое')}${mi('gift','Подарки')}</div></aside>`:'';
  
  put(`<div class="pf-cv${p.cover_url?' img':''}"${p.cover_url?` style="background-image:url('${esc(p.cover_url)}')"`:''}></div>
  <div class="pf-hd">${mine?'':CMT.dots(`<button data-pacc>${icm('flag')}Пожаловаться на аккаунт</button>`+(CMT.mod()&&window.MOD?'<button data-pmore data-danger>Модерация</button>':''))}<div class="pf-ava"><span class="pf-big${mine?' pf-me':''}${p.ava_square?' sq':''}"${mine?' data-ava role="button" aria-label="Сменить фото"':''} style="background-color:${col(p.name)};${p.avatar_url?`background-image:url('${esc(p.avatar_url)}')`:''}">${p.avatar_url?'':esc(ini(shown))}</span>${p.plate_url?`<img class="pf-pl" src="${esc(p.plate_url)}" alt="">`:''}</div>
   <div class="pf-w"><h2>${esc(shown)}</h2>${p.fio?`<span class="pf-fio">${esc(SF(p.fio))}</span>`:''}<div class="pf-nk"><span>${nick}</span>${sn?`<span class="pf-bd">${sn}</span>`:''}</div>
    <div class="pf-st">${p.status?esc(p.status):''}</div>${tags.length?`<div class="pf-tg">${tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}</div>
   <div class="pf-sc"><div class="pf-ss pf-ss2"><div data-tabgo="1"><b>${S.np}</b><small>публикаций</small></div><div data-flw="fol"><b>${S.nf}</b><small>подписчиков</small></div><div data-flw="sub"><b>${S.ng}</b><small>подписок</small></div></div><div class="pf-bs">${btns}</div></div></div>
  ${mine&&S.crop?cropHtml():''}
  ${mine&&S.ed?editHtml():''}
  ${mine&&S.dsg?designHtml():''}
  <div class="pf-g${mine?'':' o'}">${menu}<div>${tabsHtml()}${S.tb==='fm'?fmHtml():''}<div${S.tb==='fm'?' hidden':''}>
   ${feedHtml(shown)}
  </div></div><aside>${booksHtml()}</aside></div>`);
  if(S.crop)paint();
}

sec.addEventListener('input',e=>{
  if(e.target.id==='pf-z'&&S&&S.crop){zoom(+e.target.value);return}
  const d=e.target.dataset;
  if(d&&S&&S.poll){
    if('pq' in d){S.poll.q=e.target.value;return}
    if('po' in d){S.poll.opts[+d.po]=e.target.value;return}
  }
  const i=e.target,k=i.dataset&&i.dataset.k;if(!k)return;
  if(k==='nick'){const v=i.value.replace(/[^A-Za-z0-9_]/g,'');if(v!==i.value)i.value=v}
  const c=$(`[data-c="${k}"]`);if(c)c.textContent=i.value.length+'/'+i.maxLength;
});

function shrinkImg(f,max){
  return new Promise((res,rej)=>{
    const u=URL.createObjectURL(f),im=new Image();
    im.onload=()=>{URL.revokeObjectURL(u);const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(b=>b?res(b):rej(new Error('сжатие')),'image/jpeg',.82)};
    im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('не картинка'))};
    im.src=u;
  });
}

sec.addEventListener('change',async e=>{
  if(e.target.id==='pf-file'){openCrop(e.target.files[0]);return}
  if(e.target.id!=='pf-pfile')return;
  const fs=[...e.target.files];if(!fs.length||!S||!S.mine)return;
  const room=MAXP-S.pimgs.length;
  if(room<=0){note('Максимум '+MAXP+' фото');return}
  let over=fs.length>room;
  for(const f of fs.slice(0,room)){
    if(!/^image\//.test(f.type)){note('Выбери картинку: JPG или PNG');continue}
    try{const b=await shrinkImg(f,1280);S.pimgs.push({blob:b,url:URL.createObjectURL(b)})}
    catch(err){note('Не удалось открыть картинку')}
  }
  draw();
  if(over)note('Максимум '+MAXP+' фото');
});

let dr=null;
sec.addEventListener('pointerdown',e=>{
  const cv=e.target.closest&&e.target.closest('#pf-cv');if(!cv||!S||!S.crop)return;
  try{cv.setPointerCapture(e.pointerId)}catch(err){}
  dr={x:e.clientX,y:e.clientY};
});
sec.addEventListener('pointermove',e=>{
  if(!dr||!S||!S.crop)return;
  const cv=$('#pf-cv');if(!cv)return;
  const k=VIEW/cv.getBoundingClientRect().width,c=S.crop;
  c.x+=(e.clientX-dr.x)*k;c.y+=(e.clientY-dr.y)*k;
  dr={x:e.clientX,y:e.clientY};clampC(c);paint();
});
const endDr=()=>{dr=null};
sec.addEventListener('pointerup',endDr);sec.addEventListener('pointercancel',endDr);

async function loadUserPurchases(){
  const SB=db();if(!SB||!S||!S.me)return;
  const p=await SB.from('purchases').select('item_id').eq('buyer',S.me.id);
  if(p.error){note('Не удалось загрузить покупки: '+p.error.message);return}
  const ids=(p.data||[]).map(x=>x.item_id);let list=[];
  if(ids.length){
    const r=await SB.from('market_items').select('*').in('id',ids).order('id',{ascending:false});
    if(r.error){note('Не удалось загрузить покупки: '+r.error.message);return}
    list=r.data||[];
  }
  const own=await SB.from('market_items').select('*').eq('user_id',S.me.id).eq('status','approved');
  if(own.error){note('Не удалось загрузить ваши товары: '+own.error.message);return}
  const have=new Set(list.map(z=>z.id));
  (own.data||[]).forEach(z=>{if(!have.has(z.id))list.push(z)});
  list.sort((a,b)=>b.id-a.id);
  S.purchasesList=list;S.dk='status';S.dsg=true;draw();
}

/* ===== вкладки профиля, FreshMilk, окно подписок ===== */
const css3=document.createElement('style');
css3.textContent=`
.pf-sc{margin-left:auto;padding:46px 46px 0 0;flex:none;display:flex;flex-direction:column;align-items:center;gap:16px}
.pf-sc .pf-bs{justify-content:center;flex-wrap:wrap}
.pf-ss2>div{cursor:pointer}
.pf-tb{display:flex;justify-content:center;margin:0 0 16px}
.pf-tb button{padding:6px 26px;font-size:17px;font-weight:700;color:var(--pmu);background:transparent;border:0;border-left:1px solid var(--pln);cursor:pointer}
.pf-tb button:first-child{border-left:0}
.pf-tb button.on{color:var(--lav,#b9a6e8)}
.pf-fc{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap}
.pf-fc button{height:44px;padding:0 24px;border-radius:22px;background:var(--pcard);border:1px solid var(--pln);color:var(--ptx);font-weight:700;cursor:pointer}
.pf-fc button.on{background:var(--lav,#b9a6e8);color:#1a1230;border-color:transparent}
.pf-fg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.pf-ft{position:relative;aspect-ratio:9/16;border-radius:18px;overflow:hidden;background:#0d1224;border:0;padding:0;cursor:pointer}
.pf-ft video,.pf-ft img{width:100%;height:100%;object-fit:cover;display:block}
.pf-ft span{position:absolute;left:0;right:0;bottom:0;padding:26px 10px 10px;color:#fff;font-size:12.5px;font-weight:600;text-align:left;background:linear-gradient(transparent,rgba(0,0,0,.65));overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.pf-bk{display:flex;gap:12px;align-items:center;width:100%;padding:9px 0;background:transparent;border:0;text-align:left;cursor:pointer;color:var(--ptx);font:inherit}
.pf-bk+.pf-bk{border-top:1px solid var(--pln)}
.pf-bkc{flex:none;width:48px;height:68px;border-radius:8px;background:var(--c2) center/cover}
.pf-bkt{min-width:0;flex:1}
.pf-bkt b{display:block;font-size:14px;line-height:1.25;overflow-wrap:anywhere}
.pf-bkst{display:flex;gap:4px;align-items:center;margin-top:5px;font-size:13px;font-weight:700;color:var(--pmu)}
.pf-bkst svg{width:16px;height:16px;flex:none}
#v-prof .pf-bkst svg path{fill:#f5b301;stroke:#f5b301}
.fw-bg{position:fixed;inset:0;z-index:9999;background:rgba(4,6,14,.65);display:grid;place-items:center;padding:16px}
.fw-box{background:var(--s2,#121a33);border:1px solid var(--ln,#243055);border-radius:28px;width:min(1000px,100%);max-height:88vh;display:flex;flex-direction:column;padding:26px 30px;color:var(--tx,#e8ecf8)}
.fw-h{display:flex;justify-content:space-between;align-items:flex-start}
.fw-h small{color:var(--lav,#b9a6e8);font-weight:700;font-size:11px;letter-spacing:.05em}
.fw-h h3{font-size:28px;font-weight:800;display:flex;gap:10px;align-items:center;margin:4px 0}
.fw-h h3 i{font-style:normal;font-size:12px;background:rgba(185,166,232,.16);color:var(--lav,#b9a6e8);border-radius:12px;padding:4px 10px}
.fw-sub{color:var(--mu,#8e98b8);font-size:13px;margin-bottom:14px}
.fw-x{border:0;background:rgba(255,255,255,.08);width:38px;height:38px;border-radius:50%;font-size:18px;cursor:pointer;font-weight:700;color:var(--tx,#e8ecf8)}
.fw-s{width:100%;height:46px;border:1px solid var(--ln,#243055);border-radius:16px;padding:0 16px;font:inherit;outline:0;background:rgba(255,255,255,.05);margin-bottom:14px;color:var(--tx,#e8ecf8)}
.fw-l{overflow:auto;display:grid;grid-template-columns:1fr 1fr;gap:12px;align-content:start}
.fw-c{display:flex;gap:12px;align-items:center;border:1px solid var(--ln,#243055);border-radius:18px;padding:10px 12px;min-width:0}
.fw-p{display:flex;gap:12px;align-items:center;flex:1;min-width:0;background:transparent;border:0;text-align:left;cursor:pointer;color:inherit;font:inherit;padding:0}
.fw-p span{min-width:0}
.fw-a{flex:none;width:52px;height:52px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;background-size:cover;background-position:center}
.fw-p b{display:block;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fw-p small{color:var(--mu,#8e98b8);font-size:12px}
.fw-b{flex:none;height:38px;padding:0 16px;border-radius:12px;border:0;background:var(--cy,#4f7cff);color:#fff;font-weight:700;font-size:12.5px;cursor:pointer}
.fw-b.g{background:rgba(111,207,138,.16);color:#6fcf8a}
.fw-e{grid-column:1/-1;text-align:center;color:var(--mu,#8e98b8);padding:30px 0}
@media(max-width:700px){.fw-l{grid-template-columns:1fr}.fw-box{padding:20px}.fw-h h3{font-size:22px}.pf-sc{padding:10px 0 0;margin-left:0;align-items:flex-start}.pf-fg{gap:8px}}`;
document.head.appendChild(css3);

const tabsHtml=()=>`<div class="pf-tb"><button data-tb="posts" class="${S.tb==='fm'?'':'on'}">Публикации</button><button data-tb="fm" class="${S.tb==='fm'?'on':''}">FreshMilk</button></div>`;

/* ===== Книги автора: 3 самые популярные книги, вместо имени автора — звёзды ===== */
const bkCover=b=>b.cover||'';
const bkTitle=b=>b.title||'Без названия';
const bkStars=b=>b.st||'0';

function booksHtml(){
  const b=S.bk;
  if(!b||!b.length)return '';
  return `<div class="pf-x"><div class="pf-sh"><h3>Книги автора</h3><small>${b.length}</small></div>`+
    b.map(x=>`<button class="pf-bk" data-bk="${esc(x.id)}"><span class="pf-bkc"${bkCover(x)?` style="background-image:url('${esc(bkCover(x))}')"`:''}></span><span class="pf-bkt"><b>${esc(bkTitle(x))}</b><span class="pf-bkst">${ic('star')}${bkStars(x)}</span></span></button>`).join('')+`</div>`;
}

async function loadBk(){
  const SB=db(),s=S;if(!SB||!s)return;
  const r=await SB.from('library_books').select('id,title,cover,reads,status,archived_at').eq('user_id',s.id).is('archived_at',null).limit(100);
  if(S!==s)return;
  let rows=(r.error?[]:(r.data||[])).filter(x=>!['draft','rejected','pending','hidden'].includes(String(x.status||'').toLowerCase()));
  rows.sort((x,y)=>(+y.reads||0)-(+x.reads||0));
  rows=rows.slice(0,3);
  if(rows.length){
    const q=await SB.from('library_rates').select('book_id,rating').in('book_id',rows.map(x=>x.id));
    if(S!==s)return;
    const m={};(q.data||[]).forEach(z=>{(m[z.book_id]=m[z.book_id]||[]).push(+z.rating||0)});
    rows.forEach(x=>{const a=m[x.id]||[];x.st=a.length?(a.reduce((p,c)=>p+c,0)/a.length).toFixed(1).replace('.',','):'0'});
  }
  S.bk=rows;draw();
}

function openBk(id){
  if(window.LB&&LB.open)return LB.open(id);
  if(window.BK&&BK.open)return BK.open(id);
  note('Открытие книги подключим следующим шагом');
}

function fmHtml(){
  const f=S.fmf||'all',n=S.fn||6;
  const chips=[['all','Все'],['video','Видео'],['fl','Flashes']].map(([k,l])=>`<button data-fmf="${k}" class="${f===k?'on':''}">${l}</button>`).join('');
  let body;
  if(f==='video'||(S.fl&&!S.fl.length))body='<div class="pf-x pf-em">Тут пока ничего нет</div>';
  else if(S.fl===undefined)body='<div class="pf-x pf-em">Загружаем…</div>';
  else body='<div class="pf-fg">'+S.fl.slice(0,n).map(fi=>{
    const vu=fi.video_url||fi.url||fi.video||'',po=fi.cover||fi.thumb_url||fi.thumbnail||fi.poster||fi.cover_url||fi.preview_url||'',tt=fi.title||'';
    return `<button class="pf-ft" data-fl="${fi.id}">${po?`<img src="${esc(po)}" alt="" loading="lazy">`:vu?`<video src="${esc(vu)}#t=0.1" preload="metadata" muted playsinline></video>`:''}${tt?`<span>${esc(tt)}</span>`:''}</button>`}).join('')+'</div>'+(S.fl.length>n?'<button class="pf-b g" data-fmmore style="margin:14px auto 0">Показать ещё</button>':'');
  return `<div class="pf-fc">${chips}</div>${body}`;
}

async function loadFl(){
  const SB=db(),s=S;let rows=null;
  for(const c of ['user_id','author_id','author','owner','uid']){
    const r=await SB.from('flashes').select('*').eq(c,s.id).limit(1000);
    if(!r.error){rows=r.data||[];break}
  }
  if(S!==s)return;
  if(!rows)note('Не удалось загрузить флэши');
  S.fl=(rows||[]).sort((a,b)=>String(b.created_at||b.id).localeCompare(String(a.created_at||a.id),undefined,{numeric:true}));
  draw();
}

function openFl(id){
  if(window.FL&&FL.open)return FL.open(id,S.fl);
  if(window.FM&&FM.open)return FM.open(id);
  note('Просмотр флэша подключим следующим шагом');
}

async function fwModal(kind){
  const SB=db(),s=S,sub=kind==='sub';
  const d=document.createElement('div');d.className='fw-bg';
  d.innerHTML=`<div class="fw-box"><div class="fw-h"><div><small>ПРОФИЛЬ</small><h3>${sub?'Подписки':'Подписчики'}<i>${sub?s.ng:s.nf}</i></h3></div><button class="fw-x" data-c>✕</button></div><div class="fw-sub">${sub?'Люди, на которых подписан этот профиль':'Люди, которые подписаны на этот профиль'}</div><input class="fw-s" placeholder="Найти по имени или нику" autocomplete="off"><div class="fw-l"><div class="fw-e">Загружаем…</div></div></div>`;
  document.body.appendChild(d);
  let L=[];const mf=new Set(),list=d.querySelector('.fw-l'),inp=d.querySelector('.fw-s');
  const show=()=>{
    const q=inp.value.trim().toLowerCase();
    const R=L.filter(u=>!q||((u.name||'')+' '+(u.nick||'')).toLowerCase().includes(q));
    list.innerHTML=R.map(u=>`<div class="fw-c"><button class="fw-p" data-o="${u.id}"><span class="fw-a" style="background-color:${col(u.name)};${u.avatar_url?`background-image:url('${esc(u.avatar_url)}')`:''}">${u.avatar_url?'':esc(ini(u.name))}</span><span><b>${esc(u.name||'Без имени')}</b>${u.nick?`<small>@${esc(u.nick)}</small>`:''}</span></button>${u.id===s.me.id?'':`<button class="fw-b${mf.has(u.id)?' g':''}" data-f="${u.id}">${mf.has(u.id)?'Вы подписаны':'Подписаться'}</button>`}</div>`).join('')||'<div class="fw-e">Никого не найдено</div>';
  };
  d.addEventListener('click',async e=>{
    const t=e.target;
    if(t===d||t.closest('[data-c]')){d.remove();return}
    const o=t.closest('[data-o]');if(o){d.remove();render(o.dataset.o);return}
    const f=t.closest('[data-f]');
    if(f){
      const id=f.dataset.f,on=mf.has(id);on?mf.delete(id):mf.add(id);show();
      const r=on?await SB.from('follows').delete().match({follower:s.me.id,followee:id}):await SB.from('follows').insert({followee:id});
      if(r.error){on?mf.add(id):mf.delete(id);show();note('Не получилось: '+r.error.message)}
    }
  });
  inp.addEventListener('input',show);
  const r=await SB.from('follows').select(sub?'followee':'follower').match(sub?{follower:s.id}:{followee:s.id}).limit(2000);
  if(r.error){list.innerHTML='<div class="fw-e">Не удалось загрузить: '+esc(r.error.message)+'</div>';return}
  const ids=(r.data||[]).map(x=>sub?x.followee:x.follower),ch=[];
  for(let i=0;i<ids.length;i+=80)ch.push(ids.slice(i,i+80));
  const res=await Promise.all(ch.map(c=>Promise.all([
    SB.from('profiles').select('id,name,nick,avatar_url').in('id',c),
    SB.from('follows').select('followee').eq('follower',s.me.id).in('followee',c)])));
  res.forEach(([p,m])=>{L.push(...(p.data||[]));(m.data||[]).forEach(z=>mf.add(z.followee))});
  L.sort((a,b)=>(a.name||'').localeCompare(b.name||'','ru'));
  show();
}

async function act(e){
  const t=e.target,b=k=>t.closest(k),SB=db();let x;
  if(t.id==='pfDsg'){S.dsg=false;draw();return}
  if(S&&S.plus&&!b('.pf-pm')&&!b('[data-plus]')){S.plus=false;const m=$('.pf-pm');if(m)m.remove()}
  if(b('[data-go]'))MS.show('msg');
  else if((x=b('[data-gal]'))){const p=S.posts.find(z=>z.id==x.dataset.gal)||S.orig[x.dataset.gal];if(p)openGal(postImgs(p),+x.dataset.gi)}
  else if(b('[data-rpx]')){S.rp=null;S.rpt='';draw()}
  else if((x=b('[data-rpgo]'))){
    const id=+x.dataset.rpgo,p=S.posts.find(z=>z.id===id);if(!p)return;
    const tgt=p.repost_of||p.id,ta=$('#pf-rt'),body=ta?ta.value.trim():'';
    x.disabled=true;x.textContent='Пересылаем…';
    const r=await SB.from('posts').insert({body:body||' ',repost_of:tgt}).select(PSEL).single();
    if(r.error){draw();note(/column|repost/i.test(r.error.message)?'Сначала выполни SQL для пересылки в Supabase':'Не получилось: '+r.error.message);return}
    S.rp=null;S.rpt='';
    S.rc[tgt]=(S.rc[tgt]||0)+1;
    if(S.mine){
      if(!S.orig[tgt])S.orig[tgt]={...p,au:S.p};
      S.posts.unshift({...r.data,post_likes:[{count:0}],post_comments:[{count:0}]});S.np++;
    }
    draw();note('Переслано на вашу страницу');
  }
  else if((x=b('[data-rp]'))){const id=+x.dataset.rp;S.rp=S.rp===id?null:id;S.rpt='';draw()}
  else if(b('[data-plus]')){S.plus=!S.plus;draw()}
  else if(b('[data-pph]')){
    S.plus=false;const m=$('.pf-pm');if(m)m.remove();
    if(S.pimgs.length>=MAXP){note('Максимум '+MAXP+' фото');return}
    const f=$('#pf-pfile');f.value='';f.click();
  }
  else if(b('[data-poll]')){S.plus=false;S.pollP=true;S.poll=S.poll||{q:'',opts:['',''],quiz:false,ok:null,m:1};draw()}
  else if(b('[data-pollrm]')){S.poll=null;S.pollP=false;draw()}
  else if(b('[data-pdone]')){S.pollP=false;draw()}
  else if(b('[data-poadd]')){if(S.poll.opts.length<MAXO){S.poll.opts.push('');draw()}}
  else if((x=b('[data-pord]'))){
    const i=+x.dataset.pord,P=S.poll;
    if(P.opts.length>2){P.opts.splice(i,1);if(P.ok===i)P.ok=null;else if(P.ok!=null&&P.ok>i)P.ok--;P.m=Math.min(P.m,P.opts.length);draw()}
  }
  else if((x=b('[data-pok]'))){S.poll.ok=+x.dataset.pok;draw()}
  else if(b('[data-poq]')){S.poll.quiz=!S.poll.quiz;draw()}
  else if((x=b('[data-pom]'))){S.poll.m=Math.max(1,Math.min(S.poll.opts.length,(S.poll.m||1)+(+x.dataset.pom)));draw()}
  else if((x=b('[data-ptop]'))){S.pTop=x.dataset.ptop==='1';draw()}
  else if((x=b('[data-prmi]'))){
    const i=+x.dataset.prmi,m=S.pimgs[i];if(m)URL.revokeObjectURL(m.url);
    S.pimgs.splice(i,1);draw();
  }
  else if((x=b('[data-pvgo]'))){const id=+x.dataset.pvgo,a=S.sel[id]||[];if(a.length)castVote(id,a)}
  else if((x=b('[data-pv]'))){
    const id=+x.dataset.pv,i=+x.dataset.i,p=S.posts.find(z=>z.id===id);
    if(!p||!p.poll)return;
    const v=S.pv[id];if(v&&v.mine.length)return;
    const max=p.poll.quiz?1:(p.poll.m||1);
    if(max===1){castVote(id,[i]);return}
    const a=S.sel[id]=S.sel[id]||[],k=a.indexOf(i);
    if(k>=0)a.splice(k,1);
    else if(a.length>=max){note('Можно выбрать не больше '+max);return}
    else a.push(i);
    draw();
  }
  else if((x=b('[data-bk]')))openBk(x.dataset.bk);
  else if((x=b('[data-tb]'))){S.tb=x.dataset.tb;draw();if(S.tb==='fm'&&S.fl===undefined)loadFl()}
  else if((x=b('[data-fmf]'))){S.fmf=x.dataset.fmf;S.fn=6;draw()}
  else if(b('[data-fmmore]')){S.fn=(S.fn||6)+6;draw()}
  else if((x=b('[data-fl]')))openFl(x.dataset.fl);
  else if((x=b('[data-flw]')))fwModal(x.dataset.flw);
  else if(b('[data-tabgo]')){S.tb='posts';draw()}
  else if(b('[data-pmore]')){if(window.MOD)MOD.menu('profile',S.id,S.id,()=>render(S.id))}
  else if((x=b('[data-pm]')))CMT.report('post',+x.dataset.pm,S.id);
  else if(b('[data-pacc]'))CMT.report('profile',0,S.id);
  else if(b('[data-ava]')){const f=$('#pf-file');f.value='';f.click()}
  else if(b('[data-avarm]'))rmAva();
  else if(b('[data-open-dsg]'))loadUserPurchases();
  else if(b('[data-close-dsg]')){S.dsg=false;draw()}
  else if((x=b('[data-dk]'))){S.dk=x.dataset.dk;draw()}
  else if((x=b('[data-pst]'))){
    const v=x.dataset.pst,r=await upd({pfst:v});
    if(r.error){note('Не получилось: '+r.error.message);return}
    S.p.pfst=v;draw();
  }
  else if(b('[data-gift]'))note('Подарки скоро появятся');
  else if((x=b('[data-equip-item]'))){
    const kind=x.dataset.kind,url=x.dataset.url;
    const r=await upd(kind==='banner'?{cover_url:url}:{plate_url:url});
    if(r.error){note('Ошибка при установке: '+r.error.message)}
    else{
      if(kind==='banner')S.p.cover_url=url;else S.p.plate_url=url;
      draw();
      note((kind==='banner'?'Баннер':'Плашка')+' установлен');
    }
  }
  else if((x=b('[data-remove-equipped]'))){
    const kind=x.dataset.removeEquipped;
    const r=await upd(kind==='banner'?{cover_url:''}:{plate_url:''});
    if(r.error){note('Ошибка: '+r.error.message)}
    else{
      if(kind==='banner')S.p.cover_url='';else S.p.plate_url='';
      draw();
      note((kind==='banner'?'Баннер':'Плашка')+' снят');
    }
  }
  else if((x=b('[data-shape]'))){
    const sq=x.dataset.shape==='1',r=await upd({ava_square:sq});
    if(r.error){note('Не получилось: '+r.error.message);return}
    S.p.ava_square=sq;draw();
  }
  else if(b('[data-cx]')){S.crop=null;draw()}
  else if(b('[data-csv]'))saveCropResult();
  else if((x=b('[data-open]')))render(x.dataset.open);
  else if(b('[data-edit]')){S.ed=true;draw();const el=$('.pf-ed');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
  else if(b('[data-x]')){S.ed=false;S.ev={};S.fm={};draw()}
  else if(b('[data-dm]')){if(window.MG)MG.dm(S.id);else note('Личные сообщения скоро появятся')}
  else if(b('[data-sw]')){
    const on=!S.p.comments_off,r=await upd({comments_off:on});
    if(r.error){note('Не получилось: '+r.error.message);return}
    S.p.comments_off=on;draw();
  }
  else if((x=b('[data-s]'))){
    const k=x.dataset.s,inp=$(`[data-k="${k}"]`),v=inp.value.trim();let arg,r;
    const bad=m=>{S.ev[k]=inp.value;S.fm[k]={t:m,e:1};draw()};
    if(k==='nick'){
      if(!/^[A-Za-z0-9_]{5,15}$/.test(v))return bad('5–15 символов: латиница, цифры и _');
      r=await upd({nick:v});
      if(r.error)return bad(r.error.code==='23505'?'Этот ник уже занят':'Не получилось: '+r.error.message);
      S.p.nick=v;setHash(v);
    }else{
      if(k==='name'){if(v.length<2||v.length>30)return bad('От 2 до 30 символов');arg={name:v}}
      else if(k==='status')arg={status:v};
      else arg={tags:v.split(',').map(s=>s.trim()).filter(Boolean).slice(0,10)};
      r=await upd(arg);
      if(r.error)return bad('Не получилось: '+r.error.message);
      if(k==='name')S.p.name=v;else if(k==='status')S.p.status=v;else S.p.tags=arg.tags;
    }
    delete S.ev[k];S.fm[k]={t:'Сохранено',e:0};draw();
  }
  else if(b('[data-follow]')){
    const on=S.fw;S.fw=!on;S.nf+=on?-1:1;draw();
    const r=on?await SB.from('follows').delete().match({follower:S.me.id,followee:S.id}):await SB.from('follows').insert({followee:S.id});
    if(r.error){S.fw=on;S.nf+=on?1:-1;draw();note('Не получилось: '+r.error.message)}
  }
  else if(b('[data-pub]')){
    const ta=$('#pf-t'),body=ta.value.trim();
    if(!body&&!S.pimgs.length&&!S.poll)return;
    let poll=null;
    if(S.poll){
      const P=S.poll,q=P.q.trim(),lst=P.opts.map((t,i)=>({t:t.trim(),i})).filter(z=>z.t);
      if(!q){note('Напиши вопрос для опроса');return}
      if(lst.length<2){note('В опросе нужно минимум 2 варианта');return}
      let ok=null;
      if(P.quiz){const k=lst.findIndex(z=>z.i===P.ok);if(k<0){note('Отметь галочкой правильный ответ');return}ok=k}
      poll={q,o:lst.map(z=>z.t),quiz:!!P.quiz,ok,m:P.quiz?1:Math.max(1,Math.min(P.m||1,lst.length))};
    }
    const btn=b('[data-pub]');btn.disabled=true;btn.textContent='Публикуем…';
    const urls=[],paths=[];
    for(let i=0;i<S.pimgs.length;i++){
      const path=S.me.id+'/'+Date.now()+'_'+i+'.jpg';
      const u=await SB.storage.from('posts').upload(path,S.pimgs[i].blob,{contentType:'image/jpeg',cacheControl:'3600'});
      if(u.error){if(paths.length)SB.storage.from('posts').remove(paths);draw();note('Фото не загрузилось: '+u.error.message);return}
      paths.push(path);urls.push(SB.storage.from('posts').getPublicUrl(path).data.publicUrl);
    }
    const r=await SB.from('posts').insert({body:body||' ',image_url:urls[0]||null,images:urls,img_top:S.pTop&&urls.length>0,poll}).select(PSEL).single();
    if(r.error){
      if(paths.length)SB.storage.from('posts').remove(paths);
      draw();
      note(/column|images|img_top|poll/i.test(r.error.message)?'Сначала выполни SQL для фото и опросов в Supabase':'Не опубликовалось: '+r.error.message);
      return;
    }
    S.pimgs.forEach(m=>URL.revokeObjectURL(m.url));
    S.pimgs=[];S.pTop=false;S.poll=null;S.pollP=false;ta.value='';S.draft='';
    S.posts.unshift({...r.data,post_likes:[{count:0}],post_comments:[{count:0}]});S.np++;draw();
  }
  else if((x=b('[data-like]'))){
    const p=S.posts.find(z=>z.id==x.dataset.like),on=S.liked.has(p.id);
    p.post_likes=[{count:cn(p.post_likes)+(on?-1:1)}];on?S.liked.delete(p.id):S.liked.add(p.id);draw();
    const r=on?await SB.from('post_likes').delete().match({post_id:p.id,user_id:S.me.id}):await SB.from('post_likes').insert({post_id:p.id});
    if(r.error)note('Не получилось: '+r.error.message);
  }
  else if((x=b('[data-del]'))){
    const id=+x.dataset.del;
    /* без всплывающего confirm: первое нажатие готовит удаление, второе удаляет */
    if(delArm!==id){delArm=id;note('Нажми «Удалить» ещё раз, чтобы удалить публикацию');setTimeout(()=>{if(delArm===id)delArm=null},4000);return}
    delArm=null;
    const pp=S.posts.find(z=>z.id===id),r=await SB.from('posts').delete().eq('id',id).select();
    S.cd=null;
    if(r.error||!r.data.length){draw();note('Не удалось удалить: '+(r.error?r.error.message:'нет прав (RLS)'));return}
    const fps=pp?postImgs(pp).map(u=>decodeURIComponent((u.split('/posts/')[1]||'').split('?')[0])).filter(Boolean):[];
    if(fps.length)SB.storage.from('posts').remove(fps);
    S.posts=S.posts.filter(z=>z.id!==id&&z.repost_of!==id);S.np=S.posts.length>=S.np?S.np:S.np;S.np--;draw();
  }
}
sec.addEventListener('click',act);

let want=null;
window.PF={open:u=>{want=u||null;render(want)}};
(window.RV=window.RV||{}).prof=()=>{want=null;render(null)};
document.addEventListener('sb',()=>{if(!sec.hidden)render(want)});

/* После перезагрузки: если в адресе #/@ник, открываем этот профиль */
(function(){
  const m=/^#\/@(.+)$/.exec(H0);if(!m)return;
  const k=decodeURIComponent(m[1]);let n=0;
  const t=setInterval(()=>{
    if(window.MS&&MS.show){clearInterval(t);MS.show('prof');setTimeout(()=>window.PF.open(k),80)}
    else if(++n>100)clearInterval(t);
  },100);
})();
})();

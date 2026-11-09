/* Найденная монета: раз в 2 дня, после долгого времени на платформе.
   Время считается, только пока вкладка открыта и ты что-то нажимаешь или листаешь.
   Сколько активных минут ждать до монеты (случайно в этих пределах): */
(function(){
const MIN_SEC=12*60, MAX_SEC=30*60;   // 12-30 минут активности
const LIFE=30000;                      // монета висит 30 секунд
const K_SEC='coin_sec',K_NEED='coin_need';

const st=document.createElement('style');
st.textContent=`
.coin.find{position:fixed;z-index:3000;width:56px;height:56px;margin:0;padding:0;border:0;cursor:pointer;box-shadow:0 0 0 1px rgba(160,100,0,.4),0 6px 18px rgba(0,0,0,.45),0 0 22px rgba(246,184,31,.45);animation:cf-in .4s ease-out,cf-fl 2.2s ease-in-out infinite}
@keyframes cf-in{from{opacity:0}to{opacity:1}}
@keyframes cf-fl{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-6px) scale(1.05)}}
.cf-plus{position:fixed;z-index:3000;pointer-events:none;font-weight:800;font-size:22px;color:#ffe27a;text-shadow:0 2px 8px rgba(0,0,0,.6);animation:cf-up 1.2s ease-out forwards}
@keyframes cf-up{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-46px)}}`;
document.head.appendChild(st);

const rd=k=>{try{return +localStorage.getItem(k)||0}catch(e){return 0}};
const wr=(k,v)=>{try{localStorage.setItem(k,String(v))}catch(e){}};
const rnd=()=>Math.round(MIN_SEC+Math.random()*(MAX_SEC-MIN_SEC));
let sec=rd(K_SEC),need=rd(K_NEED),el=null,gone=null,busy=false,nextCheck=0,last=Date.now();
if(!need){need=rnd();wr(K_NEED,need)}
/* для проверки: открой сайт с ?coin=1 в конце адреса, монета появится через ~15 секунд */
if(/[?&]coin=1/.test(location.search))need=15;

['pointerdown','touchstart','keydown','scroll'].forEach(ev=>addEventListener(ev,()=>{last=Date.now()},{passive:true,capture:true}));

async function sync(){
  const S=window.SB;if(!S)return;
  try{
    const u=(await S.auth.getUser()).data.user;if(!u)return;
    const r=await S.from('profiles').select('coins').eq('id',u.id).maybeSingle();
    if(r.data&&r.data.coins!=null)document.querySelectorAll('.cn').forEach(e=>{e.textContent=r.data.coins});
  }catch(e){}
}

function plus(r){
  const p=document.createElement('div');
  p.className='cf-plus';p.textContent='+1';
  p.style.left=(r.left+r.width/2-14)+'px';p.style.top=r.top+'px';
  document.body.appendChild(p);
  setTimeout(()=>p.remove(),1300);
}
function drop(){clearTimeout(gone);if(el){el.remove();el=null}}

async function take(){
  if(busy||!el)return;
  busy=true;clearTimeout(gone);
  const r=el.getBoundingClientRect();let n=0;
  try{const x=await window.SB.rpc('coin_take');n=Number(x.data)||0}catch(e){}
  busy=false;drop();
  if(n>0){plus(r);sec=0;need=rnd();wr(K_SEC,0);wr(K_NEED,need);sync()}
  else nextCheck=Date.now()+600000;
}

function spawn(){
  const S=56,w=innerWidth,h=innerHeight;
  el=document.createElement('button');
  el.className='coin find';el.setAttribute('aria-label','Монета');
  el.style.left=Math.round(8+Math.random()*Math.max(0,w-S-16))+'px';
  el.style.top=Math.round(76+Math.random()*Math.max(0,h-S-76-70))+'px';
  el.onclick=take;
  document.body.appendChild(el);
  /* не нашла за 30 секунд: ещё один шанс примерно через 5 минут активности */
  gone=setTimeout(()=>{drop();sec=Math.max(0,need-300);wr(K_SEC,sec)},LIFE);
}

async function tick(){
  if(document.hidden||el||busy||Date.now()-last>60000)return;
  sec+=5;wr(K_SEC,sec);
  if(sec<need||Date.now()<nextCheck||!window.SB)return;
  busy=true;let ok=false;
  try{const u=(await window.SB.auth.getUser()).data.user;if(u){const r=await window.SB.rpc('coin_ready');ok=!!(r&&!r.error&&r.data)}}catch(e){}
  busy=false;
  if(ok)spawn();else nextCheck=Date.now()+600000;
}
setInterval(tick,5000);
window.COIN={sync};
})();

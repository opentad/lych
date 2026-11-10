/* Статистика Flashes: запоминает, на какой секунде зритель пролистал, поставил лайк или написал комментарий.
   Ничего не меняет в самой ленте, только слушает её. Подключается после freshmilk.js. */
(function(){
let cur=null,io=null,mo=null,sc=null;

const vid=el=>el&&el.querySelector('video');
function rec(id,k,v){
  if(!id)return;
  const S=window.SB;if(!S)return;
  const s=Math.max(0,Math.floor((v&&v.currentTime)||0));
  try{S.rpc('flash_event',{fid:id,k:k,s:s}).then(()=>{},()=>{})}catch(e){}
}

/* какой Flash сейчас на экране и когда его пролистали */
function watch(){
  const n=document.querySelector('#fm-sc');
  if(n===sc)return;
  if(cur){rec(cur.id,'skip',vid(cur.el));cur=null}
  if(io){io.disconnect();io=null}
  if(mo){mo.disconnect();mo=null}
  sc=n;if(!n)return;
  io=new IntersectionObserver(es=>es.forEach(en=>{
    const el=en.target;
    if(en.isIntersecting&&en.intersectionRatio>=.6){
      if(cur&&cur.el!==el)rec(cur.id,'skip',vid(cur.el));
      cur={el,id:el.dataset.id};
    }else if(cur&&cur.el===el){
      rec(cur.id,'skip',vid(el));cur=null;
    }
  }),{root:n,threshold:[0,.6]});
  [...n.children].forEach(c=>{if(c.classList.contains('fm-it'))io.observe(c)});
  mo=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(c=>{
    if(c.nodeType===1&&c.classList.contains('fm-it'))io.observe(c);
  })));
  mo.observe(n,{childList:true});
}

/* лайк (только когда ставят, не когда снимают) и комментарий */
document.addEventListener('click',e=>{
  const t=e.target;if(!t.closest)return;
  const lk=t.closest('#v-fm [data-like]');
  if(lk&&!lk.classList.contains('on')){
    const it=lk.closest('.fm-it');
    if(it)rec(it.dataset.id,'like',vid(it));
    return;
  }
  const cs=t.closest('#v-fm [data-csend]');
  if(cs&&cur){
    const i=document.querySelector('#cm-t');
    if(i&&i.value.trim())rec(cur.id,'comment',vid(cur.el));
  }
},true);

let tries=0;
const wait=setInterval(()=>{
  const sec=document.getElementById('v-fm');
  if(sec){
    clearInterval(wait);
    new MutationObserver(watch).observe(sec,{childList:true,subtree:true});
    watch();
  }else if(++tries>100)clearInterval(wait);
},200);
})();

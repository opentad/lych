/* Банк — раздел «Банк». Подключается в index.html после library.js */
(function(){
const $=s=>document.querySelector(s);
const KEY='milkbank_v1';

/* ===== ДАННЫЕ (Supabase: profiles.coins, transfers, purchases, coin_income, функция send_coins) ===== */
let ME=null,BAL=null,USERS=[],OPS=[],FREQ={},BZ=null,bzo=false;
let bzStep='num',bzKind=null,bzNum='';
const syncCn=()=>document.querySelectorAll('.cn').forEach(e=>{if(BAL!==null)e.textContent=BAL});
const users=()=>USERS;

/* ===== помощники ===== */
const esc=t=>String(t).replace(/[<>&"]/g,m=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[m]));
const fmt=n=>Number(n).toLocaleString('ru-RU');
const kp=n=>{n=Math.abs(+n||0);const a=n%10,c=n%100;return a===1&&c!==11?'коин':(a>=2&&a<=4&&(c<12||c>14))?'коина':'коинов'};
const ic=k=>window.MS?MS.ic(k):'';
const KN=k=>({npd:'ИП на НПД',ip:'ИП',ooo:'ООО'})[String(k||'').toLowerCase()]||'ИП';
const COL=['#4f7cff','#b9a6e8','#f3a6bd','#6fcf8a','#8f7fe0','#e8923a'];
const ava=u=>{let h=0;for(const c of u.n)h=(h*31+c.charCodeAt(0))>>>0;return u.av?`<i style="background:url('${esc(u.av)}') center/cover"></i>`:`<i style="background:${COL[h%COL.length]}">${esc(u.n.trim()[0]||'?')}</i>`};
const sg=o=>(o.t==='in'||o.t==='sale'||o.t==='inc')?1:-1;
const ttl=o=>({in:'Перевод от '+o.who,out:'Перевод для '+o.who,sale:'Продажа'+(o.title?': '+o.title:''),buy:'Покупка'+(o.title?': '+o.title:''),inc:o.kind==='found'?'Найденный коин':'Монетизация'+(o.title?': '+o.title:'')})[o.t]||'Операция';
const oic=o=>(o.t==='in'||o.t==='inc')?'<span style="display:block;transform:rotate(180deg)">'+ic('arrow')+'</span>':o.t==='out'?ic('arrow'):ic('shop');
const when=ts=>{const d=new Date(ts);return d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})+', '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const monthOps=()=>OPS.slice().sort((a,b)=>b.ts-a.ts);
const top3=()=>users().filter(u=>FREQ[u.id]>0).sort((a,b)=>FREQ[b.id]-FREQ[a.id]).slice(0,3);

/* ===== стили ===== */
const css=document.createElement('style');
css.textContent=`
#v-bank{padding-bottom:60px}
#v-bank::before{content:'';position:fixed;inset:0;z-index:-1;background:radial-gradient(820px 520px at 90% -8%,rgba(185,166,232,.34),transparent 62%),radial-gradient(700px 520px at 4% 40%,rgba(79,124,255,.28),transparent 64%),radial-gradient(900px 480px at 50% 112%,rgba(243,166,189,.30),transparent 66%),linear-gradient(170deg,#0c1226 0%,#0a0f1f 60%,#0d1024 100%)}
#v-bank::after{content:'';position:fixed;left:0;right:0;bottom:0;height:62vh;z-index:-1;pointer-events:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400' preserveAspectRatio='none'%3E%3Cpath d='M0 150C200 70 380 230 600 150S1000 60 1200 140V400H0Z' fill='%23b9a6e8' fill-opacity='.14'/%3E%3Cpath d='M0 230C220 160 420 300 640 230S1020 170 1200 230V400H0Z' fill='%23f3a6bd' fill-opacity='.13'/%3E%3Cpath d='M0 310C240 260 440 360 680 305S1040 270 1200 315V400H0Z' fill='%234f7cff' fill-opacity='.2'/%3E%3C/svg%3E") center bottom/100% 100% no-repeat}
.bk{max-width:860px}
.bk-hero{position:relative;color:#fff;padding:14px 4px 6px}
.bk-w{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;stroke:none}
.bk-hero>*:not(.bk-w){position:relative}
.bk-l{font-size:14px;font-weight:500;opacity:.92;color:var(--hd)}
.bk-n{display:flex;align-items:center;font-size:46px;font-weight:800;line-height:1.1;margin:6px 0 20px}
.bk-n .coin{width:38px;height:38px;margin:0 0 0 12px;vertical-align:0}
.bk-r{display:flex;gap:10px;flex-wrap:wrap}
.bk-b{display:flex;align-items:center;gap:8px;height:44px;padding:0 20px;border-radius:22px;background:rgba(185,166,232,.14);border:1px solid rgba(185,166,232,.4);color:#fff;font-weight:600;font-size:14px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.bk-b:first-child{background:var(--grad);border-color:transparent;box-shadow:0 6px 20px rgba(79,124,255,.32)}
.bk-b svg{width:17px;height:17px}
.bk-b em{font-style:normal;font-size:10px;background:rgba(255,255,255,.28);border-radius:8px;padding:2px 7px}
.bk-b:disabled{opacity:.8;cursor:default}
.bk-ok{margin-top:14px;font-size:13px;font-weight:600;color:var(--rose)}
.bk .card{margin-top:18px}
.bk-t{display:flex;gap:8px;margin-bottom:12px}
.bk-t button{height:32px;padding:0 16px;border-radius:16px;background:var(--pl);color:var(--bt);font-weight:600;font-size:12.5px}
.bk-t button.on{background:rgba(185,166,232,.2);color:var(--lav);box-shadow:inset 0 0 0 1px rgba(185,166,232,.4)}
.bk-q,.bk-in{width:100%;height:44px;border:1px solid var(--ln);border-radius:14px;padding:0 14px;font:inherit;color:var(--tx);background:rgba(255,255,255,.05);outline:0}
.bk-q:focus,.bk-in:focus{border-color:rgba(185,166,232,.6)}
.bk-in{margin-top:10px}
select.bk-in option{background:#121a33;color:#e8ecf8}
.bk-list{max-height:300px;overflow:auto;margin-top:8px}
.bk-p{display:flex;align-items:center;gap:12px;width:100%;padding:9px 6px;border-radius:14px;text-align:left}
.bk-p:active{background:var(--pl)}
.bk-p i{flex:none;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;color:#fff;font-style:normal;font-weight:700;font-size:15px}
.bk-p b{display:block;font-size:14px;font-weight:600}
.bk-p small{color:var(--mu);font-size:11px}
.bk-mu{color:var(--mu);font-size:12.5px;padding:6px 2px;line-height:1.5}
.bk-act{display:flex;gap:10px;margin-top:14px}
.bk-act button{flex:1;height:42px;border-radius:21px;font-weight:700;font-size:14px}
.bk-go{background:var(--grad);color:#fff}
.bk-x{background:rgba(255,255,255,.08);color:#b8c0dc}
.bk-fb{font-size:12.5px;font-weight:600;min-height:18px;margin-top:8px}
.bk-sel{display:flex;align-items:center;justify-content:space-between;gap:10px}
.bk-sel .bk-p{width:auto;flex:1;cursor:default}
.bk-ch{font-size:12px;font-weight:600;color:var(--lav);padding:6px 10px}
.bk-st{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0 8px;padding:14px 16px;border-radius:18px;border:1px solid rgba(185,166,232,.3);background:linear-gradient(135deg,rgba(79,124,255,.38),rgba(185,166,232,.3) 55%,rgba(243,166,189,.28));color:#fff}
.bk-st small{display:block;font-size:11px;opacity:.8;margin-bottom:3px}
.bk-st b{font-size:20px;font-weight:800}
.bk-st .g{color:var(--ok)}
.bk-st .r{color:var(--rose)}
.bk-o{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--ln)}
.bk-o:last-child{border-bottom:0}
.bk-s{flex:none;min-width:68px;font-size:15px;font-weight:700}
.bk-s.p{color:var(--ok)}
.bk-s.m{color:var(--rose)}
.bk-oi{flex:none;width:36px;height:36px;border-radius:50%;background:rgba(185,166,232,.14);color:var(--lav);display:grid;place-items:center}
.bk-oi svg{width:16px;height:16px}
.bk-o strong{display:block;font-size:13.5px;font-weight:600}
.bk-o small{color:var(--mu);font-size:11px}
@media(max-width:520px){.bk-hero{padding:14px 0 6px}.bk-n{font-size:38px}.bk-st b{font-size:17px}}`;
document.head.appendChild(css);

/* ===== страница ===== */
const sec=document.createElement('section');sec.id='v-bank';sec.hidden=true;$('.main').appendChild(sec);
let open=false,pick=null,tab='all',q='',note='';

function render(){
  const b=BAL,ops=monthOps(),inc=ops.filter(o=>sg(o)>0).reduce((s,o)=>s+o.amt,0),exp=ops.filter(o=>sg(o)<0).reduce((s,o)=>s+o.amt,0);
  const mon=new Date().toLocaleDateString('ru-RU',{month:'long'});
  const fq=top3();
  let panel='';
  if(open&&!pick){
    panel=`<section class="card" id="bk-tr"><div class="hd"><h2>Кому перевести</h2></div><div class="bk-t" id="bk-tabs"></div><input class="bk-q" id="bk-q" placeholder="Поиск по имени или нику" value="${esc(q)}" autocomplete="off"><div class="bk-list" id="bk-list"></div></section>`;
  }else if(open&&pick){
    panel=`<section class="card" id="bk-tr"><div class="hd"><h2>Перевод</h2></div><div class="bk-sel"><div class="bk-p">${ava(pick)}<span><b>${esc(pick.n)}</b><small>@${esc(pick.nick||'')}</small></span></div><button class="bk-ch" data-a="back">Сменить</button></div><input class="bk-in" id="bk-a" inputmode="numeric" placeholder="Сумма (у тебя ${b===null?'…':fmt(b)})" autocomplete="off"><input class="bk-in" id="bk-c" maxlength="100" placeholder="Комментарий (необязательно)" autocomplete="off"><div class="bk-fb" id="bk-fb"></div><div class="bk-act"><button class="bk-go" data-a="send">Перевести</button><button class="bk-x" data-a="cancel">Отмена</button></div></section>`;
  }
  panel+=bzPanel();
  sec.innerHTML=`<div class="bk">
  <div class="bk-hero"><div class="bk-l">На личном счету:</div><div class="bk-n">${b===null?'…':fmt(b)}<span class="coin"></span></div>
   <div class="bk-r"><button class="bk-b" data-a="tr">${ic('arrow')}Перевести</button><button class="bk-b" data-a="bz">${BZ&&BZ.status==='active'?'Счёт проекта':'Открыть расчётный счёт'}</button></div>
   ${note?`<div class="bk-ok">${esc(note)}</div>`:''}</div>
  ${panel}
  <section class="card"><div class="hd"><h2>Частые операции</h2></div>${fq.length?fq.map(u=>`<button class="bk-p" data-pick="${u.id}">${ava(u)}<span><b>${esc(u.n)}</b><small>переводов: ${FREQ[u.id]}</small></span></button>`).join(''):'<div class="bk-mu">Пока не было операций</div>'}</section>
  <section class="card"><div class="hd"><h2>Операции за ${mon}</h2></div>
   <div class="bk-st"><div><small>Доходы</small><b class="g">+${fmt(inc)}</b></div><div><small>Расходы</small><b class="r">−${fmt(exp)}</b></div><div><small>Всего операций</small><b>${ops.length}</b></div></div>
   ${ops.length?ops.map(o=>{const p=sg(o)>0;return `<div class="bk-o"><b class="bk-s ${p?'p':'m'}">${p?'+':'−'}${fmt(o.amt)}</b><span class="bk-oi">${oic(o)}</span><div><strong>${esc(ttl(o))}</strong><small>${when(o.ts)}${o.cm?' · '+esc(o.cm):''}</small></div></div>`}).join(''):'<div class="bk-mu">В этом месяце операций нет</div>'}
  </section></div>`;
  if(open&&!pick)lst();
}

function lst(){
  const all=users(),ql=q.trim().toLowerCase(),t=ql?'all':tab;
  const base=t==='freq'?top3():all;
  const L=base.filter(u=>!ql||u.n.toLowerCase().includes(ql)||(u.nick||'').toLowerCase().includes(ql));
  $('#bk-tabs').innerHTML=`<button class="${t==='freq'?'on':''}" data-tab="freq">Частые</button><button class="${t==='all'?'on':''}" data-tab="all">Все</button>`;
  $('#bk-list').innerHTML=L.length?L.map(u=>`<button class="bk-p" data-pick="${u.id}">${ava(u)}<span><b>${esc(u.n)}</b><small>@${esc(u.nick||'')}</small></span></button>`).join(''):`<div class="bk-mu">${t==='freq'?'Пока не было операций':'Никого не найдено'}</div>`;
}

/* ===== расчётный счёт проекта (ИП на НПД / ИП / ООО) ===== */
function bzPanel(){
  if(!bzo)return '';
  const z=BZ||{},K=KN(z.kind),kd=String(z.kind||'').toLowerCase();
  if(z.status==='pending')return `<section class="card"><div class="hd"><h2>${K} «${esc(z.name)}»</h2></div><div class="bk-mu">Заявка на проверке у модераторов. Когда одобрят, откроется счёт.</div></section>`;
  if(z.status==='active'){
    const rule=kd==='npd'?'Ты работаешь одна, сотрудников нанимать нельзя. Зато просто и без лишних правил.'
      :kd==='ip'?'Зарплаты сотрудникам и взнос платятся со счёта проекта сами. Если денег не хватит, недостающее спишется с твоих личных коинов.'
      :'Зарплаты сотрудникам и взнос платятся со счёта проекта сами. Когда ты выводишь деньги, они делятся между сооснователями по долям (твою долю и комиссию смотри в Офисе). Если денег не хватит, счёт заморозится, а через 30 дней компания закроется. Личные коины при этом не пострадают, потеряешь только деньги проекта.';
    return `<section class="card"><div class="hd"><h2>${K} «${esc(z.name)}»</h2></div><div class="bk-mu">Счёт ${esc(z.acc||'')}</div><div style="font-size:30px;font-weight:800;margin:6px 0">${fmt(z.balance)} ${kp(z.balance)}</div>${z.debt>0?`<div class="bk-fb" style="color:#ff8fa3">Штраф: ${fmt(z.debt)} ${kp(z.debt)}${z.debt_note?' ('+esc(z.debt_note)+')':''}. Спишется, когда на счёте появятся деньги.</div>`:''}${z.frozen?`<div class="bk-fb" style="color:#ff8fa3">Счёт заморожен: не хватает денег на взнос, зарплату или штраф. Пополни счёт.</div>`:''}<div class="bk-mu">Следующий взнос ${z.fee} ${kp(z.fee)}: ${new Date(z.fee_until).toLocaleDateString('ru-RU')}. Комиссия при выводе ${z.commission}%.</div><div class="bk-mu">${rule}</div><input class="bk-in" id="bz-s" inputmode="numeric" placeholder="Сумма"><div class="bk-fb" id="bz-fb"></div><div class="bk-act"><button class="bk-go" data-a="bzdep">Пополнить</button><button class="bk-x" data-a="bzwd">Вывести</button></div></section>`;
  }
  const rej=z.status==='rejected'?`<div class="bk-fb" style="color:#ff8fa3">Прошлая заявка отклонена: ${esc(z.reason||'')}</div>`
    :z.status==='closed'?`<div class="bk-fb" style="color:#ff8fa3">${esc(z.reason||'Прошлая компания закрыта')}. Можно открыть новую.</div>`:'';
  const terms=`<div class="bk-mu">Условия: комиссия ${z.commission}% при выводе денег проекта на личный счёт, взнос ${z.fee} ${kp(z.fee)} раз в 3 месяца. Заявку проверяет модератор.</div>`;
  const tx='style="color:#b8c0dc;font-size:13px;line-height:1.5;margin:8px 0"';
  if(bzStep==='num')return `<section class="card"><div class="hd"><h2>Открыть расчётный счёт</h2></div>${rej}<div class="bk-mu">Впиши номер своего ИП (15 цифр) или ООО (13 цифр).</div><input class="bk-in" id="bz-num" inputmode="numeric" maxlength="15" placeholder="Номер ИП или ООО"><div class="bk-fb" id="bz-fb"></div>${terms}<div class="bk-act"><button class="bk-go" data-a="bznext">Продолжить</button><button class="bk-x" data-a="bzx">Закрыть</button></div><button class="bk-ch" data-a="bzno" style="margin-top:10px">У меня нет ИП или ООО</button></section>`;
  if(bzStep==='info')return `<section class="card"><div class="hd"><h2>Чем отличаются ИП на НПД, ИП и ООО</h2></div>
<div ${tx}><b>ИП на НПД (самозанятый-ИП)</b> — один человек ведёт дело сам и отвечает за него всем своим имуществом. НПД — налог для самозанятых: маленький (4% с доходов от людей, 6% от компаний), без деклараций и взносов, но доход до 2,4 млн ₽ в год и <b>нельзя нанимать сотрудников</b>. Для небольшого дела: рисунки на заказ, мини-магазин, блог.</div>
<div ${tx}><b>ИП</b> (обычный, например на упрощёнке) — тоже один владелец и тоже отвечает всем своим имуществом. Зато можно нанимать сотрудников и расти без потолка дохода. Платит фиксированные страховые взносы и сдаёт отчётность.</div>
<div ${tx}><b>ООО</b> — компания, которую создают один или несколько учредителей. Они рискуют только вложенным капиталом, а не личным имуществом. Долю можно продать, можно нанять директора и бухгалтера и самому не работать. Прибыль делится по долям. Сложнее: нужны устав, адрес и уставный капитал.</div>
<div ${tx}><b>Как оформляют ИП в реальности.</b> Нужны паспорт и ИНН. Подаёшь заявление в налоговую (через Госуслуги, МФЦ или лично), выбираешь вид деятельности и налоги. Примерно за 3 рабочих дня вносят в реестр и дают номер ОГРНИП (15 цифр). Обычно с 18 лет.</div>
<div ${tx}><b>Как оформляют ООО.</b> Нужны название, юридический адрес, устав, директор и уставный капитал (минимум 10 000 ₽). Регистрируют тоже в налоговой, дают номер ОГРН (13 цифр).</div>
<div ${tx}><b>Расчётный счёт в настоящем банке.</b> Приносишь паспорт, ИНН, номер ОГРНИП или ОГРН и выписку из реестра. У ООО ещё устав и документ о назначении директора. Банк проверяет документы несколько дней и открывает счёт.</div>
<div class="bk-mu">Суммы и сроки меняются, точные смотри на сайте налоговой (nalog.gov.ru).</div>
<div ${tx}><b>В Милки всё проще:</b> выбери форму, заполни анкету, модератор проверит и откроет счёт. ИП на НПД работает один. ИП нанимает до 3 человек на пять должностей. ООО нанимает без лимита на любые должности, включая директора и бухгалтера, и может иметь до 5 сооснователей с долями.</div>
<div class="bk-act"><button class="bk-go" data-a="bznpd">ИП на НПД</button><button class="bk-go" data-a="bzip">ИП</button><button class="bk-go" data-a="bzooo">ООО</button></div><div class="bk-act"><button class="bk-x" data-a="bzback">Назад</button></div></section>`;
  const isIp=bzKind!=='ooo';
  const kSel=isIp?`<div class="bk-mu" style="margin-top:8px">Форма</div><select class="bk-in" id="bz-k"><option value="npd"${bzKind==='npd'?' selected':''}>ИП на НПД: один, без сотрудников</option><option value="ip"${bzKind==='ip'?' selected':''}>ИП: можно нанимать до 3 человек</option></select>`:'';
  return `<section class="card"><div class="hd"><h2>Анкета проекта (${KN(bzKind)})</h2></div>${kSel}<div class="bk-mu" style="margin-top:8px">Название проекта</div><input class="bk-in" id="bz-n" maxlength="40" placeholder="Например: Студия Радуга"><div class="bk-mu" style="margin-top:8px">Чем занимается (коротко)</div><input class="bk-in" id="bz-a" maxlength="100" placeholder="Например: рисую аватарки на заказ"><div class="bk-mu" style="margin-top:8px">Кто вы и про что проект</div><textarea class="bk-in" id="bz-o" maxlength="950" style="height:100px;padding:10px;resize:none" placeholder="Минимум 20 символов: кто ты, что будешь делать, чем проект интересен"></textarea><div class="bk-fb" id="bz-fb"></div><div class="bk-act"><button class="bk-go" data-a="bzsend">Подать заявку</button><button class="bk-x" data-a="bzback">Назад</button></div></section>`;
}
async function bzApply(){
  const f=$('#bz-fb'),btn=$('[data-a="bzsend"]'),o=$('#bz-o').value.trim(),ks=$('#bz-k');
  if(ks)bzKind=ks.value;
  if(o.length<20){f.style.color='#f0b46a';f.textContent='Опиши проект подробнее: минимум 20 символов';return}
  btn.disabled=true;f.style.color='#b8c0dc';f.textContent='Отправляю…';
  const r=await window.SB.rpc('biz_apply',{p_kind:bzKind,p_name:$('#bz-n').value,p_activity:$('#bz-a').value,p_about:(bzNum?'Номер: '+bzNum+'. ':'')+o});
  if(r.error){btn.disabled=false;f.style.color='#f0b46a';f.textContent=r.error.message;return}
  note='Заявка отправлена модераторам';bzStep='num';bzNum='';bzKind=null;await load();
}
async function bzMoney(fn){
  const a=parseInt($('#bz-s').value,10),f=$('#bz-fb');
  if(!(a>0)){f.style.color='#f0b46a';f.textContent='Введи сумму больше нуля';return}
  const r=await window.SB.rpc(fn,{amt:a});
  if(r.error){f.style.color='#f0b46a';f.textContent=r.error.message.includes('no_money')?'Не хватает коинов':r.error.message;return}
  note=fn==='biz_deposit'?'Счёт проекта пополнен':'Выведено на личный счёт';await load();
}

async function send(){
  const a=parseInt($('#bk-a').value,10),c=$('#bk-c').value.trim(),f=$('#bk-fb'),btn=$('[data-a="send"]');
  const bad=m=>{f.textContent=m;f.style.color='#f0b46a'};
  if(!(a>0))return bad('Введи сумму больше нуля');
  if(BAL!==null&&a>BAL)return bad('Не хватает коинов: на счету '+fmt(BAL));
  btn.disabled=true;f.style.color='#b8c0dc';f.textContent='Отправляю…';
  let r;try{r=await window.SB.rpc('send_coins',{to_user:pick.id,amt:a,cmt:c})}catch(e){r={error:{message:''}}}
  if(r.error){btn.disabled=false;const m=r.error.message||'';return bad(m.includes('no_money')?'Не хватает коинов':m.includes('self')?'Нельзя переводить самому себе':m.includes('bad_amount')?'Некорректная сумма':'Не получилось перевести: '+(m||'нет связи'))}
  note='Переведено '+fmt(a)+' → '+pick.n;open=false;pick=null;q='';
  await load();
}
async function load(){
  const sb=window.SB;if(!sb)return;
  try{
    const u=(await sb.auth.getUser()).data.user;if(!u)return;ME=u.id;
    /* монетизация: монеты за просмотры Flashes приходят сюда */
    try{await sb.rpc('flash_collect')}catch(e){}
    const d=new Date(),ms=new Date(d.getFullYear(),d.getMonth(),1),msN=ms.getTime(),msI=ms.toISOString();
    const [pr,co,tr,pu,ci]=await Promise.all([
      sb.from('profiles').select('id,name,nick,avatar_url'),
      sb.from('profiles').select('coins').eq('id',ME).maybeSingle(),
      sb.from('transfers').select('*').order('created_at',{ascending:false}).limit(300),
      sb.from('purchases').select('*').or('buyer.eq.'+ME+',seller.eq.'+ME).gte('created_at',msI).order('created_at',{ascending:false}).limit(200),
      sb.from('coin_income').select('*').eq('user_id',ME).gte('created_at',msI).order('created_at',{ascending:false}).limit(200)]);
    const nm={};USERS=[];
    (pr.data||[]).forEach(p=>{nm[p.id]=p.name||p.nick||'Пользователь';if(p.id!==ME&&p.name)USERS.push({id:p.id,n:p.name,nick:p.nick||'',av:p.avatar_url||''})});
    BAL=co.data&&co.data.coins!=null?co.data.coins:0;syncCn();
    try{const z=await sb.rpc('biz_my');BZ=z.data||null}catch(e){}
    FREQ={};OPS=[];
    (tr.data||[]).forEach(t=>{const out=t.from_id===ME,ts=Date.parse(t.created_at);if(out)FREQ[t.to_id]=(FREQ[t.to_id]||0)+1;
      if(ts>=msN)OPS.push({t:out?'out':'in',amt:t.amount,who:nm[out?t.to_id:t.from_id]||'Пользователь',cm:t.comment||'',ts})});
    (pu.data||[]).forEach(p=>{const ts=Date.parse(p.created_at);
      if(p.buyer===ME)OPS.push({t:'buy',amt:p.price,title:p.title||'',ts});
      else if(p.seller===ME)OPS.push({t:'sale',amt:p.seller_gain!=null?p.seller_gain:p.price,title:p.title||'',ts})});
    (ci.data||[]).forEach(c=>OPS.push({t:'inc',amt:c.amount,kind:c.kind,title:c.title||'',ts:Date.parse(c.created_at)}));
  }catch(e){}
  render();
}

sec.addEventListener('click',e=>{
  const b=e.target.closest('[data-a],[data-pick],[data-tab]');if(!b)return;
  if(b.dataset.tab){tab=b.dataset.tab;q='';const i=$('#bk-q');if(i)i.value='';lst();return}
  if(b.dataset.pick){pick=users().find(u=>u.id===b.dataset.pick)||null;if(!pick)return;open=true;q='';note='';render();const p=$('#bk-tr');if(p&&p.scrollIntoView)p.scrollIntoView({behavior:'smooth',block:'start'});return}
  const a=b.dataset.a;
  if(a==='tr'){open=!open;pick=null;q='';note='';tab=top3().length?'freq':'all';render()}
  else if(a==='back'){pick=null;q='';render()}
  else if(a==='cancel'){open=false;pick=null;q='';render()}
  else if(a==='send')send();
  else if(a==='bz'){bzo=!bzo;render()}
  else if(a==='bzx'){bzo=false;bzStep='num';render()}
  else if(a==='bzno'){bzStep='info';render()}
  else if(a==='bznpd'){bzKind='npd';bzNum='';bzStep='form';render()}
  else if(a==='bzip'){bzKind='ip';bzNum='';bzStep='form';render()}
  else if(a==='bzooo'){bzKind='ooo';bzNum='';bzStep='form';render()}
  else if(a==='bzback'){bzStep='num';render()}
  else if(a==='bznext'){
    const v=($('#bz-num').value||'').replace(/\s/g,''),f=$('#bz-fb');
    if(!/^(\d{13}|\d{15})$/.test(v)){f.style.color='#f0b46a';f.textContent='Нужно 15 цифр (ИП) или 13 цифр (ООО)';return}
    bzNum=v;bzKind=v.length===15?'npd':'ooo';bzStep='form';render();
  }
  else if(a==='bzsend')bzApply();
  else if(a==='bzdep')bzMoney('biz_deposit');
  else if(a==='bzwd')bzMoney('biz_withdraw');
});
sec.addEventListener('input',e=>{if(e.target.id==='bk-q'){q=e.target.value;lst()}});

(window.RV=window.RV||{}).bank=()=>{render();load()};
})();

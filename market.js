(function () {
  function getSupabase() {
    return window.SB || window.supabaseClient || null;
  }

  window.Coins = {
    set: function (n) {
      document.querySelectorAll('.cn').forEach(e => e.textContent = n);
    },
    refresh: async function () {
      const sb = getSupabase(); if (!sb) return;
      const u = (await sb.auth.getUser()).data.user;
      if (!u) { this.set('0'); return; }
      const r = await sb.from('profiles').select('coins').eq('id', u.id).maybeSingle();
      this.set(r.data ? r.data.coins : 0);
    }
  };
  document.addEventListener('sb', () => {
    Coins.refresh();
    const sb = getSupabase();
    if (sb) sb.auth.onAuthStateChange(() => setTimeout(() => Coins.refresh(), 0));
  });
  document.addEventListener('coins', e => Coins.set(e.detail));
  setInterval(() => Coins.refresh(), 60000);

  function compress(file, kind, crop) {
    return new Promise((res, rej) => {
      const u = URL.createObjectURL(file), im = new Image();
      im.onload = () => {
        URL.revokeObjectURL(u);
        const c = document.createElement('canvas');
        if (kind === 'status') {            // строго 500x166
          c.width = 500; c.height = 166;
          c.getContext('2d').drawImage(im, 0, 0, 500, 166);
        } else {                            // баннер: кроп 750x230
          c.width = 750; c.height = 230;
          const k = crop.s, CH = Math.round(300 * 230 / 750), ry = (300 - CH) / 2;
          c.getContext('2d').drawImage(im, -crop.x / k, (ry - crop.y) / k, 300 / k, CH / k, 0, 0, 750, 230);
        }
        c.toBlob(b => b ? res(b) : rej(new Error('сжатие')), 'image/webp', 0.8);
      };
      im.onerror = () => rej(new Error('не картинка'));
      im.src = u;
    });
  }

  const KINDS = { status: 'Статусы', banner: 'Баннеры' };

  const esc = t => String(t == null ? '' : t).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const COIN_P = 'M466 548V1430M1478 548V1430M466 548L966 1428L1478 548M352 880H1582M340 1090H1592';
const COIN = `<i style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe27a,#f2a900);box-shadow:inset 0 0 0 1px rgba(160,100,0,.35);vertical-align:-6px"><svg viewBox="250 390 1440 1180" width="19" height="16" fill="none" stroke-width="140" stroke-linecap="round" stroke-linejoin="round"><path transform="translate(32 36)" d="${COIN_P}" stroke="#a86a00" stroke-opacity=".75"/><path transform="translate(-28 -32)" d="${COIN_P}" stroke="#fff4b8"/><path d="${COIN_P}" stroke="#f6b81f"/></svg></i>`;
const CART_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>';
const CART_KEY = 'mk_cart', CART_MAX = 50, PAGE = 16;
  const FILTER_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18l-7 8.2V19l-4 2v-8.8z"/></svg>';
  const SEARCH_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
const BECOME = `<div style="margin:0 0 8px;border-radius:24px;padding:26px 28px;background:linear-gradient(120deg,#00bcf2,#7b6cf6);color:#fff;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
  <div><div style="font-size:24px;font-weight:700">Стань креатором</div><div style="opacity:.92;margin-top:6px">Рисуй баннеры и статусы, продавай их и зарабатывай MilkyCoin</div></div>
  <button onclick="Market.becomeCreator()" style="padding:14px 26px;border:0;border-radius:14px;background:#fff;color:#0b5f8a;font-weight:700;cursor:pointer">Стать креатором за 30 ${COIN}</button></div>`;
const PLUS_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h2l2.2 10h9.6L18 7.5"/><circle cx="8.5" cy="19" r="1.4"/><circle cx="15.5" cy="19" r="1.4"/><path d="M16 1.5v5M13.5 4h5"/></svg>';
const SORTS = { pop: 'По популярности', new: 'Сначала новые', cheap: 'Сначала дешёвые', exp: 'Сначала дорогие' };
if (!document.getElementById('mk-css')) {
  const s = document.createElement('style'); s.id = 'mk-css';
  s.textContent = '.mk-g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}@media(max-width:900px){.mk-g4{grid-template-columns:repeat(2,1fr)}}';
  document.head.appendChild(s);
}
const GRID = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px';
const BACK = '<button onclick="Market.show(\'shop\')" aria-label="Назад" style="width:44px;height:44px;border:0;background:transparent;color:#00bcf2;cursor:pointer;display:grid;place-items:center;padding:0"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>';
const BACK_S = BACK.replace('width:44px;height:44px','flex:none;width:30px;height:44px').replace('width="28" height="28"','width="26" height="26"');
  const cart = {
  get() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } },
  set(a) { localStorage.setItem(CART_KEY, JSON.stringify(a)); Market.badge(); }
};
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
async function authors(items) {
  const sb = getSupabase(), ids = [...new Set(items.map(i => i.user_id))];
  if (!sb || !ids.length) return items;
  const r = await sb.from('profiles').select('id,name').in('id', ids);
  const M = Object.fromEntries((r.data || []).map(x => [x.id, x.name]));
  items.forEach(i => i._a = M[i.user_id] || '');
  return items;
}

  const mix = a => shuffle(a).map(i => [i, Math.random() + ((i.sold || 0) < 3 ? 0.6 : 0)]).sort((x, y) => y[1] - x[1]).map(x => x[0]);

  window.Market = {
    _me: null, _bought: new Set(), _lists: { status: [], banner: [], all: [] }, _coins: 0, _view: 'shop', _kind: 'status',
open: function () { this.renderUI(); this.show('shop'); this.badge(); this.loadCoins(); },

    show: function (p) {
  const map = { shop: 'pgShop', list: 'pgList', cart: 'pgCart', creator: 'creatorPanel', mod: 'modPanel' };
  Object.keys(map).forEach(k => { const e = document.getElementById(map[k]); if (e) e.style.display = k === p ? 'block' : 'none'; });
  const hd = document.getElementById('mkHead'); if (hd) hd.style.display = p === 'list' ? 'none' : 'flex';
  if (p !== this._view) { window.scrollTo(0, 0); const m = document.querySelector('.main'); if (m) m.scrollTop = 0; }
  this._view = p;
},
badge: function () {
  const n = cart.get().length;
  ['mkCartN', 'mkCartN2'].forEach(id => {
    const e = document.getElementById(id); if (!e) return;
    e.textContent = n; e.style.display = n ? 'block' : 'none';
  });
},

    hide: function () {
      const el = document.getElementById('v-market');
      if (el) el.style.display = 'none';
    },

    isMod: false,
    renderUI: function () {
      let c = document.getElementById('v-market');
      if (!c) {
        c = document.createElement('section'); c.id = 'v-market';
        (document.querySelector('.main') || document.body).appendChild(c);
      }
      c.hidden = false; c.style.display = 'block';
      c.innerHTML = `

      <div style="padding:24px;max-width:1100px;margin:0 auto;font-family:inherit;color:var(--text,#333)">
  <div id="mkHead" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:20px">
  <button id="mkSearchBtn" onclick="Market.openList('all')" style="display:inline-flex;gap:8px;align-items:center;height:42px;min-width:220px;padding:0 20px;border:1px solid #e6e9ef;border-radius:14px;background:#fff;color:#9aa1a9;font:inherit;font-weight:300;font-size:15px;letter-spacing:.2px;cursor:pointer">${SEARCH_SVG}Поиск...</button>
  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
    <div id="mkTools" style="display:flex;gap:10px;align-items:center">
      <button id="btnMod" style="display:none;padding:10px 18px;border:0;border-radius:12px;background:#ffb703;font-weight:700;cursor:pointer">Модерация</button>
      <button id="btnOpenCreator" style="display:none;padding:10px 18px;border:0;border-radius:12px;background:#00bcf2;color:#fff;font-weight:700;cursor:pointer">Кабинет креатора</button>
    </div>
    <div style="background:#fff;border-radius:14px;padding:10px 16px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.06)"><span id="mkCoins">…</span> ${COIN}</div>
    <button id="btnCart" aria-label="Корзина" style="position:relative;width:44px;height:44px;border:0;border-radius:14px;background:#fff;color:#0b5f8a;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.06)">${CART_SVG}<span id="mkCartN" style="display:none;position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#e63946;color:#fff;font-size:12px;font-weight:700;line-height:20px;padding:0 5px">0</span></button>
  </div>
</div>

  <div id="pgShop"></div>
  <div id="pgList" style="display:none"></div>
  <div id="pgCart" style="display:none"></div>

  <div id="creatorPanel" style="display:none">
    ${BACK}
    <div style="display:flex;justify-content:space-between;align-items:center;margin:16px 0 14px;flex-wrap:wrap;gap:10px">
      <h3 style="margin:0;font-size:28px;font-weight:400">Кабинет креатора</h3>
      <button id="btnAddItem" style="padding:10px 18px;border:1px solid #00bcf2;background:#fff;color:#00a5d6;border-radius:12px;cursor:pointer">+ Добавить товар</button>
    </div>
    <div id="myItems" style="${GRID}"></div>
  </div>

  <div id="modPanel" style="display:none">
    ${BACK}
    <h3 style="margin:16px 0 14px;font-size:28px;font-weight:400">Очередь модерации</h3>
    <div id="moderationQueue" style="${GRID}"></div>
    <h3 style="margin:28px 0 14px;font-size:28px;font-weight:400">Жалобы</h3>
<div id="reportsQueue" style="display:grid;gap:12px"></div>
  </div>
        <div id="creatorModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;justify-content:center;align-items:center">
          <div style="background:#fff;border-radius:20px;width:92%;max-width:560px;max-height:92vh;overflow:auto;padding:26px;position:relative">
            <button id="btnCloseCreator" style="position:absolute;right:16px;top:16px;border:0;background:#f0f0f0;width:32px;height:32px;border-radius:50%;cursor:pointer">✕</button>
            <h3 style="margin:0 0 16px">Загрузка товара</h3>
            <div style="display:flex;gap:10px">
              <input id="itTitle" placeholder="Название" maxlength="40" style="flex:1;padding:12px;border:1px solid #ddd;border-radius:10px">
              <input id="itPrice" type="number" min="1" max="1000" placeholder="Цена" style="width:90px;padding:12px;border:1px solid #ddd;border-radius:10px">
            </div>
            <select id="itKind" style="width:100%;margin-top:12px;padding:12px;border:1px solid #ddd;border-radius:10px;background:#fff">
              <option value="">Выберите тип…</option>
              <option value="status">Статусы</option>
              <option value="banner">Баннеры</option>
            </select>
            <div id="itHint" style="font-size:12px;color:#888;margin:8px 0"></div>
            <input type="file" id="itFile" accept="image/*" disabled style="width:100%;padding:10px;border:1px dashed #00bcf2;border-radius:10px">
            <canvas id="itCv" width="300" height="300" style="display:none;margin:12px auto 0;max-width:100%;border-radius:12px;touch-action:none;background:#eee"></canvas>
            <img id="itPrev" style="display:none;max-width:100%;margin:12px auto 0;border-radius:8px">
            <input type="range" id="itZoom" min="0" max="100" value="0" style="display:none;width:100%;margin-top:8px">
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
              <button id="itCancel" style="padding:10px 20px;border:0;border-radius:10px;background:#0b8bd0;color:#fff;cursor:pointer">Отмена</button>
              <button id="itSend" disabled style="padding:10px 20px;border:0;border-radius:10px;background:#00bcf2;color:#fff;cursor:pointer;opacity:.5">Добавить</button>
            </div>
          </div>
        </div>
      </div>`;
      this.bindEvents();
      this.checkMod();
    },

    checkMod: async function () {
      const sb = getSupabase(); if (!sb) return;
      const u = (await sb.auth.getUser()).data.user; if (!u) return;
      const r = await sb.from('moderators').select('user_id').eq('user_id', u.id).maybeSingle();
      this.isMod = !!r.data;
      if (this.isMod) document.getElementById('btnMod').style.display = 'block';
    },

    bindEvents: function () {
      const $ = id => document.getElementById(id), self = this;
      let crop = null, drag = null;
      const hints = { status: 'Нужна картинка 500×166 пикселей', banner: 'Любая картинка. Двигай её: в рамке то, что попадёт в баннер' };
      const VIEW = 300, CW = 300, CH = Math.round(300 * 230 / 750);

      $('btnOpenCreator').onclick = async () => {
  const sb = getSupabase(), u = sb && (await sb.auth.getUser()).data.user;
  if (!u) return alert('Сначала войди в аккаунт');
  self.show('creator'); self.loadMyItems();
};
$('btnMod').onclick = () => { self.show('mod'); self.loadModerationQueue(); self.loadReports(); };
$('btnCart').onclick = () => self.openCart();
      $('btnAddItem').onclick = () => { $('creatorModal').style.display = 'flex'; };
const close = () => { $('creatorModal').style.display = 'none'; reset(); };
$('btnCloseCreator').onclick = close; $('itCancel').onclick = close;

      function reset() {
        crop = null; $('itFile').value = ''; $('itFile').disabled = !$('itKind').value;
        ['itCv', 'itPrev', 'itZoom'].forEach(i => $(i).style.display = 'none');
        $('itSend').disabled = true; $('itSend').style.opacity = .5;
      }
      $('itKind').onchange = () => {
        reset(); const k = $('itKind').value;
        $('itHint').textContent = hints[k] || ''; $('itFile').disabled = !k;
      };

      function paint() {
        const cv = $('itCv'), x = cv.getContext('2d');
        x.clearRect(0, 0, VIEW, VIEW);
        x.drawImage(crop.img, crop.x, crop.y, crop.img.width * crop.s, crop.img.height * crop.s);
        const rx = (VIEW - CW) / 2, ry = (VIEW - CH) / 2;
        x.fillStyle = 'rgba(0,0,0,.6)'; x.beginPath(); x.rect(0, 0, VIEW, VIEW); x.rect(rx, ry, CW, CH); x.fill('evenodd');
        x.strokeStyle = '#fff'; x.lineWidth = 2; x.strokeRect(rx, ry, CW, CH);
      }
      function clamp() {
        const rx = (VIEW - CW) / 2, ry = (VIEW - CH) / 2, iw = crop.img.width * crop.s, ih = crop.img.height * crop.s;
        crop.x = Math.min(rx, Math.max(VIEW - rx - iw, crop.x));
        crop.y = Math.min(ry, Math.max(VIEW - ry - ih, crop.y));
      }

      $('itFile').onchange = e => {
        const f = e.target.files[0], k = $('itKind').value; if (!f) return;
        const u = URL.createObjectURL(f), img = new Image();
        img.onload = () => {
          if (k === 'status') {
            $('itPrev').src = u; $('itPrev').style.display = 'block';
            if (img.width !== 500 || img.height !== 166)
              $('itHint').textContent = `Размер ${img.width}×${img.height}, будет подогнан к 500×166`;
          } else {
            const min = Math.max(CW / img.width, CH / img.height);
            crop = { img, min, s: min, x: VIEW / 2 - img.width * min / 2, y: VIEW / 2 - img.height * min / 2 };
            clamp(); $('itCv').style.display = 'block'; $('itZoom').style.display = 'block'; $('itZoom').value = 0; paint();
          }
          $('itSend').disabled = false; $('itSend').style.opacity = 1;
        };
        img.src = u;
      };
      $('itZoom').oninput = e => {
        const ox = (VIEW / 2 - crop.x) / crop.s, oy = (VIEW / 2 - crop.y) / crop.s;
        crop.s = crop.min * (1 + 3 * e.target.value / 100);
        crop.x = VIEW / 2 - ox * crop.s; crop.y = VIEW / 2 - oy * crop.s; clamp(); paint();
      };
      const cv = $('itCv');
      cv.onpointerdown = e => { cv.setPointerCapture(e.pointerId); drag = { x: e.clientX, y: e.clientY }; };
      cv.onpointermove = e => {
        if (!drag || !crop) return;
        const k = VIEW / cv.getBoundingClientRect().width;
        crop.x += (e.clientX - drag.x) * k; crop.y += (e.clientY - drag.y) * k;
        drag = { x: e.clientX, y: e.clientY }; clamp(); paint();
      };
      cv.onpointerup = cv.onpointercancel = () => { drag = null; };

      $('itSend').onclick = async () => {
        const title = $('itTitle').value.trim(), price = +$('itPrice').value, kind = $('itKind').value, f = $('itFile').files[0];
        if (!title || !(price > 0) || !kind || !f) return alert('Заполни название, цену, тип и файл');
        const sb = getSupabase(), u = (await sb.auth.getUser()).data.user;
        if (!u) return alert('Войди в аккаунт');
        const btn = $('itSend'); btn.disabled = true; btn.textContent = 'Загрузка…';
        try {
          const blob = await compress(f, kind, crop);
          const path = u.id + '/' + Date.now() + '.webp';
          const up = await sb.storage.from('market').upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000' });
          if (up.error) throw up.error;
          const url = sb.storage.from('market').getPublicUrl(path).data.publicUrl;
          const ins = await sb.from('market_items').insert({ title, price, kind, image_url: url, status: 'pending' });
          if (ins.error) { sb.storage.from('market').remove([path]); throw ins.error; }
          alert('Отправлено на модерацию');
          $('itTitle').value = ''; $('itPrice').value = ''; close();
          self.loadMyItems(); 
        } catch (err) { alert('Ошибка: ' + err.message); }
        btn.textContent = 'Добавить'; btn.disabled = !$('itFile').files[0];
      };
      this.loadItems();
    },

    card: function (it, actions, badge, ov) {
  return `<div style="background:#fff;border-radius:22px;padding:14px;box-shadow:0 6px 24px rgba(0,0,0,.05);display:flex;flex-direction:column;gap:10px;overflow:hidden">
    <div style="position:relative;height:150px;background:#f4f6f8;border-radius:14px;display:grid;place-items:center;overflow:hidden;padding:6px">${ov || ''}
      <img src="${esc(it.image_url)}" loading="lazy" style="max-width:100%;max-height:100%;object-fit:contain;border-radius:8px">
    </div>
    <div style="min-width:0">
      <span style="font-size:11px;border:1px solid #00bcf2;color:#00a5d6;border-radius:12px;padding:2px 9px">${KINDS[it.kind] || 'Статусы'}</span>${badge || ''}
      <div style="font-size:16px;margin:6px 0 2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(it.title)}</div>
      <div style="font-size:12px;color:#8a94a3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(it._a || '')}</div>
      <div style="font-size:12px;color:#8a94a3;margin-bottom:6px">${it.sold ? 'Продано: ' + it.sold : 'Новинка'}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><b style="font-size:19px">${it.price || 10} ${COIN}</b>${actions}</div>
    </div></div>`;
},
act: function (i) {
  const dis = t => `<button disabled style="padding:10px 16px;border:0;border-radius:12px;background:#cfd5df;color:#fff;font-weight:700">${t}</button>`;
  if (this._me && i.user_id === this._me.id) return dis('Ваш товар');
  if (this._bought.has(i.id)) return dis('Куплено');
  return `<button onclick="Market.buy(${i.id})" style="padding:10px 16px;border:0;border-radius:12px;background:#00bcf2;color:#fff;font-weight:700;cursor:pointer">Купить</button>`;
},
    plus: function (i) {
  if ((this._me && i.user_id === this._me.id) || this._bought.has(i.id)) return '';
  const inC = cart.get().includes(i.id);
  return `<button onclick="Market.toCart(${i.id})" aria-label="В корзину" style="position:absolute;top:8px;right:8px;width:38px;height:38px;border:0;border-radius:50%;background:${inC ? '#2ec4b6' : 'rgba(255,255,255,.95)'};color:${inC ? '#fff' : '#00a5d6'};box-shadow:0 2px 8px rgba(0,0,0,.2);cursor:pointer;display:grid;place-items:center;z-index:2">${inC ? '✓' : PLUS_SVG}</button>`;
},
loadItems: async function () {
  const el = document.getElementById('pgShop'), sb = getSupabase(); if (!el || !sb) return;
  const me = (await sb.auth.getUser()).data.user;
  const r = await sb.from('market_items').select('*').eq('status', 'approved').order('id', { ascending: false }).limit(600);
  if (r.error) { el.innerHTML = '<p style="color:red">' + esc(r.error.message) + '</p>'; return; }
  this._me = me; this._bought = new Set();
  const cr = me ? await sb.from('profiles').select('is_creator').eq('id', me.id).maybeSingle() : null;
this._creator = !!(cr && cr.data && cr.data.is_creator);
  if (me) {
    const p = await sb.from('purchases').select('item_id').eq('buyer', me.id);
    this._bought = new Set((p.data || []).map(x => x.item_id));
  }
  const all = await authors(r.data || []);
  this._lists = { status: mix(all.filter(i => i.kind !== 'banner')), banner: mix(all.filter(i => i.kind === 'banner')), all: mix(all.slice()) };
  this.refresh();
},
renderShop: function () {
  const el = document.getElementById('pgShop'); if (!el) return;
  const sec = (kind, title, all) => `
    <div style="display:flex;justify-content:space-between;align-items:center;margin:28px 0 14px"><h3 style="font-size:28px;font-weight:400;margin:0">${title}</h3><button onclick="Market.loadItems()" style="padding:8px 14px;border:0;border-radius:12px;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.06);cursor:pointer">↻ Обновить</button></div>
    <div class="mk-g4">${this._lists[kind].slice(0, PAGE).map(i => this.card(i, this.act(i), '', this.plus(i))).join('') || '<p style="color:#888">Пока нет товаров</p>'}</div>
    <div style="text-align:center;margin-top:18px"><button onclick="Market.openList('${kind}')" style="padding:12px 40px;border:1px solid #00bcf2;background:#fff;color:#00a5d6;border-radius:14px;cursor:pointer;font-size:16px">${all}</button></div>`;
  const bc = document.getElementById('btnOpenCreator'); if (bc) bc.style.display = this._creator ? '' : 'none';
el.innerHTML = (this._creator ? '' : BECOME) + sec('status', 'Статусы', 'Все статусы') + sec('banner', 'Баннеры', 'Все баннеры');
},
openList: function (kind) {
  this._kind = kind; this._f = { q: '', min: '', max: '', hide: false, nw: false, sort: 'pop' };
  this.show('list');
  document.getElementById('pgList').innerHTML = `
<div style="display:flex;gap:10px;align-items:center;margin:4px 0 10px">
  ${BACK_S}
  <input oninput="Market.setQ(this.value)" placeholder="Поиск по названию или автору" style="flex:1;min-width:0;padding:13px 16px;border:1px solid #e1e6ee;border-radius:14px;background:#fff;font:inherit;outline:0">
  <button onclick="Market.openFilters()" aria-label="Фильтры" style="flex:none;width:48px;height:48px;border:1px solid #00bcf2;border-radius:14px;background:#fff;color:#00bcf2;cursor:pointer;display:grid;place-items:center">${FILTER_SVG}</button>
  <div style="position:relative;flex:none">
    <button onclick="Market.sortMenu()" style="height:48px;padding:0 18px;border:1px solid #00bcf2;border-radius:14px;background:#fff;color:#00a5d6;font:inherit;cursor:pointer;white-space:nowrap">Сортировка: <span id="mkSortT">${SORTS.pop}</span> ›</button>
    <div id="mkSortM" style="display:none;position:absolute;right:0;top:54px;z-index:50;background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.15);padding:6px;min-width:220px">
      ${Object.keys(SORTS).map(k => `<div onclick="Market.setSort('${k}')" style="padding:11px 14px;border-radius:10px;cursor:pointer">${SORTS[k]}</div>`).join('')}
    </div>
  </div>
  <button onclick="Market.openCart()" aria-label="Корзина" style="position:relative;flex:none;width:48px;height:48px;border:1px solid #00bcf2;border-radius:14px;background:#fff;color:#00bcf2;cursor:pointer;display:grid;place-items:center">${CART_SVG}<span id="mkCartN2" style="display:${cart.get().length ? 'block' : 'none'};position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#e63946;color:#fff;font-size:12px;font-weight:700;line-height:20px;padding:0 5px">${cart.get().length}</span></button>
</div>
<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><div style="background:#fff;border-radius:14px;padding:8px 14px;font-weight:700;box-shadow:0 4px 14px rgba(0,0,0,.06)"><span id="mkCoins2">${this._coins}</span> ${COIN}</div></div>
<div id="mkListGrid" class="mk-g4"></div>`;
  this.drawList();
  },
drawList: function () {
  const el = document.getElementById('mkListGrid'); if (!el) return;
  const f = this._f, q = f.q.trim().toLowerCase(), mn = +f.min || 0, mx = +f.max || Infinity;
  const a = this._lists[this._kind].filter(i => {
    const p = i.price || 10;
    return (!q || (i.title + ' ' + (i._a || '')).toLowerCase().includes(q)) && p >= mn && p <= mx
      && !(f.hide && this._bought.has(i.id)) && !(f.nw && i.sold);
  });
  const S = { pop: (x, y) => (y.sold || 0) - (x.sold || 0), new: (x, y) => y.id - x.id, cheap: (x, y) => (x.price || 10) - (y.price || 10), exp: (x, y) => (y.price || 10) - (x.price || 10) };
  a.sort(S[f.sort]);
  el.innerHTML = a.map(i => this.card(i, this.act(i), '', this.plus(i))).join('') || '<p style="color:#888;grid-column:1/-1">Ничего не найдено</p>';
},
setQ: function (v) { this._f.q = v; this.drawList(); },
sortMenu: function () { const m = document.getElementById('mkSortM'); m.style.display = m.style.display === 'block' ? 'none' : 'block'; },
setSort: function (k) {
  this._f.sort = k; document.getElementById('mkSortT').textContent = SORTS[k];
  document.getElementById('mkSortM').style.display = 'none'; this.drawList();
},
openFilters: function () {
  const f = this._f, o = document.createElement('div'); o.id = 'mkFlt';
  o.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;justify-content:center;align-items:center;padding:16px';
  const inp = 'flex:1;min-width:0;padding:12px;border:1px solid #ddd;border-radius:12px;font:inherit';
  const lab = 'display:flex;gap:10px;align-items:center;margin-top:16px;cursor:pointer';
  o.innerHTML = `<div style="background:#fff;border-radius:22px;width:100%;max-width:420px;padding:24px;position:relative">
    <button onclick="document.getElementById('mkFlt').remove()" aria-label="Закрыть" style="position:absolute;right:16px;top:16px;border:0;background:#f0f0f0;width:34px;height:34px;border-radius:50%;cursor:pointer">✕</button>
    <h3 style="margin:0 0 18px;font-size:22px">Фильтры</h3>
    <div style="color:#8a94a3;font-size:13px;margin-bottom:6px">Цена</div>
    <div style="display:flex;gap:10px"><input id="flMin" type="number" min="0" placeholder="от" value="${esc(f.min)}" style="${inp}"><input id="flMax" type="number" min="0" placeholder="до" value="${esc(f.max)}" style="${inp}"></div>
    <label style="${lab}"><input id="flHide" type="checkbox" ${f.hide ? 'checked' : ''}> Скрыть купленные</label>
    <label style="${lab}"><input id="flNew" type="checkbox" ${f.nw ? 'checked' : ''}> Только новинки (ещё не покупали)</label>
    <div style="display:flex;gap:10px;margin-top:24px">
      <button onclick="Market.resetFilters()" style="flex:1;padding:13px;border:1px solid #00bcf2;border-radius:14px;background:#fff;color:#00a5d6;font-weight:700;cursor:pointer">Сбросить</button>
      <button onclick="Market.applyFilters()" style="flex:1;padding:13px;border:0;border-radius:14px;background:#00bcf2;color:#fff;font-weight:700;cursor:pointer">Применить</button>
    </div></div>`;
  document.body.appendChild(o);
},
applyFilters: function () {
  const g = id => document.getElementById(id);
  Object.assign(this._f, { min: g('flMin').value, max: g('flMax').value, hide: g('flHide').checked, nw: g('flNew').checked });
  g('mkFlt').remove(); this.drawList();
},
resetFilters: function () {
  Object.assign(this._f, { min: '', max: '', hide: false, nw: false });
  document.getElementById('mkFlt').remove(); this.drawList();
},
refresh: function () {
  if (this._view === 'list') this.drawList();
  else if (this._view === 'cart') this.openCart();
  else this.renderShop();
  this.badge();
},
toCart: function (id) {
  if (!this._me) return alert('Сначала войди в аккаунт');
  let a = cart.get();
  if (a.includes(id)) a = a.filter(x => x !== id);
  else { if (a.length >= CART_MAX) return alert('В корзине максимум ' + CART_MAX + ' товаров'); a.push(id); }
  cart.set(a); this.refresh();
},
openCart: async function () {
  const sb = getSupabase(), el = document.getElementById('pgCart'); if (!sb || !el) return;
  this.show('cart'); el.innerHTML = '<p style="color:#888">Загрузка…</p>';
  const ids = cart.get(); let items = [];
  if (ids.length) {
    const r = await sb.from('market_items').select('*').in('id', ids).eq('status', 'approved');
    items = (r.data || []).filter(i => !this._bought.has(i.id) && !(this._me && i.user_id === this._me.id));
    await authors(items);
  }
  cart.set(items.map(i => i.id));
  const total = items.reduce((s, i) => s + (i.price || 0), 0), enough = total <= this._coins;
  el.innerHTML = `${BACK}<h3 style="font-size:28px;font-weight:400;margin:16px 0">Корзина <span style="font-size:16px;color:#8a94a3">${items.length}/${CART_MAX}</span></h3>` + (items.length ? `
    <div style="${GRID}">${items.map(i => this.card(i, `<button onclick="Market.toCart(${i.id})" style="padding:10px 16px;border:0;border-radius:12px;background:#e63946;color:#fff;font-weight:700;cursor:pointer">Убрать</button>`)).join('')}</div>
    <div style="margin-top:20px;background:#fff;border-radius:20px;padding:18px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;box-shadow:0 6px 24px rgba(0,0,0,.05)">
      <div><b style="font-size:22px">Итого: ${total} ${COIN}</b>${enough ? '' : '<div style="color:#e63946;font-size:13px;margin-top:4px">Не хватает монет (у вас ' + this._coins + ')</div>'}</div>
      <div style="display:flex;gap:10px"><button onclick="Market.clearCart()" style="padding:12px 20px;border:0;border-radius:12px;background:#ffe3e8;color:#d6407f;font-weight:700;cursor:pointer">Очистить</button><button onclick="Market.checkout()" ${enough ? '' : 'disabled'} style="padding:12px 24px;border:0;border-radius:12px;background:${enough ? '#00bcf2' : '#cfd5df'};color:#fff;font-weight:700;cursor:pointer">Оплатить всё</button></div>
    </div>` : '<p style="color:#888">Корзина пуста</p>');
},
clearCart: function () { if (confirm('Очистить корзину?')) { cart.set([]); this.openCart(); } },
pay: async function (ids) {
  const r = await getSupabase().rpc('buy_items', { p_items: ids });
  if (r.error) { alert(r.error.message); return false; }
  this.setCoins(r.data); ids.forEach(x => this._bought.add(x));
  cart.set(cart.get().filter(x => !ids.includes(x)));
  const sold = [...this._lists.status, ...this._lists.banner];
  sold.forEach(i => { if (ids.includes(i.id)) i.sold = (i.sold || 0) + 1; });
  return true;
},
buy: async function (id) {
  if (!this._me) return alert('Сначала войди в аккаунт');
  if (!confirm('Купить этот товар?')) return;
  if (await this.pay([id])) { alert('Куплено!'); this.refresh(); }
},
  becomeCreator: async function () {
  if (!this._me) return alert('Сначала войди в аккаунт');
    await this.loadCoins();
  if (this._coins < 30) return alert('Не хватает монет: нужно 30, у вас ' + this._coins);
  if (!confirm('Стать креатором? Спишется 30 MilkyCoin.')) return;
  const r = await getSupabase().rpc('become_creator');
  if (r.error) return alert(r.error.message);
  this.setCoins(r.data); this._creator = true; this.renderShop();
  alert('Теперь вы креатор! Кабинет сверху справа.');
},
    loadCoins: async function () {
  const sb = getSupabase(); if (!sb) return;
  const me = (await sb.auth.getUser()).data.user; if (!me) return;
  const r = await sb.from('profiles').select('coins').eq('id', me.id).maybeSingle();
  this.setCoins(r.data ? r.data.coins : 0);
},
setCoins: function (n) {
  this._coins = +n || 0;
  document.querySelectorAll('#mkCoins,#mkCoins2').forEach(e => e.textContent = n);
  document.dispatchEvent(new CustomEvent('coins', { detail: n }));
},
checkout: async function () {
  const ids = cart.get(); if (!ids.length) return;
  if (!confirm('Оплатить товаров: ' + ids.length + '?')) return;
  if (await this.pay(ids)) { alert('Куплено!'); this.openCart(); }
},
  
    loadMyItems: async function () {
      const el = document.getElementById('myItems'), sb = getSupabase(); if (!el || !sb) return;
      const u = (await sb.auth.getUser()).data.user;
      const r = await sb.from('market_items').select('*').eq('user_id', u.id).order('id', { ascending: false });
      await authors(r.data || []);
      const B = { approved: ['Продаётся', '#2e9e3e'], pending: ['На модерации', '#e6a100'] };
      el.innerHTML = (r.data || []).map(i => {
        const b = B[i.status] || B.pending;
        return this.card(i, `<button onclick="Market.removeItem(${i.id})" style="padding:10px 18px;border:0;border-radius:12px;background:#d62839;color:#fff;font-weight:700">Удалить</button>`,
          `<span style="font-size:11px;color:#fff;background:${b[1]};border-radius:10px;padding:2px 9px;margin-left:6px">${b[0]}</span>`);
      }).join('') || '<p style="color:#888;grid-column:1/-1">У вас пока нет товаров</p>';
    },
    loadModerationQueue: async function () {
      const el = document.getElementById('moderationQueue'), sb = getSupabase(); if (!el || !sb || !this.isMod) return;
      const r = await sb.from('market_items').select('*').eq('status', 'pending').order('id');
      el.innerHTML = (r.data || []).map(i => this.card(i,
        `<span style="display:flex;gap:6px"><button onclick="Market.approveItem(${i.id})" style="padding:8px 12px;border:0;border-radius:10px;background:#2ec4b6;color:#fff;font-weight:700">Одобрить</button><button onclick="Market.rejectItem(${i.id})" style="padding:8px 12px;border:0;border-radius:10px;background:#e63946;color:#fff;font-weight:700">Отклонить</button></span>`)
      ).join('') || '<p style="color:#888">Очередь пуста</p>';
    },
    loadReports: async function () {
      const el = document.getElementById('reportsQueue'), sb = getSupabase(); if (!el || !sb || !this.isMod) return;
      const r = await sb.from('reports').select('*').eq('resolved', false).order('id', { ascending: false }).limit(50);
      if (r.error) { el.innerHTML = '<p style="color:red">' + esc(r.error.message) + '</p>'; return; }
      const L = r.data || [], ids = k => L.filter(x => x.kind === k).map(x => x.target_id);
      const [ps, cs] = await Promise.all([
        ids('post').length ? sb.from('posts').select('id,body,image_url,user_id').in('id', ids('post')) : null,
        ids('comment').length ? sb.from('post_comments').select('id,body,user_id').in('id', ids('comment')) : null]);
      const T = { post: Object.fromEntries(((ps && ps.data) || []).map(x => [x.id, x])), comment: Object.fromEntries(((cs && cs.data) || []).map(x => [x.id, x])) };
      const us = [...new Set(L.map(x => (T[x.kind][x.target_id] || {}).user_id).filter(Boolean))];
      const nm = us.length ? Object.fromEntries(((await sb.from('profiles').select('id,name').in('id', us)).data || []).map(x => [x.id, x.name])) : {};
      el.innerHTML = L.map(x => {
        const t = T[x.kind][x.target_id];
        return `<div style="background:#fff;border-radius:18px;padding:16px;box-shadow:0 6px 24px rgba(0,0,0,.05)">
          <div style="font-size:12px;color:#8a94a3">${x.kind === 'post' ? 'Публикация' : 'Комментарий'} · ${esc(x.reason)}</div>
          ${t ? `<div style="font-weight:700;margin:6px 0 2px">${esc(nm[t.user_id] || 'Участник')}</div><div style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(t.body)}</div>${t.image_url ? `<img src="${esc(t.image_url)}" style="max-width:220px;border-radius:10px;margin-top:8px;display:block">` : ''}` : '<div style="color:#8a94a3;margin:6px 0">Уже удалено</div>'}
          <div style="display:flex;gap:8px;margin-top:12px">
            ${t ? `<button onclick="Market.reportDelete(${x.id},'${x.kind}',${x.target_id})" style="padding:9px 16px;border:0;border-radius:10px;background:#e63946;color:#fff;font-weight:700;cursor:pointer">Удалить</button>` : ''}
            <button onclick="Market.reportClose(${x.id})" style="padding:9px 16px;border:0;border-radius:10px;background:#eef1f6;font-weight:700;cursor:pointer">${t ? 'Отклонить' : 'Закрыть'}</button>
          </div></div>`;
      }).join('') || '<p style="color:#888">Жалоб нет</p>';
    },
    reportClose: async function (id) {
      const r = await getSupabase().from('reports').update({ resolved: true }).eq('id', id);
      if (r.error) return alert(r.error.message);
      this.loadReports();
    },
    reportDelete: async function (rid, kind, tid) {
      if (!confirm('Удалить ' + (kind === 'post' ? 'публикацию' : 'комментарий') + '?')) return;
      const sb = getSupabase();
      const r = await sb.from(kind === 'post' ? 'posts' : 'post_comments').delete().eq('id', tid).select();
      if (r.error || !(r.data || []).length) return alert('Не удалось удалить: ' + (r.error ? r.error.message : 'нет прав, проверь SQL из шага 0'));
      await sb.from('reports').update({ resolved: true }).eq('target_id', tid).eq('kind', kind);
      this.loadReports();
    },
    approveItem: async function (id) {
      const r = await getSupabase().from('market_items').update({ status: 'approved' }).eq('id', id);
      if (r.error) return alert(r.error.message);
      this.loadModerationQueue(); this.loadItems();
    },
    rejectItem: async function (id) { await this.removeItem(id, true); },
    removeItem: async function (id, fromMod) {
      if (!fromMod && !confirm('Удалить товар?')) return;
      const sb = getSupabase(), it = (await sb.from('market_items').select('image_url').eq('id', id).maybeSingle()).data;
      const r = await sb.from('market_items').delete().eq('id', id);
      if (r.error) return alert(r.error.message);
      const p = it && it.image_url && it.image_url.split('/market/')[1];
      if (p) sb.storage.from('market').remove([decodeURIComponent(p.split('?')[0])]);
      this.loadMyItems(); this.loadModerationQueue(); this.loadItems();
    }
  };
})();

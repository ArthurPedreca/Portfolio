// Renders the live status panel from the same data file my GitHub profile uses.
// The page ships with a snapshot so it works offline; the live file replaces it when it loads.
(() => {
  const LIVE = 'https://raw.githubusercontent.com/ArthurPedreca/ArthurPedreca/main/data/status.json';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => Number(n).toLocaleString('en-US');
  const day = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

  function render(data) {
    if (!data || !Array.isArray(data.days) || data.days.length < 30) return;
    const days = data.days.slice(-90);
    const active = days.filter((d) => d.count > 0).length;
    const sum = days.reduce((s, d) => s + d.count, 0);
    const nz = days.map((d) => d.count).filter(Boolean).sort((a, b) => a - b);
    const q = (p) => nz[Math.min(nz.length - 1, Math.floor(p * nz.length))] || 1;
    const cuts = [q(0.25), q(0.5), q(0.75)];
    const level = (c) => (c === 0 ? 0 : c <= cuts[0] ? 1 : c <= cuts[1] ? 2 : c <= cuts[2] ? 3 : 4);

    const bars = $('#bars');
    const key = days.map((d) => d.date + ':' + d.count).join();
    if (bars && bars.dataset.key !== key) {
      bars.dataset.key = key;
      bars.innerHTML = days.map((d, i) =>
        `<i data-l="${level(d.count)}" data-d="${d.date}" data-c="${d.count}" style="animation-delay:${i * 7}ms" aria-hidden="true"></i>`).join('') +
        '<span class="tip" id="tip"></span>';
      bars.setAttribute('aria-label', `${active} of the last ${days.length} days had commits, ${sum} contributions in total.`);
      wireTips(bars);
    }
    set('[data-k="active"]', `${active} of ${days.length}`);
    set('[data-k="sum90"]', fmt(sum));
    set('[data-k="from"]', day(days[0].date));
    set('[data-k="total"]', fmt(data.totalLastYear));
    if (data.updated) {
      const t = new Date(data.updated);
      set('[data-k="updated"]', 'updated ' + t.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }));
    }
    const busy = data.available === false;
    document.documentElement.classList.toggle('busy', busy);
    if (data.note) $$('[data-k="note"]').forEach((el) => (el.textContent = data.note));
    set('[data-k="banner"]', busy ? 'Partial capacity' : 'All systems operational');
  }

  function set(sel, text) { $$(sel).forEach((el) => (el.textContent = text)); }

  function wireTips(bars) {
    const tip = $('#tip', bars);
    let cur;
    const show = (el) => {
      if (cur) cur.classList.remove('on');
      cur = el;
      el.classList.add('on');
      const c = Number(el.dataset.c);
      tip.textContent = `${day(el.dataset.d)} · ${c ? fmt(c) : 'no'} contribution${c === 1 ? '' : 's'}`;
      const b = bars.getBoundingClientRect(), r = el.getBoundingClientRect();
      const x = r.left - b.left + r.width / 2;
      const half = tip.offsetWidth / 2;
      tip.style.left = Math.max(half, Math.min(b.width - half, x)) + 'px';
      tip.classList.add('on');
    };
    const hide = () => { if (cur) cur.classList.remove('on'); cur = null; tip.classList.remove('on'); };
    bars.addEventListener('pointermove', (e) => {
      const el = e.target.closest('i');
      if (el && el !== cur) show(el);
    });
    bars.addEventListener('pointerleave', hide);
  }

  function clock() {
    const el = $('[data-k="clock"]');
    if (!el) return;
    const tick = () => {
      el.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
    };
    tick();
    setInterval(tick, 20000);
  }

  try { render(JSON.parse($('#snapshot').textContent)); } catch (e) { /* keep server-rendered fallback */ }
  clock();
  fetch(LIVE, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).then(render).catch(() => {});
})();

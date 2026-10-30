// Arthur Pedreca — page script. Everything here enhances content that is already on the page.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const UPWORK = 'https://www.upwork.com/freelancers/~01f52910ffb0d32b70';
  const LIVE = 'https://raw.githubusercontent.com/ArthurPedreca/ArthurPedreca/main/data/status.json';

  // ---- reveal once on entering the viewport ----
  // A shutter is clipped to nothing until it opens, so watch its parent instead of itself.
  const targets = $$('[data-reveal]');
  const watched = new Map();
  for (const el of targets) {
    const key = el.classList.contains('shutter') ? el.parentElement : el;
    if (!watched.has(key)) watched.set(key, []);
    watched.get(key).push(el);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { watched.get(e.target).forEach((el) => el.classList.add('is-in')); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    watched.forEach((_, key) => io.observe(key));
    addEventListener('load', () => setTimeout(() => targets.forEach((el) => {
      const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
    }), 2500));
  } else targets.forEach((el) => el.classList.add('is-in'));

  // ---- signature: the large print crossfades between the things I run ----
  const frames = $$('#frames img');
  if (frames.length > 1 && !reduce) {
    let i = 0, timer;
    const next = () => { frames[i].classList.remove('on'); i = (i + 1) % frames.length; frames[i].classList.add('on'); };
    const start = () => { stop(); timer = setInterval(next, 5600); };
    const stop = () => clearInterval(timer);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    start();
  }

  // ---- the live thing: edit the policy, watch the lit data go dark ----
  const rule = $('#rule'), split = $('#readable'), verdict = $('#verdict');
  const FIX = 'business_id in (select my_businesses())';
  const texts = {
    open: 'A 60,000-line booking platform built with Lovable had this rule on four tables. <strong>Anyone holding the app’s public key could read every row.</strong>',
    fixed: 'That’s the fix I shipped: each business reads only its own rows. <strong>Clients, appointments, payments, intake forms and every stored file were closed before a single real user signed up.</strong> <a class="link" href="history/open-database.html">Read the postmortem</a>',
    shut: 'Closed, but now nobody can read the table, the owner included. The real fix scopes every row to its business.',
    unknown: 'This demo only knows <code>true</code>, <code>false</code> and the rule I shipped. Try “Apply the fix”.',
  };
  function judge(v) {
    const t = v.replace(/\s+/g, ' ').trim().toLowerCase();
    if (t === 'true' || t === '1=1' || t === '1 = 1') return 'open';
    if (t === 'false') return 'shut';
    if (/my_businesses\(\)|auth\.uid\(\)/.test(t)) return 'fixed';
    return 'unknown';
  }
  function apply() {
    const state = judge(rule.textContent);
    const closed = state !== 'open' && state !== 'unknown';
    split.classList.toggle('closed', closed);
    $('#rows').hidden = closed;
    $('#none').hidden = !closed;
    $$('[data-k="rows"]').forEach((el) => (el.textContent = closed ? '0 rows' : '4 rows'));
    const who = state === 'fixed' ? 'its owner' : state === 'shut' ? 'nobody' : 'anyone';
    $$('[data-k="who"], [data-k="who-sr"]').forEach((el) => (el.textContent = who));
    verdict.innerHTML = texts[state];
    $('#fix').hidden = state === 'fixed';
    $('#undo').hidden = state === 'open';
  }
  if (rule) {
    rule.addEventListener('input', apply);
    rule.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); rule.blur(); } });
    rule.addEventListener('paste', (e) => { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData.getData('text') || '').replace(/\s+/g, ' ')); });
    $('#fix').addEventListener('click', () => { rule.textContent = FIX; apply(); });
    $('#undo').addEventListener('click', () => { rule.textContent = 'true'; apply(); rule.focus(); });
  }

  // ---- GitHub calendar, from the same data the profile README uses ----
  const fmt = (n) => Number(n).toLocaleString('en-US');
  function calendar(data) {
    if (!data || !Array.isArray(data.days) || data.days.length < 60) return;
    const days = data.days.slice(-91);
    const nz = days.map((d) => d.count).filter(Boolean).sort((a, b) => a - b);
    const q = (p) => nz[Math.min(nz.length - 1, Math.floor(p * nz.length))] || 1;
    const cuts = [q(0.25), q(0.5), q(0.75)];
    const level = (c) => (c === 0 ? 0 : c <= cuts[0] ? 1 : c <= cuts[1] ? 2 : c <= cuts[2] ? 3 : 4);
    const first = new Date(days[0].date + 'T12:00:00Z').getUTCDay();
    const cells = Array(first).fill('<i style="visibility:hidden"></i>');
    for (const d of days) cells.push(`<i data-l="${level(d.count)}" title="${d.date}: ${d.count}"></i>`);
    const grid = $('#gh-grid'); if (grid) grid.innerHTML = cells.join('');
    const last90 = data.days.slice(-90);
    const sum = last90.reduce((s, d) => s + d.count, 0), active = last90.filter((d) => d.count).length;
    $$('[data-k="sum90"]').forEach((el) => (el.textContent = fmt(sum)));
    $$('[data-k="active"]').forEach((el) => (el.textContent = active));
    const m = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
    $$('[data-k="range"]').forEach((el) => (el.textContent = `${m(last90[0].date)} – ${m(last90.at(-1).date)} ${last90.at(-1).date.slice(0, 4)}`));
    const gh = $('#gh'); if (gh) gh.setAttribute('aria-label', `GitHub contribution calendar: ${sum} contributions, ${active} of the last 90 days active`);
    const booked = $('[data-k="booked"]');
    if (booked) { booked.hidden = data.available !== false; if (data.available === false) booked.textContent = data.note || 'Fully booked for now.'; }
  }
  try { calendar(JSON.parse($('#snapshot').textContent)); } catch (e) { /* fallback stays */ }
  fetch(LIVE, { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : null)).then(calendar).catch(() => {});

  // ---- the name at the foot, fitted to the width by measurement ----
  const foot = $('.foot-name');
  const fit = () => {
    if (!foot) return;
    foot.style.fontSize = '100px';
    const w = foot.scrollWidth, room = foot.parentElement.clientWidth - parseFloat(getComputedStyle(foot.parentElement).paddingLeft) * 2;
    foot.style.fontSize = Math.floor((100 * room) / w * 0.995) + 'px';
  };
  if (document.fonts) document.fonts.ready.then(fit); else fit();
  addEventListener('resize', fit);

  // ---- one field: copy a message and open Upwork ----
  const form = $('#send'), link = $('#link'), help = $('#send-help');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = link.value.trim();
    const msg = `Hi Arthur, my app is ${url || '[link]'}. What’s wrong: `;
    let copied = false;
    try { await navigator.clipboard.writeText(msg); copied = true; } catch (err) { /* clipboard blocked */ }
    help.textContent = copied ? 'Message copied. Paste it into a message on my Upwork profile.' : `Copy this into a message on Upwork: ${msg}`;
    window.open(UPWORK, '_blank', 'noopener');
  });
})();

// Kelimearası arayüz katmanı: XP bildirimi, seviye atlama, başarımlar,
// konfeti ve oyun sayfaları için ortak üst bar. user-system.js tarafından yüklenir.
(function () {
    'use strict';
    if (window.__kaUi) return; window.__kaUi = true;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isGamePage = /\/oyunlar\//.test(location.pathname);

    // ---------------------------------------------------------------- ikonlar
    const I = {
        back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
        help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>',
        bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
        trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
        flame: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z"/></svg>',
    };

    // ---------------------------------------------------------------- stiller
    const css = `
    .ka-toast-wrap{position:fixed;left:50%;top:max(14px,env(safe-area-inset-top));transform:translateX(-50%);z-index:2147483000;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:none;width:min(92vw,380px);font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif}
    @media (min-width:900px){.ka-toast-wrap{left:auto;right:20px;transform:none;top:76px}}
    .ka-card{pointer-events:auto;width:100%;color:#fff;background:linear-gradient(160deg,rgba(30,27,62,.96),rgba(18,18,43,.96));border:1px solid rgba(167,139,250,.25);border-radius:20px;padding:16px 18px;box-shadow:0 24px 60px -12px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.03) inset;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);transform:translateY(-24px) scale(.96);opacity:0;transition:transform .55s cubic-bezier(.16,1,.3,1),opacity .4s ease;cursor:pointer}
    .ka-card.show{transform:none;opacity:1}
    .ka-card.hide{transform:translateY(-16px) scale(.97);opacity:0}
    .ka-row{display:flex;align-items:center;gap:12px}
    .ka-xp-icon{flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#8b5cf6,#ec4899);box-shadow:0 8px 24px -6px rgba(168,85,247,.8)}
    .ka-xp-icon svg{width:22px;height:22px;color:#fff}
    .ka-xp-icon.loss{background:linear-gradient(135deg,#475569,#334155);box-shadow:none}
    .ka-title{font-size:12px;font-weight:600;color:rgba(255,255,255,.55);letter-spacing:.02em}
    .ka-big{font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.1;background:linear-gradient(90deg,#fde68a,#f9a8d4,#c4b5fd);-webkit-background-clip:text;background-clip:text;color:transparent}
    .ka-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
    .ka-chip{font-size:11px;font-weight:700;padding:4px 9px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.8)}
    .ka-chip b{color:#c4b5fd;margin-left:4px}
    .ka-bar-head{display:flex;justify-content:space-between;font-size:11px;font-weight:700;color:rgba(255,255,255,.55);margin:14px 0 6px}
    .ka-bar-head .lv{color:#c4b5fd}
    .ka-bar{height:8px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}
    .ka-bar>i{display:block;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#6366f1,#a855f7,#ec4899);box-shadow:0 0 12px rgba(168,85,247,.8);transition:width 1.1s cubic-bezier(.16,1,.3,1)}
    .ka-lvup{position:fixed;inset:0;z-index:2147482999;display:grid;place-items:center;pointer-events:none;font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif}
    .ka-lvup-inner{position:relative;text-align:center;transform:scale(.6);opacity:0;transition:transform .7s cubic-bezier(.16,1,.3,1),opacity .4s}
    .ka-lvup.show .ka-lvup-inner{transform:none;opacity:1}
    .ka-lvup.hide .ka-lvup-inner{transform:scale(1.15);opacity:0}
    .ka-lvup-badge{width:132px;height:132px;margin:0 auto 14px;border-radius:36px;display:grid;place-items:center;font-size:56px;font-weight:800;color:#fff;background:linear-gradient(135deg,#7c3aed,#ec4899);box-shadow:0 0 0 8px rgba(168,85,247,.15),0 30px 80px -10px rgba(168,85,247,.9);animation:ka-pulse 1.6s ease-in-out infinite}
    .ka-lvup-t{font-size:34px;font-weight:800;color:#fff;letter-spacing:-.03em;text-shadow:0 4px 30px rgba(0,0,0,.6)}
    .ka-lvup-s{font-size:14px;font-weight:600;color:#ddd6fe;margin-top:4px;text-shadow:0 2px 12px rgba(0,0,0,.6)}
    .ka-lvup::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at center,rgba(12,12,29,.82),rgba(12,12,29,.95));opacity:0;transition:opacity .4s}
    .ka-lvup.show::before{opacity:1}
    @keyframes ka-pulse{50%{transform:scale(1.05)}}
    .ka-ach{display:flex;align-items:center;gap:12px}
    .ka-ach-i{flex:none;width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#f59e0b,#ef4444);box-shadow:0 8px 20px -6px rgba(245,158,11,.8)}
    .ka-ach-i svg{width:20px;height:20px;color:#fff}
    .ka-confetti{position:fixed;inset:0;pointer-events:none;z-index:2147483001}

    /* ---------- Oyun sayfası üst barı ---------- */
    .ka-nav-btn{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 12px 0 8px;border-radius:12px;font-size:13px;font-weight:700;font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif;color:rgba(255,255,255,.85);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);transition:background .2s,transform .2s;text-decoration:none;filter:none!important;text-shadow:none!important}
    .ka-nav-btn:hover{background:rgba(255,255,255,.1);transform:translateY(-1px)}
    .ka-nav-btn svg{width:18px;height:18px}
    .ka-icon-btn{width:38px;padding:0;justify-content:center}
    .ka-right{display:flex;align-items:center;gap:8px}
    .ka-xp-pill{display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 12px 0 6px;border-radius:12px;background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.25);color:#ddd6fe;font:700 12px 'Plus Jakarta Sans',Inter,system-ui,sans-serif;text-decoration:none;transition:background .2s}
    .ka-xp-pill:hover{background:rgba(139,92,246,.2)}
    .ka-ring{width:28px;height:28px;position:relative;display:grid;place-items:center;font-size:10px;font-weight:800;color:#fff}
    .ka-ring svg{position:absolute;inset:0;transform:rotate(-90deg)}
    .ka-ring circle{fill:none;stroke-width:3}
    .ka-ring .bg{stroke:rgba(255,255,255,.1)}
    .ka-ring .fg{stroke:url(#ka-grad);stroke-linecap:round;transition:stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)}
    .ka-xp-pill .ka-streak{display:inline-flex;align-items:center;gap:2px;color:#fdba74}
    .ka-xp-pill .ka-streak svg{width:12px;height:12px}
    @media (max-width:520px){.ka-nav-btn .lbl{display:none}.ka-nav-btn{padding:0;width:38px;justify-content:center}.ka-xp-pill .ka-xp-txt{display:none}.ka-xp-pill{padding:0 8px 0 5px}}
    body.ka-game header[data-ka]>:nth-child(2){position:absolute;left:50%;transform:translateX(-50%);max-width:calc(100% - 230px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    @media (max-width:520px){body.ka-game header[data-ka]>:nth-child(2){max-width:calc(100% - 176px)}body.ka-game header[data-ka] h1{font-size:clamp(13px,4.4vw,20px)!important;letter-spacing:.06em!important}}
    body.ka-game .mode-btn.active{color:#fff!important}
    body.ka-game{font-family:'Plus Jakarta Sans',Inter,system-ui,sans-serif}
    html.dark body.ka-game{background-image:radial-gradient(60% 40% at 50% -10%,rgba(139,92,246,.14),transparent 70%),radial-gradient(40% 30% at 100% 100%,rgba(236,72,153,.06),transparent 70%);background-attachment:fixed}
    @media (prefers-reduced-motion:reduce){.ka-card,.ka-lvup-inner,.ka-bar>i{transition:none!important}.ka-lvup-badge{animation:none}}
    `;

    function injectStyles() {
        if (document.getElementById('ka-ui-css')) return;
        const st = document.createElement('style'); st.id = 'ka-ui-css'; st.textContent = css;
        document.head.appendChild(st);
        if (!document.querySelector('link[href*="Plus+Jakarta+Sans"]')) {
            const l = document.createElement('link'); l.rel = 'stylesheet';
            l.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
            document.head.appendChild(l);
        }
    }

    // ---------------------------------------------------------------- konfeti
    function confetti(opts) {
        if (reduce) return;
        opts = opts || {};
        const cv = document.createElement('canvas'); cv.className = 'ka-confetti';
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
        document.body.appendChild(cv);
        const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
        const colors = ['#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#ffffff'];
        const N = opts.count || 140, ps = [];
        const ox = (opts.x != null ? opts.x : 0.5) * innerWidth, oy = (opts.y != null ? opts.y : 0.35) * innerHeight;
        for (let i = 0; i < N; i++) {
            const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9;
            ps.push({ x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6, w: 5 + Math.random() * 6, h: 8 + Math.random() * 8,
                r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[i % colors.length], life: 0 });
        }
        let t0 = performance.now();
        (function tick(t) {
            const dt = Math.min(32, t - t0) / 16; t0 = t;
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            let alive = 0;
            for (const p of ps) {
                p.life += dt; p.vy += .28 * dt; p.vx *= .985; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
                const o = Math.max(0, 1 - p.life / 150); if (o <= 0 || p.y > innerHeight + 40) continue; alive++;
                ctx.save(); ctx.globalAlpha = o; ctx.translate(p.x, p.y); ctx.rotate(p.r);
                ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2 * Math.abs(Math.cos(p.life / 6)), p.w, p.h * Math.abs(Math.cos(p.life / 6)) + 1);
                ctx.restore();
            }
            if (alive) requestAnimationFrame(tick); else cv.remove();
        })(t0);
    }

    // ---------------------------------------------------------------- toast
    let wrap;
    function getWrap() {
        if (!wrap || !document.body.contains(wrap)) { wrap = document.createElement('div'); wrap.className = 'ka-toast-wrap'; document.body.appendChild(wrap); }
        return wrap;
    }
    function showCard(html, ms) {
        const c = document.createElement('div'); c.className = 'ka-card'; c.innerHTML = html;
        getWrap().appendChild(c);
        requestAnimationFrame(() => requestAnimationFrame(() => c.classList.add('show')));
        const close = () => { c.classList.add('hide'); setTimeout(() => c.remove(), 500); };
        c.addEventListener('click', close);
        setTimeout(close, ms || 5000);
        return c;
    }

    function countUp(el, to, ms) {
        if (reduce) { el.textContent = '+' + to + ' XP'; return; }
        const t0 = performance.now();
        (function f(t) { const p = Math.min(1, (t - t0) / ms); el.textContent = '+' + Math.round(to * (1 - Math.pow(1 - p, 3))) + ' XP'; if (p < 1) requestAnimationFrame(f); })(t0);
    }

    function onResult(r) {
        const pct = (lv) => Math.min(100, lv.xpInCurrentLevel / lv.xpRequiredForNext * 100);
        const chips = r.breakdown.map(b => `<span class="ka-chip">${b.label}<b>+${b.value}</b></span>`).join('');
        const card = showCard(`
            <div class="ka-row">
                <div class="ka-xp-icon ${r.isWin ? '' : 'loss'}">${I.bolt}</div>
                <div style="flex:1;min-width:0">
                    <div class="ka-title">${r.gameName} · ${r.isWin ? 'Kazandın!' : 'Bir dahakine!'}</div>
                    <div class="ka-big">+0 XP</div>
                </div>
            </div>
            <div class="ka-chips">${chips}</div>
            <div class="ka-bar-head"><span class="lv">Seviye ${r.before.level}</span><span class="nx">${r.before.xpInCurrentLevel} / ${r.before.xpRequiredForNext}</span></div>
            <div class="ka-bar"><i style="width:${pct(r.before)}%"></i></div>
        `, 6500);
        countUp(card.querySelector('.ka-big'), r.xpGained, 900);
        const bar = card.querySelector('.ka-bar>i'), nx = card.querySelector('.nx'), lvEl = card.querySelector('.lv');
        setTimeout(() => {
            if (r.leveledUp) {
                bar.style.width = '100%';
                setTimeout(() => {
                    bar.style.transition = 'none'; bar.style.width = '0%';
                    lvEl.textContent = 'Seviye ' + r.after.level;
                    requestAnimationFrame(() => { bar.style.transition = ''; bar.style.width = pct(r.after) + '%'; });
                    nx.textContent = `${r.after.xpInCurrentLevel} / ${r.after.xpRequiredForNext}`;
                    levelUp(r);
                }, 1150);
            } else {
                bar.style.width = pct(r.after) + '%';
                nx.textContent = `${r.after.xpInCurrentLevel} / ${r.after.xpRequiredForNext}`;
            }
        }, 450);
        if (r.isWin && !r.leveledUp) setTimeout(() => confetti({ count: 70, y: 0.12 }), 300);

        (r.achievements || []).forEach((a, i) => setTimeout(() => {
            showCard(`<div class="ka-ach"><div class="ka-ach-i">${I.trophy}</div><div><div class="ka-title">Başarım açıldı!</div><div style="font-weight:800;font-size:16px">${a.name}</div></div></div>`, 5000);
        }, 1600 + i * 900));

        updatePill();
    }

    function levelUp(r) {
        const el = document.createElement('div'); el.className = 'ka-lvup';
        el.innerHTML = `<div class="ka-lvup-inner"><div class="ka-lvup-badge">${r.after.level}</div><div class="ka-lvup-t">Seviye atladın!</div><div class="ka-lvup-s">${window.KaUser && window.KaUser.titleFor(r.before.level) !== r.title ? 'Yeni unvan: <b>' + r.title + '</b>' : 'Seviye ' + r.after.level + ' · ' + r.title}</div></div>`;
        document.body.appendChild(el);
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
        confetti({ count: 200, y: 0.45 });
        el.addEventListener('click', () => {}); setTimeout(() => { el.classList.add('hide'); el.classList.remove('show'); setTimeout(() => el.remove(), 600); }, 2800);
    }

    window.addEventListener('ka:result', e => {
        const r = e.detail; if (!r) return;
        setTimeout(() => onResult(r), 700);
    });

    // ---------------------------------------------------------------- oyun sayfası üst barı
    let pill;
    function updatePill() {
        if (!pill || !window.KaUser) return;
        const s = window.KaUser.getFormattedStats();
        const p = Math.min(1, s.xpInCurrentLevel / s.xpRequiredForNext), C = 2 * Math.PI * 12;
        pill.querySelector('.ka-ring span').textContent = s.level;
        pill.querySelector('.fg').style.strokeDashoffset = C * (1 - p);
        pill.querySelector('.ka-xp-txt').textContent = `${s.xpInCurrentLevel}/${s.xpRequiredForNext}`;
        const st = pill.querySelector('.ka-streak');
        st.style.display = s.currentStreak > 0 ? '' : 'none';
        st.lastChild.textContent = s.currentStreak;
    }

    function enhanceGameHeader() {
        const header = document.querySelector('body > header, header');
        if (!header || header.dataset.ka) return;
        header.dataset.ka = '1';
        document.body.classList.add('ka-game');

        const home = header.querySelector('a[href*="index.html"]');
        if (home) {
            home.className = 'ka-nav-btn';
            home.innerHTML = `${I.back}<span class="lbl">Oyunlar</span>`;
            home.setAttribute('aria-label', 'Ana sayfaya dön');
        }
        const kids = [...header.children];
        const help = kids[kids.length - 1];
        if (help && help !== home && /❓|\?/.test(help.textContent.trim()) && help.textContent.trim().length <= 3) {
            help.className = 'ka-nav-btn ka-icon-btn';
            help.innerHTML = I.help;
            help.setAttribute('aria-label', 'Nasıl oynanır');
        }
        if (window.KaUser && help) {
            const C = 2 * Math.PI * 12;
            pill = document.createElement('a');
            pill.href = '../index.html#profil'; pill.className = 'ka-xp-pill'; pill.title = 'Profil ve seviye';
            pill.innerHTML = `<span class="ka-ring"><svg viewBox="0 0 28 28"><defs><linearGradient id="ka-grad" x1="0" x2="1"><stop offset="0" stop-color="#818cf8"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><circle class="bg" cx="14" cy="14" r="12"/><circle class="fg" cx="14" cy="14" r="12" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><span>1</span></span><span class="ka-xp-txt">0/1000</span><span class="ka-streak">${I.flame}<span>0</span></span>`;
            const right = document.createElement('div'); right.className = 'ka-right';
            help.parentNode.insertBefore(right, help);
            right.appendChild(pill); right.appendChild(help);
            updatePill();
        }
    }


    // ---------------------------------------------------------------- ?mode= desteği
    // Ana sayfadaki "Sınırsız" butonu ?mode=unlimited ile gelir; parametreyi okumayan
    // oyunlarda ilgili mod butonuna otomatik basılır. Mod değişince adres güncellenir.
    const SELF_HANDLED = ['parolla', 'queens', 'spelling_bee', 'sudoku', 'wordle', 'pips'];
    const UNL_SEL = '[data-mode="unlimited"], #mode-unlimited, #modeUnlimitedBtn, #modeUnlimited, #btn-unlimited, #unlimitedBtn';
    const DAY_SEL = '[data-mode="daily"], #mode-daily, #modeDailyBtn, #modeDaily, #btn-daily, #dailyBtn';
    function gameId() { const m = location.pathname.match(/oyunlar\/([^/.]+)\.html/); return m ? m[1] : ''; }
    function applyModeParam() {
        const mode = new URLSearchParams(location.search).get('mode');
        if (mode !== 'unlimited' || SELF_HANDLED.includes(gameId())) return;
        const btn = [...document.querySelectorAll(UNL_SEL)].find(b => b.offsetParent !== null && !b.closest('[id*="odal"], .modal, [role="dialog"]'));
        if (btn) btn.click();
    }
    function syncModeToUrl(e) {
        const b = e.target.closest && e.target.closest(UNL_SEL + ',' + DAY_SEL);
        if (!b) return;
        const m = b.matches(UNL_SEL) ? 'unlimited' : 'daily';
        const u = new URL(location.href); u.searchParams.set('mode', m);
        try { history.replaceState(history.state, '', u); } catch (_) {}
    }
    if (isGamePage) {
        window.addEventListener('load', () => setTimeout(applyModeParam, 120));
        document.addEventListener('click', syncModeToUrl, true);
    }

    function init() {
        injectStyles();
        if (isGamePage) enhanceGameHeader();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

    window.KaUI = { confetti, showCard, updatePill };
})();

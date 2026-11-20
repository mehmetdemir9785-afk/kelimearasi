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
    :root{--ka-paper:#F5F8FD;--ka-line:#DCE6F6;--ka-ink:#1D2B64;--ka-ink-2:#4A5784;--ka-hi:#FFE14D;--ka-red:#E5383B;--ka-green:#1F9D61;--ka-font:'Archivo',system-ui,sans-serif}
    .ka-toast-wrap{position:fixed;left:50%;top:max(12px,env(safe-area-inset-top));transform:translateX(-50%);z-index:2147483000;display:flex;flex-direction:column;gap:10px;align-items:center;pointer-events:none;width:min(92vw,360px);font-family:var(--ka-font)}
    @media (min-width:900px){.ka-toast-wrap{left:auto;right:20px;transform:none;top:84px}}
    .ka-card{pointer-events:auto;width:100%;color:var(--ka-ink);background:#fff;border:2px solid var(--ka-ink);border-radius:14px;padding:14px 16px;box-shadow:4px 4px 0 var(--ka-ink);transform:translateY(-12px) rotate(-1.5deg);opacity:0;transition:transform .45s cubic-bezier(.2,1.4,.4,1),opacity .25s ease;cursor:pointer}
    .ka-card.show{transform:none;opacity:1}
    .ka-card.hide{transform:translateY(-10px);opacity:0}
    .ka-row{display:flex;align-items:center;gap:12px}
    .ka-xp-icon{flex:none;width:46px;height:46px;border-radius:10px;display:grid;place-items:center;background:var(--ka-hi);border:2px solid var(--ka-ink);font:900 13px var(--ka-font);font-stretch:112%;color:var(--ka-ink)}
    .ka-xp-icon svg{width:22px;height:22px;color:var(--ka-ink)}
    .ka-xp-icon.loss{background:#E8EDF7}
    .ka-title{font-size:13px;font-weight:600;color:var(--ka-ink-2)}
    .ka-big{font-size:28px;font-weight:900;font-stretch:118%;line-height:1.05;color:var(--ka-ink)}
    .ka-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
    .ka-chip{font-size:12px;font-weight:600;padding:3px 8px;border-radius:6px;background:var(--ka-paper);border:1px solid var(--ka-line);color:var(--ka-ink-2)}
    .ka-chip b{color:var(--ka-ink);margin-left:4px;font-weight:800}
    .ka-bar-head{display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:var(--ka-ink-2);margin:12px 0 5px}
    .ka-bar-head .lv{color:var(--ka-ink)}
    .ka-bar{height:12px;border-radius:4px;background:#fff;border:2px solid var(--ka-ink);overflow:hidden}
    .ka-bar>i{display:block;height:100%;width:0;background:var(--ka-hi);border-right:2px solid var(--ka-ink);transition:width 1.1s cubic-bezier(.16,1,.3,1)}
    .ka-lvup{position:fixed;inset:0;z-index:2147482999;display:grid;place-items:center;pointer-events:none;font-family:var(--ka-font);background:var(--ka-hi);opacity:0;transition:opacity .25s}
    .ka-lvup.show{opacity:1}
    .ka-lvup-inner{position:relative;text-align:center;transform:scale(.7) rotate(-6deg);transition:transform .6s cubic-bezier(.2,1.5,.4,1)}
    .ka-lvup.show .ka-lvup-inner{transform:none}
    .ka-lvup-badge{width:150px;height:150px;margin:0 auto 18px;border-radius:22px;display:grid;place-items:center;font-size:84px;font-weight:900;font-stretch:120%;color:var(--ka-ink);background:#fff;border:3px solid var(--ka-ink);box-shadow:8px 8px 0 var(--ka-ink);transform:rotate(-4deg)}
    .ka-lvup-t{font-size:44px;font-weight:900;font-stretch:125%;color:var(--ka-ink);letter-spacing:-.01em}
    .ka-lvup-s{font-size:17px;font-weight:600;color:var(--ka-ink);margin-top:6px}
    .ka-ach{display:flex;align-items:center;gap:12px}
    .ka-ach-i{flex:none;width:42px;height:42px;border-radius:10px;display:grid;place-items:center;background:var(--ka-green);border:2px solid var(--ka-ink)}
    .ka-ach-i svg{width:20px;height:20px;color:#fff}
    .ka-comm{cursor:default;padding:14px 16px 16px}
    .kc-h{display:flex;justify-content:space-between;align-items:center;gap:10px;font-weight:800;font-size:14px;color:var(--ka-ink-2);margin-bottom:6px}
    .kc-x{width:28px;height:28px;border:2px solid var(--ka-ink);border-radius:7px;background:#fff;font:900 16px var(--ka-font);color:var(--ka-ink);cursor:pointer;line-height:1}
    .kc-big{font-size:20px;font-weight:900;font-stretch:112%;line-height:1.2;margin:2px 0 10px}
    .kc-row{display:flex;justify-content:space-between;gap:10px;font-size:14px;padding:5px 0;border-bottom:1px dashed var(--ka-line)}
    .kc-row span{color:var(--ka-ink-2);font-weight:600}.kc-row b{font-weight:800}
    .kc-sub{font-size:13px;font-weight:700;color:var(--ka-ink-2);margin:12px 0 6px}
    .kc-bars{display:flex;flex-direction:column;gap:4px}
    .kc-bar{display:grid;grid-template-columns:18px 1fr auto;align-items:center;gap:8px;font-size:12.5px;font-weight:800}
    .kc-bar i{display:block;height:16px;background:#DCE5F5;border:1.5px solid var(--ka-ink);border-radius:4px}
    .kc-bar.me i{background:var(--ka-hi)}
    .kc-bar em{font-style:normal;color:var(--ka-ink-2);font-weight:700;min-width:24px;text-align:right}
    .ka-confetti{position:fixed;inset:0;pointer-events:none;z-index:2147483001}

    /* ---------- Oyun sayfası kabuğu: kareli defter ---------- */
    body.ka-game{font-family:var(--ka-font)!important;color:var(--ka-ink);background-color:var(--ka-paper)!important;background-image:linear-gradient(var(--ka-line) 1px,transparent 1px),linear-gradient(90deg,var(--ka-line) 1px,transparent 1px)!important;background-size:26px 26px!important;background-attachment:fixed}
    body.ka-game *:not(i):not(svg):not(svg *):not(.font-mono):not(code){font-family:var(--ka-font)}
    body.ka-game header[data-ka]{background:var(--ka-hi)!important;border-bottom:2px solid var(--ka-ink)!important;backdrop-filter:none!important;box-shadow:none!important}
    body.ka-game header[data-ka]>:nth-child(2){position:absolute;left:50%;transform:translateX(-50%);max-width:calc(100% - 240px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    body.ka-game header[data-ka] h1, body.ka-game header[data-ka] h1 *{background:none!important;-webkit-text-fill-color:var(--ka-ink)!important;color:var(--ka-ink)!important;text-shadow:none!important;filter:none!important;font-weight:900!important;font-stretch:125%;letter-spacing:.01em!important;text-transform:none!important;font-size:22px!important}
    body.ka-game header[data-ka] h1 + p, body.ka-game header[data-ka] h1 ~ *{color:var(--ka-ink-2)!important}
    .ka-nav-btn{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 12px 0 8px;border-radius:10px;font:700 14px var(--ka-font);color:var(--ka-ink)!important;background:#fff;border:2px solid var(--ka-ink);box-shadow:2px 2px 0 var(--ka-ink);transition:transform .12s,box-shadow .12s;text-decoration:none;filter:none!important;text-shadow:none!important}
    .ka-nav-btn:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 var(--ka-ink)}
    .ka-nav-btn:active{transform:translate(2px,2px);box-shadow:0 0 0 var(--ka-ink)}
    .ka-nav-btn:focus-visible,.ka-xp-pill:focus-visible{outline:3px solid var(--ka-ink);outline-offset:2px}
    .ka-nav-btn svg{width:18px;height:18px}
    .ka-icon-btn{width:38px;padding:0;justify-content:center}
    .ka-right{display:flex;align-items:center;gap:8px}
    .ka-xp-pill{display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 10px;border-radius:10px;background:#fff;border:2px solid var(--ka-ink);box-shadow:2px 2px 0 var(--ka-ink);color:var(--ka-ink);font:800 13px var(--ka-font);text-decoration:none}
    .ka-lv{font-stretch:115%}
    .ka-mini{width:56px;height:8px;border:1.5px solid var(--ka-ink);border-radius:3px;overflow:hidden;background:#fff}
    .ka-mini>i{display:block;height:100%;background:var(--ka-hi);border-right:1.5px solid var(--ka-ink);transition:width 1s cubic-bezier(.16,1,.3,1)}
    .ka-streak{display:inline-flex;align-items:center;gap:2px;color:var(--ka-red)}
    .ka-streak svg{width:13px;height:13px}
    @media (max-width:520px){
      .ka-nav-btn .lbl{display:none}.ka-nav-btn{padding:0;width:38px;justify-content:center}
      .ka-mini{display:none}
      body.ka-game header[data-ka]>:nth-child(2){position:static;transform:none;flex:1;min-width:0;max-width:none;margin:0 8px 0 10px;text-align:left}
      body.ka-game header[data-ka]>:nth-child(2), body.ka-game header[data-ka]>:nth-child(2) *{text-align:left!important;align-items:flex-start!important;justify-content:flex-start!important}
      body.ka-game header[data-ka] h1, body.ka-game header[data-ka] h1 *{font-size:17px!important;font-stretch:110%}
    }
    body.ka-game button[class*="bg-gradient"],body.ka-game a[class*="bg-gradient"],body.ka-game .mode-btn.active,body.ka-game .mode-btn-active,body.ka-game .mode-toggle-btn.active,body.ka-game [data-ka-mode].on,body.ka-game [data-ka-mode].active{background:var(--ka-hi)!important;color:var(--ka-ink)!important;border:2px solid var(--ka-ink)!important;box-shadow:2px 2px 0 var(--ka-ink)!important;text-shadow:none!important}
    body.ka-game button[class*="bg-gradient"] *,body.ka-game a[class*="bg-gradient"] *{color:var(--ka-ink)!important}
    body.ka-game button[class*="bg-gradient"]:hover,body.ka-game a[class*="bg-gradient"]:hover{background:#FFD61F!important}
    @media (prefers-reduced-motion:reduce){.ka-card,.ka-lvup,.ka-lvup-inner,.ka-bar>i{transition:none!important}}
    `;

    function injectStyles() {
        if (document.getElementById('ka-ui-css')) return;
        const st = document.createElement('style'); st.id = 'ka-ui-css'; st.textContent = css;
        document.head.appendChild(st);
        if (isGamePage && !document.getElementById('ka-skin')) {
            const me = document.getElementById('ka-ui-script');
            const base = me ? me.src.replace(/js\/ka-ui\.js.*$/, '') : '../';
            const ver = me ? ((me.src.match(/[?&]v=([^&]+)/) || [])[1] || '') : '';
            const l = document.createElement('link'); l.id = 'ka-skin'; l.rel = 'stylesheet'; l.href = base + 'css/ka-skin.css' + (ver ? '?v=' + ver : '');
            document.head.appendChild(l);
        }
        if (!document.querySelector('link[href*="family=Archivo"]')) {
            const l = document.createElement('link'); l.rel = 'stylesheet';
            l.href = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap';
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
        const colors = ['#FFE14D', '#1D2B64', '#E5383B', '#1F9D61', '#3A86FF', '#ffffff'];
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
                <div class="ka-xp-icon ${r.isWin ? '' : 'loss'}">XP</div>
                <div style="flex:1;min-width:0">
                    <div class="ka-title">${r.isWin ? r.gameName + ' çözüldü' : r.gameName + ': bu sefer olmadı'}</div>
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
        pill.querySelector('.ka-lvn').textContent = s.level;
        pill.querySelector('.ka-mini>i').style.width = Math.min(100, s.xpInCurrentLevel / s.xpRequiredForNext * 100) + '%';
        pill.title = `Seviye ${s.level}: ${s.xpInCurrentLevel} / ${s.xpRequiredForNext} XP`;
        const st = pill.querySelector('.ka-streak');
        st.style.display = s.currentStreak > 0 ? '' : 'none';
        st.lastChild.textContent = s.currentStreak;
    }

    function enhanceGameHeader() {
        const header = document.querySelector('body > header, header');
        if (!header || header.dataset.ka) return;
        header.dataset.ka = '1';
        document.body.classList.add('ka-game');
        if (gameId()) document.body.classList.add('ka-g-' + gameId());

        const home = header.querySelector('a[href*="index.html"]');
        if (home) {
            home.className = 'ka-nav-btn';
            home.innerHTML = `${I.back}<span class="lbl">Oyunlar</span>`;
            home.setAttribute('aria-label', 'Ana sayfaya dön');
        }
        const h1 = header.querySelector('h1');
        const meta = window.KaUser && window.KaUser.GAMES[gameId()];
        if (h1 && meta) h1.textContent = meta.name;
        const kids = [...header.children];
        const help = kids[kids.length - 1];
        if (help && help !== home && /❓|\?/.test(help.textContent.trim()) && help.textContent.trim().length <= 3) {
            help.className = 'ka-nav-btn ka-icon-btn';
            help.innerHTML = I.help;
            help.setAttribute('aria-label', 'Nasıl oynanır');
        }
        if (window.KaUser && help) {
            pill = document.createElement('a');
            pill.href = '../index.html#profil'; pill.className = 'ka-xp-pill'; pill.title = 'Profil ve seviye';
            pill.innerHTML = `<span class="ka-lv">Sv <span class="ka-lvn">1</span></span><span class="ka-mini"><i style="width:0"></i></span><span class="ka-streak">${I.flame}<span>0</span></span>`;
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
        const b = e.target.closest && e.target.closest(UNL_SEL + ',' + DAY_SEL + ',[data-ka-mode]');
        if (!b) return;
        const m = b.matches(UNL_SEL) || /Sınırsız/i.test(b.textContent || '') ? 'unlimited' : 'daily';
        const u = new URL(location.href); u.searchParams.set('mode', m);
        try { history.replaceState(history.state, '', u); } catch (_) {}
    }
    if (isGamePage) {
        window.addEventListener('load', () => setTimeout(applyModeParam, 120));
        document.addEventListener('click', syncModeToUrl, true);
    }

    function forceLight() {
        const h = document.documentElement;
        h.classList.remove('dark');
        new MutationObserver(() => { if (h.classList.contains('dark')) h.classList.remove('dark'); }).observe(h, { attributes: true, attributeFilter: ['class'] });
    }

    function tagModeButtons() {
        document.querySelectorAll('button').forEach(b => {
            const t = (b.textContent || '').trim();
            if (/^(Günlük|Sınırsız)$/.test(t.replace(/^[^A-Za-zÇĞİÖŞÜçğıöşü]+/, ''))) b.dataset.kaMode = '1';
        });
    }


    // ---------------------------------------------------------------- topluluk istatistikleri (Supabase)
    const SUPA_URL = 'https://zesthznbzvccwrldwism.supabase.co';
    const SUPA_KEY = 'sb_publishable_b-V1sMXz7Vbcv8vgXVNTiA_u8KqScg2';
    const supaOn = () => !!SUPA_URL && !!SUPA_KEY;
    const H = () => ({ 'apikey': SUPA_KEY, 'Content-Type': 'application/json' });
    const myKey = (g, d) => `ka_daily_${g}_${d}`;

    async function supaInsert(row) {
        const r = await fetch(`${SUPA_URL}/rest/v1/results`, { method: 'POST', headers: { ...H(), 'Prefer': 'return=minimal' }, body: JSON.stringify(row) });
        if (!r.ok) throw new Error('insert ' + r.status);
    }
    async function supaStats(game, day, seconds, guesses) {
        const r = await fetch(`${SUPA_URL}/rest/v1/rpc/game_stats`, { method: 'POST', headers: H(),
            body: JSON.stringify({ p_game: game, p_day: day, p_seconds: seconds || null, p_guesses: guesses || null }) });
        if (!r.ok) throw new Error('stats ' + r.status);
        return r.json();
    }

    const fmtSec = (t) => t == null ? '-' : `${Math.floor(t / 60)}:${String(Math.round(t % 60)).padStart(2, '0')}`;
    const pct = (a, b) => b > 0 ? Math.round(a / b * 100) : 0;

    let commCard = null;
    function renderCommunity(gameName, me, st) {
        if (commCard) commCard.remove();
        const wins = st.wins || 0, players = st.players || 0;
        const others = Math.max(0, wins - (me.won ? 1 : 0));
        let lines = '';
        if (me.won && me.seconds && others > 0) lines += `<div class="kc-big">Oyuncuların %${pct(st.slower_than_you, others)}'inden hızlısın</div>`;
        else if (me.won && others === 0) lines += `<div class="kc-big">Bugün çözen ilk kişilerdensin</div>`;
        lines += `<div class="kc-row"><span>Bugün oynayan</span><b>${players.toLocaleString('tr-TR')}</b></div>`;
        lines += `<div class="kc-row"><span>Çözen</span><b>${wins.toLocaleString('tr-TR')} (%${pct(wins, players)})</b></div>`;
        if (st.median_seconds != null) lines += `<div class="kc-row"><span>Ortanca süre</span><b>${fmtSec(st.median_seconds)}${me.seconds && me.won ? `, sen ${fmtSec(me.seconds)}` : ''}</b></div>`;
        const g = st.guesses || {};
        const keys = Object.keys(g).map(Number).filter(n => n > 0).sort((a, b) => a - b);
        if (keys.length) {
            const max = Math.max(...keys.map(k => g[k]));
            const lo = Math.min(...keys, me.guesses || 99), hi = Math.max(...keys, me.guesses || 0);
            let bars = '';
            for (let k = lo; k <= hi; k++) {
                const n = g[k] || 0;
                bars += `<div class="kc-bar${me.won && me.guesses === k ? ' me' : ''}"><span>${k}</span><i style="width:${Math.max(4, n / max * 100)}%"></i><em>${n}</em></div>`;
            }
            lines += `<div class="kc-sub">Kaçıncı tahminde çözüldü</div><div class="kc-bars">${bars}</div>`;
        }
        commCard = document.createElement('div');
        commCard.className = 'ka-card ka-comm';
        commCard.innerHTML = `<div class="kc-h"><span>Bugünün ${gameName} bulmacası</span><button class="kc-x" aria-label="Kapat">×</button></div>${lines}`;
        getWrap().appendChild(commCard);
        requestAnimationFrame(() => requestAnimationFrame(() => commCard.classList.add('show')));
        commCard.querySelector('.kc-x').addEventListener('click', (e) => { e.stopPropagation(); commCard.classList.add('hide'); setTimeout(() => { commCard && commCard.remove(); commCard = null; }, 400); });
    }

    async function showCommunity(game, day) {
        if (!supaOn()) return;
        let me; try { me = JSON.parse(localStorage.getItem(myKey(game, day)) || 'null'); } catch (_) {}
        if (!me) return;
        try {
            if (!me.sent) { await supaInsert({ game, day, won: me.won, guesses: me.guesses, seconds: me.seconds }); me.sent = true; localStorage.setItem(myKey(game, day), JSON.stringify(me)); }
            const st = await supaStats(game, day, me.won ? me.seconds : null, me.won ? me.guesses : null);
            const meta = window.KaUser && window.KaUser.GAMES[game];
            renderCommunity(meta ? meta.name : game, me, st);
            addCommButton();
        } catch (e) { console.warn('Topluluk istatistiği alınamadı', e); }
    }

    function addCommButton() {
        const right = document.querySelector('.ka-right');
        if (!right || right.querySelector('.ka-comm-btn')) return;
        const b = document.createElement('button');
        b.className = 'ka-nav-btn ka-icon-btn ka-comm-btn'; b.title = 'Bugünün topluluk istatistikleri'; b.setAttribute('aria-label', 'Topluluk istatistikleri');
        b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/></svg>';
        b.addEventListener('click', () => showCommunity(gameId(), window.KaUser.dayKey()));
        right.insertBefore(b, right.firstChild);
    }

    window.addEventListener('ka:result', e => {
        const r = e.detail;
        if (!r || !r.daily || !isGamePage) return;
        const k = myKey(r.gameId, r.day);
        if (localStorage.getItem(k)) return; // günlük bulmaca bir kez sayılır
        localStorage.setItem(k, JSON.stringify({ won: r.isWin, guesses: r.isWin ? r.guesses : null, seconds: r.seconds > 0 ? r.seconds : null, sent: false }));
        setTimeout(() => showCommunity(r.gameId, r.day), 1600);
    });

    function init() {
        injectStyles();
        forceLight();
        if (isGamePage) {
            enhanceGameHeader(); tagModeButtons(); setTimeout(tagModeButtons, 600);
            try { if (supaOn() && window.KaUser && localStorage.getItem(myKey(gameId(), window.KaUser.dayKey()))) addCommButton(); } catch (_) {}
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

    window.KaUI = { confetti, showCard, updatePill };
})();

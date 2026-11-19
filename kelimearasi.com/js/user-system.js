// Kelimearası User System & Storage (v2)
// Eski API ile uyumlu: getData, saveData, updateUsername, addGameResult,
// checkAchievements, getFormattedStats. Eski kayıtlar otomatik taşınır.
(function (global) {
    'use strict';
    if (global.KaUser && global.KaUser.__v === 2) return; // iki kez yüklenmeye karşı

    const STORAGE_KEY = 'ka_user_data';

    // ------------------------------------------------------------------
    // OYUN KATALOĞU (tek kaynak) — isim, kategori, kazanınca verilen XP
    // ------------------------------------------------------------------
    const GAMES = {
        wordle:       { name: 'Sözcükle',       category: 'word',   xp: 50,  icon: 'text-cursor-input' },
        ikile:        { name: 'İkile',          category: 'word',   xp: 70,  icon: 'columns' },
        dortle:       { name: 'Dörtle',         category: 'word',   xp: 90,  icon: 'layout-grid' },
        sekizle:      { name: 'Sekizle',        category: 'word',   xp: 130, icon: 'layout-dashboard' },
        kelime500:    { name: 'Kelime 500',     category: 'word',   xp: 60,  icon: 'bar-chart-2' },
        tic_tac_word: { name: 'Tic-Tak Kelime', category: 'word',   xp: 60,  icon: 'hash' },
        parolla:      { name: 'Kelime Çemberi', category: 'word',   xp: 80,  icon: 'whole-word' },
        betweenle:    { name: 'Arasında',       category: 'word',   xp: 50,  icon: 'between-horizontal-start' },
        spelling_bee: { name: 'Petek',          category: 'word',   xp: 70,  icon: 'hexagon' },
        fruit_grids:  { name: 'Meyve Izgarası', category: 'logic',  xp: 60,  icon: 'apple' },
        slitherlink:  { name: 'Çit',            category: 'logic',  xp: 80,  icon: 'spline' },
        shihaku:      { name: 'Dikdörtgenler',  category: 'logic',  xp: 60,  icon: 'box-select' },
        queens:       { name: 'Vezirler',       category: 'logic',  xp: 70,  icon: 'crown' },
        sudoku:       { name: 'Sudoku',         category: 'number', xp: 70,  icon: 'grid-3x3' },
        nonogram:     { name: 'Kare Karalama',  category: 'number', xp: 80,  icon: 'table-2' },
        pips:         { name: 'Domino',         category: 'number', xp: 60,  icon: 'dice-5' },
    };
    const LOSS_XP = 10;

    // ------------------------------------------------------------------
    // SEVİYE: her 10 seviyede gereken XP 100 artar (1-10: 1000, 11-20: 1100 ...)
    // ------------------------------------------------------------------
    function calculateLevelData(totalXp) {
        let level = 1, xpLeft = totalXp, req = 1000;
        while (true) {
            req = 1000 + Math.floor((level - 1) / 10) * 100;
            if (xpLeft >= req) { xpLeft -= req; level++; } else break;
        }
        return { level, xpInCurrentLevel: xpLeft, xpRequiredForNext: req };
    }

    const TITLES = [
        [1, 'Acemi'], [5, 'Çaylak'], [10, 'Çırak'], [20, 'Kalfa'], [30, 'Usta'],
        [50, 'Büyük Usta'], [75, 'Bilge'], [100, 'Efsane'], [150, 'Üstat'], [250, 'Mistik'],
    ];
    function titleFor(level) { let t = TITLES[0][1]; for (const [l, n] of TITLES) if (level >= l) t = n; return t; }

    // ------------------------------------------------------------------
    // BAŞARIMLAR (isim + ikon, bildirimlerde kullanılır)
    // ------------------------------------------------------------------
    const ACH = {
        first_blood: ['İlk Kan', 'swords'], fast_learner: ['Isınma Turu', 'target'], unbeatable: ['Yenilmez', 'shield'],
        champion: ['Şampiyon', 'award'], wins_500: ['Savaşçı', 'swords'], conqueror: ['Fatih', 'sword'],
        wins_2500: ['Kahraman', 'shield-alert'], wins_5000: ['Yenilmez Ordu', 'shield-check'], wins_10000: ['Bulmaca Tanrısı', 'sparkles'],
        streak_3: ['Isınma Serisi', 'flame'], serial_killer: ['Seri Katil', 'flame'], streak_14: ['İki Hafta', 'calendar-range'],
        addict: ['Bağımlı', 'zap'], streak_60: ['İstikrar', 'trending-up'], dedication: ['Adanmışlık', 'heart'],
        streak_180: ['Yarım Yıl Serisi', 'calendar-clock'], year_streak: ['Demir İrade', 'calendar-days'], streak_500: ['Durmak Yok', 'flame-kindling'],
        played_10: ['Çaylak', 'sprout'], played_50: ['Hevesli', 'glasses'], legend: ['Efsane', 'crown'],
        true_fan: ['Gerçek Hayran', 'star'], played_1000: ['Binler Kulübü', 'layers'], obsessed: ['Takıntılı', 'gem'], played_5000: ['Makinist', 'cpu'],
        level_5: ['İlk Adım', 'footprints'], apprentice: ['Çırak', 'graduation-cap'], expert: ['Uzman', 'briefcase'],
        grandmaster: ['Büyük Usta', 'sparkles'], level_75: ['Bilge', 'book-open'], god_tier: ['İlah', 'sun'],
        level_150: ['Üstat', 'crown'], level_250: ['Mistik', 'orbit'],
        time_1: ['1 Saatlik Mola', 'coffee'], time_5: ['5 Saatlik Mesai', 'watch'], time_bender: ['Zaman Bükücü', 'hourglass'],
        half_day: ['Zaman Yolcusu', 'clock'], time_50: ['50 Saat', 'timer'], full_day: ['Uykusuz', 'moon'], time_250: ['250 Saat', 'watch'],
        join_7: ['İlk Hafta', 'calendar'], veteran: ['Kıdemli', 'medal'], century_club: ['Yüzler Kulübü', 'users'],
        half_year: ['Sadık Dost', 'handshake'], anniversary: ['Yıl Dönümü', 'party-popper'], join_730: ['İkinci Yıl', 'cake'],
        brainstorm: ['Beyin Fırtınası', 'brain'], explorer_5: ['Gezgin', 'map'], explorer: ['Kaşif', 'compass'], completionist: ['Koleksiyoncu', 'library'],
    };

    function defaultAchievements() { const a = {}; Object.keys(ACH).forEach(k => a[k] = false); return a; }

    function freshData() {
        return {
            v: 2,
            username: 'Bulmaca Sever',
            joinDate: new Date().toISOString(),
            gamesPlayed: 0, gamesWon: 0,
            currentStreak: 0, maxStreak: 0, lastPlayDate: null,
            totalTimeSeconds: 0,
            xp: 0, level: 1,
            gameStats: {},       // eski uyumluluk: oyun -> oynanma sayısı
            games: {},           // oyun -> { played, won, streak, bestStreak, bestTime, lastWinDay }
            playedCategories: [],
            today: { day: null, played: [], won: [] },
            history: [],         // son 30 sonuç
            achievements: defaultAchievements(),
        };
    }

    // ------------------------------------------------------------------
    // TARİH YARDIMCILARI (yerel gün anahtarı: YYYY-MM-DD)
    // ------------------------------------------------------------------
    function dayKey(d) {
        d = d || new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    function parseDay(s) {
        if (!s) return null;
        if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(s)) { const [d, m, y] = s.split('.').map(Number); return new Date(y, m - 1, d); }
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
        const t = new Date(s); return isNaN(t) ? null : new Date(t.getFullYear(), t.getMonth(), t.getDate());
    }
    function daysBetween(a, b) { return Math.round((b - a) / 86400000); }

    // ------------------------------------------------------------------
    let lastCall = { key: '', t: 0 };

    const KaUser = {
        __v: 2,
        GAMES, ACH, LOSS_XP,
        calculateLevelData, titleFor, dayKey,

        getData() {
            let data = freshData();
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const p = JSON.parse(raw);
                    data = { ...data, ...p, achievements: { ...defaultAchievements(), ...(p.achievements || {}) } };
                    data.games = data.games || {};
                    data.today = data.today || { day: null, played: [], won: [] };
                    data.history = data.history || [];
                    // v1 -> v2 taşıma: oyun bazlı oynanma sayısı
                    if (!p.v) {
                        for (const [g, n] of Object.entries(data.gameStats || {})) {
                            data.games[g] = data.games[g] || { played: n, won: 0, streak: 0, bestStreak: 0, bestTime: null, lastWinDay: null };
                        }
                        data.v = 2;
                    }
                }
            } catch (e) { console.error('Kullanıcı verisi okunamadı', e); }
            if (data.today.day !== dayKey()) data.today = { day: dayKey(), played: [], won: [] };
            return data;
        },

        saveData(data) {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
            catch (e) { console.error('Kullanıcı verisi kaydedilemedi', e); }
        },

        updateUsername(newName) {
            if (!newName || !newName.trim()) return;
            const data = this.getData();
            data.username = newName.trim().substring(0, 20);
            this.saveData(data);
            this._emit('ka:user', {});
        },

        getGameStats(gameId) {
            const g = this.getData().games[gameId];
            return g || { played: 0, won: 0, streak: 0, bestStreak: 0, bestTime: null, lastWinDay: null };
        },

        isWonToday(gameId) { return this.getData().today.won.includes(gameId); },
        isPlayedToday(gameId) { return this.getData().today.played.includes(gameId); },

        addGameResult(gameId, category, isWin, timeSeconds) {
            // Aynı sonucun kısa sürede iki kez gönderilmesini engelle
            const key = `${gameId}|${isWin}`;
            const now = Date.now();
            if (lastCall.key === key && now - lastCall.t < 4000) return null;
            lastCall = { key, t: now };

            const data = this.getData();
            const meta = GAMES[gameId] || { name: gameId, category: category, xp: 50 };
            category = category || meta.category;
            timeSeconds = Math.max(0, Math.min(Math.round(+timeSeconds || 0), 6 * 3600)); // makul sınır
            const before = calculateLevelData(data.xp);
            const today = dayKey();

            // Genel istatistik
            data.gamesPlayed += 1;
            if (isWin) data.gamesWon += 1;
            data.totalTimeSeconds += timeSeconds;
            data.gameStats[gameId] = (data.gameStats[gameId] || 0) + 1;
            if (category && !data.playedCategories.includes(category)) data.playedCategories.push(category);

            // Oyun bazlı istatistik
            const g = data.games[gameId] || { played: 0, won: 0, streak: 0, bestStreak: 0, bestTime: null, lastWinDay: null };
            g.played += 1;
            const firstWinToday = isWin && !data.today.won.includes(gameId);
            if (isWin) {
                g.won += 1;
                g.streak += 1;
                g.bestStreak = Math.max(g.bestStreak, g.streak);
                if (timeSeconds > 0 && (g.bestTime == null || timeSeconds < g.bestTime)) g.bestTime = timeSeconds;
                g.lastWinDay = today;
            } else {
                g.streak = 0;
            }
            data.games[gameId] = g;
            if (!data.today.played.includes(gameId)) data.today.played.push(gameId);
            if (isWin && !data.today.won.includes(gameId)) data.today.won.push(gameId);

            // Günlük seri
            const last = parseDay(data.lastPlayDate);
            const todayD = parseDay(today);
            if (!last) data.currentStreak = 1;
            else {
                const diff = daysBetween(last, todayD);
                if (diff === 1) data.currentStreak += 1;
                else if (diff > 1 || data.currentStreak === 0) data.currentStreak = 1;
            }
            data.lastPlayDate = today;
            data.maxStreak = Math.max(data.maxStreak, data.currentStreak);

            // XP hesabı
            const breakdown = [];
            let xp;
            if (isWin) {
                xp = meta.xp;
                breakdown.push({ label: 'Zafer', value: meta.xp });
                if (firstWinToday) {
                    const b = Math.round(meta.xp * 0.5);
                    xp += b; breakdown.push({ label: 'Günün ilk zaferi', value: b });
                }
                if (data.currentStreak > 1) {
                    const pct = Math.min(30, (data.currentStreak - 1) * 3);
                    const b = Math.round(xp * pct / 100);
                    if (b > 0) { xp += b; breakdown.push({ label: `${data.currentStreak} günlük seri`, value: b }); }
                }
            } else {
                xp = LOSS_XP;
                breakdown.push({ label: 'Katılım', value: LOSS_XP });
            }
            data.xp += xp;
            const after = calculateLevelData(data.xp);
            data.level = after.level;

            data.history.unshift({ g: gameId, w: !!isWin, xp, t: timeSeconds, d: Date.now() });
            data.history = data.history.slice(0, 30);

            this.saveData(data);
            const newAch = this.checkAchievements();

            const result = {
                gameId, gameName: meta.name, isWin: !!isWin, xpGained: xp, breakdown,
                before, after, leveledUp: after.level > before.level,
                title: titleFor(after.level), achievements: newAch,
                gameStats: g, streak: data.currentStreak,
            };
            this._emit('ka:result', result);
            return result;
        },

        checkAchievements() {
            const data = this.getData();
            const newly = [];
            const unlock = (key) => { if (!data.achievements[key]) { data.achievements[key] = true; newly.push({ id: key, name: ACH[key][0], icon: ACH[key][1] }); } };
            const W = data.gamesWon, P = data.gamesPlayed, S = data.maxStreak, L = calculateLevelData(data.xp).level, T = data.totalTimeSeconds;

            [[1, 'first_blood'], [10, 'fast_learner'], [50, 'unbeatable'], [250, 'champion'], [500, 'wins_500'], [1000, 'conqueror'], [2500, 'wins_2500'], [5000, 'wins_5000'], [10000, 'wins_10000']].forEach(([n, k]) => W >= n && unlock(k));
            [[3, 'streak_3'], [5, 'serial_killer'], [14, 'streak_14'], [30, 'addict'], [60, 'streak_60'], [100, 'dedication'], [180, 'streak_180'], [365, 'year_streak'], [500, 'streak_500']].forEach(([n, k]) => S >= n && unlock(k));
            [[10, 'played_10'], [50, 'played_50'], [100, 'legend'], [500, 'true_fan'], [1000, 'played_1000'], [2500, 'obsessed'], [5000, 'played_5000']].forEach(([n, k]) => P >= n && unlock(k));
            [[5, 'level_5'], [10, 'apprentice'], [25, 'expert'], [50, 'grandmaster'], [75, 'level_75'], [100, 'god_tier'], [150, 'level_150'], [250, 'level_250']].forEach(([n, k]) => L >= n && unlock(k));
            [[3600, 'time_1'], [18000, 'time_5'], [36000, 'time_bender'], [86400, 'half_day'], [180000, 'time_50'], [360000, 'full_day'], [900000, 'time_250']].forEach(([n, k]) => T >= n && unlock(k));

            const days = Math.floor((Date.now() - new Date(data.joinDate)) / 86400000);
            [[7, 'join_7'], [30, 'veteran'], [100, 'century_club'], [180, 'half_year'], [365, 'anniversary'], [730, 'join_730']].forEach(([n, k]) => days >= n && unlock(k));

            const distinct = Object.keys(data.gameStats).length;
            if (data.playedCategories.length >= 3) unlock('brainstorm');
            if (distinct >= 5) unlock('explorer_5');
            if (distinct >= 10) unlock('explorer');
            if (distinct >= 16) unlock('completionist');

            if (newly.length) this.saveData(data);
            return newly;
        },

        getFormattedStats() {
            const data = this.getData();
            let favoriteGame = '-', maxPlays = 0;
            for (const [game, plays] of Object.entries(data.gameStats)) if (plays > maxPlays) { maxPlays = plays; favoriteGame = game; }

            const h = Math.floor(data.totalTimeSeconds / 3600), m = Math.floor((data.totalTimeSeconds % 3600) / 60);
            let timeStr = (h > 0 ? `${h}s ` : '') + `${m}dk`;
            if (h === 0 && m === 0) timeStr = "1dk'dan az";

            const joinStr = new Date(data.joinDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
            const winRate = data.gamesPlayed > 0 ? Math.round((data.gamesWon / data.gamesPlayed) * 100) : 0;
            const lv = calculateLevelData(data.xp);

            // Seri bugün ya da dün oynanmadıysa kırılmış sayılır
            const last = parseDay(data.lastPlayDate);
            const gap = last ? daysBetween(last, parseDay(dayKey())) : 99;
            const liveStreak = gap <= 1 ? data.currentStreak : 0;

            return {
                ...data,
                level: lv.level,
                currentStreak: liveStreak,
                streakAtRisk: gap === 1 && liveStreak > 0,
                formattedJoinDate: joinStr,
                winRate,
                favoriteGameId: favoriteGame,
                formattedTime: timeStr,
                unlockedAchievementsCount: Object.values(data.achievements).filter(Boolean).length,
                totalAchievements: Object.keys(ACH).length,
                xpInCurrentLevel: lv.xpInCurrentLevel,
                xpRequiredForNext: lv.xpRequiredForNext,
                title: titleFor(lv.level),
            };
        },

        _emit(name, detail) {
            try { global.dispatchEvent(new CustomEvent(name, { detail })); } catch (e) { /* eski tarayıcı */ }
        },
    };

    global.KaUser = KaUser;

    // Site tek tema kullanır (kareli defter, açık). Karanlık sınıfı hemen kaldır.
    try { document.documentElement.classList.remove('dark'); } catch (e) { /* yoksay */ }

    // ------------------------------------------------------------------
    // Arayüz katmanını (bildirimler, oyun sayfası kabuğu) otomatik yükle
    // ------------------------------------------------------------------
    try {
        const me = document.currentScript && document.currentScript.src;
        if (me && !document.getElementById('ka-ui-script')) {
            const base = me.replace(/user-system\.js.*$/, '');
            const s = document.createElement('script');
            s.id = 'ka-ui-script'; s.src = base + 'ka-ui.js'; s.defer = true;
            document.head.appendChild(s);
        }
    } catch (e) { /* yoksay */ }
})(window);

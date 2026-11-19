import io
html = '''<!DOCTYPE html>
<html lang="tr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Arasında</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        darkBg: '#0B0F17',
                        cardBg: '#1b263b',
                    }
                }
            }
        }
    </script>
    
    <style>
        .vk-key {
            background-color: #1b263b;
            color: #ffffff;
            transition: all 0.15s ease;
            touch-action: manipulation;
            user-select: none;
        }
        .vk-key:active:not(.disabled) {
            transform: scale(0.92);
            background-color: #2a3b5c;
        }
        .vk-key.disabled {
            background-color: #0B0F17 !important; 
            color: #334155 !important; 
            pointer-events: none;
            border: 1px solid #1e293b;
        }
        .vk-key.special {
            background-color: #334155;
        }
        .vk-key.special:active:not(.disabled) {
            background-color: #475569;
        }
        
        .shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
            10%, 90% { transform: translateX(-2px); }
            20%, 80% { transform: translateX(3px); }
            30%, 50%, 70% { transform: translateX(-5px); border-color: #ef4444; }
            40%, 60% { transform: translateX(5px); border-color: #ef4444; }
        }

        .win-bounce { animation: winBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes winBounce {
            0% { transform: translateY(0); }
            30% { transform: translateY(-15px); }
            50% { transform: translateY(0); }
            70% { transform: translateY(-7px); }
            100% { transform: translateY(0); }
        }

        #toast {
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            transform: translateY(-20px);
            opacity: 0;
            pointer-events: none;
        }
        #toast.show {
            transform: translateY(0);
            opacity: 1;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(71, 85, 105, 0.8); border-radius: 10px; }
    </style>

    <script src="../betweenle kelime listesi/target_5_harfli.js" charset="windows-1254"></script>
    <script src="../betweenle kelime listesi/valid_5_harfli.js" charset="windows-1254"></script>
</head>
<body class="bg-darkBg text-white font-sans min-h-screen flex flex-col items-center select-none overflow-hidden">

    <div id="toast" class="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full font-semibold shadow-lg text-sm backdrop-blur-sm whitespace-nowrap text-center">
        Geçersiz kelime!
    </div>

    <!-- NASIL OYNANIR MODAL -->
    <div id="help-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center bg-darkBg/70 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300 p-4">
        <div id="help-modal-content" class="bg-cardBg border border-slate-700/60 rounded-3xl p-6 sm:p-8 w-full max-w-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform scale-95 transition-transform duration-300 flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-2xl mb-3">❓</div>
            <h2 class="text-2xl font-bold mb-4 tracking-wide text-white drop-shadow-md">Nasıl Oynanır?</h2>
            <div id="help-text" class="text-slate-300 text-sm leading-relaxed mb-6 font-medium text-left w-full bg-darkBg/50 p-4 rounded-xl border border-slate-700/50">
            </div>
            <button id="help-close-btn" class="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-3 font-bold transition-colors active:scale-95 shadow-md">Anladım</button>
        </div>
    </div>

    <!-- OYUN SONU MODAL -->
    <div id="game-over-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center bg-darkBg/80 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300 p-4">
        <div id="modal-content" class="bg-cardBg border border-slate-700/60 text-white rounded-3xl w-full max-w-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform scale-95 transition-transform duration-300 flex flex-col relative max-h-[95vh] overflow-y-auto custom-scrollbar">
            <button id="modal-review-btn" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div class="p-6 sm:p-8 flex flex-col items-center text-center">
                <h2 id="modal-title" class="text-3xl font-bold mb-3 tracking-wide drop-shadow-md shrink-0">Kazandın</h2>
                <p id="modal-subtitle" class="text-[16px] text-slate-300 mb-5 font-medium">Kelimeyi alfabetik olarak buldun</p>
                <div class="border-2 border-dashed border-slate-500 bg-darkBg/50 rounded-xl px-8 py-3 mb-2 flex items-center justify-center min-w-[140px] shadow-inner">
                    <span id="modal-target-word" class="text-2xl font-bold tracking-widest text-white uppercase drop-shadow-sm">KELİME</span>
                </div>
                <a id="modal-meaning-link" href="#" target="_blank" class="text-emerald-400 hover:text-emerald-300 text-[14px] mb-5 transition-colors font-medium underline underline-offset-2">Bu kelimenin anlamı nedir?</a>
                <p class="text-[20px] mb-6 text-slate-200 font-medium"><span id="modal-time" class="font-bold text-white">00:00</span> sürede bildin</p>
                <button id="modal-next-btn" class="w-full relative group bg-slate-800 rounded-xl p-[1px] mb-3 transition-all duration-300 active:scale-95 shadow-md">
                    <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-xl opacity-80 blur-sm group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="relative bg-emerald-500 group-hover:bg-emerald-400 w-full h-12 flex items-center justify-center rounded-xl transition-colors">
                        <span class="text-darkBg font-bold text-lg tracking-widest uppercase">YENİ OYUN</span>
                    </div>
                </button>
                <div id="modal-daily-text" class="hidden w-full bg-darkBg/50 text-slate-300 font-medium py-3 rounded-xl mb-3 items-center justify-center border border-slate-700/50">Yarın yeni kelimede görüşürüz!</div>
            </div>
        </div>
    </div>

    <!-- OYUN SONU MİNİMALİST GERİ DÖNÜŞ (RESTORE) BUTONU -->
    <div id="restore-modal-container" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden transition-all duration-300 opacity-0 translate-y-4">
        <button id="restore-modal-btn" class="bg-cardBg/90 backdrop-blur-md border border-slate-600/50 text-white px-6 py-3 rounded-full font-semibold shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all flex items-center gap-2 active:scale-95">
            <span class="text-xl leading-none opacity-80">📄</span> 
            <span class="tracking-wide">Özet Kartını Aç</span>
        </button>
    </div>

    <!-- MAIN HEADER -->
    <header class="w-full flex items-center justify-between p-4 max-w-lg mx-auto shrink-0">
        <a href="../index.html" class="p-2 text-slate-400 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </a>
        <h1 class="text-3xl font-extrabold tracking-widest bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent uppercase">
            ARASINDA
        </h1>
        <button id="help-btn" class="p-2 text-slate-400 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </button>
    </header>

    <!-- TOGGLE -->
    <div class="flex justify-center mb-4 shrink-0">
        <div class="bg-cardBg rounded-xl p-1 flex items-center gap-1 shadow-inner border border-slate-700/50">
            <button id="mode-daily" class="px-6 py-2 rounded-lg text-sm font-bold transition-all bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md">Günlük</button>
            <button id="mode-unlimited" class="px-6 py-2 rounded-lg text-sm font-bold transition-all text-slate-400 hover:text-white">Sınırsız</button>
        </div>
    </div>

    <!-- GAME CONTAINER -->
    <div id="arasinda-container" class="w-full max-w-lg mx-auto flex flex-col flex-1 px-4 pb-2 min-h-0">
        <div class="bg-cardBg rounded-xl p-4 mb-4 flex items-center relative border border-slate-700 shrink-0 shadow-md">
            <div class="w-1.5 bg-slate-700 rounded-full h-12 absolute left-6">
                <div class="w-2.5 h-2.5 bg-indigo-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                <div id="arasinda-orange-dot" class="w-3 h-3 bg-orange-500 rounded-full absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] opacity-0" style="top: 50%;"></div>
                <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            </div>
            <div class="ml-10 flex flex-col justify-between h-12 w-full gap-2">
                <div class="flex items-center justify-between w-full">
                    <span class="text-[10px] text-slate-400 font-bold tracking-widest leading-none">ALT SINIR</span>
                    <span id="arasinda-lower-bound" class="text-indigo-400 font-bold text-xl leading-none uppercase">A</span>
                </div>
                <div class="flex items-center justify-between w-full">
                    <span class="text-[10px] text-slate-400 font-bold tracking-widest leading-none">ÜST SINIR</span>
                    <span id="arasinda-upper-bound" class="text-emerald-400 font-bold text-xl leading-none uppercase">Z</span>
                </div>
            </div>
        </div>

        <div id="arasinda-input-container" class="flex gap-3 mb-4 shrink-0 transition-transform">
            <div id="arasinda-letter-boxes" class="flex-1 bg-cardBg rounded-xl flex items-center justify-center gap-2 border border-slate-700 h-14 shadow-inner"></div>
            <button id="arasinda-submit" class="w-24 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex flex-col items-center justify-center h-14 transition-colors shadow-lg opacity-50 pointer-events-none active:scale-[0.96]">
                <span class="text-xl leading-none mb-0.5">✓</span>
                <span class="text-[10px] font-bold tracking-wider">TAHMİN</span>
            </button>
        </div>

        <div class="flex justify-between items-center mb-2 px-1 shrink-0">
            <h3 class="text-xs font-bold text-slate-400 tracking-widest uppercase">Tahmin Geçmişi</h3>
            <span id="arasinda-guess-count" class="text-xs font-bold bg-slate-800 px-2 py-1 rounded text-slate-300">Kalan Hak: 14</span>
        </div>

        <div class="flex-1 relative overflow-y-auto mb-3 scroll-smooth px-1 custom-scrollbar" id="arasinda-list-wrapper">
            <div id="arasinda-guesses" class="flex flex-col gap-2 pb-2 min-h-full"></div>
        </div>
    </div>

    <div id="virtual-keyboard-container" class="flex flex-col shrink-0 w-full max-w-lg mx-auto px-2 mb-2 select-none">
        <div id="virtual-keyboard" class="flex flex-col gap-1.5"></div>
    </div>

    <script>
        let currentMode = "daily";
        let arasindaState = { targetWord: "", guesses: [], lowerBound: null, upperBound: null, status: "playing", startTime: null, elapsedTime: null };
        let currentInputValue = "";
        let isAnimating = false;

        let ALLOWED_WORDS = [];
        let TARGETS = [];

        window.onload = () => {
            TARGETS = typeof TARGET_WORDS !== 'undefined' ? TARGET_WORDS : [];
            let all = typeof ALL_WORDS !== 'undefined' ? ALL_WORDS : [];
            ALLOWED_WORDS = [...new Set([...all, ...TARGETS])];

            initKeyboard();
            initArasinda();
        };

        const KEYBOARD_LAYOUT = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
            ["ENT", "Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç", "DEL"]
        ];

        function initKeyboard() {
            const kb = document.getElementById('virtual-keyboard');
            kb.innerHTML = "";
            KEYBOARD_LAYOUT.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.className = "flex justify-center gap-1 w-full";
                row.forEach(key => {
                    const btn = document.createElement('button');
                    btn.className = `vk-key flex-1 h-12 sm:h-14 rounded-lg font-bold text-sm sm:text-base flex items-center justify-center shadow-sm uppercase`;
                    btn.dataset.key = key;
                    btn.textContent = key === "DEL" ? "⌫" : (key === "ENT" ? "ENTER" : key);
                    if (key === "ENT" || key === "DEL") btn.classList.add('special', 'max-w-[65px]', 'text-[11px]');
                    btn.addEventListener('click', () => handleKeyClick(key));
                    rowDiv.appendChild(btn);
                });
                kb.appendChild(rowDiv);
            });
        }

        const trCompare = (a, b) => a.localeCompare(b, 'tr');

        function getDailyWord(prefix) {
            if(TARGETS.length === 0) return "KALEM";
            const dateStr = new Date().toISOString().split('T')[0];
            const seed = prefix + "-" + dateStr + "-5";
            let hash = 0;
            for (let i = 0; i < seed.length; i++) {
                hash = ((hash << 5) - hash) + seed.charCodeAt(i);
                hash |= 0;
            }
            return TARGETS[Math.abs(hash) % TARGETS.length];
        }

        function initArasinda() {
            if(currentMode === "daily") {
                const saved = localStorage.getItem('arasinda_daily_5');
                const today = new Date().toISOString().split('T')[0];
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.date === today) {
                        arasindaState = parsed.state;
                        if(arasindaState.status === "playing" && !arasindaState.startTime) arasindaState.startTime = Date.now();
                    } else startNewGame(true);
                } else startNewGame(true);
            } else {
                startNewGame(false);
            }
            renderUI();
        }

        function startNewGame(isDaily) {
            let word = "KALEM";
            if(TARGETS.length > 0) {
                word = isDaily ? getDailyWord('ara') : TARGETS[Math.floor(Math.random() * TARGETS.length)];
            }
            arasindaState = { targetWord: word, guesses: [], lowerBound: null, upperBound: null, status: "playing", startTime: Date.now(), elapsedTime: null };
            currentInputValue = "";
            saveGameState();
        }

        function saveGameState() {
            if (currentMode !== "daily") return;
            const data = { date: new Date().toISOString().split('T')[0], state: arasindaState };
            localStorage.setItem('arasinda_daily_5', JSON.stringify(data));
        }

        function renderUI(justFinished = false) {
            document.getElementById('arasinda-lower-bound').textContent = arasindaState.lowerBound || "A";
            document.getElementById('arasinda-lower-bound').className = `font-bold text-xl leading-none uppercase ${arasindaState.lowerBound ? 'text-indigo-400' : 'text-slate-500'}`;
            
            document.getElementById('arasinda-upper-bound').textContent = arasindaState.upperBound || "Z";
            document.getElementById('arasinda-upper-bound').className = `font-bold text-xl leading-none uppercase ${arasindaState.upperBound ? 'text-emerald-400' : 'text-slate-500'}`;
            
            document.getElementById('arasinda-guess-count').textContent = `Kalan Hak: ${14 - arasindaState.guesses.length}`;

            const list = document.getElementById('arasinda-guesses');
            list.innerHTML = "";
            arasindaState.guesses.forEach((guess, idx) => {
                const isWin = (guess === arasindaState.targetWord);
                const comp = trCompare(guess, arasindaState.targetWord);
                
                let statusHtml = "";
                if (isWin) statusHtml = `<span class="text-green-400 flex items-center gap-1">BULUNDU 🎉</span>`;
                else if (comp < 0) statusHtml = `<span class="text-indigo-300 flex items-center gap-1">DAHA İLERİ ⬇️</span>`;
                else statusHtml = `<span class="text-emerald-300 flex items-center gap-1">DAHA GERİ ⬆️</span>`;

                const el = document.createElement("div");
                el.className = `bg-cardBg rounded-lg p-3 flex justify-between items-center text-sm font-bold border ${isWin ? 'border-green-600/50' : 'border-slate-700/50'} shadow-sm`;
                el.innerHTML = `<span class="text-slate-200 tracking-widest text-lg">${guess}</span>${statusHtml}`;
                
                if (isWin && justFinished && idx === arasindaState.guesses.length - 1) {
                    el.classList.add('win-bounce');
                }
                list.appendChild(el);
            });

            const wrapper = document.getElementById('arasinda-list-wrapper');
            wrapper.scrollTop = wrapper.scrollHeight;

            updateInputUI();
            updateOrangeDot();
            updateKeyboardState();

            if (arasindaState.status !== "playing") {
                document.getElementById('arasinda-input-container').style.display = "none";
                document.getElementById('virtual-keyboard-container').style.display = "none";
                if (justFinished) {
                    if (arasindaState.status === "won") setTimeout(shootConfetti, 400);
                    setTimeout(() => showGameOverModal(), 1200);
                } else {
                    document.getElementById('restore-modal-container').classList.remove('hidden');
                    void document.getElementById('restore-modal-container').offsetWidth;
                    document.getElementById('restore-modal-container').classList.remove('opacity-0', 'translate-y-4');
                }
            } else {
                document.getElementById('arasinda-input-container').style.display = "flex";
                document.getElementById('virtual-keyboard-container').style.display = "flex";
                document.getElementById('restore-modal-container').classList.add('hidden');
            }
        }

        function updateInputUI() {
            const boxes = document.getElementById('arasinda-letter-boxes');
            boxes.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                const char = currentInputValue[i] || "";
                const div = document.createElement('div');
                div.className = char 
                    ? "w-10 h-12 flex items-center justify-center text-2xl font-bold text-white border-b-[3px] border-indigo-400"
                    : "w-10 h-12 flex items-center justify-center text-2xl font-bold text-slate-600";
                div.textContent = char || "—";
                boxes.appendChild(div);
            }
            const btn = document.getElementById('arasinda-submit');
            if (currentInputValue.length === 5) btn.classList.remove('opacity-50', 'pointer-events-none');
            else btn.classList.add('opacity-50', 'pointer-events-none');
        }

        function getWordScore(word) {
            if (!word) return 0;
            const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
            let score = 0;
            const len = Math.min(5, word.length);
            for (let i = 0; i < len; i++) {
                let idx = alphabet.indexOf(word[i]);
                if (idx === -1) idx = 0;
                score += idx * Math.pow(29, (4) - i);
            }
            return score;
        }

        function updateOrangeDot() {
            const dot = document.getElementById('arasinda-orange-dot');
            if (arasindaState.guesses.length === 0) {
                dot.classList.add('opacity-0');
                return;
            } else {
                dot.classList.remove('opacity-0');
            }
            const targetScore = getWordScore(arasindaState.targetWord);
            const lowerScore = arasindaState.lowerBound ? getWordScore(arasindaState.lowerBound) : 0;
            const upperScore = arasindaState.upperBound ? getWordScore(arasindaState.upperBound) : getWordScore("Z".repeat(5));
            
            let percentage = 0.5;
            if (upperScore > lowerScore) percentage = (targetScore - lowerScore) / (upperScore - lowerScore);
            percentage = Math.max(0.05, Math.min(0.95, percentage));
            dot.style.top = `${percentage * 100}%`;
        }

        function getValidNextLetters() {
            const validLetters = new Set();
            if (arasindaState.status !== "playing" || currentInputValue.length >= 5) return validLetters;
            const alphabet = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
            for (let i = 0; i < alphabet.length; i++) {
                const key = alphabet[i];
                const prefix = currentInputValue + key;
                let inBounds = true;
                if (arasindaState.lowerBound) {
                    const lbPrefix = arasindaState.lowerBound.substring(0, prefix.length);
                    if (trCompare(prefix, lbPrefix) < 0) inBounds = false;
                }
                if (arasindaState.upperBound) {
                    const ubPrefix = arasindaState.upperBound.substring(0, prefix.length);
                    if (trCompare(prefix, ubPrefix) > 0) inBounds = false;
                }
                if (inBounds) validLetters.add(key);
            }
            return validLetters;
        }

        function updateKeyboardState() {
            const validLetters = getValidNextLetters();
            const isFull = currentInputValue.length === 5;
            document.querySelectorAll('#virtual-keyboard .vk-key').forEach(btn => {
                const key = btn.dataset.key;
                if (key === "ENT") btn.classList.toggle('disabled', !isFull);
                else if (key === "DEL") btn.classList.toggle('disabled', currentInputValue.length === 0);
                else {
                    if (validLetters.has(key)) btn.classList.remove('disabled');
                    else btn.classList.add('disabled');
                }
            });
        }

        function handleKeyClick(key) {
            if (isAnimating || arasindaState.status !== "playing") return;

            if (key === "DEL") {
                if (currentInputValue.length > 0) currentInputValue = currentInputValue.slice(0, -1);
            } else if (key === "ENT") {
                if (currentInputValue.length === 5) processGuess();
            } else {
                if (currentInputValue.length < 5) currentInputValue += key;
            }
            
            updateInputUI();
            updateKeyboardState();
        }

        window.addEventListener('keydown', (e) => {
            if (isAnimating || arasindaState.status !== "playing" || !document.getElementById('game-over-modal').classList.contains('hidden')) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            let key = e.key;
            if (key === 'Enter') key = 'ENT';
            else if (key === 'Backspace') key = 'DEL';
            else if (key === 'i') key = 'İ';
            else if (key === 'ı') key = 'I';
            else key = key.toLocaleUpperCase('tr-TR');
            
            const targetBtn = document.querySelector(`#virtual-keyboard .vk-key[data-key="${key}"]`);
            
            if (targetBtn && !targetBtn.classList.contains('disabled')) {
                handleKeyClick(targetBtn.dataset.key);
                targetBtn.classList.add('scale-[0.92]', 'bg-[#2a3b5c]');
                setTimeout(() => targetBtn.classList.remove('scale-[0.92]', 'bg-[#2a3b5c]'), 100);
            } else if (/^[A-ZÇĞIİÖŞÜQWX]$/.test(key)) {
                shakeElement(document.getElementById('arasinda-input-container'));
            }
        });

        function calculateElapsedTime() {
            if (!arasindaState.elapsedTime && arasindaState.startTime) {
                arasindaState.elapsedTime = Math.floor((Date.now() - arasindaState.startTime) / 1000);
            }
        }

        function processGuess() {
            const guess = currentInputValue;
            if (ALLOWED_WORDS.length > 0 && !ALLOWED_WORDS.includes(guess)) {
                showToast("Geçersiz kelime, sözlükte bulunamadı!");
                shakeElement(document.getElementById('arasinda-input-container'));
                return;
            }

            arasindaState.guesses.push(guess);
            let comp = trCompare(guess, arasindaState.targetWord);

            if (comp === 0) {
                arasindaState.status = "won";
                calculateElapsedTime();
            } else {
                if (comp < 0) arasindaState.lowerBound = guess;
                else arasindaState.upperBound = guess;

                if (arasindaState.guesses.length >= 14) {
                    arasindaState.status = "lost";
                    calculateElapsedTime();
                }
            }
            currentInputValue = "";
            saveGameState();
            renderUI(true);
        }

        document.getElementById('mode-daily').addEventListener('click', () => {
            if(currentMode === "daily") return;
            currentMode = "daily";
            document.getElementById('mode-daily').className = "px-6 py-2 rounded-lg text-sm font-bold transition-all bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md";
            document.getElementById('mode-unlimited').className = "px-6 py-2 rounded-lg text-sm font-bold transition-all text-slate-400 hover:text-white";
            initArasinda();
        });

        document.getElementById('mode-unlimited').addEventListener('click', () => {
            if(currentMode === "unlimited") return;
            currentMode = "unlimited";
            document.getElementById('mode-unlimited').className = "px-6 py-2 rounded-lg text-sm font-bold transition-all bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md";
            document.getElementById('mode-daily').className = "px-6 py-2 rounded-lg text-sm font-bold transition-all text-slate-400 hover:text-white";
            initArasinda();
        });

        document.getElementById('arasinda-submit').addEventListener('click', () => {
            if(currentInputValue.length === 5) processGuess();
        });

        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 2500);
        }

        function shakeElement(el) {
            el.classList.remove('shake');
            void el.offsetWidth;
            el.classList.add('shake');
        }

        function shootConfetti() {
            const colors = ['#8b8cce', '#22c55e', '#3b82f6', '#f472b6', '#fbbf24'];
            for (let i = 0; i < 60; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'absolute w-2 h-4 rounded-sm z-50 pointer-events-none shadow-sm';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-20px';
                
                const tx = (Math.random() - 0.5) * 200 + 'px';
                const ty = Math.random() * 80 + 20 + 'vh';
                const rot = Math.random() * 360 * 3 + 'deg';
                
                confetti.style.transition = 'transform 2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 2s ease-in';
                document.body.appendChild(confetti);
                
                void confetti.offsetWidth;
                
                confetti.style.transform = `translate(${tx}, ${ty}) rotate(${rot})`;
                confetti.style.opacity = '0';
                
                setTimeout(() => confetti.remove(), 2000);
            }
        }

        function showGameOverModal() {
            const isWin = arasindaState.status === "won";
            
            document.getElementById('modal-title').textContent = isWin ? "Kazandın" : "Oyun Bitti";
            document.getElementById('modal-title').className = `text-3xl font-bold mb-3 tracking-wide drop-shadow-md shrink-0 ${isWin ? 'text-emerald-400' : 'text-rose-400'}`;
            
            document.getElementById('modal-subtitle').textContent = isWin ? "Kelimeyi alfabetik olarak buldun" : "Kelimeyi bulamadın";
            
            document.getElementById('modal-target-word').textContent = arasindaState.targetWord;
            document.getElementById('modal-meaning-link').href = `https://www.google.com/search?q=${arasindaState.targetWord}+ne+demek`;
            
            const time = arasindaState.elapsedTime || 0;
            const m = Math.floor(time/60).toString().padStart(2, '0');
            const s = (time%60).toString().padStart(2, '0');
            document.getElementById('modal-time').textContent = `${m}:${s}`;
            
            if (currentMode === "daily") {
                document.getElementById('modal-next-btn').classList.add('hidden');
                document.getElementById('modal-daily-text').classList.remove('hidden');
                document.getElementById('modal-daily-text').classList.add('flex');
            } else {
                document.getElementById('modal-next-btn').classList.remove('hidden');
                document.getElementById('modal-daily-text').classList.add('hidden');
                document.getElementById('modal-daily-text').classList.remove('flex');
            }
            
            const modal = document.getElementById('game-over-modal');
            modal.classList.remove('hidden');
            void modal.offsetWidth; 
            modal.classList.remove('opacity-0', 'pointer-events-none');
            document.getElementById('modal-content').classList.remove('scale-95');
            document.getElementById('restore-modal-container').classList.add('hidden');
        }

        function closeGameOverModal() {
            const modal = document.getElementById('game-over-modal');
            modal.classList.add('opacity-0', 'pointer-events-none');
            document.getElementById('modal-content').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                document.getElementById('restore-modal-container').classList.remove('hidden');
                void document.getElementById('restore-modal-container').offsetWidth;
                document.getElementById('restore-modal-container').classList.remove('opacity-0', 'translate-y-4');
            }, 300);
        }

        document.getElementById('modal-review-btn').addEventListener('click', closeGameOverModal);
        document.getElementById('modal-next-btn').addEventListener('click', () => {
            closeGameOverModal();
            startNewGame(false);
            renderUI();
        });

        document.getElementById('restore-modal-btn').addEventListener('click', () => {
            document.getElementById('restore-modal-container').classList.add('opacity-0', 'translate-y-4');
            setTimeout(() => document.getElementById('restore-modal-container').classList.add('hidden'), 300);
            showGameOverModal();
        });

        const GAME_RULES = "<ul class='list-disc pl-5 space-y-2 text-slate-300 text-left'><li>Hedef kelimeyi alfabetik sıraya göre bulmaya çalışın.</li><li>Tahminleriniz kelimenin alfabetik olarak neresinde kaldığına göre <b class='text-indigo-400'>'DAHA İLERİ ⬇️'</b> veya <b class='text-emerald-400'>'DAHA GERİ ⬆️'</b> olarak yönlendirilir.</li><li>Doğru kelimeyi bulmak için 14 hakkınız var!</li></ul>";

        document.getElementById('help-btn').addEventListener('click', () => {
            document.getElementById('help-text').innerHTML = GAME_RULES;
            const modal = document.getElementById('help-modal');
            modal.classList.remove('hidden');
            void modal.offsetWidth;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            document.getElementById('help-modal-content').classList.remove('scale-95');
        });

        document.getElementById('help-close-btn').addEventListener('click', () => {
            const modal = document.getElementById('help-modal');
            modal.classList.add('opacity-0', 'pointer-events-none');
            document.getElementById('help-modal-content').classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 300);
        });

    </script>
</body>
</html>
'''
with io.open('oyunlar/betweenle.html', 'w', encoding='utf-8') as file:
    file.write(html)

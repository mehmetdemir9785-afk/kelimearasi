const fs = require('fs');
let html = fs.readFileSync('pips.html', 'utf8');

// 1. html tag
html = html.replace('<html lang="tr">', '<html lang="tr" class="dark">');

// 2. tailwind config script
const twConfig = `    <script>
        tailwind.config = {
            darkMode: 'class',
        }
    </script>
`;
if(!html.includes('tailwind.config = {')) {
    html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', '<script src="https://cdn.tailwindcss.com"></script>\n' + twConfig);
}

// 3. body style removal & class
html = html.replace(/background-color: #0B0F17;\s*color: white;/, '');
html = html.replace(/<body[^>]*>/, '<body class="bg-gray-50 dark:bg-[#0c0c1d] text-gray-900 dark:text-gray-100">');

// 4. neon-title CSS
html = html.replace(/\.neon-title {[\s\S]*?text-shadow:[\s\S]*?}/, 
`.neon-title {
            font-family: 'Inter', sans-serif;
            font-weight: 900;
            font-size: 1.6rem;
            letter-spacing: 0.35em;
        }
        .dark .neon-title {
            color: #fff;
            text-shadow:
                0 0 7px rgba(255, 255, 255, 0.6),
                0 0 15px rgba(120, 200, 255, 0.4),
                0 0 30px rgba(120, 200, 255, 0.2);
        }
        :not(.dark) .neon-title {
            color: #1f2937;
        }`);

// 5. pip-dot CSS
html = html.replace(/\.pip-dot {[\s\S]*?background: #2d2d44;[\s\S]*?}/, 
`.pip-dot {
            border-radius: 50%;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
        }
        .dark .pip-dot { background: #2d2d44; }
        :not(.dark) .pip-dot { background: #374151; }`);

// 6. domino-tile-bg CSS
html = html.replace(/\.domino-tile-bg {[\s\S]*?}/, 
`.domino-tile-bg {
            background: linear-gradient(145deg, #ffffff, #f3f4f6);
            box-shadow: 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,1);
        }
        .dark .domino-tile-bg {
            background: linear-gradient(145deg, #f5f0e8, #ebe5d8);
            box-shadow: 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5);
        }`);

// 7. mode/diff btn CSS
html = html.replace('.mode-btn-inactive {\n            background: transparent;\n            color: #9ca3af;\n        }', 
`.mode-btn-inactive {
            background: transparent;
        }
        .dark .mode-btn-inactive { color: #9ca3af; }
        :not(.dark) .mode-btn-inactive { color: #6b7280; }`);

html = html.replace('.diff-btn-inactive {\n            background: transparent;\n            color: #6b7280;\n        }', 
`.diff-btn-inactive {
            background: transparent;
        }
        .dark .diff-btn-inactive { color: #9ca3af; }
        :not(.dark) .diff-btn-inactive { color: #6b7280; }`);

// 8. Header classes and icons
const oldHeaderRegex = /<header[\s\S]*?<\/header>/;
const newHeader = `<header class="w-full flex items-center justify-between px-4 py-2.5 sticky top-0 z-50 border-b border-gray-200/60 dark:border-white/5 backdrop-blur-xl bg-white/80 dark:bg-[#12122b]/80 flex-shrink-0">
            <a href="../index.html" class="text-2xl md:text-3xl hover:scale-110 transition-transform cursor-pointer drop-shadow-md select-none" title="Ana Sayfa">🏠</a>
            <h1 class="neon-title">PIPS</h1>
            <button onclick="showHowToPlay()" class="text-2xl md:text-3xl hover:scale-110 transition-transform cursor-pointer drop-shadow-md select-none" title="Nasıl Oynanır">❓</button>
        </header>`;
html = html.replace(oldHeaderRegex, newHeader);

// 9. Controls wrapper
html = html.replace(/<div class="w-full flex flex-col items-center py-2 px-4 gap-1.5 flex-shrink-0">/, 
'<div class="w-full flex flex-col items-center py-2 px-4 gap-1.5 flex-shrink-0 bg-white dark:bg-[#181836] border-b border-gray-200/60 dark:border-white/5">');

// 10. Mode & diff buttons wrappers
html = html.replace(/<div class="flex bg-gray-800\/50 rounded-full p-0.5 border border-gray-700\/30">/, 
'<div class="flex bg-gray-100 dark:bg-gray-800/50 rounded-full p-0.5 border border-gray-300 dark:border-gray-700/30">');

// 11. Board wrapper
html = html.replace(/<div id="boardContainer" class="flex-1 flex items-center justify-center overflow-hidden w-full px-4 min-h-0">/, 
'<div id="boardContainer" class="flex-1 flex items-center justify-center overflow-hidden w-full px-4 min-h-0 bg-gray-50 dark:bg-[#0c0c1d]">');

// 12. Divider
html = html.replace(/<div class="border-t border-gray-700\/30"><\/div>/, 
'<div class="border-t border-gray-200/60 dark:border-white/5"></div>');
html = html.replace(/<div class="w-full px-8 flex-shrink-0">/, 
'<div class="w-full px-8 flex-shrink-0 bg-white dark:bg-[#181836]">');

// 13. Tray wrapper
html = html.replace(/<div class="w-full px-3 flex-shrink-0" style="min-height: 56px;">/, 
'<div class="w-full px-3 flex-shrink-0 bg-white dark:bg-[#181836]" style="min-height: 56px;">');

// 14. Action buttons
html = html.replace(/<div class="w-full flex justify-center gap-3 pb-3 px-4 flex-shrink-0">/, 
'<div class="w-full flex justify-center gap-3 pb-3 px-4 pt-2 flex-shrink-0 bg-white dark:bg-[#181836]">');
html = html.replace(/<button id="clearBtn" class="px-5 py-2 bg-gray-800\/50 hover:bg-gray-700\/50 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition-all duration-200 border border-gray-700\/30 active:scale-95">/g, 
'<button id="clearBtn" class="px-5 py-2 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs font-bold rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-700/30 active:scale-95">');
html = html.replace(/<button id="newGameBtn" class="px-5 py-2 bg-gray-800\/50 hover:bg-gray-700\/50 text-gray-300 hover:text-white text-xs font-bold rounded-xl transition-all duration-200 border border-gray-700\/30 active:scale-95">/g, 
'<button id="newGameBtn" class="px-5 py-2 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs font-bold rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-700/30 active:scale-95">');

// 15. Help Modal
html = html.replace(/<div class="bg-gray-900 border border-gray-700\/60 rounded-2xl max-w-sm w-full mx-4 p-5 modal-anim shadow-2xl max-h-\[85vh\] overflow-y-auto">/, 
'<div class="bg-white dark:bg-[#12122b] border border-gray-200 dark:border-gray-700/60 rounded-2xl max-w-sm w-full mx-4 p-5 modal-anim shadow-2xl max-h-[85vh] overflow-y-auto">');
html = html.replace(/<h2 class="text-lg font-extrabold mb-3 text-center tracking-wide">PIPS Nasıl Oynanır\?<\/h2>/, 
'<h2 class="text-lg font-extrabold mb-3 text-center tracking-wide text-gray-900 dark:text-white">PIPS Nasıl Oynanır?</h2>');
html = html.replace(/<div class="space-y-3 text-sm text-gray-300 leading-relaxed">/, 
'<div class="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">');
// fix font-bold text-white in help modal
html = html.replace(/class="font-bold text-white mb-1"/g, 'class="font-bold text-gray-900 dark:text-white mb-1"');
// fix bg-gray-800/50 in help modal
html = html.replace(/class="bg-gray-800\/50 rounded-lg p-2 flex items-center gap-2"/g, 'class="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-2 flex items-center gap-2"');

// 16. Win Modal
html = html.replace(/<div class="relative bg-\[#111827\] rounded-3xl max-w-sm w-full mx-4 p-1 modal-anim shadow-\[0_0_50px_rgba\(37,99,235,0\.2\)\]">/, 
'<div class="relative bg-white dark:bg-[#111827] rounded-3xl max-w-sm w-full mx-4 p-1 modal-anim shadow-xl dark:shadow-[0_0_50px_rgba(37,99,235,0.2)]">');
html = html.replace(/<div class="bg-\[#0f172a\] border border-white\/10 rounded-\[22px\] p-8 text-center relative overflow-hidden h-full">/, 
'<div class="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-[22px] p-8 text-center relative overflow-hidden h-full">');
html = html.replace(/<p class="text-gray-300 font-medium mb-8 text-sm">/, 
'<p class="text-gray-600 dark:text-gray-300 font-medium mb-8 text-sm">');

// 17. Already Played Modal
html = html.replace(/<div class="bg-gray-900 border border-gray-700\/60 rounded-2xl max-w-sm w-full mx-4 p-6 text-center modal-anim shadow-2xl">/, 
'<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/60 rounded-2xl max-w-sm w-full mx-4 p-6 text-center modal-anim shadow-2xl">');
html = html.replace(/<h2 class="text-xl font-bold mb-3 text-white">/, 
'<h2 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">');
html = html.replace(/<p class="text-gray-300 text-sm mb-6">/, 
'<p class="text-gray-600 dark:text-gray-300 text-sm mb-6">');

// Finally, the help button event listener was removed in the new header because we changed from id="helpBtn" to onclick="showHowToPlay()".
// I'll make sure showHowToPlay() exists or add it.
if (!html.includes('function showHowToPlay()')) {
    html = html.replace('function showHelpModal()', 'function showHowToPlay()');
}

fs.writeFileSync('pips.html', html, 'utf8');

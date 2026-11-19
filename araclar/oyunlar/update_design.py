import re

with open(r"c:\Users\mehme\Desktop\kelimearasi.com\oyunlar\sekizle.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Body
content = content.replace(
    '<body class="bg-[#0B0F17] text-white font-sans h-full flex flex-col">',
    '<body class="bg-gray-50 dark:bg-[#0c0c1d] text-gray-900 dark:text-gray-100 font-sans h-full flex flex-col">'
)

# 2. Header
content = content.replace(
    '<header class="flex items-center justify-between px-4 py-2 border-b border-slate-800/50 bg-[#0B0F17]/95 backdrop-blur-sm shrink-0 z-10">',
    '<header class="sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b backdrop-blur-xl bg-white/80 dark:bg-[#12122b]/80 border-gray-200/60 dark:border-white/5 shrink-0 z-10">'
)

content = content.replace(
    '<a href="../index.html" class="p-1.5 rounded-lg hover:bg-gray-800 transition-all hover:scale-110 text-2xl" title="Ana Sayfa">\n            🏠\n        </a>',
    '<a href="../index.html" class="text-2xl md:text-3xl hover:scale-110 transition-transform cursor-pointer drop-shadow-md select-none" title="Ana Sayfa">\n            🏠\n        </a>'
)

content = content.replace(
    '<button onclick="showHowToPlay()" class="p-1.5 rounded-lg hover:bg-gray-800 transition-all hover:scale-110 text-2xl" title="Nasıl Oynanır">\n            ❓\n        </button>',
    '<button onclick="showHowToPlay()" class="text-2xl md:text-3xl hover:scale-110 transition-transform cursor-pointer drop-shadow-md select-none" title="Nasıl Oynanır">\n            ❓\n        </button>'
)

# 3. Control Panel
content = content.replace(
    '<div class="flex flex-row items-center justify-center w-full max-w-lg mx-auto px-2 py-1 border-b border-slate-800/50 shrink-0 z-10">',
    '<div class="flex flex-row items-center justify-center w-full max-w-lg mx-auto px-2 py-1 border-b border-gray-200/60 dark:border-white/5 shrink-0 z-10">'
)

content = content.replace(
    'bg-[#151B2B]',
    'bg-white dark:bg-[#181836] shadow-sm'
)

# 4. Keyboard
content = content.replace(
    '<div id="keyboard" class="shrink-0 px-1 pb-1.5 pt-1 select-none z-10 bg-[#0B0F17]">',
    '<div id="keyboard" class="shrink-0 px-1 pb-1.5 pt-1 select-none z-10 bg-gray-50 dark:bg-[#0c0c1d]">'
)

# 5. Modals
content = content.replace(
    'bg-[#111827] border border-purple-500/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(168,85,247,0.15)] text-slate-100',
    'bg-white dark:bg-[#181836] border border-gray-200 dark:border-white/10 rounded-3xl p-5 shadow-[0_0_30px_rgba(168,85,247,0.15)] text-gray-900 dark:text-slate-100'
)
content = content.replace(
    'bg-[#111827] border border-purple-500/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] text-slate-100',
    'bg-white dark:bg-[#181836] border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.15)] text-gray-900 dark:text-slate-100'
)

# Replace other specific text colors inside modal manually if needed, or using CSS variables.
# For Help modal text
content = content.replace('text-gray-300', 'text-gray-700 dark:text-gray-300')
# We have a few 'text-white', need to be careful. 'strong class="text-white"'
content = content.replace('strong class="text-white"', 'strong class="text-gray-900 dark:text-white"')
content = content.replace('border-gray-700', 'border-gray-200 dark:border-gray-700')
content = content.replace('font-bold text-white', 'font-bold text-gray-900 dark:text-white')

# Also fix the header text for Modal:
content = content.replace('text-gray-200 tracking-wider', 'text-gray-900 dark:text-gray-200 tracking-wider')

# 6. CSS Styles modifications
css_replacements = {
    # .mini-tile
    r"\.mini-tile\s*\{[^}]*\}": """
        .mini-tile {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            text-transform: uppercase;
            border: 1px solid rgba(156, 163, 175, 0.4);
            background-color: rgba(243, 244, 246, 0.5);
            color: #111827;
            transition: border-color 0.1s, background-color 0.1s;
            user-select: none;
            line-height: 1;
        }
        .dark .mini-tile {
            border: 1px solid rgba(255, 255, 255, 0.05);
            background-color: rgba(30, 41, 59, 0.2);
            color: #f3f4f6;
        }
""".strip(),
    r"\.mini-tile\.filled\s*\{[^}]*\}": """
        .mini-tile.filled {
            border-color: #9ca3af;
        }
        .dark .mini-tile.filled {
            border-color: #475569;
        }
""".strip(),
    r"\.mini-tile\.correct\s*\{[^}]*\}": """
        .mini-tile.correct {
            background-color: #538d4e !important;
            border-color: #538d4e !important;
            color: white !important;
        }
""".strip(),
    r"\.mini-tile\.present\s*\{[^}]*\}": """
        .mini-tile.present {
            background-color: #b59f3b !important;
            border-color: #b59f3b !important;
            color: white !important;
        }
""".strip(),
    r"\.mini-tile\.absent\s*\{[^}]*\}": """
        .mini-tile.absent {
            background-color: #e5e7eb !important;
            border-color: #d1d5db !important;
            color: #6b7280 !important;
        }
        .dark .mini-tile.absent {
            background-color: #15152b !important;
            border-color: #1a1a35 !important;
            color: #64748b !important;
        }
""".strip(),
    r"\.mini-tile\.active-input\s*\{[^}]*\}": """
        .mini-tile.active-input {
            border-color: #6b7280;
        }
        .dark .mini-tile.active-input {
            border-color: #64748b;
        }
""".strip(),
    # .key-btn
    r"\.key-btn\s*\{[^}]*\}": """
        .key-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            user-select: none;
            transition: all 0.15s ease;
            background-color: #f3f4f6;
            color: #111827;
            -webkit-tap-highlight-color: transparent;
            position: relative;
            overflow: visible;
            gap: 1px;
        }
        .dark .key-btn {
            background-color: #1e1e36;
            color: #e2e8f0;
        }
""".strip(),
    r"\.key-indicator-dot\s*\{[^}]*\}": """
        .key-indicator-dot {
            width: 3.5px;
            height: 3.5px;
            border-radius: 1px;
            background-color: rgba(156, 163, 175, 0.5);
        }
        .dark .key-indicator-dot {
            background-color: rgba(71, 85, 105, 0.35);
        }
""".strip(),
    r"\.key-indicator-dot\.absent\s*\{[^}]*\}": """
        .key-indicator-dot.absent { background-color: #d1d5db; }
        .dark .key-indicator-dot.absent { background-color: #2a2a3a; }
""".strip(),
    r"\.key-btn\.dimmed\s*\{[^}]*\}": """
        .key-btn.dimmed {
            background-color: #e5e7eb !important;
            color: #9ca3af !important;
        }
        .dark .key-btn.dimmed {
            background-color: #15152b !important;
            color: #475569 !important;
        }
""".strip(),
    # .grid-container
    r"\.grid-container\s*\{[^}]*\}": """
        .grid-container {
            border: 1.5px solid rgba(209, 213, 219, 0.6);
            border-radius: 0.5rem;
            padding: 3px;
            background: #ffffff;
            transition: all 0.3s ease;
            position: relative;
            min-height: 0;
            overflow: visible;
            display: flex;
            flex-direction: column;
            margin-top: 8px;
        }
        .dark .grid-container {
            border-color: rgba(255, 255, 255, 0.05);
            background: #181836;
        }
""".strip(),
    r"\.grid-label\s*\{[^}]*\}": """
        .grid-label {
            position: absolute;
            top: -7px;
            left: 6px;
            font-size: 0.5rem;
            font-weight: 700;
            padding: 0 3px;
            background: #f9fafb;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            z-index: 2;
        }
        .dark .grid-label {
            background: #0c0c1d;
            color: #64748b;
        }
""".strip()
}

for pattern, repl in css_replacements.items():
    if pattern.startswith(r"\.mini-tile\s*"):
        content = re.sub(pattern, repl, content, count=1)
    else:
        content = re.sub(pattern, repl, content, flags=re.MULTILINE)

with open(r"c:\Users\mehme\Desktop\kelimearasi.com\oyunlar\sekizle.html", "w", encoding="utf-8") as f:
    f.write(content)

import re

with open(r"c:\Users\mehme\Desktop\kelimearasi.com\oyunlar\sekizle.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the mangled media query section entirely
mangled_media = re.search(r"@media \(min-width: 768px\).*?@media \(max-width: 767px\)[^<]*</style>", content, flags=re.DOTALL)
if mangled_media:
    correct_media = """@media (min-width: 768px) {
            .game-grid-layout {
                grid-template-columns: repeat(4, 1fr);
                grid-template-rows: repeat(2, 1fr);
                max-width: 720px;
            }
            .mini-tile {
                font-size: clamp(0.45rem, 1.2vw, 0.7rem);
            }
        }

        @media (max-width: 767px) {
            .game-grid-layout {
                grid-template-columns: repeat(2, 1fr);
                max-width: 380px;
            }
            .mini-tile {
                font-size: clamp(0.4rem, 2.8vw, 0.6rem);
            }
        }
    </style>"""
    
    content = content[:mangled_media.start()] + correct_media + content[mangled_media.end():]
    
    with open(r"c:\Users\mehme\Desktop\kelimearasi.com\oyunlar\sekizle.html", "w", encoding="utf-8") as f:
        f.write(content)

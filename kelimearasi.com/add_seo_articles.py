import os
import re

games = {
    'wordle': ('Sözcükle (Türkçe Wordle) Nedir?', 'Sözcükle, mantık yürüterek 6 denemede günün 5 harfli (veya 4/6 harfli) Türkçe kelimesini bulmaya çalıştığınız popüler Wordle oyununun yerli versiyonudur. Renk ipuçlarını takip ederek kelime dağarcığınızı test edebilir, günlük veya sınırsız modda beyin jimnastiği yapabilirsiniz.'),
    
    'ikile': ('İkile Oyunu Nedir?', 'İkile, aynı anda iki farklı gizli kelimeyi bulmaya çalıştığınız zorlu bir kelime tahmin bulmacasıdır. Her tahmininiz her iki kelime panosuna da işlenir. Stratejik kelimeler seçerek iki kelimeyi de en az hamlede çözmeye çalışın.'),
    
    'dortle': ('Dörtle Oyunu Nedir?', 'Dörtle, Wordle mantığını 4 katına çıkaran ileri seviye bir kelime zeka oyunudur. Tek bir tahminle aynı anda 4 farklı kelimedeki harfleri bulmaya çalışırsınız. Analitik düşünme ve kelime bilginizi aynı anda test eden harika bir beyin egzersizidir.'),
    
    'sekizle': ('Sekizle Oyunu Nedir?', 'Sekizle, tam 8 farklı kelimeyi aynı anda tahmin etmeye çalıştığınız ekstrem bir kelime bulmacasıdır. Yapacağınız her tahmin, 8 farklı panodaki harf eşleşmelerini gösterecek. Odaklanma ve kelime stratejinizi zirveye taşıyın.'),
    
    'kelime500': ('Kelime 500 Nedir?', 'Kelime 500, sadece kaç harfin doğru olduğunu ve kaç tanesinin doğru yerde olduğunu gösteren, renk ipucu vermeyen zorlayıcı bir kelime tahmin oyunudur. Mastermind benzeri bu bulmacada mantık yürüterek asıl kelimeyi bulmaya çalışırsınız.'),
    
    'tic_tac_word': ('Tic-Tak Kelime Nedir?', 'Tic-Tak Kelime, klasik XOX (Tic Tac Toe) oyunu ile kelime bulmacasının birleşimidir. Amacınız harfleri kullanarak sadece geçerli kelimeler üretmek ve panoda üçlü bir dizi oluşturarak rakibinizi yenmektir. Hem strateji hem kelime bilgisi gerektirir.'),
    
    'parolla': ('Kelime Çemberi (Parolla) Nedir?', 'Kelime Çemberi (Parolla), daire etrafında dizilmiş harflerin hepsini kullanarak anlamlı kelimeler türettiğiniz eğlenceli bir zeka oyunudur. Hem hızlı düşünmeli hem de geniş kelime haznenizi kullanmalısınız.'),
    
    'betweenle': ('Arasında (Betweenle) Nedir?', 'Arasında, alfabetik sıraya göre gizli kelimenin yerini bulmaya çalıştığınız sıra dışı bir kelime oyunudur. Yaptığınız tahmin gizli kelimeden önce mi yoksa sonra mı geliyor? Sözlük sırasını takip ederek doğru kelimeye ulaşın.'),
    
    'spelling_bee': ('Petek (Spelling Bee) Nedir?', 'Petek, ortadaki merkez harfi mutlaka kullanarak en az 4 harfli kelimeler türettiğiniz klasik bir kelime oyunudur. Tüm harfleri içeren "Pangram" kelimeyi bularak en yüksek puanı toplayın ve kelime dağarcığınızı geliştirin.'),
    
    'fruit_grids': ('Meyve Izgarası Nedir?', 'Meyve Izgarası, belirli mantık kurallarına ve ipuçlarına göre meyveleri ızgaraya doğru şekilde yerleştirdiğiniz bir zeka bulmacasıdır. Satır ve sütunlardaki kısıtlamaları hesaplayarak çözüme ulaşın.'),
    
    'slitherlink': ('Çit (Slitherlink) Nedir?', 'Slitherlink (Çit), noktalı bir ızgara üzerinde sayılara bakarak tek ve kesintisiz bir çizgi oluşturmaya çalıştığınız dünyaca ünlü bir mantık bulmacasıdır. Rakamlar, o karenin etrafından kaç çizgi geçmesi gerektiğini söyler.'),
    
    'shihaku': ('Dikdörtgenler (Shihaku) Nedir?', 'Shihaku, ızgaradaki sayıları içeren dikdörtgenler veya kareler çizerek tüm alanı doldurmaya çalıştığınız bir zeka oyunudur. Her bir sayının bulunduğu alanın toplam büyüklüğü, o sayıya eşit olmalıdır.'),
    
    'queens': ('Vezirler Nedir?', 'Vezirler, satrançtaki vezir taşının hareket kurallarına dayanan bir mantık oyunudur. Amacınız, hiçbir vezirin birbiriyle aynı satır, sütun veya köşegende olmayacağı şekilde onları ızgaraya yerleştirmektir.'),
    
    'sudoku': ('Sudoku Nedir?', 'Sudoku, 9x9 boyutundaki bir ızgarayı 1\'den 9\'a kadar rakamlarla, her satır, sütun ve 3x3\'lük alt karede tekrar etmeyecek şekilde doldurduğunuz klasik bir mantık bulmacasıdır. Sayısal zekayı ve odaklanmayı artırır.'),
    
    'nonogram': ('Kare Karalama (Nonogram) Nedir?', 'Nonogram, satır ve sütunların başındaki sayı ipuçlarına bakarak ızgaradaki belirli kareleri boyadığınız ve sonunda gizli bir resim oluşturduğunuz Japon mantık bulmacasıdır.'),
    
    'pips': ('Domino (Pips) Nedir?', 'Pips, verilen sayılara göre domino taşlarını ızgaraya doğru şekilde yerleştirdiğiniz bir eşleştirme ve mantık oyunudur. Görsel zekayı ve kombinasyon becerisini çalıştırır.')
}

directory = r'c:\Users\mehme\Desktop\kelimearasi.com\oyunlar'

for filename, (title, desc) in games.items():
    filepath = os.path.join(directory, f'{filename}.html')
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Pattern to match the "Nasıl Oynanır?" heading
    pattern = re.compile(r'(<h2[^>]*>Nas[ıi&#305;]+l\s+Oynan[ıi&#305;]+r\?\s*</h2>)', re.IGNORECASE)
    
    if 'seo-content-block' not in content:
        seo_html = f'''\\1
            <div class="seo-content-block mt-3 mb-4 p-4 bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/20 rounded-xl text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                <h3 class="font-bold text-violet-800 dark:text-violet-300 mb-1.5">{title}</h3>
                <p class="leading-relaxed">{desc}</p>
            </div>'''
            
        new_content = pattern.sub(seo_html, content, count=1)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
print("Makaleler Yardım Modal'ına Eklendi!")

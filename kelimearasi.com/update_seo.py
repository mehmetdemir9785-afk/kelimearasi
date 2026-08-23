import os
import re

games = {
    'wordle': ('Sözcükle (Türkçe Wordle) Oyna', 'Günlük Türkçe Wordle (Sözcükle) oyununu oyna. 6 denemede gizli kelimeyi bulabilecek misin? Hemen ücretsiz oyna!'),
    'ikile': ('İkile - İki Kelime Bulmaca', 'Aynı anda 2 gizli kelimeyi bulmaya çalış. İkile kelime oyunu ile zihnini test et. Ücretsiz oyna!'),
    'dortle': ('Dörtle - Dört Kelime Bulmaca', 'Aynı anda 4 gizli kelimeyi bulmaya çalış. Dörtle kelime oyunu ile sınırlarını zorla!'),
    'sekizle': ('Sekizle - Sekiz Kelime Bulmaca', 'Aynı anda 8 gizli kelimeyi tahmin et. En zorlu kelime oyunu Sekizle ile zekanı test et.'),
    'kelime500': ('Kelime 500 - Harf Tahmin Oyunu', 'Tahminlerinin kaç harfinin doğru olduğunu görerek gizli kelimeyi bul. Kelime 500 ile mantığını konuştur.'),
    'tic_tac_word': ('Tic-Tak Kelime - Strateji ve Kelime', 'Kelimelerle oynanan strateji oyunu Tic-Tak Kelime. XOX (Tic Tac Toe) mantığı ile kelime dağarcığını birleştir.'),
    'parolla': ('Kelime Çemberi (Parolla)', 'Harfleri sırayla takip et, çemberdeki tüm kelimeleri bil! Kelime Çemberi zeka oyunu oyna.'),
    'betweenle': ('Arasında - Doğru Kelimeyi Bul', 'İki kelime arasındaki doğru kelimeyi bul. Betweenle (Arasında) kelime bulmacası ile kelime hazneni genişlet.'),
    'spelling_bee': ('Petek (Spelling Bee) Türkçe', 'Merkezdeki harfi kullanarak kelime üret. Türkçe Spelling Bee (Petek) oyunu ile en uzun kelimeleri bul!'),
    'fruit_grids': ('Meyve Izgarası - Mantık Oyunu', 'Meyveleri ızgarada mantıkla sırala. Klasik mantık ve zeka bulmacası Meyve Izgarası oyna.'),
    'slitherlink': ('Çit (Slitherlink) Bulmacası', 'Sayılara göre kapalı bir döngü oluştur. Zihin açıcı Çit (Slitherlink) mantık oyunu oyna.'),
    'shihaku': ('Dikdörtgenler (Shihaku)', 'Sayıları içine alan dikdörtgenler çiz. Shihaku mantık bulmacası ile sayısal zekanı geliştir.'),
    'queens': ('Vezirler - Mantık Bulmacası', 'Vezirleri birbirini yemeyecek şekilde doğru yerlere yerleştir. Satranç tabanlı Vezirler mantık oyunu.'),
    'sudoku': ('Ücretsiz Sudoku Oyna', 'Klasik rakam yerleştirme bulmacası. Günlük veya sınırsız zorluk derecelerine sahip ücretsiz Sudoku oyna.'),
    'nonogram': ('Kare Karalama (Nonogram)', 'Sayı ipuçlarından gizli deseni ortaya çıkar. Zihin zorlayıcı Nonogram (Kare Karalama) oyna.'),
    'pips': ('Domino (Pips) Bulmacası', 'Domino taşlarını kullanarak ızgaradaki sayıları eşleştir. Pips mantık bulmacası ile pratik yap.')
}

directory = r'c:\Users\mehme\Desktop\kelimearasi.com\oyunlar'

for filename, (title, desc) in games.items():
    filepath = os.path.join(directory, f'{filename}.html')
    if not os.path.exists(filepath):
        print(f"Skipping {filename}, file not found.")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove existing title, description and canonical tags to prevent duplicates
    content = re.sub(r'<title>.*?</title>\s*', '', content, flags=re.IGNORECASE|re.DOTALL)
    content = re.sub(r'<meta\s+name="description".*?>\s*', '', content, flags=re.IGNORECASE)
    content = re.sub(r'<link\s+rel="canonical".*?>\s*', '', content, flags=re.IGNORECASE)

    seo_tags = f"""<title>{title} | Kelimearası</title>
    <meta name="description" content="{desc}">
    <link rel="canonical" href="https://kelimearasi.com/oyunlar/{filename}.html" />
"""
    
    # Check if <head> tag exists to insert after it
    if '<head>' in content:
        content = content.replace('<head>', f'<head>\n    {seo_tags}', 1)
    # Fallback to appending near top if <head> is somehow missing but meta charset is present
    elif '<meta charset="UTF-8">' in content:
        content = content.replace('<meta charset="UTF-8">', f'<meta charset="UTF-8">\n    {seo_tags}', 1)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Oyun sayfalarının SEO etiketleri başarıyla eklendi!")

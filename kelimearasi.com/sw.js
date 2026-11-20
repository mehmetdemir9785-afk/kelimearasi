/* Kelimearası service worker
   - Sayfalar (HTML): önce ağ, bağlantı yoksa son kopya  -> güncellemeler hemen gelir
   - Site dosyaları ve CDN (Tailwind, ikonlar, yazı tipi): önbellekten hızlı aç, arkada yenile
   - Reklam, analiz ve Supabase istekleri asla önbelleğe alınmaz */
const VERSION = 'ka-v1';
const CORE = [
    '/', '/index.html', '/manifest.webmanifest', '/favicon.svg',
    '/images/icon-192.png', '/images/icon-512.png',
];
const CDN_HOSTS = ['cdn.tailwindcss.com', 'unpkg.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];
// Oyunların çalışması için gereken dış kütüphaneler: ilk açılışta hazır olsun
const CDN_PRECACHE = [
    'https://cdn.tailwindcss.com/',
    'https://unpkg.com/lucide@latest',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
    'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap',
];

self.addEventListener('install', (e) => {
    e.waitUntil((async () => {
        const c = await caches.open(VERSION);
        await c.addAll(CORE);
        // Dış dosyalar: biri alınamazsa kurulum yine de tamamlanır
        await Promise.all(CDN_PRECACHE.map((u) =>
            fetch(u, { mode: 'no-cors' }).then((r) => c.put(u, r)).catch(() => {})));
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

function staleWhileRevalidate(req) {
    return caches.open(VERSION).then((cache) =>
        cache.match(req).then((hit) => {
            const net = fetch(req).then((res) => {
                if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
                return res;
            }).catch(() => hit);
            return hit || net;
        })
    );
}

function networkFirst(req) {
    return fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
    }).catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('/index.html'))
    );
}

self.addEventListener('fetch', (e) => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    if (url.origin === self.location.origin) {
        if (req.mode === 'navigate' || req.destination === 'document') { e.respondWith(networkFirst(req)); return; }
        if (url.pathname === '/sw.js') return;
        e.respondWith(staleWhileRevalidate(req));
        return;
    }
    if (CDN_HOSTS.includes(url.hostname)) { e.respondWith(staleWhileRevalidate(req)); return; }
    // diğer her şey (reklamlar, Supabase, Google) doğrudan ağa gider
});

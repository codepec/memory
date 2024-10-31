// service-worker.js

const CACHE_NAME = 'memory-game-cache-v1';
const CACHE_ASSETS = [
    '/', // Startseite
    'index.html', // Haupt-HTML-Datei
    'style.css', // Haupt-CSS-Datei
    'main.js', // Haupt-JavaScript-Datei
    'script.js',
];

// Dynamisch die Pfade für alle Bilder hinzufügen
for (let i = 1; i <= 2; i++) { // Angenommen, du hast nur 2 Ordner: img/1/ und img/2/
    for (let j = 1; j <= 8; j++) { // Angenommen, du hast bis zu 8 Bilder pro Ordner
        CACHE_ASSETS.push(`img/${i}/${j}.jpg`);
    }
}

// Wenn der Service Worker installiert wird, cache die Bilder
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CACHE_ASSETS);
        })
    );
});

// Wenn der Service Worker aktiviert wird, alte Caches entfernen
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

// Auf Fetch-Events reagieren
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

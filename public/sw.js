// Define a cache storage name string
const CACHE_NAME = 'iron-portal-cache-v1';

// Assets to cache immediately on installation for baseline performance
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/src/main.jsx',
    '/src/index.css',
    '/favicon.ico'
];

// 1. INSTALL EVENT: Pre-cache static shell assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Pre-caching core application shell assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. ACTIVATE EVENT: Clean up older cache versions safely
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing deprecated cache networks');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. FETCH EVENT: Intercept requests and serve from cache if offline
self.addEventListener('fetch', (event) => {
    // Only handle standard local network requests (skip firestore websockets and chrome extensions)
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});
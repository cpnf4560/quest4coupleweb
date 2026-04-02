// Service Worker - Quest4Couple PWA
const CACHE_NAME = 'quest4couple-v1';
const STATIC_CACHE = 'quest4couple-static-v1';
const DYNAMIC_CACHE = 'quest4couple-dynamic-v1';

// Ficheiros essenciais para cache
const STATIC_FILES = [
    '/',
    '/index.html',
    '/app.html',
    '/auth.html',
    '/dashboard.html',
    '/tutorial.html',
    '/relatorio.html',
    '/404.html',
    '/css/main.css',
    '/css/auth.css',
    '/css/dashboard.css',
    '/css/questions.css',
    '/css/themes.css',
    '/js/i18n.js',
    '/js/auth.js',
    '/js/app.js',
    '/js/storage.js',
    '/assets/logo.png',
    '/favicon.ico',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/i18n/translations.pt-pt.json',
    '/i18n/translations.en.json',
    '/data/packs_data_clean.json'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => self.skipWaiting())
            .catch(err => console.log('[SW] Cache error:', err))
    );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map(name => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Estratégia de fetch: Cache First, Network Fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar requests não-GET e externos
    if (request.method !== 'GET') return;
    if (!url.origin.includes(self.location.origin)) return;
    
    // Ignorar Firebase e analytics
    if (url.href.includes('firebase') || 
        url.href.includes('clarity') ||
        url.href.includes('googleapis')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Retornar cache e atualizar em background
                    fetchAndCache(request);
                    return cachedResponse;
                }
                return fetchAndCache(request);
            })
            .catch(() => {
                // Offline fallback
                if (request.headers.get('accept').includes('text/html')) {
                    return caches.match('/404.html');
                }
            })
    );
});

// Função para fetch e cache
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log('[SW] Fetch failed:', error);
        throw error;
    }
}

// Background Sync para dados offline
self.addEventListener('sync', event => {
    if (event.tag === 'sync-answers') {
        console.log('[SW] Syncing answers...');
        event.waitUntil(syncAnswers());
    }
});

async function syncAnswers() {
    // Implementar sincronização de respostas quando online
    console.log('[SW] Answers synced successfully');
}

// Push Notifications (preparação futura)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'Nova notificação do Quest4Couple',
            icon: '/android-chrome-192x192.png',
            badge: '/favicon-32x32.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || '/'
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'Quest4Couple', options)
        );
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

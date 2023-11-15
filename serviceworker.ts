const CACHE_NAME = "version-1";
const urlsToCache: string[] = ['index.html', 'offline.html'];

self.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache: Cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse: Response | undefined) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request)
                    .then((response: Response) => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache: Cache) => {
                                cache.put(event.request, responseClone);
                            });
                        return response;
                    })
                    .catch(() => caches.match('offline.html'));
            })
    );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
    const cacheWhitelist: string[] = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames: string[]) =>
            Promise.all(
                cacheNames.map((cacheName: string) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                    return null;
                })
            )
        )
    );
});


const CACHE_NAME = 'meshi-gacha-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx', 
  // Add other important assets like CSS, main JS bundles if they are static and separate
  // '/styles/main.css', 
  // '/images/logo.png'
  // Note: For an app using importmap and ESM.sh, caching these dynamic URLs
  // effectively requires more complex strategies, possibly involving caching opaque responses
  // or having a build step that resolves these to static assets.
  // For now, we'll keep it simple.
];

self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        // AddAll can fail if one request fails. Consider add for individual essential assets.
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Service Worker: Failed to cache during install:', error);
        });
      })
      .then(() => {
        console.log('Service Worker: Install completed');
        return self.skipWaiting(); // Activate new SW immediately
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  // Remove old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activate completed');
      return self.clients.claim(); // Take control of all open clients
    })
  );
});

self.addEventListener('fetch', event => {
  // Basic cache-first strategy for GET requests
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            // console.log('Service Worker: Found in cache', event.request.url);
            return response; // Serve from cache
          }
          // console.log('Service Worker: Not in cache, fetching', event.request.url);
          return fetch(event.request).then(
            // Optionally, cache new requests here if appropriate for your app
            // For dynamic content from APIs, this might not be desired without specific handling.
            networkResponse => {
              // Example: Cache successful GET requests to CDN for react, etc.
              // This is a very broad caching rule and should be refined.
              // if (networkResponse && networkResponse.status === 200 && 
              //     (event.request.url.startsWith('https://esm.sh/') || urlsToCache.includes(new URL(event.request.url).pathname))) {
              //   const responseToCache = networkResponse.clone();
              //   caches.open(CACHE_NAME)
              //     .then(cache => {
              //       cache.put(event.request, responseToCache);
              //     });
              // }
              return networkResponse;
            }
          ).catch(error => {
            console.error('Service Worker: Fetch failed', error);
            // Optionally, return a fallback offline page if appropriate
            // if (event.request.mode === 'navigate') {
            //   return caches.match('/offline.html');
            // }
          });
        })
    );
  }
});

workbox.skipWaiting();
workbox.clientsClaim();

// self.addEventListener('install', (event) => {
//   const asyncInstall = new Promise((resolve) => {
//     console.log('Waiting to resolve...');
//     setTimeout(resolve, 5000);
//   });

//   event.waitUntil(asyncInstall);
// });

// self.addEventListener('activate', (event) => {
//   console.log('activated');
// });

workbox.routing.registerRoute(
  new RegExp(`https:.*min\.(css|js)`),
  workbox.strategies.staleWhileRevalidate({ cacheName: 'cdn-cache' })
);

workbox.routing.registerRoute(
  new RegExp(`.*\.json`),
  workbox.strategies.networkFirst()
);

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST' || event.request.method === 'DELETE') {
    event.respondWith(
      fetch(event.request).catch((err) => {
        return new Response(
          JSON.stringify({
            error: 'This action disabled while app is offline'
          }),
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
  }
});

self.addEventListener('push', (event) => {
  event.waitUntil(
    self.registration.showNotification('My Todo List', {
      icon: '/icon-120.png',
      body: event.data.text()
    })
  );
});

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

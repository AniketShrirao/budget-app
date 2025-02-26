import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache static resources
precacheAndRoute(self.__WB_MANIFEST);

// Cache Supabase API requests
registerRoute(
  ({ url }) => url.origin === 'https://bhuwkdzcuyydqponxssf.supabase.co',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      })
    ]
  })
);

// Cache static assets
registerRoute(
  ({ request }) => 
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image',
  new CacheFirst({
    cacheName: 'static-assets'
  })
);

// Offline fallback
self.addEventListener('install', (event) => {
  const offlinePage = new Response(
    'You are offline. Please check your internet connection.',
    {
      headers: { 'Content-Type': 'text/html' }
    }
  );
  event.waitUntil(
    caches.open('offline').then(cache => cache.put('/offline.html', offlinePage))
  );
});
// Handle push notifications
self.addEventListener('push', (event) => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const iconPrefix = isDarkMode ? 'dark' : 'light';
  
  const options = {
    body: event.data.text(),
    icon: `/icons/icon-${iconPrefix}-192x192.png`,
    badge: `/icons/icon-${iconPrefix}-192x192.png`,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Budget Tracker', options)
  );
});
// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  const queue = await getQueueFromStorage();
  if (queue.length > 0) {
    try {
      for (const operation of queue) {
        await performSync(operation);
      }
      // Clear queue after successful sync
      await clearQueue();
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }
}

async function getQueueFromStorage() {
  const clients = await self.clients.matchAll();
  if (clients.length > 0) {
    const client = clients[0];
    return new Promise((resolve) => {
      client.postMessage({ type: 'GET_SYNC_QUEUE' });
      self.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_QUEUE') {
          resolve(event.data.queue);
        }
      });
    });
  }
  return [];
}
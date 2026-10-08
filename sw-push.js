self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'flowbrain', {
      body: data.body || '',
      icon: '/flowbrain/icons/icon-192.png',
      badge: '/flowbrain/icons/icon-192.png',
      tag: data.tag || 'flowbrain',
      data: data.data || {},
      vibrate: [200, 100, 200],
      actions: [
        { action: 'done', title: '\u2713 Done' },
        { action: 'snooze', title: '\ud83d\udca4 Snooze' }
      ]
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(cs => {
      if (cs.length > 0) { cs[0].focus(); return; }
      return clients.openWindow('/flowbrain/');
    })
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

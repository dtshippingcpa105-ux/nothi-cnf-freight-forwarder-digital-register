// সার্ভিস ওয়ার্কার: অ্যাপ ইনস্টল ও অফলাইনে খোলার জন্য। পেজ সবসময় আগে ইন্টারনেট থেকে নেয় (যাতে নতুন সংস্করণ পেতে সমস্যা না হয়)।
const CACHE = 'cpa-register-v1';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;   // Firebase ও বাইরের অনুরোধ সরাসরি যাবে
  e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); return res; })
    .catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
});

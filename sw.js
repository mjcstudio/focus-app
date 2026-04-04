const CACHE='focus-v12';
const ASSETS=[
  '/focus-app/app.html',
  '/focus-app/manifest.json',
  '/focus-app/icon-192.png',
  '/focus-app/icon-512.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('firebase')||e.request.url.includes('googleapis')||e.request.url.includes('gstatic')||e.request.url.includes('cdnjs')){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(resp=>{
      if(resp&&resp.status===200){const clone=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));}
      return resp;
    });
  }));
});

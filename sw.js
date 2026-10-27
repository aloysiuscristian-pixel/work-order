const V='ahass-v3',SHELL=['./','index.html','frontdesk.html','manifest-index.json','manifest-frontdesk.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Stale-while-revalidate: buka instan dari cache, perbarui di latar belakang.
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return; // GitHub API dll. tidak disentuh
 e.respondWith((async()=>{
  const c=await caches.open(V);
  const hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  return (await net)||(r.mode==='navigate'?c.match('index.html'):Response.error());
 })());
});

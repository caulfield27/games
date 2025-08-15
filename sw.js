const CACHE_NAME = "pwa_cache_v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/memory-game.html",
    "/minesweeper.html",
    "/battleship.html",
    "/assets/logo192x192.png",
    "/assetslogo512x512.png"
];


self.addEventListener("install", (event) =>{
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache)=>{
            return cache.addAll(urlsToCache)
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(response =>{
            if(response){
                return response;
            };

            return fetch(event.request).then(newRequest =>{
                return caches.open(CACHE_NAME).then(cach=>{
                    cach.put(event.request, newRequest.clone());
                    return newRequest
                })
            })
        }).catch(()=>{
            return new Response("Оффлайн: соеденение потеряно")
        })
    )
})

self.addEventListener("activate")
const CACHE_NAME = "facilito-v1"
const cache_urls = [
										"/offline/view.html",
										"/offline/style.css",
										"/offline/map.png"
										]


self.addEventListener("install",function(ev){
	console.log("Instalando")
	caches.open(CACHE_NAME)
				.then(function(cache){
					console.log("Cache opened")
					return cache.addAll(cache_urls)
				})
})

self.addEventListener("activate",function(ev){
	ev.waitUntil(
		caches.keys().then(function(cache_names){
			return Promise.all(
				cache_names.map(function(cache_name){
					if(CACHE_NAME !== cache_name){
						return caches.delete(cache_name)
					}
				})
			)
		})
	)
})

self.addEventListener("fetch",function(ev){
	ev.respondWith(
		caches.match(ev.request)
					.then(function(response){
						if(response){
							console.log("Estoy en el cache y te ahorre una peticion")
							return response //Devolviendo del cache
						}
						return fetch(ev.request)
					}).catch(function(err){
						if(ev.request.mode == "navigate"){
							return caches.match("/offline/view.html")
						}
					})
	)
})



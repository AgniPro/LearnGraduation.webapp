var cacheAll = false;
var CACHE_NAME = 'webapk-cache';
var urlsToCache = [
	'https://learngraduation.blogspot.com/',
	'https://1.bp.blogspot.com/-tdKcjuPBzzk/YKO4BVVNIFI/AAAAAAAACXM/ZcW2I4Pr_701MB4J-4HDj8p9uo56Srn8gCLcBGAsYHQ/s250/learngraduationlogo.webp',
	'https://1.bp.blogspot.com/-tdKcjuPBzzk/YKO4BVVNIFI/AAAAAAAACXM/ZcW2I4Pr_701MB4J-4HDj8p9uo56Srn8gCLcBGAsYHQ/s250/learngraduationlogo.webp',
	'https://learngraduation.blogspot.com/p/about-me.html',
	'https://learngraduation.blogspot.com/p/contact.html',
];
var urlsNotToCache = [
];

// Install Event
self.addEventListener('install', function(event) {
	console.log("[SW] install event: ",event);
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME).then(
			function(cache) {
				console.log('[SW] Opened cache: ',cache);
				return cache.addAll(urlsToCache);
			}
		)
	);
});


// Fetch Event
self.addEventListener('fetch', function(event) {
	console.log("[SW] fetch event: ",event);
	event.respondWith(
		caches.match(event.request).then(
			function(response) {
				if (response) return response;
				else if (!cacheAll || urlsNotToCache.indexOf(event.request) !== -1) return fetch(event.request);
				else {
					fetch(event.request).then(
						function(response) {
							if(!response || response.status !== 200 || response.type !== 'basic') return response;
							var responseToCache = response.clone();
							caches.open(CACHE_NAME).then(
								function(cache) {
									cache.put(event.request, responseToCache);
								}
							);
							return response;
						}
					);
				}
			}
		)
	);
});


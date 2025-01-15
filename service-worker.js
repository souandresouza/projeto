const CACHE_NAME = 'meu-site-cache-v4'; // Atualize o nome do cache para forçar uma nova instalação
const urlsToCache = [
  '/',
  '/index.html', // Página inicial
  '/clima.html', // Página do clima
  '/offline.html', // Página de fallback offline
  '/icons/icon-192x192.png', // Ícone PWA
  '/icons/icon-512x512.png', // Ícone PWA
  'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' // Som de alarme padrão
];

// Instala o Service Worker e armazena os recursos em cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Força o Service Worker a se tornar ativo imediatamente
  );
});

// Ativa o Service Worker e remove caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Remove caches antigos
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle de todas as páginas
  );
});

// Intercepta as solicitações de rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna o recurso do cache se estiver disponível
        if (response) {
          return response;
        }

        // Se a solicitação for uma navegação (HTML), tente buscar da rede ou servir a página offline
        if (event.request.mode === 'navigate') {
          return fetch(event.request)
            .then((networkResponse) => {
              // Se a resposta da rede for válida, armazene-a no cache e retorne
              if (networkResponse && networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, responseToCache));
              }
              return networkResponse;
            })
            .catch(() => {
              // Se a rede falhar, sirva a página offline
              return caches.match('/offline.html');
            });
        }

        // Para outras solicitações (CSS, JS, imagens, etc.), tente buscar da rede
        return fetch(event.request)
          .then((networkResponse) => {
            // Armazene a resposta no cache para uso futuro
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            // Se a rede falhar e o recurso não estiver no cache, retorne uma resposta padrão
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain' })
            });
          });
      })
  );
});
const CACHE_NAME = 'meu-site-cache-v6'; // Atualize o nome do cache para forçar uma nova instalação
const OFFLINE_PAGE = '/offline.html'; // Página de fallback offline
const urlsToCache = [
  '/',
  '/index.html', // Página principal
  '/pages/clima.html', // Página do clima
  '/pages/configuracoes.html', // Página de configurações
  OFFLINE_PAGE, // Página de fallback offline
  '/assets/icons/icon-192x192.png', // Ícone PWA
  '/assets/icons/icon-512x512.png', // Ícone PWA
  '/assets/sounds/contagem.mp3', // Som de alarme
  '/assets/sounds/test_tone.mp3' // Som de teste
];

// Instala o Service Worker e armazena os recursos em cache
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Armazenando recursos em cache:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Força o Service Worker a se tornar ativo imediatamente
  );
});

// Ativa o Service Worker e remove caches antigos
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado:', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName); // Remove caches antigos
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle de todas as páginas
  );
});

// Intercepta as solicitações de rede
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  console.log('Interceptando solicitação:', requestUrl.pathname);

  // Estratégia para páginas HTML: Network First, com fallback para o cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(OFFLINE_PAGE);
        })
    );
  }

  // Estratégia para recursos estáticos: Cache First, com fallback para a rede
  else if (urlsToCache.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, responseToCache));
              }
              return networkResponse;
            })
            .catch(() => {
              return new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({ 'Content-Type': 'text/plain' })
              });
            });
        })
    );
  }

  // Para outras solicitações, tenta buscar da rede
  else {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        })
    );
  }
});

// Atualiza o cache quando solicitado
self.addEventListener('message', (event) => {
  if (event.data === 'updateCache') {
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => console.log('Cache atualizado com sucesso.'))
      .catch((error) => console.error('Erro ao atualizar o cache:', error));
  }
});

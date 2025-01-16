// Importa e inicializa os componentes
import { initializeClock } from './clock.js';
import { initializeCountdown } from './countdown.js';
import { initializeWeather } from './weather.js';
import { initializePermissions } from './permissions.js';

// Função principal que inicializa tudo
async function initializeApp() {
  console.log('Inicializando aplicação...');
  try {
    initializePermissions();
    console.log('Permissões inicializadas.');

    initializeClock();
    console.log('Relógio inicializado.');

    initializeCountdown();
    console.log('Contagem regressiva inicializada.');

    await initializeWeather(); // Aguarda a conclusão da inicialização do clima
    console.log('Clima inicializado.');
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
    alert('Ocorreu um erro ao carregar a aplicação. Por favor, recarregue a página.');
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);

// Função para limpar recursos ao fechar a página (opcional)
function cleanupApp() {
  // Exemplo: Limpar intervalos do relógio e contagem regressiva
  clearInterval(clockInterval);
  clearInterval(countdownInterval);
}

window.addEventListener('beforeunload', cleanupApp);
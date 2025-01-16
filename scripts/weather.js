const apiKey = 'e7314838ebd86431d951d53c59e7fd20'; // Substitua pela sua chave da OpenWeatherMap
const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutos em milissegundos

// Função para buscar a previsão do tempo
async function fetchWeather(city = 'São Paulo') {
  console.log(`Buscando clima para: ${city}`);
  const weatherContainer = document.getElementById('weather-container');
  weatherContainer.innerHTML = '<p>Carregando...</p>'; // Exibe mensagem de carregamento

  const cachedData = localStorage.getItem(`weather-${city}`);
  const cachedTimestamp = localStorage.getItem(`weather-${city}-timestamp`);

  if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp < CACHE_EXPIRATION)) {
    console.log('Usando dados do cache.');
    updateWeatherInfo(JSON.parse(cachedData));
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Dados do clima recebidos:', data);

    if (data.cod === 200) {
      localStorage.setItem(`weather-${city}`, JSON.stringify(data));
      localStorage.setItem(`weather-${city}-timestamp`, Date.now());
      updateWeatherInfo(data);
    } else {
      console.error('Erro na API:', data.message);
      weatherContainer.innerHTML = `<p>Erro: ${data.message}</p>`;
    }
  } catch (error) {
    console.error('Erro ao buscar dados do clima:', error);
    weatherContainer.innerHTML = '<p>Erro ao buscar dados do clima.</p>';
  }
}

// Função para atualizar as informações do clima
function updateWeatherInfo(data) {
  document.getElementById('weather-location').textContent = `Localização: ${data.name}, ${data.sys.country}`;
  document.getElementById('weather-temp').textContent = `Temperatura: ${data.main.temp}°C`;
  document.getElementById('weather-condition').textContent = `Condição: ${data.weather[0].description}`;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Inicializa a seção de clima
export function initializeWeather() {
  fetchWeather(); // Busca o clima ao carregar a página
  document.getElementById('fetch-weather').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) {
      fetchWeather(city);
    } else {
      alert('Por favor, insira o nome de uma cidade.');
    }
  });
}
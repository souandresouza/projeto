// Variáveis globais
let clockInterval;
let countdownInterval;
let startDate; // Armazena o tempo inicial do contador
const countdownKey = 'countdownTarget'; // Chave para armazenar a data/hora alvo

// Função para alternar o menu suspenso
function toggleMenu() {
  const menuDropdown = document.getElementById('menu-dropdown');
  menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
}

// Fechar o menu ao clicar fora dele
window.onclick = function (event) {
  if (!event.target.matches('.menu-icon') && !event.target.closest('.menu-dropdown')) {
    const menuDropdown = document.getElementById('menu-dropdown');
    if (menuDropdown.style.display === 'block') {
      menuDropdown.style.display = 'none';
    }
  }
};

// Função para formatar a data no formato desejado
function formatDate(date) {
  const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Calcula o dia do ano
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}.<br>O ${dayOfYear}º dia do ano.`;
}

// Funções do Relógio
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

let lastTime = '';
let lastDate = '';

function updateClock() {
  const now = new Date();
  const time = formatTime(now);
  const date = formatDate(now);

  if (time !== lastTime) {
    document.getElementById('current-time').textContent = time;
    lastTime = time;
  }

  if (date !== lastDate) {
    document.getElementById('current-date').innerHTML = date; // Usamos innerHTML para renderizar a quebra de linha
    lastDate = date;
  }
}

function initializeClock() {
  updateClock(); // Atualiza imediatamente
  clockInterval = setInterval(updateClock, 1000); // Armazena o ID do intervalo
}

// Função para atualizar os rótulos (singular/plural)
function updateLabels(days, hours, minutes, seconds) {
  document.getElementById('days-label').textContent = days === 1 ? 'Dia' : 'Dias';
  document.getElementById('hours-label').textContent = hours === 1 ? 'Hora' : 'Horas';
  document.getElementById('minutes-label').textContent = minutes === 1 ? 'Minuto' : 'Minutos';
  document.getElementById('seconds-label').textContent = seconds === 1 ? 'Segundo' : 'Segundos';
}

// Funções do Contador Regressivo
function isValidDateTime(dateTime) {
  const now = new Date();
  const targetDate = new Date(dateTime);
  return targetDate > now && !isNaN(targetDate.getTime());
}

function calculateTimeDifference(targetDate) {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, distance };
}

function updateCountdown(targetDate) {
  const { days, hours, minutes, seconds, distance } = calculateTimeDifference(targetDate);

  if (distance < 0) {
    clearInterval(countdownInterval);
    document.getElementById('timeout-message').style.display = 'block'; // Exibe a mensagem
    showNotification(); // Mostra notificação
    resetCountdown(); // Reinicia automaticamente
    return;
  }

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;

  // Atualiza os rótulos para singular ou plural
  updateLabels(days, hours, minutes, seconds);
}

function startCountdown() {
  const targetDate = new Date(document.getElementById('datetime').value).getTime();
  startDate = new Date().getTime(); // Define o tempo inicial

  if (!isValidDateTime(document.getElementById('datetime').value)) {
    alert('Por favor, insira uma data e hora válida e futura.');
    return;
  }

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => updateCountdown(targetDate), 1000);
}

function resetCountdown() {
  clearInterval(countdownInterval);
  document.getElementById('days').textContent = '0';
  document.getElementById('hours').textContent = '0';
  document.getElementById('minutes').textContent = '0';
  document.getElementById('seconds').textContent = '0';
  document.getElementById('timeout-message').style.display = 'none'; // Oculta a mensagem
  updateLabels(0, 0, 0, 0); // Atualiza os rótulos para plural
  localStorage.removeItem(countdownKey); // Remove a data/hora salva
}

// Função para salvar a data/hora alvo no localStorage
function saveCountdown() {
  const targetDate = document.getElementById('datetime').value;
  if (!targetDate) {
    alert('Por favor, insira uma data/hora válida.');
    return;
  }

  localStorage.setItem(countdownKey, targetDate);
  alert('Contagem regressiva salva com sucesso!');
}

// Função para carregar a data/hora alvo salva
function loadCountdown() {
  const savedTargetDate = localStorage.getItem(countdownKey);
  if (savedTargetDate) {
    document.getElementById('datetime').value = savedTargetDate;
    startCountdown(); // Inicia a contagem regressiva automaticamente
  }
}

// Notificações Push
function showNotification() {
  if (Notification.permission === 'granted') {
    new Notification('Tempo Esgotado!', {
      body: 'A contagem regressiva chegou ao fim.',
      icon: 'assets/icons/icon-192x192.png',
    });
  }
}

// Inicializa o relógio e carrega a contagem regressiva salva
initializeClock();
loadCountdown();

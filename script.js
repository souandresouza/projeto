let clockInterval;
let countdownInterval;

// Função para formatar a hora
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Função para calcular o número do dia no ano
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Função para obter o nome do dia da semana
function getWeekdayName(date) {
  const weekdays = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  return weekdays[date.getDay()];
}

// Função para obter a hora precisa da WorldTimeAPI
async function fetchPreciseTime() {
  try {
    const response = await fetch('http://worldtimeapi.org/api/timezone/America/Sao_Paulo');
    const data = await response.json();
    return new Date(data.datetime); // Horário preciso da API
  } catch (error) {
    console.error('Erro ao obter hora precisa:', error);
    return new Date(); // Fallback para o horário local do navegador
  }
}

// Função para atualizar o relógio
async function updateClock() {
  const now = await fetchPreciseTime();
  const time = formatTime(now);
  const date = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const dayOfYear = getDayOfYear(now);
  const weekdayName = getWeekdayName(now);
  const additionalInfo = `Hoje é ${weekdayName}, ${dayOfYear}º dia do ano`;
  document.getElementById('current-time').textContent = time;
  document.getElementById('current-date').textContent = date;
  document.getElementById('additional-info').textContent = additionalInfo;
}

// Função para atualizar a contagem regressiva
function updateCountdown(targetDate) {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    clearInterval(countdownInterval);
    document.getElementById('timeout-message').style.display = 'block';
    localStorage.removeItem('countdownTarget');

    // Tocar o áudio quando a contagem regressiva terminar
    const audio = new Audio('https://github.com/souandresouza/count-clock/raw/refs/heads/main/assets/sounds/contagem.mp3');
    audio.play().catch(error => {
      console.error('Erro ao reproduzir o áudio:', error);
    });

    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

// Função para iniciar a contagem regressiva
function startCountdown() {
  const targetDateInput = document.getElementById('datetime').value;
  if (!targetDateInput) {
    alert('Por favor, insira uma data válida.');
    return;
  }
  const targetDate = new Date(targetDateInput).getTime();
  const now = new Date().getTime();

  if (isNaN(targetDate) || targetDate <= now) {
    alert('Por favor, insira uma data futura.');
    return;
  }

  localStorage.setItem('countdownTarget', targetDate);
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => updateCountdown(targetDate), 1000);
}

// Função para reiniciar a contagem regressiva
function resetCountdown() {
  clearInterval(countdownInterval);
  document.getElementById('days').textContent = '0';
  document.getElementById('hours').textContent = '0';
  document.getElementById('minutes').textContent = '0';
  document.getElementById('seconds').textContent = '0';
  document.getElementById('timeout-message').style.display = 'none';
  localStorage.removeItem('countdownTarget');
}

// Função para restaurar a contagem regressiva salva
function restoreCountdown() {
  const savedTargetDate = localStorage.getItem('countdownTarget');
  if (savedTargetDate) {
    const targetDate = parseInt(savedTargetDate, 10);
    const now = new Date().getTime();
    if (targetDate > now) {
      countdownInterval = setInterval(() => updateCountdown(targetDate), 1000);
    } else {
      localStorage.removeItem('countdownTarget');
    }
  }
}

// Função para alternar o menu hamburguer
document.getElementById('menu-icon').addEventListener('click', () => {
  const menu = document.getElementById('menu');
  if (menu.style.display === 'block') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'block';
  }
});

// Inicializa o relógio
async function initializeClock() {
  await updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

// Event listeners para os botões
document.getElementById('start-countdown').addEventListener('click', startCountdown);
document.getElementById('reset-countdown').addEventListener('click', resetCountdown);

// Inicia o relógio e restaura a contagem regressiva
initializeClock();
restoreCountdown();

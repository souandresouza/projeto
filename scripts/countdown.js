let countdownInterval;

function updateCountdown(targetDate) {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance < 0) {
    clearInterval(countdownInterval);
    document.getElementById('timeout-message').style.display = 'block'; // Exibe a mensagem
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

export function startCountdown() {
  console.log('Iniciando contagem regressiva...');
  const targetDate = new Date(document.getElementById('datetime').value).getTime();
  const now = new Date().getTime();

  if (isNaN(targetDate)) {
    console.error('Data inválida.');
    alert('Por favor, insira uma data válida.');
    return;
  }

  if (targetDate <= now) {
    console.error('Data no passado.');
    alert('Por favor, insira uma data futura.');
    return;
  }

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => updateCountdown(targetDate), 1000);
}

export function resetCountdown() {
  clearInterval(countdownInterval);
  document.getElementById('days').textContent = '0';
  document.getElementById('hours').textContent = '0';
  document.getElementById('minutes').textContent = '0';
  document.getElementById('seconds').textContent = '0';
  document.getElementById('timeout-message').style.display = 'none'; // Oculta a mensagem
}

export function initializeCountdown() {
  document.getElementById('start-countdown').addEventListener('click', startCountdown);
}
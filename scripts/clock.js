let clockInterval;

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

let lastTime = '';
let lastDate = '';

function updateClock() {
  console.log('Atualizando relógio...');
  const now = new Date();
  const time = formatTime(now);
  const date = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  if (time !== lastTime) {
    document.getElementById('current-time').textContent = time;
    lastTime = time;
  }

  if (date !== lastDate) {
    document.getElementById('current-date').textContent = date;
    lastDate = date;
  }
}

export function initializeClock() {
  updateClock(); // Atualiza imediatamente
  clockInterval = setInterval(updateClock, 1000); // Armazena o ID do intervalo
}

export function stopClock() {
  clearInterval(clockInterval); // Limpa o intervalo
}
const permissionsKey = 'permissions';

function savePermission(key, value) {
  const permissions = JSON.parse(localStorage.getItem(permissionsKey)) || {};
  permissions[key] = value;
  localStorage.setItem(permissionsKey, JSON.stringify(permissions));
}

export function loadPermissions() {
  const permissions = JSON.parse(localStorage.getItem(permissionsKey)) || {};
  if (permissions.notifications) {
    document.getElementById('allow-notifications').style.display = 'none';
  }
  if (permissions.vibration) {
    document.getElementById('allow-vibration').style.display = 'none';
  }
  if (permissions.sound) {
    document.getElementById('allow-sound').style.display = 'none';
  }
}

export function initializePermissions() {
  console.log('Inicializando permissões...');
  loadPermissions();

  if ('Notification' in window) {
    console.log('Notificações suportadas.');
    document.getElementById('allow-notifications').addEventListener('click', () => {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notificações permitidas.');
          savePermission('notifications', true);
          document.getElementById('allow-notifications').style.display = 'none';
        }
      });
    });
  } else {
    console.log('Notificações não suportadas.');
    document.getElementById('allow-notifications').style.display = 'none';
  }

  if ('vibrate' in navigator) {
    console.log('Vibração suportada.');
    document.getElementById('allow-vibration').addEventListener('click', () => {
      navigator.vibrate(200);
      savePermission('vibration', true);
      document.getElementById('allow-vibration').style.display = 'none';
    });
  } else {
    console.log('Vibração não suportada.');
    document.getElementById('allow-vibration').style.display = 'none';
  }

  if ('Audio' in window) {
    console.log('Áudio suportado.');
    document.getElementById('allow-sound').addEventListener('click', () => {
      const audio = new Audio('assets/sounds/beep.mp3');
      audio.play()
        .then(() => {
          savePermission('sound', true);
          document.getElementById('allow-sound').style.display = 'none';
        })
        .catch((error) => {
          console.error('Erro ao reproduzir o som:', error);
          alert('Erro ao reproduzir o som. Verifique se o arquivo de áudio existe.');
        });
    });
  } else {
    console.log('Áudio não suportado.');
    document.getElementById('allow-sound').style.display = 'none';
  }
}

export function clearPermissions() {
  localStorage.removeItem(permissionsKey);
  console.log('Permissões limpas.');
}
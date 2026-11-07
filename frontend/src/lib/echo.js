import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const key = import.meta.env.VITE_REVERB_APP_KEY;

if (!key) {
  console.error('VITE_REVERB_APP_KEY is missing from .env');
}

console.log('🔑 KEY:', import.meta.env.VITE_REVERB_APP_KEY);
console.log('🌐 HOST:', import.meta.env.VITE_REVERB_HOST);
console.log('🔌 PORT:', import.meta.env.VITE_REVERB_PORT);
console.log('📡 SCHEME:', import.meta.env.VITE_REVERB_SCHEME);

const echo = new Echo({
  broadcaster: 'reverb',
  key,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
  authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      Accept: 'application/json',
    },
  },
});

export default echo;
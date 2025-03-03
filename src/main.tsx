import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.scss'; // Changed from './index.css' to './App.scss'
import { Provider } from 'react-redux';
import { store } from './store';
import { register } from './utils/serviceWorkerRegistration';
import { ThemeProvider } from './theme/ThemeProvider';
// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
  register();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
          <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { store } from './store/store';
import App from './App.tsx';
import RegisterPage from './pages/RegisterPage';
import './styles/index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// Configuration du thème Mantine avec la police Inter
const theme = createTheme({
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
  },
  primaryColor: 'blue',
  colors: {
    blue: [
      '#eff6ff',
      '#dbeafe',
      '#bfdbfe',
      '#93c5fd',
      '#60a5fa',
      '#3b82f6',
      '#2563eb',
      '#1d4ed8',
      '#1e40af',
      '#1e3a8a'
    ]
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
      },
    },
  },
});

// Supprimer le loader initial une fois que React est prêt
const removeInitialLoader = () => {
  const loader = document.querySelector('.initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => {
      loader.remove();
    }, 300);
  }
};

// Créer l'application React
const root = createRoot(document.getElementById('root')!);

const page = window.location.pathname === '/register' ? <RegisterPage /> : <App />;

root.render(
  <StrictMode>
    <Provider store={store}>
      <MantineProvider theme={theme}>
        <Notifications
          position="top-right"
          zIndex={1000}
        />
        {page}
      </MantineProvider>
    </Provider>
  </StrictMode>
);

// Supprimer le loader après le rendu initial
setTimeout(removeInitialLoader, 100);
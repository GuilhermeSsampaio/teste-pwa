// Importações necessárias
import '../styles/globals.css';
import '../styles/custom.css';
import '../styles/capitulos.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-ui-kit/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect } from 'react';
import { init } from "@socialgouv/matomo-next";
import dotenv from 'dotenv';

// Configuração do dotenv
dotenv.config();

// Constantes para o Matomo
const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

// Inicialização do Matomo
if (typeof window !== 'undefined') {
  init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });
}

// Componente MyApp
function MyApp({ Component, pageProps }) {
  // Efeito para registrar o service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch(error => {
          console.error('Erro ao registrar o Service Worker:', error);
        });
    }
  }, []);

  // Efeito para solicitar armazenamento persistente
  useEffect(() => {
    async function requestPersistedStorage() {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        console.log(`Persisted storage granted: ${isPersisted}`);
      }
    }

    requestPersistedStorage();
  }, []);

  // Renderização do Component com as props
  return <Component {...pageProps} />;
}

// Exportação do componente MyApp
export default MyApp;

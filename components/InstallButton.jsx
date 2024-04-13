import React, { useEffect, useState } from 'react';
import Link from 'next/link';
function InstallButton() {
  const [showInstallButton, setShowInstallButton] = useState(true); // Definido como true inicialmente
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', (e) => {
        setDeferredPrompt(null);
      });
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação');
        } else {
          console.log('Usuário recusou a instalação');
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  return (
    <>
      {showInstallButton && (
    <div>
        <div>
          <button id='btn-instalar' className='btn' onClick={handleInstallClick}>
            Instalar
          </button>
        </div>
        <div className='isIos'>
            <button onClick={() => setShowInstructions(true)}>Adicionar à Tela de Início</button>
            <div id="instructions">
              <p>Para instalar este app no seu iPhone:</p>
              <ol>
                <li>Abrir o Safari e navegar para <Link href='https://teste-pwa-rho.vercel.app/'>https://teste-pwa-rho.vercel.app/</Link>.</li>
                <li>Tocar no botão de compartilhamento na barra de navegação.</li>
                <li>Deslizar e tocar em "Adicionar à Tela de Início".</li>
                <li>Confirmar tocando em "Adicionar".</li>
              </ol>
            </div>
    </div>
          </div>
      )}
    </>
  );
}

export default InstallButton;

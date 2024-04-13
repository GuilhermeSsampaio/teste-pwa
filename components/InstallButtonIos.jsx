import React from 'react';

const InstallButtonIos = () => {
    return (
        <div className='isIos'>
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
    );
};

export default InstallButtonIos;
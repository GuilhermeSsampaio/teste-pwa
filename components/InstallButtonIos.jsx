import React, { useState } from 'react';

const InstallButtonIos = () => {
    const [showInstructions, setShowInstructions] = useState(false);

    const showInstallInstructions = () => {
        setShowInstructions(true);
    };

    return (
        <div>
            <button onClick={showInstallInstructions}>Adicionar à Tela de Início</button>
            {showInstructions && (
                <div id="instructions">
                    <p>Para instalar este app no seu iPhone:</p>
                    <ol>
                        <li>Abrir o Safari e navegar para [URL do seu PWA].</li>
                        <li>Tocar no botão de compartilhamento na barra de navegação.</li>
                        <li>Deslizar e tocar em "Adicionar à Tela de Início".</li>
                        <li>Confirmar tocando em "Adicionar".</li>
                    </ol>
                </div>
            )}
        </div>
    );
};

export default InstallButtonIos;

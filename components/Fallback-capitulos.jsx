import { useEffect, useState } from 'react';

const FallbackCapitulos = () => {
    const [capitulos, setCapitulos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/capitulos.json');
                const data = await response.json();
                setCapitulos(data);
            } catch (error) {
                console.error('Erro ao buscar os capitulos:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Conteúdo Offline</h1>
            <ul>
                {capitulos.map((capitulo) => (
                    <li key={capitulo.id}>{capitulo.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default FallbackCapitulos;
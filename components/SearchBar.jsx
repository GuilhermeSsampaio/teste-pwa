import { useState, useEffect } from "react";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

  const fetchData = async (value) => {
    try {
      let results = [];
      let showNoResults = true;

      // Check if data is available in cache
      const cache = await caches.open('api-capitulos-cache');
      const cachedResponses = await cache.matchAll('https://api-cartilha-teste-production.up.railway.app/api/capitulos');
      const cachedDataPromises = cachedResponses.map((cachedResponse) => cachedResponse.json());
      const cachedData = await Promise.all(cachedDataPromises);

      // Filter cached data
      results = cachedData.filter((capitulo) => {
        return (
          value &&
          capitulo.attributes &&
          capitulo.attributes.title &&
          capitulo.attributes.title.toLowerCase().includes(value.toLowerCase())
        );
      });

      // If there are results in cache, show them
      if (results.length > 0) {
        showNoResults = false;
        setResults(results);
        setShowNoResultsMessage(false);
      }

      // Fetch data from API
      if (navigator.onLine) {
        const response = await fetch('https://api-cartilha-teste-production.up.railway.app/api/capitulos');
        const data = await response.json();

        // Filter API data
        results = data.data.filter((capitulo) => {
          return (
            value &&
            capitulo.attributes &&
            capitulo.attributes.title &&
            capitulo.attributes.title.toLowerCase().includes(value.toLowerCase())
          );
        });

        // If there are results from API, show them
        if (results.length > 0) {
          showNoResults = false;
          setResults(results);
          setShowNoResultsMessage(false);
        }
      }

      // If no results found, show no results message
      if (showNoResults) {
        setResults([]);
        setShowNoResultsMessage(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
      setShowNoResultsMessage(true);
    }
  };

  const handleChange = (value) => {
    setInput(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      fetchData(value.toLowerCase());
    }, 200);

    setTypingTimeout(timeout);
  };

  useEffect(() => {
    setResults([]);
    setShowNoResultsMessage(false);
  }, [input]);

  return (
    <div className="input-wrapper">
      <i id="search-icon" className="fas fa-search"></i>
      <input
        className="navbar-input"
        placeholder="Buscar"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      {showNoResultsMessage && <div className="results-list"><p className='result-nulo'>Nenhum resultado encontrado para "{input}".</p></div>}
    </div>
  );
};

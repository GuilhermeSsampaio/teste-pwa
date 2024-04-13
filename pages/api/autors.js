// pages/api/autor.js
export default async function handler(req, res) {
    const response = await fetch('URL_DA_SUA_API_AUTOR'); // Substitua pela URL da sua rota /api-autor no Strapi
    const data = await response.json();
    res.status(200).json(data);
  }
  
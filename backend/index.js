const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;
const FILE = 'respuestas.json';

app.use(cors());
app.use(express.json());

app.post('/api/respuesta', (req, res) => {
  const { operador, score, comentario } = req.body;
  let datos = [];
  try {
    datos = JSON.parse(fs.readFileSync(FILE));
  } catch {}
  datos.push({ operador, score, comentario, fecha: new Date().toISOString() });
  fs.writeFileSync(FILE, JSON.stringify(datos, null, 2));
  res.sendStatus(200);
});

app.get('/api/respuestas', (req, res) => {
  try {
    const datos = JSON.parse(fs.readFileSync(FILE));
    res.json(datos);
  } catch {
    res.json([]);
  }
});

app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));

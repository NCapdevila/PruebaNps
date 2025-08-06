const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3001;
const FILE = 'respuestas.json';

app.use(cors());
app.use(express.json());

app.post('/api/respuesta', (req, res) => {
  
  const { operador, score, comentario, nombre_cliente, email_cliente, sector } = req.body;

  let datos = [];
  try {
    datos = JSON.parse(fs.readFileSync(FILE));
  } catch {}

  datos.push({
    operador,
    score,
    comentario,
    nombre_cliente,
    email_cliente,
    sector,
    fecha: new Date().toISOString()
  });

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

// NUEVO ENDPOINT
app.post('/api/encuestas/enviar', (req, res) => {
  console.log("🟡 Datos recibidos:", req.body);

  const { nombre, email, operador, sector } = req.body;

  if (!nombre || !email || !operador || !sector) {
    console.log("🔴 Faltan datos");
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const params = new URLSearchParams({
    nombre_cliente: nombre,
    email_cliente: email,
    operador,
    sector
  });

  const linkFormulario = `http://localhost:5173/formulario?${params.toString()}`;
  console.log("🟢 Link generado:", linkFormulario);

  res.json({ linkFormulario });
});


app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));

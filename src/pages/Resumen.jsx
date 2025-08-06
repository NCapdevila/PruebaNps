import { useEffect, useState } from 'react';

function calcularNPS(respuestas) {
  const total = respuestas.length;
  const prom = respuestas.filter(r => r.score >= 9).length;
  const det = respuestas.filter(r => r.score <= 6).length;
  return total ? ((prom - det) / total * 100).toFixed(1) : 'N/A';
}

function Resumen() {
  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/respuestas')
      .then(res => res.json())
      .then(data => setRespuestas(data));
  }, []);

  const porOperador = {};
  respuestas.forEach(r => {
    if (!porOperador[r.operador]) porOperador[r.operador] = [];
    porOperador[r.operador].push(r);
  });

  return (
    <div className="contenedor">
      <h1>Resumen de NPS</h1>
      {Object.entries(porOperador).map(([nombre, lista]) => (
        <div key={nombre} className="bloque">
          <h2>Operador: {nombre}</h2>
          <p>NPS: {calcularNPS(lista)}%</p>
          <p>Total respuestas: {lista.length}</p>
          <ul>
            {lista.map((r, i) => (
              <li key={i}>
                <strong>{r.score}</strong>: {r.comentario || "(sin comentario)"}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Resumen;

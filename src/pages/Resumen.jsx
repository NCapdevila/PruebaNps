import { useEffect, useState } from "react";
import "./Resumen.css";

function colorNPS(valor) {
  if (valor >= 50) return "#2e7d32"; // verde
  if (valor <= 0) return "#c62828"; // rojo
  return "#f9a825"; // amarillo
}

function calcularNPS(respuestas) {
  const total = respuestas.length;
  const prom = respuestas.filter((r) => r.score >= 9).length;
  const det = respuestas.filter((r) => r.score <= 6).length;
  return total ? (((prom - det) / total) * 100).toFixed(1) : "N/A";
}

function Resumen() {
  const [respuestas, setRespuestas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/respuestas")
      .then((res) => res.json())
      .then((data) => setRespuestas(data));
  }, []);

  const porOperador = {};
  respuestas.forEach((r) => {
    if (!porOperador[r.operador]) porOperador[r.operador] = [];
    porOperador[r.operador].push(r);
  });

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <h2>Gráficos por operador</h2>
      <div className="grafico-nps">
        {Object.entries(porOperador).map(([nombre, lista]) => {
          const nps = calcularNPS(lista);
          const color = colorNPS(nps);
          return (
            <div className="barra-nps" key={nombre}>
              <span className="etiqueta">{nombre}</span>
              <div className="barra">
                <div
                  className="relleno"
                  style={{
                    width: `${Math.max(0, nps)}%`,
                    backgroundColor: color,
                  }}
                >
                  <span className="valor">{nps}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <h2>NPS por operador</h2>
      <div className="grid-operadores">
        {Object.entries(porOperador).map(([nombre, lista]) => {
          const nps = calcularNPS(lista);
          return (
            <div key={nombre} className="tarjeta-operador">
              <h3>{nombre}</h3>
              <p
                className={`valor-nps ${
                  nps >= 50 ? "verde" : nps <= 0 ? "rojo" : "amarillo"
                }`}
              >
                NPS: {nps}%
              </p>
              <p className="detalle">{lista.length} respuestas</p>
              <ul className="lista-respuestas">
                {lista.map((r, i) => (
                  <li key={i}>
                    <strong>{r.score}</strong> - {r.nombre_cliente || "Cliente"}{" "}
                    ({r.email_cliente || "sin email"})<br />
                    <em className="comentario">
                      {r.comentario || "(sin comentario)"}
                    </em>
                    <br />
                    <span className="fecha">
                      {r.sector && `Sector: ${r.sector} - `}
                      {new Date(r.fecha).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Resumen;

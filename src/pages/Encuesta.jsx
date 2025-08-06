import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';

function Encuesta() {
  
  const [searchParams] = useSearchParams();
  const nombreClienteParam = searchParams.get('nombre_cliente');
  const emailClienteParam = searchParams.get('email_cliente');
  const sectorParam = searchParams.get('sector');
  const operadorParam = searchParams.get('operador');
  const [operador, setOperador] = useState(operadorParam || '');
  const [score, setScore] = useState(null);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);


  const enviar = async (e) => {
  e.preventDefault();
  if (score === null || operador.trim() === "") {
    alert("Faltan datos");
    return;
  }

  setEnviando(true);

  await fetch('http://localhost:3001/api/respuesta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operador, score, comentario, nombre_cliente: nombreClienteParam, email_cliente: emailClienteParam, sector: sectorParam }),
  });

  setEnviando(false);
  setEnviado(true);
};


  return (
    <div className="contenedor">
      {!enviado ? (
        <form onSubmit={enviar}>
          <h2>¿Qué tan probable es que recomiendes nuestro servicio?</h2>

          {!operadorParam && (
            <select value={operador} onChange={(e) => setOperador(e.target.value)}>
              <option value="">Seleccioná un operador</option>
              <option value="lucia">Lucía</option>
              <option value="juan">Juan</option>
            </select>
          )}

          <div className="score-options">
            {[...Array(11).keys()].map((n) => (
              <button
                type="button"
                key={n}
                className={score === n ? "activo" : ""}
                onClick={() => setScore(n)}
              >
                {n}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Comentario (opcional)"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

          <button type="submit" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar"}
          </button>

        </form>
      ) : (
        <p>¡Gracias por tu respuesta!</p>
      )}
    </div>
  );
}

export default Encuesta;

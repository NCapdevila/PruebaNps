import { useState } from 'react';

function GeneradorLinks() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [operador, setOperador] = useState('');
  const [sector, setSector] = useState('');
  const [link, setLink] = useState('');
  const [cargando, setCargando] = useState(false);

  const generarLink = async () => {
    if (!nombre || !email || !operador || !sector) {
      alert("Completá todos los campos");
      return;
    }

    setCargando(true);
    setLink('');

    try {
      const res = await fetch('http://localhost:3001/api/encuestas/enviar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, operador, sector })
      });

      const data = await res.json();
      setLink(data.linkFormulario);
    } catch (err) {
      console.error(err);
      alert("Error al generar el link");
    }

    setCargando(false);
  };

  const copiarWhatsApp = () => {
    const mensaje = `¡Hola ${nombre}! ¿Podés ayudarnos con una breve encuesta? Nos toma menos de 1 minuto.\n\n👉 Comenzar encuesta:\n${link}\n\n¡Gracias por tu tiempo!`;
    navigator.clipboard.writeText(mensaje);
    alert("Mensaje copiado al portapapeles 📋");
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: 20 }}>
      <h2>Generar link de encuesta</h2>

      <input type="text" placeholder="Nombre cliente" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input type="email" placeholder="Email cliente" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="text" placeholder="Operador" value={operador} onChange={e => setOperador(e.target.value)} />
      <input type="text" placeholder="Sector" value={sector} onChange={e => setSector(e.target.value)} />

      <button onClick={generarLink} disabled={cargando}>
        {cargando ? 'Generando...' : 'Generar link'}
      </button>

      {link && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Link generado:</strong></p>
          <input type="text" value={link} readOnly style={{ width: '100%' }} />
          <button onClick={copiarWhatsApp} style={{ marginTop: 10 }}>
            Copiar mensaje para WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}

export default GeneradorLinks;

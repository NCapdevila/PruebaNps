import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Encuesta from './pages/Encuesta.jsx';
import Resumen from './pages/Resumen.jsx';
import GeneradorLinks from './pages/GeneradorLinks.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Encuesta />} />
        <Route path="/resumen" element={<Resumen />} />
        <Route path="/generador" element={<GeneradorLinks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


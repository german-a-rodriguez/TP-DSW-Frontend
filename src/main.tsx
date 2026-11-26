import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './estilos/compartidos.css';
import './vistas-publicas/vistas-publicas.css';
import './paneles/paneles.css';
import './components/ListadoCrud.css';
import './paneles/DashboardCliente.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

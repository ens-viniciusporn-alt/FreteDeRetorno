import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout({ tipo, nome, children }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const cliente = tipo === 'cliente';

  return (
    <div className="dashboard-app">
      <Sidebar
        tipo={tipo}
        nome={nome}
        aberta={menuAberto}
        aoFechar={() => setMenuAberto(false)}
      />

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="dashboard-menu-toggle"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            ☰
          </button>
          <div className="dashboard-breadcrumb">
            <span>Painel</span><span className="breadcrumb-separator">/</span>
            <strong>{cliente ? 'Área do cliente' : 'Área da transportadora'}</strong>
          </div>
          <div className="dashboard-topbar-user">
            <span className="topbar-avatar">{cliente ? (nome?.[0] || 'C').toUpperCase() : 'TR'}</span>
            <span className="topbar-user-name">{nome || (cliente ? 'Cliente' : 'Transportadora')}</span>
            <span className="topbar-chevron">▾</span>
          </div>
        </header>

        <main className="dashboard-content">
          {children}
          <footer className="dashboard-footer">
            <span>© 2026 Frete de Retorno</span>
            <span>Protótipo — {cliente ? 'Área do Cliente' : 'Área da Transportadora'}</span>
            <Link to="/">Voltar ao início</Link>
          </footer>
        </main>
      </div>
    </div>
  );
}

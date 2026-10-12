import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-container">
        <a href="/" className="brand" aria-label="Frete de Retorno - Início">
          <div className="brand-logo" aria-hidden="true">
            🚚
          </div>
          <span className="brand-name">
            Frete de Retorno
          </span>
        </a>
        <button className="menu-toggle" id="menuToggle" type="button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`} id="mainNav" aria-label="Navegação principal">
          <a href="#inicio" className="nav-link active" onClick={closeMenu}>
            Início
          </a>
          <a href="#como-funciona" className="nav-link" onClick={closeMenu}>
            Como funciona
          </a>
          <a href="#beneficios" className="nav-link" onClick={closeMenu}>
            Benefícios
          </a>
          <a href="#publico" className="nav-link" onClick={closeMenu}>
            Para quem é
          </a>
          <a href="#contato" className="nav-link" onClick={closeMenu}>
            Contato
          </a>
          <div className="nav-actions">
            <a href="/login" className="btn btn-outline" onClick={closeMenu}>
              Entrar
            </a>
            <a href="/cadastro" className="btn btn-primary" onClick={closeMenu}>
              Criar conta
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

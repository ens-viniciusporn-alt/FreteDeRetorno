export default function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="brand">
            <div className="brand-logo" aria-hidden="true">
              🚚
            </div>
            <span className="brand-name">
              Frete de Retorno
            </span>
          </div>
          <p>
            Conectando cargas e rotas para tornar o transporte
                    mais eficiente.
          </p>
        </div>
        <div className="footer-column">
          <h3>
            Plataforma
          </h3>
          <a href="#como-funciona">
            Como funciona
          </a>
          <a href="#beneficios">
            Benefícios
          </a>
          <a href="#publico">
            Para quem é
          </a>
        </div>
        <div className="footer-column">
          <h3>
            Acesso
          </h3>
          <a href="/login">
            Entrar
          </a>
          <a href="/cadastro">
            Criar conta
          </a>
        </div>
        <div className="footer-column">
          <h3>
            Contato
          </h3>
          <a href="mailto:contato@freteretorno.com">
            contato@freteretorno.com
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © 2026 Frete de Retorno. Todos os direitos reservados.
        </p>
        <p>
          Protótipo em desenvolvimento
        </p>
      </div>
    </footer>
  );
}

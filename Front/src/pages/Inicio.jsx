import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Inicio() {
  return (
    <>
      <Header />
    <main>
      <section className="hero" id="inicio">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-label">
              Transporte inteligente
            </span>
            <h1>
              Encontre espaço.
              <span>
                Reduza custos.
              </span>
              Transporte melhor.
            </h1>
            <p className="hero-description">
              Conectamos clientes a caminhoneiros e transportadoras
                        com espaço disponível em suas rotas, aproveitando
                        viagens de retorno e tornando o transporte mais
                        econômico, rápido e sustentável.
            </p>
            <div className="hero-actions">
              <a href="/cadastro?perfil=cliente" className="btn btn-primary btn-large">
                Encontrar um frete
              </a>
              <a href="/cadastro?perfil=transportador" className="btn btn-outline btn-large">
                Oferecer espaço
              </a>
            </div>
            <div className="hero-info">
              <div className="hero-info-item">
                <strong>
                  +
                </strong>
                <span>
                  Oportunidades de transporte
                </span>
              </div>
              <div className="hero-info-item">
                <strong>
                  ↓
                </strong>
                <span>
                  Custos operacionais
                </span>
              </div>
              <div className="hero-info-item">
                <strong>
                  ↗
                </strong>
                <span>
                  Eficiência logística
                </span>
              </div>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-image">
              <img src="/assets/images/img1.jpg" alt="Caminhão realizando transporte de cargas" />
            </div>
            <div className="hero-floating-card">
              <div className="floating-icon">
                ✓
              </div>
              <div>
                <strong>
                  Espaço aproveitado
                </strong>
                <span>
                  Mais eficiência na rota
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-light" id="como-funciona">
        <div className="container">
          <div className="section-header">
            <span className="section-label">
              Simples e direto
            </span>
            <h2>
              Como funciona?
            </h2>
            <p>
              A plataforma facilita a conexão entre quem precisa
                        transportar e quem já está realizando uma rota.
            </p>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <div className="step-number">
                01
              </div>
              <div className="step-icon">
                📋
              </div>
              <h3>
                Cadastre
              </h3>
              <p>
                Informe os detalhes da sua carga ou da viagem
                            que será realizada.
              </p>
            </article>
            <article className="step-card">
              <div className="step-number">
                02
              </div>
              <div className="step-icon">
                🔎
              </div>
              <h3>
                Encontre
              </h3>
              <p>
                Localize oportunidades compatíveis com sua
                            rota, destino e espaço disponível.
              </p>
            </article>
            <article className="step-card">
              <div className="step-number">
                03
              </div>
              <div className="step-icon">
                🤝
              </div>
              <h3>
                Combine
              </h3>
              <p>
                Cliente e transportador alinham os detalhes
                            da coleta e do transporte.
              </p>
            </article>
            <article className="step-card">
              <div className="step-number">
                04
              </div>
              <div className="step-icon">
                🚚
              </div>
              <h3>
                Transporte
              </h3>
              <p>
                A carga segue seu destino aproveitando uma
                            rota que já seria realizada.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="section section-white" id="beneficios">
        <div className="container">
          <div className="section-header">
            <span className="section-label">
              Por que utilizar?
            </span>
            <h2>
              Uma solução para todos os lados
            </h2>
            <p>
              Aproveitar melhor as rotas pode gerar benefícios
                        para clientes, transportadores e para o meio ambiente.
            </p>
          </div>
          <div className="benefits-grid">
            <article className="benefit-card">
              <div className="benefit-icon">
                💰
              </div>
              <h3>
                Economia
              </h3>
              <p>
                Encontre alternativas de transporte utilizando
                            espaços que já estão disponíveis.
              </p>
            </article>
            <article className="benefit-card">
              <div className="benefit-icon">
                📦
              </div>
              <h3>
                Melhor aproveitamento
              </h3>
              <p>
                Reduza espaços vazios e aproveite melhor a
                            capacidade dos veículos.
              </p>
            </article>
            <article className="benefit-card">
              <div className="benefit-icon">
                📈
              </div>
              <h3>
                Mais oportunidades
              </h3>
              <p>
                Transportadores podem encontrar novas cargas
                            para suas rotas.
              </p>
            </article>
            <article className="benefit-card">
              <div className="benefit-icon">
                ⚡
              </div>
              <h3>
                Mais agilidade
              </h3>
              <p>
                Conecte cargas a viagens que já estão planejadas
                            e agilize o transporte.
              </p>
            </article>
            <article className="benefit-card">
              <div className="benefit-icon">
                🌱
              </div>
              <h3>
                Sustentabilidade
              </h3>
              <p>
                Melhor utilização dos veículos pode contribuir
                            para reduzir viagens sem carga.
              </p>
            </article>
            <article className="benefit-card">
              <div className="benefit-icon">
                🔐
              </div>
              <h3>
                Mais segurança
              </h3>
              <p>
                A plataforma poderá centralizar acordos,
                            documentos e informações do transporte.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="section audience-section" id="publico">
        <div className="container">
          <div className="section-header">
            <span className="section-label">
              Para todos
            </span>
            <h2>
              Qual é o seu objetivo?
            </h2>
            <p>
              A plataforma conecta os dois lados da operação logística.
            </p>
          </div>
          <div className="audience-grid">
            <article className="audience-card audience-client">
              <div className="audience-content">
                <span className="audience-tag">
                  Para clientes
                </span>
                <h3>
                  Precisa transportar uma carga?
                </h3>
                <p>
                  Encontre transportadores que já estão
                                realizando uma rota próxima ao destino
                                da sua encomenda.
                </p>
                <a href="/cadastro?perfil=cliente" className="btn btn-primary">
                  Quero enviar uma carga
                </a>
              </div>
            </article>
            <article className="audience-card audience-carrier">
              <div className="audience-content">
                <span className="audience-tag">
                  Para transportadores
                </span>
                <h3>
                  Tem espaço disponível no veículo?
                </h3>
                <p>
                  Divulgue sua rota e encontre cargas
                                compatíveis para aproveitar melhor
                                sua viagem.
                </p>
                <a href="/cadastro?perfil=transportador" className="btn btn-outline">
                  Quero oferecer espaço
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <span className="section-label">
              Comece agora
            </span>
            <h2>
              Aproveite melhor cada viagem.
            </h2>
            <p>
              Conecte sua necessidade de transporte a uma
                        oportunidade que já está no caminho.
            </p>
            <div className="cta-actions">
              <a href="/cadastro" className="btn btn-primary btn-large">
                Criar minha conta
              </a>
              <a href="/login" className="btn btn-white btn-large">
                Já tenho uma conta
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
      <Footer />
    </>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import {useAuth} from '../context/useAuth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const {entrar}=useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  function limparMensagens() {
    setErros({});
    setMensagem('');
    setTipoMensagem('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    limparMensagens();

    const novosErros = {};
    const emailLimpo = email.trim();

    if (!emailLimpo) {
      novosErros.email = 'Informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      novosErros.email = 'Informe um e-mail válido.';
    }

    if (!senha.trim()) {
      novosErros.senha = 'Informe sua senha.';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      setMensagem('Verifique os dados informados.');
      setTipoMensagem('error');
      return;
    }

    setCarregando(true);
    try {
      const usuario=await entrar(emailLimpo,senha);
      setMensagem('Login realizado com sucesso!');
      setTipoMensagem('success');
      navigate(usuario.tipo_usuario==='CLIENTE'?'/cliente':'/transportadora',{replace:true});
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      setMensagem('Não foi possível conectar ao servidor. Verifique se o backend está funcionando.');
      setTipoMensagem('error');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="container auth-header-container">
          <Link to="/" className="brand" aria-label="Frete de Retorno - Início">
            <div className="brand-logo" aria-hidden="true">🚚</div>
            <span className="brand-name">Frete de Retorno</span>
          </Link>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-container">
          <section className="auth-intro">
            <span className="section-label">Bem-vindo de volta</span>
            <h1>Transporte de forma mais inteligente.</h1>
            <p>
              Acesse sua conta para acompanhar suas cargas, encontrar oportunidades
              de transporte e gerenciar suas operações.
            </p>
            <div className="auth-intro-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Gerencie seus transportes</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Acompanhe suas oportunidades</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Tenha suas informações organizadas</span>
              </div>
            </div>
          </section>

          <section className="auth-card">
            <div className="auth-card-header">
              <h2>Entrar</h2>
              <p>Acesse sua conta para continuar.</p>
            </div>

            <form id="loginForm" className="auth-form" noValidate onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(erros.email)}
                  aria-describedby={erros.email ? 'emailError' : undefined}
                />
                <span className="form-error" id="emailError">{erros.email || ''}</span>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="password">Senha</label>
                  <Link to="/recuperar-senha" className="forgot-password login-link-button">Esqueci minha senha</Link>
                </div>
                <div className="password-wrapper">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    aria-invalid={Boolean(erros.senha)}
                    aria-describedby={erros.senha ? 'passwordError' : undefined}
                  />
                  <button type="button" className="password-toggle" onClick={() => setMostrarSenha(v=>!v)} aria-label={mostrarSenha?'Ocultar senha':'Mostrar senha'}>{mostrarSenha?'Ocultar':'Mostrar'}</button>
                </div>
                <span className="form-error" id="passwordError">{erros.senha || ''}</span>
              </div>



              <div className={`form-message ${mensagem ? `show ${tipoMensagem}` : ''}`} id="loginMessage" role="alert" aria-live="polite">
                {mensagem}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large auth-submit"
                disabled={carregando}
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="auth-divider"><span>ou</span></div>

            <div className="auth-register">
              <p>Ainda não possui uma conta?</p>
              <Link to="/cadastro" className="btn btn-outline auth-register-button">
                Criar minha conta
              </Link>
            </div>

            <div className="auth-back">
              <Link to="/">← Voltar para a página inicial</Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="auth-footer">
        <p>© 2026 Frete de Retorno. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

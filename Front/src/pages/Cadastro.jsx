import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import {api} from '../utils/api';
import './Cadastro.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Cadastro() {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState(() => new URLSearchParams(window.location.search).get('perfil') === 'transportador' ? 'TRANSPORTADORA' : new URLSearchParams(window.location.search).get('perfil') === 'cliente' ? 'CLIENTE' : '');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [cadastroConcluido, setCadastroConcluido] = useState(false);

  function limparMensagens() {
    setErros({});
    setMensagem('');
    setTipoMensagem('');
    setCadastroConcluido(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    limparMensagens();

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();
    const novosErros = {};

    if (!tipoUsuario) novosErros.tipoUsuario = 'Selecione como pretende utilizar a plataforma.';
    if (!nomeLimpo) novosErros.nome = 'Informe seu nome.';
    if (!emailLimpo) novosErros.email = 'Informe seu e-mail.';
    else if (!EMAIL_REGEX.test(emailLimpo)) novosErros.email = 'Informe um e-mail válido.';
    if (senha.length < 8) novosErros.senha = 'A senha deve ter pelo menos 8 caracteres.';
    if (!confirmacaoSenha) novosErros.confirmacaoSenha = 'Confirme sua senha.';
    else if (senha !== confirmacaoSenha) novosErros.confirmacaoSenha = 'As senhas não conferem.';
    if (!aceitouTermos) novosErros.termos = 'É necessário concordar com os termos para continuar.';

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      setMensagem('Verifique os dados informados.');
      setTipoMensagem('error');
      return;
    }

    setCarregando(true);
    try {
      await api('/usuarios', {method:'POST',body:{
        nome:nomeLimpo,email:emailLimpo,telefone:telefone.trim()||null,
        senha,confirmacaoSenha,tipo_usuario:tipoUsuario,
      }});
      setMensagem('Conta criada com sucesso! Agora você já pode entrar.');
      setTipoMensagem('success');
      setCadastroConcluido(true);
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
        <div className="auth-container auth-container-register">
          <section className="auth-intro">
            <span className="section-label">Faça parte</span>
            <h1>Comece a aproveitar melhor suas rotas.</h1>
            <p>Crie sua conta gratuitamente e conecte-se a oportunidades de transporte.</p>

            <div className="profile-preview">
              <div className="profile-preview-item">
                <div className="profile-preview-icon" aria-hidden="true">📦</div>
                <div>
                  <strong>Cliente</strong>
                  <span>Precisa transportar uma carga.</span>
                </div>
              </div>
              <div className="profile-preview-item">
                <div className="profile-preview-icon" aria-hidden="true">🚚</div>
                <div>
                  <strong>Transportador</strong>
                  <span>Possui espaço disponível.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="auth-card register-card">
            <div className="auth-card-header">
              <h2>Criar conta</h2>
              <p>Preencha seus dados para começar.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label>Como você pretende utilizar a plataforma?</label>
                <div className="profile-options">
                  <label className={`profile-option ${tipoUsuario === 'CLIENTE' ? 'selected' : ''}`} htmlFor="profileClient">
                    <input type="radio" id="profileClient" name="profile" value="CLIENTE" checked={tipoUsuario === 'CLIENTE'} onChange={() => { setTipoUsuario('CLIENTE'); setErros(prev => ({ ...prev, tipoUsuario: '' })); }} />
                    <span className="profile-option-content">
                      <span className="profile-option-icon">📦</span>
                      <span className="profile-option-text"><strong>Cliente</strong><small>Quero transportar cargas.</small></span>
                    </span>
                  </label>
                  <label className={`profile-option ${tipoUsuario === 'TRANSPORTADORA' ? 'selected' : ''}`} htmlFor="profileCarrier">
                    <input type="radio" id="profileCarrier" name="profile" value="TRANSPORTADORA" checked={tipoUsuario === 'TRANSPORTADORA'} onChange={() => { setTipoUsuario('TRANSPORTADORA'); setErros(prev => ({ ...prev, tipoUsuario: '' })); }} />
                    <span className="profile-option-content">
                      <span className="profile-option-icon">🚚</span>
                      <span className="profile-option-text"><strong>Transportador</strong><small>Quero oferecer espaço.</small></span>
                    </span>
                  </label>
                </div>
                {erros.tipoUsuario && <span className="form-error">{erros.tipoUsuario}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="registerName">Nome</label>
                <input id="registerName" type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" autoComplete="name" aria-invalid={Boolean(erros.nome)} />
                {erros.nome && <span className="form-error">{erros.nome}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="registerEmail">E-mail</label>
                <input id="registerEmail" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" autoComplete="email" aria-invalid={Boolean(erros.email)} />
                {erros.email && <span className="form-error">{erros.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="registerPhone">Telefone <span className="optional-label">(opcional)</span></label>
                <input id="registerPhone" type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000" autoComplete="tel" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="registerPassword">Senha</label>
                  <div className="password-field">
                    <input id="registerPassword" type={mostrarSenha ? 'text' : 'password'} value={senha} onChange={e => setSenha(e.target.value)} placeholder="Crie uma senha" autoComplete="new-password" aria-invalid={Boolean(erros.senha)} />
                    <button type="button" className="password-toggle" onClick={() => setMostrarSenha(v => !v)} aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}>{mostrarSenha ? 'Ocultar' : 'Mostrar'}</button>
                  </div>
                  {erros.senha && <span className="form-error">{erros.senha}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar senha</label>
                  <div className="password-field">
                    <input id="confirmPassword" type={mostrarConfirmacao ? 'text' : 'password'} value={confirmacaoSenha} onChange={e => setConfirmacaoSenha(e.target.value)} placeholder="Repita a senha" autoComplete="new-password" aria-invalid={Boolean(erros.confirmacaoSenha)} />
                    <button type="button" className="password-toggle" onClick={() => setMostrarConfirmacao(v => !v)} aria-label={mostrarConfirmacao ? 'Ocultar confirmação' : 'Mostrar confirmação'}>{mostrarConfirmacao ? 'Ocultar' : 'Mostrar'}</button>
                  </div>
                  {erros.confirmacaoSenha && <span className="form-error">{erros.confirmacaoSenha}</span>}
                </div>
              </div>

              <div className="form-checkbox terms-checkbox">
                <input id="terms" type="checkbox" checked={aceitouTermos} onChange={e => { setAceitouTermos(e.target.checked); setErros(prev => ({ ...prev, termos: '' })); }} />
                <label htmlFor="terms">Concordo com os <Link to="/termos">termos de uso</Link> e a <Link to="/privacidade">política de privacidade</Link>.</label>
              </div>
              {erros.termos && <span className="form-error">{erros.termos}</span>}

              {mensagem && <div className={`form-message show ${tipoMensagem}`} role="alert" aria-live="polite">{mensagem}</div>}

              {cadastroConcluido ? (
                <button type="button" className="btn btn-primary btn-large auth-submit" onClick={() => navigate('/login')}>Ir para o login</button>
              ) : (
                <button type="submit" className="btn btn-primary btn-large auth-submit" disabled={carregando}>
                  {carregando ? 'Criando conta...' : 'Criar minha conta'}
                </button>
              )}
            </form>

            <div className="auth-divider"><span>ou</span></div>
            <div className="auth-register">
              <p>Já possui uma conta?</p>
              <Link to="/login" className="btn btn-outline auth-register-button">Entrar na minha conta</Link>
            </div>
            <div className="auth-back"><Link to="/">← Voltar para a página inicial</Link></div>
          </section>
        </div>
      </main>

      <footer className="auth-footer">
        <p>© 2026 Frete de Retorno. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/useAuth';
import { api } from '../utils/api';
import './ConfiguracoesPerfil.css';

// Máscara brasileira: (DD) XXXX-XXXX ou (DD) XXXXX-XXXX.
// Aceita também um número já salvo com o prefixo internacional +55.
function formatarTelefoneBR(valor) {
  let digitos = String(valor ?? '').replace(/\D/g, '');
  if (digitos.length > 11 && digitos.startsWith('55')) {
    digitos = digitos.slice(2);
  }
  digitos = digitos.slice(0, 11);
  if (digitos.length <= 2) return digitos ? `(${digitos}` : '';
  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  if (numero.length <= 4) return `(${ddd}) ${numero}`;
  const corte = numero.length > 8 ? 5 : 4;
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`;
}

export default function ConfiguracoesPerfil({ tipo }) {
  const { usuario, recarregar } = useAuth();
  const [nome, setNome] = useState(usuario?.nome || '');
  const [telefone, setTelefone] = useState(formatarTelefoneBR(usuario?.telefone));
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Os dados da sessão podem chegar após a primeira renderização.
  useEffect(() => {
    setNome(usuario?.nome || '');
    setTelefone(formatarTelefoneBR(usuario?.telefone));
  }, [usuario?.id_usuario, usuario?.nome, usuario?.telefone]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem('');
    const numero = telefone.trim();
    const digitos = numero.replace(/\D/g, '');
    if (numero && (!/^[+()\d\s.-]+$/.test(numero) ||
      ![10, 11].includes(digitos.length) || digitos[0] === '0' || digitos[1] === '0')) {
      setMensagem('Informe um telefone brasileiro válido com DDD (10 ou 11 dígitos).');
      return;
    }

    setSalvando(true);
    try {
      const result = await api('/usuarios/me', { method: 'PATCH', body: { nome, telefone: numero } });
      setNome(result.usuario.nome);
      setTelefone(formatarTelefoneBR(result.usuario.telefone));
      await recarregar();
      setMensagem(result.mensagem || 'Alterações salvas com sucesso.');
    } catch (error) {
      setMensagem(error.message || 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <DashboardLayout tipo={tipo} nome={usuario?.nome}>
      <section className="dashboard-page-heading">
        <div>
          <span className="dashboard-eyebrow">CONTA</span>
          <h1>Configurações do perfil</h1>
          <p>Atualize seu nome e telefone. Seu e-mail de acesso permanece inalterado.</p>
        </div>
      </section>
      <section className="dashboard-panel profile-settings-panel">
        <div className="dashboard-panel-heading"><h2>Dados pessoais</h2></div>
        <form className="profile-settings-form" onSubmit={handleSubmit}>
          <div className="profile-settings-field">
            <label htmlFor="profileName">Nome</label>
            <input id="profileName" maxLength={100} required value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div className="profile-settings-field">
            <label htmlFor="profileEmail">E-mail</label>
            <input id="profileEmail" type="email" readOnly value={usuario?.email || ''} />
            <small>A alteração do e-mail não está disponível nesta versão.</small>
          </div>
          <div className="profile-settings-field">
            <label htmlFor="profilePhone">Telefone</label>
            <input id="profilePhone" type="tel" inputMode="tel" autoComplete="tel"
              maxLength={15} placeholder="(41) 99999-9999" value={telefone}
              onChange={e => setTelefone(formatarTelefoneBR(e.target.value))} />
            <small>Informe o DDD e o número. A formatação é automática; deixe vazio para remover.</small>
          </div>
          <p className="profile-settings-feedback" role="status" aria-live="polite">{mensagem}</p>
          <div className="profile-settings-actions">
            <button type="submit" disabled={salvando} className="dashboard-primary-button">
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
            <Link className="dashboard-outline-button" to={tipo === 'cliente' ? '/cliente' : '/transportadora'}>Voltar</Link>
          </div>
        </form>
      </section>
    </DashboardLayout>
  );
}

import {useState} from 'react';
import {Link} from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
import './ConfiguracoesPerfil.css';
export default function ConfiguracoesPerfil({tipo}){
  const {usuario,recarregar}=useAuth();
  const [nome,setNome]=useState(usuario?.nome||'');const [mensagem,setMensagem]=useState('');const [salvando,setSalvando]=useState(false);
  async function handleSubmit(e){e.preventDefault();setSalvando(true);setMensagem('');try{
    const result=await api('/usuarios/me',{method:'PATCH',body:{nome}});
    setNome(result.usuario.nome);await recarregar();setMensagem(result.mensagem||'Salvo com sucesso.');
  }catch(error){setMensagem(error.message);}finally{setSalvando(false);}}
  return <DashboardLayout tipo={tipo} nome={usuario?.nome}>
    <section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">CONTA</span><h1>Configurações do perfil</h1><p>Edite seus dados sem acessar contas de outros usuários.</p></div></section>
    <section className="dashboard-panel profile-settings-panel"><div className="dashboard-panel-heading"><h2>Dados pessoais</h2></div>
      <form className="profile-settings-form" onSubmit={handleSubmit}>
        <div className="profile-settings-field"><label htmlFor="profileName">Nome</label><input id="profileName" maxLength={100} required value={nome} onChange={e=>setNome(e.target.value)}/></div>
        <div className="profile-settings-field"><label htmlFor="profileEmail">E-mail</label><input id="profileEmail" readOnly value={usuario?.email||''}/><small>A alteração do e-mail não está disponível nesta versão.</small></div>
        <div className="profile-settings-field"><label htmlFor="profilePhone">Telefone</label><input id="profilePhone" readOnly value={usuario?.telefone||'Não informado'}/></div>
        <p className="profile-settings-feedback" role="status">{mensagem}</p>
        <div className="profile-settings-actions"><button type="submit" disabled={salvando} className="dashboard-primary-button">{salvando?'Salvando...':'Salvar alterações'}</button><Link className="dashboard-outline-button" to={tipo==='cliente'?'/cliente':'/transportadora'}>Voltar</Link></div>
      </form>
    </section>
  </DashboardLayout>;
}

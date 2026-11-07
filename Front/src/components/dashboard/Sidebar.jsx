import {Link,useLocation,useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/useAuth';
const menus={
  cliente:[
    {titulo:'Principal',itens:[['⌂','Dashboard','/cliente'],['▣','Minhas cargas','/cliente/cargas'],['＋','Nova carga','/cliente/cargas#nova'],['◉','Encontrar transporte','/cliente/transporte']]},
    {titulo:'Conta',itens:[['⚙','Configurações','/cliente/configuracoes'],['☏','Suporte','/cliente/suporte'],['✉','Conversas','/cliente/chats'],['▤','Meus contratos','/cliente/contratos']]}
  ],
  transportadora:[
    {titulo:'Principal',itens:[['⌂','Visão geral','/transportadora'],['🛣','Minhas viagens','/transportadora/viagens'],['＋','Cadastrar viagem','/transportadora/viagens#nova'],['▣','Cargas disponíveis','/transportadora/cargas']]},
    {titulo:'Conta',itens:[['⚙','Configurações','/transportadora/configuracoes'],['✉','Conversas','/transportadora/chats'],['▤','Meus contratos','/transportadora/contratos']]}
  ]
};
export default function Sidebar({tipo,nome,aberta,aoFechar}) {
  const location=useLocation();const navigate=useNavigate();const {sair}=useAuth();
  const cliente=tipo==='cliente';
  return <>
    <button className={`dashboard-overlay ${aberta?'visivel':''}`} aria-label="Fechar menu" onClick={aoFechar} tabIndex={aberta?0:-1}/>
    <aside className={`dashboard-sidebar ${aberta?'aberta':''}`}>
      <div className="dashboard-brand-row"><Link to="/" className="dashboard-brand" onClick={aoFechar}><span className="dashboard-brand-icon">🚚</span><span>Frete de Retorno</span></Link><button className="sidebar-close" onClick={aoFechar} aria-label="Fechar menu">×</button></div>
      <div className="dashboard-user"><div className="dashboard-avatar">{cliente?(nome?.[0]||'C').toUpperCase():'TR'}</div><div className="dashboard-user-info"><strong>{nome||'Usuário'}</strong><span>{cliente?'Cliente':'Transportadora'}</span></div></div>
      <nav className="dashboard-nav" aria-label="Menu principal">
        {(menus[tipo]||[]).map(grupo=><div className="dashboard-nav-group" key={grupo.titulo}><span className="dashboard-nav-title">{grupo.titulo}</span>{grupo.itens.map(([icone,rotulo,destino])=><Link key={rotulo} to={destino} className={`dashboard-nav-item ${location.pathname===destino.split('#')[0]?'ativo':''}`} onClick={aoFechar}><span className="dashboard-nav-icon" aria-hidden="true">{icone}</span><span>{rotulo}</span></Link>)}</div>)}
      </nav>
      <div className="dashboard-sidebar-footer"><button className="dashboard-nav-item dashboard-logout-button" type="button" onClick={async()=>{try{await sair();}catch{ /* encerra sessão na interface */ }aoFechar();navigate('/login',{replace:true});}}><span className="dashboard-nav-icon">↪</span><span>Sair</span></button></div>
    </aside>
  </>;
}

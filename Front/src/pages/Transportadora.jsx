import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
export default function Transportadora(){
  const {usuario}=useAuth();const [viagens,setViagens]=useState([]),[erro,setErro]=useState('');
  useEffect(()=>{let active=true;api('/viagens/minhas').then(d=>{if(active)setViagens(d.viagens);}).catch(e=>{if(active)setErro(e.message);});return()=>{active=false;};},[]);
  const ativas=viagens.filter(v=>v.status==='AGENDADA');
  const capacidade=ativas.reduce((acc,v)=>acc+Number(v.capacidade_m3),0);
  return <DashboardLayout tipo="transportadora" nome={usuario.nome}>
    <section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">PAINEL DA TRANSPORTADORA</span><h1>Visão geral</h1><p>Organize viagens e descubra oportunidades de retorno.</p></div><Link to="/transportadora/viagens#nova" className="dashboard-primary-button">＋ Cadastrar viagem</Link></section>
    {erro&&<p role="alert" className="operation-feedback">{erro}. Confira a migração SQL no README.</p>}
    <section className="stat-grid"><StatCard icon="🛣" titulo="Viagens agendadas" valor={String(ativas.length)} detalhe="Cadastradas no Neon" tom="azul"/><StatCard icon="📐" titulo="Capacidade anunciada" valor={`${capacidade.toFixed(2)} m³`} detalhe="Viagens agendadas" tom="laranja"/><StatCard icon="✓" titulo="Concluídas" valor={String(viagens.filter(v=>v.status==='CONCLUIDA').length)} detalhe="Viagens finalizadas" tom="verde"/><StatCard icon="▣" titulo="Todas as viagens" valor={String(viagens.length)} detalhe="Histórico próprio" tom="roxo"/></section>
    <section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>Próximas viagens</h2><Link to="/transportadora/viagens" className="dashboard-text-link">Ver todas →</Link></div>{ativas.length?<div className="operation-list">{ativas.slice(0,5).map(v=><div className="operation-row" key={v.id_viagem}><div><strong>{v.origem} → {v.destino}</strong><p>{v.data_saida} · {v.veiculo}</p></div><span className="status-pill transporte">{v.capacidade_m3} m³</span></div>)}</div>:<p>Cadastre uma viagem para anunciar capacidade disponível.</p>}</section>
    <section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>Novas oportunidades</h2></div><div className="quick-actions-grid"><Link className="quick-action-card" to="/transportadora/viagens#nova"><strong>＋ Cadastrar viagem</strong><span>Publique uma nova rota</span></Link><Link className="quick-action-card" to="/transportadora/cargas"><strong>▣ Cargas disponíveis</strong><span>Consulte cargas abertas</span></Link><Link className="quick-action-card" to="/transportadora/viagens"><strong>🛣 Minhas viagens</strong><span>Gerencie suas rotas</span></Link></div></section>
  </DashboardLayout>;
}

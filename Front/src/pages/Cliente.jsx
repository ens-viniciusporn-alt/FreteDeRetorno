import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
export default function Cliente(){
  const {usuario}=useAuth();const [cargas,setCargas]=useState([]),[erro,setErro]=useState('');
  useEffect(()=>{let active=true;api('/cargas/minhas').then(d=>{if(active)setCargas(d.cargas);}).catch(e=>{if(active)setErro(e.message);});return()=>{active=false;};},[]);
  return <DashboardLayout tipo="cliente" nome={usuario.nome}>
    <section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">ÁREA DO CLIENTE</span><h1>Olá, {usuario.nome.split(' ')[0]}! 👋</h1><p>Acompanhe suas cargas e encontre viagens com espaço disponível.</p></div><Link to="/cliente/cargas#nova" className="dashboard-primary-button">＋ Nova carga</Link></section>
    {erro&&<p role="alert" className="operation-feedback">{erro}. Se ainda não criou as tabelas novas, execute a migração 001 conforme o README.</p>}
    <section className="stat-grid"><StatCard icon="▣" titulo="Cargas abertas" valor={String(cargas.filter(c=>c.status==='ABERTA').length)} detalhe="Aguardando oportunidades" tom="azul"/><StatCard icon="◷" titulo="Em negociação" valor={String(cargas.filter(c=>c.status==='NEGOCIACAO').length)} detalhe="Aguardando confirmação" tom="laranja"/><StatCard icon="✓" titulo="Entregues" valor={String(cargas.filter(c=>c.status==='ENTREGUE').length)} detalhe="Operações concluídas" tom="verde"/><StatCard icon="📦" titulo="Total de cargas" valor={String(cargas.length)} detalhe="Dados reais do Neon" tom="roxo"/></section>
    <section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>Cargas recentes</h2><Link to="/cliente/cargas" className="dashboard-text-link">Ver todas →</Link></div>{cargas.length?<div className="operation-list">{cargas.slice(0,5).map(c=><div className="operation-row" key={c.id_carga}><div><strong>#{c.id_carga} — {c.origem} → {c.destino}</strong><p>{c.descricao}</p></div><span className="status-pill transporte">{c.status}</span></div>)}</div>:<p>Você ainda não cadastrou cargas.</p>}</section>
    <section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>Acesso rápido</h2></div><div className="quick-actions-grid"><Link className="quick-action-card" to="/cliente/cargas#nova"><strong>＋ Nova carga</strong><span>Cadastre uma encomenda</span></Link><Link className="quick-action-card" to="/cliente/transporte"><strong>◉ Encontrar transporte</strong><span>Viagens disponíveis</span></Link><Link className="quick-action-card" to="/cliente/cargas"><strong>▣ Minhas cargas</strong><span>Acompanhe os cadastros</span></Link></div></section>
  </DashboardLayout>;
}

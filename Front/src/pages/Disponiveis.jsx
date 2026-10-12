import {useEffect,useState} from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
export default function Disponiveis({tipo}){
  const {usuario}=useAuth();const viagens=tipo==='viagens';const [items,setItems]=useState([]),[erro,setErro]=useState(''),[busca,setBusca]=useState('');
  useEffect(()=>{let alive=true;api(viagens?'/viagens/disponiveis':'/cargas/disponiveis').then(data=>{if(alive)setItems(data[viagens?'viagens':'cargas']);}).catch(e=>{if(alive)setErro(e.message);});return()=>{alive=false;};},[viagens]);
  const filtered=items.filter(x=>`${x.origem} ${x.destino}`.toLowerCase().includes(busca.toLowerCase()));
  return <DashboardLayout tipo={viagens?'cliente':'transportadora'} nome={usuario.nome}><section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">OPORTUNIDADES</span><h1>{viagens?'Viagens disponíveis':'Cargas disponíveis'}</h1><p>Consulte rotas publicadas no banco compartilhado. A negociação entre as partes ainda será desenvolvida.</p></div></section><section className="dashboard-panel"><label className="operation-search">Buscar origem ou destino<input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Ex.: Curitiba"/></label><p role="alert">{erro}</p><div className="operation-list">{filtered.length?filtered.map(item=><article className="operation-row" key={viagens?item.id_viagem:item.id_carga}><div><strong>{item.origem} → {item.destino}</strong><p>{viagens?`${item.data_saida} · ${item.veiculo} · ${item.capacidade_m3} m³`:`${item.descricao} · ${item.volume_m3} m³`}</p></div><span className="status-pill transporte">{item.status}</span></article>):<p>Nenhuma oportunidade encontrada.</p>}</div></section></DashboardLayout>;
}

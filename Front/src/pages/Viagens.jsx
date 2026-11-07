import {useCallback,useEffect,useState} from 'react';
import {useLocation} from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
const initial={origem:'',destino:'',data_saida:'',veiculo:'',capacidade_m3:''};
export default function Viagens(){
  const {usuario}=useAuth(),location=useLocation();
  const [viagens,setViagens]=useState([]),[form,setForm]=useState(initial),[mensagem,setMensagem]=useState(''),[loading,setLoading]=useState(true);
  const carregar=useCallback(async()=>{try{const d=await api('/viagens/minhas');setViagens(d.viagens);}catch(e){setMensagem(e.message);}finally{setLoading(false);}},[]);
  useEffect(()=>{
    let active=true;
    api('/viagens/minhas').then(d=>{if(active)setViagens(d.viagens);}).catch(e=>{if(active)setMensagem(e.message);}).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[]);
  useEffect(()=>{if(location.hash==='#nova')document.getElementById('nova')?.scrollIntoView({behavior:'smooth'});},[location.hash]);
  async function salvar(e){e.preventDefault();setMensagem('');try{await api('/viagens',{method:'POST',body:form});setForm(initial);setMensagem('Viagem cadastrada com sucesso.');await carregar();}catch(error){setMensagem(error.message);}}
  async function atualizar(id,status){try{await api(`/viagens/${id}/status`,{method:'PATCH',body:{status}});await carregar();}catch(error){setMensagem(error.message);}}
  return <DashboardLayout tipo="transportadora" nome={usuario.nome}><section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">PLANEJAMENTO</span><h1>Minhas viagens</h1><p>Rotas, veículos e capacidade disponíveis.</p></div></section>
    <section className="dashboard-panel" id="nova"><div className="dashboard-panel-heading"><h2>＋ Cadastrar viagem</h2></div><form className="operation-form" onSubmit={salvar}>
      {[['origem','Origem'],['destino','Destino'],['veiculo','Tipo de veículo']].map(([key,label])=><label key={key}>{label}<input required maxLength={key==='veiculo'?80:120} value={form[key]} onChange={e=>setForm(v=>({...v,[key]:e.target.value}))}/></label>)}
      <label>Data de saída<input type="date" required value={form.data_saida} onChange={e=>setForm(v=>({...v,data_saida:e.target.value}))}/></label><label>Capacidade disponível (m³)<input type="number" min="0.01" step="0.01" required value={form.capacidade_m3} onChange={e=>setForm(v=>({...v,capacidade_m3:e.target.value}))}/></label><button type="submit" className="dashboard-primary-button">Salvar viagem</button></form><p role="status" className="operation-feedback">{mensagem}</p></section>
    <section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>Viagens cadastradas</h2></div>{loading?<p>Carregando...</p>:viagens.length?<div className="operation-list">{viagens.map(v=><article className="operation-row" key={v.id_viagem}><div><strong>#{v.id_viagem} — {v.origem} → {v.destino}</strong><p>{v.data_saida} · {v.veiculo} · {v.capacidade_m3} m³</p></div><span className="status-pill transporte">{v.status.replace('_',' ')}</span>{v.status==='AGENDADA'&&<><button onClick={()=>atualizar(v.id_viagem,'EM_ANDAMENTO')}>Iniciar</button><button onClick={()=>atualizar(v.id_viagem,'CANCELADA')}>Cancelar</button></>}{v.status==='EM_ANDAMENTO'&&<button onClick={()=>atualizar(v.id_viagem,'CONCLUIDA')}>Concluir</button>}</article>)}</div>:<p>Nenhuma viagem cadastrada.</p>}</section>
  </DashboardLayout>;
}

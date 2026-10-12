import {useCallback,useEffect,useState} from 'react';
import {useLocation} from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
const initial={origem:'',destino:'',descricao:'',volume_m3:''};
export default function Cargas(){
  const {usuario}=useAuth();const location=useLocation();
  const [cargas,setCargas]=useState([]),[form,setForm]=useState(initial),[mensagem,setMensagem]=useState(''),[loading,setLoading]=useState(true);
  const carregar=useCallback(async()=>{try{const d=await api('/cargas/minhas');setCargas(d.cargas);}catch(e){setMensagem(e.message);}finally{setLoading(false);}},[]);
  useEffect(()=>{
    let active=true;
    api('/cargas/minhas').then(d=>{if(active)setCargas(d.cargas);}).catch(e=>{if(active)setMensagem(e.message);}).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[]);
  useEffect(()=>{if(location.hash==='#nova')document.getElementById('nova')?.scrollIntoView({behavior:'smooth'});},[location.hash]);
  async function salvar(e){e.preventDefault();setMensagem('');try{await api('/cargas',{method:'POST',body:form});setForm(initial);setMensagem('Carga cadastrada no Neon.');await carregar();}catch(error){setMensagem(error.message);}}
  async function cancelar(id){if(!window.confirm('Cancelar esta carga aberta?'))return;try{await api(`/cargas/${id}/cancelar`,{method:'PATCH'});await carregar();}catch(error){setMensagem(error.message);}}
  return <DashboardLayout tipo="cliente" nome={usuario.nome}><section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">OPERAÇÕES</span><h1>Minhas cargas</h1><p>Cadastre e consulte cargas vinculadas à sua conta.</p></div></section>
    <section className="dashboard-panel" id="nova"><div className="dashboard-panel-heading"><h2>＋ Nova carga</h2></div><form className="operation-form" onSubmit={salvar}>
      {[['origem','Origem'],['destino','Destino'],['descricao','Descrição da carga']].map(([key,label])=><label key={key}>{label}<input required maxLength={key==='descricao'?300:120} value={form[key]} onChange={e=>setForm(v=>({...v,[key]:e.target.value}))}/></label>)}
      <label>Volume estimado (m³)<input type="number" min="0.01" step="0.01" required value={form.volume_m3} onChange={e=>setForm(v=>({...v,volume_m3:e.target.value}))}/></label><button className="dashboard-primary-button" type="submit">Cadastrar carga</button></form><p role="status" className="operation-feedback">{mensagem}</p></section>
    <section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>Minhas cargas cadastradas</h2></div>{loading?<p>Carregando...</p>:cargas.length?<div className="operation-list">{cargas.map(c=><article className="operation-row" key={c.id_carga}><div><strong>#{c.id_carga} — {c.origem} → {c.destino}</strong><p>{c.descricao} · {c.volume_m3} m³</p></div><span className="status-pill transporte">{c.status}</span>{c.status==='ABERTA'&&<button type="button" onClick={()=>cancelar(c.id_carga)}>Cancelar</button>}</article>)}</div>:<p>Nenhuma carga cadastrada. Cadastre a primeira acima.</p>}</section>
  </DashboardLayout>;
}

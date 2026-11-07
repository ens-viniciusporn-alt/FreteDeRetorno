import {useEffect,useMemo,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
import '../styles/negociacao.css';

const normal=s=>String(s||'').toLocaleLowerCase('pt-BR');
export default function Disponiveis({tipo}){
  const {usuario}=useAuth();const navigate=useNavigate();const viagens=tipo==='viagens';
  const [items,setItems]=useState([]),[minhas,setMinhas]=useState([]),[busca,setBusca]=useState(''),[origem,setOrigem]=useState(''),[destino,setDestino]=useState(''),[volume,setVolume]=useState(''),[ordem,setOrdem]=useState('recentes');
  const [escolhas,setEscolhas]=useState({}),[erro,setErro]=useState(''),[ocupado,setOcupado]=useState(''),[carregando,setCarregando]=useState(true),[atalho,setAtalho]=useState('todos');
  useEffect(()=>{let ativo=true;async function carregar(){try{
    const [ofertas,proprias]=await Promise.all([api(viagens?'/viagens/disponiveis':'/cargas/disponiveis'),viagens?api('/cargas/minhas'):Promise.resolve({cargas:[]})]);
    if(!ativo)return;setItems(ofertas[viagens?'viagens':'cargas']||[]);setMinhas((proprias.cargas||[]).filter(c=>c.status==='ABERTA'));
  }catch(e){if(ativo)setErro(e.message);}finally{if(ativo)setCarregando(false);}}carregar();return()=>{ativo=false;};},[viagens]);
  const filtrados=useMemo(()=>{
    let list=items.filter(x=>{
      const n=Number(x[viagens?'capacidade_m3':'volume_m3']);
      if(atalho==='pequenas'&&n>10)return false;
      if(atalho==='grandes'&&n<=10)return false;
      return normal(`${x.origem} ${x.destino} ${x.descricao||''} ${x.veiculo||''}`).includes(normal(busca))&&normal(x.origem).includes(normal(origem))&&normal(x.destino).includes(normal(destino))&&(!volume||n>=Number(volume));
    });
    return [...list].sort((a,b)=>ordem==='rota'?String(a.origem).localeCompare(String(b.origem),'pt-BR'):viagens?String(a.data_saida).localeCompare(String(b.data_saida)):Number(b.id_carga)-Number(a.id_carga));
  },[items,viagens,busca,origem,destino,volume,ordem,atalho]);
  async function conversar(item){setErro('');setOcupado(String(viagens?item.id_viagem:item.id_carga));try{
    const result=viagens?await api('/chats-demo/iniciar-viagem',{method:'POST',body:{id_viagem:item.id_viagem,id_carga:Number(escolhas[item.id_viagem])}}):await api('/chats-demo/iniciar-carga',{method:'POST',body:{id_carga:item.id_carga}});
    navigate(`/${viagens?'cliente':'transportadora'}/chats?conversa=${result.conversa.id_conversa}`);
  }catch(e){setErro(e.message);}finally{setOcupado('');}}
  return <DashboardLayout tipo={viagens?'cliente':'transportadora'} nome={usuario.nome}>
    <section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">ENCONTRE OPORTUNIDADES</span><h1>{viagens?'Encontre transporte':'Cargas disponíveis'}</h1><p>{viagens?'Consulte viagens com capacidade e converse com a transportadora.':'Pesquise cargas, compare rotas e negocie diretamente com o cliente no chat.'}</p></div></section>
    <div className="neg-v2-sumarios"><div><strong>{items.length}</strong><span>{viagens?'Viagens anunciadas':'Cargas anunciadas'}</span></div><div><strong>{filtrados.length}</strong><span>Resultados com seus filtros</span></div><div><strong>10%</strong><span>Comissão prevista em contratações finalizadas</span></div></div>
    <section className="dashboard-panel neg-filtros"><div className="dashboard-panel-heading"><h2>Busque a oportunidade certa</h2><span>{filtrados.length} resultado(s)</span></div><div className="neg-v2-atalhos"><button type="button" className={atalho==='todos'?'ativo':''} onClick={()=>setAtalho('todos')}>Todas as cargas</button><button type="button" className={atalho==='pequenas'?'ativo':''} onClick={()=>setAtalho('pequenas')}>Até 10 m³</button><button type="button" className={atalho==='grandes'?'ativo':''} onClick={()=>setAtalho('grandes')}>Acima de 10 m³</button></div>
      <div className="neg-filtros-grid">
        <label>Pesquisa geral<input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Carga, cidade, tipo de veículo..."/></label>
        <label>Origem<input value={origem} onChange={e=>setOrigem(e.target.value)} placeholder="Cidade de origem"/></label>
        <label>Destino<input value={destino} onChange={e=>setDestino(e.target.value)} placeholder="Cidade de destino"/></label>
        <label>Volume mínimo (m³)<input type="number" min="0" step="0.1" value={volume} onChange={e=>setVolume(e.target.value)} placeholder="Qualquer"/></label>
        <label>Ordenar<select value={ordem} onChange={e=>setOrdem(e.target.value)}><option value="recentes">{viagens?'Saída mais próxima':'Mais recentes'}</option><option value="rota">Origem (A–Z)</option></select></label>
      </div><button className="neg-link" type="button" onClick={()=>{setBusca('');setOrigem('');setDestino('');setVolume('');setOrdem('recentes');setAtalho('todos');}}>Limpar filtros</button>
    </section>
    {erro&&<p className="neg-alerta" role="alert">{erro}</p>}
    <section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>{viagens?'Viagens disponíveis':'Oportunidades de frete'}</h2></div>
      {carregando?<p>Buscando oportunidades...</p>:filtrados.length===0?<p>Nenhum resultado. Experimente outros filtros.</p>:
      <div className="neg-lista">{filtrados.map(item=><article className="neg-oferta" key={viagens?item.id_viagem:item.id_carga}>
        <div className="neg-oferta-info"><div className="neg-oferta-topo"><span className="neg-tag">{viagens?'VIAGEM':'CARGA'} #{viagens?item.id_viagem:item.id_carga}</span><span className="neg-tag neg-tag-verde">{item.status}</span></div>
          <h3>{item.origem} <span aria-hidden="true">→</span> {item.destino}</h3>
          <p>{viagens?`Veículo: ${item.veiculo} · Saída: ${item.data_saida}`:item.descricao}</p><p className="neg-v2-oferta-segura">🛡️ Negociação protegida dentro da plataforma</p><small>{viagens?'Capacidade anunciada':'Volume da carga'}: <strong>{Number(item[viagens?'capacidade_m3':'volume_m3']).toLocaleString('pt-BR')} m³</strong></small>
        </div><div className="neg-oferta-acoes">
          {viagens&&<label>Sua carga<select value={escolhas[item.id_viagem]||''} onChange={e=>setEscolhas(v=>({...v,[item.id_viagem]:e.target.value}))}><option value="">Escolha uma carga aberta</option>{minhas.filter(c=>Number(c.volume_m3)<=Number(item.capacidade_m3)).map(c=><option value={c.id_carga} key={c.id_carga}>#{c.id_carga} · {c.origem} → {c.destino}</option>)}</select></label>}
          <button className="dashboard-primary-button" disabled={Boolean(ocupado)||(viagens&&!escolhas[item.id_viagem])} onClick={()=>conversar(item)}>{ocupado===String(viagens?item.id_viagem:item.id_carga)?'Abrindo...':viagens?'Entrar em contato':'Entrar em contato'}</button>
        </div>
      </article>)}</div>}
    </section>
  </DashboardLayout>;
}

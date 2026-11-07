import {useCallback,useEffect,useMemo,useState} from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
import '../styles/pagamentos.css';

const rotulos={PROPOSTO:'Aguardando transportadora',ACEITO:'Aguardando garantia de teste',GARANTIDO_SIMULADO:'Garantia simulada',ENTREGA_INFORMADA:'Entrega informada',LIBERADO_SIMULADO:'Liberação simulada',EM_DISPUTA:'Em disputa',CANCELADO:'Cancelado'};
const acoes={
  CLIENTE:{PROPOSTO:[['cancelar','Cancelar proposta']],ACEITO:[['simular_garantia','Simular garantia'],['cancelar','Cancelar']],GARANTIDO_SIMULADO:[['abrir_disputa','Abrir disputa']],ENTREGA_INFORMADA:[['simular_liberacao','Simular liberação'],['abrir_disputa','Abrir disputa']]},
  TRANSPORTADORA:{PROPOSTO:[['aceitar','Aceitar proposta'],['rejeitar','Rejeitar']],GARANTIDO_SIMULADO:[['informar_entrega','Informar entrega'],['abrir_disputa','Abrir disputa']],ENTREGA_INFORMADA:[['abrir_disputa','Abrir disputa']]}
};
const moeda=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n)/100);
const data=s=>new Date(s).toLocaleString('pt-BR');
export default function Pagamentos(){
  const {usuario}=useAuth();
  const tipo=usuario.tipo_usuario,cliente=tipo==='CLIENTE';
  const [contratos,setContratos]=useState([]),[cargas,setCargas]=useState([]),[viagens,setViagens]=useState([]);
  const [form,setForm]=useState({id_carga:'',id_viagem:'',valor_reais:'',descricao_acordo:''});
  const [erro,setErro]=useState(''),[aviso,setAviso]=useState(''),[ocupado,setOcupado]=useState(false),[carregando,setCarregando]=useState(true);
  const [historicos,setHistoricos]=useState({});
  const carregar=useCallback(async()=>{
    const r=await api('/pagamentos-demo/meus');setContratos(r.contratos);
    if(cliente){
      const [c,v]=await Promise.all([api('/cargas/minhas'),api('/viagens/disponiveis')]);
      setCargas(c.cargas.filter(x=>x.status==='ABERTA'));
      setViagens(v.viagens);
    }
  },[cliente]);
  useEffect(()=>{let ativo=true;carregar().catch(e=>{if(ativo)setErro(e.message);}).finally(()=>{if(ativo)setCarregando(false);});return()=>{ativo=false;};},[carregar]);
  const selecionada=useMemo(()=>cargas.find(x=>String(x.id_carga)===form.id_carga),[cargas,form.id_carga]);
  const disponiveis=useMemo(()=>viagens.filter(x=>!selecionada||Number(x.capacidade_m3)>=Number(selecionada.volume_m3)),[viagens,selecionada]);
  async function criar(e){e.preventDefault();setErro('');setAviso('');setOcupado(true);
    try{await api('/pagamentos-demo',{method:'POST',body:form});setForm({id_carga:'',id_viagem:'',valor_reais:'',descricao_acordo:''});await carregar();setAviso('Proposta de contratação simulada criada. Nenhum valor foi cobrado.');}
    catch(e){setErro(e.message);}finally{setOcupado(false);}
  }
  async function agir(contrato,acao){
    const descricoes={simular_garantia:'CONFIRMAÇÃO DE TESTE: isso NÃO cobra nem retém dinheiro real. Continuar?',simular_liberacao:'CONFIRMAÇÃO DE TESTE: isso NÃO transfere dinheiro real. Continuar?',abrir_disputa:'Abrir uma disputa simulada? O fluxo ficará suspenso.',cancelar:'Cancelar esta proposta?',rejeitar:'Rejeitar esta proposta?',informar_entrega:'Informar que a entrega foi concluída?',aceitar:'Aceitar as condições desta proposta?'};
    if(!window.confirm(descricoes[acao]))return;
    setErro('');setAviso('');setOcupado(true);
    try{await api(`/pagamentos-demo/${contrato.id_contrato}/${acao}`,{method:'POST'});await carregar();setAviso('Operação registrada no histórico de testes.');}
    catch(e){setErro(e.message);}finally{setOcupado(false);}
  }
  async function historico(id){
    if(historicos[id]){setHistoricos(h=>({...h,[id]:null}));return;}
    try{const r=await api(`/pagamentos-demo/${id}/eventos`);setHistoricos(h=>({...h,[id]:r.eventos}));}catch(e){setErro(e.message);}
  }
  return <DashboardLayout tipo={cliente?'cliente':'transportadora'} nome={usuario.nome}>
    <section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">CONTRATAÇÕES E PAGAMENTOS</span><h1>Pagamentos e garantias</h1><p>Organize propostas, acompanhe entregas e confira o histórico da operação.</p></div></section>
    <aside className="pag-demo-aviso" role="note"><strong>AMBIENTE DE DEMONSTRAÇÃO — NÃO MOVIMENTA DINHEIRO</strong><p>Os valores abaixo são fictícios. “Garantir” e “Liberar” apenas mudam o estado de teste; não existe cobrança, custódia, PIX, estorno ou repasse. Não use para fretes reais.</p></aside>
    {cliente&&<section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>Nova proposta de frete</h2></div>
      <p className="pag-demo-explicacao">Escolha uma carga sua e uma viagem anunciada. Confirme a compatibilidade da rota e condições com o transportador antes de qualquer contratação real.</p>
      <form className="pag-demo-form" onSubmit={criar}>
        <label>Minha carga<select required value={form.id_carga} onChange={e=>setForm(x=>({...x,id_carga:e.target.value,id_viagem:''}))}><option value="">Selecione uma carga aberta</option>{cargas.map(c=><option key={c.id_carga} value={c.id_carga}>#{c.id_carga} — {c.origem} → {c.destino} ({c.volume_m3} m³)</option>)}</select></label>
        <label>Viagem disponível<select required value={form.id_viagem} onChange={e=>setForm(x=>({...x,id_viagem:e.target.value}))}><option value="">Selecione uma viagem compatível em volume</option>{disponiveis.map(v=><option key={v.id_viagem} value={v.id_viagem}>#{v.id_viagem} — {v.origem} → {v.destino} ({v.capacidade_m3} m³)</option>)}</select></label>
        <label>Valor combinado (R$)<input required value={form.valor_reais} onChange={e=>setForm(x=>({...x,valor_reais:e.target.value}))} inputMode="decimal" placeholder="Ex.: 1500,00" pattern="[0-9]{1,8}(,[0-9]{1,2})?" /></label>
        <label>Condições combinadas (opcional)<textarea maxLength={500} rows={3} value={form.descricao_acordo} onChange={e=>setForm(x=>({...x,descricao_acordo:e.target.value}))} placeholder="Ex.: prazo combinado, tipo da carga, local de entrega"/></label>
        <button disabled={ocupado} className="dashboard-primary-button" type="submit">Criar proposta de teste</button>
      </form>
    </section>}
    <section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>{cliente?'Minhas propostas':'Propostas recebidas'}</h2></div>
      {erro&&<p className="pag-demo-erro" role="alert">{erro}</p>}{aviso&&<p className="pag-demo-sucesso" role="status">{aviso}</p>}
      {carregando?<p>Carregando contratos...</p>:contratos.length===0?<p>Nenhuma contratação simulada cadastrada.</p>:
      <div className="pag-demo-lista">{contratos.map(c=><article className="pag-demo-card" key={c.id_contrato}>
        <div className="pag-demo-titulo"><div><strong>Contrato de teste #{c.id_contrato}</strong><small>Carga #{c.id_carga} · Viagem #{c.id_viagem} · {data(c.criado_em)}</small></div><span className={`pag-demo-status pag-demo-${c.status.toLowerCase()}`}>{rotulos[c.status]||c.status}</span></div>
        <div className="pag-demo-valor">{moeda(c.valor_centavos)} <span>valor fictício</span></div>
        {c.descricao_acordo&&<p className="pag-demo-acordo">Condições: {c.descricao_acordo}</p>}
        <div className="pag-demo-acoes">{(acoes[tipo]?.[c.status]||[]).map(([acao,nome])=><button key={acao} disabled={ocupado} className="pag-demo-botao" type="button" onClick={()=>agir(c,acao)}>{nome}</button>)}<button type="button" className="pag-demo-botao pag-demo-secundario" onClick={()=>historico(c.id_contrato)}>Histórico</button></div>
        {historicos[c.id_contrato]&&<div className="pag-demo-historico"><strong>Registro de eventos</strong><ol>{historicos[c.id_contrato].map(h=><li key={h.id_evento}>{data(h.criado_em)} — {h.acao.replaceAll('_',' ')} ({h.estado_anterior||'início'} → {h.estado_novo})</li>)}</ol></div>}
      </article>)}</div>}
    </section>
    <section className="dashboard-panel"><div className="dashboard-panel-heading"><h2>Como funcionaria com pagamentos reais?</h2></div><ol className="pag-demo-passos"><li>Cliente e transportador acordam o frete e confirmam os dados da operação.</li><li>Parceiro financeiro habilitado cobra e administra os recursos, com registro do CIOT quando aplicável.</li><li>Transportador apresenta comprovação de entrega e o cliente confirma a execução.</li><li>O parceiro realiza o repasse conforme contrato, regras legais e gestão de disputas.</li></ol><p className="pag-demo-explicacao">Nesta versão, as etapas financeiras são apenas simulações. A liberação automática e a resolução de disputas não estão disponíveis.</p></section>
  </DashboardLayout>;
}

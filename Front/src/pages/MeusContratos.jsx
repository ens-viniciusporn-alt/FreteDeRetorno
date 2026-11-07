import {useCallback,useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
import '../styles/meus-contratos.css';

const formatarMoeda=centavos=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(centavos||0)/100);
const formatarData=valor=>valor?new Date(valor).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}):'—';
const textoStatus={
 PROPOSTO:'Aguardando aceite do cliente',
 ACEITO:'Aguardando pagamento de teste',
 GARANTIDO_SIMULADO:'Serviço contratado · aguardando entrega',
 ENTREGA_INFORMADA:'Entrega informada · aguardando cliente',
 LIBERADO_SIMULADO:'Concluído · saldo simulado liberado',
 EM_DISPUTA:'Em disputa · liberação suspensa',
 CANCELADO:'Cancelado',
 REEMBOLSADO_SIMULADO:'Reembolso simulado ao cliente'
};
const ativos=['PROPOSTO','ACEITO','GARANTIDO_SIMULADO','ENTREGA_INFORMADA','EM_DISPUTA'];
const retidos=['GARANTIDO_SIMULADO','ENTREGA_INFORMADA','EM_DISPUTA'];
const estadoVisual={
 PROPOSTO:'Aguardando aceite',ACEITO:'Pagamento pendente',GARANTIDO_SIMULADO:'Em andamento',
 ENTREGA_INFORMADA:'Aguardando confirmação',EM_DISPUTA:'Em disputa',
 LIBERADO_SIMULADO:'Saldo liberado (teste)',REEMBOLSADO_SIMULADO:'Reembolso (teste)',CANCELADO:'Cancelado'
};
function identificarAutor(id,contrato,usuario){
 const v=Number(id);
 if(v===Number(contrato.id_cliente))return v===Number(usuario.id_usuario)?`Cliente — ${usuario.nome}`:'Cliente';
 if(v===Number(contrato.id_transportador))return v===Number(usuario.id_usuario)?`Transportadora — ${usuario.nome}`:'Transportadora';
 return `Usuário #${id}`;
}
function calcular(c){
 const total=Number(c.valor_centavos||0);
 const taxa=Math.round(total*0.10);
 return {total,taxa,repasse:total-taxa};
}

export default function MeusContratos(){
 const {usuario}=useAuth();
 const cliente=usuario.tipo_usuario==='CLIENTE';
 const base=cliente?'/cliente':'/transportadora';
 const [contratos,setContratos]=useState([]);
 const [aba,setAba]=useState('ativos');
 const [busca,setBusca]=useState('');
 const [ocupado,setOcupado]=useState(null);
 const [carregando,setCarregando]=useState(true);
 const [erro,setErro]=useState('');
 const [aviso,setAviso]=useState('');
 const [historicoId,setHistoricoId]=useState(null);
 const [eventos,setEventos]=useState([]);
 const [erroHistorico,setErroHistorico]=useState('');
 const [relato,setRelato]=useState('');
 const [relatos,setRelatos]=useState([]);
 const [relatoId,setRelatoId]=useState(null);

 const atualizar=useCallback(async()=>{
   const resultado=await api('/pagamentos-demo/meus');
   setContratos(resultado.contratos||[]);
 },[]);
 useEffect(()=>{
   let ativo=true;
   api('/pagamentos-demo/meus').then(r=>{if(ativo)setContratos(r.contratos||[]);}).catch(e=>{if(ativo)setErro(e.message||'Não foi possível carregar os contratos.');}).finally(()=>{if(ativo)setCarregando(false);});
   return ()=>{ativo=false;};
 },[]);

 const filtrados=useMemo(()=>contratos.filter(c=>{
   const corresponde=aba==='ativos'?ativos.includes(c.status):!ativos.includes(c.status);
   return corresponde&&String(`${c.id_contrato} ${c.id_carga} ${c.id_viagem} ${c.descricao_acordo||''}`).toLocaleLowerCase('pt-BR').includes(busca.trim().toLocaleLowerCase('pt-BR'));
 }).sort((a,b)=>new Date(b.criado_em)-new Date(a.criado_em)),[contratos,aba,busca]);
 const totais=useMemo(()=>contratos.reduce((acc,c)=>{
   const {taxa,repasse,total}=calcular(c);
   if(ativos.includes(c.status))acc.ativos++;
   if(c.status==='EM_DISPUTA')acc.disputas++;
   if(retidos.includes(c.status))acc.garantia+=total;
   if(c.status==='LIBERADO_SIMULADO'){acc.concluidos++;acc.repasse+=repasse;acc.comissao+=taxa;}
   return acc;
 },{ativos:0,disputas:0,garantia:0,concluidos:0,repasse:0,comissao:0}),[contratos]);

 async function agir(c,acao){
   const confirma={
     informar_entrega:'Você confirma que realizou a entrega? O cliente ainda precisará confirmar o recebimento.',
     simular_liberacao:'Você confirma que recebeu a carga nas condições contratadas? Isto liberará APENAS saldo de demonstração para a transportadora.',
     abrir_disputa:'Deseja informar um problema com este serviço? A liberação simulada ficará suspensa até análise futura.'
   }[acao]||'Deseja confirmar esta ação?';
   if(!window.confirm(confirma))return;
   setOcupado(c.id_contrato);setErro('');setAviso('');
   try{
     await api(`/pagamentos-demo/${c.id_contrato}/${acao}`,{method:'POST'});
     await atualizar();
     setAviso(acao==='informar_entrega'?'Entrega informada. Aguardando confirmação do cliente.':acao==='abrir_disputa'?'Problema registrado. A liberação está suspensa até análise da equipe responsável.':'Recebimento confirmado! O saldo de demonstração foi liberado, descontando a comissão de 10%.');
     if(historicoId===c.id_contrato)await abrirHistorico(c.id_contrato,true);
   }catch(e){setErro(e.message||'Não foi possível concluir esta ação.');}
   finally{setOcupado(null);}
 }
 async function abrirRelatos(id){
   setRelatoId(id);setRelato('');setRelatos([]);setErro('');
   try{const r=await api(`/disputas-demo/${id}`);setRelatos(r.manifestacoes||[]);}catch(e){setErro(e.message||'Não foi possível consultar a disputa.');}
 }
 async function enviarRelato(e,id){
   e.preventDefault();setOcupado(id);setErro('');setAviso('');
   try{await api(`/disputas-demo/${id}/manifestacoes`,{method:'POST',body:{texto:relato}});setAviso('Sua manifestação foi registrada para análise.');await abrirRelatos(id);}catch(e){setErro(e.message||'Não foi possível registrar o relato.');}finally{setOcupado(null);}
 }
 async function abrirHistorico(id,forcar=false){
   if(historicoId===id&&!forcar){setHistoricoId(null);return;}
   setHistoricoId(id);setErroHistorico('');setEventos([]);
   try{const r=await api(`/pagamentos-demo/${id}/eventos`);setEventos(r.eventos||[]);}catch(e){setErroHistorico(e.message||'Histórico indisponível.');}
 }
 return <DashboardLayout tipo={cliente?'cliente':'transportadora'} nome={usuario.nome}>
   <section className="dashboard-page-heading"><div><span className="dashboard-eyebrow">ACOMPANHAMENTO</span><h1>Meus contratos</h1><p>{cliente?'Acompanhe seus fretes, confirme o recebimento e registre problemas.':'Acompanhe os serviços contratados, informe a entrega e consulte os valores previstos.'}</p></div></section>
   <p className="mc-aviso-teste" role="note"><strong>Ambiente de testes:</strong> pagamentos, valores em garantia e saldo são apenas simulações. Nenhum dinheiro real é cobrado, retido, liberado ou sacável.</p>
   <div className="mc-resumo">
     <div className="mc-indicador"><small>Contratos ativos</small><strong>{totais.ativos}</strong><span>Acompanhe suas operações</span></div>
     <div className="mc-indicador"><small>Em garantia (simulado)</small><strong>{formatarMoeda(totais.garantia)}</strong><span>Somente valores de teste</span></div>
     <div className="mc-indicador"><small>{cliente?'Fretes concluídos':'Repasse liberado (simulado)'}</small><strong>{cliente?totais.concluidos:formatarMoeda(totais.repasse)}</strong><span>{cliente?'Recebimentos confirmados':'Depois de descontar 10%'}</span></div>
     <div className="mc-indicador"><small>Em disputa</small><strong>{totais.disputas}</strong><span>Liberação suspensa</span></div>
   </div>
   {erro&&<p role="alert" className="mc-erro">{erro}</p>}{aviso&&<p role="status" className="mc-sucesso">{aviso}</p>}
   <section className="mc-painel">
     <div className="mc-barra"><div className="mc-abas" role="group" aria-label="Filtrar contratos"><button type="button" className={aba==='ativos'?'ativo':''} onClick={()=>setAba('ativos')}>Ativos ({totais.ativos})</button><button type="button" className={aba==='historico'?'ativo':''} onClick={()=>setAba('historico')}>Concluídos e cancelados</button></div><input type="search" aria-label="Pesquisar contratos" placeholder="Pesquisar por número ou condições..." value={busca} onChange={e=>setBusca(e.target.value)}/></div>
     {carregando?<p className="mc-vazio">Carregando contratos...</p>:filtrados.length===0?<div className="mc-vazio"><h2>Nenhum contrato nesta categoria</h2><p>As contratações surgirão aqui depois de uma proposta formal enviada pela conversa.</p><Link to={`${base}/chats`}>Ir para conversas</Link></div>:<div className="mc-lista">{filtrados.map(c=>{
       const {total,taxa,repasse}=calcular(c);const bloqueado=ocupado!==null;
       return <article key={c.id_contrato} className="mc-contrato">
         <div className="mc-topo"><div><small>CONTRATO #{c.id_contrato} · CARGA #{c.id_carga} · VIAGEM #{c.id_viagem}</small><h2>{textoStatus[c.status]||'Em acompanhamento'}</h2><span>Formalizado em {formatarData(c.criado_em)}</span></div><span className={`mc-status ${c.status==='EM_DISPUTA'?'mc-problema':c.status==='LIBERADO_SIMULADO'?'mc-concluido':''}`}>{estadoVisual[c.status]||'Acompanhar'}</span></div>
         <div className="mc-valores"><div><small>Valor acordado</small><strong>{formatarMoeda(total)}</strong></div><div><small>Comissão da plataforma (10%)</small><strong>{formatarMoeda(taxa)}</strong></div><div><small>Repasse previsto (90%)</small><strong>{formatarMoeda(repasse)}</strong></div></div>
         <div className="mc-condicoes"><strong>Condições combinadas:</strong> {c.descricao_acordo||'Sem detalhes adicionais.'}</div>
         {c.status==='GARANTIDO_SIMULADO'&&<p className="mc-etapa">{cliente?'O serviço está contratado. A transportadora deverá informar quando concluir a entrega.':'Contrato em andamento. Ao concluir a entrega, informe o cliente para que ele confirme o recebimento.'}</p>}
         {c.status==='ENTREGA_INFORMADA'&&<p className="mc-etapa">{cliente?'A transportadora informou a entrega. Confira a carga antes de confirmar o recebimento.':'A entrega foi informada. Aguardando a confirmação do cliente.'}</p>}
         {c.status==='EM_DISPUTA'&&<p className="mc-etapa">Este contrato está em disputa. Não é possível liberar o saldo de teste nesta etapa. A equipe responsável analisará os relatos antes de decidir o encaminhamento.</p>}
         {c.status==='LIBERADO_SIMULADO'&&<p className="mc-etapa">Contrato concluído. Repasse simulado de {formatarMoeda(repasse)} e comissão de {formatarMoeda(taxa)} registrados no sistema. Não há saldo real para saque.</p>}
         <div className="mc-acoes">
           {!cliente&&c.status==='GARANTIDO_SIMULADO'&&<button className="mc-primario" type="button" disabled={bloqueado} onClick={()=>agir(c,'informar_entrega')}>Entrega realizada</button>}
           {cliente&&c.status==='ENTREGA_INFORMADA'&&<button className="mc-primario" type="button" disabled={bloqueado} onClick={()=>agir(c,'simular_liberacao')}>Confirmar recebimento</button>}
           {['GARANTIDO_SIMULADO','ENTREGA_INFORMADA'].includes(c.status)&&<button className="mc-secundario" type="button" disabled={bloqueado} onClick={()=>agir(c,'abrir_disputa')}>Informar problema</button>}
           {c.status==='EM_DISPUTA'&&<button className="mc-secundario" type="button" onClick={()=>abrirRelatos(c.id_contrato)}>Apresentar minha versão</button>}
           <button className="mc-secundario" type="button" onClick={()=>abrirHistorico(c.id_contrato)}> {historicoId===c.id_contrato?'Fechar histórico':'Ver histórico'}</button>
           <Link to={`${base}/chats`}>Abrir conversas</Link>
         </div>
         {relatoId===c.id_contrato&&c.status==='EM_DISPUTA'&&<div className="mc-historico"><h3>Manifestação sobre a disputa</h3><p>Relate o que aconteceu, sem enviar contatos, chaves Pix ou dados bancários.</p><form onSubmit={e=>enviarRelato(e,c.id_contrato)}><textarea style={{width:'100%',padding:12,minHeight:95,borderRadius:8,border:'1px solid #b9c8db'}} required minLength={10} maxLength={2000} value={relato} onChange={e=>setRelato(e.target.value)} placeholder="Explique o problema ou a sua versão dos fatos..."/><button type="submit" className="mc-primario" disabled={ocupado!==null||relato.trim().length<10}>Enviar relato</button></form>{relatos.length>0&&<ol>{relatos.map(m=><li key={m.id_manifestacao}><strong>{identificarAutor(m.id_autor,c,usuario)}</strong> — {m.texto}</li>)}</ol>}</div>}
         {historicoId===c.id_contrato&&<div className="mc-historico"><h3>Histórico do contrato</h3>{erroHistorico?<p role="alert">{erroHistorico}</p>:eventos.length?<ol>{eventos.map(ev=><li key={ev.id_evento}><strong>{String(ev.acao||'Registro').replaceAll('_',' ')}</strong> — {formatarData(ev.criado_em)} <span>({ev.estado_anterior||'Início'} → {ev.estado_novo||'—'})</span></li>)}</ol>:<p>Sem registros para exibir.</p>}</div>}
       </article>;
     })}</div>}
   </section>
   <p className="mc-rodape">A confirmação de recebimento libera apenas um <strong>saldo simulado</strong>. O pagamento real, a retenção de recursos e o saque dependem de integração financeira, comprovação de entrega e regras de disputa.</p>
 </DashboardLayout>;
}

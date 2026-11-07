import {useCallback,useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/useAuth';
import {api} from '../utils/api';
import '../styles/admin-disputas.css';
const brl=c=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(c||0)/100);
const dt=v=>v?new Date(v).toLocaleString('pt-BR'):'—';
const papelFormatado={CLIENTE:'Cliente',TRANSPORTADORA:'Transportadora',ADMIN:'Administrador',USUARIO:'Usuário'};
function nomeAutor(id,det){
 const autor=det?.autores?.[String(id)];
 if(!autor)return `Usuário #${id??'?'}`;
 return `${papelFormatado[autor.papel]||'Usuário'} — ${autor.nome}`;
}
const textosAcao={
 SOLICITAR_INFORMACOES:'Solicitar mais informações',
 LIBERAR_SIMULADO:'Liberar saldo simulado à transportadora',
 REEMBOLSAR_SIMULADO:'Registrar reembolso simulado ao cliente'
};
export default function AdminDisputas(){
 const {usuario,sair}=useAuth();const nav=useNavigate();
 const [filtro,setFiltro]=useState('EM_DISPUTA');const [lista,setLista]=useState([]);
 const [selecionado,setSelecionado]=useState(null);const [det,setDet]=useState(null);
 const [acao,setAcao]=useState('SOLICITAR_INFORMACOES');const [just,setJust]=useState('');
 const [manifestacao,setManifestacao]=useState('');const [ocupado,setOcupado]=useState(false);
 const [erro,setErro]=useState('');const [aviso,setAviso]=useState('');const [carregando,setCarregando]=useState(false);
 const [confirmando,setConfirmando]=useState(false);
 const carregar=useCallback(async()=>{
  setCarregando(true);setErro('');
  try{const r=await api(`/disputas-demo/admin?status=${filtro}`);setLista(r.contratos||[]);}catch(e){setErro(e.message);}finally{setCarregando(false);}
 },[filtro]);
 useEffect(()=>{carregar();},[carregar]);
 const abrir=async id=>{
  setSelecionado(id);setDet(null);setErro('');setAviso('');setJust('');setManifestacao('');setConfirmando(false);
  try{setDet(await api(`/disputas-demo/${id}`));}catch(e){setErro(e.message);}
 };
 const enviarManifestacao=async e=>{
  e.preventDefault();if(!selecionado)return;
  setOcupado(true);setErro('');setAviso('');
  try{await api(`/disputas-demo/${selecionado}/manifestacoes`,{method:'POST',body:{texto:manifestacao}});setManifestacao('');setDet(await api(`/disputas-demo/${selecionado}`));setAviso('Registro incluído no histórico.');}
  catch(e){setErro(e.message);}finally{setOcupado(false);}
 };
 const prepararDecisao=e=>{
  e.preventDefault();
  if(!selecionado||!det||ocupado||just.trim().length<20)return;
  setErro('');setAviso('');
  if(acao==='SOLICITAR_INFORMACOES'){
    registrarDecisao();
  }else{
    setConfirmando(true);
  }
 };
 const registrarDecisao=async()=>{
  if(!selecionado||ocupado||just.trim().length<20)return;
  const id=selecionado;
  setConfirmando(false);setOcupado(true);setErro('');setAviso('');
  try{
    const r=await api(`/disputas-demo/${id}/decisao`,{method:'POST',body:{acao,justificativa:just.trim()}});
    setAviso(r.mensagem||'Decisão registrada com sucesso.');setJust('');
    setDet(await api(`/disputas-demo/${id}`));await carregar();
  }catch(e){setErro(e.message||'Não foi possível registrar a decisão.');}finally{setOcupado(false);}
 };
 const c=det?.contrato;const total=Number(c?.valor_centavos||0),taxa=Math.round(total*.1);
 return <div className="adm-page">
  <header className="adm-top"><strong>🚚 Frete de Retorno <span>· Administração</span></strong><div><span>{usuario?.nome}</span><button onClick={async()=>{await sair();nav('/login',{replace:true});}}>Sair</button></div></header>
  <main className="adm-container">
   <div className="adm-hero"><small>PAINEL ADMINISTRATIVO</small><h1>Gestão de disputas</h1><p>Analise reclamações, acompanhe as partes e registre decisões com justificativa.</p></div>
   <p className="adm-simulado"><strong>Ambiente de testes.</strong> Todas as liberações e devoluções são simuladas. Nenhum dinheiro real é movimentado.</p>
   {erro&&<p className="adm-error" role="alert">{erro}</p>}{aviso&&<p className="adm-success" role="status">{aviso}</p>}
   <section className="adm-columns">
    <div className="adm-card"><div className="adm-section-head"><h2>Contratos</h2><button onClick={carregar}>Atualizar</button></div>
     <label htmlFor="adm-filtro">Exibir contratos</label>
     <select id="adm-filtro" value={filtro} onChange={e=>{setFiltro(e.target.value);setSelecionado(null);setDet(null);}}>
      <option value="EM_DISPUTA">Disputas abertas</option><option value="TODOS">Todos os contratos (até 100)</option>
      <option value="LIBERADO_SIMULADO">Liberados em teste</option><option value="REEMBOLSADO_SIMULADO">Reembolsados em teste</option>
     </select>
     {carregando?<p>Carregando...</p>:lista.length===0?<p>Nenhum contrato nesta categoria.</p>:<div className="adm-items">{lista.map(item=><button key={item.id_contrato} className={selecionado===item.id_contrato?'adm-selected':''} onClick={()=>abrir(item.id_contrato)}>
      <strong>Contrato #{item.id_contrato}</strong><span>{item.rota}</span><small>{item.cliente_nome} · {item.transportadora_nome}</small><small>{brl(item.valor_centavos)} · {item.status.replaceAll('_',' ')}</small>
     </button>)}</div>}
    </div>
    <div className="adm-card adm-detail">
     {!selecionado?<div className="adm-empty"><h2>Selecione uma disputa</h2><p>Escolha um contrato à esquerda para consultar as informações e decidir os próximos passos.</p></div>:!det?<p>Carregando informações...</p>:<>
      <div className="adm-section-head"><div><small>CONTRATO #{c.id_contrato}</small><h2>{c.status==='EM_DISPUTA'?'Disputa em análise':'Contrato encerrado'}</h2></div><span className="adm-pill">{c.status.replaceAll('_',' ')}</span></div>
      <div className="adm-metrics"><div><small>Valor do frete</small><strong>{brl(total)}</strong></div><div><small>Comissão 10%</small><strong>{brl(taxa)}</strong></div><div><small>Repasse 90%</small><strong>{brl(total-taxa)}</strong></div></div>
      <p><strong>Condições:</strong> {c.descricao_acordo||'Não informadas'}</p>
      {det.disputa?.solicitacao_admin&&<p className="adm-note"><strong>Mais informações solicitadas:</strong> {det.disputa.solicitacao_admin}</p>}
      {det.disputa?.decisao&&<p className="adm-note"><strong>Decisão:</strong> {det.disputa.decisao.replaceAll('_',' ')} — {det.disputa.justificativa_decisao}</p>}
      <div className="adm-history"><h3>Relatos apresentados</h3>{det.manifestacoes?.length?<ul>{det.manifestacoes.map(m=><li key={m.id_manifestacao}><small><strong>{nomeAutor(m.id_autor,det)}</strong> · {dt(m.criada_em)}</small><p>{m.texto}</p></li>)}</ul>:<p>Nenhuma manifestação registrada até agora.</p>}</div>
      <div className="adm-history"><h3>Histórico do contrato</h3>{det.eventos?.length?<ul>{det.eventos.map(ev=><li key={ev.id_evento}><small>{dt(ev.criado_em)} · <strong>{nomeAutor(ev.id_usuario,det)}</strong></small><p>{String(ev.acao).replaceAll('_',' ')}: {ev.estado_anterior||'início'} → {ev.estado_novo}</p></li>)}</ul>:<p>Nenhum evento.</p>}</div>
      {det.acoes?.length>0&&<div className="adm-history"><h3>Atos da administração</h3><ul>{det.acoes.map(x=><li key={x.id_acao}><small>{nomeAutor(x.id_admin,det)} · {dt(x.criada_em)}</small><p><strong>{textosAcao[x.acao]||x.acao.replaceAll('_',' ')}</strong> — {x.justificativa}</p></li>)}</ul></div>}
      {c.status==='EM_DISPUTA'&&<>
        <form onSubmit={enviarManifestacao} className="adm-form"><h3>Registrar observação</h3><textarea required minLength={10} maxLength={2000} value={manifestacao} onChange={e=>setManifestacao(e.target.value)} placeholder="Registre uma observação administrativa sem dados de contato..."/><button type="submit" disabled={ocupado||manifestacao.trim().length<10}>Adicionar observação</button></form>
        <form onSubmit={prepararDecisao} className="adm-form"><h3>Decisão administrativa</h3><label htmlFor="adm-acao">Ação</label><select id="adm-acao" value={acao} onChange={e=>{setAcao(e.target.value);setConfirmando(false);}}><option value="SOLICITAR_INFORMACOES">Solicitar mais informações</option><option value="LIBERAR_SIMULADO">Liberar 90% à transportadora (teste)</option><option value="REEMBOLSAR_SIMULADO">Devolver 100% ao cliente (teste)</option></select><label htmlFor="adm-just">Justificativa obrigatória</label><textarea id="adm-just" required minLength={20} maxLength={1500} value={just} onChange={e=>setJust(e.target.value)} placeholder="Explique as evidências consideradas e o fundamento da decisão..."/><button className="adm-primary" type="submit" disabled={ocupado||just.trim().length<20}>{ocupado?'Salvando...':'Registrar decisão'}</button><small>A decisão final não poderá ser revertida pela interface. Confira todas as informações.</small></form>
        {confirmando&&<div className="adm-confirmacao" role="group" aria-label="Confirmar decisão final">
          <h3>Confirmar encerramento da disputa?</h3>
          <p><strong>{textosAcao[acao]}</strong> — Contrato #{c.id_contrato}.</p>
          {acao==='LIBERAR_SIMULADO'?<p>Repasse simulado: <strong>{brl(total-taxa)}</strong> · Comissão: <strong>{brl(taxa)}</strong>.</p>:<p>Reembolso total simulado: <strong>{brl(total)}</strong>, sem comissão.</p>}
          <p>Esta decisão será registrada e não poderá ser revertida pela interface. Nenhum dinheiro real será movimentado.</p>
          <div className="adm-confirmacao-botoes"><button type="button" disabled={ocupado} onClick={()=>setConfirmando(false)}>Voltar e revisar</button><button type="button" className="adm-primary" disabled={ocupado} onClick={registrarDecisao}>{ocupado?'Registrando...':'Confirmar decisão'}</button></div>
        </div>}
      </>}
     </>}
    </div>
   </section>
  </main>
 </div>;
}

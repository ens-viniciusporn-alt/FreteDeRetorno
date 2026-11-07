// Módulo de mediação apenas para testes: não acessa provedores de pagamento e não transfere dinheiro.
const {Op}=require('sequelize');
const db=require('../config/database');
const Contrato=require('../models/ContratoDemo');
const Disputa=require('../models/DisputaDemo');
const Manifestacao=require('../models/ManifestacaoDisputaDemo');
const AcaoAdmin=require('../models/AcaoAdminDisputaDemo');
const Evento=require('../models/EventoContratoDemo');
const Usuario=require('../models/Usuario');
const Carga=require('../models/Carga');
const {positiveId}=require('../utils/validate');
const blockContact=require('../utils/blockContact');
const bad=(res,code,msg)=>res.status(code).json({erro:msg});
const isAdmin=u=>u.tipo_usuario==='ADMIN';
const own=(c,u)=>Number(c.id_cliente)===Number(u.id_usuario)||Number(c.id_transportador)===Number(u.id_usuario);
function publicCase(c){const data=c.toJSON?c.toJSON():c;return {...data,valor_centavos:Number(data.valor_centavos)};}
async function ensure(c,t){
  const [d]=await Disputa.findOrCreate({where:{id_contrato:c.id_contrato},defaults:{situacao:'ABERTA'},transaction:t});
  return d;
}
async function listar(req,res,next){
 try{
   const status=String(req.query.status||'EM_DISPUTA');
   const where=status==='TODOS'?{status:{[Op.in]:['EM_DISPUTA','LIBERADO_SIMULADO','REEMBOLSADO_SIMULADO']}}:{status};
   if(!['TODOS','EM_DISPUTA','LIBERADO_SIMULADO','REEMBOLSADO_SIMULADO'].includes(status))return bad(res,400,'Filtro inválido.');
   const list=await Contrato.findAll({where,order:[['atualizado_em','DESC']],limit:100});
   const ids=list.map(c=>c.id_contrato);
   const disputas=ids.length?await Disputa.findAll({where:{id_contrato:{[Op.in]:ids}}}):[];
   const map=new Map(disputas.map(d=>[String(d.id_contrato),d]));
   const rows=await Promise.all(list.map(async c=>{
     const [cliente,transportadora,carga]=await Promise.all([
       Usuario.findByPk(c.id_cliente,{attributes:['nome']}),
       Usuario.findByPk(c.id_transportador,{attributes:['nome']}),
       Carga.findByPk(c.id_carga,{attributes:['origem','destino','descricao']})
     ]);
     return {...publicCase(c),cliente_nome:cliente?.nome||'Cliente',transportadora_nome:transportadora?.nome||'Transportadora',rota:carga?`${carga.origem} → ${carga.destino}`:'Carga',disputa:map.get(String(c.id_contrato))||null};
   }));
   res.json({contratos:rows,ambiente:'SIMULADO'});
 }catch(e){next(e)}
}
async function detalhes(req,res,next){
 try{
  const id=positiveId(req.params.id);if(!id)return bad(res,400,'Contrato inválido.');
  const c=await Contrato.findByPk(id);
  if(!c||(!isAdmin(req.usuario)&&!own(c,req.usuario)))return bad(res,404,'Contrato não encontrado.');
  if(!['EM_DISPUTA','LIBERADO_SIMULADO','REEMBOLSADO_SIMULADO'].includes(c.status))return bad(res,409,'O contrato não está em disputa.');
  const disputa=await Disputa.findOne({where:{id_contrato:id}});
  const [manifestacoes,acoes,eventos]=await Promise.all([
    disputa?Manifestacao.findAll({where:{id_disputa:disputa.id_disputa},order:[['id_manifestacao','ASC']],limit:100}):[],
    isAdmin(req.usuario)&&disputa?AcaoAdmin.findAll({where:{id_disputa:disputa.id_disputa},order:[['id_acao','ASC']],limit:100}):[],
    Evento.findAll({where:{id_contrato:id},order:[['id_evento','ASC']],limit:100})
  ]);
  // Identificação pública dos autores (somente nome e papel, sem dados privados).
  const idsAutores=[c.id_cliente,c.id_transportador,...manifestacoes.map(m=>m.id_autor),...eventos.map(e=>e.id_usuario),...acoes.map(a=>a.id_admin)]
    .map(Number).filter(Number.isSafeInteger);
  const usuarios=idsAutores.length?await Usuario.findAll({
    where:{id_usuario:{[Op.in]:[...new Set(idsAutores)]}},
    attributes:['id_usuario','nome','tipo_usuario']
  }):[];
  const autores={};
  for(const u of usuarios){
    const papel=Number(u.id_usuario)===Number(c.id_cliente)?'CLIENTE':
      Number(u.id_usuario)===Number(c.id_transportador)?'TRANSPORTADORA':
      u.tipo_usuario==='ADMIN'?'ADMIN':'USUARIO';
    autores[String(u.id_usuario)]={nome:u.nome,papel};
  }
  res.json({contrato:publicCase(c),disputa,manifestacoes,acoes,eventos,autores,ambiente:'SIMULADO'});
 }catch(e){next(e)}
}
async function manifestar(req,res,next){
 const id=positiveId(req.params.id);const texto=typeof req.body?.texto==='string'?req.body.texto.trim():'';
 if(!id||texto.length<10||texto.length>2000)return bad(res,400,'Escreva de 10 a 2000 caracteres.');
 if(blockContact(texto))return bad(res,422,'Não compartilhe telefones, e-mails, links ou dados financeiros.');
 try{
  const result=await db.transaction(async transaction=>{
   const c=await Contrato.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});
   if(!c||(!isAdmin(req.usuario)&&!own(c,req.usuario)))return {code:404,msg:'Contrato não encontrado.'};
   if(c.status!=='EM_DISPUTA')return {code:409,msg:'Este contrato não tem uma disputa aberta.'};
   const d=await ensure(c,transaction);
   await Manifestacao.create({id_disputa:d.id_disputa,id_autor:req.usuario.id_usuario,texto},{transaction});
   return {ok:true};
  });
  if(result.code)return bad(res,result.code,result.msg);
  res.status(201).json({mensagem:'Informação registrada para análise.'});
 }catch(e){next(e)}
}
async function decidir(req,res,next){
 const id=positiveId(req.params.id);const acao=req.body?.acao;
 const justificativa=typeof req.body?.justificativa==='string'?req.body.justificativa.trim():'';
 if(!id||!['SOLICITAR_INFORMACOES','LIBERAR_SIMULADO','REEMBOLSAR_SIMULADO'].includes(acao))return bad(res,400,'Ação inválida.');
 if(justificativa.length<20||justificativa.length>1500)return bad(res,400,'Justifique a decisão com 20 a 1500 caracteres.');
 try{
  const result=await db.transaction(async transaction=>{
   const c=await Contrato.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});
   if(!c)return {code:404,msg:'Contrato não encontrado.'};
   if(c.status!=='EM_DISPUTA')return {code:409,msg:'Esta disputa já foi encerrada ou não está aberta.'};
   const d=await ensure(c,transaction);
   if(acao==='SOLICITAR_INFORMACOES'){
     d.situacao='MAIS_INFORMACOES';d.solicitacao_admin=justificativa;
   } else {
     d.situacao='RESOLVIDA';d.decisao=acao;d.justificativa_decisao=justificativa;
     d.resolvida_por=req.usuario.id_usuario;d.resolvida_em=new Date();
     c.status=acao==='LIBERAR_SIMULADO'?'LIBERADO_SIMULADO':'REEMBOLSADO_SIMULADO';
     c.atualizado_em=new Date();await c.save({transaction});
     await Evento.create({id_contrato:c.id_contrato,id_usuario:req.usuario.id_usuario,acao:acao==='LIBERAR_SIMULADO'?'admin_liberou_demo':'admin_reembolsou_demo',estado_anterior:'EM_DISPUTA',estado_novo:c.status,criado_em:new Date()},{transaction});
   }
   d.atualizado_em=new Date();await d.save({transaction});
   await AcaoAdmin.create({id_disputa:d.id_disputa,id_admin:req.usuario.id_usuario,acao,justificativa},{transaction});
   return {status:c.status};
  });
  if(result.code)return bad(res,result.code,result.msg);
  res.json({mensagem:acao==='SOLICITAR_INFORMACOES'?'Solicitação de informações registrada.':'Disputa encerrada na simulação.',status:result.status,ambiente:'SIMULADO_SEM_DINHEIRO_REAL'});
 }catch(e){next(e)}
}
module.exports={listar,detalhes,manifestar,decidir};

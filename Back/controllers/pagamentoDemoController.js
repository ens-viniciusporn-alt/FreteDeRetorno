// Fluxo contratual SIMULADO. NUNCA efetua cobranças, PIX, custódia ou repasses reais.
const {Op} = require('sequelize');
const sequelize=require('../config/database');
const Carga=require('../models/Carga');
const Viagem=require('../models/Viagem');
const Contrato=require('../models/ContratoDemo');
const Evento=require('../models/EventoContratoDemo');
const {positiveId}=require('../utils/validate');

function reaisParaCentavos(input){
  if(typeof input!=='string' || !/^\d{1,8}(,\d{1,2})?$/.test(input.trim()))return null;
  const [reais,centavos='']=input.trim().split(',');
  const n=Number(reais)*100+Number(centavos.padEnd(2,'0'));
  return Number.isSafeInteger(n) && n>=100 && n<=10000000000 ? n : null;
}
const rules={
  rejeitar:{from:['PROPOSTO'],to:'CANCELADO',role:'CLIENTE'},
  cancelar:{from:['PROPOSTO','ACEITO'],to:'CANCELADO',role:'TRANSPORTADORA'},
  informar_entrega:{from:['GARANTIDO_SIMULADO'],to:'ENTREGA_INFORMADA',role:'TRANSPORTADORA'},
  simular_liberacao:{from:['ENTREGA_INFORMADA'],to:'LIBERADO_SIMULADO',role:'CLIENTE'},
  abrir_disputa:{from:['GARANTIDO_SIMULADO','ENTREGA_INFORMADA'],to:'EM_DISPUTA',role:null},
};
function proximoEstado(status,acao,role){
  const rule=rules[acao];
  return rule && (!rule.role || rule.role===role) && rule.from.includes(status)?rule.to:null;
}
function expose(c){
  const o=c.toJSON?c.toJSON():c;
  return {...o,valor_centavos:Number(o.valor_centavos),ambiente:'DEMONSTRACAO_SEM_DINHEIRO_REAL'};
}
async function registrar(transaction,contrato,usuarioId,acao,antes,depois){
  await Evento.create({id_contrato:contrato.id_contrato,id_usuario:usuarioId,acao,estado_anterior:antes,estado_novo:depois},{transaction});
}
async function mine(req,res,next){
  try{
    const campo=req.usuario.tipo_usuario==='CLIENTE'?'id_cliente':'id_transportador';
    const contratos=await Contrato.findAll({where:{[campo]:req.usuario.id_usuario},order:[['criado_em','DESC']],limit:100});
    res.json({ambiente:'SIMULADO',contratos:contratos.map(expose)});
  }catch(e){next(e);}
}
async function criar(req,res,next){
  const idCarga=positiveId(req.body?.id_carga),idViagem=positiveId(req.body?.id_viagem);
  const valor=reaisParaCentavos(req.body?.valor_reais);
  const descricao=typeof req.body?.descricao_acordo==='string'?req.body.descricao_acordo.trim():'';
  if(!idCarga||!idViagem||!valor||descricao.length>500)
    return res.status(400).json({erro:'Selecione carga, viagem e valor entre R$ 1,00 e R$ 100.000.000,00. Informe no formato 1500,00.'});
  try{
    const result=await sequelize.transaction(async transaction=>{
      const carga=await Carga.findOne({where:{id_carga:idCarga,id_cliente:req.usuario.id_usuario},transaction,lock:transaction.LOCK.UPDATE});
      const viagem=await Viagem.findByPk(idViagem,{transaction,lock:transaction.LOCK.UPDATE});
      if(!carga || carga.status!=='ABERTA')return {error:409,msg:'Carga inexistente ou indisponível.'};
      if(!viagem || viagem.status!=='AGENDADA')return {error:409,msg:'Viagem inexistente ou indisponível.'};
      if(Number(carga.volume_m3)>Number(viagem.capacidade_m3))return {error:409,msg:'O volume da carga ultrapassa a capacidade anunciada.'};
      const existente=await Contrato.findOne({where:{id_carga:idCarga,status:{[Op.ne]:'CANCELADO'}},transaction});
      if(existente)return {error:409,msg:'Esta carga já tem um acordo ativo.'};
      const contrato=await Contrato.create({id_carga:idCarga,id_viagem:idViagem,id_cliente:req.usuario.id_usuario,id_transportador:viagem.id_transportador,valor_centavos:valor,status:'PROPOSTO',descricao_acordo:descricao},{transaction});
      await registrar(transaction,contrato,req.usuario.id_usuario,'criar',null,'PROPOSTO');
      return {contrato:expose(contrato)};
    });
    if(result.error)return res.status(result.error).json({erro:result.msg});
    res.status(201).json({...result,ambiente:'SIMULADO'});
  }catch(e){
    if(e.name==='SequelizeUniqueConstraintError' || e.parent?.code==='23505')return res.status(409).json({erro:'Esta carga já tem um contrato ativo.'});
    next(e);
  }
}
async function acao(req,res,next){
  const id=positiveId(req.params.id),nome=req.params.acao;
  if(!id||!Object.hasOwn(rules,nome))return res.status(400).json({erro:'Identificador ou ação inválida.'});
  try{
    const result=await sequelize.transaction(async transaction=>{
      const contrato=await Contrato.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});
      if(!contrato)return {error:404,msg:'Contrato não encontrado.'};
      if(req.usuario.id_usuario!==contrato.id_cliente && req.usuario.id_usuario!==contrato.id_transportador)
        return {error:404,msg:'Contrato não encontrado.'};
      const role=req.usuario.tipo_usuario;
      const allowed=(role==='CLIENTE' && req.usuario.id_usuario===contrato.id_cliente) ||
         (role==='TRANSPORTADORA' && req.usuario.id_usuario===contrato.id_transportador);
      if(!allowed)return {error:403,msg:'Perfil não autorizado.'};
      const novo=proximoEstado(contrato.status,nome,role);
      if(!novo)return {error:409,msg:'Ação não permitida para o estado atual ou perfil.'};
      const anterior=contrato.status;
      contrato.status=novo;
      await contrato.save({transaction});
      await registrar(transaction,contrato,req.usuario.id_usuario,nome,anterior,novo);
      return {contrato:expose(contrato)};
    });
    if(result.error)return res.status(result.error).json({erro:result.msg});
    res.json({...result,ambiente:'SIMULADO'});
  }catch(e){next(e);}
}
async function historico(req,res,next){
  const id=positiveId(req.params.id);
  if(!id)return res.status(400).json({erro:'ID inválido.'});
  try{
    const contrato=await Contrato.findByPk(id);
    if(!contrato || ![contrato.id_cliente,contrato.id_transportador].includes(req.usuario.id_usuario))
      return res.status(404).json({erro:'Contrato não encontrado.'});
    const eventos=await Evento.findAll({where:{id_contrato:id},order:[['id_evento','ASC']],limit:100});
    res.json({eventos});
  }catch(e){next(e);}
}

// Aceite e escolha de meio de pagamento em AMBIENTE SIMULADO. Nenhum PIX válido é criado.
async function aceitarContrato(req,res,next){
 const id=positiveId(req.params.id);
 if(!id||req.usuario.tipo_usuario!=='CLIENTE')return res.status(403).json({erro:'Apenas o cliente pode aceitar o contrato.'});
 if(req.body?.aceita_valores!==true||req.body?.aceita_termos!==true||req.body?.aceita_garantia!==true)
   return res.status(400).json({erro:'Leia e confirme os valores, os termos e as condições do pagamento.'});
 try{
   const r=await sequelize.transaction(async transaction=>{
     const c=await Contrato.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});
     if(!c||Number(c.id_cliente)!==Number(req.usuario.id_usuario))return {status:404,erro:'Contrato não encontrado.'};
     if(c.status!=='PROPOSTO')return {status:409,erro:'Esse contrato não está aguardando aceite.'};
     c.status='ACEITO'; c.aceito_em=new Date(); c.atualizado_em=new Date();
     await c.save({transaction});
     await registrar(transaction,c,req.usuario.id_usuario,'aceite_termos_v1','PROPOSTO','ACEITO');
     return {contrato:expose(c)};
   });
   if(r.status)return res.status(r.status).json({erro:r.erro});
   return res.json({...r,ambiente:'SIMULADO'});
 }catch(e){next(e)}
}
async function simularPagamento(req,res,next){
 const id=positiveId(req.params.id);
 const metodo=String(req.body?.metodo||'').toUpperCase();
 if(!['PIX','CARTAO','BOLETO'].includes(metodo))return res.status(400).json({erro:'Selecione PIX, cartão ou boleto.'});
 try{
  const r=await sequelize.transaction(async transaction=>{
    const c=await Contrato.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE});
    if(!c||Number(c.id_cliente)!==Number(req.usuario.id_usuario))return {status:404,erro:'Contrato não encontrado.'};
    if(req.usuario.tipo_usuario!=='CLIENTE'||c.status!=='ACEITO'||!c.aceito_em)
      return {status:409,erro:'Aceite o contrato antes de simular o pagamento.'};
    c.status='GARANTIDO_SIMULADO';c.metodo_pagamento_demo=metodo;c.atualizado_em=new Date();
    await c.save({transaction});
    await registrar(transaction,c,req.usuario.id_usuario,'pagamento_simulado_'+metodo,'ACEITO','GARANTIDO_SIMULADO');
    return {contrato:expose(c)};
  });
  if(r.status)return res.status(r.status).json({erro:r.erro});
  res.json({...r,ambiente:'SIMULADO_SEM_COBRANCA'});
 }catch(e){next(e)}
}

module.exports={mine,criar,acao,historico,reaisParaCentavos,proximoEstado,aceitarContrato,simularPagamento};

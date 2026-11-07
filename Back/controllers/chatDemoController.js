// Negociação persistida no banco de TESTES. Nenhuma operação financeira real.
const {Op}=require('sequelize');
const db=require('../config/database');
const Conversa=require('../models/ConversaDemo');
const Mensagem=require('../models/MensagemDemo');
const Carga=require('../models/Carga');
const Viagem=require('../models/Viagem');
const Usuario=require('../models/Usuario');
const Contrato=require('../models/ContratoDemo');
const Evento=require('../models/EventoContratoDemo');
const {positiveId}=require('../utils/validate');
const {reaisParaCentavos}=require('./pagamentoDemoController');
const blockContact = require('../utils/blockContact');
const idUser=req=>Number(req.usuario.id_usuario);
const err=(res,status,erro)=>res.status(status).json({erro});
function allowed(c,u){return Number(c.id_cliente)===u || Number(c.id_transportador)===u;}
async function fetchChat(id,u,opts={}){
  const conversa=await Conversa.findByPk(id,opts);
  return conversa&&allowed(conversa,u)?conversa:null;
}
async function decorate(c){
  const [carga,cliente,transportadora,contrato,last,viagens]=await Promise.all([
    Carga.findByPk(c.id_carga,{attributes:['id_carga','origem','destino','descricao','volume_m3','status']}),
    Usuario.findByPk(c.id_cliente,{attributes:['nome']}),
    Usuario.findByPk(c.id_transportador,{attributes:['nome']}),
    Contrato.findOne({where:{id_carga:c.id_carga,id_transportador:c.id_transportador,status:{[Op.ne]:'CANCELADO'}},order:[['id_contrato','DESC']]}),
    Mensagem.findOne({where:{id_conversa:c.id_conversa},order:[['id_mensagem','DESC']]}),
    Viagem.findAll({where:{id_transportador:c.id_transportador,status:'AGENDADA'},attributes:['id_viagem','origem','destino','capacidade_m3','data_saida'],order:[['data_saida','ASC']],limit:50})
  ]);
  return {id_conversa:c.id_conversa,id_carga:c.id_carga,criada_em:c.criada_em,
    id_cliente:c.id_cliente,id_transportador:c.id_transportador,
    cliente_nome:cliente?.nome||'Cliente',transportador_nome:transportadora?.nome||'Transportadora',
    carga,viagens:viagens.filter(v=>Number(v.capacidade_m3)>=Number(carga?.volume_m3||0)),last_mensagem:last?{texto:last.texto,criada_em:last.criada_em}:null,
    contrato:contrato?{id_contrato:contrato.id_contrato,id_viagem:contrato.id_viagem,valor_centavos:Number(contrato.valor_centavos),comissao_centavos:Math.round(Number(contrato.valor_centavos)*.1),repasse_centavos:Number(contrato.valor_centavos)-Math.round(Number(contrato.valor_centavos)*.1),status:contrato.status,descricao_acordo:contrato.descricao_acordo,metodo_pagamento_demo:contrato.metodo_pagamento_demo||null,aceito_em:contrato.aceito_em||null}:null};
}
async function iniciarCarga(req,res,next){
  const id=positiveId(req.body?.id_carga);
  if(!id)return err(res,400,'Carga inválida.');
  try{
    const carga=await Carga.findByPk(id);
    if(!carga||carga.status!=='ABERTA')return err(res,409,'Essa carga não está disponível.');
    const cli=await Usuario.findByPk(carga.id_cliente);
    if(!cli||cli.tipo_usuario!=='CLIENTE')return err(res,409,'Cliente indisponível.');
    const [c,created]=await Conversa.findOrCreate({where:{id_carga:id,id_transportador:idUser(req)},defaults:{id_cliente:carga.id_cliente}});
    res.status(created?201:200).json({conversa:await decorate(c)});
  }catch(e){next(e);}
}
async function iniciarViagem(req,res,next){
  const idViagem=positiveId(req.body?.id_viagem),idCarga=positiveId(req.body?.id_carga);
  if(!idViagem||!idCarga)return err(res,400,'Selecione sua carga e uma viagem.');
  try{
    const [v,carga]=await Promise.all([Viagem.findByPk(idViagem),Carga.findByPk(idCarga)]);
    if(!carga||Number(carga.id_cliente)!==idUser(req)||carga.status!=='ABERTA')return err(res,409,'Selecione uma carga aberta de sua propriedade.');
    if(!v||v.status!=='AGENDADA'||Number(v.capacidade_m3)<Number(carga.volume_m3))return err(res,409,'Viagem indisponível ou sem capacidade suficiente.');
    const trans=await Usuario.findByPk(v.id_transportador);
    if(!trans||trans.tipo_usuario!=='TRANSPORTADORA')return err(res,409,'Transportadora indisponível.');
    const [c,created]=await Conversa.findOrCreate({where:{id_carga:idCarga,id_transportador:v.id_transportador},defaults:{id_cliente:idUser(req)}});
    res.status(created?201:200).json({conversa:await decorate(c)});
  }catch(e){next(e);}
}
async function minhas(req,res,next){
  try{
    const campo=req.usuario.tipo_usuario==='CLIENTE'?'id_cliente':'id_transportador';
    const items=await Conversa.findAll({where:{[campo]:idUser(req)},order:[['id_conversa','DESC']],limit:100});
    res.json({conversas:await Promise.all(items.map(decorate))});
  }catch(e){next(e);}
}
async function detalhes(req,res,next){
  const id=positiveId(req.params.id);
  if(!id)return err(res,400,'ID inválido.');
  try{
    const conversa=await fetchChat(id,idUser(req));
    if(!conversa)return err(res,404,'Conversa não encontrada.');
    const mensagens=await Mensagem.findAll({where:{id_conversa:id},order:[['id_mensagem','ASC']],limit:200});
    res.json({conversa:await decorate(conversa),mensagens});
  }catch(e){next(e);}
}
async function enviar(req,res,next){
  const id=positiveId(req.params.id),texto=typeof req.body?.texto==='string'?req.body.texto.trim():'';
  if(!id||!texto||texto.length>1000)return err(res,400,'Mensagem deve ter entre 1 e 1000 caracteres.');
  if(blockContact(texto))return err(res,422,'Por segurança, não envie telefones, e-mails, redes sociais, links ou chaves Pix no chat. Negocie por aqui.');
  try{
    const conversa=await fetchChat(id,idUser(req));
    if(!conversa)return err(res,404,'Conversa não encontrada.');
    const msg=await Mensagem.create({id_conversa:id,id_autor:idUser(req),texto});
    res.status(201).json({mensagem:msg});
  }catch(e){next(e);}
}
async function propor(req,res,next){
  const id=positiveId(req.params.id),idViagem=positiveId(req.body?.id_viagem);
  const valor=reaisParaCentavos(req.body?.valor_reais);
  const descricao=typeof req.body?.descricao_acordo==='string'?req.body.descricao_acordo.trim():'';
  if(!id||!idViagem||!valor||descricao.length>500||blockContact(descricao))return err(res,400,'Confira viagem, valor e condições (sem contatos ou chaves Pix).');
  try{
    const result=await db.transaction(async transaction=>{
      const conversa=await fetchChat(id,idUser(req),{transaction,lock:transaction.LOCK.UPDATE});
      if(!conversa)return {status:404,msg:'Conversa não encontrada.'};
      if(Number(conversa.id_transportador)!==idUser(req))return {status:403,msg:'Somente a transportadora pode enviar o contrato.'};
      const [carga,viagem,existe,msgCliente,msgTransportadora]=await Promise.all([
        Carga.findByPk(conversa.id_carga,{transaction}),Viagem.findByPk(idViagem,{transaction}),
        Contrato.findOne({where:{id_carga:conversa.id_carga,status:{[Op.ne]:'CANCELADO'}},transaction}),
        Mensagem.count({where:{id_conversa:id,id_autor:conversa.id_cliente},transaction}),
        Mensagem.count({where:{id_conversa:id,id_autor:conversa.id_transportador},transaction})
      ]);
      if(existe)return {status:409,msg:'Esta carga já tem um acordo ativo. Resolva-o antes de contratar novamente.'};
      if(!msgCliente||!msgTransportadora)return {status:409,msg:'As duas partes precisam conversar antes de enviar o contrato.'};
      if(!carga||carga.status!=='ABERTA'||Number(carga.id_cliente)!==Number(conversa.id_cliente))return {status:409,msg:'Carga indisponível.'};
      if(!viagem||viagem.status!=='AGENDADA'||Number(viagem.id_transportador)!==Number(conversa.id_transportador)||Number(viagem.capacidade_m3)<Number(carga.volume_m3))return {status:409,msg:'Selecione uma viagem ativa da transportadora com capacidade suficiente.'};
      const contrato=await Contrato.create({id_carga:carga.id_carga,id_viagem:idViagem,id_cliente:conversa.id_cliente,id_transportador:conversa.id_transportador,valor_centavos:valor,status:'PROPOSTO',descricao_acordo:descricao},{transaction});
      await Evento.create({id_contrato:contrato.id_contrato,id_usuario:idUser(req),acao:'contrato_enviado',estado_anterior:null,estado_novo:'PROPOSTO'},{transaction});
      return {id_contrato:contrato.id_contrato};
    });
    if(result.status)return err(res,result.status,result.msg);
    res.status(201).json({acordo:result,ambiente:'SIMULADO_SEM_DINHEIRO_REAL'});
  }catch(e){if(e.parent?.code==='23505')return err(res,409,'Já existe um acordo ativo para esta carga.');next(e);}
}
module.exports={iniciarCarga,iniciarViagem,minhas,detalhes,enviar,propor};

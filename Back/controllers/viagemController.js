const {Op} = require('sequelize');
const Viagem = require('../models/Viagem');
const {text,positiveNumber,positiveId} = require('../utils/validate');
const statuses = ['AGENDADA','EM_ANDAMENTO','CONCLUIDA','CANCELADA'];
function hojeLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function validate(body) {
  const origem = text(body?.origem,120), destino = text(body?.destino,120), veiculo=text(body?.veiculo,80);
  const capacidade = positiveNumber(body?.capacidade_m3);
  const date = body?.data_saida;
  if (!origem || origem.length>120 || !destino || destino.length>120 || origem.toLocaleLowerCase('pt-BR')===destino.toLocaleLowerCase('pt-BR') || !veiculo || veiculo.length>80 || !capacidade || capacidade>99999999.99 || !/^\d{4}-\d{2}-\d{2}$/.test(date||'') || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10)!==date) return null;
  return {origem,destino,veiculo,capacidade_m3:capacidade,data_saida:date};
}
async function create(req,res,next) {
  try {
    const input=validate(req.body);
    if(!input || input.data_saida < hojeLocal()) return res.status(400).json({erro:'Confira a rota, data futura, veículo e capacidade (m³).'});
    const viagem=await Viagem.create({...input,id_transportador:req.usuario.id_usuario});
    res.status(201).json({viagem});
  }catch(e){next(e);}
}
async function mine(req,res,next){try{res.json({viagens:await Viagem.findAll({where:{id_transportador:req.usuario.id_usuario},order:[['data_saida','ASC'],['id_viagem','DESC']],limit:100})});}catch(e){next(e);}}
async function available(req,res,next){try{res.json({viagens:await Viagem.findAll({where:{status:'AGENDADA',data_saida:{[Op.gte]:hojeLocal()}},order:[['data_saida','ASC']],limit:100,attributes:['id_viagem','origem','destino','data_saida','veiculo','capacidade_m3','status']})});}catch(e){next(e);}}
async function update(req,res,next){
  try {
    const id=positiveId(req.params.id), status=req.body?.status;
    if(!id || !statuses.includes(status)) return res.status(400).json({erro:'Status ou ID inválido.'});
    const viagem=await Viagem.findOne({where:{id_viagem:id,id_transportador:req.usuario.id_usuario}});
    if(!viagem) return res.status(404).json({erro:'Viagem não encontrada.'});
    if(viagem.status==='CANCELADA' || viagem.status==='CONCLUIDA') return res.status(409).json({erro:'Viagem já finalizada.'});
    const allowed = viagem.status==='AGENDADA'? ['CANCELADA','EM_ANDAMENTO']:['CONCLUIDA','CANCELADA'];
    if(!allowed.includes(status))return res.status(400).json({erro:'Transição de status não permitida.'});
    viagem.status=status;await viagem.save();res.json({viagem});
  }catch(e){next(e);}
}
module.exports={create,mine,available,update};

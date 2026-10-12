const Carga=require('../models/Carga');
const {text,positiveNumber,positiveId}=require('../utils/validate');
async function create(req,res,next) {
  try{
    const origem=text(req.body?.origem,120),destino=text(req.body?.destino,120),descricao=text(req.body?.descricao,300),volume=positiveNumber(req.body?.volume_m3);
    if(!origem || origem.length>120 || !destino || destino.length>120 || origem.toLocaleLowerCase('pt-BR')===destino.toLocaleLowerCase('pt-BR') || !descricao || descricao.length>300 || !volume || volume>99999999.99) return res.status(400).json({erro:'Informe origem, destino diferente, descrição e volume (m³) válido.'});
    const carga=await Carga.create({origem,destino,descricao,volume_m3:volume,id_cliente:req.usuario.id_usuario});
    res.status(201).json({carga});
  }catch(e){next(e);}
}
async function mine(req,res,next){try{res.json({cargas:await Carga.findAll({where:{id_cliente:req.usuario.id_usuario},order:[['criada_em','DESC']],limit:100})});}catch(e){next(e);}}
async function available(_req,res,next){try{res.json({cargas:await Carga.findAll({where:{status:'ABERTA'},attributes:['id_carga','origem','destino','descricao','volume_m3','status','criada_em'],order:[['criada_em','DESC']],limit:100})});}catch(e){next(e);}}
async function cancel(req,res,next){try{
  const id=positiveId(req.params.id);if(!id)return res.status(400).json({erro:'ID inválido.'});
  const carga=await Carga.findOne({where:{id_carga:id,id_cliente:req.usuario.id_usuario}});
  if(!carga)return res.status(404).json({erro:'Carga não encontrada.'});
  if(carga.status!=='ABERTA')return res.status(409).json({erro:'Só cargas abertas podem ser canceladas.'});
  carga.status='CANCELADA';await carga.save();res.json({carga});
}catch(e){next(e);}}
module.exports={create,mine,available,cancel};

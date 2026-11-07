const router = require('express').Router();
const {QueryTypes} = require('sequelize');
const sequelize = require('../config/database');
const {required} = require('../middlewares/auth');
router.use(required);
// O ID do destinatario SEMPRE vem da sessao validada, nunca do cliente HTTP.
router.get('/', async (req,res,next)=>{
 try {
  const id=req.usuario.id_usuario;
  const notificacoes=await sequelize.query(`
    SELECT id_notificacao,titulo,mensagem,destino,criada_em,lida_em
    FROM public.notificacoes_frete WHERE id_usuario=:id
    ORDER BY criada_em DESC,id_notificacao DESC LIMIT 50
  `,{replacements:{id},type:QueryTypes.SELECT});
  const [contagem]=await sequelize.query(`
    SELECT COUNT(*)::integer AS nao_lidas FROM public.notificacoes_frete
    WHERE id_usuario=:id AND lida_em IS NULL
  `,{replacements:{id},type:QueryTypes.SELECT});
  res.set('Cache-Control','no-store');
  res.json({notificacoes,nao_lidas:contagem.nao_lidas});
 }catch(err){next(err)}
});
router.patch('/:id/lida',async(req,res,next)=>{
 try {
  const id=Number(req.params.id);
  if(!Number.isSafeInteger(id)||id<=0)return res.status(400).json({erro:'Notificacao invalida.'});
  const [rows]=await sequelize.query(`
    UPDATE public.notificacoes_frete SET lida_em=COALESCE(lida_em,NOW())
    WHERE id_notificacao=:id AND id_usuario=:usuario
    RETURNING id_notificacao,lida_em
  `,{replacements:{id,usuario:req.usuario.id_usuario},type:QueryTypes.UPDATE});
  if(!rows?.length)return res.status(404).json({erro:'Notificacao nao encontrada.'});
  res.json({ok:true});
 }catch(err){next(err)}
});
router.patch('/marcar-todas/lidas',async(req,res,next)=>{
 try {
  await sequelize.query(`UPDATE public.notificacoes_frete SET lida_em=NOW()
    WHERE id_usuario=:usuario AND lida_em IS NULL`,
    {replacements:{usuario:req.usuario.id_usuario},type:QueryTypes.UPDATE});
  res.json({ok:true});
 }catch(err){next(err)}
});
module.exports=router;

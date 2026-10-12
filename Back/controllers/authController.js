const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const { Op, fn, col, where } = require('sequelize');
const Usuario = require('../models/Usuario');
const PasswordReset = require('../models/PasswordReset');
const sequelize = require('../config/database');
const auth = require('../middlewares/auth');
const { email: normalEmail, strongPassword } = require('../utils/validate');

async function login(req,res,next) {
  try {
    const email = normalEmail(req.body?.email);
    const senha = req.body?.senha;
    if (!email || typeof senha !== 'string') return res.status(400).json({erro:'Informe um e-mail e uma senha válidos.'});
    const user = await Usuario.findOne({where:where(fn('lower',col('email')),email)});
    const valid = user && await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(401).json({erro:'E-mail ou senha incorretos.'});
    auth.issue(res,user);
    res.json({usuario:auth.publicUser(user)});
  } catch(error) {next(error);}
}
const me = (req,res) => res.json({usuario:auth.publicUser(req.usuario)});
function logout(req,res) { auth.clear(res); res.json({mensagem:'Sessão encerrada.'}); }

async function requestReset(req,res,next) {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM || !process.env.PUBLIC_FRONTEND_URL) {
      return res.status(503).json({erro:'Recuperação por e-mail ainda não configurada. Entre em contato com o suporte.'});
    }
    const email = normalEmail(req.body?.email);
    if (!email) return res.status(400).json({erro:'Informe um e-mail válido.'});
    const neutral = {mensagem:'Se houver uma conta com esse e-mail, enviaremos instruções de recuperação.'};
    const user = await Usuario.findOne({where:where(fn('lower',col('email')),email)});
    if (!user) return res.json(neutral);
    const raw = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    // Tokens de recuperação armazenados apenas como hashes, com validade de 30 minutos.
    const tokenRow = await PasswordReset.create({usuario_id:user.id_usuario, token_hash:hash, expira_em:new Date(Date.now()+30*60*1000)});
    const link = `${process.env.PUBLIC_FRONTEND_URL.replace(/\/$/,'')}/redefinir-senha?token=${encodeURIComponent(raw)}`;
    const reply = await fetch('https://api.resend.com/emails', {
      method:'POST', headers:{'Authorization':`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({from:process.env.MAIL_FROM,to:[email],subject:'Redefinição de senha — Frete de Retorno',
        text:`Recebemos um pedido de redefinição da senha. Use o link (válido por 30 minutos): ${link}\nSe não foi você, ignore esta mensagem.`})
    });
    if (!reply.ok) {
      await tokenRow.destroy();
      console.error('Falha no serviço de envio de e-mail de recuperação:', reply.status);
      return res.json(neutral);
    }
    res.json(neutral);
  } catch(error) { next(error); }
}
async function reset(req,res,next) {
  try {
    const {token, senha, confirmacaoSenha} = req.body || {};
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token) || !strongPassword(senha) || senha !== confirmacaoSenha) {
      return res.status(400).json({erro:'Link inválido ou senha fora dos requisitos (8 a 72 bytes).'});
    }
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const changed = await sequelize.transaction(async(t) => {
      const row = await PasswordReset.findOne({where:{token_hash:hash, usado_em:null,expira_em:{[Op.gt]:new Date()}},transaction:t,lock:t.LOCK.UPDATE});
      if (!row) return false;
      const user = await Usuario.findByPk(row.usuario_id,{transaction:t,lock:t.LOCK.UPDATE});
      if (!user) return false;
      user.senha = await bcrypt.hash(senha,12);
      await user.save({transaction:t});
      row.usado_em = new Date();
      await row.save({transaction:t});
      await PasswordReset.update({usado_em:new Date()}, {where:{usuario_id:user.id_usuario,usado_em:null},transaction:t});
      return true;
    });
    if (!changed) return res.status(400).json({erro:'Link inválido, expirado ou já utilizado.'});
    res.json({mensagem:'Senha alterada! Faça o login novamente.'});
  } catch(error){next(error);}
}
module.exports = {login,me,logout,requestReset,reset};

const bcrypt = require('bcrypt');
const {UniqueConstraintError,fn,col,where} = require('sequelize');
const Usuario = require('../models/Usuario');
const { text, email: normalEmail, strongPassword } = require('../utils/validate');
const {publicUser} = require('../middlewares/auth');

async function inserir(req,res,next) {
  try {
    const {nome, email, telefone, senha, confirmacaoSenha, tipo_usuario} = req.body || {};
    const name = text(nome,100), mail = normalEmail(email), phone = telefone == null || telefone === '' ? null : text(telefone,20);
    if (!name || name.length > 100 || !mail || (phone && phone.length > 20) || !['CLIENTE','TRANSPORTADORA'].includes(tipo_usuario)) {
      return res.status(400).json({erro:'Confira nome, e-mail, telefone e tipo de usuário.'});
    }
    if (!strongPassword(senha) || senha !== confirmacaoSenha) {
      return res.status(400).json({erro:'Use uma senha de pelo menos 8 caracteres (máximo de 72 bytes) e confirme corretamente.'});
    }
    const existing = await Usuario.findOne({where:where(fn('lower',col('email')),mail)});
    if(existing)return res.status(409).json({erro:'E-mail já cadastrado.'});
    const user = await Usuario.create({nome:name,email:mail,telefone:phone,senha:await bcrypt.hash(senha,12),tipo_usuario});
    return res.status(201).json({usuario:publicUser(user),mensagem:'Conta criada com sucesso.'});
  } catch(error) {
    if (error instanceof UniqueConstraintError) return res.status(409).json({erro:'E-mail já cadastrado.'});
    next(error);
  }
}
async function atualizarMe(req,res,next) {
  try {
    const nome = text(req.body?.nome,100);
    if (!nome || nome.length > 100) return res.status(400).json({erro:'Informe um nome de até 100 caracteres.'});
    // A atualização do telefone é opcional para manter compatibilidade com clientes antigos.
    const atualizarTelefone = Object.prototype.hasOwnProperty.call(req.body || {}, 'telefone');
    let telefone = req.usuario.telefone;
    if (atualizarTelefone) {
      if (typeof req.body.telefone !== 'string' && req.body.telefone !== null) {
        return res.status(400).json({erro:'Informe um telefone válido.'});
      }
      telefone = req.body.telefone === null ? null : req.body.telefone.trim();
      if (telefone === '') telefone = null;
      if (telefone !== null) {
        const digitos = telefone.replace(/\D/g, '');
        if (telefone.length > 20 || !/^[+()\d\s.-]+$/.test(telefone) || digitos.length < 10 || digitos.length > 13) {
          return res.status(400).json({erro:'Informe um telefone válido com DDD (10 ou 11 dígitos; com +55 também é aceito).'});
        }
      }
    }
    req.usuario.nome = nome;
    if (atualizarTelefone) req.usuario.telefone = telefone;
    await req.usuario.save();
    res.json({mensagem:'Dados atualizados com sucesso.',usuario:publicUser(req.usuario)});
  } catch(error){next(error);}
}
module.exports = {inserir,atualizarMe};

const crypto = require('node:crypto');
const Usuario = require('../models/Usuario');

const COOKIE = 'frete_session';
const DAYS = 1;
const secret = process.env.SESSION_SECRET;
if (!secret || Buffer.byteLength(secret) < 32) {
  throw new Error('Defina SESSION_SECRET com pelo menos 32 caracteres aleatórios no Back/.env');
}
const sign = (value) => crypto.createHmac('sha256', secret).update(value).digest('hex');
const fingerprint = (hash) => crypto.createHash('sha256').update(hash).digest('hex').slice(0, 24);
function options() {
  return { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: DAYS*24*60*60*1000 };
}
function issue(res, user) {
  const body = `v1.${user.id_usuario}.${Date.now() + DAYS*86400000}.${fingerprint(user.senha)}`;
  res.cookie(COOKIE, `${body}.${sign(body)}`, options());
}
function clear(res) { res.clearCookie(COOKIE, { ...options(), maxAge: undefined }); }
function cookie(req) {
  const item = (req.headers.cookie || '').split(';').map(s=>s.trim()).find(s => s.startsWith(COOKIE + '='));
  return item ? item.slice(COOKIE.length+1) : null;
}
function verify(token) {
  if (!token || token.length > 400) return null;
  const bits = token.split('.');
  if (bits.length !== 5 || bits[0] !== 'v1') return null;
  const body = bits.slice(0, 4).join('.');
  const expected = sign(body);
  if (bits[4].length !== expected.length || !crypto.timingSafeEqual(Buffer.from(bits[4]), Buffer.from(expected))) return null;
  const id = Number(bits[1]); const expiration = Number(bits[2]);
  if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(expiration) || expiration < Date.now()) return null;
  return { id, pw: bits[3] };
}
async function required(req, res, next) {
  try {
    const parsed = verify(cookie(req));
    if (!parsed) return res.status(401).json({ erro: 'Sessão expirada. Entre novamente.' });
    const user = await Usuario.findByPk(parsed.id);
    if (!user || fingerprint(user.senha) !== parsed.pw) return res.status(401).json({ erro: 'Sessão inválida. Entre novamente.' });
    req.usuario = user;
    next();
  } catch (error) { next(error); }
}
function role(expected) { return (req,res,next) => req.usuario?.tipo_usuario === expected ? next() : res.status(403).json({erro:'Acesso não permitido para este perfil.'}); }
function publicUser(user) {
  const { id_usuario, nome, email, telefone, tipo_usuario, data_cadastro } = user;
  return { id_usuario, nome, email, telefone, tipo_usuario, data_cadastro };
}
module.exports = { issue, clear, required, role, publicUser };

const test=require('node:test');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
process.env.DB_HOST='localhost';process.env.DB_NAME='dummy';process.env.DB_USER='dummy';process.env.DB_PASSWORD='dummy';
process.env.DB_SSL='false';process.env.SESSION_SECRET=crypto.randomBytes(48).toString('hex');
const validate=require('../utils/validate');
const Usuario=require('../models/Usuario');
const auth=require('../middlewares/auth');
test('e-mail é normalizado e senha curta é rejeitada',()=>{
  assert.equal(validate.email('  TESTE@EMAIL.COM '),'teste@email.com');
  assert.equal(validate.email('invalido'),null);
  assert.equal(validate.strongPassword('1234567'),false);
  assert.equal(validate.strongPassword('Senha123!'),true);
});
test('cookie é HttpOnly, assinado e rejeita adulteração',async()=>{
  const fake={id_usuario:4,nome:'Pessoa',email:'pessoa@teste.com',tipo_usuario:'CLIENTE',senha:'hash-teste'};
  const res={cookie(_name,value,options){this.value=value;this.options=options;}};
  auth.issue(res,fake);
  assert.equal(res.options.httpOnly,true);
  assert.equal(res.options.sameSite,'lax');
  const original=Usuario.findByPk;
  Usuario.findByPk=async()=>fake;
  try {
    let passed=false;
    await auth.required({headers:{cookie:`frete_session=${res.value}`}}, {status(){return this;},json(){throw new Error('Não deveria rejeitar')}}, ()=>{passed=true;});
    assert.equal(passed,true);
    let denied=false;
    const tampered=res.value.replace('.4.','.999.');
    await auth.required({headers:{cookie:`frete_session=${tampered}`}}, {status(code){denied=code===401;return this;},json(){}}, ()=>{throw new Error('Não deveria autenticar')});
    assert.equal(denied,true);
  }finally {Usuario.findByPk=original;}
});
test('pessoa não acessa rota reservada para outro perfil',()=>{
  let denied=false;
  auth.role('TRANSPORTADORA')({usuario:{tipo_usuario:'CLIENTE'}},{status(code){denied=code===403;return this;},json(){}},()=>{throw new Error('Não deveria passar');});
  assert.equal(denied,true);
});

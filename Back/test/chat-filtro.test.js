const test=require('node:test');
const assert=require('node:assert/strict');
const block=require('../utils/blockContact');
test('bloqueia contatos e links convencionais',()=>{
 for(const t of ['WhatsApp (47) 99999-1111','contato teste@gmail.com','https://exemplo.com','Minha chave Pix','instagram @usuario','47999998888','CPF 123.456.789-09'])assert.equal(block(t),true,t);
});
test('permite conversas de frete normais',()=>{
 for(const t of ['Tenho 3 caixas de equipamentos, 25kg','Fechamos por R$ 1800,00?','A carga segue de Curitiba para União da Vitória','Retirada às 8h e entrega após 16h'])assert.equal(block(t),false,t);
});

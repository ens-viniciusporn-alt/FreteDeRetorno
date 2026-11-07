const test = require('node:test');
const assert = require('node:assert/strict');
process.env.DB_HOST = 'localhost'; process.env.DB_NAME = 'dummy'; process.env.DB_USER = 'dummy'; process.env.DB_PASSWORD = 'dummy'; process.env.DB_SSL = 'false';
const { reaisParaCentavos, proximoEstado } = require('../controllers/pagamentoDemoController');
test('valor monetário é inteiro, sem ponto flutuante ou entrada inválida', () => {
  assert.equal(reaisParaCentavos('1500,90'), 150090);
  assert.equal(reaisParaCentavos('1'), 100);
  for (const v of ['0,99', '1.234,00', '-10', '0', '1.2', 'abc', '999999999,00', 1500]) assert.equal(reaisParaCentavos(v), null);
});
test('aceite de contrato nao usa a transicao generica', () => {
  assert.equal(
    proximoEstado('PROPOSTO', 'aceitar', 'TRANSPORTADORA'),
    null
  );

  assert.equal(
    proximoEstado('PROPOSTO', 'aceitar', 'CLIENTE'),
    null
  );
});
test('cliente só libera após entrega informada, e disputa bloqueia fluxo', () => {
  assert.equal(proximoEstado('GARANTIDO_SIMULADO', 'simular_liberacao', 'CLIENTE'), null);
  assert.equal(proximoEstado('ENTREGA_INFORMADA', 'simular_liberacao', 'CLIENTE'), 'LIBERADO_SIMULADO');
  assert.equal(proximoEstado('ENTREGA_INFORMADA', 'simular_liberacao', 'TRANSPORTADORA'), null);
  assert.equal(proximoEstado('EM_DISPUTA', 'simular_liberacao', 'CLIENTE'), null);
  assert.equal(proximoEstado('LIBERADO_SIMULADO', 'abrir_disputa', 'CLIENTE'), null);
});

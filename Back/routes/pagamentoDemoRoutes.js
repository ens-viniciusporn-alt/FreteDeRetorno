const router=require('express').Router();
const c=require('../controllers/pagamentoDemoController');
const {required,role}=require('../middlewares/auth');
router.use(required);
router.get('/meus',c.mine);
// Propostas são criadas somente dentro de uma conversa (chats-demo).
router.get('/:id/eventos',c.historico);
router.post('/:id/aceitar-contrato',role('CLIENTE'),c.aceitarContrato);
router.post('/:id/pagamento-teste',role('CLIENTE'),c.simularPagamento);
router.post('/:id/:acao',c.acao);
module.exports=router;

const r=require('express').Router();
const c=require('../controllers/disputaDemoController');
const {required,role}=require('../middlewares/auth');
r.use(required);
r.get('/admin',role('ADMIN'),c.listar);
r.get('/:id',c.detalhes);
r.post('/:id/manifestacoes',c.manifestar);
r.post('/:id/decisao',role('ADMIN'),c.decidir);
module.exports=r;

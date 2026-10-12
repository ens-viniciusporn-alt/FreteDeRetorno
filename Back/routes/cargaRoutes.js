const router=require('express').Router();
const c=require('../controllers/cargaController');
const {required,role}=require('../middlewares/auth');
router.use(required);
router.get('/disponiveis',role('TRANSPORTADORA'),c.available);
router.get('/minhas',role('CLIENTE'),c.mine);
router.post('/',role('CLIENTE'),c.create);
router.patch('/:id/cancelar',role('CLIENTE'),c.cancel);
module.exports=router;

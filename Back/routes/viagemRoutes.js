const router=require('express').Router();
const c=require('../controllers/viagemController');
const {required,role}=require('../middlewares/auth');
router.use(required);
router.get('/disponiveis',role('CLIENTE'),c.available);
router.get('/minhas',role('TRANSPORTADORA'),c.mine);
router.post('/',role('TRANSPORTADORA'),c.create);
router.patch('/:id/status',role('TRANSPORTADORA'),c.update);
module.exports=router;

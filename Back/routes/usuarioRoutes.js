const router = require('express').Router();
const controller = require('../controllers/usuarioController');
const {required} = require('../middlewares/auth');
const limit = require('../middlewares/limit');
router.post('/',limit({max:8}),controller.inserir);
router.patch('/me',required,controller.atualizarMe);
// Rotas antigas GET/PUT/DELETE /usuarios/:id retiradas: permitiam acessar contas de terceiros.
module.exports = router;

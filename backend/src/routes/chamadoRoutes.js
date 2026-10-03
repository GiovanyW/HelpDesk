const express = require('express');
const router = express.Router();
const chamadoController = require('../controllers/chamadoController');

router.post('/chamados',chamadoController.createChamado);
router.get('/chamados', chamadoController.getAllChamados);
router.get('/chamados/:id', chamadoController.getChamadoById);
router.put('/chamados/:id',chamadoController.updateChamado);
router.delete('/chamados/:id',chamadoController.deleteChamado);

module.exports = router;

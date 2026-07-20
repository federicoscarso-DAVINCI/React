const express = require('express');
const { listar, obtenerPorId, crear, actualizar, eliminar } = require('../controllers/mascotaController');
const { protegerRuta } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listar);
router.get('/:id', obtenerPorId);
router.post('/', protegerRuta, crear);
router.put('/:id', protegerRuta, actualizar);
router.delete('/:id', protegerRuta, eliminar);

module.exports = router;

const express = require('express');
const { listar, obtenerPorId, crear, actualizar, eliminar } = require('../controllers/turnoController');
const { protegerRuta } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protegerRuta, listar);
router.get('/:id', protegerRuta, obtenerPorId);
router.post('/', protegerRuta, crear);
router.put('/:id', protegerRuta, actualizar);
router.delete('/:id', protegerRuta, eliminar);

module.exports = router;

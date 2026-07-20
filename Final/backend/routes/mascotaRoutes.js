const express = require('express');
const { listar, obtenerPorId, crear, actualizar, eliminar } = require('../controllers/mascotaController');
const { protegerRuta } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', protegerRuta, listar);
router.get('/:id', protegerRuta, obtenerPorId);
router.post('/', protegerRuta, upload.single('imagen'), crear);
router.put('/:id', protegerRuta, upload.single('imagen'), actualizar);
router.delete('/:id', protegerRuta, eliminar);

module.exports = router;

const express = require('express');
const { listar } = require('../controllers/usuarioController');
const { protegerRuta, soloAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protegerRuta, soloAdmin, listar);

module.exports = router;

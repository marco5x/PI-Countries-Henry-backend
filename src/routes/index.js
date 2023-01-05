const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const countries = require("./countries")
const activities = require("./activities.js")

const router = Router();

// Configurar los routers
router.use('/countries', countries);
router.use('/activities', activities);


module.exports = router;

const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Ruta para el login
router.get('/login/:user/:password', async (req, res) => {
    const user = req.params.user;
    const password = req.params.password;

    try {
        const result = await login(user, password);
        console.log(JSON.stringify(result.obtener_usuario2));
        res.json(result.obtener_usuario2);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

router.get('/reset/:user/:password', async (req, res) => {
    const user = req.params.user;
    const password = req.params.password;

    console.log(user, password)

    // try {
    //     const result = await login(user, password);
    //     console.log(JSON.stringify(result.obtener_usuario2));
    //     res.json(result.obtener_usuario2);
    // } catch (error) {
    //     res.status(500).json({ error: 'Error en el servidor' });
    // }

    res.send('o;a')

});

module.exports = router;
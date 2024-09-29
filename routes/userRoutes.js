const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');

router.get('/getUserProfile/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const result = await getUserProfile(email);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});
module.exports = router;
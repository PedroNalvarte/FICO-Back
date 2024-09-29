const express = require('express');
const router = express.Router();
const { getUserProfile, updatePassword } = require('../controllers/userController');

router.get('/getUserProfile/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const result = await getUserProfile(email);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

router.post('/updatePassword/:email/:currentPassword/:newPassword/:repeatPassword', async (req, res) => {
    try {
        const email = req.params.email;
        const currentPassword = req.params.currentPassword;
        const newPassword = req.params.newPassword;
        const repeatPassword = req.params.repeatPassword;
        const result = await updatePassword(email, currentPassword, newPassword, repeatPassword);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});
module.exports = router;
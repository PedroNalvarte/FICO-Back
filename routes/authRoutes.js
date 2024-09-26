const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { login, resetCodeGenerator, changePassword, checkEmailExists } = require('../controllers/authController');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'auth.app.fico@gmail.com',
        pass: 'bwsc jrdn ubpp lilo' // Recuerda usar una contraseña de aplicación si usas Gmail
    }
});

// Ruta para el login
router.get('/login/:email/:password', async (req, res) => {
    const email = req.params.email;
    const password = req.params.password;

    try {
        const result = await login(email, password);
        console.log(JSON.stringify(result.obtener_usuario2));
        res.json(result.obtener_usuario2);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Enviar correo
router.get('/resetMail/:email', async (req, res) => {
    const email = req.params.email;

    // Verificar si el correo existe en la base de datos
    const emailExists = await checkEmailExists(email);
    if (!emailExists) {
        return res.status(400).json({ error: 'El correo no está registrado en el sistema' });
    }

    let codigo = resetCodeGenerator();

    let mailOptions = {
        from: transporter.user,
        to: email,
        subject: 'Código de recuperación de contraseña',
        text: 'Tu código de recuperación es: ' + codigo
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });

    res.send({
        "codigo": codigo,
    });

});

router.post('/resetPassword/:email/:newPassword', async (req, res) => {
    const email = req.params.email;
    const newPassword = req.params.newPassword;

    try {
        const result = await changePassword(email, newPassword);
        console.log(JSON.stringify(result.cambiar_contrasena));
        res.json(result.cambiar_contrasena);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;

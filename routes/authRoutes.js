const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { login, resetCodeGenerator, changePassword, verifyEmail, registerUser, changeNotificationStatus } = require('../controllers/authController');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'auth.app.fico@gmail.com',
        pass: 'bwsc jrdn ubpp lilo'
    }
});

// Ruta para el login
router.get('/login/:email/:password', async (req, res) => {
    const email = req.params.email;
    const password = req.params.password;

    try {
        const result = await login(email, password);

        // Si el resultado contiene un error, lo retornamos como respuesta
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        // Devolver el email y el rol del usuario
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});


// Enviar correo
router.get('/resetMail/:email', async (req, res) => {
    const email = req.params.email;

    let codigo = resetCodeGenerator();

    let mailOptions = {
        from: transporter.user,
        to: email,
        subject: 'Código de recuperación de contraseña',
        text: 'Tu código de recuperación es: ' + codigo
    };

    try {
        const emailVerify = await verifyEmail(email);

        if (JSON.stringify(emailVerify.resultado) === 'true') {
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

        } else {
            res.status(400).json({ error: 'La cuenta no existe' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
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

router.post('/registerUser', async (req, res) => {

    const { nombre, apellido, email, password } = req.body;

    try {
        const result = await registerUser(nombre, apellido, email, password);
        res.json(result.registrar_usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.post('/notificationsState/:idUsuario/:nuevoEstado', async (req, res) => {

    const idUsuario = req.params.idUsuario;
    const nuevoEstado = req.params.nuevoEstado;

    try {
        const result = await changeNotificationStatus(idUsuario, nuevoEstado);

        if (result.result.length > 7) {
            res.send(result.result);
            return
        }

        res.send('Estado cambiado corrctamente a ' + result.result);

    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

module.exports = router;

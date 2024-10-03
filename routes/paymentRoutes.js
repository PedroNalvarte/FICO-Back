const express = require('express');
const nodemailer = require('nodemailer');
const { registerPayment, getTickets } = require('../controllers/paymentController');
const router = express.Router();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'auth.app.fico@gmail.com',
        pass: 'bwsc jrdn ubpp lilo' // Recuerda usar una contraseña de aplicación si usas Gmail
    }
});

router.post('/eventPurchase', async (req, res) => {

    const { idEvento, idUsuario, cantidadEntradas, metodoPago, referenciaPago } = req.body;

    try {
        const result = await registerPayment(idEvento, idUsuario, cantidadEntradas, metodoPago, referenciaPago);
        const data = result.registrar_pago;

        const { mensaje, id_entrada_creada, id_pago_creado, nombre_usuario, apellido_usuario, email_usuario, cantidad_entradas,
            monto_total, nombre_evento, lugar_evento, fecha_evento } = data;

        let mailOptions = {
            from: transporter.user,
            to: email_usuario,
            subject: `#${id_pago_creado} - Compra de entradas`,
            text: `Estimad@ ${nombre_usuario} ${apellido_usuario}, la compra de ${cantidad_entradas} entrada(s) para ${nombre_evento} para el dia ${fecha_evento} fue exitosa.
            
            Monto total: S/.${monto_total}
            Lugar evento: ${lugar_evento} 
            Codigo entrada: ${id_entrada_creada}
            
            Atte.
            Fico`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.json(error);
            } else {
                console.log('Correo enviado: ' + info.response);
                res.json(data);
            }
        });


    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

router.get('/getTicket/:idEvento/:idUsuario', async (req, res) => {

    const idEvento = req.params.idEvento;
    const idUsuario = req.params.idUsuario;

    try {
        const result = await getTickets(idEvento, idUsuario);

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

module.exports = router;
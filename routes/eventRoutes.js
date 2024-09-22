const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const { getEvents, createEvent, getMyEvents} = require('../controllers/eventController');
const path = require('path')
const { ImgurClient } = require('imgur');
const client = new ImgurClient({ clientId: "4303c3922676c01" });
const { createReadStream } = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// Endpoint Listar eventos activos HU-04
router.get('/getActive', async (req, res) => {
    try {
        const result = await getEvents();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

//Endpoint crear eventos HU-10
router.post('/create', upload.single('image'), async (req, res) => {
    const eventData = req.body;
   
    const uploadPath = req.file.path;
    console.log(req.file.path);
    try {
        const imgurResponse = await client.upload({
            image: createReadStream(uploadPath),
            type: 'stream'
        });
        const link = imgurResponse.data.link;
        const result = await createEvent(eventData, link);

        fs.unlink(uploadPath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            }
        });
        res.status(201).json(result);
        res.status(201);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

//Endpoint listar misEventos HU-05
router.get('/getMyEvents/:usuario', async (req, res) => {
    try {
        const usuario = req.params.usuario;
        const result = await getMyEvents(usuario);
        res.json(result);
    } catch (error) {
        console.error('Error al crear el evento:', error.message);
    }

});

module.exports = router;
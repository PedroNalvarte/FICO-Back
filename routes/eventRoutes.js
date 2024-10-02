const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const { getEvents, createEvent, getMyEvents, getEventDetails, editEvent, deleteEvent } = require('../controllers/eventController');
const path = require('path')
const cloudinary = require('cloudinary').v2;
(async function() {
    cloudinary.config({ 
        cloud_name: 'dyxehyhki', 
        api_key: '939264791811866', 
        api_secret: 'wfaFZGg-NTbimBTdT1IRrQZ7I48' // Click 'View API Keys' above to copy your API secret
    });
})();


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
   console.log(req.file);
    try {
        const uploadResult = await cloudinary.uploader
        .upload(
            uploadPath, {
                public_id: req.file.filename,
            }
        )
        .catch((error) => {
            console.log(error);
        });

     const url = uploadResult.url;
     console.log(url);
        fs.unlink(uploadPath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            }
        });
        const result = await createEvent(eventData, url);
        res.status(201).json(result);
        res.status(201);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

//Endpoint listar misEventos HU-05
router.get('/getMyEvents',upload.single('image'), async (req, res) => {
    try {
        const usuario = req.params.usuario;
        const result = await getMyEvents(usuario);
        res.json(result);
    } catch (error) {
        console.error('Error al crear el evento:', error.message);
    }

});

router.get('/eventDetails/:eventId', async (req, res) => {

    const eventId = req.params.eventId;

    try {
        const result = await getEventDetails(eventId);
        console.log(JSON.stringify(result));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

router.put('/eventUpdate/:eventId', async (req, res) => {

    const eventId = req.params.eventId;

    try {
        const result = await editEvent(eventId, '','','','', '', '', '', '');
        console.log(JSON.stringify(result));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

router.delete('/eventDelete/:eventId', async (req, res) => {

    const eventId = req.params.eventId;

    try {
        const result = await deleteEvent(eventId);
        console.log(JSON.stringify(result));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

module.exports = router;
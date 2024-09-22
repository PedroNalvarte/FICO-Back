const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const { getEvents} = require('../controllers/eventController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
// Endpoint Listar eventos activos HU-10
router.get('/getActive', async (req, res) => {
    try {
        const result = await getEvents();
        console.log(JSON.stringify(result));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});
const upload = multer({ storage: storage });
router.post('/create', upload.single('image'), async (req, res) => {
    const eventData = req.body;
    const imagePath = req.file.path;
    try {
        const result = await createEvent(eventData, imagePath);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor'});
    }

})


module.exports = router;
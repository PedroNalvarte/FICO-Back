const express = require('express');
const router = express.Router();
const { createEquipment, getEquipmentList, updateEquipment } = require('../controllers/equipmentController');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

//Configuracion de subida de imagenes
(async function () {
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
//fin configuracion de subida de imagenes

router.post('/create', upload.single('image'), async (req, res) => {

    const eventData = req.body;
    const uploadPath = req.file.path;

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
        fs.unlink(uploadPath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            }
        });
        const result = await createEquipment(eventData, url);
        res.status(201).json(result);
        res.status(201);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

router.get('/getActive', async (req, res) => {
    try {
        const result = await getEquipmentList();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

router.put('/update', upload.single('image'), async (req, res) => {
    const eventData = req.body;
    const uploadPath = req.file.path;

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

        fs.unlink(uploadPath, (err) => {
            if (err) {
                console.error('Error al eliminar el archivo:', err);
            }
        });
        const result = await updateEquipment(eventData, url);
        res.status(201).json(result);
        res.status(201);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

});

module.exports = router;
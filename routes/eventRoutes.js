const express = require('express');
const router = express.Router();
const { getEvents} = require('../controllers/eventController');

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


module.exports = router;
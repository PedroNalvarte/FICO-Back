const express = require('express');
const router = express.Router();
const { createCubicle, reserveCubicle, getAvailableCubicles, getNotAvailableCubicles, getReservedHoursByCubicle, getReservedCubicleDetails } = require('../controllers/cubicleController');

router.post('/create/:name/:capacity', async (req, res) => {
    const cubicleName = req.params.name;
    const capacity = req.params.capacity;
    try {
        const result = await createCubicle(cubicleName, capacity);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

router.post('/reservedHours/:id', async (req, res) => {
    const cubicleId = req.params.id;
    try {
        const result = await getReservedHoursByCubicle(cubicleId);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})
router.post('/reserveCubicle', async (req, res) => {
    const reserveData = req.body;
    try {
        const result = await reserveCubicle(reserveData);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

router.get('/available', async (req, res) => {
    try {
        const result = await getAvailableCubicles();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

router.get('/notAvailable', async (req, res) => {
    try {
        const result = await getNotAvailableCubicles();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

router.get('/getReservedCubicleDetails/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const result = await getReservedCubicleDetails(id);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }

})

module.exports = router; 
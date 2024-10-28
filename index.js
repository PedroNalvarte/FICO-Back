const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes')
const paymentRoutes = require('./routes/paymentRoutes');
const cubicleRoutes = require('./routes/cubicleRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const { connectDB } = require('./config/dbConfig');
const cloudinary = require('cloudinary').v2;



const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Coneccion a la base de datos
connectDB();

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/user', userRoutes);
app.use('/payment', paymentRoutes);
app.use('/cubicles', cubicleRoutes);
app.use('/equipment', equipmentRoutes);

app.get('/', (req, res) => {
    res.send('Hello Worldss!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
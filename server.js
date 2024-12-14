const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Para usar las variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB (sin las opciones obsoletas)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.log('Error de conexión: ', err));

// Modelo de la reserva (simplificado)
const reservationSchema = new mongoose.Schema({
    roomId: Number,
    roomName: String,
    arrivalDate: String,
    departureDate: String,
    name: String,
    email: String,
    phone: String,
    address: String,
    nationality: String
});

const Reservation = mongoose.model('Reservation', reservationSchema);

// Ruta para obtener todas las reservas
app.get('/api/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find(); // Obtiene todas las reservas de la base de datos
        res.json(reservations); // Devuelve las reservas en formato JSON
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener las reservas');
    }
});

// Ruta para crear una nueva reserva
app.post('/api/reservations', async (req, res) => {
    const { roomId, roomName, arrivalDate, departureDate, name, email, phone, address, nationality } = req.body;
    
    const newReservation = new Reservation({
        roomId,
        roomName,
        arrivalDate,
        departureDate,
        name,
        email,
        phone,
        address,
        nationality
    });

    try {
        await newReservation.save(); // Guarda la nueva reserva en la base de datos
        res.status(201).json(newReservation); // Devuelve la reserva recién creada
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al crear la reserva');
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de reservas funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});




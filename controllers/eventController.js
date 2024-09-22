const fs = require('fs');
const axios = require('axios');
const { client } = require('../config/dbConfig');
const { getAccessToken}  = require('../config/auth');
const getEvents = async () => {

    try {
        const res = await client.query
        (` SELECT 
                id_evento,
	 			nombre_evento,
	 			lugar,
	 			aforo,
	 			costo,
	 			equipo_necesario,
	 			estado,
                fecha as date,
	 			fecha_creacion,
	 			entradas_vendidas,
                TO_CHAR(fecha, 'DD-MM-YYYY') AS fecha,
                TO_CHAR(fecha, 'HH24:MI') AS hora
            FROM public.eventos 
            WHERE estado = 'A';`
        );
        const events = res.rows;
        
        const formatDate = (date) => {
            const months = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];

            const d = new Date(date);
            const day = d.getDate();      
            const month = months[d.getMonth()];
            return `${day} de ${month}`;
        };

        const processedEvents = events.map(event => {

            const equipoArray = event.equipo_necesario ? event.equipo_necesario.split(',').map(item => item.trim()) : [];
            const formattedDate = formatDate(event.date)
            return {
                ...event,
                date: event.date,
                time: event.time,
                equipo_necesario: equipoArray,
                fecha_formateada: formattedDate
            };
        });

        if(processedEvents.length > 0){
            return processedEvents;
        }
        else{
            return "Actualmente no hay eventos activos";
        }
       
    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};


async function uploadImageToOneDrive(filePath, accessToken) {
    const fileName = filePath.split('/').pop();
    const fileStream = fs.createReadStream(filePath); 

    try {
        const response = await axios.put(
            `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`,
            fileStream,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'image/jpeg' 
                }
            }
        );
        console.log('Archivo subido con éxito:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error al subir la imagen:', error.response ? error.response.data : error.message);
    }
}

const createEvent = async (eventData, imagePath) => {
    try {

        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('No se pudo obtener el token de acceso para OneDrive');
        }

        // Subir la imagen a OneDrive
        const uploadedImage = await uploadImageToOneDrive(imagePath, accessToken);
        if (!uploadedImage || !uploadedImage.webUrl) {
            throw new Error('No se pudo subir la imagen a OneDrive');
        }

        // Guardar el evento en la base de datos
        const { nombre_evento, lugar, aforo, costo, equipo_necesario, fecha, creador} = eventData;

        const query = `
            INSERT INTO public.eventos 
            (nombre_evento, lugar, aforo, costo, equipo_necesario, fecha, estado, entradas_vendidas, imagen, creador) 
            VALUES ($1, $2, $3, $4, $5, $6, 'A', 0, $7, $8) RETURNING id_evento;
        `;

        const values = [
            nombre_evento,
            lugar,
            aforo,
            costo,
            equipo_necesario.join(', '),
            fecha,
            uploadedImage.webUrl
        ];

        const res = await client.query(query, values);
        const eventId = res.rows[0].id_evento;

        console.log('Evento creado con éxito:', eventId);
        return { eventId, message: 'Evento creado exitosamente', imageUrl: uploadedImage.webUrl };
    } catch (error) {
        console.error('Error al crear el evento:', error.message);
        throw error;
    }
};

module.exports = { getEvents, createEvent };




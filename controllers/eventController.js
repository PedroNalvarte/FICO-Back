const { client } = require('../config/dbConfig');

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
                TO_CHAR(fecha, 'HH24:MI') AS hora,
                imagen,
                creador
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

        if (processedEvents.length > 0) {
            return processedEvents;
        }
        else {
            return "Actualmente no hay eventos activos";
        }

    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};

const getMyEvents = async (usuario) => {

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
                TO_CHAR(fecha, 'HH24:MI') AS hora,
				creador,
				imagen
            FROM public.eventos 
            WHERE estado = 'A'
			AND creador = ${usuario}
UNION
	SELECT
	 			ev.id_evento,
	 			nombre_evento,
	 			lugar,
	 			aforo,
	 			costo,
	 			equipo_necesario,
	 			ev.estado,
                fecha as date,
	 			fecha_creacion,
	 			entradas_vendidas,
                TO_CHAR(fecha, 'DD-MM-YYYY') AS fecha,
                TO_CHAR(fecha, 'HH24:MI') AS hora,
				creador,
				imagen
	FROM public.eventos ev
	INNER JOIN entradas e ON e.id_evento = ev.id_evento
	WHERE ev.estado = 'A'
	AND e.id_usuario = ${usuario};`
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

        if (processedEvents.length > 0) {
            return processedEvents;
        }
        else {
            return "Actualmente no hay eventos activos";
        }

    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};

const createEvent = async (eventData, link) => {
    try {

        const { nombre_evento, lugar, aforo, costo, equipo_necesario, fecha, creador } = eventData;

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
            equipo_necesario,
            fecha,
            link,
            creador
        ];

        const res = await client.query(query, values);
        const eventId = res.rows[0].id_evento;

        console.log('Evento creado con éxito:', eventId);
        return { eventId, message: 'Evento creado exitosamente', imageUrl: link };
    } catch (error) {
        console.error('Error al crear el evento:', error.message);
        throw error;
    }
};

const getEventDetails = async (eventId) => {

    try {
        const res = await client.query
            (` select id_evento, 
            nombre_evento, 
            lugar, 
            aforo, 
            fecha, 
            costo, 
            equipo_necesario, 
            e.fecha_creacion, 
            entradas_vendidas, 
            imagen, 
            creador, 
            nombre
            from eventos e
            inner join usuarios u on e.creador = u.id_usuario
            where id_evento = ${eventId}`
            );
        const events = res.rows;

        if (events.length > 0) {
            return events;
        }
        else {
            return "Actualmente no hay eventos activos";
        }

    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};

module.exports = { getEvents, createEvent, getMyEvents, getEventDetails };




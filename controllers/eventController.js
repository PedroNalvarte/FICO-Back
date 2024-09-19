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

module.exports = { getEvents };
const { client } = require('../config/dbConfig');


const createCubicle = async (name, capacity) => {
    try {

        
        const result = await client.query(`
            INSERT INTO public.cubiculos 
            (nombre_cubiculo, capacidad, estado, disponibilidad) 
            VALUES ('${name}', ${capacity}, 'A', 'D') RETURNING id_cubiculo;
        `);

        const cubicleId = result.rows[0].id_cubiculo;
        return { cubicleId, message: 'Cubiculo creado exitosamente'};
    } catch (error) {
        console.error('Error al crear el cubiculo:', error.message);
        throw error;
    }
};

const reserveCubicle = async (reserveData) => {
    try {
        const { id_usuario, id_cubiculo, hora_reserva, cantidad_horas} = reserveData;

        if(cantidad_horas > 0 && cantidad_horas <= 2){
            const query = `INSERT INTO public.reservas_cubiculos
                (id_usuario, id_cubiculo, fecha_reserva, hora_reserva, cantidad_horas, estado, fecha_creacion)
                VALUES ($1, $2, NOW(), $3, $4,'A', NOW()) RETURNING id_reserva;
            `;
            const values = [
                id_usuario,
                id_cubiculo,
                hora_reserva,
                cantidad_horas
            ];
            const res = await client.query(query, values);
            const reservaId = res.rows[0].id_reserva;
            return { reservaId, message: 'Reserva creada exitosamente'};
        }else{
            return { error: 'Cantidad de horas no puede ser mayor a 2'};
        }

       
    } catch (error) {
        console.error('Error al crear el cubiculo:', error.message);
        throw error;
    }
};

const getAvailableCubicles = async () => {
    try{
        const res = await client.query
        (` SELECT 
                id_cubiculo,
                nombre_cubiculo,
                capacidad 
            FROM 
                public.cubiculos
            WHERE 
                id_cubiculo  IN (
                        SELECT id_cubiculo
                        FROM reservas_cubiculos
                        WHERE fecha_reserva = CURRENT_DATE
                        GROUP BY id_cubiculo
                        HAVING SUM(cantidad_horas) < 13)
                AND estado = 'A';`
        );
        const cubicles = res.rows;
        return cubicles;
    }   catch (error) {
        console.error('Error al obtener los cubiculos:', error.message);
        throw error;
    }
}

const getNotAvailableCubicles = async () => {
    try{
        const res = await client.query
        (` SELECT 
                id_cubiculo,
                nombre_cubiculo,
                capacidad 
            FROM 
                public.cubiculos
            WHERE 
                id_cubiculo NOT IN (
                        SELECT id_cubiculo
                        FROM reservas_cubiculos
                        WHERE fecha_reserva = CURRENT_DATE
                        GROUP BY id_cubiculo
                        HAVING SUM(cantidad_horas) < 13)
                AND estado = 'A';`
        );
        const cubicles = res.rows;
        return cubicles;
    }   catch (error) {
        console.error('Error al obtener los cubiculos:', error.message);
        throw error;
    }
}

const getReservedHoursByCubicle = async(id) => {
    try{
        const res = await client.query
        (` SELECT 
                hora_reserva
            FROM 
                reservas_cubiculos
            WHERE 
                cantidad_horas = 1
                AND id_cubiculo = ${id}
            UNION ALL

            SELECT 
                hora_reserva AS hora_reserva
            FROM 
                reservas_cubiculos
            WHERE 
                cantidad_horas = 2
                AND id_cubiculo = ${id}
            UNION ALL

            SELECT 
                hora_reserva + INTERVAL '1 hour' AS hora_reserva
            FROM 
                reservas_cubiculos
            WHERE 
                cantidad_horas = 2
                AND id_cubiculo = ${id};`
        );
        const hours = res.rows.map(row => row.hora_reserva);
        return hours;
    } catch (error) {
        console.error('Error al obtener las horas:', error.message);
        throw error;
    }
}

module.exports = {createCubicle, reserveCubicle, getAvailableCubicles, getNotAvailableCubicles, getReservedHoursByCubicle};
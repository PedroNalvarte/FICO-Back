const { client } = require('../config/dbConfig');

const createEquipment = async (eventData, link) => {

    console.log(link);

    try {

        const { nombre_equipo, descripcion, cantidad_disponible } = eventData;

        const query = `
            INSERT INTO public.equipos(
            nombre_equipo, descripcion, cantidad_disponible, estado_equipo, estado, fecha_actualizacion, imagen)
            VALUES ('${nombre_equipo}', '${descripcion}', ${cantidad_disponible}, 'Disponible', 'A', NOW(), '${link}') RETURNING id_equipo;
        `;

        const res = await client.query(query);
        const equipmentId = res.rows[0].id_equipo;
        return { equipmentId, message: 'Evento creado exitosamente', imageUrl: link };
    } catch (error) {
        console.error('Error al registrar equipo:', error.message);
        throw error;
    }
};

const getEquipmentList = async () => {

    try {
        const res = await client.query
            (` SELECT id_equipo, nombre_equipo, descripcion, cantidad_disponible, estado_equipo, imagen
                FROM public.equipos
                WHERE estado = 'A'
            `
            );
        const equipment = res.rows;

        if (equipment.length > 0) {
            return equipment;
        }
        else {
            return "Actualmente no hay equipo disponible";
        }

    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};

const updateEquipment = async (eventData, link) => {

    try {
        const { nombre_equipo, descripcion, cantidad_disponible, id_equipo } = eventData;

        const query = `
        UPDATE public.equipos
	    SET 
        nombre_equipo = '${nombre_equipo}', 
        descripcion = '${descripcion}', 
        cantidad_disponible = ${cantidad_disponible}, 
        estado_equipo = 'Disponible', 
        estado = 'A', 
        fecha_actualizacion= NOW(), 
        imagen= '${link}'
	    WHERE id_equipo = ${id_equipo}
        RETURNING id_equipo;
        
        `;

        const res = await client.query(query);
        const equipmentId = res.rows[0].id_equipo;
        return { equipmentId, message: 'Equipo actualizado exitosamente', imageUrl: link };
    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};

module.exports = { createEquipment, getEquipmentList, updateEquipment };

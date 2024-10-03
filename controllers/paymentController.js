const { client } = require('../config/dbConfig');

const registerPayment = async (idEvento, idUsuario, cantidadEntradas, metodoPago, referenciaPago) => {

    try {
        const res = await client.query(`
            SELECT public.registrar_pago(
            ${idEvento},
            ${idUsuario},
            ${cantidadEntradas},
            '${metodoPago}',
            '${referenciaPago}')
        `);

        const result = res.rows[0];
        return result;
    } catch (err) {
        console.error("Error ejecutando la consulta", err.stack);
        throw err;
    }
}

const getTickets = async (idEvento, idUsuario) => {

    try {
        const res = await client.query(`
            select e.id_entrada, e.id_usuario, e.id_evento, e.cantidad, e.monto_total, e.fecha_compra,
                u.nombre, u.apellido
            from entradas e
                inner join usuarios u on u.id_usuario = e.id_usuario
            where e.id_evento = ${idEvento} and u.id_usuario = ${idUsuario}
        `);

        const result = res.rows[0];
        return result;
    } catch (err) {
        console.error("Error ejecutando la consulta", err.stack);
        throw err;
    }
}

module.exports = { registerPayment, getTickets };
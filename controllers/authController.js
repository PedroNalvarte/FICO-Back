const { client } = require('../config/dbConfig');

const login = async (email, password) => {
    try {
        const res = await client.query(`SELECT public.obtener_usuario2('${email}', '${password}')`);
        const result = res.rows[0];
        console.log(result);
        return result;
    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};

const changePassword = async (email, password) => {
    try {
        const res = await client.query(`SELECT cambiar_contrasena('${email}', '${password}');`);
        const result = res.rows[0];
        console.log(result);
        return result;
    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};

// Nueva función para verificar si el correo existe en la base de datos
const checkEmailExists = async (email) => {
    try {
        const res = await client.query(`SELECT * FROM usuarios WHERE email = '${email}'`);
        return res.rows.length > 0; // Retorna true si existe, false si no
    } catch (err) {
        console.error("Error checking email existence", err.stack);
        throw err;
    }
};

// Generador de código de recuperación
const resetCodeGenerator = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(indiceAleatorio);
    }
    return codigo;
};

module.exports = { login, resetCodeGenerator, changePassword, checkEmailExists };

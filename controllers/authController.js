const { client } = require('../config/dbConfig');

const login = async (email, password) => {
    try {
        // Verificamos si el usuario existe primero
        const userCheck = await client.query(`SELECT * FROM usuarios WHERE email = '${email}'`);
        
        if (userCheck.rows.length === 0) {
            // Si no hay filas, significa que el usuario no existe
            return { error: "Usuario no existe" };
        }

        // Ahora verificamos si la contraseña es correcta
        const res = await client.query(`SELECT * FROM usuarios WHERE email = '${email}' AND password = '${password}'`);
        
        if (res.rows.length === 0) {
            // Si el usuario existe pero la contraseña es incorrecta
            return { error: "Contraseña incorrecta" };
        }

        // Si todo es correcto, retornamos el email y el id_rol
        const result = res.rows[0];
        return {
            email: result.email,
            id_rol: result.id_rol
        };
    } catch (err) {
        console.error("Error ejecutando la consulta", err.stack);
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
        console.error("Error ejecutando la consulta", err.stack);
        throw err;
    }
};

const verifyEmail = async (email) => {
    try {
        const res = await client.query(`SELECT COALESCE((select true from usuarios where email = '${email}'), false) AS resultado;`);
        const result = res.rows[0];
        return result;
    } catch (err) {
        console.error("Error ejecutando la consulta", err.stack);
        throw err;
    }
}

//Metodos sin BD
const resetCodeGenerator = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(indiceAleatorio);
    }
    return codigo;
}

module.exports = { login, resetCodeGenerator, changePassword, verifyEmail };

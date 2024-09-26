const { client } = require('../config/dbConfig');

const login = async (email, password) => {
    try {
        // Modificamos la consulta para devolver el email y el id_rol
        const res = await client.query(`SELECT email, id_rol FROM usuarios WHERE email = '${email}' AND password = '${password}'`);
        
        // Verificamos si el usuario no existe o si la contraseña es incorrecta
        if (res.rows.length === 0) {
            return { error: "Usuario no existe o contraseña incorrecta" };
        }

        const result = res.rows[0];  // Aquí obtendremos tanto el correo como el id_rol

        // Devolvemos el email y el rol del usuario
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

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

module.exports = { login, resetCodeGenerator, changePassword };
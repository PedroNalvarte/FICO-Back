const { client } = require('../config/dbConfig');

const login = async (user, password) => {

    try {
        const res = await client.query(`SELECT public.obtener_usuario2('${user}', '${password}')`);
        const result = res.rows[0];
        console.log(result);
        return result;
    } catch (err) {
        console.error("Error executing query", err.stack);
        throw err;
    }
};

module.exports = { login };
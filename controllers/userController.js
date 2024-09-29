const { client } = require('../config/dbConfig');

const getUserProfile = async (email) => {
    try {
        const res = await client.query(`
            SELECT 
                nombre,
                apellido,
                email,
                password 
            FROM public.usuarios
            WHERE email = '${email}';
            `);

        if(res.rows.length == 0){
            return { error: "Usuario no existe" };
        }
        else{
            const result = res.rows[0];
            //const avatarUrl = `https://ui-avatars.com/api/?rounded=true?name=${encodeURIComponent(result.nombre + ' ' + result.apellido)}`;
            const avatarUrl = `https://ui-avatars.com/api/?background=random&rounded=true&name=${encodeURIComponent(result.nombre + ' ' + result.apellido)}`;
            return { 
                ...result, 
                avatar: avatarUrl 
            };
        }
       
    } catch (err) {
        console.error("Error ejecutando la consulta", err.stack);
        throw err;
    }
}


const editUserProfile = async (nombre, apellido, email, password, currentEmail) => {
    try {
        const { nombre, apellido, email, password, currentEmail } = eventData;
        const query = `
            UPDATE public.usuarios
            SET nombre = '$1', apellido = '$2', email = '$3', password = '$4'
            WHERE email = $5`;
        
            const values = [
                nombre,
                apellido,
                email,
                password,
                currentEmail
            ];
    } catch (err) {
        console.error("Error ejecutando la consulta", err.stack);
        throw err;
    }
}

module.exports = { getUserProfile};
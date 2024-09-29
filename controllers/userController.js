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


const updatePassword = async (email, currentPassword, newPassword, repeatPassword) => {
    try {
        const res = await client.query(`
            SELECT password
            FROM public.usuarios
            WHERE email = '${email}'`);
        
        if(res.rows.length == 0){
            return { error: "Usuario no existe" };
        }
        else{
            const oCurrentPassword = res.rows[0].password;
            if(oCurrentPassword != currentPassword){
                 return { error: 'La contraseña ingresada es diferente a la contraseña actual'};
            }
            else if(oCurrentPassword == newPassword){
                return { error: 'La contraseña nueva no puede ser igual a la anterior'};
            }
            else if(newPassword != repeatPassword){
                return { error: 'La contraseña nueva no fue repetida correctamente'};
            }
            else{
                const update = await client.query(`
                    UPDATE public.usuarios
                    SET password = '${newPassword}'
                    WHERE email = '${email}'`);
                return 'Contraseña actualizada correctamente';
            }
        }
            
    } catch (err) {
        console.error("Error ejecutando la consulta", err.stack);
        throw err;
    }
}

module.exports = { getUserProfile, updatePassword};
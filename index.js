const express = require('express');
const cors = require('cors');
const { Client } = require("pg");

const app = express()
const port = 3001

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Worldss!')
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// app.post('/login/:user/:password', (req, res) => {

//     const user = req.params.user;
//     const password = req.params.password;

//     login(user, password)
//         .then((result) => {
//             console.log(JSON.stringify(result.obtener_usuario2));
//             res.json(JSON.stringify(result.obtener_usuario2));
//         })
// });

// app.post('/reset/:user/:password', (req, res) => {

//     const user = req.params.user;
//     const password = req.params.password;

//     resetPassword(user, password)
//         .then((result) => {

//             console.log(result.res);
//             res.send(result.res);

//         })
// });


// app.post('/getMemberships', (req, res) => {
//     getMemberships().then((result) => {
//         res.send(result);
//     }).catch((error) => {
//         console.error("Error al obtener las membresías:", error);
//     });

// });


// app.post('/createMembership/:detalle/:costo/:nombre/:usuario', (req, res) => {
//     const detail = req.params.detalle;
//     const cost = req.params.costo;
//     const name = req.params.nombre;
//     const user = req.params.usuario;

//     createMembership(detail, cost, name, user)
//         .then((result) => {
//             res.send(result.res);
//         })
// });

//-----------------------------Funciones----------------------------

const login = async (user, password) => {

    const client = new Client({
        user: "omodygym_user",
        host: "dpg-cocr9amv3ddc739ki7b0-a.oregon-postgres.render.com",
        database: "omodygym",
        password: "9sAnVEwzwYzR1GMdsET5UQo7XzYjcrup",
        port: 5432,
        ssl: {
            rejectUnauthorizedL: false,
        }
    });

    await client.connect();

    const res = await client.query(`SELECT public.obtener_usuario2('${user}', '${password}')`);

    const result = res.rows[0];

    await client.end();

    return result;

}

const resetPassword = async (user, password) => {

    const client = new Client({
        user: "omodygym_user",
        host: "dpg-cocr9amv3ddc739ki7b0-a.oregon-postgres.render.com",
        database: "omodygym",
        password: "9sAnVEwzwYzR1GMdsET5UQo7XzYjcrup",
        port: 5432,
        ssl: {
            rejectUnauthorizedL: false,
        }
    });

    await client.connect();

    const res = await client.query(`UPDATE contrato SET "contraseña" = '${password}' WHERE id_persona = (select p.id_persona FROM persona p
        INNER JOIN contrato c on p.id_persona = c.id_persona
        where p.numero_documento_identidad = '${user}') RETURNING true as res`);

    const result = res.rows[0];

    await client.end();

    return result;
}

// const createMembership = async (detail, cost, name, user) => {
//     const client = new Client({
//         user: "omodygym_user",
//         host: "dpg-cocr9amv3ddc739ki7b0-a.oregon-postgres.render.com",
//         database: "omodygym",
//         password: "9sAnVEwzwYzR1GMdsET5UQo7XzYjcrup",
//         port: 5432,
//         ssl: {
//             rejectUnauthorizedL: false,
//         }
//     });
//     await client.connect();
//     const res = await client.query(`SELECT public.registrar_membresia('${detail}', '${cost}', '${name}', '${user}')`);
//     const result = res.rows[0];

//     await client.end();

//     return result;

// }

// const getMemberships = async () => {
//     const client = new Client({
//         user: "omodygym_user",
//         host: "dpg-cocr9amv3ddc739ki7b0-a.oregon-postgres.render.com",
//         database: "omodygym",
//         password: "9sAnVEwzwYzR1GMdsET5UQo7XzYjcrup",
//         port: 5432,
//         ssl: {
//             rejectUnauthorizedL: false,
//         }
//     });
//     await client.connect();
//     const result = await client.query(`SELECT id_membresia, nombre, detalle_membresia, estado FROM MEMBRESIA WHERE estado = 'A';`);
//     const membresias = result.rows.map(row => ({
//         Id: row.id_membresia,
//         nombre: row.nombre,
//         detalle: row.detalle_membresia,
//         estado: row.estado
//     }));
//     await client.end();
//     return membresias;
// }

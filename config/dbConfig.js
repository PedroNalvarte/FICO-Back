const { Client } = require("pg");

const client = new Client({
    user: "dis_fico_user",
    host: "dpg-crkg4vggph6c73c9msq0-a.oregon-postgres.render.com",
    database: "dis_fico",
    password: "yWJRJuJrlcuafvh71gZYx49zIy5Va00x",
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Corregido: era rejectUnauthorizedL
    },
})

const connectDB = async () => {
    try {
        await client.connect();
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection error", err.stack);
    }
};

module.exports = { client, connectDB };
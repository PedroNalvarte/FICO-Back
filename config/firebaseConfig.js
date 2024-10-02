const admin = require("firebase-admin");

const serviceAccount = require("../config/fico-e27bd-firebase-adminsdk-2tu8l-099be06c64.json"); // Cambia esta ruta por la correcta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "fico-e27bd.appspot.com"
});

const bucket = admin.storage().bucket();

module.exports = bucket;
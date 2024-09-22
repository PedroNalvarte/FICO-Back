const msal = require('@azure/msal-node');

const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: 'https://login.microsoftonline.com/' + process.env.TENANT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: 'http://localhost:3001'
    }
};


const cca = new msal.ConfidentialClientApplication(msalConfig);

const tokenRequest = {
    scopes: ['https://graph.microsoft.com/.default'],
};

async function getAccessToken() {
    try {
        const response = await cca.acquireTokenByClientCredential(tokenRequest);
        return response.accessToken;
    } catch (error) {
        console.log('Error al obtener el token de acceso:', error);
    }
}

module.exports = { getAccessToken };
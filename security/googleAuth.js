const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('"866544580970-1jc6oknok8s8v7tcra1m8r93a78cgern.apps.googleusercontent.com"');

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,   // usar `token` y no `idToken`
    audience: "866544580970-1jc6oknok8s8v7tcra1m8r93a78cgern.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();
  console.log('Usuario verificado:', payload);
  return payload;
}

module.exports = { verifyGoogleToken };
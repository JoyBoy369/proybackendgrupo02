const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('"657767929746-8quhhgu57q2bu7mqdokg8at2lk7k61ra.apps.googleusercontent.com"');

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,   // usar `token` y no `idToken`
    audience: "657767929746-8quhhgu57q2bu7mqdokg8at2lk7k61ra.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();
  console.log('Usuario verificado:', payload);
  return payload;
}

module.exports = { verifyGoogleToken };
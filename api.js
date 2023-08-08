const express = require('express');
const app = express();
const {
  OAuth2Client
} = require('google-auth-library');

const {
  importContacts
} = require('./util');
const keys = require('./credentials.json');



const oAuth2Client = new OAuth2Client(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);


const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/directory.readonly',
];

app.use(express.json());

app.get('/auth', (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.json({
    authorizeUrl
  });
});

app.get('/oauth2callback', async (req, res) => {
  try {
    const code = req.query.code;
    res.json({
      code
    });
  } catch (error) {
    console.error('OAuth2 callback error:', error);
    res.status(500).json({
      error: 'Authentication failed'
    });
  }
});

app.get('/contacts', async (req, res) => {
  try {
    const {
      code
    } = req.query;
    console.log(code)
    const {
      tokens
    } = await oAuth2Client.getToken(code);
    console.log(tokens)
    oAuth2Client.setCredentials(tokens);

    const results = await importContacts(oAuth2Client)
    res.json(results);
  } catch (error) {
    console.error('Import contacts error:', error);
    res.status(500).json({
      error: 'Failed to import contacts'
    });
  }
});

app.listen(3000, () => {
  console.log(`Server is listening on port ${3000}`);
});
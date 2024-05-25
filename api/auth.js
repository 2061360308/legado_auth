const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/auth', async (req, res) => {
  const code = req.query.code;
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;
  const redirect_uri = process.env.REDIRECT_URI;

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id,
      client_secret,
      code,
      redirect_uri
    }, {
      headers: {
        accept: 'application/json'
      }
    });

    console.log(response.data);

    const access_token = response.data.access_token;

    // Redirect back to your frontend app with the access token in the URL
    // res.redirect(`http://localhost:8080/auth?access_token=${access_token}`);

    return res.json({ access_token,  response});
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while trying to authenticate');
  }
});

module.exports = app;
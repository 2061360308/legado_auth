const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/auth', async (req, res) => {
  const code = req.query.code;

  if(!code) return res.status(400).send('No code provided');
  
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  let redirect_uri;

  // Github 回调地址
  if (process.env.APP_URL.endsWith('/')) {
    redirect_uri = process.env.APP_URL + "api/auth";
  } else {
    redirect_uri = process.env.APP_URL + "/api/auth";
  }

  // Github Pages 地址
  let pages_url = process.env.PAGES_URL;
  if (! pages_url.endsWith('/')) {
    pages_url = pages_url + '/';
  }
  

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

    // console.log(response.data);

    const access_token = response.data.access_token;

    if(!access_token) {
      console.error("Github未返回访问令牌：", response.data);
      return res.status(500).send({message: 'No access token returned from Github.', data: respose.data});
    }

    // Redirect back to your frontend app with the access token in the URL
    res.redirect(`${pages_url}#/?access_token=${access_token}`);

    // return res.json({ code: code, data: response.data});

  } catch (error) {
    console.error("认证未知错误：",error);
    res.status(500).send({message: 'An error occurred while trying to authenticate', error: error});
  }
});

app.get('/api', async (req, res) => {
  res.send('Your API is working properly. The github auth route is at /api/auth');
});

module.exports = app;
const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

// enable ssl redirect
app.use(sslRedirect());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), () => {
  console.log(`Listening on ${app.get('port')}`)
})

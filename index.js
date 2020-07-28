require('dotenv').config();

let express = require('express');
let app = express();
let ejs = require('ejs');
const haikus = require('./haikus.json');
const port = process.env.PORT || 3000;
const client = require('twilio')(process.env.accountSid, process.env.authToken);
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  host: 'db',
  port: 5432
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  pool.query('SELECT * FROM haikus ORDER BY id', (err, haikus) => {
    res.render('index', {haikus: haikus.rows});
  });
});

app.post('/heart', (req, res) => {
  pool.query('UPDATE haikus SET hearts = hearts + 1 WHERE id = $1', [req.body.id], (err, haikus) => {
    console.log('hi');
    client.messages
      .create(
          {
            body: 'Hi there!',
            from: '+16179817986',
            to: '+19785022427',
            mediaUrl: 'https://user-images.githubusercontent.com/2132776/88610282-3dbf5100-d054-11ea-9c7b-66af3c9fc912.png'
         })
      .then(message => console.log(message.sid));
    res.send('Success');
  });
});

app.listen(port);
console.log('Server running on','https://localhost:3000')
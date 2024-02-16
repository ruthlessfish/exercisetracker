require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

async function connect() {
  await mongoose.connect(process.env.MONGO_URI);
}
connect()
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/users', (req, res) => {
  return res.json([]);
});

app.get('/api/users', (req, res) => {});

app.post('/api/users/:_id/exercises', (req, res) => {});

app.get('/api/users/:_id/logs', (req, res) => {});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

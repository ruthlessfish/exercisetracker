require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const UserExercise = require('./models/exercise');

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

app.post('/api/users', async (req, res) => {
  if( ! req.body.username){
    return res.json({error: "Username is required."});
  }

  const user = new User({username: req.body.username});
  await user.save();

  return res.json({
    username: user.username,
    _id: user._id
  });
});

app.get('/api/users', async (req, res) => {
  const users = await User.find();
  if (!users) return res.json([]);

  userArr = [];
  users.forEach(user => {
    userArr.push({
      username: user.username,
      _id: user._id
    });
  });
  
  return res.json(userArr);
});

app.post('/api/users/:_id/exercises', async (req, res) => {
  if( ! req.body.description || ! req.body.duration || ! req.params._id){
    return res.json({error: "Description, duration and userId are required."});
  }

  const user = await User.findById(req.params._id);

  if (!user) return res.json({error: "User not found."});

  const exercise = new UserExercise({
    username: user.username,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date ? new Date(req.body.date) : new Date()
  });

  await exercise.save();

  const log = [];

  const exercises = await UserExercise.find({username: user.username});

  exercises.forEach(exercise => {
    log.push({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    });
  });

  return res.json({
    username: user.username,
    _id: user._id,
    count: log.length,
    log: log
  });
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const user = User.findById(req.params._id);
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;

  if (!user) return res.json({error: "User not found."});

  const log = [];

  const params = {username: user.username};

  if(from || to) {
    params.date = {};
    if(from) {
      params.date.$gte = from;
    }
    if(to) {
      params.date.$lte = to;
    }
  }

  if(limit > 0) {
    params.limit = limit;
  }

  const exercises = await UserExercise.find({username: user.username});

  if(exercises) {
    exercises.forEach(exercise => {
      log.push({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      });
    });
  }

  return res.json({
    username: user.username,
    _id: user._id,
    count: log.length,
    log: log
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

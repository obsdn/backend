const express = require('express');
const app = express();
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const profileRoutes = require('./api/routes/profile');
const billetsRoutes = require('./api/routes/billets');
const userRoutes = require('./api/routes/user');
const messagesRoutes = require('./api/routes/messages');

const checkAuth = require('./api/middleware/check-auth');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); //make uploads public
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const router = express.Router();

//CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Request-Headers');
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    return res.status(200).json({});
  };
  next();
});

//routes which should handle requests
app.use('/profile', profileRoutes);
app.use('/billets', billetsRoutes);
app.use('/user', userRoutes);
app.use('/messages', messagesRoutes);

app.use((req, res, next) =>{
  const error = new Error('not found');
  error.status = 404;
  next(error);
});

app.use('/api', router);

app.use((error, req, res, next) =>{
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

//mongo connect
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/socialnetwork', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

const server = app.listen(4200, () => {
  console.log("hi it's on port 4200");
});

//chatbox here
const socketioJwt = require('socketio-jwt'); //jwt auth for socket to do later
const sio = require('socket.io')(server);

sio.on('connection', function(socket) {

    console.log('socket connected.', 'id:', socket.id)
    socket.on('SEND_MESSAGE', function(data) {
        sio.emit('MESSAGE', data)
    })

  })

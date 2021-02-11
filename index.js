const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');

const comicsRoutes = require('./routes/comics-routes');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  next();
});

app.use('/api/editions', comicsRoutes);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/frontend/src/index.html'));
// });

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

const PORT = 5000;
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@lavirintdb.mrfnl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() =>
    app.listen(
      process.env.PORT || PORT,
      console.log(`Server listenig on port ${PORT}`)
    )
  )
  .catch(err => console.log(err));

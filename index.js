const express = require('express');
// const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const HttpError = require('./models/http-error');

const usersRoutes = require('./routes/users-routes');
const comicsRoutes = require('./routes/comics-routes');
const promoRoutes = require('./routes/promo-routes');
const settingsRoutes = require('./routes/settings-routes');

const app = express();

mongoose.set('useCreateIndex', true);
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
// app.use(express.static(path.join(__dirname, 'uploads/images')));
// app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  next();
});

app.use('/api/settings', settingsRoutes);
app.use('/api/comics', comicsRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/users', usersRoutes);

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => console.log(err));
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occured!' });
});

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));
  // app.use(express.static(path.join('frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

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

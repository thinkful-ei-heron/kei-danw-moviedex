const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
require('dotenv').config();

const MOVIES = require('./movies.json');

function handleGetMovie(req, res){
  let response = MOVIES;
  let genreQuery = req.query.genre;
  if (genreQuery) {
    genreQuery = req.query.genre.charAt(0).toUpperCase() + req.query.genre.toLowerCase().slice(1);
    response = response.filter(movie => movie.genre.includes(genreQuery));
  }

  let countryQuery = req.query.country;
  if (countryQuery) {
    countryQuery= req.query.country.charAt(0).toUpperCase() + req.query.country.toLowerCase().slice(1);
    response = response.filter(movie => movie.country.includes(countryQuery));
  }

  let voteQuery = req.query.avg_vote;
  if (voteQuery) {
    voteQuery = Number(voteQuery);
    response = response.filter(movie => movie.avg_vote >= voteQuery);
  }

  if (response.length === 0) {
    res.status(200).json('No results.');
  }

  res.status(200).json(response);
}

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  if(!authToken || authToken.split(' ')[1] !== apiToken){
    return res.status(401).json({error: 'Unauthorized request'});
  }
  next();
});

app.get('/movie', handleGetMovie);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

const express = require('express');
const cron = require('./cron');
// const mail = require('./../application/mail');
// const movie = require('./../application/movie');

const routes = express.Router();


// Schedule the notification task to run every minute

routes.post('/new-schedule', (req, res) => {
    cron.createSchedule(req, res);
})

routes.get('/list',(req, res) => {
    cron.getScheduleList(req, res);
})

// routes.post('/movie-time-update',(req, res) => {
//     movie.Update(req, res);
// })

// routes.post('/get-movie-list',(req, res) => {
//     movie.MovieList(req, res);
// })
module.exports = routes;
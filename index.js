const express = require('express');
const ui = require('kue-ui');
const basicAuth = require('basic-auth-connect');
const bodyParser = require('body-parser');
const port = 3030;

const redisConfig = {
    host: process.env.JOB_QUEUE_REDIS_HOST || 'localhost',
    port: process.env.JOB_QUEUE_REDIS_PORT || '6379'
};

if (process.env.JOB_QUEUE_REDIS_PASS) {
    redisConfig.auth = process.env.JOB_QUEUE_REDIS_PASS;
}

const queue = kue.createQueue({
  disableSearch: false,
  redis: redisConfig
});

queue.on('error', function(err) {
    console.log('ERROR:');
    console.log(err);
});

ui.setup({
    apiURL: '/api',
    baseURL: '/kue',
    updateInterval: 5000
});

const app = express();

if (process.env.JOB_QUEUE_USERNAME && process.env.JOB_QUEUE_PASSWORD) {
  app.use(basicAuth(process.env.JOB_QUEUE_USERNAME, process.env.JOB_QUEUE_PASSWORD));
}
app.use(bodyParser.json({
  limit: '50mb',
  parameterLimit: 100000
 }))
app.use(bodyParser.urlencoded({extended: false, limit: '50mb', parameterLimit: 100000}));
kue.app.use(bodyParser.json({
  limit: '50mb',
  parameterLimit: 100000
 }));
kue.app.use(bodyParser.urlencoded({extended: false, limit: '50mb', parameterLimit: 100000}));
app.use('/api', kue.app)
app.use('/kue', ui.app)
app.listen(port);

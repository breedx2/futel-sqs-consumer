'use strict';

const AWS = require('aws-sdk');
const env = require('../env.json');
const FutelSqsConsumer = require('./consumer.js');
const FutelMessageDeleter = require('./deleter.js');

AWS.config.update({region: env.region});
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: env.profile});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const deleter = new FutelMessageDeleter(sqs, env.url);

const config = {
  url: env.url,
  batchSize: 10,
  pollDurationSeconds: 10
};

const consumer = new FutelSqsConsumer(sqs, deleter, config);
consumer.runForever();

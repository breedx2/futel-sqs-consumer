'use strict';

const AWS = require('aws-sdk');
const env = require('../env.json');
const FutelSqsConsumer = require('./consumer.js');
const FutelMessageDeleter = require('./deleter.js');
const FutelSqsResponseMapper = require('./mapper.js');
const FutelMessageDispatcher = require('./dispatcher.js');
const pred = require('./predicates');

AWS.config.update({region: env.region});
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: env.profile});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const mapper = new FutelSqsResponseMapper();
const deleter = new FutelMessageDeleter(sqs, env.url);
const dispatcher = new FutelMessageDispatcher([
  pred.standard(m => console.log(JSON.stringify(m, null, '\t')))
]);

const config = {
  url: env.url,
  batchSize: 10,
  pollDurationSeconds: 10,
  mapper: mapper,
  dispatcher: dispatcher,
  deleter: deleter,
};

const consumer = new FutelSqsConsumer(sqs, config);
consumer.runForever();

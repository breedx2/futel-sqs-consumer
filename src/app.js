'use strict';

const AWS = require('aws-sdk');
const env = require('../env.json');
const FutelSqsConsumer = require('./consumer.js');

AWS.config.update({region: env.region});
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: env.profile});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const config = {
  url: env.url,
};
const consumer = new FutelSqsConsumer(sqs, config);
consumer.runForever();

'use strict';

const AWS = require('aws-sdk');
const env = require('../env.json');
const FutelSqsConsumer = require('./consumer');
const FutelMessageDeleter = require('./deleter');
const FutelSqsResponseMapper = require('./mapper');
const FutelMessageDispatcher = require('./dispatcher');

class FutelConsumerBuilder {

  constructor() {
    this.awsProfile = null;
    this.queueUrl = null;
    this.region = 'us-west-2';
    this.batchSize = 10;
    this.pollDurationSeconds = 10;
    this.predicatedHandlers = [];
  }

  withAwsProfile(profile) {
    this.awsProfile = profile;
    return this;
  }
  withQueueUrl(url) {
    this.queueUrl = url;
    return this;
  }
  withRegion(region) {
    this.region = region;
    return this;
  }
  withBatchSize(batchSize) {
    this.batchSize = batchSize;
    return this;
  }
  withPollDurationSeconds(pollDurationSeconds) {
    this.pollDurationSeconds = pollDurationSeconds;
    return this;
  }
  addHandler(predHandler) {
    this.predicatedHandlers.push(predHandler);
    return this;
  }
  build() {
    this._validate();

    const sqs = this._buildSqs();
    const mapper = new FutelSqsResponseMapper();
    const deleter = new FutelMessageDeleter(sqs, this.queueUrl);
    const dispatcher = new FutelMessageDispatcher(this.predicatedHandlers);

    const config = {
      url: env.url,
      batchSize: this.batchSize,
      pollDurationSeconds: this.pollDurationSeconds,
      mapper: mapper,
      dispatcher: dispatcher,
      deleter: deleter,
    };

    return new FutelSqsConsumer(sqs, config);
  }

  _validate(){
    if (!this.awsProfile) {
      throw new Error("AWS profile name must be specified");
    }
    if (!this.queueUrl) {
      throw new Error("SQS queue url is required");
    }
  }

  _buildSqs(){
    AWS.config.update({region: this.region});
    AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: this.awsProfile});
    return new AWS.SQS({apiVersion: '2012-11-05'});
  }

}

module.exports = FutelConsumerBuilder;

'use strict';

const env = require('../env.json');
const pred = require('./predicates');
const FutelConsumerBuilder = require('./builder');

function simpleHandler(m) {
  console.log(JSON.stringify(m, null, '\t'));
}
const standardHandler = pred.standard(simpleHandler);

const consumer = new FutelConsumerBuilder()
  .withRegion(env.region)
  .withAwsProfile(env.profile)
  .withQueueUrl(env.url)
  .withBatchSize(10)
  .withPollDurationSeconds(10)
  .addHandler(standardHandler)
  .build();

consumer.runForever();

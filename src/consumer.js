'use strict';

const receiveParams = {
 AttributeNames: [ "SentTimestamp" ],
 MessageAttributeNames: [ "All" ],
 VisibilityTimeout: 20,
};

// Reads batches from SQS, transforms the responses into something
// more usable, dispatches them to a delegate processor,
// and then deletes them from the queue.
class FutelSqsConsumer {

  constructor(sqs, config){
    this.sqs = sqs;
    this.mapper = config.mapper;
    this.dispatcher = config.dispatcher;
    this.deleter = config.deleter;
    receiveParams.QueueUrl = config.url;
    receiveParams.MaxNumberOfMessages = config.batchSize || 10;
    receiveParams.WaitTimeSeconds = config.pollDurationSeconds || 10;
  }

  runForever(){
    console.log("Polling for messages...");
    this.sqs.receiveMessage(receiveParams)
      .promise()
      .then(m => this.mapper.mapResponse(m))
      .then(m => this.dispatcher.dispatchMessages(m))
      .then(m => this.deleter.deleteMessages(m))
      .catch(err => {
          console.log("Error", err);
      })
      .then(_ => setImmediate(() => this.runForever()));
  }
}

module.exports = FutelSqsConsumer;

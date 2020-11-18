'use strict';

const receiveParams = {
 AttributeNames: [ "SentTimestamp" ],
 // MaxNumberOfMessages: 10,
 MessageAttributeNames: [ "All" ],
 // QueueUrl: env.url,
 VisibilityTimeout: 20,
 // WaitTimeSeconds: 10
};

class FutelSqsConsumer {

  constructor(sqs, config){
    this.sqs = sqs;
    this.config = config;
    receiveParams.QueueUrl = config.url;
    receiveParams.MaxNumberOfMessages = config.batchSize || 10;
    receiveParams.WaitTimeSeconds = config.pollDuration || 10;
  }

  runForever(){

    this.sqs.receiveMessage(receiveParams)
      .promise()
      .then(m => this.mapResponse(m))
      .then(m => this.dispatchMessages(m))
      .then(m => this.deleteMessages(m))
      .catch(err => {
          console.log("Error", err);
      });

  }

  mapResponse(data){
    if (!data.Messages) {
      return [];
    }
    console.log(`Got ${data.Messages.length} messages!`);
    const self = this;
    return data.Messages.map(msg => self.mapMessage(msg));
  }

  dispatchMessages(messages){
    messages.forEach(m => console.log(JSON.stringify(m.message, null, '\t')));
    return messages;
  }

  deleteMessages(messages){
    const self = this;
    const promises = messages.map(msg => {
      return self.sqs.deleteMessage({
          QueueUrl: self.config.url,
          ReceiptHandle: msg.receiptHandle
        })
        .promise()
        // .then(res => console.log(`Deleted ${msg.receiptHandle}`))
        .catch(err => console.log("Error deleting", err));
      });
    return Promise.all(promises);
  }

  mapMessage(awsMsg){
    const rawBody = awsMsg.Body
    const body = JSON.parse(rawBody);
    const message = JSON.parse(body.Message);
    message.timestamp = body.Timestamp;
    return {
        message: message,
        // timestamp: body.Timestamp,
        receiptHandle: awsMsg.ReceiptHandle
    };
  }
}

module.exports = FutelSqsConsumer;

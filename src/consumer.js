'use strict';

const receiveParams = {
 AttributeNames: [ "SentTimestamp" ],
 MessageAttributeNames: [ "All" ],
 VisibilityTimeout: 20,
};

class FutelSqsConsumer {

  constructor(sqs, deleter, config){
    this.sqs = sqs;
    this.deleter = deleter;
    this.config = config;
    receiveParams.QueueUrl = config.url;
    receiveParams.MaxNumberOfMessages = config.batchSize || 10;
    receiveParams.WaitTimeSeconds = config.pollDurationSeconds || 10;
  }

  runForever(){
    //TODO: Actually run forever

    this.sqs.receiveMessage(receiveParams)
      .promise()
      .then(m => this.mapResponse(m))
      .then(m => this.dispatchMessages(m))
      .then(m => this.deleter.deleteMessages(m))
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

'use strict';

const receiveParams = {
 AttributeNames: [ "SentTimestamp" ],
 MessageAttributeNames: [ "All" ],
 VisibilityTimeout: 20,
};
var runCt = 0;
class FutelSqsConsumer {

  constructor(sqs, config){
    this.sqs = sqs;
    this.mapper = config.mapper;
    this.deleter = config.deleter;
    receiveParams.QueueUrl = config.url;
    receiveParams.MaxNumberOfMessages = config.batchSize || 10;
    receiveParams.WaitTimeSeconds = config.pollDurationSeconds || 10;
  }

  runForever(){
    //TODO: Actually run forever

    this.sqs.receiveMessage(receiveParams)
      .promise()
      .then(m => this.mapper.mapResponse(m))
      .then(m => this.dispatchMessages(m))
      .then(m => this.deleter.deleteMessages(m))
      .catch(err => {
          console.log("Error", err);
      })
      .then(_ => {
        //TODO: This is a temp/hack/dev shim -- remove me
        runCt = runCt + 1;
        if( runCt < 5){
          console.log("SCHEDULING ANOTHER RUN");
          return setImmediate(() => this.runForever());
        }
      });
  }

  dispatchMessages(messages){
    messages.forEach(m => console.log(JSON.stringify(m.message, null, '\t')));
    return messages;
  }

}

module.exports = FutelSqsConsumer;

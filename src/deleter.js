'use strict';

class FutelMessageDeleter {

  constructor(sqs, url){
    this.sqs = sqs;
    this.url = url;
  }

  deleteMessages(messages){
    const self = this;
    const promises = messages.map(msg => {
      return self.sqs.deleteMessage({
          QueueUrl: self.url,
          ReceiptHandle: msg.receiptHandle
        })
        .promise()
        // .then(res => console.log(`Deleted ${msg.receiptHandle}`))
        .catch(err => console.log("Error deleting", err));
      });
    return Promise.all(promises);
  }
}

module.exports = FutelMessageDeleter;

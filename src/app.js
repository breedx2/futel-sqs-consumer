'use strict';

const AWS = require('aws-sdk');
const env = require('../env.json');

AWS.config.update({region: 'us-west-2'});
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: env.profile});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const params = {
 AttributeNames: [ "SentTimestamp" ],
 MaxNumberOfMessages: 10,
 MessageAttributeNames: [ "All" ],
 QueueUrl: env.url,
 VisibilityTimeout: 20,
 WaitTimeSeconds: 0
};

sqs.receiveMessage(params).promise()
  .then(mapResponse)
  .then(dispatchMessages)
  .then(deleteMessages)
  .catch(err => {
      console.log("Error", err);
  });

function mapResponse(data){
  if (!data.Messages) {
    return [];
  }
  console.log(`Got ${data.Messages.length} messages!`);
  return data.Messages.map(msg => mapMessage(msg));
}

function dispatchMessages(messages){
  messages.forEach(m => console.log(JSON.stringify(m.message, null, '\t')));
  return messages;
}

function deleteMessages(messages){
  const promises = messages.map(msg => {
    return sqs.deleteMessage(
        { QueueUrl: env.url,
          ReceiptHandle: msg.receiptHandle
        })
        .promise()
        // .then(res => console.log(`Deleted ${msg.receiptHandle}`))
        .catch(err => console.log("Error deleting", err));
  });
  return Promise.all(promises);
}

function mapMessage(awsMsg){
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

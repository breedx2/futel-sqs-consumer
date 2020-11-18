'use strict';

class FutelSqsResponseMapper {

  mapResponse(data){
    if (!data.Messages) {
      return [];
    }
    console.log(`Got ${data.Messages.length} messages!`);
    const self = this;
    return data.Messages.map(msg => self._mapMessage(msg));
  }

  _mapMessage(awsMsg){
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

module.exports = FutelSqsResponseMapper;

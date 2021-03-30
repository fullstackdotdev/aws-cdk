/* eslint-disable no-console */

import { DynamoDBStreamEvent } from 'aws-lambda';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
const client = new SNSClient({ region: 'us-east-1' });

export const handler = async (event: DynamoDBStreamEvent): Promise<unknown> => {
  console.log(event.Records);
  let command: PublishCommand;

  switch (event.Records[0].eventName) {
    case 'INSERT':
      command = new PublishCommand({
        PhoneNumber: '+1xxxxxxxxxx',
        Message: `${event.Records[0].eventName}: Item`
      });
      await client.send(command);
      break;
    case 'MODIFY':
      command = new PublishCommand({
        PhoneNumber: '+1xxxxxxxxxx',
        Message: `${event.Records[0].eventName}: Item`
      });
      await client.send(command);
      break;
  }
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: { result: event.Records }
  };
};

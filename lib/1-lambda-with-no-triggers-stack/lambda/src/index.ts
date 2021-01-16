import axios from 'axios';
import { APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  const result = await axios.get(
    'https://jsonplaceholder.typicode.com/todos/1'
  );
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: { input: event.body, result: result.data }
  };
};

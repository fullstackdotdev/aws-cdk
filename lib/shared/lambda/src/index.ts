import axios from 'axios';
import { APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  const result = await axios.get('https://jsonplaceholder.typicode.com/todos');
  return {
    statusCode: 200,
    headers: { header: event.headers },
    body: { input: event.body, result: result.data }
  };
};

import axios from 'axios';

export const handler = async (event: unknown): Promise<unknown> => {
  const result = await axios.get('https://jsonplaceholder.typicode.com/todos');
  return {
    statusCode: 200,
    body: { event: event, result: result.data }
  };
};

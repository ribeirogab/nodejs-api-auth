export const handler = async (event) => {
  console.log('Request event: ', event);

  return {
    statusCode: 200,
    body: JSON.stringify('Hello, World!'),
  };
};

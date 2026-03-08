import express from 'express';

const app = express();

app.get('/', (_, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.info('Server is running on port 3000');
});

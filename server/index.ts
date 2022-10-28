import express from 'express';
import cors from 'cors';
import bparser from 'body-parser';
import jwt from 'jsonwebtoken';

const {sign} = jwt;

const isDocker = process.env['DOCKER'] !== undefined;

const SECRET = '>>=secret=<<';

const app = express();

app.use(cors());
app.use(bparser.json());
app.use(bparser.urlencoded({extended: true}));

app.listen(3000, () => {
  console.log(
    'Server started on port 3000' +
      (isDocker ? ' (Docker)' : ''),
  );
});

app.post('/token', (req, res) => {
  console.log('------------------------');
  console.log(req.body);
  console.log('------------------------');

  res.setHeader('Content-Type', 'text/plain');

  setTimeout(() => {
    res.end(sign(req.body, SECRET));
  }, 200);
});

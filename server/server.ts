import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import bparser from 'body-parser';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(bparser.json());
app.use(bparser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.all('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, PUT, PATCH, POST, DELETE',
  );
  res.header(
    'Access-Control-Allow-Headers',
    req.header('access-control-request-headers'),
  );

  const [, ...url] = req.url;

  console.log(req.body, req.headers);

  fetch(url.join(''), {
    origin: 'http://localhost:7575',
    method: req.method,
    // @ts-ignore
    headers: req.headers,
    body: JSON.stringify(req.body),
  })
    .then((r) => r.json())
    .catch((e) => {
      console.error(e);

      res.status(500).json(e);
    });
});

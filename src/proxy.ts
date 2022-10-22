import express from 'express';

import { createProxyMiddleware } from 'http-proxy-middleware';

const httpJsonDevUrl =
  process.env['REACT_APP_HTTP_JSON'] ?? 'http://localhost:7575';

const filter = (pathname: string, req: any): boolean => {
  // Proxy requests to the http json api when in development
  const proxied =
    req.includes(httpJsonDevUrl) &&
    pathname.match('^/v1') &&
    process.env['NODE_ENV'] === 'development';

  if (proxied) {
    console.log(
      `Request with path ${pathname} proxied from host ${req.url} to host ${httpJsonDevUrl}`,
    );
  }

  return !!proxied;
};

const app = express();
app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.use(createProxyMiddleware(filter));

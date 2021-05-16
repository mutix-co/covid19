const path = require('path');
const http = require('http');
const next = require('next');
const express = require('express');
const sql = require('./sql');
const signature = require('./api/signature');

const { env } = process;

const dev = env.NODE_ENV !== 'production';
const web = next({
  dev,
  dir: path.join(__dirname, '..'),
  conf: {
    poweredByHeader: false,
    publicRuntimeConfig: {
      basePath: '/',
      port: env.NODE_PORT || env.PORT || 8080,
    },
  },
});

const handler = web.getRequestHandler();

const app = express();
const server = http.createServer(app);

async function checkDatabase() {
  try {
    await sql.raw('SELECT NOW()');
    return 'available';
  } catch (error) {
    return 'issue';
  }
}

app.get('/healthz', async (req, res) => res.json({ database: await checkDatabase() }));

signature(app);

(async () => {
  if (env.JEST_WORKER_ID === undefined) await web.prepare();
  app.get('*', (req, res) => handler(req, res));
})();

module.exports = server;

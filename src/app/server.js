const path = require('path');
const http = require('http');
const next = require('next');
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./sql');

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

app.post('/api/signature', bodyParser.json(), async (req, res) => {
  const { key, data } = req.body;
  if (/^[a-z0-9]+$/.test(key) === false || /^[a-z0-9:]+$/.test(data) === false) {
    res.status(400).send('Bad a Request');
    return;
  }

  try {
    const [result] = await sql('signature').insert({
      key, data, createdAt: new Date(), updatedAt: new Date(),
    }).returning('*');
    res.json({ id: result.id, timestamps: Date.now() / 1000 });
  } catch (err) {
    res.status(500).send('Save Failed');
  }
});

app.get('/api/signature/:id', async (req, res) => {
  const { id } = req.params;
  if (/^[0-9a-f]{32}$/.test(id) === false) {
    res.status(400).send('Bad Request');
    return;
  }

  const signature = await sql('signature').where('id', id).first();
  if (signature === null) {
    res.status(404).send('Sorry, not found it.');
    return;
  }

  const timestamps = new Date(signature.createdAt).getTime();
  res.json({ id, timestamps: timestamps / 1000 });
});

(async () => {
  if (env.JEST_WORKER_ID === undefined) await web.prepare();
  app.get('*', (req, res) => handler(req, res));
})();

module.exports = server;

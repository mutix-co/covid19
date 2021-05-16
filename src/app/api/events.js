const express = require('express');
const { convertUnicodeToString, decode32, JSONWebSecretBox } = require('jw25519');
const sql = require('../sql');

module.exports = function event(app) {
  app.post('/api/events', express.json(), async (req, res) => {
    const { key, title } = req.body;
    if (!title) {
      res.status(400).send('Bad a Request');
      return;
    }

    try {
      const [result] = await sql('event').insert({
        key, title: escape(title), createdAt: new Date(), updatedAt: new Date(),
      }).returning('*');
      res.json({ id: result.id, title });
    } catch (err) {
      res.status(500).send('Save Failed');
    }
  });

  app.get('/api/events/:key', async (req, res) => {
    const { key } = req.params;
    const { title } = req.query;
    if (/^[a-z0-9]+$/.test(key) === false) {
      res.status(400).send('Bad a Request');
      return;
    }

    try {
      const result = await sql('event').where('key', key).first();
      if (result !== null) {
        res.json({ id: result.id, title: result.title });
        return;
      }

      if (!title) throw new Error();

      const [newi] = await sql('event').insert({
        key, title: escape(title), createdAt: new Date(), updatedAt: new Date(),
      }).returning('*');
      res.json({ id: newi.id, title: newi.title });
    } catch (err) {
      res.status(404).send('Not Found');
    }
  });

  app.post('/api/events/:key/signatures', express.json(), async (req, res) => {
    const { key } = req.params;
    const { start_at: startAt, end_at: endAt, secret } = req.body;
    if (
      /^[a-z0-9]+$/.test(key) === false
      || /^[a-z0-9]+$/.test(secret) === false
      || /^[0-9]+$/.test(startAt) === false
      || /^[0-9]+$/.test(endAt) === false
    ) {
      res.status(400).send('Bad a Request');
      return;
    }

    try {
      const result = await sql('signature')
        .where('key', key)
        .whereBetween(
          'created_at',
          [new Date(startAt * 1000), new Date(endAt * 1000)],
        );

      let successful = 0;
      const secretBox = new JSONWebSecretBox(decode32(secret));
      const signatures = result.map((item) => {
        try {
          const [pkey, data] = item.data.split(':');
          const text = convertUnicodeToString(secretBox.decrypt(data, decode32(pkey)));
          successful += 1;
          return {
            id: item.id,
            data: text,
            ips: item.ips || '',
            timestamp: Math.round(new Date(item.createdAt).getTime() / 1000),
          };
        } catch (e) {
          return {
            id: item.id,
            data: 'Decrypting failed',
            ips: '',
            timestamp: Math.round(new Date(item.createdAt).getTime() / 1000),
          };
        }
      });

      if (successful > 0) {
        const evt = await sql('event').where('key', key).first();
        await sql('history').insert({
          event_id: evt && evt.id,
          start_at: new Date(startAt * 1000),
          end_at: new Date(endAt * 1000),
          number_of_signature: successful,
        });
      }

      res.json({ key, signatures });
    } catch (err) {
      res.status(500).send('Save Failed');
    }
  });
};

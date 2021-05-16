const express = require('express');
const sql = require('../sql');

module.exports = function signature(app) {
  app.post('/api/signature', express.json(), async (req, res) => {
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

    const result = await sql('signature').where('id', id).first();
    if (result === null) {
      res.status(404).send('Sorry, not found it.');
      return;
    }

    const timestamps = new Date(result.createdAt).getTime();
    res.json({ id, timestamps: timestamps / 1000 });
  });
};

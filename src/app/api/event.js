const express = require('express');

module.exports = function event(app) {
  app.post('/api/event', express.json(), async () => {
  });

  app.get('/api/event/:id', async () => {
  });

  app.get('/api/event/:id/signature', async () => {
  });
};

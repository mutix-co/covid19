const server = require('./app/server');

const PORT = process.env.NODE_PORT || process.env.PORT || 8080;

server.listen(PORT, (err) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log(`> service ready on http://localhost:${PORT}`);
});

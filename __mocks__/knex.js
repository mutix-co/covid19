const _ = require('lodash');
const { Client } = require('pg');
const knex = require('knex');

knex.knexfile = (database) => {
  const knexfile = _.cloneDeep(jest.requireActual('../knexfile'));
  knexfile.connection.database = database ? `covid19_${database}` : 'postgres';
  return knexfile;
};

knex.queries = jest.fn();
knex.snapshot = () => knex.queries.mock.calls.join('\n');

knex.init = async (name) => {
  const pg = new Client(knex.knexfile().connection);
  await pg.connect();
  await pg.query(`DROP DATABASE IF EXISTS covid19_${name}`);
  await pg.query(`CREATE DATABASE covid19_${name}`);
  await pg.end();

  const client = knex(knex.knexfile(name));
  client.on('query', (event) => knex.queries(event.sql));
  await client.migrate.latest();
  return client;
};

module.exports = knex;

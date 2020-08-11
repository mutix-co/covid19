const {
  knexTypes,
  knexIdentifierMappers,
} = require('@mutix/graphql-phoenix/knex');

knexTypes();

const {
  POSTGRES_URL,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_SSL,
  POSTGRES_SSL_CA,
  POSTGRES_SSL_KEY,
  POSTGRES_SSL_CERT,
} = process.env;

let ssl = POSTGRES_SSL;
if (POSTGRES_SSL_CA) {
  ssl = {
    rejectUnauthorized: false,
    ca: POSTGRES_SSL_CA,
    key: POSTGRES_SSL_KEY,
    cert: POSTGRES_SSL_CERT,
  };
}

module.exports = {
  client: 'pg',
  connection: POSTGRES_URL || {
    host: POSTGRES_HOST || '127.0.0.1',
    port: POSTGRES_PORT || '5432',
    user: POSTGRES_USER || 'postgres',
    password: POSTGRES_PASSWORD || null,
    database: POSTGRES_DB || 'covid19',
    ssl,
  },
  ...knexIdentifierMappers,
};

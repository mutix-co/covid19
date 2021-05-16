exports.up = (knex) => knex.schema.table('signature', (table) => table.string('ips'));

exports.down = (knex) => knex.schema.table('signature', (table) => table.dropColumn('ips'));

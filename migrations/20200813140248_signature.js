exports.up = (knex) => knex.schema.createTable('signature', (table) => {
  table
    .uuid('id')
    .primary()
    .defaultTo(knex.raw('uuid_generate_v4()'));
  table.string('key');
  table.text('data');
  table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('signature');

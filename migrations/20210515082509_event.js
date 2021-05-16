exports.up = (knex) => knex.schema.createTable('event', (table) => {
  table
    .uuid('id')
    .primary()
    .defaultTo(knex.raw('uuid_generate_v4()'));
  table.string('key');
  table.string('title');
  table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('event');

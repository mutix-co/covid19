exports.up = (knex) => knex.schema.createTable('history', (table) => {
  table
    .uuid('id')
    .primary()
    .defaultTo(knex.raw('uuid_generate_v4()'));
  table.uuid('event_id');
  table.timestamp('start_at');
  table.timestamp('end_at');
  table.integer('number_of_signature');
  table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('history');

exports.up = function(knex, Promise) {
  return knex.schema.createTable('item', table => {
    table.increments();
    table.text('isbn').notNullable();
    table.decimal('price').notNullable();
    table.text('title').notNullable();
    table.text('edition');
    table.text('author');
    table.text('publisher');
    table.text('image_url').notNullable();
    table.text('description').notNullable();
    table.text('category').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('item');
};

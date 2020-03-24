
exports.up = function(knex, Promise) {
  return knex.schema.createTable('cart_item', table => {
    table.increments();
    table.text('product_id').notNullable();
    table.integer('quantity').notNullable().defaultTo(0);
    table.integer('user_id').references('user.id').unsigned().onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('cart_item');
};

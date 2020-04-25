const knex = require('./connection');

module.exports = {

  getByUser: function(id){
    return knex('cart_item').where('user_id', id);
  },
  create: function(item) {
    return knex('cart_item').insert(item, '*');
  },
  getbyIdandProduct: function(id, pid){
    return knex('cart_item').where({
      user_id: id,
      product_id: pid
    });
  },
  update: function(id, item) {
    return knex('cart_item').where('id', id).update(item, '*');
  },
  delete: function(id) {
    return knex('cart_item').where('id', id).del();
  },
  deleteCart: function(id) {
    return knex('cart_item').where('user_id', id).del();
  }
}

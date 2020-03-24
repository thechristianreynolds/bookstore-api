const knex = require('./connection');

module.exports = {

  getByUser: function(id){
    return knex('cart_item').where('user_id', id);
  }
}

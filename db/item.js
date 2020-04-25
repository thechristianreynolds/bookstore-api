const knex = require('./connection');

module.exports = {

  search: function(query){
    return knex('item').where('title', 'like', `%${query}%`);
  },
  getByISBN: function(isbn) {
    return knex('item').where('isbn', isbn);
  },
  getAll: function(){
    return knex('item');
  },
  getCategories: function() {
    return knex('item').distinct('category');
  },
  getByCategory: function(category) {
    return knex('item').where('category', category);
  }
}
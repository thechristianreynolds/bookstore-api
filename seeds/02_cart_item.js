exports.seed = (knex, Promise) => {
  return knex.raw('DELETE FROM cart_item; ALTER SEQUENCE cart_item_id_seq RESTART WITH 1')
      .then(() => {
        const cart_items = [{
          quantity: 5,
          product_id: '1',
          title: 'test1',
          image_url: 'google.com',
          user_id: 2
        }, {
          quantity: 20,
          product_id: '2',
          title: 'test2',
          image_url: 'google.com',
          user_id: 1
        }, {
          quantity: 10,
          product_id: '3',
          title: 'test3',
          image_url: 'google.com',
          user_id: 2
        }, {
          quantity: 3,
          product_id: '4',
          title: 'test4',
          image_url: 'google.com',
          user_id: 1
        }];

        return knex('cart_item').insert(cart_items);
      });
};

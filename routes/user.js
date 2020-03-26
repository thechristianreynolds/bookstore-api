const express = require('express');
const router = express.Router();

const User = require('../db/user');
const Cart_Item = require('../db/cart_item');

const authMiddleware = require('../auth/middleware');

router.get('/:id', authMiddleware.allowAccess, (req, res) => {
  if (!isNaN(req.params.id)) {
    User.getOne(req.params.id).then(user => {
      if (user) {
        delete user.password;
        res.json(user);
      } else {
        resError(res, 404, "User Not Found");
      }
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
});

router.get('/', (req, res) => {
  User.getAll().then(users => {
    res.json(users);
  });
});

router.get('/:id/cart', /*authMiddleware.allowAccess,*/ (req, res) => {
  if (!isNaN(req.params.id)) {
    Cart_Item.getByUser(req.params.id).then(cart_items => {
      res.json(cart_items);
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
})

function validItem(item) {
  const validProductId = typeof item.product_id == 'string' &&
    item.product_id.trim() != '';
  const validQuanitity = !isNaN(item.quantity);
  const validUserId = !isNaN(item.user_id);
  return validProductId && validQuanitity && validUserId;
}

//add item to cart no duplicates
router.post('/:id/cart', /*authMiddleware.allowAccess,*/ (req, res, next) => {
  let isUnique = true;
  const item = {
    product_id: req.body.product_id,
    quantity: req.body.quantity,
    user_id: parseInt(req.params.id),
  };
  if (validItem(item)) {
    Cart_Item
      .getByUser(item.user_id)
      .then(cart_items => {
        for (let i = 0; i < cart_items.length; i++) {
          if (item.product_id == cart_items[i].product_id) {
            isUnique = false;
          }
        }
        if (isUnique) {
          Cart_Item
            .create(item)
            .then(items => {
              res.json(items[0])
            });
        } else {
          next(new Error('Duplicate Item'));
        }
      });
  } else {
    next(new Error('Invalid Item'));
  }
});

//update quantity of item might not use this why would you order more than one of the same text book?
router.put('/:id/cart/:item_id', /*authMiddleware.allowAccess,*/ (req, res, next) => {
  const item = {
    product_id: req.params.item_id,
    quantity: req.body.quantity,
    user_id: parseInt(req.params.id),
  };
  Cart_Item
    .getbyIdandProduct(req.params.id, req.params.item_id)
    .then(cart_item => {
      if(!cart_item){
        next(new Error('Item does not exist'));
      } else {
        if(validItem(item)){
          Cart_Item
            .update(cart_item[0].id, item)
            .then(items => {
              res.json(items[0]);
            });
        } else {
          next(new Error('Invalid Item'));
        }
      }
    });
});

//delete items
router.delete('/:id/cart/:item_id', /*authMiddleware.allowAccess,*/ (req, res, next) => {
  Cart_Item
    .getbyIdandProduct(req.params.id, req.params.item_id)
    .then(cart_item => {
      if(!cart_item){
        next(new Error('Item does not exist'));
      } else {
        Cart_Item
          .delete(cart_item[0].id)
          .then(() => {
            res.json({
              deleted: true
            });
          });

      }
    });
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({
    message
  });
}

module.exports = router;
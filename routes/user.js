const express = require('express');
const router = express.Router();
const User = require('../db/user');
const Cart_Item = require('../db/cart_item');

router.get('/:id', (req, res) => {
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

router.get('/:id/cart', (req,res)=>{
  if (!isNaN(req.params.id)) {
    Cart_Item.getByUser(req.params.id).then(cart_items => {
      res.json(cart_items);
    });
  } else {
    resError(res, 500, "Invalid ID");
  }
})

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({message});
}

module.exports = router;

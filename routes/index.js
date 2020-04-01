var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var axios = require('axios').default;
var util = require('util');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/search/:query', function (req, res, next) {
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.params.query}`)
    .then(response => {
      const items = response.data.items;
      let parsedItems = [];
      for (item in items) {
        parsedItems.push({
          "id": items[item].id,
          "title": items[item].volumeInfo.title,
          "image": items[item].volumeInfo.imageLinks.thumbnail
        });
      }
      res.send(parsedItems);
    }).catch(error => {
      resError(res, 404, "No search results");
    });
});

router.get('/search/book/:id', function (req, res, next) {
  axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.id}`)
    .then(response => {
      const passData = response.data;
      axios.get(`https://www.abebooks.com/servlet/SearchResults?cm_sp=sort-_-SRP-_-Results&ds=20&kn=${response.data.volumeInfo.industryIdentifiers[0].identifier}&sortby=1`)
        .then(response => {
          let parsedItem = {};
          parsedItem.id = passData.id;
          parsedItem.title = passData.volumeInfo.title;
          parsedItem.description = passData.volumeInfo.description;
          parsedItem.image = passData.volumeInfo.imageLinks.thumbnail;
          if (passData.volumeInfo.industryIdentifiers) {
            parsedItem.isbn = passData.volumeInfo.industryIdentifiers[0].identifier;
          } else {
            parsedItem.available = false
          }
          const $ = cheerio.load(response.data);
          const text = $('#srp-item-price-1').text();
          const price = parseFloat(text.substring(text.indexOf(' ') + 1)).toFixed(2);
          if(price == "NaN"){
            parsedItem.available = false;
          }else{
            parsedItem.price = price;
            parsedItem.available = true;
          }
          res.send(parsedItem);
        }).catch(error => {
          resError(res, 404, "Book Not Available");
        });
    }).catch(error => {
      resError(res, 404, "No search results");
    });
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({
    message
  });
}

module.exports = router;
var phantom = require("phantom");
var express = require("express");
var cors = require('cors');
var app = express();

var port = process.env.PORT || 8080;

app.get('/scrape/:citta/:page', function(req, res){
    var citta = req.params.citta || "Torino--TO";
    var page = req.params.page || "1";
    var url = "https://www.airbnb.com/s/"+citta+"?ss_id=c9754ah4&page="+ page;
    console.log(url);
    phantom.create(function (ph) {
    ph.createPage(function (page) {
    page.open(url, function (status) {

    console.log("scraping status..."+status);
    // We use jQuery to parse the document
    page.includeJs(
      "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
      function() {
        page.evaluate(function() {

          var data = [];

          $(".listings-container div.listing").each(function(index, row) {
              var $row = $(row);
              var reviews = $row.find(".listing-location").text().split(" "); // split to words
              reviews = reviews[reviews.indexOf("reviews") - 1]; //the word that appears before the word "reviews" is the number of reviews..


              data.push({
                  id: index,
                  name: $row.attr("data-name"),
                  user: $row.attr("data-user"),
                  price: $row.find(".price-amount").text(),
                  reviews: parseInt(reviews),
                  geo: {
                      latitude: parseFloat($row.attr("data-lat")),
                      longitude: parseFloat($row.attr("data-lng"))
                  }
              });

          });

          return data;

        }, function(data) {

          ph.exit();

          // JSON OUTPUT

            var dataCorrente =data;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ hosts: dataCorrente}));

        });
      }
    );

    });


    });
    });


});

app.use(express.static(__dirname + "/app"));
app.listen(port, function() {
  console.log("enjoy the party " + port);
});

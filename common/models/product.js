module.exports = function(Product) {
  Product.disableRemoteMethod('createChangeStream', true);
  Product.disableRemoteMethod('updateAll', true);
  Product.disableRemoteMethod('findOne', true);

  Product.disableRemoteMethod('__delete__reviews', false);
  Product.disableRemoteMethod('__destroyById__reviews', false);

  /*
    Calculate and update the product rating after a new review is posted
  */
  Product.afterRemote('prototype.__create__reviews', function (ctx, remoteMethodOutput, next) {
    var productId = remoteMethodOutput.product_id;

    console.log("calculating new rating for product: " + productId);

    var searchQuery = {include: {relation: 'reviews'}};

    Product.findById(productId, searchQuery, function findProductReviewRatings(err, findResult) {
      var reviewArray = findResult.reviews(),
          reviewCount = reviewArray.length,
          ratingSum = 0;

      for (var i=0; i < reviewCount; i++) {
        ratingSum += reviewArray[i].rating;
      }

      var updatedRating = Math.round((ratingSum / reviewCount) * 100) / 100;

      console.log("new calculated rating: " + updatedRating);

      // Update product with new review rating
      findResult.updateAttribute("rating", updatedRating, function(err){
        if (!err) {
          console.log("product rating successfully updated");
        } else {
          console.log("error updating rating for product: " + err);
        }
      });

      next();
    });

  });
};
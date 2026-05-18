const reviewService = require("../services/review.service");
const supplierService = require("../services/supplier.service");

const createReview = async (req, res) => {
  try {
    const supplierReviews = await reviewService.getReviewBySupplier(req.body.supplier_id);
    const numReviews = supplierReviews.length
    const currReview = await supplierService.getSupplierById(req.body.supplier_id, req.user.store_id)

    const rev = await reviewService.createReview(
      req.body,
      req.user.id
    );
    let rating;
    if (numReviews > 0){
        rating = (currReview.rating * numReviews + req.body.star)/(numReviews+ 1);
    } else {
        rating = req.body.star;
    }
    const data = {rating : rating};
    console.log(data);
    await supplierService.updateSupplier(req.body.supplier_id, req.user.store_id, data);
    res.status(201).json(rev);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReviewByUser = async (req, res) => {
  try {

    const rules = await reviewService.getReviewByUser(
      req.user.id
    );

    res.status(200).json(rules);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const deleteReview = async (req, res) => {
  try {

    await reviewService.deleteReview(
      req.params.id
    );

    res.status(200).json({
      message: "Reviw deleted"
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createReview,
  getReviewByUser,
  deleteReview
};
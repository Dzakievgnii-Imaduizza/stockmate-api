const { supplier } = require("../config/prisma");
const reviewRepo = require("../repositories/review.repository");

const createReview = async (data, user_id) => {

  return reviewRepo.create({
    user_id : user_id,
    review : data.review,
    supplier_id : data.supplier_id,
    star : data.star
  });

};

const getReviewBySupplier = async (supplierId) => {
  return reviewRepo.findBySupplier(supplierId);
};
const getReviewById = async (Id) => {
  return reviewRepo.findById(Id);
};
const getReviewByUser = async (userId) => {
  return reviewRepo.findByUser(userId);
};
const updateReview = async (id, data) => {
  return reviewRepo.update(id, data);
};

const deleteReview = async (id, storeId) => {
  return reviewRepo.remove(id, storeId);
};

module.exports = {
    createReview,
    getReviewById,
    getReviewBySupplier,
    getReviewByUser,
    updateReview,
    deleteReview
};
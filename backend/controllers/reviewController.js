const Review = require('../models/Review');
const User = require('../models/userModel');

exports.addReview = async (req, res, next) => {
  try {
    const { vendor_id, rating, comment } = req.body;
    const reviewer_id = req.user.id; // From authMiddleware

    if (!vendor_id || !rating) {
      return res.status(400).json({ success: false, message: 'Vendor ID and rating are required.' });
    }
    
    // Prevent self-reviewing
    if (String(vendor_id) === String(reviewer_id)) {
      return res.status(403).json({ success: false, message: 'You cannot review yourself.' });
    }

    // Upsert or create review. We'll just create a new one (or optionally restrict 1 review per user-vendor pair)
    const [review, created] = await Review.findOrCreate({
      where: { reviewer_id, vendor_id },
      defaults: { rating, comment }
    });

    if (!created) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    }

    // Recalculate average rating for the vendor
    const allReviews = await Review.findAll({ where: { vendor_id } });
    if (allReviews.length > 0) {
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await User.update({ rating: parseFloat(avg.toFixed(1)) }, { where: { id: vendor_id } });
    }

    return res.status(200).json({ success: true, message: 'Review saved successfully.', data: review });
  } catch (err) {
    return next(err);
  }
};

exports.getVendorReviews = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const reviews = await Review.findAll({
      where: { vendor_id: vendorId },
      include: [
        { model: User, as: 'Reviewer', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    return next(err);
  }
};

exports.deleteReviewAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const vendor_id = review.vendor_id;
    const reviewer_id = review.reviewer_id;
    
    // Create a notification for the reviewer that their review was deleted
    try {
      const Notification = require('../models/Notification');
      await Notification.create({
        user_id: reviewer_id,
        type: 'REVIEW_REMOVED',
        title: 'Review Removed by Moderator',
        message: 'Your recent review was removed by an administrator for violating community guidelines.',
        link: '/'
      });
      
      // Also notify the vendor that a review was removed from their profile
      await Notification.create({
        user_id: vendor_id,
        type: 'REVIEW_MODERATED',
        title: 'Review Removed from your Profile',
        message: 'A review left on your profile was removed by a moderator for policy violations.',
        link: '/seller/' + vendor_id
      });
    } catch (err) {
      console.error("Failed to send review removal notifications", err);
    }

    await review.destroy();

    // Recalculate average rating for the vendor
    const allReviews = await Review.findAll({ where: { vendor_id } });
    let newRating = 0;
    if (allReviews.length > 0) {
      newRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    }
    await User.update({ rating: parseFloat(newRating.toFixed(1)) }, { where: { id: vendor_id } });

    return res.json({ success: true, message: 'Review deleted and vendor rating updated successfully.' });
  } catch (err) {
    return next(err);
  }
};

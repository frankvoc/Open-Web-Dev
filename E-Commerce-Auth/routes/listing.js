const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const passport = require('passport');
//create
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title, description, startingBid, endTime } = req.body;
  const sellerId = req.user.id;
  try {
    const listing = new Listing({
      title,
      description,
      startingBid,
      currentBid: startingBid,
      endTime,
      seller: sellerId
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: 'Error creating listing', error });
  }
});
//view all
router.get('/', async (req, res) => {
    try {
      const listings = await Listing.find().populate('seller', 'username').lean();
      res.render('listings', { listings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching listings', error });
    }
  });
//view specific listing
router.get('/:id', async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id)
        .populate('seller', 'username')
        .populate({
          path: 'bids',
          populate: { path: 'bidder', select: 'username' }
        })
        .lean();
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      console.log(listing);
      res.render('viewListing', { listing });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching listing', error });
    }
  });
//render page
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log('User ID:', userId); 
  try {
    const listings = await Listing.find({ seller: userId }).populate('seller', 'username');
    res.render('myListings', { listings });
  } catch (error) {
    console.error(error); 
    res.status(500).render('error', { message: 'Error fetching listings', error });
  }
});
//update
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { title, description, endTime } = req.body;
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }
    listing.title = title;
    listing.description = description;
    listing.endTime = endTime;
    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(400).json({ message: 'Error updating listing', error });
  }
});
//delete
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    if (listing.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }
    await listing.remove();
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error });
  }
});
module.exports = router;

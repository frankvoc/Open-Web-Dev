const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Listing = require('../models/Listing');
//place a bid
router.post('/:listingId', async (req, res) => {
    const { amount } = req.body;
    const bidderId = '60d5f96b5f3e4a2e887c4e3d'; //hardcoded because its a pain
    try {
      const listing = await Listing.findById(req.params.listingId);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      if (amount <= listing.currentBid) {
        return res.status(400).json({ message: 'Bid amount must be higher than the current bid' });
      }
      const bid = new Bid({ amount, bidder: bidderId, listing: listing._id });
      await bid.save();
      listing.currentBid = amount;
      listing.bids.push(bid._id);
      await listing.save();
      return res.redirect(`/listing/${listing._id}`);
    } catch (error) {
      console.error(error);
      return res.render('error', { message: 'Error placing bid' });
    }
  });
//view bids
router.get('/:listingId', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId).populate('bids');
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing.bids);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bids', error });
  }
});
module.exports = router;

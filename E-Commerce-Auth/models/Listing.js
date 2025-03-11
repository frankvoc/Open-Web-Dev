const mongoose = require('mongoose');
const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  endTime: { type: Date, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }]
});
const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;

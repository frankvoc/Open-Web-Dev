const mongoose = require('mongoose');
const BidSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }
});
const Bid = mongoose.model('Bid', BidSchema);
module.exports = Bid;

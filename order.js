const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  timestamp: String,

  lot: String,

  module: String,

  name: String,

  status: String

});

module.exports = mongoose.model('Order', orderSchema);
 
const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

require('dotenv').config();

const Order = require('./models/Order');

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)

  .then(() => console.log("MongoDB connected"))

  .catch(err => console.log(err));

app.get('/orders', async (req, res) => {

  const orders = await Order.find();

  res.json(orders);

});

app.post('/orders', async (req, res) => {

  const order = new Order(req.body);

  await order.save();

  res.status(201).json(order);

});

app.put('/orders/:id/close', async (req, res) => {

  const order = await Order.findByIdAndUpdate(req.params.id, { status: 'READY' }, { new: true });

  res.json(order);

});

app.delete('/orders/:id', async (req, res) => {

  await Order.findByIdAndDelete(req.params.id);

  res.status(204).end();

});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
 
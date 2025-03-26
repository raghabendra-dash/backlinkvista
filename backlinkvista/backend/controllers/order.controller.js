const Order = require('../models/order.model');

router.put('/update-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

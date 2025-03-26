import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  websites: [
    {
      websiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Website",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0, // Auto-updated when items are added/removed
  },
}, { timestamps: true });

// Middleware to automatically calculate totalPrice before saving
CartSchema.pre("save", function (next) {
  this.totalPrice = this.websites.reduce((sum, site) => sum + site.price, 0);
  next();
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;

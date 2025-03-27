import express from "express";
import {
  addToCart,       // ✅ Fixed name
  getCartItems,
  removeFromCart,  // ✅ Fixed name
  clearCart
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart); // ✅ Fixed function name

router.get("/get-cart/:userId", getCartItems);

// ❌ Remove or implement getTotalCartItems in cart.controller.js
// router.get("/:userId/total", getTotalCartItems);  

router.delete("/remove/:websiteId", removeFromCart); // ✅ Fixed function name

router.get("/clear/:userId", clearCart);

export default router;

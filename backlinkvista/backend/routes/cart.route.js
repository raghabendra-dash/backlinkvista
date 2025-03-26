import express from "express";
import {
  addItemToCart,
  getCartItems,
  getTotalCartItems,
  deleteCartItem,
  clearCart
} from "../controllers/cart.controller.js";

const router = express.Router();


router.post("/add", addItemToCart);

router.get("/get-cart/:userId", getCartItems);

router.get("/:userId/total", getTotalCartItems);

router.delete("/remove/:websiteId", deleteCartItem);

router.get("/clear/:userId", clearCart);

export default router;

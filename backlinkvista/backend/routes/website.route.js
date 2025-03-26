import express from "express";
import { create, fetchAll, getWebsite, addToCart, removeFromCart } from "../controllers/website.controller.js";

const router = express.Router();

router.post("/create", create);
router.get("/websites", fetchAll);
router.get("/websites/:id", getWebsite);
router.post("/cart", addToCart);
router.delete("/cart/:websiteId", removeFromCart);

export default router;

import Cart from "../models/cart.model.js";
import Website from "../models/website.model.js";

// Add an item to the cart
export const addItemToCart = async (req, res) => {
  try {
    const { userId, websiteId } = req.body;

    if (!userId || !websiteId) {
      return res.status(400).json({
        success: false,
        message: "userId and websiteId are required",
      });
    }

    // Fetch the website to ensure it exists
    const website = await Website.findById(websiteId);
    if (!website) {
      return res
        .status(404)
        .json({ success: false, message: "Website not found" });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, websites: [] });
    }

    // Check if the website is already in the cart
    const itemExists = cart.websites.some(
      (item) => item.websiteId.toString() === websiteId
    );

    if (itemExists) {
      return res
        .status(400)
        .json({ success: false, message: "Website already in cart" });
    } else {
      // Add the website with price
      cart.websites.push({ websiteId, price: website.price });
    }

    // Save the cart
    await cart.save();

    // ✅ Fetch the updated cart with populated website data
    const updatedCart = await Cart.findOne({ userId })
      .populate(
        "websites.websiteId",
        "domain title price category country description"
      )
      .exec();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch all cart items with populated website data
export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate(
        "websites.websiteId",
        "domain title price category country description"
      )
      .exec();

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get the total number of items in the cart
export const getTotalCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const totalItems = cart.websites.length;

    res.status(200).json({ success: true, totalItems });
  } catch (error) {
    console.error("Error getting total items:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete an item from the cart
export const deleteCartItem = async (req, res) => {
  try {
    const { websiteId } = req.params;
    const { userId } = req.query;

    if (!userId || !websiteId) {
      return res.status(400).json({
        success: false,
        message: "userId and websiteId are required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Remove the item from the cart
    cart.websites = cart.websites.filter(
      (item) => item.websiteId.toString() !== websiteId
    );

    await cart.save();

    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// clear the cart according to user id
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Clear the cart by setting websites to an empty array
    cart.websites = [];
    cart.totalPrice = 0; // Reset total price
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

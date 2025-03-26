import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { endpoints } from "../utils/api";
import { razorpay_key_id } from "../utils/RazorpayCredentials";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const ShoppingCart = () => {
  const { user } = useAuth();
  const { cartItems, clearCart, removeFromCart } = useCart();

  const [paymentLoading, setPaymentLoading] = useState(false);

  const websites =
    cartItems?.map((item) => ({
      _id: item._id,
      price: item.price,
      domain: item.domain,
      title: item.title,
      category: item.category,
      country: item.country,
      description: item.description,
    })) || [];

  const totalPrice = websites.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleDelete = (websiteId) => {
    removeFromCart(websiteId);
  };

  const handlePayment = async () => {
    if (websites.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setPaymentLoading(true);

    const conversionRate = 70;
    const totalPriceInINR = totalPrice * conversionRate;
    const amountInPaisa = totalPriceInINR * 100;

    const orderData = {
      userId: user._id,
      totalPrice: amountInPaisa,
      websites: websites.map((item) => ({
        websiteId: item._id,
        websiteName: item.domain,
        price: item.price,
        title: item.title,
        category: item.category,
        country: item.country,
      })),
    };

    try {
      const response = await endpoints.orders.createOrder(orderData);

      if (response.data.success) {
        const { orderId, amount, currency } = response.data;

        const options = {
          key: razorpay_key_id,
          amount: amount,
          currency: currency,
          name: "Back Link Vista",
          description: "Order Payment",
          order_id: orderId,
          handler: async (response) => {
            try {
              const verificationResponse = await axios.post(
                `/api/paymentVerification/verify-payment-domain`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              );

              if (verificationResponse.data.success) {
                toast.success("Payment Successful!");
                clearCart(user?._id);
              } else {
                toast.error("Payment Verification Failed!");
              }
            } catch (verificationError) {
              toast.error("Error verifying payment!");
              console.error(verificationError);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment error");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="p-4 w-full  bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

      {websites.length > 0 ? (
        <>
          {/* Fixed height with scrollable content */}
          <div className="max-h-96 overflow-y-auto ">
            <ul className="space-y-4">
              {websites.map((item) => (
                <li
                  key={item._id}
                  className="flex flex-col p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-lg font-medium">{item.domain}</p>
                      <p className="text-gray-500">{item.category}</p>
                      <p className="text-sm">{item.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-600 font-bold">${item.price}</p>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700 mt-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="font-bold">Total: ${totalPrice}</p>
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 inline mr-2" />
                  Processing...
                </>
              ) : (
                "Pay"
              )}
            </button>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default ShoppingCart;

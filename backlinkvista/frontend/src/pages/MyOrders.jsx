import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import { endpoints } from "../utils/api";

// Sample orders matching the DomainOrder model structure
const ordersSample = [
  {
    _id: "ORD-001",
    userId: "USER-001",
    date: "2024-03-15",
    status: "completed",
    websites: [
      {
        websiteId: "SITE-001",
        websiteName: "techinsider.com",
        price: 299,
        title: "10 Emerging Tech Trends in 2024",
      },
    ],
    totalPrice: 299,
  },
  {
    _id: "ORD-002",
    userId: "USER-002",
    date: "2024-03-14",
    status: "in-progress",
    websites: [
      {
        websiteId: "SITE-002",
        websiteName: "businessdaily.net",
        price: 249,
        title: "The Future of Remote Work",
      },
    ],
    totalPrice: 249,
  },
  {
    _id: "ORD-003",
    userId: "USER-003",
    date: "2024-03-13",
    status: "created",
    websites: [
      {
        websiteId: "SITE-003",
        websiteName: "healthplus.org",
        price: 199,
        title: "Natural Ways to Boost Immunity",
      },
    ],
    totalPrice: 199,
  },
];

const statusColors = {
  created: "bg-yellow-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
  rejected: "bg-red-500",
};

const statusIcons = {
  created: <Clock className="h-5 w-5" />,
  "in-progress": <RefreshCw className="h-5 w-5" />,
  completed: <CheckCircle className="h-5 w-5" />,
  rejected: <AlertCircle className="h-5 w-5" />,
};

const MyOrders = () => {
  const [orders, setOrders] = useState(ordersSample);
  const { user } = useAuth();
  const userId = user?._id || "";

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await endpoints.orders.getOrders(userId);
        if (response.data.success) {
          setOrders((prevOrder) => [...response.data.orders, ...prevOrder]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    if (user) getOrders();
  }, [user]);

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your guest post orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              icon: <BarChart2 className="h-6 w-6 text-purple-400" />,
            },
            {
              label: "Completed",
              value: orders.filter((o) => o.status === "completed").length,
              icon: <CheckCircle className="h-6 w-6 text-green-400" />,
            },
            {
              label: "In Progress",
              value: orders.filter((o) => o.status === "in-progress").length,
              icon: <RefreshCw className="h-6 w-6 text-blue-400" />,
            },
            {
              label: "Created",
              value: orders.filter((o) => o.status === "created").length,
              icon: <Clock className="h-6 w-6 text-yellow-400" />,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow rounded-xl p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Website
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-gray-800">{order._id}</td>
                    {order.websites.map((website, idx) => (
                      <React.Fragment key={idx}>
                        <td className="px-6 py-4 text-gray-800">
                          <span className="font-medium">
                            {website.websiteName}
                          </span>
                          <br />
                          {website.title}
                        </td>
                        <td className="px-6 py-4 text-gray-800 text-center">
                          ${website.price}
                        </td>
                      </React.Fragment>
                    ))}
                    <td className="px-6 py-4 text-gray-800">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          statusColors[order.status]
                        }`}
                      >
                        {statusIcons[order.status]}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-500 hover:text-blue-400 font-medium">
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
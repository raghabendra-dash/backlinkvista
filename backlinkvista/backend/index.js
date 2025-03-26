import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import websiteRoute from "./routes/website.route.js"; 
import domainOrderRoute from "./routes/domainOrder.route.js"; 
import contentOrderRoute from './routes/contentOrder.route.js'
import cartRoute from "./routes/cart.route.js";
import paymentVerificationRoute from "./routes/verification.route.js"; 
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

// import listingRoutes from './routes/listing.routes.js'; // Importing listing routes
// import orderRoutes from './routes/order.routes.js'; // Importing order routes
// import paymentRoutes from './routes/payment.routes.js'; // Importing payment routes

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://backlinkvista.vercel.app"
]; 

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/marketplace", websiteRoute);
app.use("/api/domain", domainOrderRoute);
app.use("/api/content", contentOrderRoute);
app.use("/api/marketplace/cart", cartRoute);

app.use("/api/paymentVerification", paymentVerificationRoute);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running at port ${PORT}`);
});

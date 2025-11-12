import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

connectDB();
connectCloudinary();

const app = express();
app.use(cors({
  origin: [
    "https://hotel-management-frontend-eta.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ⚡ Stripe webhook must be handled *before* express.json()
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Clerk webhook (also needs raw body)
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// ✅ Regular JSON parsing (after webhooks)
app.use(express.json());
app.use(clerkMiddleware());

// 🧭 Routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {
    // Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Headers from Clerk
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // 🔥 Parse raw body manually
    const payloadString = req.body.toString("utf8");
    const payload = JSON.parse(payloadString);

    // Verify webhook authenticity
    await whook.verify(payloadString, headers);

    const { data, type } = payload;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated": {
        const updateData = { ...userData };
        delete updateData._id;
        await User.findByIdAndUpdate(data.id, updateData);
        break;
      }

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;

      default:
        break;
    }

    res.json({ success: true, message: "✅ Clerk webhook received" });
  } catch (error) {
    console.log("❌ Clerk webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;

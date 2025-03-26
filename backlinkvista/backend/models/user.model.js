import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    phone: { type: String },
    country: { type: String, default: "India" },
    companyWebsite: { type: String, default: "https://www.cool.com" }, 

    // Role field to differentiate between Buyer, Editor, and Admin
    role: {
      type: String,
      enum: ["buyer", "editor", "admin"],
      default: "buyer",
    },
    
    identity: { type: String, default: "individual" },
    balance: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    joinedOn: { type: Date, default: Date.now },
    whatsappUpdates: { type: Boolean, default: false },

    paymentInfo: {
      country: { type: String },
      method: { type: String },
      paypalEmail: { type: String },
    },

    // For editors, associate website listings
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

// ✅ Automatically create an Admin User if not exists
const createAdminUser = async () => {
  try {
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        status: "Active",
      });
      console.log("✅ Default admin user created.");
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};

// Run on startup
createAdminUser();

export { User };

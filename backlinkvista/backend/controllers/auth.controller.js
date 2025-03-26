import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Hardcoded Admin Credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

// ✅ User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role = "buyer" } = req.body;
    
    // Check if the email is already in use
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role, // Assign role (default is "buyer")
    });

    // Exclude password from response
    const userWithoutPassword = await User.findById(newUser._id).select("-password");

    // Generate JWT Token
    const tokenData = { userId: userWithoutPassword._id, role: userWithoutPassword.role };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Account created successfully.",
      success: true,
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ User Login (with Hardcoded Admin)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // ✅ Check Hardcoded Admin Credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminToken = jwt.sign({ userId: "admin123", role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.status(200).json({
        message: "Admin login successful",
        user: { id: "admin123", name: "Admin", email, role: "admin" },
        token: adminToken,
        success: true,
      });
    }

    // Check if user exists in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Account not found.", success: false });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect email or password.", success: false });
    }

    // Generate JWT token
    const tokenData = { userId: user._id, role: user.role };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Exclude password before sending response
    const userWithoutPassword = await User.findById(user._id).select("-password");

    return res.status(200).json({
      message: `Welcome ${user.name}`,
      user: userWithoutPassword,
      token,
      success: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ User Logout
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }

      // Find user by ID
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate new access token
      const newAccessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.json({ token: newAccessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

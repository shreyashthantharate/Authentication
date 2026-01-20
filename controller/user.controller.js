import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const registerUser = async (req, res) => {
  // get data
  //validate
  // check if user already exists
  // create a user in database
  //create a verification token
  // save token in database
  // send token as email to user
  // send success status to user

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;

    await user.save();

    //send email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email", // Subject line
      text: `Please click on the following link:
      ${process.env.BASE_URL}/api/v1/users/verify/${token}
      `,
    };

    await transporter.sendMail(mailOption);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered ",
      error,
      success: false,
    });
  }
};

const verifyUser = async (req, res) => {
  // get token from params
  // validate token
  // find user based on token
  // if user not found, send error response
  // if user found, set isVerified to true
  // remove verification token
  // save user
  // send success response

  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      message: "Token is required",
    });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save();
  res.status(200).json({
    message: "User verified successfully",
    success: true,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {}
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {}
};

const forgotPassword = async (req, res) => {
  try {
    // get email from req.body
    // validate email
    // find user based on email
    // if user not found, send error response
    // if user found, create a reset token
    // save token and expiry in database
    // send email to user with reset link
    // //////////////////////////////////
    // get email from req.body
    // validate email
    // find user based on email
    // reset token + reset expiry => Date.now() + 10 *60 * 1000 (10 minutes)=> user.save()
    // send email to user with reset link => design url
  } catch (error) {}
};

const resetPassword = async (req, res) => {
  // get token from params
  // validate token
  // find user based on token
  // if user not found, send error response
  // if user found, update password
  // //////////////////////////////////////
  // collect token from params
  // collect password from req.body
  // find user based on reset token and expiry
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    // set password in user
    // reset reset token and expiry
    // save user
    // send success response
  } catch (error) {}
};

export {
  registerUser,
  verifyUser,
  login,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
};

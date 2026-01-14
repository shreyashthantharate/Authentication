import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const registerUser = async (req, res) => {
  // get data
  // validate data
  // check if user already exists
  // if not, create a new user in database
  // create a verification token
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
    const existigUser = User.findOne({ email });
    if (existigUser) {
      res.send(400).json({
        message: "User already exist",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    console.log("user is", user);

    if (!user) {
      res.status(400).json({
        message: "User not registered",
      });
    }
    const token = crypto.randomBytes().toString("hex");
    console.log("token is ", token);

    user.verificationToken = token;

    await user.save();

    // send email

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // Use true for port 465, false for port 587
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_PASSWORD,
      to: user.email,
      subject: "Verify your email",
      text: `Please click on the following link: ${process.env.BASE_URL}/api/v1/users/verify${token}`, // Plain-text version of the message
      // html: "<b>Hello world?</b>", // HTML version of the message
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in registering user",
      success: false,
      error,
    });
  }
};

export { registerUser };

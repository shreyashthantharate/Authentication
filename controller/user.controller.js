import User from "../model/User.model.js";
import crypto from "crypto";

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
  } catch (error) {}
};

export { registerUser };

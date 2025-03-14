import { pool } from "../database/mysqlsb.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import jwt from "jsonwebtoken";

// register the user
export const register = async (req, res) => {
  const { full_name, phone_number, gender, user_password } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    if (!full_name || !phone_number || !user_password || !gender || !image) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // check if user already exist in the database
    const checkIfUserExist = "SELECT * FROM users WHERE phone_number = ? ";
    pool.query(checkIfUserExist, [phone_number], async (error, result) => {
      if (error) {
        res.status(500).json({ success: false, message: error });
        return console.log(`Error occured in database ${error}`);
      } else if (result.length > 0) {
        res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }
      if (result.length === 0) {
        // hash password
        const hashedPassword = await bcrypt.hash(user_password, 10);
        // insert new user in to the database
        const query =
          "INSERT INTO users ( full_name, phone_number, user_password, gender, image ) VALUES ( ?, ?, ?, ?, ? )";

        pool.query(
          query,
          [full_name, phone_number, hashedPassword, gender, image],
          async (error, result) => {
            if (error) {
              res
                .status(500)
                .json({ success: false, message: "Database error" });
            }

            const user = { full_name, phone_number, gender, image };
            //Get inserted user id
            const userId = result.insertId;

            const token = generateTokenAndSetCookie(
              res,
              userId,
              full_name,
              phone_number
            );

            return res.status(201).json({
              success: true,
              message: "User created successfully!",
              user: {
                ...user,
                token,
              },
            });
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// login

export const login = (req, res) => {
  const { phone_number, user_password } = req.body;

  try {
    if (!phone_number || !user_password) {
      return res.json({
        success: false,
        message: "Invalid Phone number or Password",
      });
    }
    const loginQuery = "SELECT * FROM users WHERE phone_number = ? ";

    pool.query(loginQuery, [phone_number], async (error, result) => {
      if (error) {
        console.log(`Error occured in the database ${error}`);
        return res.status(500).send("Server Error");
      }

      const user = await result[0];
      // check if phone number is valid
      if (result.length === 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Incorrect phone number or password!",
          });
      }
      // check if user password is valid
      const isPasswordValid = await bcrypt.compare(
        user_password,
        user.user_password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Incorrect phone number or password!",
          });
      }
      // return new token to the user
      const token = generateTokenAndSetCookie(
        res,
        user.userId,
        user.full_name,
        phone_number
      );
      // if this all valid login and return the user
      return res
        .status(200)
        .json({
          success: true,
          message: "You are successfully logged in",
          user: { ...user, user_password: undefined },
          token,
        });
    });
  } catch (err) {
    console.log(`Error ${err}`);
    res.status(500).send("Server Error");
  }
};

// verify user
export const verify = (req, res) => {
  const token  = req.cookies.token;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized no token given!" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized invalid token" });
    }
    return res.status(200).json({ success: true, user: decode });
  } catch (err) {
    console.log(`Error ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// logout
export const logout = async (_, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ success: true, message: "You are successfully logged out" });

  // delete the user from database
  const deleteQuery = "DELETE FROM users WHERE phone_number = 0975348825 ";
  pool.query(deleteQuery, (error, _) => {
    if (error) {
      console.log(`Error occured in database while deleting user ${error}`);
      return res.status(500).send("Server Error");
    }
  });
};

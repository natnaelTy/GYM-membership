import { pool } from "../database/mysqlsb.js";
import bcrypt from "bcryptjs";



export const signup = async (req, res) => {
  const { full_name, phone_number, gender, user_password, image } = req.body;
  try {
    if (!full_name || !phone_number || !user_password ||  !gender || !image) {
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
      }
      else if (result.length > 0) {
         res.status(400).json({success: false, message: "User already exists"});
      }
      if (result.length === 0) {
         // hash password
         const hashedPassword = await bcrypt.hash(user_password, 10);
        // insert new user to the database
        const query = 'INSERT INTO users ( full_name, phone_number, user_password, gender, image ) VALUES ( ?, ?, ?, ?, ? )';

        pool.query(query, [full_name, phone_number, hashedPassword, gender, image], (error, result) => {
          if (error){
            res.status(500).json({success: false, message: "Database error"});
          }

          const user = {full_name, phone_number, gender};
          //Get inserted user id
          const userid = result.insertId;

          return res.status(201).json({success: true, message: "User created successfully!", ...user});
        })
      }
    });
  } catch (err) {
    console.log(err);
  }
};

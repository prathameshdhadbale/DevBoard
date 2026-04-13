
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const checkUser = await pool.query(
            `select 1 from users where email = $1 LIMIT 1`,
            [email]
        )

        if (checkUser.rows.length > 0) {
            return res.status(409).json({ error: "User already exists" })
        }

        const hash_password = await bcrypt.hash(password, 10);
        const insertUser = `
            INSERT INTO users (name , email, password_hash) VALUES ($1 , $2 , $3)
        ` ;

        await pool.query(insertUser, [name, email, hash_password]);

        return res.status(201).json({ message: "User registered succesfully" })
    } catch (e) {
        return res.status(500).json({ error: e.message })
    }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {

        const findUser = `SELECT * FROM users WHERE email = $1 `;

        const user = await pool.query(findUser, [email]);

        if (user.rows.length < 1) {
            return res.status(401).json({ error: "Invalid Credentails" });
        }

        const validUser = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!validUser) {
            return res.status(401).json({ error: "Invalid Credentails" });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({ token });

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
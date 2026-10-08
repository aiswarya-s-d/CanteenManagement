const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signup = (req, res) => {
    const { name, email, password, role, department, year,gender } = req.body;
    let finalDepartment = department;
    let finalYear = year;
    let finalGender = gender;
    if (role === "admin") {
        finalDepartment = null;
        finalYear = null;
        finalGender = null;
    }
    if (role === "staff") {
        finalYear = null;
    }
    id="5w1f2m"
    const checkEmailSql ="SELECT id FROM users WHERE email = ?";
    db.query(
        checkEmailSql,
        [email],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already registered"
                });}
    });
    if (role === "student" && !email.endsWith("@student.tce.edu")) {
        return res.status(400).json({
            message: "Students must use @student.tce.edu email"
        });
    }
    if (role === "staff" &&!email.endsWith("@tce.edu")) {
        return res.status(400).json({
            message: "Staff must use @tce.edu email"
        });
    }
    if (role === "student" &&(!department || !year || !gender)) {
    return res.status(400).json({
        message: "Students must fill department, year and gender"
    });}
    if (role === "staff" && (!department || !gender)) {
    return res.status(400).json({
        message: "Staff must fill department and gender"
    });}
    if (password.length !== 8) {
        return res.status(400).json({
            message: "Password must be exactly 8 characters long"
        });
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json(err);}
        const sql =
            "INSERT INTO users (name, email, password, role, department, year,gender) VALUES (?, ?, ?, ?, ?, ?, ?)";
            db.query(
            sql,
            [name, email, hashedPassword, role, finalDepartment, finalYear, finalGender],
            (err, result) => {
                 if (err) {
            return res.status(500).json(err);}
                res.json({
                    message: "User registered successfully"
                });
            }
        );
    });
};
const login = (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json(err);}
        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        bcrypt.compare(
            password,
            result[0].password,
            (err, isMatch) => {
                if (!isMatch) {
                    return res.status(401).json({
                        message: "Invalid email or password"
                    });
                }
                const token = jwt.sign(
                    {
                        id: result[0].id,
                        role: result[0].role
                    },
                    "mysecretkey",
                    {
                        expiresIn: "1d"
                    }
                );
                res.json({
                    message: "Login successful",
                    token,
                    user: result[0]
                });
            }
        );
    });
};
module.exports = { signup, login };
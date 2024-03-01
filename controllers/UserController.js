const User = require("../models/User");
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(401).json({
                success: false,
                message: "Pease fill the credentials",
            });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = await jwt.sign(
            { userId: userData._id },
            process.env.JWT_SECRET
        );

        res.status(200).json({
            success: true,
            name: userData.name,
            token,
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(409).json({
                errorMessage: "Bad request! Invalid credentials",
                success: false,
            });
        }

        const userDetails = await User.findOne({ email });

        if (!userDetails) {
            return res
                .status(401)
                .json({ message: "Email not found", success: false });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            userDetails.password
        );

        if (!passwordMatch) {
            return res
                .status(400)
                .json({ message: "Incorrect password", success: false });
        }

        const token = await jwt.sign(
            { userId: userDetails._id },
            process.env.JWT_SECRET
        );

        res.json({
            success: true,
            message: "Login Successfull",
            token: token,
            name: userDetails.name,
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { key, name, oldPassword, newPassword } = req.body;
        if (!key || !name || !oldPassword || !newPassword) {
            return res.status(409).json({
                errorMessage: "Bad request! Invalid credentials",
                success: false,
            });
        }

        const userDetails = await User.findById(key);

        if (!userDetails) {
            return res
                .status(401)
                .json({ message: "Invalid credentials", success: false });
        }

        const passwordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );

        if (!passwordMatch) {
            return res
                .status(401)
                .json({ message: "Incorrect old password", success: false });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.updateOne({ _id: key },
            {
                $set: {
                    name: name,
                    password: hashedPassword
                }
            });
        res.json({
            message: "User Details Updated successfully",
            name: userDetails.name,
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message,
        });
    }
};

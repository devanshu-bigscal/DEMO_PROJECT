const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
    try {
        const { fullName, email, password, contact } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.findOne({
            where: {
                email: email,
            },
        });

        if (!user) {
            const user = await userModel.create({
                fullName,
                email,
                password: hash,
                contact,
            });
            const User = await userModel.findOne({
                where: {
                    email: user.email,
                },
                attributes: {
                    exclude: [
                        "createdAt",
                        "deletedAt",
                        "updatedAt",
                        "isDeleted",
                        "deletedBy",
                        "password",
                        "id",
                    ],
                },
            });
            return res
                .status(200)
                .json({ message: "User Created successfully", User });
        } else {
            return res.status(400).json({ message: "User account already exists" });
        }
    } catch (error) {
        console.log(error);

        return res.status(400).json({ message: "Bad Request" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(400).json({ message: "User account not found" });
        }

        const value = bcrypt.compare(password, user.password);

        if (!value) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        const payload = {
            role: user.role,
            id: user.id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET);

        res.cookie("auth_token", token, { maxAge: 3600000 });

        res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Bad Request" });
    }
};

exports.logOut = (req, res) => {
    if (res.cookie("auth_token")) {
        res.clearCookie("auth_token");
    }
    return res.status(200).json({ message: "User logged out successfully" });
};

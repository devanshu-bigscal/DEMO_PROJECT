const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../connections/db_connection");
exports.signup = async (req, res) => {
    try {
        const { fullName, email, password, contact } = req.body;
        let { role } = req.body
        if (role === undefined) {
            role = "USER"
        }
        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.findOne({
            where: {
                role: role,
                email: email,
            },
        });

        if (!user) {

            const user = await userModel.create({
                fullName,
                email,
                password: hash,
                contact,
                role
            });
            const User = await userModel.findOne({
                where: {
                    email: user.email,
                    role: user.role
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
                .status(201)
                .json({ status: 201, message: "User Created successfully", User });
        }

        else {
            return res.status(409).json({ status: 409, error: "User account already exists" });
        }
    } catch (error) {
        console.log(error);

        return res.status(400).json({ status: 400, error: "Bad Request" });
    }
};

exports.login = async (req, res) => {
    try {
        let { email, password, role } = req.body;

        if (role === undefined) {
            role = "USER"
        }

        const user = await userModel.findOne({
            where: {
                email: email,
                role: role
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt', 'isDeleted', 'deletedBy']
            }
        });

        if (!user) {
            return res.status(404).json({ status: 404, error: "User account not found" });
        }

        const value = bcrypt.compare(password, user.password);

        if (!value) {
            return res.status(401).json({ status: 401, error: "Password incorrect" });
        }

        const payload = {
            role: user.role,
            id: user.id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET);

        res.cookie("auth_token", token, { maxAge: 3600000 });

        user['password'] = undefined

        res.status(200).json({ status: 200, message: "User logged in successfully", user });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: 400, message: "Bad Request" });
    }
};

exports.updateUser = async (req, res) => {

    try {

        const { id } = req.user


        const user = await userModel.update(req.body, { where: { id: id } })

        if (!user) return res.status(400).json({ status: 400, error: 'Bad Request', message: "Error while updating user profile" })
        let updatedUser = await userModel.findOne({
            where: {
                id
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

        return res.status(200).json({ status: 200, message: "User profile updated successfully", updatedUser })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: 400, error: "Bad Request" })

    }
}



exports.logOut = (req, res) => {
    if (res.cookie("auth_token")) {
        res.clearCookie("auth_token");
    }
    return res.status(200).json({ status: 200, message: "User logged out successfully" });
};


exports.assignAdmin = async (req, res) => {

    try {
        const { role } = req.user
        if (role !== "ADMIN") {
            return res.status(401).json({ status: 401, error: "Unauthorized" })
        }
        const userId = req.params.id

        const user = await userModel.findOne({ where: { id: userId } })

        if (!user) return res.status(404).json({ status: 404, error: "Not Found", message: "No user found with given user id" })

        await userModel.update({ role: "ADMIN" }, { where: { id: userId, role: 'USER' } })

        return res.status(200).json({ status: 200, message: "Admin credentials are assigned to user" })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: 400, error: "Bad Request", message: "Error while assigning admin credentials" })

    }
}



const { Op, where } = require("sequelize");
const postModel = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Post = require("../models/post");
exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file.filename;
        const { id } = req.user;
        const newPost = await postModel.create({ caption, image, user_id: id });

        if (!newPost) {
            return res
                .status(400)
                .json({
                    message: "Bad Request",
                    error: "Something went wrong while creating post",
                });
        } else {
            return res.status(200).json({ message: "Post created successfully" });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({
                message: "Bad Request",
                error: "Something went wrong while creating post",
            });
    }
};

exports.deletePostById = async (req, res) => {
    try {
        const { id, role } = req.user;

        const post = await postModel.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (post.user_id == id || role === "ADMIN") {
            (post.isDeleted = true), (post.deletedAt = new Date());
            post.deletedBy = req.user.role;

            await post.save();

            return res.status(200).json({ message: "Post deleted successfully" });
        } else {
            return res.status(401).json({ message: "Unauthorized to delete post" });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ message: "Something went wrong while deleteing post" });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await postModel.findOne({
            where: {
                id: req.params.id,
                isDeleted: false,
            },
            attributes: {
                exclude: [
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "isDeleted",
                    "deletedBy",
                    "id",
                    "user_id",
                ],
                include: [["id", "post_id"]],
            },
            include: [
                {
                    model: User,
                    as: "userDetails",
                    attributes: {
                        exclude: [
                            "deletedAt",
                            "createdAt",
                            "updatedAt",
                            "password",
                            "isDeleted",
                            "deletedBy",
                            "role",
                            "id",
                        ],
                        include: [["id", "user_id"]],
                    },
                },
                {
                    model: Comment,
                    as: "allComments",
                    attributes: {

                        exclude: [
                            "deletedAt",
                            "createdAt",
                            "updatedAt",
                            "password",
                            // "isDeleted",
                            "deletedBy",
                            "role",
                            "id",
                            "user_id",
                        ],
                        include: [["id", "commentId"]],
                    },
                    include: [
                        {
                            model: User,
                            as: "userDetails",
                            attributes: {
                                exclude: [
                                    "createdAt",
                                    "deletedAt",
                                    "updatedAt",
                                    "deletedBy",
                                    "isDeleted",
                                    "role",
                                    "password",
                                    "id",
                                ],
                                include: [["id", "user_id"]],
                            },
                        },
                    ],
                },
            ],
        });

        res.status(200).json({ message: "Post fetched successfully", post });
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ message: "Bad Request", error: "Error while fetching post" });
    }
};

exports.editPostById = async (req, res) => {
    try {
        const { id } = req.user;
        console.log(req.body);
        const post = await postModel.findOne({
            where: {
                id: req.params.id,
            },
            isDeleted: false,
        });

        if (post.user_id === id) {
            const update = await postModel.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });

            res.status(200).json({ message: "Post updated successfully" });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ message: "Something went wrong while editing post" });
    }
};

exports.allUserPosts = async (req, res) => {
    try {
        const { id } = req.user;

        const allPosts = await postModel.findAll({
            where: {
                user_id: id,
                isDeleted: false,
            },
            attributes: {
                exclude: [
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "isDeleted",
                    "deletedBy",
                    "id",
                    "user_id",
                ],
                include: [["id", "postId"]],
            },
            include: [
                {
                    model: User,
                    as: "userDetails",

                    attributes: {
                        exclude: [
                            "createdAt",
                            "deletedAt",
                            "updatedAt",
                            "isDeleted",
                            "deletedBy",
                            "password",
                            "id",
                            "role",
                        ],
                        include: [["id", "user_id"]],
                    },
                },
                {
                    model: Comment,
                    as: "allComments",

                    attributes: {
                        where: { "isDeleted": false },

                        exclude: [
                            "createdAt",
                            "deletedAt",
                            "updatedAt",
                            // "isDeleted",
                            "deletedBy",
                            "id",
                            "user_id",
                        ],

                        include: [["id", "commentId",]],



                    },
                    include: [
                        {
                            model: User,
                            as: "userDetails",
                            attributes: {
                                exclude: [
                                    "createdAt",
                                    "deletedAt",
                                    "updatedAt",
                                    "isDeleted",
                                    "deletedBy",
                                    "password",
                                    "role",
                                    "id",
                                ],
                                include: [["id", "user_id"]],
                            },
                        },
                    ],
                },
            ],
        });
        res
            .status(200)
            .json({ message: "User Posts are fetched successfully", allPosts });
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ message: "Bad Request", error: "Error while fetching posts" });
    }
};

exports.allUserPostsExpectUser = async (req, res) => {
    try {
        const { id } = req.user;

        const allPosts = await postModel.findAll({
            where: {
                user_id: {
                    [Op.not]: id,
                },
                isDeleted: false,
            },
            attributes: {
                exclude: [
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "isDeleted",
                    "deletedBy",
                    "user_id",

                    "id",
                ],
                include: [["id", "post_id"]],
            },
            include: [
                {
                    model: User,
                    as: "userDetails",
                    attributes: {
                        exclude: [
                            "createdAt",
                            "deletedAt",
                            "updatedAt",
                            "isDeleted",
                            "deletedBy",
                            "password",
                            "id",
                            "role",
                        ],
                        include: [["id", "user_id"]],
                    },
                },
                {
                    model: Comment,
                    as: "allComments",

                    attributes: {
                        exclude: [
                            "createdAt",
                            "deletedAt",
                            "updatedAt",
                            // "isDeleted",
                            "deletedBy",
                            "id",
                            "user_id",
                        ],
                        include: [["id", "commentId"]],
                    },
                    include: [
                        {
                            model: User,
                            as: "userDetails",
                            attributes: {
                                exclude: [
                                    "createdAt",
                                    "deletedAt",
                                    "updatedAt",
                                    "isDeleted",
                                    "deletedBy",
                                    "password",
                                    "role",
                                    "id",
                                ],
                                include: [["id", "user_id"]],
                            },
                        },
                    ],
                },
            ],
        });

        res.status(200).json({ message: "Posts fetched successfully", allPosts });
    } catch (error) {
        console.log(error);
        res
            .status(400)
            .json({ message: "Bad Request ", error: "Error while fetching post" });
    }
};

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
            return res.status(400).json({ message: "Bad Request", error: "Something went wrong while creating post" });
        } else {
            return res.status(200).json({ message: "Post created successfully" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Bad Request", error: "Something went wrong while creating post" });
    }
};

exports.deletePostById = async (req, res) => {
    try {
        const { id, role } = req.user;

        const post = await postModel.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Comment,
                    as: "allComments"
                }
            ]
        });

        if (!post)
            return res.status(404).json({ message: "Not found", error: "No post found for given post id" })

        if (post.user_id == id || role === "ADMIN") {

            for (const key in post.allComments) {
                if (post.allComments[key]['isDeleted'] === false) {
                    post.allComments[key]['isDeleted'] = true
                    await post.allComments[key].save()
                }
            }

            post.isDeleted = true
            post.deletedAt = new Date();
            post.deletedBy = req.user.role;

            await post.save();


            return res.status(200).json({ message: "Post deleted successfully" });
        } else {
            return res.status(401).json({ message: "Unauthorized to delete post" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Something went wrong while deleteing post" });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await postModel.findOne({
            where: {
                id: req.params.id,
                isDeleted: false
            },
            attributes:
                { exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "id", "user_id",], include: [["id", "post_id"]] },

            include: [{
                model: User, as: 'userDetails', attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "password", "role", "id"], include: [["id", "user_id"]],

                },
            },
            {
                model: Comment, as: 'allComments', attributes: {

                    exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "id"], include: [["id", "user_id"]],

                },
                include: [
                    {
                        model: User, as: 'userDetails', attributes: {
                            exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "password", "role", "id"], include: [["id", "user_id"]],

                        },
                    }]
            },

            ]
        });

        if (!post)
            return res.status(404).json({ message: "Not Found", error: "No post found for given post id" })

        res.status(200).json({ message: "Post fetched successfully", post });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bad Request", error: "Error while fetching post" });
    }
};

exports.editPostById = async (req, res) => {
    try {
        const { id } = req.user;

        const payload = {
            ...req.body,
            image: req.file.filename
        }
        const post = await postModel.findOne({
            where: {
                id: req.params.id
            },
            isDeleted: false
        });

        if (post.user_id == id) {
            const update = await postModel.update(payload, {
                where: {
                    id: req.params.id
                }
            });

            res.status(200).json({ message: "Post updated successfully" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Something went wrong while editing post" });
    }
};

exports.allUserPosts = async (req, res) => {
    try {
        const { id } = req.user;

        const allPosts = await postModel.findAll({
            where: {
                user_id: id,
                isDeleted: false
            },
            attributes:
                { exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "id", "user_id",], include: [["id", "post_id"]] },

            include: [{
                model: User, as: 'userDetails', attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "password", "role", "id"], include: [["id", "user_id"]],

                },
            },
            {
                model: Comment, as: 'allComments', attributes: {

                    exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "id"], include: [["id", "commentId"]],

                },
                include: [
                    {
                        model: User, as: 'userDetails', attributes: {
                            exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "password", "role", "id"], include: [["id", "user_id"]],

                        },
                    }]
            },

            ]
        });
        res.status(200).json({ message: "User Posts are fetched successfully", allPosts });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bad Request", error: "Error while fetching posts" });
    }
};

exports.allUserPostsExpectUser = async (req, res) => {
    try {
        const { id } = req.user;

        const allPosts = await postModel.findAll({
            where: {
                user_id: { [Op.not]: id },
                isDeleted: false
            },
            attributes:
                { exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "id", "user_id",], include: [["id", "post_id"]] },

            include: [{
                model: User, as: 'userDetails', attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "password", "role", "id"], include: [["id", "user_id"]],

                },
            },
            {
                model: Comment, as: 'allComments', attributes: {


                    exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "id"], include: [["id", "commentId"]],

                },
                include: [
                    {
                        model: User, as: 'userDetails', attributes: {
                            exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "password", "role", "id"], include: [["id", "user_id"]],

                        },
                    }]
            },

            ]
        });

        res.status(200).json({ message: "Posts fetched successfully", allPosts });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Bad Request ", error: "Error while fetching post" });
    }
};

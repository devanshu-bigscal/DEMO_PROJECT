const { Op, where, and } = require("sequelize");
const postModel = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Post = require("../models/post");
const sequelize = require("../connections/db_connection");



exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file.filename;
        const { id } = req.user;
        const newPost = await postModel.create({ caption, image, user_id: id });

        if (!newPost) {
            return res.status(400).json({ status: 400, error: "Bad Request", message: "Something went wrong while creating post" });
        } else {
            let post = await postModel.findOne({ where: { id: newPost.id }, attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'isDeleted', 'id', 'deletedBy', 'user_id'] } })
            return res.status(201).json({ status: 201, message: "Post created successfully", post });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: 400, error: "Bad Request", message: "Something went wrong while creating post" });
    }
};


exports.deletePostById = async (req, res) => {
    try {
        const { id, role } = req.user;

        const post = await postModel.findOne({
            where: {
                id: req.params.id,
                isDeleted: false
            },
            include: [
                {
                    model: Comment,
                    as: "allComments"
                }
            ]
        });

        if (!post)
            return res.status(404).json({ status: 404, error: "Not found", message: "No post found for given post id" })


        if (post.user_id == id || role === "ADMIN") {

            await postModel.update({ isDeleted: true, deletedBy: role, deletedAt: new Date() }, { where: { isDeleted: false, id: req.params.id } })

            await Comment.update({ isDeleted: true, deletedBy: role, deletedAt: new Date() }, { where: { post_id: req.params.id, isDeleted: false } })

            const deletedPost = await postModel.findOne({ where: { id: req.params.id }, attributes: { exclude: ['createdAt', 'updatedAt', 'user_id'] }, include: [{ model: Comment, as: "allComments", attributes: { exclude: ['createdAt', 'updatedAt'] } }] })

            return res.status(200).json({ status: 200, message: "Post deleted successfully", deletedPost });
        } else {
            return res.status(401).json({ status: 401, error: "Unauthorized to delete post" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: 400, error: "Bad Request", message: "Something went wrong while deleteing post" });
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
                model: Comment, as: 'allComments', where: { isDeleted: false }, required: false, attributes: {

                    exclude: ["createdAt", "updatedAt", "deletedAt", "deletedBy", "isDeleted", "id"], include: [["id", "commentId"]],


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
            return res.status(404).json({ status: 404, error: "Not Found", message: "No post found for given post id" })

        res.status(200).json({ status: 200, message: "Post fetched successfully", post });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, error: "Bad Request", message: "Error while fetching post" });
    }
};

exports.editPostById = async (req, res) => {
    try {
        const { id, role } = req.user;

        const payload = {
            ...req.body,
            image: req.file.filename
        }
        const post = await postModel.findOne({
            where: {
                id: req.params.id,
                isDeleted: false
            },
        });

        if (!post) return res.status(404).json({ status: 404, error: 'Not Found', message: 'No post found with given post id' })
        if (post.user_id == id || role === "ADMIN") {

            const update = await postModel.update(payload, {
                where: {
                    id: req.params.id
                }
            });

            if (!update) {
                return res.status(400).json({ status: 400, error: "Bad Request", message: "Error while updating post" });
            }

            let post = await postModel.findOne({ where: { id: req.params.id }, attributes: { exclude: ['createdAt', 'deletedAt', 'updatedAt', 'isDeleted', 'id', 'deletedBy'], include: [['id', 'postId']] } })

            res.status(200).json({ status: 200, message: "Post updated successfully", post });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: 400, error: "Bad Request", message: "Something went wrong while editing post" });
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

            attributes:
                { exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "id", "user_id",], include: [["id", "post_id"]] },

            include: [
                {
                    model: User,
                    as: 'userDetails',
                    attributes: { exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "password", "role", "id"], include: [["id", "user_id"]] },
                },

                {
                    model: Comment, as: 'allComments',
                    required: false,
                    where: { isDeleted: false },
                    attributes: {

                        exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "id"], include: [["id", "commentId"]],

                    },
                    include: [
                        {
                            model: User, as: 'userDetails', attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt", "isDeleted", "deletedBy", "password", "role", "id"], include: [["id", "user_id"]],

                            },
                        }],
                },


            ]

        })



        res.status(200).json({ status: 200, message: "User Posts are fetched successfully", allPosts });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, error: "Bad Request", message: "Error while fetching posts" });
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
                model: Comment, as: 'allComments', where: { isDeleted: false }, required: false, attributes: {


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

        res.status(200).json({ status: 200, message: "Posts fetched successfully", allPosts });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, error: "Bad Request ", message: "Error while fetching post" });
    }
};

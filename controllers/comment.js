const { Op } = require("sequelize")
const Comment = require("../models/comment")
const commentModel = require("../models/comment")
const Post = require("../models/post")
const User = require("../models/user")
exports.createComment = async (req, res) => {

    try {
        const { id } = req.user
        const post_id = req.params.id
        const { text } = req.body
        const post = await Post.findOne({ where: { id: post_id, isDeleted: false } })

        if (!post) return res.status(404).json({ status: 404, error: 'Not Found', message: 'no post found with given post id' })

        const newComment = await commentModel.create({ user_id: id, post_id, text })

        if (!newComment) return res.status(400).json({ status: 400, error: "Bad Request", message: "Something went wrong while creating comment" });

        let comment = await commentModel.findOne({ where: { id: newComment.id }, attributes: { exclude: ['createdAt', 'updatedAt', 'isDeleted', 'deletedAt', 'deletedBy', 'id'], include: [['id', 'commentId']] } })

        res.status(201).json({ status: 201, message: "Comment created successfully", comment })

    } catch (error) {
        console.log(error)
        res.status(400).json({ status: 400, error: "Bad Request", message: "Error while creating comment" })
    }
}

exports.deleteCommentById = async (req, res) => {
    try {
        const { id, role } = req.user
        const comment_id = req.query.commentId

        const post = await Post.findOne({ where: { id: req.params.postId, isDeleted: false } })

        if (!post) return res.status(404).json({ status: 404, error: 'Not Found', message: 'No post found with given post id' })

        const comment = await Post.findOne({ include: [{ model: commentModel, as: "allComments", where: { id: { [Op.eq]: comment_id }, isDeleted: false }, include: [{ model: User, as: "userDetails" }] }] })

        if (!comment) return res.status(404).json({ status: 404, error: "Not found", message: "comment not found to delete" })

        if (comment.user_id == id || role === "ADMIN" || comment.allComments[0].user_id == comment.allComments[0].userDetails.id) {
            comment.allComments[0].isDeleted = true
            comment.allComments[0].deletedBy = role
            comment.allComments[0].deletedAt = new Date()
            await comment.allComments[0].save()

            return res.status(200).json({ status: 200, message: "Comment deleted successfully" })
        } else {

            return res.status(401).json({ status: 401, error: 'Unauthorized', message: "Unauthorized to delete comment" })

        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ status: 400, error: "Bad Request", message: "Error while deleting comment" })
    }
}


exports.editCommentById = async (req, res) => {
    try {
        const { id, role } = req.user
        const comment_id = req.query.commentId

        const post = await Post.findOne({ where: { id: req.params.postId, isDeleted: false } })


        if (!post) return res.status(404).json({ status: 404, error: 'Not Found', message: 'No post found with given post id' })


        const comment = await Post.findOne({ include: [{ model: commentModel, as: "allComments", where: { id: { [Op.eq]: comment_id }, isDeleted: false }, include: [{ model: User, as: "userDetails" }] }] })

        if (!comment) return res.status(404).json({ status: 404, error: "Not found", message: "comment not found to update" })


        if (((comment.allComments[0].user_id == comment.allComments[0].userDetails.id) && Number(comment.user_id) !== id) || role === "ADMIN") {
            await commentModel.update(req.body, { where: { id: comment_id } })
            let updatedComment = await commentModel.findOne({ where: { id: comment_id }, attributes: { exclude: ['createdAt', 'updatedAt', 'isDeleted', 'deletedBy', 'deletedAt'] } })
            return res.status(200).json({ status: 200, message: "Comment updated successfully", updatedComment })
        } else {

            return res.status(401).json({ status: 401, error: "Unauthorized", message: "Unauthorized to update comment" })

        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: 400, error: "Bad Request", message: "Error while updating comment" })
    }
}


exports.getCommentById = async (req, res) => {
    try {
        const { id, role } = req.user
        const comment_id = req.query.commentId

        const post = await Post.findOne({ where: { id: req.params.postId, isDeleted: false } })


        if (!post) return res.status(404).json({ status: 404, error: 'Not Found', message: 'No post found with given post id' })


        const comment = await Comment.findOne({ attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'isDeleted', 'deletedBy', 'id', 'post_id'], include: [['id', 'commentId']] }, include: [{ model: Post, as: "postDetails", attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'isDeleted', 'deletedBy', 'id'], include: [['id', 'postId']] }, where: { id: { [Op.eq]: req.params.postId }, isDeleted: false } }] })

        if (!comment) return res.status(404).json({ status: 404, error: "Not found", message: "comment not found " })

        if (comment.user_id == id || role === "ADMIN") {

            return res.status(200).json({ status: 200, message: "Comment fetched successfully", comment })
        } else {

            return res.status(401).json({ status: 401, error: "Unauthorized to fetched comment" })

        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: 400, error: "Bad Request", message: "Error while fetching comment" })
    }
}
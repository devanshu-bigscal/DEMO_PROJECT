const { Op } = require("sequelize")
const commentModel = require("../models/comment")
const Post = require("../models/post")
const User = require("../models/user")
exports.createComment = async (req, res) => {

    try {
        const { id } = req.user
        const post_id = req.params.id
        const { text } = req.body

        const newComment = commentModel.create({ user_id: id, post_id, text })

        res.status(200).json({ message: "Comment created successfully" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Bad Request", error: "Error while creating comment" })
    }
}

exports.deleteCommentById = async (req, res) => {
    try {
        const { id, role } = req.user
        const comment_id = req.query.commentId


        const comment = await Post.findOne({ include: [{ model: commentModel, as: "allComments", where: { id: { [Op.eq]: comment_id } }, include: [{ model: User, as: "userDetails" }] }] })

        if (!comment) return res.status(404).json({ message: "Not found", error: "comment not found to delete" })

        if (comment.user_id == id || role === "ADMIN" || comment.allComments[0].user_id == comment.allComments[0].userDetails.id) {
            comment.allComments[0].isDeleted = true
            comment.allComments[0].deletedBy = role
            comment.allComments[0].deletedAt = new Date()
            await comment.allComments[0].save()

            return res.status(200).json({ 'message': "Comment deleted successfully" })
        } else {

            return res.status(401).json({ 'message': "Unauthorized to delete comment" })

        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Bad Request", error: "Error while deleting comment" })
    }
}


exports.editCommentById = async (req, res) => {
    try {
        const { id, role } = req.user
        const comment_id = req.query.commentId
        const comment = await Post.findOne({ include: [{ model: commentModel, as: "allComments", where: { id: { [Op.eq]: comment_id } }, include: [{ model: User, as: "userDetails" }] }] })

        if (!comment) return res.status(404).json({ message: "Not found", error: "comment not found to update" })

        if (comment.user_id == id || role === "ADMIN" || comment.allComments[0].user_id == comment.allComments[0].userDetails.id) {
            await commentModel.update(req.body, { where: { id: comment_id } })

            return res.status(200).json({ 'message': "Comment updated successfully" })
        } else {

            return res.status(401).json({ 'message': "Unauthorized to update comment" })

        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Bad Request", error: "Error while updating comment" })
    }
}
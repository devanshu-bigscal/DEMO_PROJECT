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
        const comment_id = req.params.id

        const comment = await commentModel.findOne({
            where: {
                id: comment_id,
                isDeleted: false
            },
            include: [{ model: Post, as: 'postDetails', include: [{ model: User, as: "userDetails" }] }]
        })
        if (comment.user_id == id || role === "ADMIN" || comment.postDetails.user_id == comment.postDetails.userDetails.id) {
            comment.isDeleted = true
            comment.deletedBy = role,
                comment.deletedAt = new Date()
            await comment.save()

            return res.status(200).json({ 'message': "Comment deleted successfully" })
        } else {

            return res.status(401).json({ 'message': "Unauthorized to delete comment" })

        }

    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Bad Request", error: "Error while deleting comment" })
    }
}


exports.updateCommentById = async (req, res) => {
    try {
        console.log('hello')
        const { id, role } = req.user
        const comment_id = req.query.id

        const comment = await commentModel.findOne({
            where: {
                id: comment_id,
                isDeleted: false
            },
            include: [{ model: Post, as: 'postDetails', include: [{ model: User, as: "userDetails" }] }]
        })
        if (comment.user_id == id || role === "ADMIN" || comment.postDetails.user_id == comment.postDetails.userDetails.id) {

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
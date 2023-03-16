const Joi = require("joi")
const errorMessages = require("./errors")


exports.validateComment = async (req, res, next) => {
    try {
        const schema = Joi.object({
            text: Joi.string().required().max(300),
        })
        const option = {
            abortEarly: false,
            errorMessages
        }
        const value = await schema.validateAsync(req.body, option)
        next()
    } catch (error) {

        error = error.details.map(e => {
            return e.message
        })
        res.status(400).json({ message: "Bad Request", error: error })
    }

}

exports.validatePostIdAndQuery = async (req, res, next) => {
    try {

        const schema = Joi.object({
            postId: Joi.number().required(),
            commentId: Joi.number().required()
        })
        const option = {
            abortEarly: false,
            errorMessages
        }
        const payload = { ...req.params, commentId: req.query.commentId }
        const value = await schema.validateAsync(payload, option)
        next()

    } catch (error) {
        error = error.details.map(e => {
            return e.message
        })
        res.status(400).json({ message: "Bad Request", error: error })
    }
}


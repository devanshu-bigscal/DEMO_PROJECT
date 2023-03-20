const Joi = require("joi")
const errorMessages = require("./errors")


exports.validatePost = async (req, res, next) => {
    try {
        const schema = Joi.object({
            caption: Joi.string().required().max(300),
            image: Joi.string().required()
        })
        const option = {
            abortEarly: false,
            errorMessages
        }
        const payload = { ...req.body, image: req?.file?.filename }
        const value = await schema.validateAsync(payload, option)
        next()
    } catch (error) {

        error = error.details.map(e => {
            return e.message.replaceAll('"', "")
        })
        res.status(400).json({ message: "Bad Request", error: error })
    }

}

exports.validatePostId = async (req, res, next) => {
    try {

        const schema = Joi.object({
            id: Joi.number().required()
        })

        const value = await schema.validateAsync(req.params)
        next()

    } catch (error) {
        error = error.details.map(e => {
            return e.message.replaceAll('"', "")
        })
        res.status(400).json({ message: "Bad Request", error: error })
    }
}


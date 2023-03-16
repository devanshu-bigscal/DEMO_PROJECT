const Joi = require("joi")
const errorMessages = require("./errors")
exports.validateSignup = async (req, res, next) => {
    try {
        const schema = Joi.object({
            fullName: Joi.string().required().min(3).max(50),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().min(6).max(12),
            contact: Joi.string().length(10).pattern(/^[0-9]+$/).required()
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

        res.status(400).json({ message: 'Bad Request', error: error })
    }
}


exports.validateLogin = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().min(6).max(12)
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

        res.status(400).json({ message: 'Bad Request', error: error })

    }
}

exports.validateUpdate = async (req, res, next) => {
    try {
        const schema = Joi.object({
            fullName: Joi.string().min(3).max(50),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            contact: Joi.string().length(10).pattern(/^[0-9]+$/)
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

        res.status(400).json({ message: 'Bad Request', error: error })

    }
}


exports.validateUserId = async (req, res, next) => {
    try {

        const schema = Joi.object({
            id: Joi.number().required()
        })

        const value = await schema.validateAsync(req.params)
        next()

    } catch (error) {
        error = error.details.map(e => {
            return e.message
        })
        res.status(400).json({ message: "Bad Request", error: error })
    }
}


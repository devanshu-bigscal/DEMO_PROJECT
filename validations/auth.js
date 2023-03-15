const Joi = require("joi")

exports.validateSignup = async (req, res, next) => {
    try {
        const schema = Joi.object({
            fullName: Joi.string().required().min(3).max(50).messages({
                'string.empty': `"fullName" cannot be an empty field`,
                'any.required': `"fullName" is a required field`
            }),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
                'string.empty': `"email" cannot be an empty field`,
                'any.required': `"email" is a required field`
            }),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().min(6).max(12).messages({
                'string.empty': `"password" cannot be an empty field`,
                'string.min': `"password" should have a minimum length of 3`,
                'any.required': `"password" is a required field`
            }),
            contact: Joi.string().length(10).pattern(/^[0-9]+$/).required().messages({
                'string.empty': `"contact" cannot be an empty field`,
                'string.min': `"contact" should have a length of 10`,
                'any.required': `"contact" is a required field`
            }),
        })
        const value = await schema.validateAsync(req.body)
        next()
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.details[0].message })
    }
}


exports.validateLogin = async (req, res, next) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
                'string.empty': `"email" cannot be an empty field`,
                'any.required': `"email" is a required field`
            }),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().min(6).max(12).messages({
                'string.empty': `"password" cannot be an empty field`,
                'string.min': `"password" should have a minimum length of 3`,
                'any.required': `"password" is a required field`
            }),
        })
        const value = await schema.validateAsync(req.body)
        next()
    } catch (error) {
        res.status(400).json({ message: 'Bad Request', error: error.details[0].message })

    }
}
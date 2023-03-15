const passport = require("passport")

exports.cookieExtractor = (req, res) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['auth_token']
    }
    return token
}

exports.isAuth = function (roles) {
    return function (req, res, next) {
        passport.authenticate("jwt", { session: false }, (err, user, info) => {
            if (err) {
                console.log(roles, "first")
                return res.status(401).json({ message: "Unauthorized user" })
            }
            else {
                if (!roles && !Array.isArray(roles) && roles == user.role) {
                    req.user = user
                    next()
                }
                if (roles.includes(user.role)) {
                    req.user = user
                    next()
                }
                else {
                    console.log(roles, "second")

                    return res.status(401).json({ message: "Unauthorized user" })

                }
            }
        })(req, res, next)
    }
}
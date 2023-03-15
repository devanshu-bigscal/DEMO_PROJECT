const { signup, getSignup, getLogin, login, logOut } = require("../controllers/auth")
const { validateSignup, validateLogin } = require("../validations/auth")

const router = require("express")()

router.post("/signup", validateSignup, signup)

router.post("/login", validateLogin, login)

router.get("/logout", logOut)

module.exports = router
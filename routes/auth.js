const { signup, login, logOut, updateUser, assignAdmin } = require("../controllers/auth")
const { isAuth } = require("../middlewares/auth")
const { validateSignup, validateLogin, validateUpdate, validateUserId } = require("../validations/auth")

const router = require("express")()

router.post("/signup", validateSignup, signup)

router.post("/login", validateLogin, login)

router.put("/update", isAuth(['USER', 'ADMIN']), validateUpdate, updateUser)

router.get("/logout", logOut)

router.post("/:id", isAuth(['ADMIN']), validateUserId, assignAdmin)

module.exports = router
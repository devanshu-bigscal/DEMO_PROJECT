const { createComment, deleteCommentById, updateCommentById } = require("../controllers/comment")

const { isAuth } = require("../middlewares/auth")

const router = require("express")()

router.post("/post/:id", isAuth(['USER', 'ADMIN']), createComment)
router.put("/", isAuth(['USER', 'ADMIN'], updateCommentById))
router.delete("/:id", isAuth(['USER', 'ADMIN']), deleteCommentById)


module.exports = router

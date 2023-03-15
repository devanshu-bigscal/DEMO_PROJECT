const { createComment, deleteCommentById, editCommentById } = require("../controllers/comment")

const { isAuth } = require("../middlewares/auth")

const router = require("express")()

router.post("/post/:id", isAuth(['USER', 'ADMIN']), createComment)
router.put("/:id", isAuth(['USER', 'ADMIN']), editCommentById)
router.delete("/:id", isAuth(['USER', 'ADMIN']), deleteCommentById)


module.exports = router

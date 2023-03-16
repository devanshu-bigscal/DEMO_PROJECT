const { createComment, deleteCommentById, editCommentById } = require("../controllers/comment")

const { isAuth } = require("../middlewares/auth")
const { validateComment, validatePostIdAndQuery } = require("../validations/comment")
const { validatePostId } = require("../validations/post")

const router = require("express")()

router.post("/post/:id", isAuth(['USER', 'ADMIN']), validatePostId, validateComment, createComment)
router.put("/:postId", isAuth(['USER', 'ADMIN']), validatePostIdAndQuery, validateComment, editCommentById)
router.delete("/:postId", isAuth(['USER', 'ADMIN']), validatePostIdAndQuery, deleteCommentById)


module.exports = router

const { createComment, deleteCommentById, editCommentById, getCommentById } = require("../controllers/comment")

const { isAuth } = require("../middlewares/auth")
const { validateComment, validatePostIdAndQuery } = require("../validations/comment")
const { validatePostId } = require("../validations/post")

const router = require("express")()

router.post("/post/:id", isAuth(['USER', 'ADMIN']), validatePostId, validateComment, createComment)
router.put("/:postId", isAuth(['USER', 'ADMIN']), validatePostIdAndQuery, validateComment, editCommentById)
router.delete("/:postId", isAuth(['USER', 'ADMIN']), validatePostIdAndQuery, deleteCommentById)
router.get("/:postId", isAuth(['USER', 'ADMIN']), validatePostIdAndQuery, getCommentById)

module.exports = router

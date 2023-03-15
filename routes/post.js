const { createPost, getPostById, editPostById, deletePostById, allUserPosts, allUserPostsExpectUser } = require("../controllers/post")

const router = require("express")()
const multer = require("multer")
const { v4 } = require("uuid")
const { isAuth } = require("../middlewares/auth")
const upload = multer({
    fileFilter: (req, file, cb) => {
        file.size = parseInt(req.headers["content-length"]) // 3e6 - 3mb
        if (file.size <= 3000000 && (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png")) {
            cb(null, true)
        }
        else {
            cb(null, false)
            return cb(new Error("File extension must of image type with size limit less than 3mb "))
        }

    },
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/images')
        },
        filename: function (req, file, cb) {
            const fn = v4() + file.originalname
            cb(null, fn)
        }
    })
})

router.post("/", isAuth(['USER', 'ADMIN']), upload.single("image"), createPost)
router.get("/myposts", isAuth(['USER', 'ADMIN']), allUserPosts)
router.get("/", isAuth(['USER', 'ADMIN']), allUserPostsExpectUser)
router.get("/postid/:id", isAuth(['USER']), getPostById)
router.delete("/:id", isAuth(['USER', 'ADMIN']), deletePostById)
router.put("/:id", isAuth(['USER', 'ADMIN']), upload.single("image"), editPostById)

module.exports = router
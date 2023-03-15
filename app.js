const express = require("express");
const app = express();
const sequelize = require("./connections/db_connection");
require("dotenv").config();
const path = require("path")
const cookieParser = require("cookie-parser")
const userModel = require("./models/user")
const passport = require("passport")
const JWT_passport = require("passport-jwt").Strategy
const { cookieExtractor } = require("./middlewares/auth")


//my routes
const authRoutes = require("./routes/auth")
const postRoutes = require("./routes/post")
const commentRoutes = require("./routes/comment")



// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// My Middlewares
app.use("/auth", authRoutes)
app.use("/post", postRoutes)
app.use("/comment", commentRoutes)



// Connections
const port = process.env.PORT || 8000;

//authentication 
passport.use(new JWT_passport({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
}, (payload, done) => {
    userModel.findOne({ where: { id: payload.id } }).then(user => {
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false)
        }
    }).catch(err => console.log(err))
}))


sequelize.authenticate().then(() => {
    console.log(`DB CONNECTED SUCCESSFULLY`);
    app.listen(port, () => console.log(`SERVER RUNNING AT PORT : ${port}`));
}).catch((err) => console.log("DB CONNECTION FAILED", err));

const {DataTypes} = require("sequelize")
const sequelize = require("../connections/db_connection")
const Comment = require("../models/comment")
const User = require("./user")
const Post = sequelize.define("Post", {
    caption: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    image: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date()
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    deletedBy: {
        type: DataTypes.STRING,
        defaultValue: ""
    }

})
Post.hasMany(Comment, {
    foreignKey: "post_id",
    as: 'allComments'
})
Comment.belongsTo(Post, {
    foreignKey: "post_id",
    as: "postDetails"
})

module.exports = Post

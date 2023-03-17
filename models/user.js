const { DataTypes, DATE } = require("sequelize")
const sequelize = require("../connections/db_connection")
const Post = require("./post")
const Comment = require("./comment")
const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    contact: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "USER",
        primaryKey: true

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

User.hasMany(Post, {
    foreignKey: "user_id",
    as: "allPosts"
})
Post.belongsTo(User, {
    foreignKey: "user_id",
    as: "userDetails"
})
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    as: "userDetails"
})
module.exports = User

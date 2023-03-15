const { DataTypes } = require("sequelize")
const sequelize = require("../connections/db_connection")
const User = require('../models/user')


const Comment = sequelize.define("Comment", {
    post_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING
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


module.exports = Comment

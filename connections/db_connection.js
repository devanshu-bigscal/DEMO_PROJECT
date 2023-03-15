const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("DEMO_PROJECT", "root", "root@1234", {
    dialect: 'mysql',
    host: 'localhost'
})
sequelize.sync()
module.exports = sequelize


const sequelize = require("sequelize")

const connection = new sequelize('perguntas_respostas','root','Passw0rd*',{
    host:'localhost',
    dialect: 'mysql',
    port:3306
})

module.exports = connection
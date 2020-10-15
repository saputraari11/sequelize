'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class admin extends Model {

        static associate(models) {


        }
    };
    admin.init({
        admin_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nama: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'admin',
    });
    return admin;
};
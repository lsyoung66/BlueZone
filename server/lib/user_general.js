const mysql = require('mysql');
const dbconfig = require('../config/database.js');
const connection = mysql.createConnection(dbconfig);

exports.guser = function (req, res) {
    connection.query('SELECT * from user_general', (error, user_general) => {
        if (error) {
            console.log('fail');
            throw error;
        }
        else {
            console.log('success');
            console.log('User info is: ', user_general);
            res.send(user_general);
        }

    });
}
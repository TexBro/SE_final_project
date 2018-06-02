var mysql = require('mysql');

module.exports = function () {
    return {
        init: function () {
            return mysql.createConnection({
                connectionLimit: 5,
                host: 'localhost',
                user: 'root',
                database: 'sw_proj3',
                password: 'hyjuki12!'
            });
        }
    }
};
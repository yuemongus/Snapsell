

var mysql = require('mysql');

var dbconnect = {
getConnection: function() {
    var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "snapsell"
});
return conn;
}
};

module.exports = dbconnect
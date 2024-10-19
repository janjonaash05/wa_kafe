mysql = require("mysql")


export function getConnection() {
  var conn = mysql.createConnection({
    host: "localhost",
    user: "",
    password: "",
    database: "coffe_lmsoft_cz"
  });

  conn.connect(function (err) {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
  });



  return conn;

}


//mysql
var mysql=require('mysql');
var db=mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	//port: '3307',
	password: 'q1w2e3r4',
	database: 'mysql'
});
var qStr="CREATE TABLE bp_email_reqs ("
	+"id INT(10) KEY AUTO_INCREMENT,"
	+"email TEXT NOT NULL,"
	+"poet_detail LONGTEXT"
	+")";
qStr="SELECT * FROM bp_email_reqs WHERE email='517561494@qq.com'";
//qStr="INSERT INTO bp_email_reqs values(null,'517561494@qq.com','abc')";
console.log(qStr);
db.query(qStr,
	function(err,rows) {
		if(err) console.log(err);
		console.log(rows);
	}
);
var mysql=require('mysql');
var db=mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	//port: '3307',
	password: 'q1w2e3r4',
	database: 'mysql'
});



function PoetVO(email,poet_detail) {
	this.email=email;
	this.poet_detail=poet_detail;
	this.sqlStr="";		
}
exports.PoetVO=PoetVO;

PoetVO.prototype.insertRow=function(cb) {
	this.sqlStr="INSERT INTO bp_email_reqs values(null,'"+this.email+"','"+this.poet_detail+"')";
	console.log(this.sqlStr);
	db.query(this.sqlStr,function(err,rows) {
		if(err) console.log(err);
		var poetId=rows.insertId;
		//console.log(poetId); //return columnm bp_email_reqs.id of interted row
		cb(err,poetId);
	});
};

PoetVO.prototype.queryRows=function(cb) {
	this.sqlStr="SELECT * FROM bp_email_reqs WHERE email='"+this.email+"'";
	console.log(this.sqlStr);
	db.query(this.sqlStr,function(err,rows) {
		if(err) console.log(err);
		//console.log(rows); //return columnm bp_email_reqs.id of interted row
		cb(err,rows);
	});
};

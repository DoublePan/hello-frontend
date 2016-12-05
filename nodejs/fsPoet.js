var fileName='./webdata/poets.txt';
var fs=require("fs");
var qs=require('querystring');
var formidable=require('formidable');
var dpform=require('./dpform.js');
var rl=require('readline');
//var a=0;

module.exports = {
    listPoets: function(req, res) {
       // try {
       		loadOrInitTask(fileName, function(tasks) {
		        for (var i in tasks) {
		            console.log(tasks[i]);
		        }
			});
       // } catch (e) {
       // 		throw e;
       // }
    	
    },
    addPoet: function(req,res) {
        //a++; a is a global varible shared by all require('fsPoet.js');
       
    	processPoetForm(req,res);    	
    }
};



function processPoetForm(req,res) {
    //form enctype='text/plain'
    if(!isFormData(req)) {
       
        var formData='';// if (err) throw err;
        req.on('data',function(chunk) {
            formData+=chunk;
        });
        req.on('end',function(err) {
            // if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>' + 'CPP Good Luck' + '</h1>');           
            fs.appendFile(fileName,JSON.stringify(qs.parse(formData))+'\n','utf8',function(err) {
                // if (err) throw err;
                //console.log(formData);
                //console.log(qs.parse(formData));
                console.log(new Date()+'Saved');    
            });
        });    
    } else {
        //form enctype='multipart/form-data'
//-----------using dpform
/*        var formData=new dpform.FormData();
        formData.parse(req,function(fields,files) {
            console.log(fields);
            console.log(files);
            res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end('<h1>' + 'Request Accepted!' + '</h1>');
        });
*/

//-----------using readline: EOL caused 'read by line' not fitting in the file situation.
/*
        var rlOnReq=rl.createInterface({
            input: req
        });

        rlOnReq.on('line',function(line) {
            console.log('======cpp delimiter line============')
            console.log(line);
        });
*/

//-----------using req.on

        var formData='';// if (err) throw err;
        req.on('data',function(chunk) {
            formData+=chunk;
            console.log('======cpp delimiter chunk============'+chunk.length)
            console.log(formData);
        });
        req.on('end',function(err) {
             res.writeHead(200, { 'Content-Type': 'text/html' });
             res.end('<h1>' + 'Request Accepted!' + '</h1>');
             //console.log('======cpp delimiter formData============')
             //console.log(formData);
             //console.log(qs.parse(formData)); //NOT work for multipart/form-data
        })


//-----------using formidable mudual
/*      var form=new formidable.IncomingForm();
        form.uploadDir='./webdata';
        form.keepExtensions=true;     

        form.on('field',function(field,value) {
            console.log(field);
            console.log(value);
        });

        form.on('file',function(name,file) {
            console.log(name);
            console.log(file);
        });

        form.on('end',function(err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>' + 'Request Accepted!' + '</h1>');
        });

        form.parse(req);
*/

/*      
        try {
            form.parse(req,function(err,fields,files) {
                if (err) {console.log(err.message);}
                console.log(fields);
                console.log(files);
                fs.rename(files.imgfile.path,form.uploadDir+'/'+fields.email+' '+files.imgfile.name);  //filename=email+' '+original name
                console.log('Completed');
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('<h1>' + 'Request Accepted!' + '</h1>');
            });
        } catch (e) {
            console.log(e.message);
        }
 */

    }
}





//common functions---utils
function loadOrInitTask(fileName, cb)  {
    fs.exists(fileName, function(exists) {
        var poets = [];
        if (exists) {
            fs.readFile(fileName, 'utf8', function(err, data) {
                if (err) throw err;
                //data = data.toString();

                try {
                    tasks = JSON.parse(data || '[]');
                } catch (e) {
                    console.log(e.message);
                }
                
                cb(poets);
            });
        } else {
            cb([]);
        }
    });
}


function isFormData(req) {
    var type=req.headers['content-type']+'';
    return 0===type.indexOf('multipart/form-data');
}

function gbkDecodeURIComponent(str) {
    return str;
}





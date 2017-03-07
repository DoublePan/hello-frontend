var fileName='./webdata/poets.txt';
var fs=require("fs");
var qs=require('querystring');
var formidable=require('formidable');
var dpform=require('./dpform_buffer.js');
var PoetVO=require('./poetVO').PoetVO;
var rl=require('readline');
//var a=0;

module.exports = {
    listPoets: function(req, res) {
       listPoetsImpl(req, res);   	
    },
    addPoet: function(req,res) {
        //a++; a is a global varible shared by all require('fsPoet.js');
       
    	addPoetImpl(req,res);    	
    }
};



function addPoetImpl(req,res) {
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
        var incomingData=new dpform.IncomingData();
        incomingData.parse(req,function(fields,files) {
            console.log(fields);
            console.log(files);
            var poetVO=new PoetVO(fields.email,fields.poetSpecification);
            poetVO.insertRow(function(err,poetId) {
                console.log(poetId);
                if (files.imgfile && files.imgfile.origName!='') {
                    fs.rename(files.imgfile.path,incomingData.config.path+poetId.toString()+files.imgfile.extName);
                }
                
            });
            
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>' + 'Request Accepted!' + '</h1>');
        });


//-----------using formidable modual
/*
        var form=new formidable.IncomingForm();
        form.uploadDir='./webdata';
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

 

    }
}


function listPoetsImpl(req, res)  {
    if(!isFormData(req)) {
       
        var formData='';// if (err) throw err;
        req.on('data',function(chunk) {
            formData+=chunk;
        });
        req.on('end',function(err) {
            // if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
             
            formDataJSON=qs.parse(formData);         
            console.log(formDataJSON);
            var poetVO=new PoetVO(formDataJSON.email,"");
            poetVO.queryRows(function(err,rows) {
                //console.log(rows);
                var poetDetails={};
                for (var i = 0; i < rows.length; i++) {
                    //console.log(rows[i].poet_detail);
                    poetDetails[i]=rows[i].poet_detail;
                    //res.write('<h1>' + rows[i].poet_detail + '</h1>'); 
                }
            res.end(JSON.stringify(poetDetails));     
                
            });
        });    
    } else {
        //to do: if queryPoet form's enctype="multipart/form-data"
    }
}


//common functions---utils
function isFormData(req) {
    var type=req.headers['content-type']+'';
    return 0===type.indexOf('multipart/form-data');
}

function gbkDecodeURIComponent(str) {
    return str;
}





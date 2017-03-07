var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
//var fsPoet=require('./fsPoet.js'); 



var poetReqs=path.join('./webroot',"poetReqs.dat");

var config={
    port: 3000,
    ip: '127.0.0.1',
    mime: {
        html:"text/html",
        js: "text/javascript",
        css: "text/css",
        default: "application/octet-stream"
    }
}

var httpServer = http.createServer(processRequest);
httpServer.listen(3000);

console.log('Htpp server is listening at port 3000.');
//====================testing part===============start
//console.log(fsPoet.a+fsPoet.b);
//console.log(path.basename('/cpp/dfjl/a.b.js','.js').replace(/\..+$/,''));
//console.log(path.basename('/cpp/dfjl/a.b.js','.js').replace(/^.+\./,''));


//====================testing part===============

//NOT support GET yet
function processRequest(req, res) {
    //res.writeHead(200, { 'Content-Type': 'text/html' });   //no need: 200 is the default value
    //req.setEncoding('utf8');

    var hasExt = true;
    var reqUrl = req.url;
    // res.end('Hello World\n'+reqUrl); 
    var pathName = url.parse(reqUrl).pathname;

    if (path.extname(pathName) === '') {
        if (pathName.charAt(pathName.length - 1) != '/') {
            pathName += '/';
            var redirect = req.headers.host + pathName;
            res.writeHead(301, { location: redirect });
        }

        pathName += "index.html";
        hasExt=false;
    } else if (path.extname(pathName) === '.node') {
        var moduleName=path.basename(pathName,'.node').replace(/\..+$/,'');
        var nodeFun=path.basename(pathName,'.node').replace(/^.+\./,'');       
        var nodeModule=require('./'+moduleName+'.js'); 
        //try {
            nodeModule[nodeFun](req,res);
        //} catch (e) {
        //    console.log(e.message);
        //}
        
        return 0;
    }

    var filePath=path.join('./webroot',pathName);
    var contentType=getContentType(filePath);

    //console.log(filePath);
    fs.exists(filePath,function(exists){
        if(exists) {
            res.writeHead(200,{'Content-Type':contentType});
            var stream=fs.createReadStream(filePath,{flags:'r',encoding:null});
            stream.on("error",function(){
                res.writeHead(500,{'Content-Type':'text/html'});
                res.end('<h1>500 Server Error</h1>');
            });   
            stream.pipe(res);
        } else {
            res.writeHead(404,{'Content-Type':'text/html'});
            res.end('<h1>404 Not Found</h1>');
 
        }
        
    });

}


function getContentType(filePath) {
    var mimes=config.mime;
    var ext=path.extname(filePath).substr(1);
    if (mimes.hasOwnProperty(ext)) {
        return mimes[ext];
    } else {
        return mimes.default;
    }
}






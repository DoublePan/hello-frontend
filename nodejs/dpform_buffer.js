/*
issule list
1. performance issue：  cause=appendFileSync; solution=writeStream.write;
2. blocking reqs when writing stream: cause=request in flowing mode; solution=change request to paused mode;
3. multipart parsing : delete the \r\n in the end of value added by http; solution=write the value in next parse.
*/
//---module/shared variable---
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var fileConfig = { path: './webdata/' }; //attribute:value

//RE part:js不支持?<=   (?<=\bname=").*?(?=")   
var nameRE = /".*?"/g;   //"lkjdlkaj"
var extRE=/\..*$/;                //".txt"




exports.IncomingData=FormData;
//---FormData Class---
function FormData() {
    EventEmitter.call(this);
    this.boundary = null;
    this.boudaryRE = null;
    this.endBoudaryRE = null;
    this.boundaryType = 0; // 0_start 1_metadata_boundary 2_value_boundary
    this.dataType = 0; //0_null 1_field_value; 2_file_value;
    this.preTbpChunk = null; //previous to be parsed chunk
    this.ewm = 0; //to be evaluated water mark: the positioin of byte to be evaluated
    this.lwm = 0; //low water mark: the low positioin of byte to  to be parsed
    this.hwm = 0; //high water mark: the high positioin of byte to be parsed

    this.config=fileConfig;
    this.fields = { currentField: '' }; //name:value
    this.files = {
        currentFile: '',
 /*    imgfile: {origName:'',
                 newName:'',
                 path:'' //full path of created file
       }*/
    };
}
util.inherits(FormData, EventEmitter);
FormData.prototype.parse = function(req, cb) {
    var formData=this;
    formData.boundary = '--' + getBoundary(req);
    formData.boudaryRE = new RegExp('^' + formData.boundary + '$', 'm');
    formData.endBoudaryRE = new RegExp('^' + formData.boundary + '--' + '$', 'm');
    formData.on('partData', function(chunk, formData) { 
        segmentFormData(chunk, formData);
        req.resume();
    });
    
    //console.log(boundary);
    req.on('data', function(chunk) {
        req.pause();
        formData.emit('partData', chunk, formData);
        //segmentFormData(chunk,formData);
        //console.log('rl line event:');
        //console.log(formData);
    });
    req.on('end', function() {
        cb(formData.fields, formData.files);
    });
};

//---segment form data by /r/n---
function segmentFormData(chunk, formData) {
    //console.log(chunk.length);
    formData.ewm = formData.lwm = formData.hwm = 0;
    var parseFlag = 0;
    while (formData.ewm < chunk.length) {

        var i = chunk.readUInt8(formData.ewm);
        if (i == 13 && (formData.ewm + 1) < chunk.length) { // \r\n in windows "\r==13 \n==10" 
            i = chunk.readUInt8(++formData.ewm);
            if (i == 10) { // \r\n in windows
                formData.hwm = formData.ewm + 1; //buffer.slice[start,end) not inclusive
                ++formData.ewm;
                parseFlag = 1;

            } else { // \r in linux
                formData.hwm = formData.ewm; //key line for this function
                parseFlag = 1;
            }
        } else if (i == 10 || i == 13) { // \r in mac \n in linux
            formData.hwm = formData.ewm + 1;
            ++formData.ewm;
            parseFlag = 1;

        } else { // not \r or \n
            formData.hwm = formData.ewm + 1;
            ++formData.ewm;
        }

        if (parseFlag == 1 || formData.ewm == chunk.length) {
            parseFlag = 0;
            //to do: if metadata part or value part is distributed in multiple chunks?
            //buffer.slice[start,end)not inclusive
            var tbpChunk = chunk.slice(formData.lwm, formData.hwm);
            formData.lwm = formData.hwm;
            //console.log(tbpChunk);
            parseFormData(tbpChunk, formData);
            //console.log(formData);
        }
    }
}

//---parse segmented form data---
function parseFormData(tbpChunk, formData) {
    //console.log("Length of tbpChunk: "+tbpChunk.length);
    var tbpString = '';
    //console.log(formData.boundary.length+4);  //chrome 44
    //console.log(tbpChunk.length);
    if (tbpChunk.length <= 100) { //tbpChunk.length<=100
        //=flaging chunk=
        tbpString = tbpChunk.toString('utf8');
        if (formData.boudaryRE.test(tbpString)) {
            deleteRN();
            formData.boundaryType = 1;
            return;
        }

        if ((tbpString === '\r\n' || tbpString === '\r' || tbpString === '\n') && formData.boundaryType === 1) { //EOL can't be file value
            formData.boundaryType = 2;
            return;
        }
        if (formData.endBoudaryRE.test(tbpString)) {
            deleteRN();
            formData.boundaryType = 9;
            return;
        }
    }


    //=parsing data=
    //==metadata part parsing:using tbpString==
    if (formData.boundaryType == 1) {
        var nameArray = tbpString.match(nameRE);
        if (nameArray !== null) {
            for (var i = 0; i < nameArray.length; i++) {
                nameArray[i] = nameArray[i].replace(/"/g, '');
            }


            if (nameArray.length === 1) { //field name
                formData.dataType = 1;
                formData.fields[nameArray[0]] = '';
                formData.fields.currentField = nameArray[0];

            } else if (nameArray.length === 2) { //file name 
                var fileName=nameArray[0];   //html file element name
                var fileOrigName=   nameArray[1];         //uploaded file name
                var extNames=fileOrigName.match(extRE)||"";
                formData.dataType = 2;
                formData.files[fileName] = {};
                formData.files[fileName].origName = fileOrigName;
                formData.files[fileName].extName=extNames[0];
                formData.files[fileName].newName = 'dp' + fileOrigName;
                formData.files[fileName].path=formData.config.path + 'dp' + fileOrigName;
                formData.files[fileName].writeStream = fs.createWriteStream(formData.files[fileName].path);
                formData.files.currentFile = fileName;
                //console.log(formData.files);

            }
        }
    }
    //==value parsing==
    //===field value part parsing:using tbpString===
    if (formData.boundaryType == 2 && formData.dataType == 1) {
        formData.fields[formData.fields.currentField] += tbpString;
    }
    //===file value part parsing:using tbpChunk===
    if (formData.preTbpChunk !== null) {
        //console.log(formData.preTbpChunk);
        //fs.appendFileSync(formData.config.path+formData.files[formData.files.currentFile].newName,formData.preTbpChunk);  
        formData.files[formData.files.currentFile].writeStream.write(formData.preTbpChunk);
        formData.preTbpChunk = null;
    }
    if (formData.boundaryType == 2 && formData.dataType == 2) {
        //must use sync version
        //fs.appendFileSync(formData.config.path+formData.files[formData.files.currentFile].newName,tbpChunk);
        formData.preTbpChunk = tbpChunk;
    }

    function deleteRN() {
        if (formData.boundaryType == 2 && formData.dataType == 1) { //remove the field value's last \r&\n when the parse of field value is done.
            formData.fields[formData.fields.currentField] = formData.fields[formData.fields.currentField].replace(/\r\n$|\r$|\n$/, '');
        } else if (formData.boundaryType == 2 && formData.dataType == 2) { //remove the file value's last \r&\n when the parse of file value is done.
            //to do: not work
            //fs.appendFileSync(formData.config.path+formData.files[formData.files.currentFile].newName,'\b');  
            var preTbpChunk = formData.preTbpChunk;
            if (preTbpChunk !== null) {
                var i = preTbpChunk.readUInt8(preTbpChunk.length - 1);
                if (i == 10) {
                    preTbpChunk = preTbpChunk.slice(0, preTbpChunk.length - 1);
                    i = preTbpChunk.readUInt8(preTbpChunk.length - 1);
                    if (i == 13) {
                        preTbpChunk = preTbpChunk.slice(0, preTbpChunk.length - 1);
                    }
                }
                //console.log(preTbpChunk);
                //fs.appendFileSync(formData.config.path+formData.files[formData.files.currentFile].newName,preTbpChunk);  
                formData.files[formData.files.currentFile].writeStream.write(preTbpChunk);
                formData.preTbpChunk = null;
            }
        }
    }

}


//---common utilities---
//------get boudary from request header------
function getBoundary(req) {
    var type = req.headers['content-type'] + '';
    return type.replace(/^.*boundary=/, '');
}

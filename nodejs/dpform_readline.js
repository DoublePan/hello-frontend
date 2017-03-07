//--------------module/shared variable
var readline = require('readline');
var fs = require('fs');
var os=require('os');
var fileConfig={path:'./webdata/'};  //attribute:value

//RE part:js不支持?<=   (?<=\bname=").*?(?=")   
var nameRE=/".*?"/g;


module.exports ={
  IncomingData: function() {
    //to do: can the Function.call be used
    var formData=new FormDataClass(); 
    this.fileConfig=formData.files.config;
    this.parse=function(req,cb) {
      var boundary='--'+getBoundary(req);
      //console.log(boundary);
      var rl=readline.createInterface({
        input: req,
        output: null,
        completer: null,
        terminal: false
      });
      rl.on('line',function(line) {
        formLineParse(line,formData,boundary);
        //console.log('rl line event:');
        //console.log(formData);
      });
      rl.on('close',function() {

        cb(formData.fields,formData.files);
      });
    };
  },
};



//FormData Class
function FormDataClass(){
  this.boundaryType=0; // 0_start 1_boundary 2_empty_line  5_file_lines   9_end
  this.dataType=0;    // 1_field; 2_file;
  this.fields={currentField: ''}; //name:value
  this.files={currentFile: '',
    config:fileConfig
/*    imgfile: {origName:'',
        newName:''
    }*/
  };
}



//common functions---utils
function formLineParse(line,formData,boundary)  {
  if (line==boundary) {
    formData.boundaryType=1;
    return;
  }
  if (line==='' && formData.boundaryType===1) { //EOL must not in file content
    formData.boundaryType=2;
    return;
  }
  if (line===boundary+'--') {
    formData.boundaryType=9;
    return;
  }

  //name part parse
  if(formData.boundaryType==1) {
    var nameArray=line.match(nameRE);
    if(nameArray!==null) {
    for (var i = 0; i < nameArray.length; i++) {
        nameArray[i]=nameArray[i].replace(/"/g,'');
    }

      //field name
      if (nameArray.length===1) {
        formData.dataType=1;
        formData.fields[nameArray[0]]='';
        formData.fields.currentField=nameArray[0];

      //file name        
      } else if (nameArray.length===2) {
        formData.dataType=2;
        formData.files[nameArray[0]]={};
        formData.files[nameArray[0]].origName=nameArray[1];
        //to do: newName must be unique because the use of appendFile
        formData.files[nameArray[0]].newName=(new Date()).getSeconds()+nameArray[1];
        formData.files.currentFile=nameArray[0];
        //console.log(formData.files);

      }
    }
  }

  //field value part parse
  if(formData.boundaryType==2&&formData.dataType==1) {
    if (formData.fields[formData.fields.currentField]==='') {
      formData.fields[formData.fields.currentField]=line;
    } else {
      formData.fields[formData.fields.currentField]+=(os.EOL+line);
    }
    //console.log(formData.fields);
  }
  //file content part parse
  if(formData.boundaryType==2&&formData.dataType==2) {
    //to do :  os.EOL;  if EOL is in file content; the order is not right
    fs.appendFileSync(formData.files.config.path+formData.files[formData.files.currentFile].newName,line+os.EOL);
    //console.log('========read file line======');
    //console.log(line);
  }

}



function getJsonLength(jsonData){
  var jsonLength = 0;

  for(var item in jsonData){
    jsonLength++;
  }

  return jsonLength;

}


function getBoundary(req) {
    var type=req.headers['content-type']+'';
    return type.replace(/^.*boundary=/,'');
}
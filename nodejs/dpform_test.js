//--------------module/shared variable
var readline = require('readline');
var fs = require('fs');
var os=require('os');
var fileConfig={path:'./webdata/'};  //attribute:value
var fileKey=0;

//RE part:js不支持?<=   (?<=\bname=").*?(?=")   
var nameRE=/".*?"/g;


//FormData Class
function FormData(){
	this.boundaryType=0; // 0_start 1_boundary 2_empty_line  5_file_lines 	9_end
  this.dataType=0;    // 1_field; 2_file;
  this.fields={currentField: ''}; //name:value
  this.files={currentFile: '',
    config:fileConfig
/*    imgfile: {origName:'',
        newName:''
    }*/
  };
}


/*  testing call and __proto__
function FormDataChild() {
  FormData.call(this);
  this.__proto__=new FormData();
}


var formDataChild=new FormDataChild();
console.log(formDataChild.fields);
*/


//--------------separate variable for each request
var boundary='------WebKitFormBoundarybCjBdeikL0t5kbTy';
var formData=new FormData();
console.log(formData);
var rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/dongxue/Desktop/CPP/字符集测试.txt'),
  output: null,
  completer: null,
  terminal: false
});

rl.on('line', function(line)  {
  if (line==boundary) {
  	formData.boundaryType=1;
  	return;
  }
  if (line==='') {
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
        formData.files[nameArray[0]].newName=nameArray[1];
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
    //to do :  os.EOL
    fs.appendFile(formData.files.config.path+formData.files[formData.files.currentFile].newName,line+os.EOL);
  }

});

rl.on('close',function(){
  console.log(formData);
})



//common function---util
function getJsonLength(jsonData){
  var jsonLength = 0;

  for(var item in jsonData){
    jsonLength++;
  }

  return jsonLength;

}
//--------------module/shared variable
var fs = require('fs');
var os=require('os');
var fileConfig={path:'./webdata/'};  //attribute:value
var fileKey=0;

//RE part:js不支持?<=   (?<=\bname=").*?(?=")   
var nameRE=/".*?"/g;


//FormData Class
function FormDataClass(){
  this.boundaryType=0; // 0_start 1_metadata_boundary 2_value_boundary
  this.dataType=0;    //0_other_part 1_field_value; 2_file_value;
  this.ewm=0; //evaluated water mark: the positioin of byte to be evaluated
  this.lwm=0; //low water mark: the low positioin of byte to  to be parsed
  this.hwm=0; //high water mark: the high positioin of byte to be parsed

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
var boudaryRE=new RegExp('^'+boundary+'$','m'); 
var endBoudaryRE=new RegExp('^'+boundary+'--'+'$','m'); 

var formData=new FormDataClass();
var readStream = fs.createReadStream('C:/Users/dongxue/Desktop/CPP/字符集测试.txt');
var writeStream=fs.createWriteStream('./webdata/abcd',{flags:'a'});


//readStream.setEncoding('utf8');   data event's paramenter 'chunk': String|Buffer 

// abc/r/n
// cdb/r/n
// /r/n
readStream.on('data', function(chunk)  {
  console.log(chunk.length);
  formData.ewm=formData.lwm=formData.hwm=0;
  var parseFlag=0;
  while (formData.ewm<chunk.length) {	
    
    var i=chunk.readUInt8(formData.ewm); 
  	if (i==13 && (formData.ewm+1)<chunk.length) {// \r\n in windows "\r==13 \n==10" 
  		i=chunk.readUInt8(++formData.ewm);
  		if (i==10) {// \r\n in windows
  			formData.hwm=formData.ewm+1;   //buffer.slice[start,end) not inclusive
  			++formData.ewm;
        parseFlag=1;      

  		} else {// \r in linux
  			formData.hwm=formData.ewm;   //key line for this function
        parseFlag=1;
  		}
  	} else if(i==10 || i==13) { // \r in mac or \n in linux
  		formData.hwm=formData.ewm+1;
  		++formData.ewm;
      parseFlag=1;

  	} else { // not \r or \n
      formData.hwm=formData.ewm+1;
      ++formData.ewm;
    }

    if (parseFlag==1 || formData.ewm==chunk.length) {
      parseFlag=0;
      //to do: if metadata part or value part is distributed in multiple chunks?
      //buffer.slice[start,end)not inclusive
      var tbpChunk=chunk.slice(formData.lwm,formData.hwm);
      console.log(tbpChunk);
      formData.lwm=formData.hwm;
      parseFormData(tbpChunk);
    }
    
    
  }
  formData.ewm=0;
  console.log(formData);  // need to rm the last \r\n
});


//common function---util
function parseFormData(tbpChunk)  { //to be parsed chunk
  //fs.appendFileSync(formData.files.config.path+'aaa',tbpChunk);  
  writeStream.write(tbpChunk);
}


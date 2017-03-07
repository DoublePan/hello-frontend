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
var readStream = fs.createReadStream('C:/Users/dongxue/Desktop/CPP/test_rn.txt');



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
  tbpString=tbpChunk.toString('utf8');

  //=flaging chunk=
  if (boudaryRE.test(tbpString)) {
    if (formData.boundaryType==2&&formData.dataType==1) {//remove the field value's last \r&\n when the parse of field value is done.
      formData.fields[formData.fields.currentField]=formData.fields[formData.fields.currentField].replace(/\r\n$|\r$|\n$/,'');
    }

    formData.boundaryType=1;
    

    return;
  }

  if ((tbpString==='\r\n' || tbpString==='\r' || tbpString==='\n')&& formData.boundaryType===1) { //EOL can't be in file value
    formData.boundaryType=2;
    return;
  }
  if (endBoudaryRE.test(tbpString)) {
    formData.boundaryType=9;
    return;
  }  
    
  //=data parsing=
  //==metadata part parsing:using tbpString==
  if(formData.boundaryType==1) {
    var nameArray=tbpString.match(nameRE);
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
  //==value parsing==
  //===field value part parsing:using tbpString===
  if(formData.boundaryType==2&&formData.dataType==1) {
    formData.fields[formData.fields.currentField]+=tbpString;
  }
  //===file value part parse:using tbpChunk===
  if(formData.boundaryType==2&&formData.dataType==2) {
    //to do:  os.EOL
    fs.appendFile(formData.files.config.path+formData.files[formData.files.currentFile].newName,tbpChunk);
  }

  
 /*
  //=slicing \r \n:  bad idea=
    if (formData.boundaryType!=2 && tbpChunk.length>=1) {// slice /r /n
    var i=tbpChunk.readUInt8(tbpChunk.length-1);
    if (i==10 || i==13) {
      tbpChunk=tbpChunk.slice(0,tbpChunk.length-1)
    };
    
    if (tbpChunk.length>=1) {
      i=tbpChunk.readUInt8(tbpChunk.length-1);
      if (i==13) { // slice \r for windows
        tbpChunk=tbpChunk.slice(0,tbpChunk.length-1);
      };
    };

    tbpString=tbpChunk.toString();
    console.log(formData.boundaryType+'  '+tbpString);
    if (tbpString==boundary) {
      formData.boundaryType=1;
      return;
    }
    if (tbpString=='') {
      formData.boundaryType=2;
      return;
    }
    if (tbpString===boundary+'--') {
      formData.boundaryType=9;
      return;
    }    
  } else if (formData.boundaryType==2 && formData.dataType==1) {// in field value part

  } else if (formData.boundaryType==2 && formData.dataType==2) {// in file value part

  }
*/


}


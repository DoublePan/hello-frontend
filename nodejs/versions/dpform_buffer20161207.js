//--------------module/shared variable
var fs = require('fs');
var fileConfig={path:'./webdata/'};  //attribute:value

//RE part:js不支持?<=   (?<=\bname=").*?(?=")   
var nameRE=/".*?"/g;


module.exports ={
  IncomingData: function() {
    var formData=new FormDataClass(); 
    this.fileConfig=formData.files.config;
    this.parse=function(req,cb) {
      formData.boundary='--'+getBoundary(req);
      formData.boudaryRE=new RegExp('^'+formData.boundary+'$','m'); 
      formData.endBoudaryRE=new RegExp('^'+formData.boundary+'--'+'$','m');   
      //console.log(boundary);
      req.on('data',function(chunk) {
        segmentFormData(chunk,formData);
        //console.log('rl line event:');
        //console.log(formData);
      });
      req.on('end',function() {
        cb(formData.fields,formData.files);
      });
    };
  },
};



//FormData Class
function FormDataClass(){
  this.boundary=null;
  this.boudaryRE=null;
  this.endBoudaryRE=null;
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


//segment form data by /r /n
function segmentFormData(chunk,formData) {
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
        i=chunk.readUInt8(--formData.ewm);
      }
    } else if(i==10 || i==13) { // \r in mac \n in linux
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
      formData.lwm=formData.hwm;
      parseFormData(tbpChunk,formData);
      //console.log(formData);
    }   
  }
}

//parse segmented form data
function parseFormData(tbpChunk,formData)  {
  console.log("Length of tbpChunk: "+tbpChunk.length);
  var tbpString='';
  if(tbpChunk.length<100) {
    //=flaging chunk=
    tbpString=tbpChunk.toString('utf8');  
    if (formData.boudaryRE.test(tbpString)) {
      deleteRN(); 
      formData.boundaryType=1;
      return;
    }

    if ((tbpString==='\r\n' || tbpString==='\r' || tbpString==='\n')&& formData.boundaryType===1) { //EOL can't be in file value
      formData.boundaryType=2;
      return;
    }
    if (formData.endBoudaryRE.test(tbpString)) {
      deleteRN();
      formData.boundaryType=9;
      return;
    }  
  }

    
  //=parsing data=
  //==metadata part parsing:using tbpString==
  if(formData.boundaryType==1) {
    var nameArray=tbpString.match(nameRE);
    if(nameArray!==null) {
    for (var i = 0; i < nameArray.length; i++) {
        nameArray[i]=nameArray[i].replace(/"/g,'');
    }

      
      if (nameArray.length===1) {//field name
        formData.dataType=1;
        formData.fields[nameArray[0]]='';
        formData.fields.currentField=nameArray[0];
             
      } else if (nameArray.length===2) {//file name 
        formData.dataType=2;
        formData.files[nameArray[0]]={};
        formData.files[nameArray[0]].origName=nameArray[1];
        formData.files[nameArray[0]].newName='dp'+nameArray[1];
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
    //must use sync version
    fs.appendFileSync(formData.files.config.path+formData.files[formData.files.currentFile].newName,tbpChunk);
  }

  function deleteRN() {
    if (formData.boundaryType==2&&formData.dataType==1) {//remove the field value's last \r&\n when the parse of field value is done.
      formData.fields[formData.fields.currentField]=formData.fields[formData.fields.currentField].replace(/\r\n$|\r$|\n$/,'');
    } else if (formData.boundaryType==2&&formData.dataType==2) {//remove the file value's last \r&\n when the parse of file value is done.
      //to do: not work
      fs.appendFileSync(formData.files.config.path+formData.files[formData.files.currentFile].newName,'\b');  
    }
  }
  
}


function getBoundary(req) {
    var type=req.headers['content-type']+'';
    return type.replace(/^.*boundary=/,'');
}
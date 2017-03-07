window.onload=function() {
	$("input").val("cpp");
	$("#accordion").Accordion();
};

//--cpp version of DpQuery (write less do more) & UI
//----直接return时，无cppName属性
//----去掉return时，有cppName属性，但又无ATTRIBUTE_NODE属性
function $(selector) {
	return new DpQuery(selector);
}

var DpQuery=function(selector) {
//	this[0]=
//	this.length = 0;
	var elems=document.querySelectorAll(selector);
    for (var i = 0; i < elems.length; i++) {
    	this[i]=elems[i];
    	this.length++;
    }

    return  this;
};
//--static methods/attributes
DpQuery.version="0.0.1";
//--methods/attributes of $ instance
DpQuery.prototype.length=0;

DpQuery.prototype.each=function(cb,para) {
	//console.log(this);
//using DpQuery instance as this for static method of DpQuery.each
	DpQuery.each.call(this,cb,para);
};
// static method of static DpQuery
DpQuery.each=function(cb,para)  {
	//console.log(this);
	for (var i = 0; i < this.length; i++) {
    	cb(this[i],para);
    }
};

DpQuery.prototype.val=function(para) {
	this.each(function(elem,para){
		elem.value=para;
	},para);
};

DpQuery.prototype.Accordion=function() {
	arguments.callee.dpQuery=this;
	//select the content specified by parameter(minus means do not select any one); 
	arguments.callee.selectOne=function(indexOfElem) {
		this.dpQuery.each(function(elem) {
			var h3Elems=elem.querySelectorAll("h3");
			DpQuery.each.call(h3Elems,function(h3Elem){
				h3Elem.className="acc-unselect";
				
			});
			var divElems=elem.querySelectorAll("div");
			DpQuery.each.call(divElems,function(divElem){
				divElem.className="acc-unselect";
			});
			if (indexOfElem>=0) {
				h3Elems[indexOfElem].className="acc-select";
				divElems[indexOfElem].className="acc-select";
			}
			
		});	
	};
	arguments.callee.selectOne(0);
	this.each(function(elem) {
		var h3Elems=elem.querySelectorAll("h3");
		DpQuery.each.call(h3Elems,function(h3Elem){
			h3Elem.onclick=function(event) {
				var targetElem=event.target;
				$("#"+targetElem.parentElement.id).Accordion().selectOne(-1);
				targetElem.className="acc-select";
				targetElem.nextElementSibling.className="acc-select";				
			};			
		});
	});
	return arguments.callee;
	
};
window.onload=function() {
	$("#query-btn")[0].onclick=getPoets;
	//$("#queryForm")[0].onsubmit=function(){event.preventDefault()};
	//$("input").val("cpp");
	$("#accordion1").Accordion();
};
function getPoets() {
	var poetsAJAX=new XMLHttpRequest();
		poetDetails={};
	poetsAJAX.onreadystatechange=function() {
		if (poetsAJAX.readyState===4) {
			poetDetails=JSON.parse(poetsAJAX.responseText);
			console.log(poetDetails);
			for(var poetDetail in poetDetails) {
				console.log(poetDetails[poetDetail]);
				var h3Elem=document.createElement("h3");
				   divElem=	document.createElement("div");
				   p1Elem=	document.createElement("p");   //poet request by Irene
				   hrElem=	document.createElement("hr");
				   p2Elem=	document.createElement("p");   //poet write by Irene

				h3Elem. textContent=  $("input").val()+">>>"+poetDetail;
				divElem.appendChild(p1Elem);
				divElem.appendChild(hrElem);
				divElem.appendChild(p2Elem);
				p1Elem.textContent=poetDetails[poetDetail];
				$("#accordion")[0].appendChild(h3Elem);
				$("#accordion")[0].appendChild(divElem);
			}
			$("#accordion").Accordion();
			
		} else {
			console.log(poetsAJAX.readyState);
		}
	};
	poetsAJAX.open("post","./fsPoet.listPoets.node");
	//poetsAJAX.responseType="json";
	poetsAJAX.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	poetsAJAX.send(encodeURI("email="+$("input").val()));
	console.log(poetsAJAX);
}


//--cpp version of DpQuery (write less do more) & UI
//----直接return时，无cppName属性
//----去掉return时，有cppName属性，但又无ATTRIBUTE_NODE属性
function $(selector) {
	return new DpQuery(selector);
}

var DpQuery=function(selector) {
//	this[0]=
//	this.length = 0;
//to do: querySelector is more practical than querySelectorAll
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
	if (para) {
		this.each(function(elem,para){
			elem.value=para;
		},para);
	} else {
		return this[0].value;
	}
	
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
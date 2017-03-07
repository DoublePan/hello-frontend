window.onload=function() {
	$("#query-btn")[0].onclick=getPoets;
};

function getPoets() {
	//recreate accordion div first
	$("body")[0].removeChild($("#accordion")[0]);
	var accordionElem=document.createElement("div");
	accordionElem.id="accordion";
	accordionElem.className="accordion";
	$("body")[0].appendChild(accordionElem);

	var poetsAJAX=new XMLHttpRequest();
		poetDetails={};
	if (!validateEmail($("input")[0])) {
		return;
	}	
	poetsAJAX.onreadystatechange=function() {
		if (poetsAJAX.readyState===4) {
			poetDetails=JSON.parse(poetsAJAX.responseText);
			if(DpQuery.isEmpty(poetDetails)) {
				var pElem=document.createElement("p");
				pElem.textContent="No Results found";
				$("#accordion")[0].appendChild(pElem);
			}	else {
				for(var poetDetail in poetDetails) {
				console.log(poetDetails[poetDetail]);
				var h3Elem=document.createElement("h3");
				   divElem=	document.createElement("div");
				   p1Elem=	document.createElement("p");   //poet request by Irene
				   hrElem=	document.createElement("hr");
				   p2Elem=	document.createElement("p");   //poet write by Irene
				h3Elem.textContent=  $("input").val()+">>>"+poetDetail;
				divElem.appendChild(p1Elem);
				divElem.appendChild(hrElem);
				divElem.appendChild(p2Elem);
				p1Elem.textContent=poetDetails[poetDetail];
				$("#accordion")[0].appendChild(h3Elem);
				$("#accordion")[0].appendChild(divElem);
			}
			$("#accordion").Accordion();
			}		
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


function validateEmail(targetNode) {
	var emailReg = /.+@.+\..+/;
    var targetValue = targetNode.value;
    var targetTip = targetNode.nextElementSibling;
    if (targetNode.name == "email") {
        if (!emailReg.test(targetValue)) {
            targetNode.style.border = "1px solid red";
            targetTip.textContent = "Invalid email format";
            targetTip.style.color = "red";
            return false;
        } else {
            targetNode.style.border = "1px solid green";
            targetTip.textContent = "Validated successfullly";
            targetTip.style.color = "green";
            return true;
        }
    }
}


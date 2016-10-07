var regCity=/^[a-zA-Z\u4e00-\u9fa5]+$/;
var regInt=/^[1-9][0-9]*$/;
var citySet=new Set();
function addBtnHandle() {
	var city=trim(document.getElementById('aqi-city').value);
	if (!regCity.test(city)) {
		alert("城市名仅允许字母和汉字！");
	}

	var indice=trim(document.getElementById('aqi-indice').value);
	if (!regInt.test(indice)) {
		alert("空气质量仅允许输入整数！");
	}

	createTr(city,indice);
	
}

function createTr(datCity,datIndice) {
	var aqiTable=document.getElementById("aqi-table");
	var tr=document.createElement("tr");
	var tdCity=document.createElement("td");
	var tdIndice=document.createElement("td");
	var tdDelete=document.createElement("td");
	var delBtn=document.createElement("button"); 

	delBtn.innerHTML="删除";
	delBtn.addEventListener("click",deleteTr);
	tdCity.innerHTML=datCity;
	tdIndice.innerHTML=datIndice;
	tdDelete.appendChild(delBtn);
	tr.appendChild(tdCity);
	tr.appendChild(tdIndice);
	tr.appendChild(tdDelete);


// city duplication is not allowed
	var orgSize=citySet.size;
	citySet.add(datCity);
	console.log(citySet.size);
	if(orgSize!=citySet.size) {
		aqiTable.appendChild(tr);
	} else {
		alert("same city is added");
	}


}

function deleteTr() {
	var parentTr=this.parentNode.parentNode;
	citySet.delete(parentTr.firstChild.textContent);

	var parentTable=this.parentNode.parentNode.parentNode //this button->td->tr->table
	parentTable.removeChild(this.parentNode.parentNode);
}


function trim(str) {
	return str.replace(/^\s+/,"").replace(/\s+$/,"");
    

}

function init() {
	document.getElementById("add-btn").addEventListener("click",addBtnHandle);
	// document.getElementById("aqi-city").addEventListener("click",init);
	// console.log(regCity.test("八婆"));

}

init();
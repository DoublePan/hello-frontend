/**
 *function test()
 *
 */

function adjustBox() {
	
//add  multiple boxes	
	var boxesDiv=document.getElementById("boxes-div");
	//get all texts in textarea delimited by space
	var texts=document.getElementById("input-text").value;
	var textArray=[];
	var regText=/\b\w+\b/g; //g is must
	var result=[];
 	while ( (result=regText.exec(texts)) !=null ) {
 	 	textArray.unshift(result[0]);
 	}
 	console.log(textArray)

 	for (var i=0; i<textArray.length;i++) {

		var newBox=document.createElement("div");
		newBox.className="box";

		newBox.innerHTML=textArray[i];
		switch(this.id) {
			case "leftin-btn":
				boxesDiv.insertBefore(newBox,boxesDiv.firstChild);
				break;

			case "rightin-btn":
				boxesDiv.appendChild(newBox);
				break;

			default:
				break;
		}

	}


//delete one box	
	switch(this.id) {
		case "leftout-btn":
			boxesDiv.removeChild(boxesDiv.firstChild);
			break;

		case "rightout-btn":
			boxesDiv.removeChild(boxesDiv.lastChild);
			break;
		
		default:
			break;
	}

//search boxes and label them
	if (this.id=="search-btn") {
		var searchPattern=document.getElementById("search-input").value;
		var regSearch=new RegExp(searchPattern,"");
		console.log(regSearch);

		var boxes=document.getElementById("boxes-div").getElementsByClassName("box");
		for (var i=0; i<boxes.length; i++) {
			if (regSearch.test(boxes[i].innerHTML)) {
				boxes[i].style.color="blue";
			}
		}
	}
}



 /**
 *function init()
 *
 */

function init() {
	var inputBtns=document.getElementsByTagName("input");
	for (var i=0;i<inputBtns.length;i++) {
		inputBtns[i].addEventListener("click",adjustBox);
	}
	// test();
}


init();


 /**
 *function test()
 *
 */

 function test() {
 	var regText=/\b\w+\b/g;
 	var texts="abc def  	zxc";
 	var result=[];
 	while ( (result=regText.exec(texts)) !=null ) {
// (result=regText.exec(texts)) !=null
 	 	console.log(result[0]);
 	 	console.log(regText.lastIndex);
 	}
 }
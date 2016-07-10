/**
 *function test()
 *
 */

function adjustBox() {
	
	
	var newBox=document.createElement("div");
	newBox.className="box";
	console.log(newBox);


	console.log(this.id);
	var boxesDiv=document.getElementById("boxes-div");
	var num=document.getElementById("num-input").value;
	if (num!="") {
		newBox.innerHTML=num;
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
}


init();


 /**
 *function test()
 *
 add:
	 insertBefore firstChild
	 appendChild
delete:
	removeChild
 */
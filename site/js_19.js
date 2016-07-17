/**
 *Array numArray used to store height of all boxes
 *
 */
var numArray=new Array();




/**
 *function adjustBox()
 *
 */

function adjustBox() {
	
	
	var newBox=document.createElement("div");
	newBox.className="box";
	// console.log(newBox);


	// console.log(this.id);
	var boxesDiv=document.getElementById("boxes-div");
	var num=document.getElementById("num-input").value;
	if (num!="") {
		  // newBox.innerHTML=num;
		newBox.style.height=num+"px";
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
	if(this.id=="random-btn") {
		var i=88;
		boxesDiv.innerHTML="";
		while (i--) {
			var newBox=document.createElement("div");
			newBox.className="box";
			newBox.style.height=(Math.random()+0.3)*100+"px";
			boxesDiv.appendChild(newBox);
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
	document.getElementById("sort-btn").addEventListener("click",sortBox);
}


init();





/**
 *function sortBox()
 *visual lize the sorting algorithm
 */
 

function sortBox() {
    numArray=[];
        
    console.log(boxes.length);
    for (var i=0; i<boxes.length;i++ )	{
   		numArray[i]=parseFloat(boxes[i].style.height.replace("px",""));				
    }
    console.log(mergeSort(numArray));
}



/**
 *function mergeSort(a)
 *divide phase: a is the array to be sorted
 */

function mergeSort(a) {
	var len=a.length;
 	if (len==1) return a;
 	var middle=Math.floor((len-1)/2)
 	//divede a to two array
 	//3: 0-1 2
 	//4: 0-1 2-3
 	//5: 0-2 3-4
 	var b=new Array();
 	var c=new Array();
 	for (var i=0; i<len; i++) {
 		if (i<=middle)
 			b[i]=a[i];
 		else
 			c[i-middle-1]=a[i];
 	}
 	//sort b and c
 	b=mergeSort(b);
 	c=mergeSort(c);
 	a=sortTwoSortedArray(b,c);
 	//console.log(a);
 	return a;
}

/**
 *
 *function sortTwoSortedArray(b,c)
 *
 */

 function sortTwoSortedArray(b,c) {
 	
 	var bLen=b.length;
 	var cLen=c.length;
 	var a=new Array();
 	var aIndex=0;
 	var bIndex=0;
 	var cIndex=0;
 	//if b  reaches the end, how to compare??
 	while (bLen!=0 || cLen!=0) {
 		if (cLen==0) {
 			a[aIndex]=b[bIndex];
 			visualSort(a[aIndex]);

 			aIndex++;
 			bIndex++;
 			bLen--;
 			
 		} else if (b[bIndex]<c[cIndex]) {
 			a[aIndex]=b[bIndex];
 			visualSort(a[aIndex]);

 			aIndex++;
 			bIndex++;
 			bLen--;
 		} else {
 			a[aIndex]=c[cIndex];
 			visualSort(a[aIndex]);

 			aIndex++;
 			cIndex++;
 			cLen--;
 		}

 		
 		
 	}

 	return a;
 }

/**
 *
 *function sortTwoSortedArray(b,c)
 *
 */
var boxes=document.getElementById("boxes-div").getElementsByClassName("box");
var boxLen=boxes.length;
var boxMiddle=Math.floor((boxLen-1)/2)
var boxIndex=0;
var boxCount=0; //boxCount<=N*logN

 function visualSort(heightofBox) {
 //to do: how to set boxIndex according boxCount
 //setTimeout的异步机制，从而会呈现高度同时在变的效果
 	boxes[boxIndex].style.height=heightofBox;
 }




 /**
 *function test()
 *
 add:
	 insertBefore firstChild
	 appendChild
delete:
	removeChild
 */
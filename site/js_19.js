/**
 *Array numArray used to store height of all boxes
 *
 *global variable should be re-initiated when sort is called
 */
var numArray=new Array();

/**
 *variables for visual sorts
 */
var boxes=document.getElementById("boxes-div").getElementsByClassName("box");
var boxLen=boxes.length;
var boxMiddle=Math.floor((boxLen-1)/2);
var boxIndex=0;
var boxCount=0; //key variable for visual sort
var zeroFlag=-1;
var oneFlag=-1;
var twoFlag=-1;



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
		newBox.title=num;
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
		var i=66; // bug for >=6
		boxesDiv.innerHTML="";
		while (i--) {
			var newBox=document.createElement("div");
			newBox.className="box";
			newBox.style.height=Math.ceil((Math.random()+0.3)*100)+"px";
			newBox.title=newBox.style.height;
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
   
    boxLen=boxes.length;
    boxMiddle=Math.floor((boxLen-1)/2);
    boxIndex=0;
	boxCount=0; //key variable
	zeroFlag=-1;
	oneFlag=-1;
	twoFlag=-1;

    console.log(mergeSort(numArray,0));
}



/**
 *function mergeSort(a,aFlag)
 *divide phase: a is the array to be sorted
 *				aFlag: 0-original array; 1 first half;2 second half
 */

function mergeSort(a,aFlag) {
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
 	if(aFlag==0) {
	 	b=mergeSort(b,1);
	 	c=mergeSort(c,2);
 	}

 	 if(aFlag==1) {
	 	b=mergeSort(b,1);
	 	c=mergeSort(c,1);
 	}

 	if(aFlag==2) {
	 	b=mergeSort(b,2);
	 	c=mergeSort(c,2);
 	}


 	a=sortTwoSortedArray(b,c,aFlag);
 	//console.log(a);
 	return a;
}

/**
 *
 *function sortTwoSortedArray(b,c,aFlag)
 *
 */

 function sortTwoSortedArray(b,c,aFlag) {
 	
 	var bLen=b.length;
 	var cLen=c.length;
 	var a=new Array();
 	var aIndex=0;
 	var bIndex=0;
 	var cIndex=0;

 	boxCount=boxCount+bLen+cLen; //key variable for visual sort
 	 	//if b  reaches the end, how to compare??
 	while (bLen!=0 || cLen!=0) {
 		if (cLen==0) {
 			a[aIndex]=b[bIndex];
 			visualSort(a[aIndex],bLen+cLen,aFlag);

 			aIndex++;
 			bIndex++;
 			bLen--;
 			
 		} else if (b[bIndex]<c[cIndex]) {
 			a[aIndex]=b[bIndex];
 			visualSort(a[aIndex],bLen+cLen,aFlag);

 			aIndex++;
 			bIndex++;
 			bLen--;
 		} else {
 			a[aIndex]=c[cIndex];
 			visualSort(a[aIndex],bLen+cLen,aFlag);

 			aIndex++;
 			cIndex++;
 			cLen--;
 		}

 		
 		
 	}

 	return a;
 }

/**
 *
 *function visualSort(b,c,aFlag)
 * 	//divede a to two array
 *	//3: 0-1 2
 *	//4: 0-1 2-3
 *	//5: 0-2 3-4
 */



 function visualSort(heightofBox,totalLen,aFlag) {
 //to do: how to set boxIndex according totalLen=two sorted array's total length
 //setTimeout的异步机制，从而会呈现高度同时在变的效果
 	

 	if (aFlag==0) {
 		if (zeroFlag==-1) { //reset boxIndex:first entrance of orginal array 
 			boxIndex=0;	
 			zeroFlag=0;
 			boxCount=totalLen;
 		} 
 			
 	} else if (aFlag==1) {
 		if (oneFlag==-1 || boxCount>boxMiddle+1) {//reset boxIndex:first entrance of 1st half array or another merge
 			boxIndex=0;	
 			oneFlag=1;
 			boxCount=totalLen;
 		} 
 	} else if (aFlag==2 ) {
 		if (twoFlag==-1 || boxCount>boxLen-boxMiddle-1) {//reset boxIndex:first entrance of 2rd half array or another merge
 			boxIndex=boxMiddle+1;
 			twoFlag=2;
 			boxCount=totalLen;	
 		} 
 	}

 	boxes[boxIndex].style.height=heightofBox+"px";
 	boxes[boxIndex].title=boxes[boxIndex].style.height;
 	boxIndex++;
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
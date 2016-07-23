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
		var i=3;
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
   


    console.log(mergeSort(numArray,0,boxes.length-1));
}



/**
 *function mergeSort(a,low,high)
 *divide phase: a is the array to be sorted
 *				sort a from index low to index high	
 *   low  high
 *    0    3    0-1  2-3
 *	  0    4    0-2  3-4	
 *    3    4    3-3  4-4
 *    6    10   6-8  9-10
 * so middle=(low+high)/2
 */

function mergeSort(a,low,high) {
	if (high-low==0) {
		return a;
	}

	var middle=Math.floor((low+high)/2);
	mergeSort(a,low,middle);
	mergeSort(a,middle+1,high);

	sortTwoSortedArray(a,low,high);

	return a;
}

/**
 *
 *function sortTwoSortedArray(a,low,high)
 *
 */

 function sortTwoSortedArray(a,low,high) {
 	//store first half part in temp array
 	middle=Math.floor((low+high)/2);
 	var tempFirstHalf=a.slice(low,middle+1);

 	//begin sort
 	var bLen=middle-low+1;
 	var cLen=high -middle;
 	var aIndex=low;
 	var i=0;
 	while (bLen!=0 || cLen!=0) {
 		if (cLen==0) {
 			a[aIndex]=tempFirstHalf[i];
 
 			i++;
 			bLen--;
 			
 		} else if (tempFirstHalf[i]<a[middle+1]) {
			a[aIndex]=tempFirstHalf[i];
 
 			i++;
 			bLen--;
 		} else {
 			middle++;
 			a[aIndex]=a[middle];
 			
 			cLen--;
 		}
 		visualSort(a,aIndex);
 		aIndex++;
 	}


 	return a;
 	
 }

/**
 *
 *function visualSort(a,aIndex)
 *to do: using setTimeout to mimick the delta process
 */



 function visualSort(a,aIndex) {
 	var orig=parseFloat(boxes[aIndex].style.height.replace("px",""));
 	var delta=a[aIndex]-orig;
 	var deltaSign=Math.abs(delta)/delta;
 	var i=1;
 	visualProcess();
 	
 	function visualProcess() {
		if(i>Math.abs(delta)) return true;
		
	 	boxes[aIndex].style.height=orig+i*deltaSign;
	 	i++;	 		
	 	setTimeout(visualProcess,100); //setTime out only registered function to Async Queue
	}	 	
	
 
 	



 	boxes[aIndex].style.height=a[aIndex]+"px";
 	boxes[aIndex].title=a[aIndex]+"px";
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
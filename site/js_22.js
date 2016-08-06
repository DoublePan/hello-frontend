/******
 *global variables:
 *
 *
 ******/
var nodeList=[];



/******
 *function iterateNode(node)
 *
 *
 ******/
 function preIterateNode(node) {
 	
 	if (node!=null) {
	  	// changeNodeColor(node) ;
	 	nodeList.push(node);

	  	preIterateNode(node.firstElementChild);
	 	preIterateNode(node.lastElementChild);			
 	}


 }

 /******
 *function changeNodeColor(node)
 *
 *
 ******/
 function changeNodeColor(nodeList) {
 	var i=0;
 	var len=nodeList.length;
// 0 1 2 3
	var changeColor=function() {
		i++;
		if (i==len) {
			nodeList[i-1].style.backgroundColor="white";
			return;
		} else {
	 		nodeList[i-1].style.backgroundColor="white";
	 		nodeList[i].style.backgroundColor="brown";
	 		setTimeout(changeColor,500);				
		}		
	}

	if (len>0)	{
		nodeList[0].style.backgroundColor="brown";
		setTimeout(changeColor,500);		
	}
	




 }


  /******
 *function init()
 *
 *
 ******/
 function init() {
 	var preIterateBtn=document.getElementById("pre-btn");
 	var rootNode=document.getElementById("parent-div")
 	preIterateBtn.onclick=function() {
 		nodeList=[];  //reset to null;
 		preIterateNode(rootNode);
 		changeNodeColor(nodeList);
 	}
 }

 init();
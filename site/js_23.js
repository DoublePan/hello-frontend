/******
 *global variables:
 *
 *
 ******/
var nodeList=[];
var nodeListTxt=[];
var searchCondition="";


/******
 *function iterateNode(node)
 *
 *
 ******/
 function preIterateNode(node) {
 	
 	if (node!=null) {
	  	// changeNodeColor(node) ;
	 	nodeList.push(node);
	 	nodeListTxt.push(node.firstChild.textContent.trim());
	 	// console.log(node.firstChild.textContent.trim());
	 	var elementChilds=node.children;
	 	for (var i=0; i<elementChilds.length; i++) {
	  		preIterateNode(elementChilds[i]);
	 	}

		
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
			if (nodeListTxt[i-1]!=searchCondition) {
				nodeList[i-1].style.backgroundColor="white";
			}
			return;
		} else {
			if (nodeListTxt[i-1]!=searchCondition) {
				nodeList[i-1].style.backgroundColor="white";
			}
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
 		nodeListTxt=[];
 		searchCondition="";
 		preIterateNode(rootNode);
 		changeNodeColor(nodeList);
 	}

  	var searchBtn=document.getElementById("search-btn")
 	searchBtn.onclick=function() {
 		nodeList=[];  //reset to null;
 		nodeListTxt=[];
 		searchCondition=document.getElementById("search-text").value.trim();
 		preIterateNode(rootNode);
 		changeNodeColor(nodeList);
 	}	
 }

 init();
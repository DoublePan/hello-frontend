/************************
 *show or hide subtree 
 *
 ***********************/
 function showHideSubtree() {
 	var ulElement=event.target.nextElementSibling;
 	if (ulElement.tagName!="UL") 
 		ulElement=null;
 	if (ulElement.style.display!="none") {

 		ulElement.style.display="none";
 	} else {
 		ulElement.style.display="block";
 	}
 }


 function showHideNodeContainer() {
 	var nodeContainer=event.target.getElementsByClassName("node-container-div")[0];
 	console.log(event.target);
 	console.log(nodeContainer);
 	if (nodeContainer.style.display!="none") {

 		nodeContainer.style.display="none";
 	} else {
 		nodeContainer.style.display="block";
 	}
 }




/************************
 *initialization
 *
 ***********************/
 function init() {
 	var liElements=document.getElementById("cpp-tree").getElementsByTagName("li");
 	// console.log(liElements);
 	for (var liElement of liElements) {
 		liElement.onclick=showHideSubtree;
 	}


/* 	var nodeElements=document.getElementById("tree-root").getElementsByClassName("node-div");
 	for (var nodeElement of nodeElements) {
 		nodeElement.onclick=showHideNodeContainer;
 	}*/

 	document.getElementById("tree-root").onclick=showHideNodeContainer;

 }

 init();

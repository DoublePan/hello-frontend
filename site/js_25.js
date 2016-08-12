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




/************************
 *initialization
 *
 ***********************/
 function init() {
 	var liElements=document.getElementById("cpp-tree").getElementsByTagName("li");
 	console.log(liElements);
 	for (var liElement of liElements) {
 		liElement.onclick=showHideSubtree;
 	}
 }

 init();

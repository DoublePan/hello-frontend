/**
 *function addTag()
 *add tag to tags divistion when space,comma,enter is pressed in tag-text input
 */

 var tagsSet=new Set();
 var tagsDiv=document.getElementById("tags-div");

 function addTag() {

 	
 	var keyDown=event.key;
 	if (keyDown=="," || keyDown==" " || keyDown=="Enter") {
 		var tagStr=event.target.value.replace(/[,\s]/,"");
 		//reset tag input
 		event.target.value="";
 		//add new tag
 		if (!tagsSet.has(tagStr)) {
 			// delete one if number of tags is 10
 			if (tagsSet.size==10) {
 				tagsSet.delete(tagsDiv.firstChild.innerHTML);
 				tagsDiv.removeChild(tagsDiv.firstChild);		
 			}


 			tagsSet.add(tagStr);
	 		var newTag=document.createElement("div");
	 		newTag.className="tag";
	 		newTag.innerHTML=tagStr;
	 		newTag.addEventListener("mouseover",deleteTagStyleOver);
	 		newTag.addEventListener("mouseleave",deleteTagStyleLeave);
	 		newTag.addEventListener("click",deleteTag);
	 		tagsDiv.appendChild(newTag);
 		}



 	}

 
 }


/**
 *function deleteTagStyle() 
 *change the tag style which may be deleted when mouse is on it
 */
function deleteTagStyleOver() {
	event.target.textContent="删除 "+event.target.textContent;
}

function deleteTagStyleLeave() {
	event.target.textContent=event.target.textContent.replace(/删除 /,"");
}


/**
 *function deleteTag()
 *delete tag from tags division
 */ 
function deleteTag() {
	tagsDiv.removeChild(event.target);

}



function init() {
	var tagText=document.getElementById("tag-text");
	tagText.addEventListener("keyup",addTag);


}

init();

/**
 *function test()
 * 	
 */

 function test() {

 }

 test();


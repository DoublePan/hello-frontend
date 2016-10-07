var lightboxDiv=$("#lightbox-div");
var msgBtnDiv=$("#msg-btn-div");

window.onload=function() {
	lightboxDiv.onclick=cancelLightBox;
	msgBtnDiv.onclick=cancelLightBox;
	lightboxDiv.onmouseover=changeSizeofLightbox;

}

function $(selector) {
	return document.querySelector(selector);
}


function cancelLightBox() {
	var targetNode=event.target;
	console.log(targetNode);
	if (targetNode.id=="lightbox-div"||targetNode.tagName=="BUTTON")
		lightboxDiv.style.display="none";
}

function changeSizeofLightbox(){
	console.log("changeSizeofLightbox");
}
//global variables area
var registerForm=document.getElementById("register-form");
var validationResult=registerForm.getElementsByTagName("div").length; //0 success; >0 fail

window.onload=function() {
	// useCaputer parementer must be Ture, focus event is not bubbling.
	registerForm.addEventListener('focus',showTip,true);
	registerForm.addEventListener('blur',showValidationMsg,true);
	registerForm.addEventListener('submit',submitValidation,true);
	console.log(validationResult);
}


function showTip() {
	var targetNode=event.target;
	var targetTip=targetNode.nextElementSibling;
	targetTip.style.visibility="visible";
}


function showValidationMsg() {
	var targetNode=event.target;
	var targetValue=targetNode.value;
	var targetTip=targetNode.nextElementSibling;
	// targetTip.style.display="none";
	if (targetValue.length==0) {
		targetNode.style.border="1px solid red";
		targetTip.textContent=targetNode.name+" can't be null!";
		targetTip.style.color="red";
	} else {
		targetNode.style.border="1px solid green";

		targetTip.textContent=targetNode.name+" is validated successfullly";
		targetTip.style.color="green";
		validationResult--;		

	}


}


function submitValidation() {
	if(validationResult==0) {
	alert("validation success!");

	} else {
	alert("validation failed!");

	}
}

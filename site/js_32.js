//global variables area
var registerForm=document.getElementById("register-form");
var validationResult=registerForm.getElementsByTagName("input").length; //0 success; >0 fail
var formElements={
	'name-div': {
		label: 'Name',
		type: 'text',
		rule: '必填,长度为4~16个字符',
		//to do: can't get label name using this method
		success: this.label+'is validated successfully',
		fail: this.label+'can\'t be null',
		validator: function showValidationMsg() {}
	},
	'password-div': {
		label: 'Password',
		type: 'password',
		rule: '必填,长度为4~16个字符',
		success: this.label+'is validated successfully',
		fail: this.label+'can\'t be null',
		validator: function showValidationMsg() {}		
	},
	'submit-div': {
		label: 'Submit',
		type: 'submit',
		rule: '必填,长度为4~16个字符',
		success: this.label+'is validated successfully',
		fail: this.label+'can\'t be null',
		validator: function showValidationMsg() {}		
	}
}


window.onload=function() {
	init();
	// useCaputer parementer must be Ture, focus event is not bubbling.
	registerForm.addEventListener('focus',showTip,true);
	registerForm.addEventListener('blur',showValidationMsg,true);
	registerForm.addEventListener('submit',submitValidation,true);
	// console.log(validationResult);
	onload2();
}

// init form according to fromElements
function init() {
	for (var key in formElements) {
/*sample
		<div id="name-div">
			<label>Name</label>
			<input type="text" name="Name">
			<p>必填,长度为4~16个字符</p>
		</div>
*/		
	var divElement=document.createElement('div');
		var labelElement=document.createElement('label');
		var inputElement=document.createElement('input');
		var pElement=document.createElement('p');
		
		divElement.id=key;
		labelElement.textContent=formElements[key]['label'];
		inputElement.type=formElements[key]['type'];
		inputElement.name=formElements[key]['label'];
		pElement.textContent=formElements[key]['rule'];

		registerForm.appendChild(divElement);
		divElement.appendChild(labelElement);
		divElement.appendChild(inputElement);
		divElement.appendChild(pElement);

		// console.log(inputElement);
	}
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
		targetTip.textContent=formElements[targetNode.parentElement.id]['fail'];
		targetTip.style.color="red";
	} else {
		targetNode.style.border="1px solid green";

		targetTip.textContent=formElements[targetNode.parentElement.id]['success'];
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


//jQuery function
function $(nodeId) {
	return document.querySelector(nodeId);
}
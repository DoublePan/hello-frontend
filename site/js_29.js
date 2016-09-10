window.onload=function() {
	document.getElementById("name-btn").onclick=validateNmae;
}

function validateNmae() {
	var regExp=/fd/;
	var name=document.getElementById("name-txt");
	var nameValue=name.value;
	var tip=document.getElementById("tip-p");
	var strLength=getLength(nameValue);
	if (strLength==0) {
		tip.textContent='Name can\'t be null';
		tip.style.color='red';
		name.style.border='2px solid red';
	} else if (strLength<4 || strLength>16) {
		tip.textContent='Name must contain 4~16 chars';
		tip.style.color='red';
		name.style.border='2px solid red';
	} else {
		tip.textContent='Right format for name';
		tip.style.color='lightgreen';
		name.style.border='2px solid lightgreen';
	} 
}

//english characters 1 char; others 2chars
function getLength(str) {
	var strLength=0,charCode=-1;

	for (var i = 0; i < str.length; i++) {
		charCode=str.charCodeAt(i)
		if (charCode>=0 && charCode<=128) {
			strLength+=1;
		} else {
			strLength+=2;
		}
	}

	return strLength;
}
var registerForm=document.getElementById('register-form');
var studentDiv=document.getElementById('student-div');
var workerDiv=document.getElementById('worker-div');
var schoolJson={
	Xiamen: ['Xiamen University','Jimei University'],
	Beijing: ['QingHua University','Peking University'],
	Wuhan: ['Wuhan University','China Tech University','Wuhan Tech University'],
	Taiyuan: ['Taiyuan Tech University']
}
var citySelect=document.getElementById('city-select');
var schoolSelect=document.getElementById('school-select')

window.onload=function () {
	registerForm.onclick=clickHandler;
	registerForm.onchange=changeHandler;
	initSchoolSelections();
}

function clickHandler() {
	var target=event.target;
	var targetId=target.id;
	if (targetId=="student-radio") {
		studentDiv.style.display="block";
		workerDiv.style.display="none";
	} else if (targetId=="worker-radio") {
		studentDiv.style.display="none";
		workerDiv.style.display="block";

	}

}

function initSchoolSelections() {

	for (var key in schoolJson) {
		citySelect.options.add(new Option(key,key));
		if (citySelect.length==1) {
			for (var element of schoolJson[key]) {
				schoolSelect.add(new Option(element,element));
			}
		}

	}
}


function changeHandler() {
	var target=event.target;
	var targetId=target.id;
	if (targetId=='city-select') {
		while (schoolSelect.length>0) {
			schoolSelect.remove(0);
		}
		for (var element of schoolJson[target.value]) {
			schoolSelect.add(new Option(element,element));
		}
	}
}
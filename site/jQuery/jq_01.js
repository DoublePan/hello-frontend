$(document).ready(
function () {
	var opt1=$("<option></option>").text("1#");
	$("#satellites-select").append(opt1);
	var opt2=$("<option></option>").text("2#");

	$("#satellites-select").append(opt2);
	console.log($('#satellites-select').val().split(' ')[0]);

})
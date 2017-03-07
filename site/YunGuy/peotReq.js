//global variables area
var registerForm = document.getElementById("register-form");
var submitBtn = document.getElementById("submit-btn");
var emailReg = /.+@.+\..+/;

window.onload = function() {
    // useCaputer parementer must be Ture, focus event is not bubbling.
    registerForm.addEventListener('focus', showTip, true);
    registerForm.addEventListener('blur', showValidationMsg, true);
    registerForm.addEventListener('submit', submitValidation, true);
};




function showTip() {
    var targetNode = event.target;
    var targetTip = targetNode.nextElementSibling;
    targetTip.style.visibility = "visible";
}


function showValidationMsg() {
    var targetNode = event.target;
    validateElement(targetNode);
}


//validate form element
function validateElement(targetNode) {
    var targetValue = targetNode.value;
    var targetTip = targetNode.nextElementSibling;
    targetTip.style.visibility = "visible";

    if (targetNode.name == "email") {
        if (!emailReg.test(targetValue)) {
            targetNode.style.border = "1px solid red";
            targetTip.textContent = "Invalid email format";
            targetTip.style.color = "red";
            return false;
        } else {
            targetNode.style.border = "1px solid green";
            targetTip.textContent = "Validated successfullly";
            targetTip.style.color = "green";
            return true;
        }
    }


    if (targetNode.name == "poetSpecification") {
        if (targetValue.length == 0) {
            targetNode.style.border = "1px solid red";
            targetTip.textContent = "poetSpecification can't be null";
            targetTip.style.color = "red";
            return false;
        } else {
            targetNode.style.border = "1px solid green";
            targetTip.textContent = "Validated successfullly";
            targetTip.style.color = "green";
            return true;
        }
    }


}



function submitValidation() {
    submitBtn.disabled = true;


    var validateFailCnt = 0;
    var allFields = registerForm.elements;
    try {
        /*        for (var ele of registerForm.elements) 
         *   only supported in chrome
         */
        for (var i = 0; i < allFields.length; i++) {

            if (!validateElement(allFields[i])) {
                validateFailCnt++;
            }
        }






    } catch (error) {
        console.log(error.message);
    }


    if (validateFailCnt != 0) {
        event.preventDefault();
    }
    // return false;

    submitBtn.disabled = false;

}

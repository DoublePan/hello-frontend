window.onload = function() {
    // useCaputer parementer must be Ture, focus event is not bubbling.
    //registerForm.addEventListener('focus', showTip, true);
    $("#name-input")[0].addEventListener('blur', function(event){
        var emailReg = /.+@.+\..+/;
        var targetNode=event.target;
        var targetValue = targetNode.value;
        var targetTip = targetNode.nextElementSibling;
        if (targetNode.name == "email") {
            if (!emailReg.test(targetValue)) {
                targetNode.style.border = "1px solid red";
                targetTip.textContent = "Invalid email format";
                targetTip.style.color = "red";
            } else {
                targetNode.style.border = "1px solid green";
                targetTip.textContent = "Validated successfullly";
                targetTip.style.color = "green";
            }
        }
    }, true);

    $("#req-input")[0].addEventListener('blur', function(event){
        var targetNode=event.target;
        var targetValue = targetNode.value;
        var targetTip = targetNode.nextElementSibling;
        if (targetValue.length == 0) {
            targetNode.style.border = "1px solid red";
            targetTip.textContent = "poetSpecification can't be null";
            targetTip.style.color = "red";
        } else {
            targetNode.style.border = "1px solid green";
            targetTip.textContent = "Validated successfullly";
            targetTip.style.color = "green";
        }
    }, true);

    $("#register-form")[0].addEventListener('submit', function(event){
        var submitBtn = document.getElementById("submit-btn");
        submitBtn.disabled = true;
        var validateFailCnt=0;
        var allFields = $("#register-form")[0].elements;
            /*        for (var ele of registerForm.elements) 
             *  “var ele of” is only supported in chrome
             */
        var fEvent=new FocusEvent("blur");      
        for (var i = 0; i < allFields.length; i++) {
            allFields[i].dispatchEvent(fEvent);
        }
        $("#register-form p").each(function(elem,para){
            if (elem.style.color=="red") {
                validateFailCnt=validateFailCnt+1;            
            }
        }); 
        //console.log(validateFailCnt);
        if (validateFailCnt !== 0) {
            event.preventDefault();
        }
        // return false;
        submitBtn.disabled = false;
    }, true);
};

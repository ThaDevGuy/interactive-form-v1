//Functions
//shows error message
const showHelper = (message, $targetElem) => {
    $targetElem.prev().attr({
        "data-tip": `${message}`,
        class: "helper"
    });
}
//removes error message
const removeHelper = ($targetElem) => {
    $targetElem.prev().removeClass('helper').removeAttr('data-tip');
}



$(document).ready(function () {
    //first input get focus
    $('#name').focus();
    //show other-title text input when option of value other selected
    $('#other-title').hide();
    $('#title').on('change', function(e){
        if(e.currentTarget.value === "other"){
            $('#other-title').show();
            $('#other-title').focus();
        }
        else {
            $('#other-title').hide();
        }
    });

    //hide color label and color select menu and display on when a design is selected
    $('#color').prev().hide();
    $('#color').hide();
    $('#design').on('change', function (e){
        if(e.currentTarget.value === "js puns" || e.currentTarget.value === "heart js") {
            $('#color').prev().show();
            $('#color').show();
            //remove any helper if present
            removeHelper($('#design'));
            $('#color option').each((index, elem) => {
                //sets selected attribute on selected index...
                const selectedMech = (setIndex, removeIndex) => {
                    $('#color option')[removeIndex].removeAttribute('selected');
                    $('#color option')[setIndex].setAttribute('selected',true);
                }
                elem.style.display = '';
                //display appropraite colors for the theme selected
                if(e.currentTarget.value === "js puns"){
                    if(elem.textContent.toLowerCase().search(/js puns/g) === -1){
                        selectedMech(0,3);
                        elem.style.display = "none";
                    }
                }
                else {
                    if(elem.textContent.toLowerCase().search(/js puns/g) !== -1){
                        selectedMech(3,0);
                        elem.style.display = "none";
                    }
                }
            });
        }
        else {
            $('#color').prev().hide();
            $('#color').hide();
        }
    });


    //disable time conflicting activities on change and work out total fees
    let totalFees = 0.00;
    const totalFeesH3 =$('<h3/>', {
        class: "fees",
    });
    totalFeesH3.appendTo('.activities');
    $('.activities input').on('change', function (e) {
        const labelText = e.currentTarget.parentElement.textContent;
        const startIndex =labelText.lastIndexOf('—');
        const endIndex = labelText.lastIndexOf(',');
        const testString = labelText.slice(startIndex, endIndex);
        //calc the total fees
        const currentFees = parseFloat(labelText.slice(labelText.lastIndexOf('$')+ 1));
        if(e.currentTarget.checked === true) {
            e.currentTarget.className = "checked";
            //remove any helpers if any
            removeHelper($('.activities >label:nth-of-type(1)'));
            totalFees += currentFees;
        }
        else {
            e.currentTarget.className = "";
            totalFees -= currentFees;
            //totalfees is not less than 0;
            if(totalFees < 0) {
                totalFees = 0;
            }
        }
        //check and disabled conflicting times of activities
        $('.activities input').each(function (index, elem) {
            if(elem.checked === false) {
                if(elem.parentElement.textContent.includes(testString)) {
                    if(e.currentTarget.checked === true) {
                        elem.setAttribute('disabled', true);
                    }
                    else {
                        elem.removeAttribute('disabled');
                    }
                }
            }
        });
        totalFeesH3.text(`Total: $${totalFees}`);
    });
    
   //set credit card to default selected
   $('#payment option')[1].setAttribute('selected', true);
   //hide paypal and bitcoin info sections
   $('form fieldset:nth-of-type(4) > div:nth-of-type(n + 2)').hide();
   //disable select payment Method Option
   $('#payment option')[0].setAttribute('disabled', true);
   //show appropraite payment info section when a payment method is selected
   $('#payment').on('change', function (e){
       if(e.currentTarget.value !== "select_method") {
            $('#credit-card').show();
            $('form fieldset:nth-of-type(4) > div:nth-of-type(n + 2)').show();
           if(e.currentTarget.value === "credit card"){
                $('form fieldset:nth-of-type(4) > div:nth-of-type(n + 2)').hide();
           }
           else if (e.currentTarget.value === "paypal") {
               $('#credit-card').hide();
               $('form fieldset:nth-of-type(4) > div:nth-of-type(3)').hide();
           }
           else {
                $('#credit-card').hide();
                $('form fieldset:nth-of-type(4) > div:nth-of-type(2)').hide();
           }
       }
   });




   //show helper when input not validated and remove helper when validated by listening to these events
   $('input').on('change keyup blur keypress keydown', function (e){
        
        const target = e.currentTarget;
        //validate name
        if(target.id === "name") {
            if(target.value.length < 3 || target.value.match(/[a-zA-z]/g) === null){
                showHelper("Please enter your full name", $('#name'));
            }
            else {
                removeHelper($('#name'));
            }
        }
        //validate email
        if(target.id === "mail") {
            const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            removeHelper($('#mail'));
            if(target.value.length  < 1) {
                showHelper("Please enter your email", $('#mail'));
            }
            if(!emailRegex.test(target.value) && target.value.length > 0) {
                showHelper("Invalid email, Please enter a valid email", $('#mail'));
            }  
        }
        //validate cc-num
        if(target.id === "cc-num") {
            removeHelper($('#cc-num'));
            if(target.value.length < 13 || target.value.length > 16) {
                showHelper(`Must be 13-16 digits long.`, $('#cc-num'));
            }
            if(!/^\d+$/.test(target.value)){
                showHelper(`Invalid card number. Please enter a valid card number.`, $('#cc-num'));
            }
            if(target.value.length < 1) {
                showHelper(`Please enter a credit or debit card number.`, $('#cc-num'));
            }
        }
        //validate zip code
        if(target.id === "zip") {
            removeHelper($('#zip'));
            if(target.value.length < 5 || target.value.length > 5) {
                showHelper('Please enter a 5 digit zip code', $('#zip'));
            }
            if(!/^\d+$/.test(target.value) && target.value.length > 0){
                showHelper(`Invalid Zip code (enter digits only).`, $('#zip'));
            }
        }

        //validate cvv
        if(target.id === "cvv") {
            removeHelper($('#cvv'));
            if(target.value.length < 1) {
                showHelper('Please enter your cvv', $('#cvv'));
            }
            if(!/^\d+$/.test(target.value) && target.value.length > 0 || target.value.length > 3){
                showHelper(`Invalid cvv, cvv must be a 3 digit`, $('#cvv'));
            }
        }
        
   });

   //if form not validated prevent submit and show helper 
   $('form').on('submit', function (e) {
       //if there is any class .helper or no activity checked or no design selected or no text typed prevent submit
       if($('#design option:selected').text() === "Select Theme" || $('.helper').get() > 0 || $('input:checked').get() < 1 || $('#mail').value.length < 1) {
           if($('input:checked').get() < 1) {
               console.log('Inside');
               console.log($('.activities > label:nth-of-type(1)'));
               showHelper('Please select at least one activies', $('.activities > label:nth-of-type(1)'));
           }
           else {
               removeHelper($('.activities > label:nth-of-type(1)'));
           }
           
           if($('#design option:selected').text() === "Select Theme") {
                showHelper('Please select a design', $('#design'));
                console.log('not selected');
            }
            e.preventDefault();
       }
       const textInputs = $('input[type="text"]:not("#other-title")').get();
       textInputs[4] = $('#mail').get(0);
       textInputs.forEach(function (textInput) {
           if(textInput.value.length < 1) {
               console.log(textInput.value.length);
               showHelper('This field is required', $('#' + textInput.id));
               e.preventDefault();
           }
       });
   });




});

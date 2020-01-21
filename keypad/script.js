document.addEventListener('click', function (event) {
  if ( event.target.getAttribute('data-value') ) {
		var val = event.target.getAttribute('data-value');
    switch (val) {
			case 'submit': submitForm();
				return;
			break;
				
			case 'clear': emptyCode();
				return;
			break;
				
			case 'back': backSpace();
				return;
			break;
				
			default: addCode(val);
			break;
		}
  }
}, false);

function addCode(key){
  var maxlength = 6; //submits form after this number digits
  var code = document.forms[0].code;
  if(code.value.length < maxlength){
    code.value = code.value + key;
  }
  if(code.value.length == maxlength){
    document.getElementById("message").style.visibility = "visible";
    setTimeout(submitForm,1000);    
  }
}
function emptyCode(){ document.forms[0].code.value = ""; }
function backSpace(){ document.keypad.code.value = document.keypad.code.value.substring(0,document.keypad.code.value.length*1 -1) }
function submitForm(){ document.forms[0].submit(); }
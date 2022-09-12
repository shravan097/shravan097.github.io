$(document).ready(function(){
// Add smooth scrolling to all links
$("a").on('click', function(event) {
// Make sure this.hash has a value before overriding default behavior
if (this.hash !== "") {
// Prevent default anchor click behavior
event.preventDefault();
// Store hash
var hash = this.hash;
// Using jQuery's animate() method to add smooth page scroll
// The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
$('html, body').animate({
scrollTop: $(hash).offset().top
}, 800, function(){

// Add hash (#) to URL when done scrolling (default click behavior)
window.location.hash = hash;
});
} // End if
});
});

function myFunction() {
var x = document.getElementById("demo");
if (x.className.indexOf("w3-show") == -1) {
x.className += " w3-show";
} else {
x.className = x.className.replace(" w3-show", "");
}
}


function courseDropDown()
{
	var x = document.getElementById("course");
	if (x.className.indexOf("w3-show") == -1)
	{
		x.className += " w3-show";
	} else {
		x.className = x.className.replace(" w3-show", "");
	}
}
function qualificationDropDown()
{
	var x = document.getElementById("languages");
	if (x.className.indexOf("w3-show") == -1)
	{
		x.className += " w3-show";
	} else {
		x.className = x.className.replace(" w3-show", "");
	}
}
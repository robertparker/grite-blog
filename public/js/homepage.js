$(document).ready(function() {
$('#loader').hide();
// setTitle();
setNavbar();
loadFooter();
$('#old-posts').bind('click', loadOlder);
createPlaceholders();
loadAllLinks();
getRepos();
if (toBeLoaded == config.posts.length)
  $('#old-posts').hide();

	
	$( "#past-week" ).click(function( event ){
		console.log("I'm here!")
		$("[data-time-length=past-week]").show("slow")
		$("[data-time-length=past-month]").hide("slow")
		$("[data-time-length=past-year]").hide("slow")
	});

	$( "#past-month" ).click(function( event ){
		$("[data-time-length=past-week]").show("slow")
		$("[data-time-length=past-month]").show("slow")
		$("[data-time-length=past-year]").hide("slow")
	});

	$( "#past-year" ).click(function( event ){
		$("[data-time-length=past-week]").show("slow")
		$("[data-time-length=past-month]").show("slow")
		$("[data-time-length=past-year]").show("slow")
	});


});
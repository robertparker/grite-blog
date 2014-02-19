$(document).ready(function() {
$('#loader').hide();
// setTitle();
setNavbar();
loadFooter();
$('#old-posts').bind('click', loadOlder);
createPlaceholders();
loadAllLinks();
getRepos();
if (toBeLoaded == config.posts.length){
  $('#old-posts').hide();
}

// $('div[id^="post"]').on({
$('#allposts').on({
	mouseenter: function(){
// $('div.post-content').hover(function(){
		console.log("entering!!");
		var parent_id = $(this).attr('data-parent-id');
		console.log('parent_id is '+ parent_id);
    $('div[data-parent-id="'+parent_id + '"]').addClass('hover');
    $('div[data-gist-id="'+parent_id + '"]').addClass('hover-parent');
  },
  mouseleave: function(){
  	$('div[id^="post"]').removeClass('hover');
  	$('div[id^="post"]').removeClass('hover-parent');
  }
}, 'div');
	
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
$(document).ready(function() {
$('#loader').hide();
// setTitle();
setNavbar();
loadFooter();
// $('#old-posts').bind('click', loadOlder);
var gistPosts = [];
getAllGistsJSON().then(function(returndata) {
for (var i in returndata) {
  gist = returndata[i]
	if(gistPosts.indexOf(gist.id) == -1){
	  gistPosts.push(gist.id)
	}
}
}).done(function(){
	console.log(gistPosts)
	createPlaceholders2(gistPosts);
	loadAllLinks2(gistPosts)
});
// createPlaceholders();
// loadAllLinks();
// getRepos();
// if (toBeLoaded == gistPosts.length){
//   $('#old-posts').hide();
// }


 // $('div').click(function(){
 //  	alert('dfgdfg ');
 //  	// $(this).hide()
 //    // $('.post-content').not(this).hide();
 //    // $('.container > not:[data-parent-id='+parent_id).hide(); 
 //  }); 


// $('div[id^="post"]').on({
$('#allposts').on({
	mouseenter: function(){
		// console.log("entering!!");
		var parent_id = $(this).attr('data-parent-id');
		// console.log('parent_id is '+ parent_id);
    $('div[data-parent-id="'+parent_id + '"]').addClass('hover');
    $('div[data-gist-id="'+parent_id + '"]').addClass('hover-parent');
  },
  mouseleave: function(){
  	$('div[id^="post"]').removeClass('hover');
  	$('div[id^="post"]').removeClass('hover-parent');
  },
  mouseup: function( event ){
		
		$('#title').html('<a href="/" id="back">back</a>');
		var parent_id = $(this).closest('div').attr('data-parent-id');
		console.log('parent id is ' + parent_id);
		if(parent_id){
			$('.post-box').not('div[data-parent-id="'+parent_id+'"]').hide("slow");
			console.log('that parent_id was ' + parent_id)
			arrangeLinkFamily(parent_id);
		}
		// if($(event.target).is('#familyposts')){
		// 	event.preventDefault();
		// 	event.stopPropagation();
		// 	event.stopImmediatePropagation();
		// }

	}

}, 'div');

window.onhashchange = function(){
		console.log('PARULKAR______________' + window.location.pathname);
				$('#allposts').find('a').each( function foo(index, item){
				console.log('ROHIT ______________' + $(item).attr('href'));
				// if(window.location.hash[0] == '#' && $(item).attr('href')[0] == "#"){
				if($('#title').text() == 'back'){
					$(item).attr('href',$(item).attr('href').replace('#','/gist/'));
				}
			});
}

$('#familyposts').on({
	mouseenter: function(){
		// console.log("entering!!");
		var parent_id = $(this).attr('data-parent-id');
		// console.log('parent_id is '+ parent_id);
    $('div[data-parent-id="'+parent_id + '"]').addClass('hover');
    $('div[data-gist-id="'+parent_id + '"]').addClass('hover-parent');
  },
  mouseleave: function(){
  	$('div[id^="post"]').removeClass('hover');
  	$('div[id^="post"]').removeClass('hover-parent');
  }
  // ,
 //  click: function( event ){
	// var parent_id = $(this).closest('div').attr('data-parent-id');
	// console.log('parent id is ' + parent_id);
	// if(parent_id){
	// 	$('.post-box').not('div[data-parent-id="'+parent_id+'"]').hide("slow");
	// 	console.log('that parent_id was ' + parent_id)
	// 	arrangeLinkFamily(parent_id);
	// }
	// if($(event.target).is('#familyposts')){
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	event.stopImmediatePropagation();
	// }

  // }
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
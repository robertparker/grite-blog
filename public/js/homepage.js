$(document).ready(function() {
  $("#loader").hide();
  setNavbar();
  loadFooter();

  var gistPosts = [];
  getAllGistsJSON()
    .then(function(returndata) {
      for (var i in returndata) {
        gist = returndata[i];
        if (gistPosts.indexOf(gist.id) == -1) {
          gistPosts.push(gist.id);
        }
      }
    })
    .done(function() {
      console.log(gistPosts);
      createPlaceholders(gistPosts);
      loadAllLinks(gistPosts);
    });

  $("#allposts").on(
    {
      mouseenter: function() {
        var parent_id = $(this).attr("data-parent-id");
        $('div[data-parent-id="' + parent_id + '"]').addClass("hover");
        $('div[data-gist-id="' + parent_id + '"]').addClass("hover-parent");
      },
      mouseleave: function() {
        $('div[id^="post"]').removeClass("hover");
        $('div[id^="post"]').removeClass("hover-parent");
      },
      mouseup: function(event) {
        var parent_id = $(this)
          .closest("div")
          .attr("data-parent-id");
        // console.log("parent id is " + parent_id);

        var gist_id = $(this)
          .closest("div")
          .attr("data-gist-id")

        if($('div[data-parent-id="' + parent_id + '"]').length == 1){
          window.open("/gist/" + gist_id, "_self");
        }
        else {
          if (parent_id) {
            $(".post-box")
              .not('div[data-parent-id="' + parent_id + '"]')
              .hide("slow");
            // console.log("that parent_id was " + parent_id);
            $("#title").html('<a href="/" id="back">back</a>');
            arrangeLinkFamily(parent_id);
          }
        }
      }
    },
    "div"
  );

  window.onhashchange = function() {
    console.log("PARULKAR______________" + window.location.pathname);
    $("#allposts")
      .find("a")
      .each(function foo(index, item) {
        console.log("ROHIT ______________" + $(item).attr("href"));
        if ($("#title").text() == "back") {
          $(item).attr(
            "href",
            $(item)
              .attr("href")
              .replace("#", "/gist/")
          );
        }
      });
  };

  $("#familyposts").on(
    {
      mouseenter: function() {
        var parent_id = $(this).attr("data-parent-id");
        $('div[data-parent-id="' + parent_id + '"]').addClass("hover");
        $('div[data-gist-id="' + parent_id + '"]').addClass("hover-parent");
      },
      mouseleave: function() {
        $('div[id^="post"]').removeClass("hover");
        $('div[id^="post"]').removeClass("hover-parent");
      }
    },
    "div"
  );

  $("#past-week").click(function(event) {
    console.log("I'm here!");
    $("[data-time-length=past-week]").show("slow");
    $("[data-time-length=past-month]").hide("slow");
    $("[data-time-length=past-year]").hide("slow");
  });

  $("#past-month").click(function(event) {
    $("[data-time-length=past-week]").show("slow");
    $("[data-time-length=past-month]").show("slow");
    $("[data-time-length=past-year]").hide("slow");
  });

  $("#past-year").click(function(event) {
    $("[data-time-length=past-week]").show("slow");
    $("[data-time-length=past-month]").show("slow");
    $("[data-time-length=past-year]").show("slow");
  });
});

var queue = 0;
var toBeLoaded = 0;
var toBeLoaded2 = 0;
var loaded = 0;

function getAllGistsJSON() {
  return $.getJSON(
    "https://api.github.com/users/" + config.gitHubUser + "/gists",
    function(data) {
      return data;
    }
  );
}

function setTitle() {
  $("#title").html(config.title);
  document.title = config.title;
}

function setNavbar() {
  for (var i = 0; i < config.navbar.length; i++) {
    var dom =
      '<a href="' +
      config.navbar[i].link +
      '">' +
      config.navbar[i].text +
      "</a>";
    if (i != 0) $("<span> • </span>").appendTo("#navbar");
    $(dom).appendTo("#navbar");
  }
}

function createPlaceholders(gistPosts) {
  console.log("gistPosts.length:" + gistPosts.length);
  for (var i = 0; i < config.atOnce; i++) {
    if (toBeLoaded != gistPosts.length) {
      console.log("toBeLoaded: " + toBeLoaded);
      gist_id = gistPosts[toBeLoaded];
      if (!$("#post" + gist_id)[0]) {
        var dom = '<div id="post' + gist_id + '"></div>';
        $(dom).appendTo("#allposts");
      }
      toBeLoaded++;
    } else break;
  }
  for (var i = 0; i < config.atOnce; i++) {
    if (toBeLoaded2 != gistPosts.length) {
      gist_id = gistPosts[toBeLoaded2];
      if (!$("#family-post" + gist_id)[0]) {
        var dom = '<div id="family-post' + gist_id + '"></div>';
        $(dom).appendTo("#familyposts");
      }
      toBeLoaded2++;
    } else break;
  }
}

function arrangeLinkFamily(parent_id) {
  div_array = generateFamilyLinks(parent_id);
  console.log("div_array is " + div_array);
  for (var dom in div_array) {
    console.log("for loop : dom is " + dom);
    $(dom).appendTo("#family-post" + parent_id);
  }
}

function generateFamilyDiv(gist_id, parent_id, postClass, timeLength, title) {
  var dom = $(
    '<a href="/gist/' +
      gist_id +
      '">' +
      '<div id="post' +
      gist_id +
      '" class="' +
      postClass +
      '"' +
      'data-time-length="' +
      timeLength +
      '"' +
      ' data-parent-id="' +
      parent_id +
      '"' +
      ' data-gist-id="' +
      gist_id +
      '">' +
      '<div class="family-post-content"><div><span>' +
      titleizeMarkdown(title) +
      " • " +
      (updated_at.getMonth() + 1) +
      "." +
      updated_at.getDate() +
      "." +
      updated_at.getFullYear() +
      "</span></div></div></div></a>"
  );
  return dom;
}

//returns array of link divs
function generateFamilyLinks(parent_id) {
  final_array = typeof final_array == "undefined" ? [] : final_array;
  children_array = typeof children_array == "undefined" ? [] : children_array;
  original_parent_id =
    typeof original_parent_id == "undefined" ? parent_id : original_parent_id;
  $.get(
    "https://api.github.com/gists/" + parent_id,
    function(data) {
      var gist = "";
      gist_id = data.id;
      var postClass = "family-post-box";
      for (var j in data.files) {
        console.log("gist_id is " + gist_id);
        gist = gist + marked.parse(data.files[j].content);
        title = data.files[j].filename;
        updated_at = new Date(data.updated_at);
        timeLength = getTimeLength(updated_at);
        dom = generateFamilyDiv(
          gist_id,
          parent_id,
          postClass,
          timeLength,
          title
        );
        console.log("dom type is " + typeof dom);
        parent_id === gist_id
          ? final_array.push(dom)
          : final_array.unshift(dom);
        console.log("final_array is " + final_array);
        forks = data.forks;
        for (var i in forks) {
          thisId = forks[i].id;
          console.log("fork id " + forks[i].id);
          generateFamilyLinks(thisId);
        }
      }
    },
    "json"
  ).done(function() {
    // return final_array;
    for (var i in final_array) {
      console.log("for loop : div is is " + $(final_array[i]));
      console.log(
        "for loop : data-gist-id is " +
          $(final_array[i])
            .children("div")
            .attr("data-gist-id")
      );
      if (
        $(final_array[i])
          .children("div")
          .attr("data-gist-id") == original_parent_id
      ) {
        $(final_array[i]).appendTo("#family-post6955115");
        $("#allposts")
          .find(
            'div[data-gist-id="' +
              $(final_array[i])
                .children("div")
                .attr("data-gist-id") +
              '"]'
          )
          .hide();
      }
    }
  });
}

function loadPost() {
  var gist_id = $("#gist_id").text();
  $("#gist_id").hide();
  $.get(
    "https://api.github.com/gists/" + gist_id,
    function(data) {
      var gist = "";
      for (var j in data.files)
        gist = gist + marked.parse(data.files[j].content);
      title = data.files[j].filename;
      commit_count = data.history.length;
      last_commit_date = new Date(data.history[0].committed_at);
      first_commit_date = new Date(data.history[commit_count - 1].committed_at);
      time_diff = last_commit_date.getTime() - first_commit_date.getTime();
      console.log(time_diff);
      month_count = Math.floor(time_diff / (1000 * 3600 * 24 * 30));
      console.log(month_count);
      var dom =
        '<div class="post-text">' +
        '<div class="post-text-content">' +
        gist +
        "</div>" +
        "</div><hr>";
      $(dom).appendTo(".post-text");

      var footer =
        "<p>" +
        '<a href="http://gist.github.com/' +
        gist_id +
        '">' +
        commit_count +
        " revisions over " +
        month_count +
        " months. " +
        "</a></p>";
      $(footer).appendTo("#footer");
      $('<br /><a href="/" style="float:none;">back</a>').appendTo("#footer");
    },
    "json"
  ).done(function() {
    $("#loader").hide();
  });
}

function loadLink(gist_id, parent_id) {
  $.get(
    "https://api.github.com/gists/" + gist_id,
    function(data) {
      console.log("gist_id: " + gist_id, "parent_id:" + parent_id);
      parent_id =
        typeof data.fork_of === "undefined" ? gist_id : data.fork_of.id;
      var gist = "";
      var postClass = parent_id === gist_id ? "post-box" : "post-box";
      for (var j in data.files)
        gist = gist + marked.parse(data.files[j].content);
      title = data.files[j].filename;
      language = data.files[j].language;
      updated_at = new Date(data.updated_at);
      timeLength = getTimeLength(updated_at);

      var dom =
        '<a href="#' +
        gist_id +
        '">' +
        '<div id="post' +
        gist_id +
        '" class="' +
        postClass +
        '"' +
        'data-time-length="' +
        timeLength +
        '"' +
        ' data-parent-id="' +
        parent_id +
        '"' +
        ' data-gist-id="' +
        gist_id +
        '">' +
        '<div class="post-content"><div><span>' +
        titleizeMarkdown(title) +
        " • " +
        (updated_at.getMonth() + 1) +
        "." +
        updated_at.getDate() +
        "." +
        updated_at.getFullYear() +
        "</span></div></div></div></a>";

      if (
        document.querySelectorAll("a[href^='#" + gist_id + "']").length == 0
      ) {
        if (language == "Markdown")
          parent_id === gist_id
            ? $(dom).insertBefore("#post" + parent_id)
            : $(dom).insertAfter("#post" + parent_id);
      }
      forks = data.forks;
      for (var i in forks) {
        thisId = forks[i].id;
        loadLink(thisId, gist_id);
      }
    },
    "json"
  ).done(function() {});
}

var highlightPosts = function() {
  $(".post-box").css({ border: "5px solid green" });
};

function titleizeMarkdown(title) {
  return title.replace(".md", "").replace(/-/g, " ");
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function loadAllLinks(gistPosts) {
  $("#loader").show();
  for (; loaded < gistPosts.length; loaded++) {
    $.get(
      "https://api.github.com/gists/" + gistPosts[loaded],
      function(data) {
        gist_id = data.id;
        loadLink(gist_id);
      },
      "json"
    ).done(function() {
      $("#loader").hide();
    });
  }
}

function getRepos() {
  for (var p in config.repos) {
    $.get(
      "https://api.github.com/repos/" +
        config.gitHubUser +
        "/" +
        config.repos[p],
      function(data) {
        pushed_at = new Date(data.pushed_at);
        timeLength = getTimeLength(pushed_at);
        var dom =
          '<div class="post-box"' +
          ' data-time-length="' +
          timeLength +
          '""><div class="post-content"><div><span>' +
          '<a href="' +
          data.homepage +
          '">' +
          data.description +
          "</a>" +
          " • " +
          (pushed_at.getMonth() + 1) +
          "." +
          (pushed_at.getDate() + 1) +
          "." +
          pushed_at.getFullYear() +
          "</span></div></div>";
        $(dom).appendTo("#repos");
      },
      "json"
    ).done(function() {});
  }
}

function loadFooter() {
  $("#footer-text").html(config.footerText);
}

function getTimeLength(date) {
  today = new Date(Date.now());
  thisDate = new Date(date);
  diff = (today - thisDate) / (24 * 60 * 60 * 1000);
  if (diff < 7) {
    return "past-week";
  } else if (diff < 30) {
    return "past-month";
  } else {
    return "past-year";
  }
}

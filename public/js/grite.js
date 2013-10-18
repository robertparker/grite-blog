var queue = 0;
var toBeLoaded = 0;
var loaded = 0;

function setTitle() {
  $('#title').html(config.title);
  document.title = config.title;
}

function setNavbar() {
  for (var i = 0; i < config.navbar.length; i++) {
    var dom = '<a href="' + config.navbar[i].link + '">' + config.navbar[i].text + '</a>';
    if (i != 0)
      $('<span> • </span>').appendTo('#navbar');
    $(dom).appendTo('#navbar');
  }
}

function createPlaceholders() {
  for (var i = 0; i < config.atOnce; i++) {
    if (toBeLoaded != config.posts.length) {
      var dom = '<div id="post' + config.posts[toBeLoaded] + '"></div>';
      $(dom).appendTo('#posts');
      toBeLoaded++;
    } else
      break;
  }
}

function loadPosts() {
  $('#loader').show();
  for (;loaded < toBeLoaded; loaded++) {
    queue ++;
    $.get('https://api.github.com/gists/' + config.posts[loaded], function (data) {
      var gist = '';
      for (var j in data.files)
        gist = gist + marked.parse(data.files[j].content);
      var dom = '<div class="post">' +
                '<div class="post-text">' + gist + '</div>' +
                '<span class="date"><a href="' + data.html_url + '">' + new Date(data.updated_at) + '</a></span>' +
                ' • <span class="author">Posted by <a href="https://github.com/' + data.user.login + '">' + data.user.login + '</a></span>' +
                '</div><hr>';
      $(dom).appendTo('#post' + data.id);
    }, 'json').done(function() {
      queue --;
      if (queue == 0)
        $('#loader').hide();
    });
  }
}

function loadLink(gist_id, parent_id) {
  parent_id = (typeof parent_id === 'undefined') ? gist_id : parent_id;
  $.get('https://api.github.com/gists/' + gist_id, function (data) {
    var gist = '';
    var postClass = (parent_id === gist_id) ? 'post' : 'fork-post'
    for (var j in data.files)
      gist = gist + marked.parse(data.files[j].content);
      title = data.files[j].filename;
      updated_at = new Date(data.updated_at);
    var dom = '<div class="' + postClass + '">' + '<a href="' + data.html_url + '">' + titleizeMarkdown(title) + '</a>' + ' •  <span class="author"></span>' +
              '<span class="author">' + (updated_at.getMonth()+1) + '.' + (updated_at.getDate()+1) + '.' + updated_at.getFullYear() + '</span>' +
              // ' • <span class="author">posted by <a href="https://github.com/' + data.user.login + '">' + data.user.login + '</a></span>' +
              '</div>';
    (parent_id === gist_id) ? $(dom).prependTo('#post' + parent_id) : $(dom).appendTo('#post' + parent_id);
    // $(dom).appendTo('#posts');
    }, 'json').done(function() {
  });
}

  function titleizeMarkdown(title) {
    return title.replace('.md','').replace(/-/g,' ');
  }

  function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

function loadAllLinks() {
  $('#loader').show();
  for (;loaded < toBeLoaded; loaded++) {
    queue ++;
    $.get('https://api.github.com/gists/' + config.posts[loaded], function (data) {
      // var gist = '';
      // for (var j in data.files)
      //   gist = gist + marked.parse(data.files[j].content);
      //   title = data.files[j].filename;
      //   updated_at = new Date(data.updated_at);
      // var dom = '<div class="post">' + title + ' •  ' +
      //           '<span class="date"><a href="' + data.html_url + '">' + updated_at.toDateString() + '</a></span>' +
      //           ' • <span class="author">Posted by <a href="https://github.com/' + data.user.login + '">' + data.user.login + '</a></span>' +
      //           '</div>';
      // $(dom).appendTo('#post' + data.id);
      gist_id = data.id;
      loadLink(gist_id);
      forks = data.forks;
      for(var i in forks) {
        thisId = forks[i].id;
        loadLink(thisId, gist_id);
      }
    }, 'json').done(function() {
      queue --;
      if (queue == 0)
        $('#loader').hide();
    });
  }
}

function getRepos() {
  for (var p in config.repos) {
    $.get('https://api.github.com/repos/' + config.gitHubUser + '/' + config.repos[p], function (data) {
      pushed_at = new Date(data.pushed_at);
      var dom = '<div class="repo">' + '<a href="' + data.homepage + '">' + data.name + '</a>' + ' •  <span class="author"></span>' +
              '<span class="author">' + (pushed_at.getMonth()+1) + '.' + (pushed_at.getDate()+1) + '.' + pushed_at.getFullYear() + '</span>' +
              '</div>';
              console.log(dom);
      $(dom).appendTo('#repos');
    }, 'json').done(function() {
    });
  }
}

function loadFooter() {
  $('#footer-text').html(config.footerText);
}

function loadOlder() {
  createPlaceholders();
  loadPosts();
  if (toBeLoaded == config.posts.length)
    $('#old-posts').hide();
}

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

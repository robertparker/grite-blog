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
      $(dom).appendTo('#allposts');
      toBeLoaded++;
    } else
      break;
  }
}

// function loadPosts() {
//   $('#loader').show();
//   for (;loaded < toBeLoaded; loaded++) {
//     queue ++;
//     $.get('https://api.github.com/gists/' + config.posts[loaded], function (data) {
//       var gist = '';
//       for (var j in data.files)
//         gist = gist + marked.parse(data.files[j].content);
//       var dom = '<div class="post">' +
//                 '<div class="post-text">' + gist + '</div>' +
//                 '<span class="date"><a href="' + data.html_url + '">' + new Date(data.updated_at) + '</a></span>' +
//                 ' • <span class="author">Posted by <a href="https://github.com/' + data.user.login + '">' + data.user.login + '</a></span>' +
//                 '</div><hr>';
//       $(dom).appendTo('#post' + data.id);
//     }, 'json').done(function() {
//       queue --;
//       if (queue == 0)
//         $('#loader').hide();
//     });
//   }
// }

function loadPost() {
  var gist_id = $('#gist_id').text();
  $('#gist_id').hide();
  $.get('https://api.github.com/gists/' + gist_id, function (data) {
    var gist = '';
    for (var j in data.files)
      gist = gist + marked.parse(data.files[j].content);
      title = data.files[j].filename;
      commit_count = data.history.length;
      last_commit_date = new Date(data.history[0].committed_at);
      first_commit_date = new Date(data.history[commit_count -1].committed_at);
      time_diff = last_commit_date.getTime() - first_commit_date.getTime();
      console.log(time_diff);
      month_count = Math.floor(time_diff/(1000*3600*24*30));
      console.log(month_count)
    var dom = '<div class="post-text">' +
              '<div class="post-text-content">' + gist + '</div>' +
              // '<span class="date"><a href="' + data.html_url + '">' + new Date(data.updated_at) + '</a></span>' +
              // ' • <span class="author">Posted by <a href="https://github.com/' + data.user.login + '">' + data.user.login + '</a></span>' +
              '</div><hr>';
    $(dom).appendTo('.post-text');
    var footer =  '<p>' +'<a href="http://gist.github.com/' +gist_id +'">' + 
    commit_count + ' revisions over '+ month_count + ' months. ' + 
    '</a></p>';
    $(footer).appendTo('#footer');
  }, 'json').done(function() {
      $('#loader').hide();
  });
}


function loadLink(gist_id, parent_id) {
  parent_id = (typeof parent_id === 'undefined') ? gist_id : parent_id;
  $.get('https://api.github.com/gists/' + gist_id, function (data) {
    var gist = '';
    var postClass = (parent_id === gist_id) ? 'post-box' : 'post-box';
    for (var j in data.files)
      gist = gist + marked.parse(data.files[j].content);
      title = data.files[j].filename;
      updated_at = new Date(data.updated_at);
      timeLength = getTimeLength(updated_at);
    // var dom = '<div id="post' + gist_id + '" class="' + postClass + '" data-time-length="' + timeLength + '">' + '<a href="/gist/' + gist_id + '">' + titleizeMarkdown(title) + '</a>' + ' •  <span class="author"></span>' +
    //           '<span class="author">' + (updated_at.getMonth()+1) + '.' + (updated_at.getDate()) + '.' + updated_at.getFullYear() + '</span>' +
    //           // ' • <span class="author">posted by <a href="https://github.com/' + data.user.login + '">' + data.user.login + '</a></span>' +
    //           '</div>';

      var dom = '<a href="/gist/' + gist_id + '">' + '<div id="post' + gist_id + '" class="' + postClass + '"' + 'data-time-length="' + timeLength + '"' + ' data-parent-id="' + parent_id + '"' + ' data-gist-id="' + gist_id + '">' + '<div class="post-content"><div><span>' + titleizeMarkdown(title) + ' • ' +
            (updated_at.getMonth()+1) + '.' + (updated_at.getDate()) + '.' + updated_at.getFullYear() + '</span></div></div></div></a>';

    // (parent_id === gist_id) ? $(dom).prependTo('#post' + parent_id) : $(dom).appendTo('#post' + parent_id);
    (parent_id === gist_id) ? $(dom).insertBefore('#post' + parent_id) : $(dom).insertAfter('#post' + parent_id);
    forks = data.forks;
      for(var i in forks) {
        thisId = forks[i].id;
        console.log('fork id ' + forks[i].id)
        loadLink(thisId, gist_id);
      }
    }, 'json').done(function() {

  });
}

  

  var highlightPosts = function() {
    $('.post-box').css({"border": "5px solid green"})
  }

  function titleizeMarkdown(title) {
    return title.replace('.md','').replace(/-/g,' ');
  }

  function toTitleCase(str) {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

function loadAllLinks() {
  // $('#loader').show();
  // for (;loaded < toBeLoaded; loaded++) {
  //   queue ++;
  //   $.get('https://api.github.com/gists/' + config.posts[loaded], function (data) {
  //     gist_id = data.id;
  //     loadLink(gist_id);
  //     forks = data.forks;
  //     for(var i in forks) {
  //       thisId = forks[i].id;
  //       loadLink(thisId, gist_id);
  //     }
  //   }, 'json').done(function() {
  //     queue --;
  //     if (queue == 0)
  //       $('#loader').hide();
  //   });
  // }
    $('#loader').show();
    for (;loaded < config.posts.length; loaded++) {
    $.get('https://api.github.com/gists/' + config.posts[loaded], function (data) {
      gist_id = data.id;
      loadLink(gist_id);
      forks = data.forks;
      // for(var i in forks) {
      //   thisId = forks[i].id;
      //   loadLink(thisId, gist_id);
      // }
    }, 'json').done(function() {
        $('#loader').hide();
    });
  }
}

function getRepos() {
  for (var p in config.repos) {
    $.get('https://api.github.com/repos/' + config.gitHubUser + '/' + config.repos[p], function (data) {
      pushed_at = new Date(data.pushed_at);
      timeLength = getTimeLength(pushed_at);
      var dom = '<div class="post-box"'+ ' data-time-length="' + timeLength + '""><div class="post-content"><div><span>' + '<a href="' + data.homepage + '">' + data.description + '</a>' + ' • ' +
              (pushed_at.getMonth()+1) + '.' + (pushed_at.getDate()+1) + '.' + pushed_at.getFullYear() + '</span></div></div>';
              // console.log(dom);
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

function getTimeLength(date){
  today = new Date(Date.now());
  thisDate = new Date(date);
  diff = (today - thisDate)/(24*60*60*1000)
  if(diff < 7){
    return "past-week";
  }
  else if(diff < 30){
    return "past-month";
  }
  else{
    return "past-year";
  }
}


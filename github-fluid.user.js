// ==UserScript==
// @name        GithubHelper
// @description Unread notifcation tracking and icon bouncing
// @namespace   http://bigethan.com/
// @homepage    http://github.com/bigethan/github/
// @author      Ethan Schlenker (inspired by Stephen Celis & Githubbub)
// @include     http*://github.com/*
// ==/UserScript==

(function () {

  var unreadCount = 0,
      watchUsers = ['an','array','of','github-usernames','that-will','badge-the-app','when-they-have-open-pulls'],
      bugNameRe = /([A-Z]{2,}-[0-9]{1,})/g, //regex to find mentioned bugs
      bugRepoLinkRepl = '<a href="http://url.of.your.bug.tracker/view/$1">$1</a>',
      allPullsUrl = 'https://github.com/your-account-here-perhaps/dashboard/pulls';

  var getUsersPullRequests = function(users) {
    $.get(allPullsUrl, { cb :  Date.now() }, function (data) {
      parseUserPullRequests(data, users);
    }, 'html');
  };


  var parseUserPullRequests = function(data, watchUsers) {
    var openPulls = 0,
        unreadPulls = 0;
    var divs = $(data).filter(function(){ return $(this).is("div"); });

    if(divs.length > 0) {

      pullUsers = divs.first().find('.gravatar + a');
      pullUsers.each(function(){
        if($.inArray(this.text, watchUsers) != -1) {
          openPulls++;
          if($(this).parents('.unread').length > 0) {
            unreadPulls++;
          }
        }
      });

      var prevOpen = parseInt(localStorage.getItem('userPulls'), 10);
      localStorage.setItem('userPulls', openPulls);
      localStorage.setItem('unreadPulls', unreadPulls);
      localStorage.setItem('prevuserPulls', prevOpen);
      //console.log(type + ':' + unreadCount);
    }
  };

  var setBadge = function()
  {

    getUsersPullRequests(watchUsers);
    setTimeout(function(){
      var prevPulls = localStorage.getItem('prevuserPulls');
      var openPulls = localStorage.getItem('userPulls');
      var unreadPulls = localStorage.getItem('unreadPulls');
      var openString = openPulls;
      var unreadString = unreadPulls > 0 ? ' | ' + unreadPulls : '';
      
      window.fluid.dockBadge = openPulls > 0 ? openString + unreadString : null;
      if(openPulls > prevPulls)
        window.fluid.requestUserAttention(false); // bounce once if soemthing came in
    }, 3000);


  };

  var noWhitespaceDiffs = function()
  {
    //github's pjax makes this not work
    $('a').each(function(){
      var href = $(this).attr('href');
      if (href && (href.indexOf('pull') != -1 || href.indexOf('commit') != -1)) {
        $(this).attr('href', href + '?w=0');
      }
    });
  };

  var linkifyBugNames = function()
  {
    var dtt = $('.discussion-topic-title'),
        cb = $('.comment-body');

    if(dtt.length) {
      dtt.each(function(index){
        var $this = $(this);
        $this.html($this.html().replace(bugNameRe, bugRepoLinkRepl));
      });
    }

    if(cb.length) {
      cb.each(function(index){
        var $this = $(this);
        $this.html($this.html().replace(bugNameRe, bugRepoLinkRepl));
      });
    }
  };


  setBadge();
  noWhitespaceDiffs();
  linkifyBugNames();

  setInterval(
    setBadge,
    90 * 1000);
})();


// ==UserScript==
// @name        GithubHelper
// @description Unread notifcation tracking and icon bouncing, and some visual tweaks.
//add this to your userstyles
//  ::-webkit-scrollbar {
//    -webkit-appearance: none;
//    width: 8px;
//  }
//  
//  ::-webkit-scrollbar-track {
//    background-color: rgba(255,255,255, .6);
//    border-radius: 8px;
//  }
//  ::-webkit-scrollbar-thumb {
//    border-radius: 8px;
//    background-color: rgba(106, 106, 106, .6);
//  }
//
// So that you can easily see when code is wide.
// 
// Add a bookmarklet of "javascript:hideOthers();" to hide the pull
// requests of people you're not watching
//
// @namespace   http://bigethan.com/
// @homepage    http://github.com/bigethan/github/
// @author      Ethan Schlenker (inspired by Stephen Celis & Githubbub)
// @include     http*://github.com/*
// ==/UserScript==

(function () {

  var unreadCount = 0,
      watchUsers = ['michal-trulia','jake-trulia','vlum-trulia','mbarnicle-trulia','ethan-trulia','rfriberg-trulia'],
      bugNameRe = /([A-Z]{2,}-[0-9]{1,})/g, //regex to find mentioned bugs
      bugRepoLinkRepl = '<a href="http://jira.corp.trulia.com/jira/browse/$1">$1</a>',
      reposToWatch = ['trulia/web', 'trulia/common', 'trulia/db_handle','trulia/webservice'],
      allPullsUrl = 'https://github.com/organizations/trulia/dashboard/pulls';

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

  var makeHideOthers = function()
  {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode("window.userWatch = ['" + watchUsers.join("','") +"'];"));
    script.appendChild(document.createTextNode('('+ hideOthersWrap +')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
  };

  var hideOthersWrap = function()
  {
    window.hideOthers = function() {
      $(".list-group-item").hide();
      $(window.userWatch).each(function hidingOthers(i, val){
        $(".list-group-item .gravatar + a[href$='" + val + "']").parents('.list-group-item').show();
      });
    }
  };

  setBadge();
  linkifyBugNames();
  makeHideOthers();


  setInterval(
    setBadge,
    90 * 1000);
})();

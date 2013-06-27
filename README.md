github-fluid-userscript
=======================

A userscript for managing a github repo a little easier (with a focus on pull requests).  

Designed with organization use in mind, where the organization pull request board (https://github.com/organizations/YOUR_ORG/dashboard/pulls) is one
of your primary interfaces for code review and merging features.

Features:
- give it a list of usernames, and it'll:
 - badge the app when they submit a new pull request
 - note when one their pull requests is unread
 - bounce the app's icon once in the dock when their pull request comes in
 - provides a method to bookmarklet that'll hide the Pull Requests of those you don't watch

- Linkify bug tickets. So if you use http://foo.com/BUG-56 it'll convert mentions of BUG-56 into a link to that bug on foo.com


The code for watching various projects that are not under a single org is in the history (it was removed with: https://github.com/bigethan/github-fluid-userscript/commit/c0489fbb9a95db6537bd224e5aaba38338cec8de#github-fluid.user.js)

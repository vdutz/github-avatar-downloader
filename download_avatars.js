var request = require('request');

console.log('Welcome to the Github Avatar Downloader!');

var GITHUB_USER = 'vdutz';
var GITHUB_TOKEN = '5ff676298d5b86d9aa9cd5fea7d66079a41f9195'

function getRepoContributors(repoOwner, repoName, cb) {
  // ...

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  console.log(requestURL)
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});
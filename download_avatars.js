var request = require('request');

console.log('Welcome to the Github Avatar Downloader!');

var GITHUB_USER = 'vdutz';
var GITHUB_TOKEN = '5ff676298d5b86d9aa9cd5fea7d66079a41f9195'

function getRepoContributors(repoOwner, repoName, cb) {
  // ...

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  console.log(requestURL)
  request
          .get({
            uri: requestURL,
            headers: {
             'User-Agent': 'GitHub Avatar Downloader - Student Project'
            }
          }, function(err, response, body) {
            console.log('Response Status Code: ', response.statusCode);
            console.log('Reponse message: ', response.statusMessage);
            bodyParsed = JSON.parse(body)
            cb(err, bodyParsed)
          })
          // .on('error', function (err) {
          //   throw err;
          // })
          // .on('response', function (response) {
          //   console.log('Response Status Code: ', response.statusCode);
          //   console.log('Reponse message: ', response.statusMessage);
          // })
}

getRepoContributors("jquery", "jquery", function(err, result) {
  if (err) {
    throw err
  } else {
    result.forEach(function (value, index) {
      console.log(value["avatar_url"])
    })
  }
});
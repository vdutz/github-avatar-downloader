var request = require('request');
var fs = require('fs');

repoOwner = process.argv[2]
repoName = process.argv[3]

if (!repoOwner || !repoName) {
  console.log('Please enter a repository owner and a repository name. Example:')
  console.log('\tnode download_avatar.js <repoOwner> <repoName>');
  return
}

console.log('Welcome to the Github Avatar Downloader!');

var GITHUB_USER = 'vdutz';
var GITHUB_TOKEN = '5ff676298d5b86d9aa9cd5fea7d66079a41f9195'

function getRepoContributors(repoOwner, repoName, cb) {

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
}

getRepoContributors(repoOwner, repoName, function(err, result) {
  if (err) {
    throw err
  } else {
    result.forEach(function (value, index) {
      url = value["avatar_url"]
      filePath = "avatars/" + value["login"] + ".jpg"
      //console.log(value["avatar_url"])
      downloadImageByURL(url, filePath)
    })
  }
});

function downloadImageByURL(url, filePath) {
  request.get(url)
          .on('error', function (err) {
            console.log("TEST")
            throw err;
          })
          .on('response', function (response) {
            console.log('Response Status Code: ', response.statusCode);
          })
          .pipe(fs.createWriteStream(filePath));
}

// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")


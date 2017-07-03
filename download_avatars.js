var request = require('request');
var fs = require('fs');


require('dotenv').config(). // Requiring and configuring dotenv


// Accessing environment variables stored in .env file
var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;


// Capturing command line arguments from user
repoOwner = process.argv[2];
repoName = process.argv[3];


// Testing to ensure that user has passed both of the necessary arguments
if (!repoOwner || !repoName) {
  console.log('Please enter a repository owner and a repository name. Example:');
  console.log('\tnode download_avatar.js <repoOwner> <repoName>');
  return;
}


console.log('Welcome to the Github Avatar Downloader!');

// This is the main function which makes a HTTP request to the Github API in order to access the list of contributors for a repository
function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  request
          .get({
            uri: requestURL,
            headers: {
             'User-Agent': 'GitHub Avatar Downloader - Student Project'
            } // The last line here adds a User-Agent heading, because the Github API will not respond with a blank heading
          }, function(err, response, body) {
            console.log('Response Status Code: ', response.statusCode);
            console.log('Reponse message: ', response.statusMessage);
            bodyParsed = JSON.parse(body)
            cb(err, bodyParsed); // The callback function is called with the body content parsed to a JSON format
          });
};


// The main function below is called with the command line arguments and an anonymous callback function
getRepoContributors(repoOwner, repoName, function(err, result) {
  if (err) {
    throw err;
  } else {
    result.forEach(function (value, index) { // Iterate through each contributor object
      url = value["avatar_url"]; // Get that contributor's avatar URL
      filePath = "avatars/" + value["login"] + ".jpg"; // Get that contributor's login name and creat a filepath with it
      downloadImageByURL(url, filePath);
    });
  };
});


function downloadImageByURL(url, filePath) {
  request.get(url)
          .on('error', function (err) {
            throw err;
            return;
          })
          .on('response', function (response) {
            //console.log('Response Status Code: ', response.statusCode);
          })
          .pipe(fs.createWriteStream(filePath));  // write avatar image at URL to filePath
};

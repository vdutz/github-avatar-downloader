var request = require('request');
var fs = require('fs');


require('dotenv').config() // Requiring and configuring dotenv

// Accessing environment variables stored in .env file
var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Testing to ensure that the .env file exists in the working directory
if (!fs.existsSync('.env')) {
  console.log("The .env file is missing in the current directory. Please create it and add the environment variables for your Github username and your Github token as follows: \n\tGITHUB_USER=<Your Github Username>\n\tGITHUB_TOKEN=<Your Github Token>\n");
  return;
}

// Testing to ensure that environment variables appear in .env file
if (!GITHUB_USER || !GITHUB_TOKEN) {
  console.log("You are missing a Github User value or a Github Token value in your .env file.  Please add them to your .env file as follows:  \n\tGITHUB_USER=<Your Github Username>\n\tGITHUB_TOKEN=<Your Github Token>\n");
  return;
}

// Testing to make sure that the user has passed exactly two arguments
numberOfArgs = process.argv.slice(2).length
if (numberOfArgs !== 2) {
  console.log('Please enter exactly two arguments (a repository owner and a repository name) as follows:');
  console.log('\tnode download_avatar.js <repoOwner> <repoName>');
  return;
}

// Capturing command line arguments from user
repoOwner = process.argv[2];
repoName = process.argv[3];

// Testing to ensure that the "avatars" folder exists in the working directory
if (!fs.existsSync('avatars')) {
  fs.mkdir('avatars');
}


// console.log('Welcome to the Github Avatar Downloader!');

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
            if (response.statusCode === 404) {
              console.log("The repository you were searching does not seem to exist.  Please check that your repoOwer and repoName are correct and try again.");  // Testing to ensure that the provided owner/repo exists
              return;
            }
            if (response.statusCode === 401) {
              console.log("The Github token that you have in the .env file is incorrect.  Please check it and try again.");
              return;  // Testing to ensure that the credentials entered are correct
            }
            console.log('Welcome to the Github Avatar Downloader!');
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
  console.log("Program complete. Please check your avatars folder to find the contributor avatars for the requested Github repository.")
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

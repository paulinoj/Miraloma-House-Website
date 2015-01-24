var http  = require('http');
var fs    = require('fs');
var path  = require('path');
var cache = {};



// Utility function that downloads a URL and invokes
// callback with the data.
function download(url, callback) {
  http.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}

var cheerio = require("cheerio");


function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}


var server = http.createServer(function(request, response) {
  var filePath = false;
  if (request.url == '/') {

    response.writeHead(200, {"Content-Type": "text/html"}); 
    response.write("<html><head><meta charset='UTF-8' />");
    response.write("</head><body>");

    var url = "http://services.my511.org/Transit2.0/GetNextDeparturesByStopCode.aspx?token=b5aa84c1-2239-4d74-ae05-af97d20cdd55&stopcode=16666";

    download(url, function(data) {
      if (data) { 
        console.log(data);
        response.write("Hi John");
        var $ = cheerio.load(data, {xmlMode : true});
        console.log(data);
        $("Route").each(function (i, e) {
            response.write("<p>");
            response.write($(e).attr("Name"));
            response.write("</p>");
          });

        response.write("</body>");
        response.write("</html>");
      }
      else console.log("error");  
    });

  };

});

server.listen(3000, function() {
          console.log("Server listening on port 3000.");
});





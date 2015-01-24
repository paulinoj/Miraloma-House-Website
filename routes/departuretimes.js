
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

function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}


// The following route downloads real time bus departure information from 511.org API
// for a given bus stop ID, and delivers it to transportation view in xml format.
// It is called when a get request is made to /departure by XMLHttp Objects on the transportation page,
// with the Bus Stop ID included in the request as a parameter.  These XMLHttp requests are made 
// every 10 seconds to keep the information on the transportation page current.


exports.departureTimes = function(req, res){

    var url = "http://services.my511.org/Transit2.0/GetNextDeparturesByStopCode.aspx?token=b5aa84c1-2239-4d74-ae05-af97d20cdd55&stopcode=" + req.param("stopID");

    download(url, function(data) {

      if (data) { 
        res.writeHead(200, {"Content-Type": "application/xml"});
        res.end(data);
        console.log(data);
      };
    });

};

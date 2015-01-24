var Entry = require('../lib/entry');
var sanitizeHTML = require('sanitize-html');

// sanitizeHTML is used to strip HTML tags
// out of data submitted from form on comments page


// todaysDate function is used to save the date a comment is submitted
// and saved in redis

function todaysDate() {
	  var today = new Date();
	  var dd = today.getDate();
	  var mm = today.getMonth()+1;
	  var yyyy = today.getFullYear();

	  if (dd < 10) {
	    dd = '0' + dd;
	  }

	  if (mm < 10) {
	    mm = '0' + mm;
	  }

	  today = mm+'/'+dd+'/'+yyyy;
	  return today;
}


// This is the route for displaying comments page,
// which includes the comments fill-in form and the comments that have already been submitted.
// Called after a get request to /post.

exports.form = function(req, res) {

	Entry.getRange(0, -1, function(err, entries) {
		if (err) return next(err);

		res.render('post', {
			title: 'Please leave your comments',
			entries: entries
		});
	});

};

// This is the route for creating new comment Entries in redis
// after input from form on comments page is submitted.
// It then redirects to /post to redisplay the form and show comments underneath.
// Called after a post request to /post.

exports.submit = function(req, res, next) {
	var data = req.body.entry;

	var entry = new Entry({
		"username": sanitizeHTML(data.name, {allowedTags: []}),
		"title": sanitizeHTML(data.title, {allowedTags: []}),
		"body": sanitizeHTML(data.body, {allowedTags: []}),
		"date": todaysDate()		
	});

	entry.save(function(err) {
		if (err) return next(err);
		res.redirect('/post');
	});
};
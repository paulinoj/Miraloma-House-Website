// Create Entry model in Redis
// Used for storing comments entered on comments page (post.ejs)

if (process.env.REDISTOGO_URL) {
	var rtg = require("url").parse(process.env.REDISTOGO_URL);
	var db = require("redis").createClient(rtg.port, rtg.hostname);

	db.auth(rtg.auth.split(":")[1]);
} else {
	var db = require("redis").createClient();
}

module.exports = Entry;

function Entry(obj) {
	for (var key in obj) {
		this[key] = obj[key];
	}
}

Entry.prototype.save = function(fn) {
	var entryJSON = JSON.stringify(this);

	db.lpush(
		'entries',
		entryJSON,
		function(err)	{
			if (err) return fn(err);
			fn();
		}
	);
};

Entry.getRange = function(from, to, fn) {
	db.lrange('entries', from, to, function(err, items) {
		if (err) return fn(err);
		var entries = [];

		items.forEach(function(item) {
			entries.push(JSON.parse(item));		
		});
		fn(null, entries);
	});
};
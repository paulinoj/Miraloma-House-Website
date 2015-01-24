// route called by get request to root (home page)

exports.index = function(req, res){
  res.render('index');
};
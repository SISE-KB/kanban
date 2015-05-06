var express = require('express')
   ,fs = require('fs')
 //  ,multipart = require('connect-multiparty')
  multer         = require('multer')


   

exports.addRoutes = function(app, config) {
	var publicDir  = config.server.distFolder
	   ,uploadDir  = publicDir+"/uploads"
	 //  ,multipartMiddleware = multipart({uploadDir: uploadDir})
	
	app.use(express.static(publicDir))
	app.use(multer({ dest: uploadDir }))
	//app.use(config.server.staticUrl,express.static(publicDir))
	app.get('/', function(req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: config.server.distFolder });
     });
     app.get('/favicon.ico', function(req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('favicon.ico', { root: config.server.distFolder });
     });
	app.get('/images', function(req, res) {
		var files=fs.readdirSync(uploadDir);
		res.json(files);
	})
  /*
   app.post('/upload', multipartMiddleware, function(req, res) {
      var file = req.files.myFile
      res.json({oldName:file.name,newName:file.path})

   })*/
   app.post('/upload.html', function(request, response) {
        var count = request.files.file.length;
        response.status(200).send(JSON.stringify({ success: true, fileCount: count }));
    })

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  var err = new Error('Not Found')
	  err.status = 404
	  next(err)
	})

	// error handlers

	if (app.get('env') === 'development') {
	  app.use(function(err, req, res, next) {
		res.status(err.status || 500)
		res.json({
		  message: err.message,
		  error: err
		})
	  })
	}

// production error handler
// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500)
	  res.json({
		message: err.message,
		error: {}
	  })
	})
}

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
     
	app.get('/images/:userCode', function(req, res) {
		var userCode=req.params.userCode
		var files=fs.readdirSync(uploadDir+'/'+userCode);
		res.json(files);
	})

   app.post('/upload/:userCode', function(request, response) {
        var count = request.files.file.length;
        var userCode=request.params.userCode
		var files=[];

		if(!fs.existsSync(uploadDir+'/'+userCode)){//不存在就创建一个
            fs.mkdirSync(uploadDir+'/'+userCode, 0755);
        }
		if(!count) {
			 var fn=request.files.file.name;
			 var oldFn=request.files.file.originalname;
			 console.log(oldFn,fn);
			 files.push(oldFn);
			 fs.renameSync(uploadDir+'/'+fn,
			                  uploadDir+'/'+userCode+'/'+oldFn);
		}	                  
		else for(var i=0;i<count;i++){
			 var fn=request.files.file[i].name;
			 var oldFn=request.files.file[i].originalname;
		     files.push(oldFn);
		     fs.renameSync(uploadDir+'/'+fn,
			                  uploadDir+'/'+userCode+'/'+oldFn);
		}
		
        response.status(200).send(JSON.stringify({ success: true, fileCount: count,names:files }));
    })

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  var err = new Error('Not Found')
	  err.status = 404
	  next(err)
	})
/*

	if (app.get('env') === 'development') {
	  app.use(function(err, req, res, next) {
		res.status(err.status || 500)
		res.json({
		  message: err.message,
		  error: err
		})
	  })
	}
*/
// production error handler
// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500)
	  res.json({
		message: err.message,
		error: err
	  })
	})
}

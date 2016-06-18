var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

//Array of mime types.
var mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg": "image/jpeg",
	"png": "image/png",
	"js": "text/javascript",
	"css": "text/css"
};

http.createServer(function(req, res){

	var uri = url.parse(req.url).pathname;
	var filename = path.join(process.cwd(), unescape(uri));
	console.log('Loading '+ uri);

	var stats;
	try{
		stats = fs.lstatSync(filename);
	}
	catch(e){
		res.writeHead(400, {'Content-Type': 'text/plain'});
		res.end('Opps! Resource Not Found. \n');
		return;
	}

	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];

		var fileStream = fs.createReadStream(filename);
		fileStream.pipe(res);
	}
	else if(stats.isDirectory()){
		res.writeHead(302, 
			{ 'Location': 'index.html'}
		);
		res.end();
	}
	else {
		res.writeHead(500, 
			{ 'Content-Type': 'text/palin'}
		);
		res.end('500 Internal Error\n');
	}
}).listen(3000, 'localhost');

console.log('server runnig on port 3000.');
var http = require('http');
var https = require('https');
var socketio = require('socket.io');
var fs = require('fs');
var pk = fs.readFileSync('./key.pem')
var pc = fs.readFileSync('./cert.pem')
var opts = { key: pk, cert: pc };
var url = require('url')
var path = require('path')
var port = process.argv[2] || 8888;

// var server = http.createServer(function(request, response) {
var server = https.createServer(opts, function(request, response) {
    // res.writeHead(200, {'Content-Type' : 'text/html'});
    // res.end(fs.readFileSync(__dirname + '/index.html', 'utf-8'));
    var Response = {
        "200":function(file, filename){
            var extname = path.extname(filename);
            var header = {
                "Access-Control-Allow-Origin":"*",
                "Pragma": "no-cache",
                "Cache-Control" : "no-cache"
            }

            response.writeHead(200, header);
            response.write(file, "binary");
            response.end();
        },
        "404":function(){
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();

        },
        "500":function(err){
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err + "\n");
            response.end();

        }
    }


    var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists){
        console.log(filename+" "+exists);
        if (!exists) { Response["404"](); return ; }
        if (fs.statSync(filename).isDirectory()) { filename += '/index.html'; }

        fs.readFile(filename, "binary", function(err, file){
        if (err) { Response["500"](err); return ; }
            Response["200"](file, filename);
        });

    });

}).listen(3000);  // ポート競合の場合は値を変更

var io = socketio.listen(server);
io.sockets.on('connection', function(socket) {
    socket.on('client_to_server', function(data) {
        io.sockets.emit('server_to_client', {value : data.value});
        console.log(data.value)
    });
});



var os = require('os')
console.log(getLocalAddress());
function getLocalAddress() {
    var ifacesObj = {}
    ifacesObj.ipv4 = [];
    ifacesObj.ipv6 = [];
    var interfaces = os.networkInterfaces();

    for (var dev in interfaces) {
        interfaces[dev].forEach(function(details){
            if (!details.internal){
                switch(details.family){
                    case "IPv4":
                        ifacesObj.ipv4.push({name:dev, address:details.address});
                    break;
                    case "IPv6":
                        ifacesObj.ipv6.push({name:dev, address:details.address})
                    break;
                }
            }
        });
    }
    return ifacesObj;
};

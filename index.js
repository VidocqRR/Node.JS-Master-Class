var http = require('http')
var url = require('url')
var StringDecoder = require('string_decoder').StringDecoder
var config = require('./config')
var https = require('https')


var server = http.createServer((req,res)=> {
    uniqueserver(req,res)
    })

server.listen(config.port,function() {
    console.log('The server startting now')
});

var HttpsServer = https.createServer((req,res) => {
    uniqueserver(req,res)
})
HttpsServer.listen(config.porthttps,function ()  {
    console.log('Https runnning now')
})

var uniqueserver  = function(req,res) {
    var ParseUrl = url.parse(req.url,true)
    var path = ParseUrl.pathname
    var trimmedPath = path.replace(/^\/+|\/+$/g,'')
    var method = req.method
    var queryStringObject = ParseUrl.query
    var headers = req.headers

    var decoder = new StringDecoder('utf-8')
    var buffer = ''
    req.on('data',function(data) {
        buffer += decoder.write(data)
    })
    req.on('end',function() {
        buffer += decoder.end()

        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        };

        
        chosenHandler(data,function(statusCode,payload) {
            statusCode = typeof (statusCode) == 'number' ? statusCode:200
            payload = typeof (payload) == 'object' ? payload : {}
            var payloadString = JSON.stringify(payload)
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode)
            res.end(payloadString)

            console.log('Running now',statusCode,payloadString)
        })
    })
}

var handlers = {}

  handlers.hello = function(data,callback) {
    callback(406,{'Hello':'How are you?'})
  };

  handlers.notFound = function(data,callback) {
    callback(404)
  }

  handlers.about = function(data,callback) {
      callback(200,{'Hello':'This is about'})
  }
  handlers.notFound=(data,callback)=> {
      callback(404)
}
var router = {
    'hello' : handlers.hello,
    'about' : handlers.about
}

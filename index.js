var express = require('express')
var app = express()
var logger = require('fluent-logger')
var bodyParser = require('body-parser')
var lookup_request=require('request')

logger.configure('fluentd.s3', {
   host: 'localhost',
   port: 24224,
   timeout: 3.0,
   reconnectInterval: 600000 // 10 minutes
});

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());

app.get('/', function(request, response) {
  // for health check
  response.send()
})

app.post('/', function(request, response) {
  //var url = 'http://drnd-server4.nielsen.ninja/v2/acr/CBETID/'+request.body.cbetDetection.id; 
  var url = 'http://localhost:3000/v2/acr/CBETID/'+request.body.cbetDetection.id; 
  var imei = request.body.deviceinfo.IMEI;
  lookup_request(url,function(err,res,body){
     if(err) {
       //log info TBD
       response.status(503).send("Service Unavailable");
     } else if (res.statusCode != 200) {
       //log info TBD
       response.status(res.statusCode).send(body);
     } else { 
       logger.emit(imei, JSON.parse(body));
       response.send(body);
     }
  })
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

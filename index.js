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

app.set('port', (process.env.PORT || 3000))
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());

app.get('/', function(request, response) {
  logger.emit('abcd', {record: 'test'});
  response.send('Hello World!')
})

app.post('/', function(request, response) {
  console.log(request.body);
  var url = 'http://drnd-server4.nielsen.ninja/v2/acr/CBETID/'+request.body.cbetDetection.id; 
  console.log(url);
  lookup_request(url,function(err,res,body){
     if(err) console.log(err);
     if(res.statusCode !== 200) console.log(res.statusCode);
     if(!err && res.statusCode == 200  ) {
       console.log('look up success');
       console.log(body);
     }
  })
  logger.emit('abcd', {record: 'test'});
  response.send('post received')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

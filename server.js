var http = require('https');

function process_request(req,res) {
    console.log('Incoming request::'+ req.url +' '+ req.method);
    res.writeHead(200,{'Content-Type': 'application/json'})
    res.end(JSON.stringify({error:null,data:{}}));
}



var url = 'http://www.quandl.com/api/v3/datasets/6562/data';

var server = http.createServer(process_request);
server.listen(8080,()=>{
    http.get('https://www.quandl.com/api/v3/datasets/6562/data',function(res){
        var body= '';
        res.on('data',function(d) {
            body+=d;
            console.log('new chunk*****************************************************************************************************');
            console.log(body);
        })
    })
})

//const request = require('request');
//
//request({
//    url:'https://www.quandl.com/api/v3/datasets/6562/data',
//    json:true
//    
//},(err,res,body) => {
//    console.log(res);    
//})
//var req = http.get('http://www.quandl.com/api/v3/datasets/6562/data.json',function(response){
//    var body = '';
//    response.on('data',function(d){
//        body += d;
//        console.log(body);
//    })
    
//    response.on('end',function(){
//        var parsed = JSON.parse(body);
//        console.log(parsed);
//    })
//})
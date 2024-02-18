const http = require('node:http'); //common to this native to node dont need to install anything else

const server = http.createServer((req,res)=>{

})

server.on("request",(request,response)=>{
  console.log("______Method_____")
  console.log(request.method)

  console.log("______URL_____")
  console.log(request.url)

  console.log("______Headers_____")
  console.log(request.headers);

  request.on("data",(chunk)=>{
    console.log(chunk.toString("utf-8"));
  })
})

server.listen(8050,()=>{
  console.log('Server listening on port http://localhost:8050');
})
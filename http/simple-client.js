const http = require('node:http');

const agent = new http.Agent({keepAlive: true});

const request = http.request({
  agent: agent,
  hostname:"localhost",
  port:8050,
  method:"POST",
  path:"/create-post",
  header: {
    "Content-Type": "application/json",
    //"Content-Length": Buffer.byteLength(JSON.stringify({message:"Last Message"}),'utf-8') , //bytes

  },
})

request.on("response", (response) =>{

})

request.write(JSON.stringify({message:"Hi there"}))
request.write(JSON.stringify({message:"How are you doing?"}))
request.write(JSON.stringify({message:"are you there?"}))

request.end(JSON.stringify({message:"Last Message"}))
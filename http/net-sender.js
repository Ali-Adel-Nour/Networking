const net = require('net')


const socket = net.createConnection({host:'localhost', port:8050},()=>{

  const req = Buffer.alloc(8);
  req[0]=12;
  req[1]=34;

  socket.write(req)
})

socket.on("data",(chunk)=>{
  console.log("Received Response: ")
  console.log(chunk.toString("utf-8"))
  socket.end()
})

socket.on("end",(err)=>{
  console.log("Connection closed")
})
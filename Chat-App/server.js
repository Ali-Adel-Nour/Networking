const net = require('net')

const server =net.createServer()



server.on("connection", (socket)=>{
  //socket.write()
  console.log(' a new connection to the server ')


  //socket is duplex stream read and write
  socket.on("data", (data)=>{
    socket.write(data)
  })
})
server.listen(3008,"127.0.0.1",()=>{
  console.log("opend server on " ,server.address());
})
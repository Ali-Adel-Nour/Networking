const dgram = require('dgram');


const socket = dgram.createSocket('udp4');

socket.bind(5500,"127.0.0.1")

socket.on("message", (msg,info)=>{


  console.log(`My server got a datagarm ${msg}, from: ${info.adress}:${info.port}`);
})
const http = require('node:http');

const fs = require('node:fs/promises');

const server = http.createServer()


server.on("request",async (req, res) => {
 if (req.url === '/' && req.method === 'GET'){
  res.setHeader('Content-Type', 'text/html');

  const fileHandle = await fs.open("./public/index.html","r")
  const fileStream = fileHandle.createReadStream();

  fileStream.pipe(res)

 }


 if(req.url === '/style.css' && req.method === 'GET'){
   res.setHeader('Content-Type', 'text/css');

   const fileHandle = await fs.open("./public/style.css","r")
   const fileStream = fileHandle.createReadStream();

   fileStream.pipe(res)

  }

  if(req.url === '/scripts.js' && req.method === 'GET'){
    res.setHeader('Content-Type', 'application/javascript');

    const fileHandle = await fs.open("./public/scripts.js","r")
    const fileStream = fileHandle.createReadStream();

   fileStream.pipe(res)

  }

})

server.listen(9000,()=>{
  console.log('Web server is live at http://localhost:9000')
})
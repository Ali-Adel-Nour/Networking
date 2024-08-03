const http = require("node:http")

const fs = require("node:fs/promises")

class Ali {


  constructor() {
    this.server = http.createServer();
    /**
     * {
     *  "get/": () => { ... },
     *  "post/upload": () => { ... }
     * }
     *
     *
     * this.routes["get/"]()
     *
     */
    this.routes = {};

    this.server.on("request", (req, res) => {
      // Send a file back to the client
      res.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();

        res.setHeader("Content-Type", mime);

        fileStream.pipe(res);
      };

      res.status = (code) => {
        res.statusCode = code;
        return res;
      }
res.writableHighWaterMak
      res.json = (data)=>{
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      }

      if (!this.routes[req.method.toLowerCase() + req.url]) {

        return res.status(404).json({ error: `Cannot ${req.method} ${req.url}` })
      }

      this.routes[req.method.toLocaleLowerCase() + req.url](req, res);
    });
  }

  route(method, path, cb) {
    this.routes[method + path] = cb;
  }

  listen(port, cb) {
    this.server.listen(port, () => {
      cb();
    });
  }
}



module.exports = Ali
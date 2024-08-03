const Ali = require("./ali")


const PORT = 4060

const server = new Ali()

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/style.css", (req, res) => {
  res.sendFile("./public/style.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});




server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
const Ali = require("./ali")


const PORT = 4060

const server = new Ali()

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html")
})



server.route("get", "/upload", (req, res) => {
  res.status(404).sendFile("")
})

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
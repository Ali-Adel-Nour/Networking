const Ali = require("../simple-web/ali");

const SESSIONS = [];

const USERS = [
  { id: 1, name: "Ali Adel", username: "ali", password: "string" },

  { id: 2, name: "Maria", username: "maria00", password: "string" },


  { id: 3, name: "Nour", username: "nour007", password: "string" },



]

const POSTS = [
  {
    id: 1,
    title: "Post 1",
    body: "lorem ipsum dolor sit am",
    userId: 1,
  }
]

const PORT = 9001


const server = new Ali()



//File Routes

server.route("get", '/', (req, res) => {
  res.sendFile("./public/index.html", "text/html")
})

server.route("get", '/login', (req, res) => {
  res.sendFile("./public/index.html", "text/html")
})


server.route("get", '/profile', (req, res) => {
  res.sendFile("./public/index.html", "text/html")
})

server.route("get", '/styles.css', (req, res) => {
  res.sendFile("./public/styles.css", "text/css")
})


server.route("get", '/scripts.js', (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript")
})


//Json Routes


server.route("post", '/api/login', (req, res) => {

  let body = ""

  req.on("data", (chunk) => {
    body += chunk.toString("utf-8")
  })
  req.on("end", () => {
    body = JSON.parse(body)

    const username = body.username
    const password = body.password

    const user = USERS.find((user) => user.username === username)


    if (user && user.password === password) {


      const token = Math.floor( Math.random( ) * 1000000000000000).toString()

      //Save The Genrated Token

      SESSIONS.push( { userId:user.id, token:token } )

      res.setHeader("Set-Cookie", `token=${token}; Path=/;`)


      res.status(200).json({ message: "Login Successful" })

    } else {
      res.status(401).json({ message: "Login Failed" })
    }
  })
})


server.route("get","/api/user",(req,res)=>{

  const token = req.headers.cookie.split("=") [1]

  const session = SESSIONS.find((session) => session.token === token)

  if (session){
console.log("Sending the user info......")
  }else{
    res.status(401).json({ error: "Unauthorized" })
  }
  console.log(token)
})

//send all post routes I have
server.route("get", "/api/posts", (req, res) => {




  const posts = POSTS.map(post => {
    const user = USERS.find(user => user.id === post.userId);

    post.author = user.name;
    return post;
  });

  res.status(200).json(posts);
});



server.listen(PORT, () => {
  console.log("Server has started on port " + PORT)
});

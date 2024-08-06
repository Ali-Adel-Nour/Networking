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
    title: "This is a post title",
    body: "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    userId: 1,
  },
];

const PORT = 9001;

const server = new Ali();

// For authentication
server.beforeEach((req, res, next) => {
  const routesToAuthenticate = [
    "GET /api/user",
    "PUT /api/user",
    "POST /api/posts",
    "DELETE /api/logout",
  ];

  if (routesToAuthenticate.indexOf(req.method + " " + req.url) !== -1) {
    // If we have a token cookie, then save the userId to the req object
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];

      const session = SESSIONS.find((session) => session.token === token);
      if (session) {
        req.userId = session.userId;
        return next();
      }
    }

    return res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
});

const parseJSON = (req, res, next) => {
  // This is only good for bodies that their size is less than the highWaterMark value
  if (req.headers["content-type"] === "application/json") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf-8");
    });

    req.on("end", () => {
      body = JSON.parse(body);
      req.body = body;
      return next();
    });
  } else {
    next();
  }
};

// For parsing JSON body
server.beforeEach(parseJSON);

// For different routes that need the index.html file
server.beforeEach((req, res, next) => {
  const routes = ["/", "/login", "/profile", "/new-post"];

  if (routes.indexOf(req.url) !== -1 && req.method === "GET") {
    return res.status(200).sendFile("./public/index.html", "text/html");
  } else {
    next();
  }
});

// ------ Files Routes ------ //

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

// ------ JSON Routes ------ //

// Log a user in and give them a token
server.route("post", "/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if the user exists
  const user = USERS.find((user) => user.username === username);

  // Check the password if the user was found
  if (user && user.password === password) {
    // At this point, we know that the client is who they say they are

    // Generate a random 10 digit token
    const token = Math.floor(Math.random() * 10000000000).toString();

    // Save the generated token
    SESSIONS.push({ userId: user.id, token: token });

    res.setHeader("Set-Cookie", `token=${token}; Path=/;`);
    res.status(200).json({ message: "Logged in successfully!" });
  } else {
    res.status(401).json({ error: "Invalid username or password." });
  }
});

// Log a user out
server.route("delete", "/api/logout", (req, res) => {
  // Remove the session object form the SESSIONS array
  const sessionIndex = SESSIONS.findIndex(
    (session) => session.userId === req.userId
  );
  if (sessionIndex > -1) {
    SESSIONS.splice(sessionIndex, 1);
  }
  res.setHeader(
    "Set-Cookie",
    `token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
  res.status(200).json({ message: "Logged out successfully!" });
});

// Send user info
server.route("get", "/api/user", (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  res.json({ username: user.username, name: user.name });
});

// Update a user info
server.route("put", "/api/user", (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;

  // Grab the user object that is currently logged in
  const user = USERS.find((user) => user.id === req.userId);

  user.username = username;
  user.name = name;

  // Only update the password if it is provided
  if (password) {
    user.password = password;
  }

  res.status(200).json({
    username: user.username,
    name: user.name,
    password_status: password ? "updated" : "not updated",
  });
});

// Send the list of all the posts that we have
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user.name;
    return post;
  });

  res.status(200).json(posts);
});

// Create a new post
server.route("post", "/api/posts", (req, res) => {
  const title = req.body.title; // the title of the post
  const body = req.body.body; // the body of the post

  const post = {
    id: POSTS.length + 1,
    title: title,
    body: body,
    userId: req.userId,
  };

  POSTS.unshift(post);
  res.status(201).json(post);
});

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

const http = require("http");

// The proxy's port
const PORT = 9000;

// List of our backend servers
const mainServers = [
  { host: "localhost", port: 9001 },
  { host: "localhost", port: 9002 },
];

// Create the proxy server
const proxy = http.createServer();

proxy.on("request", (clientRequest, proxyResponse) => {
  // Select a server to route the incoming request to (using round-robin algorithm)
  const mainServer = mainServers.shift();
  mainServers.push(mainServer);

  // The request that we are sending to one of our main servers
  const proxyRequest = http.request({
    host: mainServer.host,
    port: mainServer.port,
    path: clientRequest.url,
    method: clientRequest.method,
    headers: clientRequest.headers,
  });

  // Once we receive a response from one of our main servers
  proxyRequest.on("response", (mainServerResponse) => {
    // Set the status code and headers for the response that we are sending to the client
    proxyResponse.writeHead(
      mainServerResponse.statusCode,
      mainServerResponse.headers
    );

    // Finally write the body of the main server's response to the body of proxy's response
    // and send the response to the client
    mainServerResponse.pipe(proxyResponse);
  });

  // Our proxy should be extremely robust, so the more error handling we do, the better.
  // We don't want our proxy to go down no matter what happens in the main servers
  proxyRequest.on("error", (e) => {
    console.log(e);
  });

  // Write the body of the client's request to the body of proxy's request being made
  // to one of our servers
  clientRequest.pipe(proxyRequest);
});

proxy.listen(PORT, () => {
  console.log(`Proxy server is now listening on port ${PORT}`);
});

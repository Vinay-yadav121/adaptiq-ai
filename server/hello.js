// Load Node's built-in HTTP module (nothing to install)
const http = require("http");

// Create a server. This function runs every time someone makes a request.
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" }); // 200 means OK
  res.end("AdaptIQ AI server is running!");             // the reply we send back
});

// Wait for requests on port 5001 (5000 was already in use)
server.listen(5001, () => {
  console.log("Server listening on http://localhost:5001");
});
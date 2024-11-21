const http = require("http");
const url = require("url");
const getFBInfo = require("@xaviabot/fb-downloader");

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  // Parse the request URL
  const parsedUrl = url.parse(req.url, true);

  // Only respond to the desired endpoint and method
  if (parsedUrl.pathname === "/" && req.method === "GET") {
    const videoUrl = parsedUrl.query.url; // Get the "url" query parameter

    // Validate the video URL
    if (!videoUrl) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end("<h1 style='color: red;'>Error: Missing 'url' query parameter</h1>");
      return;
    }

    try {
      // Call getFBInfo to fetch video info
      const result = await getFBInfo(videoUrl);

      // Generate the HTML response
      const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Facebook Video Info</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: #f9f9f9;
              color: #333;
            }
            h1 {
              color: #007BFF;
            }
            .container {
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              background: white;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .info {
              margin-bottom: 10px;
            }
            .info strong {
              color: #555;
            }
            a {
              color: #007BFF;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Facebook Video Info</h1>
            <div class="info"><strong>Video URL:</strong> <a href="${result.url}" target="_blank">${result.url}</a></div>
            <div class="info"><strong>Title:</strong> ${result.title || "N/A"}</div>
            <div class="info"><strong>SD Video:</strong> ${
              result.sd
                ? `<a href="${result.sd}" target="_blank">Download SD</a>`
                : "N/A"
            }</div>
            <div class="info"><strong>HD Video:</strong> ${
              result.hd
                ? `<a href="${result.hd}" target="_blank">Download HD</a>`
                : "N/A"
            }</div>
            <div class="info"><strong>Thumbnail:</strong> ${
              result.thumbnail
                ? `<a href="${result.thumbnail}" target="_blank">View Thumbnail</a>`
                : "N/A"
            }</div>
          </div>
        </body>
        </html>
      `;

      // Respond with the HTML
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(htmlResponse);
    } catch (error) {
      // Handle errors
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(`<h1 style='color: red;'>Error: Failed to fetch video info</h1><p>${error.message}</p>`);
    }
  } else {
    // Handle invalid endpoints
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1 style='color: red;'>404: Endpoint not found</h1>");
  }
});

// Start the server on a specified port
const PORT = 7001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

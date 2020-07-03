const functions = require("firebase-functions");
const app = require("./util/df_config").default;
const fs = require("fs");
const path = require("path");

app.intent("Default Welcome Intent", require("./welcome.js").default);
app.intent("health", require("./health.js").default);
app.intent("icecream", require("./icecream.js").default);
app.intent("kitchensink", require("./kitchensink.js").default);

const MASTER_CONFIG = {
  webhook: "/webhook",
  backend: "/chat",
};

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (req, res, next) => {
    const { webhook, backend } = MASTER_CONFIG;

    // console.log('##', req, req.body)
    const RIG = {
      ["req.path"]: req.path,
      ["req.originalURL"]: req.originalURL,

      ["req.url"]: req.url,
    };
    console.log(`**All values:`, JSON.stringify(RIG));

    if (req.method === "GET") {
      if (req.url === backend) {
        res.status(200).send("TODO: backend");
      }
      if (req.url === webhook) {
        res.status(200).send("TODO: webhook");
      }

      // otherwise do static

      return res.status(200).send(`TEST ${Math.random()}`);
    }
    console.log(`**All values:`, JSON.stringify(RIG));
    // Also do fast import

    // Forward files
    return res.status(200).sendFile(`${__dirname}/public/index.html`);
    // if (req.originalURL === FROM_SETTINGS) {
    //     return res.status(200).sendFile(`${__dirname}/public/index.html`)
    // } else {
    //     next()
    // }
  }
);
const x = (x) => {
  console.log("x");
};

function staticFiles(request, response) {
  // MIME Map: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
  let filePath = "." + request.url;
  if (filePath == "./") {
    filePath = "./index.html";
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == "ENOENT") {
        fs.readFile("./404.html", function (error, content) {
          response.writeHead(404, {
            "Content-Type": "text/html",
          });
          response.end(content, "utf-8");
        });
      } else {
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
      }
    } else {
      response.writeHead(200, {
        "Content-Type": contentType,
      });
      response.end(content, "utf-8");
    }
  });
}

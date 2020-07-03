// @ts-nocheck
const fse = require("fs-extra");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
function askQuestion(questionString) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(questionString, function (res) {
      resolve(res);
      rl.close();
    });
  });
}

const buildFinale = (
  pathString,
  project_id,
  deploy_command = "npm run deploy"
) => {
  console.log(`Done!

Run the following commands to deploy:

1) cd ${pathString}

2) npm i

3) firebase deploy

3a) ${deploy_command}

If successful, see your function URL & activity logs here: 

https://console.firebase.google.com/project/${project_id}/functions


Note, you'll need firebase tools installed & authenticated, see here:
https://github.com/valgaze/df-cheatkit/blob/master/docs/firebase.md

If asked, enter "n" or "No" when it asks if you want to delete other functions

`);
};

const template_TOP = `const functions = require('firebase-functions');
const app = require('./util/df_config').default`;
const template_BOTTOM = `exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);`;

const buildHandler = (template_BOTTOM, intentMap, template_TOP) => {
  const output = `
${template_TOP}
  
${intentMap
  .map((intent) => {
    let { name, handlerPath } = intent;
    handlerPath = handlerPath.replace(".ts", ".js");
    let payload = `app.intent('${name}', require('${handlerPath}').default)`;
    return payload;
  })
  .join("\n")}

${template_BOTTOM}
  `;

  return output;
};

const TEMPLATE_COMBO_WEBHOOK_BACKEND_BOTTOM = `
const serviceaccount = require("./service-account.json");

const {
    endpointCheat
} = require("df-cheatcodes");
const cors = require("cors")({
    origin: true,
});
const config = {
    transformgrpc: false,
};
const inst = endpointCheat(serviceaccount, config);
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
    if (req.url === '/chatBackend') {
        return cors(req, res, async function () {
            if (req.method === "GET") {
                const data = 'Server up @ + ' new Date().toString() + ' You should POST data to this endpoint';
                return res.status(200).json(data);
            } else {
                console.log('fired...')
                return inst(req, res);
            }
        });
    } else {
        app(req, res)
    }
});`;

const handleStatic = (request, response) => {
  //https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
  var filePath = "." + request.url;
  if (filePath == "./") {
    filePath = "./index.html";
  }

  var extname = String(path.extname(filePath)).toLowerCase();
  var mimeTypes = {
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

  var contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, function (error, content) {
    if (error) {
      if (error.code == "ENOENT") {
        fs.readFile("./404.html", function (error, content) {
          response.writeHead(404, { "Content-Type": "text/html" });
          response.end(content, "utf-8");
        });
      } else {
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
      }
    } else {
      response.writeHead(200, { "Content-Type": contentType });
      response.end(content, "utf-8");
    }
  });
};
const firebaseRC = async (firebasercPath, project_id) => {
  const firebaserc = {
    projects: {
      default: project_id,
    },
  };
  return fse.writeJSON(firebasercPath, firebaserc);
};

const safeRequire = (path) => {
  let valid = true;
  try {
    const attempt = require(path);
  } catch (e) {
    valid = false;
  }
  return valid;
};

/**
 * @param map: intent map
 * 1. Check for duplicate namees
 * 2. Check for any paths that don't exist
 */
const validateMap = async (map) => {
  const problems = [];
  const track = {};
  map.forEach(async (intent, idx) => {
    const { name, handlerPath } = intent;

    if (!name) {
      const problemPayload = {
        type: "missing",
        value: "name",
        location: idx,
      };
      problems.push(problemPayload);
    }
    if (!handlerPath) {
      const problemPayload = {
        type: "missing",
        value: "handlerPath",
        location: idx,
      };
      problems.push(problemPayload);
    }
    // Dupe check
    if (track[name] === undefined) {
      track[name] = idx;
    } else {
      // Duplicate detected
      const problemPayload = {
        type: "duplicate",
        value: name,
        location: idx,
      };

      problems.push(problemPayload);
    }

    // Path check
    const fullHandlerPath = path.resolve(
      __dirname,
      "./../src/webhook",
      handlerPath
    );
    const ok = safeRequire(fullHandlerPath);
    if (!ok) {
      const problemPayload = {
        type: "path",
        location: idx,
        value: fullHandlerPath,
      };
      problems.push(problemPayload);
    }
  });

  if (problems.length) {
    const pluralize = problems.length > 1;
    console.log(
      `\n\nERRORS: There ${
        pluralize ? "are issues" : "is an issue"
      } with your intent map`
    );
    console.log("You must fix these issues before proceeding");
    problems.forEach((problem, idx) => {
      const { type, location, value } = problem;
      console.log("\n_______________\n");
      console.log(
        `<Problem Detected> at item #${location + 1} in intent-map.js`
      );
      if (type === "path") {
        console.log(`This path is not valid ${value}`);
      }
      if (type === "duplicate") {
        console.log(`This intent name is duplicated: ${value}`);
      }
      if (type === "missing") {
        console.log(
          `Crucial value missing for item ${
            location + 1
          }: ${value} (case-sensitive)`
        );
      }
    });
    console.log(`\nExiting until issue${pluralize ? "s" : ""} fixed...\n`);
    return process.exit(1);
  }
};

module.exports = {
  buildFinale,
  buildHandler,
  delete: fse.remove,
  writeFile: fse.outputFile, // will create directory
  copyFile: fse.copy,
  copyDir: fse.copy,
  writeJSON: fse.writeJSON,
  validateMap,
  firebaseRC,
  template_BOTTOM,
  template_TOP,
  handleStatic,
  askQuestion,
};

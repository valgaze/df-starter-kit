//@ts-nocheck

// Pathing
const path = require("path");
const rootDir = path.resolve(__dirname, "..");
const getPath = (...paths) => path.resolve(rootDir, ...paths);
const templateRoot = getPath("util/_templates");
const getTemplatePath = (...paths) => path.resolve(templateRoot, ...paths);
const distDir = getPath("dist");
const serviceaccountPath = getPath("settings/service-account.json");
const rootTemplatePackageJSONPath = getTemplatePath(
  "root_template/functions",
  "package.json"
);

let showServiceAccountMsg = false;
let skipFinaleMsgs = false;
let skipBackendCheck = false;
// Helpers, id
const { project_id } = require(serviceaccountPath);
const {
  writeFile,
  copyDir,
  copyFile,
  writeJSON,
  validateMap,
  firebaseRC,
  buildFinale,
  template_TOP,
  template_BOTTOM,
  buildHandler,
  handleStatic,
  askQuestion,
} = require("./helpers");
const SKIP_PLACEHOLDER_CHECK = `--skip_placeholder_check`;
const SKIP_FINALE_MSGS = `--skip_finale_msgs`;
const SKIP_BACKEND_CHECK = `--skip_backend_check`;
let debug = true;
const log = (...args) => {
  if (debug) {
    console.log.apply(this, args);
  }
};
// CLI args
const args = process.argv.slice(2);
const [command, ...opts] = args;
let template_directory, destination_directory;

log(`\n##
Command: ${command}
Options: ${JSON.stringify(opts)}
ProjectID: ${project_id}
##\n
`);

// Placeholder check
if (project_id === "placeholder" && !opts.includes(SKIP_PLACEHOLDER_CHECK)) {
  console.log(
    `Placeholder detected. Get a service account and put add to settings directory:`
  );
  console.log(`${serviceaccountPath}`);
  console.log(`If you need a service account, see here:`);
  console.log(
    `\n1) https://github.com/valgaze/df-cheatkit/blob/master/docs/service_account.md \n\n2) https://github.com/valgaze/df-cheatkit/blob/master/quickstart.md\n\n`
  );

  console.log(
    `If you're sure you want to proceed with a 'dummy' service-account`
  );
  console.log(`$ npm run cli ${command} -- ${SKIP_PLACEHOLDER_CHECK}\n\n`);
}

if (opts.includes(SKIP_FINALE_MSGS)) {
  skipFinaleMsgs = true;
}

if (opts.includes(SKIP_BACKEND_CHECK)) {
  skipBackendCheck = true;
}

// dialogflowFirebaseFulfillment
async function main(command) {
  /**
   * 0) Build frontend from df-frontend-vue
   * dist should be in src/frontend/dist
   *
   */
  if (command === "transferdist:frontend") {
    // Should be built by now
    const frontendDisthPath = getPath("src/frontend/dist");
    const frontendSourceDisthPath = getPath(
      "src/frontend/df-frontend-vue/dist"
    );
    const copyTemplate = await copyDir(
      frontendSourceDisthPath,
      frontendDisthPath
    ).catch((e) => {
      console.log("Ruh roh", e);
      process.exit(1);
    });
  }

  /**
   * 1) Deploy frontend
   * - copy contents of util/_templates/gcloud_frontend to deploy/frontend
   * - copy frontend/src/dist to deploy/frontend directory
   * - write firebaseRC path
   * - Show message w/ path
   */

  if (command === "deploy:frontend") {
    if (!skipBackendCheck) {
      console.log(
        `Note: If the question below doesn't make sense, see here: \n\n https://github.com/valgaze/df-frontend-vue/blob/master/quickstart.md\n\n`
      );
      const yesno = await askQuestion(
        `Does this bundle have its backend set? [${getPath(
          "src/frontend/df-frontend-vue/dist"
        )}] \n(selecting 'no' will abort deploy) (y/n)  `
      );
      const yesess = ["yes", "y", "yah", "sure"];
      let normalized = yesno.toLowerCase();
      process.exit(1);
      if (!yesess.includes(normalized)) {
        console.log(
          `\n\nUpdate config file env.production with the backend URL, see here: https://github.com/valgaze/df-frontend-vue/blob/master/.env.production \n\n`
        );
        process.exit(1);
        return;
      }
    }
    log(`Starting '${command}'...`);
    const frontendDisthPath = getPath("src/frontend/dist");
    const templatePath = getTemplatePath("gcloud_frontend");
    const targetPath = getPath("deploy/frontend");
    // const functionPath = getPath(targetPath, "functions");

    const publicPath = getPath(targetPath, "public");
    const firebasercPath = getPath(targetPath, ".firebaserc");

    // 1) Copy template to deploy/frontend
    const copyTemplate = await copyDir(templatePath, targetPath).catch((e) => {
      console.log("Ruh roh", e);
      process.exit(1);
    });

    // 2) Copy frontend/dist to deploy/frontend/public
    const copyTemplate = await copyDir(frontendDisthPath, publicPath).catch(
      (e) => {
        console.log("Ruh roh", e);
        process.exit(1);
      }
    );

    // 3) Write firebaserc w/ project_id
    const writefirebaseRC = await firebaseRC(firebasercPath, project_id).catch(
      (e) => {
        console.log("Ruh roh", e);
        process.exit(1);
      }
    );

    console.log(
      `IMPORTANT: Make sure your frontend points to your backend, (see .env.production)`
    );
    if (!skipFinaleMsgs) {
      buildFinale(targetPath, project_id, `npm run deploy:frontend`);
    }

    // TODO: make it easy for frontend to read in backend config from settings
    // Change .env.production maybe or some other trick?
    log(`'${command}' Done!`);
  }

  /**
   * 2) Deploy webhook (fulfillment)
   *  - fetch intent map, validate it
   *  - copy util/_templates/gcloud_fulfillment to deploy/fulfillment_webhook
   *  - copy dist/src/webhook/* to deploy/fulfillment_webhook/functions
   *  - build optimized handler, copy to deploy/fulfillment_webhook/functions
   *  - add firebaserc w/ project_id
   *  - show finale message
   */
  if (command === "deploy:webhook") {
    const templatePath = getTemplatePath("gcloud_fulfillment");
    const deployPath = getPath(`deploy/webhook`);
    const firebasercPath = getPath(deployPath, ".firebaserc");
    const srcPath = getPath(`dist/src/webhook`);
    const functionsPath = getPath(deployPath, "functions");
    const indexPath = getPath(functionsPath, "index.js");

    // 1) fetch intent map, validate it
    const intentMapPath = path.resolve(rootDir, "src/intent-map.ts");
    const { default: intent_map } = require(intentMapPath);
    validateMap(intent_map);

    // 2) copy contents of util/_templates/gcloud_fulfillment to deploy/frontend
    const copyTemplate = await copyDir(templatePath, deployPath).catch((e) => {
      console.log("Ruh roh", e);
      process.exit(1);
    });

    // 3) copy dist/src/webhook/* to deploy/fulfillment_webhook/functions
    const src = await copyDir(srcPath, functionsPath).catch((e) => {
      console.log("Ruh roh", e);
      process.exit(1);
    });

    // 4) build optimized handler, copy to deploy/fulfillment_webhook/functions
    const fulfillment_handler = await buildHandler(
      template_BOTTOM,
      intent_map,
      template_TOP
    );

    // 5) build optimized handler, copy to deploy/fulfillment_webhook/functions
    const write_fulfillment_handler = await writeFile(
      indexPath,
      fulfillment_handler
    ).catch((e) => console.log("ruh", e));

    // 6) add firebaserc w/ project_id
    const writefirebaseRC = await firebaseRC(firebasercPath, project_id).catch(
      (e) => {
        console.log("Ruh roh", e);
        process.exit(1);
      }
    );

    // 6) Show finale message
    if (!skipFinaleMsgs) {
      buildFinale(functionsPath, project_id, `npm run deploy:webhook`);
    }
  }

  /**
   * 3) Deploy backend (transact w/ DialogFlow services)
   * Different than webhook
   *  - copy util/_templates/gcloud_backend to deploy/backend
   *  - copy settings/service-account.json to deploy/backend/functions
   *  - add firebaserc w/ project_id
   *  - show finale message
   */
  if (command === "deploy:backend") {
    const templatePath = getTemplatePath("gcloud_backend");
    const deployPath = getPath(`deploy/backend`);
    const firebasercPath = getPath(deployPath, ".firebaserc");
    const functionsPath = getPath(deployPath, "functions");
    const targetServiceAccountPath = path.resolve(
      functionsPath,
      "service-account.json"
    );

    // 1) copy util/_templates/gcloud_backend to deploy/backend
    const copyTemplate = await copyDir(templatePath, deployPath).catch((e) => {
      console.log("Ruh roh", e);
      process.exit(1);
    });

    // 2) copy settings/service-account.json to deploy/backend/functions
    const copyKey = await copyDir(
      serviceaccountPath,
      targetServiceAccountPath
    ).catch((e) => {
      console.log("Ruh roh", e);
      process.exit(1);
    });

    // 3) add firebaserc w/ project_id
    const writefirebaseRC = await firebaseRC(firebasercPath, project_id).catch(
      (e) => {
        console.log("Ruh roh", e);
        process.exit(1);
      }
    );

    // 4) finale message
    if (!skipFinaleMsgs) {
      buildFinale(functionsPath, project_id, `npm run deploy:backend`);
    }
  }

  /**
   * 4) Packagee.json's
   * - move root package.json dist/
   * - move src/package.json to dist/
   */
  if (["transfer:packagejsons", "transfer:packagejson"].includes(command)) {
    const rootPackage = getPath(rootDir, `package.json`);
    const distTarget = getPath(rootDir, "dist", "package.json");
    const srcPackage = getPath(rootDir, `src`, `package.json`);
    const srcDistTarget = getPath(rootDir, `dist`, `src`, `package.json`);
    // 1) move root package.json dist/
    log(`1) ${rootPackage} >> ${distTarget}`);
    const copyPkg = await copyFile(rootPackage, distTarget).catch((e) => {
      console.log("Ruh roh", e);
      process.exit(1);
    });
    // move src/package.json to dist/
    log(`2) ${srcPackage} >> ${distTarget}`);

    const copyPkg2 = await copyFile(srcPackage, srcDistTarget).catch((e) => {
      console.log("Ruh roh", e);
      process.exit(1);
    });

    const copyPkg2 = await copyFile(srcPackage, srcDistTarget).catch((e) => {
      console.log("Ruh roh", e);
      process.exit(1);
    });
  }

  if (showServiceAccountMsg) {
    console.log(`Done!

    Run the following commands to deploy the backend (this what you'll call from frontend):
    
    1) cd ${deployPath}/functions
    
    2) npm i
    
    3) firebase deploy (or npm run deploy)
    
    (note, you'll need firebase tools installed, see here: https://github.com/valgaze/df-cheatkit/blob/master/docs/firebase.md)
    
    `);
  }
}

main(command);
// webhook

// frontend hosting

// backend

// todo: backend, frontend hosting

/**
 * Steps
 * > [x] copy template to deploy
 * > [x] copy service account to deploy/template/functions
 * > [x] append .firebaserc
 * > show helper
 *
 * Data we need:
 *  > path to active service-acccount
 *  > path to template we need to deploy
 *  > path to deploy/template
 *
 */

// const directoryName = `gcloud_backend`;
// const rootDir = path.resolve(__dirname, "../..");
// // const templateDir = path.resolve(rootDir, `util/_templates/${directoryName}`);
// const templateDir = path.resolve(rootDir, `util/_templates`);
// const  = path.resolve(rootDir, "deploy", directoryName);
// const functionDir = path.resolve(
//   rootDir,
//   "deploy",
//   directoryName,
//   "functions",
//   "service-account.json"
// );
// const firebasercPath = path.resolve(, "", ".firebaserc");
// const serviceaccountPath = path.resolve
//   rootDir,
//   "settings/service-account.json"
// );

// console.log("root", rootDir);
// console.log(`sereviceaccountPath`, serviceaccountPath);
// const { project_id } = require(serviceaccountPath);

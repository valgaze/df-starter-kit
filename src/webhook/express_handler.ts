declare function require(name: string);
const path = require("path");
import intent_map from "./../intent-map";
import app from "./util/df_config";

for (let i = 0; i < intent_map.length; i++) {
  const item = intent_map[i];
  const { name, handlerPath } = item;
  const finalPath = path.resolve(__dirname, handlerPath);
  console.log(`<${name}>: ${finalPath}`);
  app.intent(name, require(finalPath).default);
}

export default app;

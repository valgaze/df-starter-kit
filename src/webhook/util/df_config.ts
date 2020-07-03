import { dialogflow } from "actions-on-google";
import { shortcutCheat, convCheat } from "df-cheatcodes";
import { shortcutConfig } from "./shortcut_config";
// Initialize
const app = dialogflow();

// Activate convCheat (aliases & various AoG cheats)
app.use(convCheat());
// Activate shortcutCheat
app.use(shortcutCheat(shortcutConfig));
export default app;

"use strict";
exports.__esModule = true;
exports["default"] = [
    {
        name: "Default Welcome Intent",
        handlerPath: "./welcome.ts"
    },
    {
        name: "health",
        handlerPath: "./health.ts"
    },
    {
        name: "icecream",
        handlerPath: "./icecream.ts"
    },
    {
        name: "kitchensink",
        handlerPath: "./kitchensink.ts"
    },
];
/* Add intent handlers to list below (names are case-sensitive)

- name: string (case-sensitive, must match intent name exactly)
- handlerPath: string (string relative to 'webhook' directory)

{
  name: 'health',
  handlerPath: './webhook/util_intents/health.intent.ts'
}

*/

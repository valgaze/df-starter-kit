const blessed = require("blessed");
const contrib = require("blessed-contrib");
const ngrok = require("ngrok");

import settings from "./../settings";
const { port, webhook } = settings;

const ngrokMsg = ({ url, webhook }) => `
>>  ${url}${webhook}
 
Use URL above as DialogFlow fulfillment webhook URL

Inspect/replay traffic requests on http://localhost:4040

Note: In another terminal, start the server with $ npm run server
or $ npm run server:dev for live code-reload
`;
(async function () {
  let url = await nGrokConnect(port);
  const screen = blessed.screen();
  const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

  const buildHero = (content = "", opts) => {
    grid.set(0, 0, 3, 12, contrib.log, {
      fg: "red",
      selectedFg: "green",
      // label: heroTitle,
      ...opts,
      content,
    });
    screen.render();
  };

  buildHero(ngrokMsg({ url, webhook }), {
    label: `${url}${webhook}`,
  });
  // buildHero2('Awaiting requests...', {label: 'Requests'});
})();

async function nGrokConnect(port) {
  if (!port) {
    throw new Error("No Port specified");
  }

  const nGrokConfig = {
    proto: "http", // http|tcp|tls, defaults to http
    addr: port, // port or network address, defaults to 80
    onStatusChange(status) {},
    onLogEvent(data) {},
  };
  const url = await ngrok
    .connect(nGrokConfig)
    .catch((e) => console.log("<nGrok> Catastrophic error", e));
  return url;
}

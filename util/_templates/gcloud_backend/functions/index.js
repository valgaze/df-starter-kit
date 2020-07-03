const functions = require("firebase-functions");
const {
  endpointCheat
} = require("df-cheatcodes");
const serviceaccount = require("./service-account.json");
const cors = require('cors')({
  origin: true
})
const config = {
  transformgrpc: false,
};
const inst = endpointCheat(serviceaccount, config);

exports.chatBackend = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method === "GET") {
      const data = `Server up @ ${new Date().toString()} You should POST data to this endpoint`;
      return res.status(200).json(data);
    } else {
      return inst(req, res);
    }
  })
});
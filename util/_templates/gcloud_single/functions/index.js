const functions = require('firebase-functions');

// to be replaced

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
    if (req.url === `/chatBackend`) {
        return cors(req, res, async function () {
            if (req.method === "GET") {
                const data = `Server up @ ${new Date().toString()} You should POST data to this endpoint`;
                return res.status(200).json(data);
            } else {
                console.log('fired...')
                return inst(req, res);
            }
        });
    } else {
        app(req, res)
    }
});
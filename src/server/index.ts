import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { endpointCheat } from "df-cheatcodes";
import path from "path";
import cors from "cors";
import serviceaccount from "./../../settings/service-account.json";

const port = process.env.port || 8000;
const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.resolve(__dirname, "..", "frontend/dist")));
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});

import handler from "./../webhook/express_handler";
app.post("/webhook", handler);

// All optional, default to false
const config = {
  transformgrpc: false,
};
app.post("/chat", endpointCheat(serviceaccount, config));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

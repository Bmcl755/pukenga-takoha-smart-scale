import { buildExpressRouter } from "./kint";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import connectDb from "./db";
import authenticationMiddleware from "./authenticationMiddleware";
import dotenv from "dotenv";
import { models } from "./models/models";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env"
      : `.env.${process.env.NODE_ENV}`,
});
dotenv.config();

export interface Context {
  mongo: typeof models;
}

const PORT = Number(process.env["PORT"]) || 3001;
const mongoUri = process.env["MONGO_URI"] || "";

(async () => {
  await connectDb(mongoUri);
})();

const server = express();

server.use(bodyParser.json());
server.use(cors());
server.use(authenticationMiddleware);

const context: Context = {
  mongo: models,
};

const routePath = path.join(__dirname, "routes");
const router = buildExpressRouter(routePath, context);

server.use("/", router);

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

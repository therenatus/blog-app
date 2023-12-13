import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import router from "./router";
import cookieParser from "cookie-parser";
import { runDb } from "./db";

dotenv.config();
if (!process.env.PORT) {
  console.log(`Error to get ports`);
  process.exit(1);
}
const app: Express = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.set("trust proxy", true);
app.use("/api", router);

// const start = async () => {
//   await runDb();
//   app.listen(3333, () => {
//     console.log(`Server started on port ${PORT}`);
//   });
// };
//
// start();

const start = async () => {
  await runDb();
};

start();

export { app };

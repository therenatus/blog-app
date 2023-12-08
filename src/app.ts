import { app } from "./index";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.PORT) {
  console.log(`Error to get ports`);
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT);

const start = async () => {
  app.listen(3333, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

start();

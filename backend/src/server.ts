import mongoose from "mongoose";
import app from "./app";
import env from "./util/vaidateEnv";

const port = env.PORT;

mongoose
  .connect(env.MONGO_CONNECTION_STRING!)
  .then(() => {
    console.log("Mongoose connected");
    app.listen(port, () => {
      console.log("Server is running on port:", port);
    });
  })
  .catch(console.error);

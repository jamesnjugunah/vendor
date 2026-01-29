import serverless from "serverless-http";
import app from "../dist-server/server/server.js";

export default serverless(app);
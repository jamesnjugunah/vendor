import serverless from "serverless-http";
import app from "./server-bundle.js";

export default serverless(app);
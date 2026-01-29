import serverless from "serverless-http";
import app from "../server/server.ts";

export default serverless(app);

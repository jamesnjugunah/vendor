import serverless from "serverless-http";
import app from "../server/server";

const handler = serverless(app);

export default handler;
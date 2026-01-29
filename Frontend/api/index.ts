import serverless from "serverless-http";
import app from "../../Backend/src/server";

export default serverless(app);

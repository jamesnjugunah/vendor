import serverless from "serverless-http";

// Dynamic import to ensure proper bundling
async function handler(req: any, res: any) {
  const { default: app } = await import("../server/server");
  return serverless(app)(req, res);
}

export default handler;
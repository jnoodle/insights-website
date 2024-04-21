import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { generateNonce } from "siwe";
import { ironOptions } from "@/app/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      const session: any = await getIronSession(req, res, ironOptions);
      session.nonce = generateNonce();
      await session.save();
      res.setHeader("Content-Type", "text/plain");
      res.send(session.nonce);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;

import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { ironOptions } from "@/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "GET":
      const session: any = await getIronSession(req, res, ironOptions);
      session.destroy();
      res.send({ ok: true });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;

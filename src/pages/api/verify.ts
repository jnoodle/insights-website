import { getIronSession } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { SiweMessage } from "siwe";
import { ironOptions } from "@/app/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case "POST":
      try {
        const { message, signature } = req.body;
        const siweMessage = new SiweMessage(message);
        const fields = await siweMessage.verify({ signature });

        const session: any = await getIronSession(req, res, ironOptions);
        if (fields.data.nonce !== session.nonce) return res.status(422).json({ message: "Invalid nonce." });

        session.siwe = fields;
        await session.save();
        res.json({ ok: true });
      } catch (_error) {
        res.json({ ok: false });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;

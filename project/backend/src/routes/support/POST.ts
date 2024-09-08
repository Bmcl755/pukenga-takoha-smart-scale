import { defineExpressEndpoint } from "../../kint";
import { z } from "zod";
import jwt from "jsonwebtoken";

export default defineExpressEndpoint(
  {
    requestBody: {
      message: z.string(),
    },
  },
  async (req, res, ctx) => {
    try {
      const authHeader = req.headers.authorization;
      const supportMessage = req.body.message;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send("Unauthorized");
        return;
      }
      const token = authHeader.split(" ")[1];
      const nurseId = (jwt.decode(token) as any).nurseId;

      const nurse = await ctx.mongo.Nurse.findById(nurseId);

      if (nurse == null) {
        console.log(nurse);
        res.status(400).send("Nurse doesn't exist");
        return;
      }

      if (nurse.support_requests == null) {
        nurse.support_requests = [supportMessage];
      } else {
        nurse.support_requests.push(supportMessage);
      }
      nurse.save();

      res.status(201).json(nurse);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        res.status(400).send(e.message);
        return;
      }
      res.status(500).send("unknown error occured");
    }
  }
);

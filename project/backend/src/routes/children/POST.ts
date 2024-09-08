import { defineExpressEndpoint } from "../../kint";
import { z } from "zod";
import jwt from "jsonwebtoken";

export default defineExpressEndpoint(
  {
    requestBody: {
      first_name: z.string(),
      last_name: z.string(),
      address: z.string(),
      weighings: z.array(z.string()).optional(),
    },
  },
  async (req, res, ctx) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send("Unauthorized");
        return;
      }
      const token = authHeader.split(" ")[1];
      const nurseId = (jwt.decode(token) as any).nurseId;

      const date = new Date().toISOString();

      const childObj = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        weighings: req.body.weighings ?? [],
        last_edited: date,
        assigned_nurses: [nurseId],
      };

      const createResponse = await ctx.mongo.Children.create(childObj);
      const nurse = await ctx.mongo.Nurse.findById(nurseId);
      if (!nurse) {
        res.status(401).send("Unauthorized");
        return;
      }
      nurse.assigned_children.push(createResponse._id.toString());
      nurse.save();
      res.status(201).json(createResponse);
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

import { defineExpressEndpoint } from "../../kint";
import jwt from "jsonwebtoken";

export default defineExpressEndpoint({}, async (req, res, ctx) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }
  const token = authHeader.split(" ")[1];

  const nurseId = (jwt.decode(token) as any).nurseId;
  const nurse = await ctx.mongo.Nurse.findById(nurseId);

  const childrenIds = nurse?.assigned_children ?? [];
  const children = [];

  for (const childId of childrenIds) {
    const child = await ctx.mongo.Children.findById(childId);
    if (child !== null) {
      children.push(child);
    }
  }

  try {
    res.json(children);
  } catch (e) {
    res.status(500).send("unknown error occured");
  }
});

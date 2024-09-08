import { defineExpressEndpoint } from "../../kint";
import { z } from "zod";

export default defineExpressEndpoint(
  {
    requestBody: {
      name: z.string(),
      note: z.string(),
    },
  },
  async (req, res, ctx) => {
    try {
      await ctx.mongo.Example.create({
        name: req.body.name,
        note: req.body.note,
      });
      res.status(200).send("hello from example post");
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
        res.status(400).send(e.message);
      }
      res.status(500).send("unknown error occured");
    }
  }
);

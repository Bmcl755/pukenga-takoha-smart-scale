import { defineExpressEndpoint } from "../../kint";
import { z } from "zod";

export default defineExpressEndpoint(
  {
    requestBody: {
      username: z.string(),
      password: z.string(),
    },
  },
  async (req, res, ctx) => {
    const { password, username } = req.body;
    const admin = await ctx.mongo.Admin.create({
      username,
      password,
    });

    try {
      res.json(admin);
    } catch (e) {
      res.status(500).send("unknown error occured");
    }
  }
);

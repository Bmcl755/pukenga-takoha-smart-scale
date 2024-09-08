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
    try {
      const response = await ctx.mongo.Parent.findOne({
        username: req.body.username,
      });
      if (response !== null) {
        console.log(response);
        res.status(400).send("username already exists");
        return;
      }

      const createResponse = await ctx.mongo.Parent.create({
        username: req.body.username,
        password: req.body.password,
      });
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

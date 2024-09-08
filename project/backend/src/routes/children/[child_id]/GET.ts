import { defineExpressEndpoint } from "../../../kint";
import { z } from "zod";

export default defineExpressEndpoint(
  {
    urlParams: {
      child_id: z.string(),
    },
  },
  async (req, res, ctx) => {
    try {
      const response = await ctx.mongo.Children.findOne({
        _id: req.params.child_id,
      });
      if (response === null) {
        res.status(404).send("Child not found");
        return;
      }
      res.status(200).json(response);
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

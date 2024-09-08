import { defineExpressEndpoint } from "../../../kint";
import { z } from "zod";

export default defineExpressEndpoint(
  {
    urlParams: {
      physical_scale_id: z.string(),
    },
  },
  async (req, res, ctx) => {
    try {
      const scaleId = req.params.physical_scale_id;
      const response = await ctx.mongo.Scale.findOne({
        physical_id: scaleId,
      });
      if (response === null) {
        res.status(404).send("Scale not found");
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

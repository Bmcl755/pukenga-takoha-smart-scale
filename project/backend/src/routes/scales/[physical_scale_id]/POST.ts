import { defineExpressEndpoint } from "../../../kint";
import { z } from "zod";

export default defineExpressEndpoint(
  {
    urlParams: {
      physical_scale_id: z.string(),
    },
    requestBody: {
      weight: z.number(),
    },
  },
  async (req, res, ctx) => {
    try {
      const weight = req.body.weight;
      const scaleId = req.params.physical_scale_id;
      const scaleResponse = await ctx.mongo.Scale.findOne({
        physical_id: scaleId,
      });

      if (scaleResponse === null) {
        res.status(404).send("Scale not found");
        return;
      }

      const date = new Date().toISOString();

      scaleResponse.weighings.push({
        weight,
        date,
      });
      scaleResponse.save();

      res.status(200).json(scaleResponse);
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

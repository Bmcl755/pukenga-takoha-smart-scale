import { defineExpressEndpoint } from "../../kint";
import { z } from "zod";

export default defineExpressEndpoint(
  {
    requestBody: {
      scale_physical_id: z.string(),
    },
  },
  async (req, res, ctx) => {
    try {
      const physicalId = req.body.scale_physical_id;
      const getResponse = await ctx.mongo.Scale.findOne({
        physical_id: physicalId,
      });

      if (getResponse !== null) {
        console.log(getResponse);
        res.status(400).send("scale already exists");
        return;
      }

      const createResponse = await ctx.mongo.Scale.create({
        physical_id: physicalId,
        weighings: [],
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

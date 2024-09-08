import { defineExpressEndpoint } from "../../kint";

export default defineExpressEndpoint(
  {
    requestBody: {},
  },
  async (req, res, ctx) => {
    try {
      const response = await ctx.mongo.Nurse.find();
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

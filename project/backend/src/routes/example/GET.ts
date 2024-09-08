import { defineExpressEndpoint } from "../../kint";
import { Example } from "../../models/exampleModel";

export default defineExpressEndpoint({}, async (req, res, ctx) => {
  try {
    const results = await ctx.mongo.Example.find();
    res.status(200).send(results);
  } catch (e) {
    console.log(e);
    res.status(500).send("error occured");
  }
});

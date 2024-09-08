import { defineExpressEndpoint } from "../../../kint";
import { z } from "zod";

export default defineExpressEndpoint(
  {
    urlParams: {
      child_id: z.string(),
    },
    requestBody: {
      address: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
    },
  },
  async (req, res, ctx) => {
    try {
      const child = await ctx.mongo.Children.findOne({
        _id: req.params.child_id,
      });
      if (child === null || child === undefined) {
        res.status(404).send("Child not found");
        return;
      }
      const { address, first_name: firstName, last_name: lastName } = req.body;

      if (
        address === undefined &&
        firstName === undefined &&
        lastName === undefined
      ) {
        res.status(400).send("No fields to update");
        return;
      }

      if (address !== undefined) {
        child.address = address;
      }

      if (firstName !== undefined) {
        child.first_name = firstName;
      }

      if (lastName !== undefined) {
        child.last_name = lastName;
      }

      const date = new Date().toISOString();
      child.last_edited = date;

      const updateResponse = await child.save();

      res.status(200).json(updateResponse);
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

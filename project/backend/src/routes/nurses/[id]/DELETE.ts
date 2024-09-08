import { defineExpressEndpoint } from "../../../kint";
import { z } from "zod";

export default defineExpressEndpoint(
  {
    urlParams: {
      id: z.string(),
    },
  },
  async (req, res, ctx) => {
    try {
      const nurseId = req.params.id;
      const nurse = await ctx.mongo.Nurse.findById(nurseId);
      if (nurse === undefined || nurse === null) {
        res.status(404).send(`Cannot find nurse with id: ${nurseId}`);
        return;
      }

      for (const childId of nurse.assigned_children) {
        const child = await ctx.mongo.Children.findById(childId);
        child?.assigned_nurses.splice(
          child.assigned_nurses.indexOf(nurseId),
          1
        );
        child?.save();
      }
      const deleteResponse = await nurse?.deleteOne();
      res.status(200).json(deleteResponse);
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

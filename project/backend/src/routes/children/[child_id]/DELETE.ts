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
      const childId = req.params.child_id;
      const child = await ctx.mongo.Children.findById(childId);
      if (child === undefined || child === null) {
        res.status(404).send(`Cannot find child with id: ${childId}`);
        return;
      }
      for (const nurseId of child.assigned_nurses) {
        const nurse = await ctx.mongo.Nurse.findById(nurseId);
        nurse?.assigned_children.splice(
          nurse.assigned_children.indexOf(childId),
          1
        );
        nurse?.save();
      }
      const deleteResponse = await child.deleteOne();
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

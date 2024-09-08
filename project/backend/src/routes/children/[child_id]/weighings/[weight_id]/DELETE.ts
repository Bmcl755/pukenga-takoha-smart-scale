import { defineExpressEndpoint } from "../../../../../kint";
import { z } from "zod";
import nurseIsAuthorised from "../../../../utils/nurseIsAuthorised";

export default defineExpressEndpoint(
  {
    urlParams: { child_id: z.string(), weight_id: z.string() },
    requestBody: {
      nurse_id: z.string(),
    },
  },
  async (req, res, ctx) => {
    try {
      const nurseId = req.body.nurse_id;
      const childId = req.params.child_id;
      const weightId = req.params.weight_id;
      const child = await ctx.mongo.Children.findOne({ _id: childId });

      if (child === null) {
        // If child not found
        res.status(404).send("Child not found");
        return;
      }

      if (!(await nurseIsAuthorised(ctx, nurseId, childId))) {
        res.status(403).send("Nurse is not assigned to this child");
        return;
      }

      child.weighings.pull(weightId);
      const deleteResposne = child.save();
      res.status(200).json(deleteResposne);
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

import { defineExpressEndpoint } from "../../../../kint";
import { z } from "zod";
import nurseIsAuthorised from "../../../utils/nurseIsAuthorised";

export default defineExpressEndpoint(
  {
    urlParams: { child_id: z.string() },
    requestBody: {
      weight: z.number(),
      nurse_id: z.string(),
    },
  },
  async (req, res, ctx) => {
    try {
      const { nurse_id: nurseId, weight } = req.body;
      const childId = req.params.child_id;
      const child = await ctx.mongo.Children.findOne({ _id: childId });

      if (child === null) {
        // If child not found
        res.status(404).send("Child not found");
        return;
      }

      const date = new Date().toISOString();

      const childWeight = {
        weight,
        date,
      };

      /*
       * If the update is being done by a nurse via frontend, we need to check that nurse is authorised
       * Note in this case, the nurse will manually need to input a scale Physical ID.
       */
      if (nurseId !== undefined) {
        if (!(await nurseIsAuthorised(ctx, nurseId, childId))) {
          res.status(403).send("Nurse is not assigned to this child");
          return;
        }
      }
      child.weighings.push(childWeight);
      child.last_edited = date;
      const saveResponse = await child.save();
      res.status(200).json(saveResponse);
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

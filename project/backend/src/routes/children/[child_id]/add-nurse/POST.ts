import { defineExpressEndpoint } from "../../../../kint";
import { z } from "zod";

export default defineExpressEndpoint(
  {
    urlParams: {
      child_id: z.string(),
    },
    requestBody: {
      nurse_id: z.string(),
    },
  },
  async (req, res, ctx) => {
    try {
      const child = await ctx.mongo.Children.findOne({
        _id: req.params.child_id,
      });

      if (child === null) {
        res.status(404).send("Child not found");
        return;
      }

      const nurse = await ctx.mongo.Nurse.findOne({ _id: req.body.nurse_id });

      if (nurse === null) {
        res.status(404).send("Nurse not found");
        return;
      }
      if (nurse.assigned_children.includes(child.id)) {
        res.status(409).send("Nurse is already assigned to this child!");
        return;
      }

      child.assigned_nurses.push(req.body.nurse_id);

      const updateChildResponse = await ctx.mongo.Children.updateOne(
        { _id: req.params.child_id },
        {
          assigned_nurses: child.assigned_nurses,
          date: new Date().toISOString(),
        }
      );

      const updateNurseResponse = await ctx.mongo.Nurse.updateOne(
        { _id: req.body.nurse_id },
        {
          $push: {
            assigned_children: req.params.child_id,
          },
        }
      );

      res.status(200).json([updateChildResponse, updateNurseResponse]);
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

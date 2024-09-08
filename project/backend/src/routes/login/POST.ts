import { defineExpressEndpoint } from "../../kint";
import { z } from "zod";
import jwt from "jsonwebtoken";

export default defineExpressEndpoint(
  {
    requestBody: {
      username: z.string(),
      password: z.string(),
      role: z.string().optional(),
    },
  },
  async (req, res, ctx) => {
    try {
      const { password, username } = req.body;
      let { role } = req.body;
      if (!role) {
        role = "nurse";
      }
      let token = null;
      if (role === "nurse") {
        // NURSE
        const nurse = await ctx.mongo.Nurse.findOne({
          username,
        });

        if (!nurse || nurse.password !== password) {
          res.status(404).send("Invalid credentials");
          return;
        }
        token = jwt.sign(
          { nurseId: nurse._id, role: "nurse" },
          "bogus_secret",
          {
            expiresIn: "1d",
          }
        );
      } else if (role === "parent") {
        // PARENT
        const parent = await ctx.mongo.Parent.findOne({
          username,
        });

        if (!parent || parent.password !== password) {
          res.status(404).send("Invalid credentials");
          return;
        }
        token = jwt.sign(
          { parentId: parent._id, role: "parent" },
          "bogus_secret",
          {
            expiresIn: "1d",
          }
        );
      } else if (role === "admin") {
        // ADMIN
        const admin = await ctx.mongo.Admin.findOne({
          username,
        });

        if (!admin || admin.password !== password) {
          res.status(404).send("Invalid credentials");
          return;
        }
        token = jwt.sign(
          { adminId: admin._id, role: "admin" },
          "bogus_secret",
          {
            expiresIn: "1d",
          }
        );
      } else {
        res
          .status(404)
          .send(
            `Invalid role. Expected one of nurse, admin, parent; recieved ${role}`
          );
        return;
      }

      if (token === undefined) {
      }

      res.status(200).json({ token });
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

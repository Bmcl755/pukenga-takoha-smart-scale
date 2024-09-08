import { Schema, model } from "mongoose";

const parentSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const Parent = model("Parent", parentSchema);

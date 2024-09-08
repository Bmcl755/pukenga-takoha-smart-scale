import { Schema, model } from "mongoose";

const nurseSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  assigned_children: {
    type: [String],
    ref: "Children",
    required: true,
  },
  support_requests: {
    type: [String],
    required: false,
  },
});

export const Nurse = model("Nurse", nurseSchema);

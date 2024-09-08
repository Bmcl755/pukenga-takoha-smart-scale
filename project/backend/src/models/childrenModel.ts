import { Schema, SchemaType, model } from "mongoose";

const weighing = new Schema({
  date: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});

const childrenSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  weighings: {
    type: [weighing],
    required: true,
  },
  assigned_nurses: {
    type: [String],
    ref: "Nurse",
    required: true,
  },
  last_edited: {
    type: String,
    required: true,
  },
});

export const Children = model("Children", childrenSchema);

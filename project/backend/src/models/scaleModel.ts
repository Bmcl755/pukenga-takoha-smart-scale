import { Schema, model } from "mongoose";

const scaleSchema = new Schema({
  physical_id: {
    type: String,
    required: true,
  },
  weighings: {
    type: [
      {
        weight: Number,
        date: String,
      },
    ],
    default: [],
  },
});

export const Scale = model("Scale", scaleSchema);

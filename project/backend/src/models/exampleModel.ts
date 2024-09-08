import { Schema, model } from "mongoose";

const exampleModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

export const Example = model("Example", exampleModel);

import { Admin } from "./adminModel";
import { Children } from "./childrenModel";
import { Example } from "./exampleModel";
import { Nurse } from "./nurseModel";
import { Scale } from "./scaleModel";
import { Parent } from "./ParentModel";

export const models = {
  Example,
  Admin,
  Children,
  Nurse,
  Scale,
  Parent,
};

export type Models = typeof models;

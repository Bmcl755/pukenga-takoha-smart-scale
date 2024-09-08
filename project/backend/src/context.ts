import { models } from "./models/models";

export type Context = {
  mongo: typeof models;
};

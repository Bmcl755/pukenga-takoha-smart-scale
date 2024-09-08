import kint from "express-kint";
import { Context } from "./context";

// For defining types
export { k } from "express-kint";

// Build express router is used to create an express router from a directory of routes
// Define express endpoint is used to define express endpoints in the routes folder
export const { buildExpressRouter, defineExpressEndpoint } = kint<Context>();

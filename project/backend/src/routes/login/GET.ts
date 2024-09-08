import { defineExpressEndpoint } from "../../kint";
import jwt from "jsonwebtoken";

export default defineExpressEndpoint({}, async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const isValid = jwt.verify(token, "bogus_secret");
    if (isValid) {
      res.status(200).send("Token is valid");
      return;
    } else {
      res.status(401).send("Token is invalid");
      return;
    }
  } catch (error) {
    res.status(401).send("Error verifying jwt");
  }
});

import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: JwtPayload;
}
declare global {
  namespace Express {
    interface Request {
      email: string;
      password: string;
      user?: JwtPayload;
    }
  }
}
export default function authenticationMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const excludedRoutes = [/^\/scales\/[^\/]+$/];
  const excludedPaths = ["/login", "/register"];

  const path = req.path;

  // Check if the current route matches any of the excluded routes
  const isExcluded = excludedRoutes.some((regex) => regex.test(path));

  if (isExcluded || excludedPaths.includes(req.path)) {
    // Route is excluded, skip further middleware
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "bogus_secret", (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    if (typeof decoded === "string") {
      return res.status(401).send("Invalid token");
    }
    req.user = decoded;
    next();
  });
}

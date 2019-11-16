import { Request, Response, NextFunction } from "express";

export default function authorizationCheck(message: string): any {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (req.session.user_id) {
      return next();
    }
    return res
      .status(401)
      .send({ error: { status: 401, type: "Unauthorized", message } });
  };
}

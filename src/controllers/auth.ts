import express, { Request, Response } from "express";
import UserService from "../services/userService";
import InvalidBody from "../helpers/invalidBody";
import InternalError from "../helpers/internalError";

const authRouter: express.Router = express.Router();

// POST /signup
authRouter.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send(InvalidBody);
  }
  try {
    const signUpRes: any = await UserService.signUp(req.body);
    if (signUpRes.error) {
      res.status(409).send(signUpRes);
    } else {
      res.status(201).send(signUpRes);
    }
  } catch (error) {
    res.status(500).send(InternalError);
  }
});

// POST /login
authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send(InvalidBody);
  }
  try {
    const loginRes: any = await UserService.login(req.body);
    if (loginRes.error) {
      res.status(401).send(loginRes);
    } else {
      req.session.user_id = loginRes.id;
      delete loginRes.id; // Only send back the message portion
      res.status(200).send(loginRes);
    }
  } catch (error) {
    res.status(500).send(InternalError);
  }
});

export default authRouter;

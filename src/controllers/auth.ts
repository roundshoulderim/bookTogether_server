import express, { Request, Response } from "express";
import authService from "../services/authService";
import InvalidBody from "../helpers/errors/invalidBody";
import InternalError from "../helpers/errors/internalError";

const authRouter: express.Router = express.Router();

// POST /signup
authRouter.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send(InvalidBody);
  }
  try {
    const signUpRes: any = await authService.signUp(req.body);
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
    const loginRes: any = await authService.login(req.body);
    if (loginRes.error) {
      res.status(401).send(loginRes);
    } else {
      req.session.user = loginRes.id;
      delete loginRes.id; // Only send back the message portion
      res.status(200).send(loginRes);
    }
  } catch (error) {
    res.status(500).send(InternalError);
  }
});

// POST /logout
authRouter.post("/logout", async (req: Request, res: Response) => {
  req.session.destroy((error: any) => {
    if (error) {
      res.status(500).send(InternalError);
    } else {
      res.status(200).send({ message: "성공적으로 로그아웃 되었습니다." });
    }
  });
});

// POST /findpw
authRouter.post("/findpw", async (req: Request, res: Response) => {
  if (!req.body.email) {
    return res.status(400).send(InvalidBody);
  }
  try {
    await authService.findpw(req.body.email);
    res.status(200).send({ message: "비밀번호 재설정 메일이 전송되었습니다." });
  } catch (error) {
    if (error.type === "EmailNotFound") {
      res.status(404).send({ error });
    } else {
      res.status(500).send(InternalError);
    }
  }
});

// POST /auth/checkpw
authRouter.post("/checkpw", async (req: Request, res: Response) => {
  if (!req.body.password || !req.body.user) {
    return res.status(400).send(InvalidBody);
  }
  try {
    await authService.checkpw(req.body);
    res.status(200).send({ message: "비밀번호가 일치합니다." });
  } catch (error) {
    if (error.type === "IncorrectPassword") {
      res.status(401).send({ error });
    } else {
      res.status(500).send(InternalError);
    }
  }
});

export default authRouter;

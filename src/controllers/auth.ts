import express, { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import InvalidBody from "../helpers/errors/invalidBody";
import InternalError from "../helpers/errors/internalError";
import passport from "passport";

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

const addSocketIdToSession = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.session.socketId = req.query.socketId;
  next();
};

authRouter.get(
  "/facebook",
  addSocketIdToSession,
  passport.authenticate("facebook")
);

authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook"), // No optional redirect parameter
  (req: Request) => {
    /* reason for socket: w/ popup window, general redirects won't work (and would
    cause undesirable browser reload even if it did). The SPA is also not directly
    sending the api request, so it cannot receive an http response here. */
    const socket = req.app.get("socket");
    if (req.session.passport.user) {
      req.session.user = req.session.passport.user;
      socket.to(req.session.socketId).emit("facebook", {
        message: "성공적으로 페이스북 로그인이 되었습니다."
      });
    } else {
      socket.to(req.session.socketId).emit("facebook", {
        error: {
          type: "DuplicateEmail",
          message: "서로모임에 이미 가입된 이메일입니다."
        }
      });
    }
  }
);

export default authRouter;

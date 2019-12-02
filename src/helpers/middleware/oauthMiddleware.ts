import { Request, Response, NextFunction } from "express";

export const addSocketIdToSession = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.session.socketId = req.query.socketId;
  next();
};

export const oAuthResponse = (provider: string) => (req: Request) => {
  const user: any = req.user;
  const socket = req.app.get("socket");
  if (user.accountType !== provider) {
    socket.to(req.session.socketId).emit(provider, {
      error: {
        type: "DuplicateEmail",
        message: "서로모임에 이미 가입된 이메일입니다."
      }
    });
  } else {
    req.session.user = user.id;
    req.session.save(() => {
      socket.to(req.session.socketId).emit(provider, {
        message: "성공적으로 소셜 로그인이 되었습니다."
      }); // without res.send(), need to manually save session.
    });
  }
};

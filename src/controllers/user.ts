import express, { Request, Response } from "express";
import authorizationCheck from "../helpers/middleware/authorizationCheck";
import userService from "../services/userService";
import InternalError from "../helpers/errors/internalError";

const userRouter: express.Router = express.Router();

userRouter.get(
  "/",
  authorizationCheck("인증을 한 후에만 사용자 정보를 불러올 수 있습니다."),
  async (req: Request, res: Response) => {
    try {
      const getUserRes = await userService.getUser(req.session.user);
      res.status(200).send(getUserRes);
    } catch (error) {
      res.status(500).send(InternalError);
    }
  }
);

userRouter.patch(
  "/",
  authorizationCheck("인증을 한 후에만 사용자 정보를 업데이트 할 수 있습니다."),
  async (req: Request, res: Response) => {
    try {
      const patchUserRes = await userService.patchUser(
        req.session.user,
        req.body
      );
      res.status(200).send(patchUserRes);
    } catch (error) {
      res.status(500).send(InternalError);
    }
  }
);

export default userRouter;

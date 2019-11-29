import express, { Request, Response } from "express";
import authorizationCheck from "../helpers/middleware/authorizationCheck";
import upload from "../config/s3-upload";
import userService from "../services/userService";
import InternalError from "../helpers/errors/internalError";

const userRouter: express.Router = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
  const resetPasswordToken: string = req.query.resetPasswordToken;
  const user: string = req.session.user;
  if (!resetPasswordToken && !user) {
    const message: string =
      "인증을 한 후에만 사용자 정보를 불러올 수 있습니다.";
    return res
      .status(401)
      .send({ error: { status: 401, type: "Unauthorized", message } });
  }
  try {
    const getUserRes = await userService.getUser({ resetPasswordToken, user });
    res.status(200).send(getUserRes);
  } catch (error) {
    if (error.status === 403 || error.status === 404) {
      return res.status(error.status).send({ error });
    }
    res.status(500).send(InternalError);
  }
});

userRouter.patch(
  "/",
  authorizationCheck("인증을 한 후에만 사용자 정보를 업데이트 할 수 있습니다."),
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (req.file) {
      req.body.image = req.file.location;
    }
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

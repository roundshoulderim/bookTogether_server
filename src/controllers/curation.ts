import express, { Request, Response } from "express";
import curationService from "../services/curationService";
import InvalidQuery from "../helpers/errors/invalidQuery";
import InternalError from "../helpers/errors/internalError";
import Unauthorized from "../helpers/errors/unauthorized";

const curationRouter: express.Router = express.Router();

curationRouter.get("/", async (req: Request, res: Response) => {
  const { list_type, book, review } = req.query;
  if (!list_type && !book && !review) {
    return res.status(400).send(InvalidQuery);
  }
  if (list_type === "personal" || list_type === "my_likes") {
    if (!req.session.user) {
      return res
        .status(401)
        .send(
          Unauthorized("인증을 한 후에만 해당 서평 목록을 불러올 수 있습니다.")
        );
    }
    req.query.user = req.session.user; // add user so it can be used to filter
  }
  try {
    const getCurationsRes = await curationService.getCurations(req.query);
    res.status(200).send(getCurationsRes);
  } catch (error) {
    res.status(500).send(InternalError);
  }
});

export default curationRouter;

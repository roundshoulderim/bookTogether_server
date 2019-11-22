import express, { Request, Response } from "express";
import curationService from "../services/curationService";
import InvalidQuery from "../helpers/errors/invalidQuery";
import InternalError from "../helpers/errors/internalError";
import Unauthorized from "../helpers/errors/unauthorized";

const curationRouter: express.Router = express.Router();

curationRouter.get("/", async (req: Request, res: Response) => {
  const { author, list_type, book, review } = req.query;
  if (!author && !list_type && !book && !review) {
    return res.status(400).send(InvalidQuery);
  }
  if (list_type === "my_likes") {
    if (!req.session.user) {
      return res
        .status(401)
        .send(
          Unauthorized(
            "인증을 한 후에 내가 좋아한 큐레이션을 불러올 수 있습니다."
          )
        );
    }
  }
  req.query.user = req.session.user;
  try {
    const getCurationsRes = await curationService.getCurations(req.query);
    res.status(200).send(getCurationsRes);
  } catch (error) {
    res.status(500).send(InternalError);
  }
});

export default curationRouter;

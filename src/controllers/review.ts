import express, { Request, Response } from "express";
import reviewService from "../services/reviewService";
import InvalidQuery from "../helpers/errors/invalidQuery";
import InternalError from "../helpers/errors/internalError";
import Unauthorized from "../helpers/errors/unauthorized";

const reviewRouter: express.Router = express.Router();

reviewRouter.get("/", async (req: Request, res: Response) => {
  const { list_type, book_id, curation_id } = req.query;
  if (!list_type && !book_id && !curation_id) {
    return res.status(400).send(InvalidQuery);
  }
  if (list_type === "personal" || list_type === "my_likes") {
    if (!req.session.user_id) {
      return res
        .status(401)
        .send(
          Unauthorized("인증을 한 후에만 해당 서평 목록을 불러올 수 있습니다.")
        );
    }
    req.query.user_id = req.session.user_id; // add user_id so it can be used to filter
  }
  try {
    const getReviewsRes = await reviewService.getReviews(req.query);
    res.status(200).send(getReviewsRes);
  } catch (error) {
    res.status(500).send(InternalError);
  }
});

reviewRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const getReviewRes: any = await reviewService.getReview(req.params.id);
    if (!getReviewRes.published && req.session.user_id !== getReviewRes.id) {
      return res
        .status(401)
        .send(Unauthorized("해당 서평에 접근 권한이 없습니다."));
    }
    res.status(200).send(getReviewRes);
  } catch (error) {
    if (error.name === "CastError") {
      // not found
      res.status(404).send({
        error: {
          status: 404,
          type: "ReviewNotFound",
          message: "해당 서평에 대한 정보를 찾을 수가 없습니다."
        }
      });
    } else {
      res.status(500).send(InternalError);
    }
  }
});

export default reviewRouter;

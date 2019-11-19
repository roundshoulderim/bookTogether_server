import express, { Request, Response } from "express";
import ratingService from "../services/ratingService";
import InvalidBody from "../helpers/errors/invalidBody";
import InvalidQuery from "../helpers/errors/invalidQuery";
import InternalError from "../helpers/errors/internalError";
import Unauthorized from "../helpers/errors/unauthorized";

const ratingRouter: express.Router = express.Router();

ratingRouter.get("/", async (req: Request, res: Response) => {
  const { book_ids, user_id } = req.query;
  if (!book_ids) {
    return res.status(400).send(InvalidQuery);
  }
  req.session.user_id = "5dd18e2078a28839895bb3ea";
  if (!user_id && req.session.user_id) {
    req.query.user_id = req.session.user_id;
  }
  try {
    const getRatingsRes = await ratingService.getRatings(req.query);
    res.status(200).send(getRatingsRes);
  } catch (error) {
    res.status(500).send(InternalError);
  }
});

ratingRouter.post("/", async (req: Request, res: Response) => {
  const { book_id, rating } = req.body;
  if (!book_id || !rating) {
    return res.status(400).send(InvalidBody);
  }
  req.session.user_id = "5dd18e2078a28839895bb3ea";
  if (!req.session.user_id) {
    return res
      .status(401)
      .send(Unauthorized("로그인 한 후 평점을 매길 수 있습니다."));
  }
  const postBody = { book: book_id, user: req.session.user_id, rating };
  try {
    const postRatingRes = await ratingService.postRating(postBody);
    return res.status(201).send(postRatingRes);
  } catch (error) {
    if (error.type === "DuplicateRating") {
      return res.status(409).send({ error });
    }
    return res.status(500).send(InternalError);
  }
});

export default ratingRouter;

import express, { Request, Response } from "express";
import bookService from "../services/bookService";
import InvalidQuery from "../helpers/errors/invalidQuery";
import InternalError from "../helpers/errors/internalError";
import NotFound from "../helpers/errors/notFound";

const bookRouter: express.Router = express.Router();

bookRouter.get("/", async (req: Request, res: Response) => {
  const { review_id, curation_id } = req.query;
  if (!review_id && !curation_id) {
    return res.status(400).send(InvalidQuery);
  }
  try {
    const getBooksRes = await bookService.getBooks(req.query);
    res.status(200).send(getBooksRes);
  } catch (error) {
    res.status(500).send(InternalError);
  }
});

bookRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const getBookRes: any = await bookService.getBook(req.params.id);
    if (!getBookRes) {
      res
        .status(404)
        .send(
          NotFound("BookNotFound", "해당 책에 대한 정보를 찾을 수가 없습니다.")
        );
    } else {
      res.status(200).send(getBookRes);
    }
  } catch (error) {
    if (error.name === "CastError") {
      res
        .status(404)
        .send(
          NotFound("BookNotFound", "해당 책에 대한 정보를 찾을 수가 없습니다.")
        );
    } else {
      res.status(500).send(InternalError);
    }
  }
});

export default bookRouter;

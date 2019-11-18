import Book from "../../models/Book";
import axios from "axios";
import cheerio from "cheerio";
import schedule from "node-schedule";
import mongoose, { Document } from "mongoose";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://dapi.kakao.com/v3/search/book";

/* Response body:
{
  documents: [{authors, contents, datetime, isbn, price, publisher,
    sale_price, status, thumbnail, title, translators, url}],
  meta: { is_end, pageable_count, total_count }
} */

function handleTitle(title: string): string {
  let newTitle = "";
  let shouldInclude = true;
  for (const letter of title) {
    if (shouldInclude) {
      newTitle += letter;
    }
    if (letter === "(" && shouldInclude) {
      shouldInclude = false;
    } else if (letter === ")" && shouldInclude) {
      shouldInclude = true;
    }
  }
  return newTitle;
}

async function searchApi(publisher: string): Promise<void> {
  const url = `${BASE_URL}?target=publisher&query=${encodeURI(publisher)}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`
      }
    });
    const data = response.data;
    const books = data.documents;

    for (const entry of books) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      const html = await page.goto(entry.url).then(() => page.content());
      const $ = cheerio.load(html);
      entry.contents = $("p.desc")
        .first()
        .text(); // 크롤링 (현재는 필요 이상의 텍스트를 가져옴)
      entry.title = handleTitle(entry.title);
      const existing = await Book.findOne({ isbn: entry.isbn });
      if (existing) {
        existing.updateOne(entry);
      } else {
        const book: Document = new Book(entry);
        book.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// Connect to database
const dbUrl: string = "mongodb://localhost/bcha-server";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => searchApi("위즈덤하우스"));

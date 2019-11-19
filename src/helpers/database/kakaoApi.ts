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
    if (letter === "(" && shouldInclude) {
      shouldInclude = false;
    }
    if (shouldInclude) {
      newTitle += letter;
    }
    if (letter === ")" && !shouldInclude) {
      shouldInclude = true;
    }
  }
  return newTitle;
}

async function searchApi(publisher: string, page: number): Promise<void> {
  const url = `${BASE_URL}?target=publisher&query=${encodeURI(
    publisher
  )}&size=50&page=${page}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`
      }
    });
    const data = response.data;
    const books = data.documents;

    for (const entry of books) {
      const title = entry.title;
      if (
        title.includes("찬송가") ||
        title.includes("성경") ||
        title.includes("월호")
      ) {
        continue;
      }
      const browser = await puppeteer.launch();
      const browserPage = await browser.newPage();
      const html = await browserPage
        .goto(entry.url)
        .then(() => browserPage.content());
      const $ = cheerio.load(html);
      const elDesc = $("p.desc").get(0);
      if (!elDesc.parent.attribs.class.includes("hide")) {
        let description = "";
        elDesc.children.forEach((textNode: any) => {
          const text = textNode.data === undefined ? "\n" : textNode.data;
          description += text;
        });
        entry.contents = description.trim();
      }
      entry.title = handleTitle(entry.title);
      const existing = await Book.findOne({ isbn: entry.isbn });
      if (existing) {
        await Book.findByIdAndUpdate(existing.id, entry);
      } else {
        const book: Document = new Book(entry);
        book.save();
      }
    }

    if (!data.meta.is_end) {
      searchApi(publisher, page + 1);
    }
  } catch (error) {
    console.log(error);
  }
}

// Connect to database and fetch
const dbUrl: string = "mongodb://localhost/bcha-server";
const publishers = [
  "위즈덤하우스",
  "시공사",
  "문학동네",
  "김영사",
  "창비",
  "웅진씽크빅",
  "길벗",
  "민음사",
  "알에이치코리아",
  "다산북스",
  "학지사",
  "아가페출판사",
  "비룡소",
  "한빛미디어",
  "박영사",
  "쌤앤파커스",
  "계림북스",
  "을유문화사",
  "자음과모음",
  "개암나무"
];
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    publishers.forEach((publisher: string) => {
      searchApi(process.env.DB_URL, 1);
    });
  });

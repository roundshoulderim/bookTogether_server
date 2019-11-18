import { Document } from "mongoose";
export default function updateQueryResults(
  resultArr: Document[],
  updateArr: Document[]
): Document[] {
  if (!resultArr) {
    resultArr = updateArr;
  } else {
    resultArr = updateArr.filter((a: any) => {
      return updateArr.some((b: any) => b.id === a.id);
    });
  }
  return resultArr;
}

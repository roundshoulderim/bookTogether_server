import schedule from "node-schedule";
import kakaoApiToDB from "./kakaoApi";
import migrateBooks from "./esmigration/migrateBooks";
import migrateReviews from "./esmigration/migrateReviews";

const scheduleMigrations = () => {
  schedule.scheduleJob({ hour: 3, minute: 0, dayOfWeek: 0 }, kakaoApiToDB);
  schedule.scheduleJob({ hour: 3, minute: 0, dayOfWeek: 3 }, () => {
    migrateBooks();
    migrateReviews();
  });
};

export default scheduleMigrations;

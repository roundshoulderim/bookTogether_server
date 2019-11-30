import User from "../models/User";
import bcrypt from "bcrypt";

interface IQuery {
  resetPasswordToken: string;
  user: string;
}

const userService = {
  getUser: async ({ resetPasswordToken, user }: IQuery) => {
    if (resetPasswordToken) {
      const userDoc: any = await User.findOne({ resetPasswordToken })
        .populate({
          path: "to_read.book reading.book finished.book",
          select: "authors thumbnail title"
        })
        .select("-password");
      if (!userDoc) {
        const message: string = "잘못된 비밀번호 재설정 토큰입니다.";
        return Promise.reject({ status: 404, type: "InvalidToken", message });
      } else if (Date.now() >= userDoc.resetPasswordExpires) {
        const message: string =
          "만료된 토큰입니다. 비밀번호 재설정 요청을 다시 해주세요.";
        return Promise.reject({ status: 403, type: "ExpiredToken", message });
      } else {
        return userDoc;
      }
    } else {
      return await User.findById(user)
        .populate({
          path: "to_read.book reading.book finished.book",
          select: "authors thumbnail title"
        })
        .select("-password");
    }
  },

  patchUser: async (id: string, body: any) => {
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }
    await User.findByIdAndUpdate(id, body);
    return await User.findById(id)
      .populate({
        path: "to_read.book reading.book finished.book",
        select: "authors thumbnail title"
      })
      .select("-password");
  }
};

export default userService;

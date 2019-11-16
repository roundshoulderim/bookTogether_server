import User from "../models/User";
import bcrypt from "bcrypt";

interface IUserInfo {
  email: string;
  name: string;
  password: string;
}

interface IAuthService<T = Promise<object>> {
  signUp: (userInfo: IUserInfo) => T;
  login: (userInfo: IUserInfo) => T;
}

const authService: IAuthService = {
  signUp: async (userInfo: IUserInfo): Promise<object> => {
    const existing = await User.findOne({ email: userInfo.email });
    if (existing) {
      return {
        error: {
          status: 409,
          type: "DuplicateEmail",
          message: "이미 사용중인 이메일 주소입니다."
        }
      };
    }
    const hashedPassword: string = await bcrypt.hash(userInfo.password, 10);
    const user: any = new User({ ...userInfo, password: hashedPassword });
    await user.save();
    return { message: "성공적으로 가입 되었습니다." };
  },

  login: async (userInfo: IUserInfo): Promise<object> => {
    const { email, password } = userInfo;
    const user: any = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        error: {
          status: 401,
          type: "LoginFailed",
          message: "입력하신 이메일과 비밀번호가 일치하지 않습니다."
        }
      };
    }
    return { id: user.id, message: "성공적으로 로그인 되었습니다." };
  }
};
export default authService;

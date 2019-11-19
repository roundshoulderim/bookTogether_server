import User from "../models/User";

const userService = {
  getUser: async (id: string) => {
    return await User.findById(id).populate({
      path: "to_read.book reading.book finished.book",
      select: "authors thumbnail title"
    });
  },

  patchUser: async (id: string, body: object) => {
    await User.findByIdAndUpdate(id, body);
    return await User.findById(id).populate({
      path: "to_read.book reading.book finished.book",
      select: "authors thumbnail title"
    });
  }
};

export default userService;

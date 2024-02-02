import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.freepik.com/128/3237/3237472.png",
    },
    likedArticles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Article",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;

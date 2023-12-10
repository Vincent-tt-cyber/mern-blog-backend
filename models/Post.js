import mongoose, { Mongoose } from "mongoose";

const PostShema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Обязательное поле
    },
    text: {
      type: String,
      required: true,
      unique: true, // должен быть уникальным
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // должен быть обязательным
    },
    imageUrl: String,
  },
  {
    timestamps: true, // Добавление даты создания и обновления
  }
);

// Экспорт(создание) модели User по схеме
export default mongoose.model("Post", PostShema);

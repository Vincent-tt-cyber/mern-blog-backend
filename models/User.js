import mongoose from "mongoose";

const UserShema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true, // Обязательное поле
    },
    email: {
      type: String,
      required: true,
      unique: true, // email должен быть уникальным
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true, // Добавление даты создания и обновления
  }
);

// Экспорт(создание) модели User по схеме
export default mongoose.model("User", UserShema);

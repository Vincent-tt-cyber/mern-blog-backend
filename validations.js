import { body } from "express-validator";

// Login
export const loginValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен иметь минимум 8 символов").isLength({
    min: 8,
  }), // Минимальная длина символов пароля - 8
];

// Register
export const registerValidator = [
  // body(console.log("Проверка")),
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен иметь минимум 8 символов").isLength({
    min: 8,
  }), // Минимальная длина символов пароля - 8
  body("fullName", "Укажите Имя (минимум 3 символа)").isLength({ min: 3 }), // Минимальная длина символов имени - 3
  body("avatarUrl", "Неверный формат ссылки для аватарки").optional().isURL(), // Является ли ссылкой?
];

export const postCreateValidator = [
  body("title", "Введите заголовок статьи").isLength({ min: 3 }).isString(),
  body("text", "Введите текст статьи").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат тегов (укажите массив)").optional().isString(),
  body("imageUrl", "Неверный формат ссылки для изображения")
    .optional()
    .isString(), // Является ли ссылкой?
];

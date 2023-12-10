import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { email, fullName, avatarUrl, password } = req.body;
    // Генерируем соль для password
    const salt = await bcrypt.genSalt(10);

    // Шифруем password
    const hash = await bcrypt.hash(password, salt);

    // Создаем документ Новый User
    const doc = new UserModel({
      email,
      fullName,
      avatarUrl,
      passwordHash: hash,
    });

    // Создаем нового пользователя в БД
    const user = await doc.save();
    // После успешного создания документа, нужно создать jwt-токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );

    res.json({
      ...user._doc,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось совершить регистрацию :(",
    });
  }
};

export const login = async (req, res) => {
  try {
    // Поиск пользователя в БД
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    // Если пользователь не найден в БД
    if (!user) {
      return res.status(400).json({
        message: "Пользователь не найден :(",
      });
    }

    // Сравниваем пароли
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    // Если пароль не совпадает
    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль :(",
      });
    }

    // Создаем токен после всех успешных проверок
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );

    // const { passwordHash } = user._doc;

    res.json({
      ...user._doc,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось авторизоваться :(",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден :(",
      });
    }

    const { passwordHash } = user._doc;
    res.json({
      ...user._doc,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Информация не найдена",
    });
  }
};

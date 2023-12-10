import { validationResult } from "express-validator";

export default (req, res, next) => {
  const errors = validationResult(req);

  // Если есть ошибки в запросе req
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  next();
};

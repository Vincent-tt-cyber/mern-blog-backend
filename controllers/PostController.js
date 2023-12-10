import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    if (posts.length <= 0) {
      return res.status(400).json({
        message: "Статьи не найдены :(",
      });
    }
    res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить статьи :(",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = await req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).populate("user");

    if (!doc) {
      return res.status(404).json({
        message: "Документ не найден :(",
      });
    }

    res.json(doc);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить статью :(",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.findOneAndDelete({
      _id: postId,
    });

    if (!doc) {
      return res.status(404).json({
        message: "Не удалось найти статью :(",
      });
    }

    res.json({
      success: true,
      message: "Статья была уделена :)",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Неверный запрос на уделение статьи :(",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { title, text, imageUrl } = req.body;
    const doc = new PostModel({
      title,
      text,
      imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось создать статью :(",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, text, imageUrl } = req.body;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title,
        text,
        tags: req.body.tags.split(","),
        imageUrl,
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось обновить статью :(",
    });
  }
};

export const getLastTags = async (req, res) => {
  const posts = await PostModel.find().limit(5).exec();

  const tags = posts
    .map((obj) => obj.tags)
    .flat()
    .slice(0, 5);
  res.json(tags);
};

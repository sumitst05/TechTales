import Article from "../models/article.js";

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const createArticle = async (req, res) => {
  const { title, content, tags, author, likes } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Article title cannot be empty." });
  }

  try {
    const article = new Article({
      title,
      content,
      tags,
      author,
      likes,
    });

    const result = await article.save();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const updateArticle = async (req, res) => {
  const { title, content, tags, author, likes } = req.body;
  const articleId = req.params.id;

  try {
    const filter = { _id: articleId };
    const newArticle = {
      title,
      content,
      tags,
      author,
      likes,
    };

    const result = await Article.findOneAndUpdate(filter, newArticle);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Article not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const deleteArticle = async (req, res) => {
  const articleId = req.params.id;

  try {
    const filter = { _id: articleId };
    const result = await Article.findOneAndDelete(filter);

    if (result) {
      res.status(200).json({ message: "Article deleted successfully!" });
    } else {
      res.status(404).json({ message: "Article not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error!" });
  }
};

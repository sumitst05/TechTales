import Article from "../models/article.js";

export const getArticles = async (req, res) => {
	try {
		const { query, page = 1, pageSize = 6 } = req.query;

		let articles;
		if (!query) {
			const skip = (page - 1) * pageSize;

			articles = await Article.find()
				.populate("author")
				.skip(skip)
				.limit(pageSize);

			const totalArticles = await Article.countDocuments();
			return res.status(200).json({ articles, totalArticles });
		}

		const regexQuery = {
			$or: [
				{ title: { $regex: query, $options: "i" } },
				{ tags: { $regex: query, $options: "i" } },
			],
		};
		const skip = (page - 1) * pageSize;

		articles = await Article.find(regexQuery)
			.skip(skip)
			.limit(pageSize)
			.populate("author")
			.exec();

		const totalArticles = await Article.countDocuments(regexQuery);
		res.status(200).json({ articles, totalArticles });
	} catch (error) {
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const createArticle = async (req, res) => {
	const { author, title, content, tags, coverImage, likes } = req.body;

	if (!title) {
		return res.status(400).json({ message: "Article title cannot be empty." });
	}

	try {
		const article = new Article({
			author,
			title,
			content,
			tags,
			coverImage,
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
			author,
			title,
			content,
			tags,
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

export const getTags = async (req, res) => {
	try {
		const { query } = req.query;

		if (!query) {
			return res.status(200).json({ tags: [] });
		}

		const allTags = await Article.distinct("tags");

		const matchingTags = allTags.filter((tag) =>
			new RegExp(`^${query}`, "i").test(tag),
		);

		const slicedTags = matchingTags.slice(0, 3);

		return res.status(200).json(slicedTags);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: error.message });
	}
};

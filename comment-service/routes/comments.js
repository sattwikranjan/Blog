const express = require("express");
const pool = require("../db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// POST /comments/: Add a comment to a blog post
router.post("/comments", authenticate, async (req, res) => {
  const { post_id, content } = req.body;
  const author_id = req.user.id; // Extract author_id from the token

  try {
    const result = await pool.query(
      "INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING *",
      [post_id, author_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// GET /comments?post_id=<id>: List comments for a specific blog post
router.get("/comments", async (req, res) => {
  const { post_id } = req.query;

  try {
    const result = await pool.query(
      "SELECT comments.*, users.username FROM comments JOIN users ON comments.author_id = users.id WHERE post_id = $1 ORDER BY created_at ASC",
      [post_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

module.exports = router;

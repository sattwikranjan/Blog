const express = require("express");
const pool = require("../db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// POST /blogs/: Create a new blog post
router.post("/blogs", authenticate, async (req, res) => {
  const { title, content } = req.body;
  const author_id = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO blogs (title, content, author_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, author_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

// GET /blogs/: List all blog posts (with pagination)
router.get("/blogs", async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 with 10 posts per page
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

// GET /blogs/<id>: Fetch a specific blog post
router.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM blogs WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Blog post not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

// PUT /blogs/<id>: Edit an existing blog post
router.put("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const result = await pool.query(
      "UPDATE blogs SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [title, content, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Blog post not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

// DELETE /blogs/<id>: Delete a specific blog post
router.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM blogs WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Blog post not found" });

    res.json({ message: "Blog post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

module.exports = router;

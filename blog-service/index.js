const express = require("express");
const bodyParser = require("body-parser");
const blogRoutes = require("./routes/blogs");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(blogRoutes);

const PORT = 3002;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));

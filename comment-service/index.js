const express = require("express");
const bodyParser = require("body-parser");
const commentRoutes = require("./routes/comments");

const app = express();
app.use(bodyParser.json());
app.use(commentRoutes);

const PORT = 3003;
app.listen(PORT, () => {
  console.log("Comment service running on port 3003");
});

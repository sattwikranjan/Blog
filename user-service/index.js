const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();
app.use(bodyParser.json());
app.use(authRoutes);
app.use(userRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log("User service running on port 3001");
});

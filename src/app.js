const express = require("express");
const journalistRouter = require("./routes/journalist");
const newsRouter = require("./routes/news");
const app = express();
const port = process.env.PORT || 3000;

require("./db/mongoose");

app.use(express.json());
app.use(journalistRouter);
app.use(newsRouter);

app.listen(port, () => {
  console.log("Server is running");
});

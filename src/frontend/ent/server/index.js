const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

const port = parseInt(process?.argv[2] || 3000);

// Iniciar o server no port 5000
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
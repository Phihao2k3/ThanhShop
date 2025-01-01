import express from "express";

const app = express();

const hostname = "localhost";
const port = 8017;

app.get("/", (req, res) => {
  res.send("Hello Trung Quan Dev, I am running at port 8017");
});

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Hello Trung Quan Dev, I am running at ${hostname}:${port}/`);
});

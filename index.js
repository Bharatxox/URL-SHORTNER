import express from "express";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";

const app = express();

app.use(express.json());
const urlsFilePath = "urls.json";
if (!fs.existsSync(urlsFilePath)) {
  fs.writeFileSync(urlsFilePath, JSON.stringify({}));
}

const isUrlValid = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

app.get("/", (req, res) => {
  res.send(html);
});

app.post("/shorten", (req, res) => {
  // take data from the body
  const { longURL } = req.body;
  console.log(longURL);

  const isValidUrl = isUrlValid(longURL);
  if (!isValidUrl) {
    return res.status(404).json({
      success: false,
      message: "please provide a valid longURL",
    });
  }

  const nanoId = nanoid(6);

  //read the existing URLs data from the file
  const urlsFromFile = fs.readFileSync(urlsFilePath, { encoding: "utf8" });
  const urlsJson = JSON.parse(urlsFromFile);
  //add the new short url and long url into json file
  urlsJson[nanoId] = longURL;
  console.log(urlsJson);

  fs.writeFileSync(urlsFilePath, JSON.stringify(urlsJson, null, 2));
  res.status(200).json({
    success: true,
    message: "API IS POSTed successfully",
    data: `http://localhost:8001/${nanoId}`,
  });
});

app.get("/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const urls = fs.readFileSync("urls.json", { encoding: "utf8" });
  const urlsJson = JSON.parse(urls);
  const longURL = urlsJson[shortURL];
  if (!longURL) {
    return res.end("INVALID short url");
  }
  res.redirect(longURL);
});

const PORT = 8001;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

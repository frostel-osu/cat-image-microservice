"use strict";

import "dotenv/config";
import express from "express";
import cors from "cors";

const PORT = process.env.PORT;
const app = express();

let breeds = fetch("https://api.thecatapi.com/v1/breeds")
  .then((res) => res.json())
  .then((res) => res.reduce((obj, { description, id, name }) => Object.assign(obj, { [name]: { description, id } }), {}));

app.use(cors());

app.get("/breeds", async (req, res) => {
  res.json(Object.keys(breeds));
});

app.get("/breeds/:name", async (req, res) => {
  const { description, id } = breeds[req.params.name];

  const [{ url }] = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${id}&api_key=${process.env.API_KEY}`)
    .then((res) => res.json());

  res.json({
    alt: description,
    src: url
  });
});

app.listen(PORT, async () => {
  breeds = await breeds;

  console.log(`Listening on port ${PORT}...`);
});

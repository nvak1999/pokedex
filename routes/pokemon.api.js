const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const fs = require("fs");

router.get("/", (req, res, next) => {
  try {
    let { page, limit, type, search } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    console.log(type);
    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);

    console.log(db.pokemons);
    if (type)
      db.pokemons = db.pokemons.filter((e) => {
        if (e.Type2) {
          if (
            e.Type1.toLowerCase() === type.toLowerCase() ||
            e.Type2.toLowerCase() === type.toLowerCase()
          )
            return e;
        } else if (e.Type1.toLowerCase() === type.toLowerCase()) return e;
      });
    if (search)
      db.pokemons = db.pokemons.filter((e) => {
        if (e.Name.toLowerCase() === search.toLocaleLowerCase()) return e;
      });
    let start = page === 1 ? page - 1 : page * limit - limit;
    let end = page * limit;
    data = db.pokemons.slice(start, end);

    res.status(200).send({ data });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  let pokemonId = req.params;
  let result = [];
  try {
    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    pokemonId = parseInt(pokemonId.id);
    let previous = pokemonId === 1 ? 721 : pokemonId - 1;
    let next = pokemonId === 721 ? 1 : pokemonId + 1;
    db = db.pokemons.filter(
      (e) => e.id === pokemonId || e.id === next || e.id === previous
    );

    res.status(200).send(db);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

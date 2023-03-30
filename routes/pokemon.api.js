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
        if (
          e.Name.toLowerCase() === search.toLocaleLowerCase() ||
          e.id.toString() === search.toString()
        )
          return e;
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

    const lastId = db.pokemons.length;
    console.log(lastId);

    let currenPoke = "";
    let previousPoke = "";
    let nextPoke = "";
    let previous = pokemonId === 1 ? lastId : pokemonId - 1;
    let next = pokemonId === lastId ? 1 : pokemonId + 1;
    db = db.pokemons.map((e) => {
      if (e.id.toString() === pokemonId.toString()) currenPoke = e;
      if (e.id.toString() === previous.toString()) previousPoke = e;
      if (e.id.toString() === next.toString()) nextPoke = e;
    });
    result.push(currenPoke, previousPoke, nextPoke);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { name, id, url, types } = req.body;
    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);

    db.pokemons.map((e) => {
      if (e.id.toString() === id.toString()) {
        const exception = new Error(`The Pokémon already exists`);
        exception.statusCode = 401;
        throw exception;
      }
    });
    if (!name || !id || !types) {
      const exception = new Error(`Missing required data `);
      exception.statusCode = 401;
      throw exception;
    }

    const { pokemons } = db;
    const newPokemon = { Name: name, id, url, types };
    pokemons.push(newPokemon);
    db.pokemons = pokemons;
    db = JSON.stringify(db);

    fs.writeFileSync("db.json", db);
    res.status(200).send(newPokemon);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

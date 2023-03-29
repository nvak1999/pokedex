var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("hello");
});

const pokeRouter = require("./pokemon.api");
router.use("/pokemons", pokeRouter);
module.exports = router;

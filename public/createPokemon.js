const fs = require("fs");
const csv = require("csvtojson");

const createPokemon = async () => {
  let newData = await csv().fromFile("pokemon.csv");
  let data2 = JSON.parse(fs.readFileSync("../db2.json"));
  console.log(data2.pokemons[0].name.toLowerCase());
  let numberId = 1;
  newData = newData.map((e) => {
    if (numberId < 722) {
      e.url = `http://localhost:8000/pokemon/${numberId}.png`;
      e.id = numberId;
      data2.pokemons.map((e2) => {
        if (e2.name.toLowerCase() === e.Name) {
          e.description = e2.japanese_name;
          e.height = e2.height_m;
          e.weight = e2.weight_kg;
          e.category = e2.status;
          e.abilities = e2.ability_1;
        }
      });

      numberId += 1;
      e.types = e.Type2
        ? [e.Type1.toLowerCase(), e.Type2.toLowerCase()]
        : [e.Type1.toLowerCase()];
      return e;
    } else return null;
  });

  newData = newData.filter((e) => e !== null);
  newData = Array.from(newData);
  let data = JSON.parse(fs.readFileSync("../db.json"));
  data.pokemons = newData;
  fs.writeFileSync("../db.json", JSON.stringify(data));
};
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}
const createPokemon2 = async () => {
  let newData = await csv().fromFile(
    "./archive (2)/pokedex_(Update_05.20).csv"
  );
  newData = Array.from(newData);
  let data = JSON.parse(fs.readFileSync("../db2.json"));
  data.pokemons = newData;
  fs.writeFileSync("../db2.json", JSON.stringify(data));
};
createPokemon();
createPokemon2();

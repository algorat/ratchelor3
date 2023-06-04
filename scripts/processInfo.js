const csv = require("csv-parser");
const fs = require("fs");
const rats = [];

fs.createReadStream("scripts/rawInfo.csv")
  .pipe(csv())
  .on("data", (data) => {
    const { name, ratid, tagline, size, zodiac, positionx, positiony } = data;
    const d1 = data["dialogue 1"];
    const d2 = data["dialogue 2"];
    const d3 = data["dialogue 3"];
    const d4 = data["dialogue 4"];
    const d5 = data["dialogue 5"];
    const final = data["final dialogue"];
    const angry = data["angry message"];
    const ending = data["ending music"] + ".mp3";

    rats.push({
      name,
      filename: ratid,
      tagline,
      size,
      ending,
      reaction_pos: [positionx, positiony],
      zodiac,
      dialogue: [d1, d2, d3, d4, d5, final],
      angry,
    });
  })
  .on("end", () => {
    console.log(rats);
    fs.writeFile("src/data/rats.json", JSON.stringify(rats, null, 4), (err) => {
      console.log(err);
    });
  });

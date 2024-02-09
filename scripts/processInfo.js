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

    const d1_override = data["round 1 override"];
    const d2_override = data["round 2 override"];
    const d3_override = data["round 3 override"];
    const d4_override = data["round 4 override"];
    const d5_override = data["round 5 override"];

    const final = data["final dialogue"];
    const angry = data["angry message"];
    const ending = data["ending music"] + ".mp3";

    const rat = {
      name,
      filename: ratid,
      tagline,
      size,
      ending,
      reaction_pos: [positionx, positiony],
      zodiac,
      dialogue: [d1, d2, d3, d4, d5, final],
      angry,
    };

    if (
      d1_override ||
      d2_override ||
      d3_override ||
      d4_override ||
      d5_override
    ) {
      const fallback = `${ratid}.png`;
      rat.talking_to_rats_filename = [
        d1_override || fallback,
        d2_override || fallback,
        d3_override || fallback,
        d4_override || fallback,
        d5_override || fallback,
      ];
    }

    rats.push(rat);
  })
  .on("end", () => {
    const sortedRats = rats.sort((rata, ratb) => {
      rata.ratid > ratb.ratid;
    });
    console.log(sortedRats);
    fs.writeFile(
      "src/data/rats.json",
      JSON.stringify(sortedRats, null, 4),
      (err) => {
        console.log(err);
      }
    );
  });

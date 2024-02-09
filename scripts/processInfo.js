const csv = require("csv-parser");
const fs = require("fs");
const rats = [];

fs.createReadStream("scripts/rawInfo.csv")
  .pipe(csv())
  .on("data", (data) => {
    const { name, ratid, tagline, size, zodiac, positionx, positiony } = data;
    const d1 = data["dialogue 1"].trim();
    const d2 = data["dialogue 2"].trim();
    const d3 = data["dialogue 3"].trim();
    const d4 = data["dialogue 4"].trim();
    const d5 = data["dialogue 5"].trim();

    const d1_override = data["round 1 override"].trim();
    const d2_override = data["round 2 override"].trim();
    const d3_override = data["round 3 override"].trim();
    const d4_override = data["round 4 override"].trim();
    const d5_override = data["round 5 override"].trim();

    const final = data["final dialogue"].trim();
    const angry = data["angry message"].trim();
    const ending = data["ending music"] + ".mp3";

    const rat = {
      name: name.trim(),
      filename: ratid.trim(),
      tagline: tagline.trim(),
      size,
      ending,
      reaction_pos: [positionx, positiony],
      zodiac: zodiac.trim(),
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
      if (rata.filename < ratb.filename) {
        return -1;
      } else if (rata.filename === ratb.filename) {
        return 0;
      } else {
        return 1;
      }
    });
    console.log(sortedRats);
    fs.writeFile("src/data/rats.json", JSON.stringify(rats, null, 4), (err) => {
      console.log(err);
    });
  });

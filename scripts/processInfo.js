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

    const d1Override = data["round 1 override"].trim();
    const d2Override = data["round 2 override"].trim();
    const d3Override = data["round 3 override"].trim();
    const d4Override = data["round 4 override"].trim();
    const d5Override = data["round 5 override"].trim();

    const r1PosOverrideRaw = data["round 1 reaction position override"].trim();
    const r2PosOverrideRaw = data["round 2 reaction position override"].trim();
    const r3PosOverrideRaw = data["round 3 reaction position override"].trim();
    const r4PosOverrideRaw = data["round 4 reaction position override"].trim();
    const r5PosOverrideRaw = data["round 5 reaction position override"].trim();

    const r1_pos_override = r1PosOverrideRaw
      ? r1PosOverrideRaw.split(",")
      : null;
    const r2_pos_override = r2PosOverrideRaw
      ? r2PosOverrideRaw.split(",")
      : null;
    const r3_pos_override = r3PosOverrideRaw
      ? r3PosOverrideRaw.split(",")
      : null;
    const r4_pos_override = r4PosOverrideRaw
      ? r4PosOverrideRaw.split(",")
      : null;
    const r5_pos_override = r5PosOverrideRaw
      ? r5PosOverrideRaw.split(",")
      : null;

    const final = data["final dialogue"].trim();
    const angry = data["angry message"].trim();
    const ending = data["ending music"] + ".mp3";
    const fontOverride = data["font override"];
    const secondRound = data["second round"];

    const rat = {
      name: name.trim(),
      filename: ratid.trim(),
      tagline: tagline.trim(),
      size,
      ending,
      reactionPos: [positionx, positiony],
      zodiac: zodiac.trim(),
      dialogue: [d1, d2, d3, d4, d5, final],
      angry,
    };

    if (d1Override || d2Override || d3Override || d4Override || d5Override) {
      const fallback = `${ratid}.png`;
      rat.talkingToRatsFilename = [
        d1Override || fallback,
        d2Override || fallback,
        d3Override || fallback,
        d4Override || fallback,
        d5Override || fallback,
      ];
    }

    if (
      r1_pos_override ||
      r2_pos_override ||
      r3_pos_override ||
      r4_pos_override ||
      r5_pos_override
    ) {
      rat.reactionPosOverride = [
        r1_pos_override,
        r2_pos_override,
        r3_pos_override,
        r4_pos_override,
        r5_pos_override,
      ];
    }
    if (fontOverride) {
      rat.fontOverride = fontOverride;
    }

    if (secondRound) {
      rat.secondRound = secondRound;
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

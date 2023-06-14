const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const finalJson = {};
const reactionScores = {};

fs.createReadStream("scripts/reactionScores.csv")
  .pipe(csv())
  .on("data", (data) => {
    const { Positive, Neutral, Negative } = data;
    if (Positive) {
      reactionScores[Positive.trim()] = 1;
    }
    if (Neutral) {
      reactionScores[Neutral.trim()] = 0;
    }
    if (Negative) {
      reactionScores[Negative.trim()] = -1;
    }
  })
  .on("end", () => {
    writeReactions();
  });

function writeReactions() {
  fs.createReadStream("scripts/reactions.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      for (const entry of results) {
        const rounds = [];
        const ratName = entry["Rat"];
        for (const [key, value] of Object.entries(entry)) {
          if (key === "Rat" || key === "Round") continue;
          if (value && value.length > 0) {
            let score = 0;
            if (reactionScores[value.trim()] !== null) {
              score = reactionScores[value.trim()];
            } else {
              console.warn("missing reaction score for", value);
            }
            const round = {
              response: key,
              reaction: value,
              score,
            };
            rounds.push(round);
          }
        }

        if (ratName.toLowerCase() in finalJson) {
          finalJson[ratName.toLowerCase()].push(rounds);
        } else {
          finalJson[ratName.toLowerCase()] = [rounds];
        }
      }
      fs.writeFile(
        "src/data/responses.json",
        JSON.stringify(finalJson, null, 4),
        (err) => {
          console.log(err);
        }
      );
    });
}

var walk = require("walk");
var fs = require("fs");

async function recurisvelyGetFilesInDirectory(path) {
  const files = [];
  const walker = walk.walk(path, {});

  function onFile(root, stat, next) {
    if (stat.name.toLowerCase() !== ".ds_store") {
      files.push(root + "/" + stat.name);
    }
    next();
  }

  walker.on("file", onFile);

  return new Promise((resolve) => {
    walker.on("end", () => {
      resolve(files);
    });
  });
}

async function main() {
  const filePromises = Promise.all([
    recurisvelyGetFilesInDirectory("public/images"),
    recurisvelyGetFilesInDirectory("public/sounds"),
  ]);

  const files = await filePromises;
  const allFiles = files.flatMap((f) => f);
  fs.writeFile(
    "src/data/assetsToPreload.json",
    JSON.stringify(allFiles),
    "utf8",
    () => {}
  );
}

main();

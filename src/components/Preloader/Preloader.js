import React, { useEffect, useState, useRef } from "react";
import assetsToPreload from "../../data/assetsToPreload.json";

const MAX_PRELOAD_TIME = 10000; // 10 seconds.
const copyOfAssetsToPreload = assetsToPreload.slice();

export function Preloader(props) {
  const [remainingAssets, setRemainingAssets] = useState(copyOfAssetsToPreload);
  const remainingAssetsRef = useRef(remainingAssets);
  const setRemainingAssetsRef = (data) => {
    remainingAssetsRef.current = data;
    setRemainingAssets(data);
  };

  useEffect(() => {
    assetsToPreload.forEach((fullFilename) => {
      const splitByExtension = fullFilename.split(".");
      const extension = splitByExtension[splitByExtension.length - 1];
      let filename = fullFilename;
      if (fullFilename.indexOf("public") !== -1) {
        filename = process.env.PUBLIC_URL + "/" + fullFilename.slice(7);
      }
      if (extension.indexOf("mp3") >= 0 || extension.indexOf("wav") >= 0) {
        const audio = new Audio(filename);
        console.log("loading audio", filename, audio);
        audio.addEventListener("canplaythrough", () => {
          console.log("audio loaded", fullFilename, remainingAssetsRef.current);
          setRemainingAssetsRef(
            remainingAssetsRef.current.filter((f) => f !== fullFilename)
          );
        });
        audio.load();
      } else {
        const img = new Image();
        img.src = filename;
        img.onload = () => {
          setRemainingAssetsRef(
            remainingAssetsRef.current.filter((f) => f !== fullFilename)
          );
        };
      }
    });

    setTimeout(() => {
      console.log("10 second limit hit", remainingAssetsRef.current);
      setRemainingAssetsRef([]);
    }, MAX_PRELOAD_TIME);
  }, []);

  if (remainingAssets.length === 0) {
    return <>{props.children}</>;
  } else {
    return (
      <div>
        Loading...
        {Math.floor(
          ((assetsToPreload.length - remainingAssets.length) /
            assetsToPreload.length) *
            100
        )}
        %
      </div>
    );
  }
}

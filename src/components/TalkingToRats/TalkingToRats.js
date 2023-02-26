import "./TalkingToRats.css";
import { useInterval } from "../../utils/reactUseInterval";

import {
  getRatById,
  DATES_IMAGES_BASE_PATH,
  PLAYER_IMAGES_BASE_PATH,
  getResponsesByRound,
} from "../../utils/ratDataHelper";

import React, { useState } from "react";

const MAX_PREALOAD_TIME = 3000; // In ms.
const DIALOGUE_INTERVAL = 30; // In ms;

// TODOs:
// reactions
export function TalkingToRats(props) {
  const [ratIndex, setRatIndex] = useState(0);
  const [ratDateImages, setRatDateImages] = useState([]);
  const [ratImagesLoaded, setRatImagesLoaded] = useState(false);
  const [ratDialogueProgress, setRatDialogueProgress] = useState(0);
  const [ratResponses, setRatResponses] = useState([]);

  function preloadRatImages() {
    const tempRatDateImages = [];
    // This is an array of promises that will resolve once their image has been
    // loaded. Promise.all means it will resolve once ALL of the images are
    // loaded.
    const ratLoadingPromises = Promise.all(
      props.activeRats.map(
        (ratId) =>
          new Promise((resolve) => {
            const ratData = getRatById(ratId);
            const filename =
              ratData.talking_to_rats_filename?.[props.round] ?? ratId;
            const fullFilepath = `${DATES_IMAGES_BASE_PATH}/${filename}.png`;
            const ratDateImage = (
              <img
                src={fullFilepath}
                alt={ratData.name}
                onLoad={() => {
                  console.log("resolved");
                  resolve();
                }}
              />
            );
            tempRatDateImages.push(ratDateImage);
          })
      )
    );
    // Enter the finished state once all the images are loaded, OR once the max
    // preloading time has been reached, whichever is earlier.
    Promise.race([
      ratLoadingPromises,
      new Promise((resolve) => {
        setTimeout(resolve, MAX_PREALOAD_TIME);
      }),
    ]).then(() => {
      setRatImagesLoaded(true);
      setupNextRat();
    });

    // Finally, set the rat date images.
    setRatDateImages(tempRatDateImages);
  }

  function onResponseSelect() {
    if (ratIndex === props.activeRats.length - 1) {
      props.goToRoseCeremony();
      return;
    }
    setRatIndex(ratIndex + 1);
    setupNextRat();
  }

  function setupNextRat() {
    setRatDialogueProgress(0);
    setRatResponses(getResponsesByRound(currentRatId, props.round, 3));
  }

  // Preload if we haven't already.
  !ratDateImages.length && preloadRatImages();

  const currentRatId = props.activeRats[ratIndex];
  const ratData = getRatById(currentRatId);
  const ratName = ratData.name;
  const ratDialogue = ratData.dialogue[props.round];
  const currentRatDialogue = ratDialogue.slice(0, ratDialogueProgress);

  useInterval(
    () => {
      console.log(ratDialogueProgress);
      setRatDialogueProgress(ratDialogueProgress + 1);
    },
    ratDialogueProgress < ratDialogue.length ? DIALOGUE_INTERVAL : null
  );

  return (
    <>
      <div className="talking-to-rats-screen screen">
        <div className="player-rat">
          <img
            src={`${PLAYER_IMAGES_BASE_PATH}/${props.playerAvatarIndex}.png`}
            alt="Your player rat on a date."
          />
        </div>
        {ratDateImages.map((ratDateImage, idx) => (
          <div
            key={`rat-date-${idx}`}
            className={
              ratImagesLoaded && idx === ratIndex
                ? "current-rat contestant"
                : "contestant"
            }
          >
            {ratDateImage}
          </div>
        ))}
        <div className="dialogue-container">
          <div className="rat-name">{ratName}</div>
          <div className="text-dialogue-container">
            <div className="rat-dialogue" aria-hidden="true">
              {currentRatDialogue}
            </div>
            <div className="visually-hidden">{ratDialogue}</div>
            <div className="responses">
              {ratResponses.map((response, ridx) => (
                <button
                  key={`ratresponse${ridx}`}
                  className="response"
                  onClick={onResponseSelect}
                >
                  {response.response}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

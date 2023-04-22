import "./TalkingToRats.css";
import { useInterval } from "../../utils/reactUseInterval";
import { MobileControl } from "../MobileControl/MobileControl";

import { Reaction } from "../Reaction/Reaction";

import {
  getRatById,
  DATES_IMAGES_BASE_PATH,
  PLAYER_IMAGES_BASE_PATH,
  REACTIONS_IMAGES_BASE_PATH,
  BACKGROUNDS_IMAGES_BASE_PATH,
  getResponsesByRound,
} from "../../utils/ratDataHelper";

import { getMatchingSound, getTalkingMusic } from "../../utils/soundDataHelper";

import React, { useState } from "react";

const MAX_PREALOAD_TIME = 3000; // In ms.
const DIALOGUE_INTERVAL = 30; // In ms;
const REACTION_TIMEOUT = 2000; // In ms.
const DIALOGUE_ANIMATION = 500; // In ms.

export function TalkingToRats(props) {
  const [ratIndex, setRatIndex] = useState(0);
  const [ratDateImages, setRatDateImages] = useState([]);
  const [ratImagesLoaded, setRatImagesLoaded] = useState(false);
  const [dialogueProgress, setDialogueProgress] = useState(0);
  const [animatingDialogue, setAnimatingDialogue] = useState(true);
  const [ratResponses, setRatResponses] = useState([]);
  const [currentReaction, setCurrentReaction] = useState(null);

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
      setupNextRat(ratIndex, true);
    });

    // Finally, set the rat date images.
    setRatDateImages(tempRatDateImages);
  }

  function onResponseSelect(response) {
    props.updateRatFeelings(props.activeRats[ratIndex], response.score);
    showReaction(response.reaction);
  }

  function showReaction(reaction) {
    setCurrentReaction(reaction);
    props.updateSfx(`${getMatchingSound(reaction)}.mp3`);

    setTimeout(() => {
      if (ratIndex === props.activeRats.length - 1) {
        props.goToRoseCeremony();
        return;
      }
      setupNextRat(ratIndex + 1);
    }, REACTION_TIMEOUT);
  }

  function setupNextRat(nextRatIndex, skipWait = false) {
    setAnimatingDialogue(true);
    setTimeout(
      () => {
        setCurrentReaction(null);
        setAnimatingDialogue(false);
        setRatIndex(nextRatIndex);
        setDialogueProgress(0);
        const nextRatId = props.activeRats[nextRatIndex];
        setRatResponses(getResponsesByRound(nextRatId, props.round, 3));
        props.updateMusic(getTalkingMusic(nextRatIndex));
      },
      skipWait ? 0 : DIALOGUE_ANIMATION
    );
  }

  // Preload if we haven't already.
  !ratDateImages.length && preloadRatImages();

  const currentRatId = props.activeRats[ratIndex];
  const ratData = getRatById(currentRatId);
  const ratName = ratData.name;
  const ratReactionPos = ratData.reaction_pos;
  const ratDialogue = ratData.dialogue[props.round];
  const currentRatDialogue = ratDialogue.slice(0, dialogueProgress);

  useInterval(
    () => {
      setDialogueProgress(dialogueProgress + 1);
    },
    dialogueProgress < ratDialogue.length ? DIALOGUE_INTERVAL : null
  );

  const responses = ratResponses.map((response, ridx) => (
    <button
      key={`ratresponse${ridx}`}
      className="response"
      onClick={() => onResponseSelect(response)}
    >
      {response.response}
    </button>
  ));

  const ratDialogueHtml = (
    <>
      <div className="rat-dialogue" aria-hidden="true">
        {currentRatDialogue}
      </div>
      <div className="visually-hidden">{ratDialogue}</div>
      <MobileControl show={false}>
        <div className="responses">{responses}</div>
      </MobileControl>
    </>
  );

  return (
    <>
      <div className="talking-to-rats-screen screen">
        <img src={`${BACKGROUNDS_IMAGES_BASE_PATH}/couch.gif`} alt="" />
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
              ratImagesLoaded && idx === ratIndex && !animatingDialogue
                ? "current-rat contestant"
                : "contestant"
            }
          >
            {ratDateImage}
          </div>
        ))}
        {currentReaction && (
          <Reaction
            src={`${currentReaction}.png`}
            left={ratReactionPos[0] * 100}
            top={ratReactionPos[1] * 100}
          />
        )}
        <div
          className={`dialogue-container ${
            animatingDialogue ? "dialogue-out" : ""
          }`}
        >
          <div className="rat-name heading-medium">{ratName}</div>
          <div className="text-dialogue-container">
            {currentReaction ? (
              <div className="rat-dialogue reacting">
                <img
                  src={`${REACTIONS_IMAGES_BASE_PATH}/${currentReaction}.png`}
                  alt={`${ratName} is reacting with ${currentReaction}`}
                />
              </div>
            ) : (
              ratDialogueHtml
            )}
          </div>
        </div>
      </div>
      <MobileControl show={true} header="Select a response!">
        <div className="mobile-responses">{responses}</div>
      </MobileControl>
    </>
  );
}

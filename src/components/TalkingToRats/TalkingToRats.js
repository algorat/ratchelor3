import "./TalkingToRats.css";
import { useInterval } from "../../utils/reactUseInterval";
import { MobileControl } from "../MobileControl/MobileControl";

import { Reaction } from "../Reaction/Reaction";

import leavingMessages from "../../data/leavingResponses.json";

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

const PRE_ANIMATION_DURATION = 6000; // In ms.
const DIALOGUE_INTERVAL = 30; // In ms;
const REACTION_TIMEOUT = 2000; // In ms.
const DIALOGUE_ANIMATION = 500; // In ms.
const ANGRY_RESPONSE_TIMEOUT = 2000; // In ms.

const backgrounds = [
  { file: "bus_date.png", animation: "bus" },
  { file: "cathy_date.png", animation: "cathy" },
  { file: "dobra_back.png", animation: "dobra", front: "dobra_front.png" },
  {
    file: "incline_back.png",
    animation: "incline",
    front: "incline_front.png",
  },
  { file: "conservatory.png", animation: "conservatory" },
];

export function TalkingToRats(props) {
  const [ratIndex, setRatIndex] = useState(0);
  const [ratDateImages, setRatDateImages] = useState([]);
  const [ratImagesLoaded, setRatImagesLoaded] = useState(false);
  const [dialogueProgress, setDialogueProgress] = useState(0);
  const [animatingDialogue, setAnimatingDialogue] = useState(true);
  const [ratResponses, setRatResponses] = useState([]);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [isAngry, setIsAngry] = useState(false);
  const [showAngryResponse, setShowAngryResponse] = useState(false);
  const [showingLeavingPopup, setShowLeavingPopup] = useState(false);

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
                  resolve();
                }}
              />
            );
            tempRatDateImages.push(ratDateImage);
          })
      )
    );
    props.updateMusic(getTalkingMusic(0));
    // Wait for the animation duration before going onwards.
    // In the meantime, the images can preload.
    new Promise((resolve) => {
      setTimeout(resolve, PRE_ANIMATION_DURATION);
    }).then(() => {
      setRatImagesLoaded(true);
      setupNextRat(ratIndex, true);
    });

    // Finally, set the rat date images.
    setRatDateImages(tempRatDateImages);
  }

  function onResponseSelect(response) {
    if (currentReaction) {
      // They clicked more than once, so we exit.
      console.log("exiting early");
      return;
    }
    const leaving = props.updateRatFeelings(
      props.activeRats[ratIndex],
      response.score
    );
    setIsAngry(leaving);
    showReaction(response.reaction, leaving);
    setTimeout(() => {
      setShowAngryResponse(true);
    }, ANGRY_RESPONSE_TIMEOUT);
  }

  function showReaction(reaction, leaving) {
    setCurrentReaction(reaction);
    props.updateSfx(`${getMatchingSound(reaction)}.mp3`);

    if (!leaving) {
      setTimeout(moveOntoNextRat, REACTION_TIMEOUT);
    }
  }

  function moveOntoNextRat() {
    // TODO(connie): fix edge case where user hits twice
    if (ratIndex === props.activeRats.length - 1) {
      props.goToRoseCeremony();
      return;
    }
    setupNextRat(ratIndex + 1);
  }

  function setupNextRat(nextRatIndex, skipWait = false) {
    setAnimatingDialogue(true);
    setTimeout(
      () => {
        setCurrentReaction(null);
        setIsAngry(false);
        setShowAngryResponse(false);
        setAnimatingDialogue(false);
        setRatIndex(nextRatIndex);
        setDialogueProgress(0);
        const nextRatId = props.activeRats[nextRatIndex];
        setRatResponses(getResponsesByRound(nextRatId, props.round));
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

  let responses = ratResponses.map((response, ridx) => (
    <button
      key={`ratresponse${ridx}`}
      className="response"
      onClick={() => onResponseSelect(response)}
    >
      {response.response}
    </button>
  ));

  let ratDialogueHtml = (
    <>
      <div className="rat-dialogue" aria-hidden="true">
        {currentRatDialogue}
        <MobileControl show={false}>
          <div className="responses">{responses}</div>
        </MobileControl>
      </div>
      <div className="visually-hidden">{ratDialogue}</div>
    </>
  );

  if (isAngry) {
    const responseIdx = Math.floor(
      props.randomLeavingResponse * leavingMessages.responses.length
    );
    responses = (
      <button
        className={`response ${showAngryResponse ? "" : "hidden"}`}
        onClick={() => {
          setShowAngryResponse(false);
          setShowLeavingPopup(true);
        }}
      >
        {leavingMessages.responses[responseIdx]}
      </button>
    );
    ratDialogueHtml = (
      <>
        <div className="rat-dialogue angry">
          {ratData.angry}
          <MobileControl show={false}>
            <div className="responses">{responses}</div>
          </MobileControl>
        </div>
      </>
    );
  } else if (currentReaction) {
    responses = "";
    ratDialogueHtml = (
      <div className="rat-dialogue reacting">
        <img
          src={`${REACTIONS_IMAGES_BASE_PATH}/${currentReaction}.png`}
          alt={`${ratName} is reacting with ${currentReaction}`}
        />
      </div>
    );
  }

  const backgroundData = backgrounds[props.round];

  return (
    <>
      <div className="talking-to-rats-screen screen">
        <div className={`all-images-container ${backgroundData.animation}`}>
          <img
            className="background"
            src={`${BACKGROUNDS_IMAGES_BASE_PATH}/${backgroundData.file}`}
            alt=""
          />
          <div className="player-rat">
            <img
              src={`${PLAYER_IMAGES_BASE_PATH}/${props.playerAvatarIndex}.png`}
              alt="Your player rat on a date."
            />
            {props.playerAvatarDecorations.map((decoration) => (
              <img
                key={`decoration${decoration}`}
                src={`${PLAYER_IMAGES_BASE_PATH}/${props.playerAvatarIndex}_couch_${decoration}.png`}
                alt=""
              />
            ))}
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
          {backgroundData.front && (
            <img
              className="background"
              src={`${BACKGROUNDS_IMAGES_BASE_PATH}/${backgroundData.front}`}
              alt=""
            />
          )}
        </div>
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
          <h3 className="rat-name">{ratName}</h3>
          <div className="text-dialogue-container">{ratDialogueHtml}</div>
        </div>
        <MobileControl show={false}>
          {showingLeavingPopup && (
            <div className="leaving-modal">
              <p>This rat is leaving the show!</p>
              <button
                onClick={() => {
                  setShowLeavingPopup(false);
                  moveOntoNextRat();
                }}
              >
                Okay
              </button>
            </div>
          )}
        </MobileControl>
      </div>
      <MobileControl
        show={true}
        header="Select a response!"
        ctaButton={
          showingLeavingPopup && (
            <button
              onClick={() => {
                setShowLeavingPopup(false);
                moveOntoNextRat();
              }}
            >
              Okay
            </button>
          )
        }
      >
        {showingLeavingPopup
          ? "This rat is leaving the show!"
          : !animatingDialogue && (
              <div className="mobile-responses">{responses}</div>
            )}
      </MobileControl>
    </>
  );
}

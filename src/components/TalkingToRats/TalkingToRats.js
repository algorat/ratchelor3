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

import React, { useState, useEffect } from "react";

const DIALOGUE_INTERVAL = 30; // In ms;
const REACTION_TIMEOUT = 2000; // In ms.
const DIALOGUE_ANIMATION = 500; // In ms.
const ANGRY_RESPONSE_TIMEOUT = 2000; // In ms.

const backgrounds = [
  {
    file: "cathy.gif",
    animation: {
      backgroundSize: [1222, 2100],
      couchOffset: [80, -640],
      containerStart: [-0.066, 1.3],
      delay: 100,
      duration: 4500,
      mobile: false,
    },
  },
  {
    file: "bus.gif",
    animation: {
      backgroundSize: [3000, 2250],
      couchOffset: [0, -500],
      containerStart: [0, 0.22],
      delay: 1500,
      duration: 3500,
      mobile: true,
    },
  },
  {
    file: "dobra.gif",
    front: "dobra_front.png",
    animation: {
      backgroundSize: [1493, 1120],
      couchOffset: [0, -130],
      containerStart: [0, 0.115],
      delay: 1000,
      duration: 4000,
      mobile: true,
    },
  },
  {
    file: "incline_back.png",
    front: "incline_front.png",
    animation: {
      backgroundSize: [3000, 2250],
      couchOffset: [13, -140],
      containerStart: [0, 0.065],
      delay: 1400,
      duration: 4000,
      mobile: true,
    },
  },
  {
    file: "conservatory.png",
    animation: {
      backgroundSize: [2748, 2195],
      couchOffset: [-778, -550],
      containerStart: [0.281, 0.25],
      delay: 2000,
      duration: 6000,
      mobile: true,
    },
  },
];

export function TalkingToRats(props) {
  const [ratIndex, setRatIndex] = useState(0);
  const [ratDateImages, setRatDateImages] = useState([]);
  const [dialogueProgress, setDialogueProgress] = useState(0);
  const [animatingDialogue, setAnimatingDialogue] = useState(true);
  const [ratResponses, setRatResponses] = useState([]);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [isAngry, setIsAngry] = useState(false);
  const [showAngryResponse, setShowAngryResponse] = useState(false);
  const [showingLeavingPopup, setShowLeavingPopup] = useState(false);
  const [backgroundTransform, setBackgroundTransform] = useState("");
  const [containerTransform, setContainerTransform] = useState("");
  const [showContestants, setShowContestants] = useState(false);
  const [containerTransformDuration, setContainerTransformDuration] =
    useState("0");

  function preloadRatImages() {
    const tempRatDateImages = [];
    // This is an array of promises that will resolve once their image has been
    // loaded. Promise.all means it will resolve once ALL of the images are
    // loaded.
    Promise.all(
      props.activeRats.map(
        (ratId) =>
          new Promise((resolve) => {
            const ratData = getRatById(ratId);
            let filename = `${DATES_IMAGES_BASE_PATH}/${ratId}.png`;
            const override = ratData.talking_to_rats_filename?.[props.round];
            if (override) {
              filename = `${DATES_IMAGES_BASE_PATH}/${override}`;
            }
            const ratDateImage = (
              <img
                src={filename}
                alt={ratData.name}
                onLoad={() => {
                  resolve();
                }}
              />
            );
            tempRatDateImages.push({ img: ratDateImage, id: ratId });
          })
      )
    );

    // Finally, set the rat date images.
    setRatDateImages(tempRatDateImages);
  }

  function getBackgroundAnimation() {
    const {
      backgroundSize,
      duration,
      delay,
      couchOffset,
      containerStart,
      mobile,
    } = backgrounds[props.round].animation;
    const backgroundWidth = backgroundSize[0];
    const backgroundHeight = backgroundSize[1];
    let gameWidth = 900;
    let gameHeight = 675;

    let offsetX = (-1 * (backgroundWidth - gameWidth)) / 2;
    let offsetY = (-1 * (backgroundHeight - gameHeight)) / 2;
    const backgroundTransform = `translate(${offsetX + couchOffset[0]}px, ${
      offsetY + couchOffset[1]
    }px)`;

    if (props.mobileMode && props.mobileWidth) {
      gameWidth = props.mobileWidth;
      gameHeight = (props.mobileWidth * 675) / 900;
    }
    let startingScaleX = gameWidth / backgroundWidth;
    let startingScaleY = gameHeight / backgroundHeight;
    let containerStartingScale = Math.max(startingScaleX, startingScaleY);
    const gameStartingWidth = containerStartingScale * 900;
    const gameStartingHeight = containerStartingScale * 675;
    let containerFinalScale = gameWidth / 900;
    const startingTransform = `translate(${
      (gameWidth - gameStartingWidth) / 2 + gameWidth * containerStart[0]
    }px, ${
      (gameHeight - gameStartingHeight) / 2 + gameHeight * containerStart[1]
    }px) scale(${containerStartingScale})`;
    const endingTransform = `scale(${containerFinalScale})`;

    if (props.mobileMode && !mobile) {
      // shouldn't animate on mobile.
      return {
        startingTransform: endingTransform,
        endingTransform,
        backgroundTransform,
        duration: 0,
        delay: 0,
      };
    }

    return {
      startingTransform,
      endingTransform,
      backgroundTransform,
      duration,
      delay,
    };
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

  useEffect(() => {
    const {
      backgroundTransform,
      startingTransform,
      endingTransform,
      duration,
      delay,
    } = getBackgroundAnimation();
    setBackgroundTransform(backgroundTransform);
    setContainerTransform(startingTransform);

    setTimeout(() => {
      setContainerTransform(endingTransform);
      setContainerTransformDuration(duration);
      setTimeout(() => {
        setShowContestants(true);
        setupNextRat(ratIndex, true);
      }, duration + 600);
    }, delay);
  }, [props.mobileMode, props.mobileWidth]);

  // Preload if we haven't already.
  !ratDateImages.length && preloadRatImages();

  const currentRatId = props.activeRats[ratIndex];
  const ratData = getRatById(currentRatId);
  const ratName = ratData.name;
  let ratReactionPos = ratData.reaction_pos;
  const reactionPosOverrides = ratData.reaction_pos_override;
  if (reactionPosOverrides && reactionPosOverrides[props.round]) {
    ratReactionPos = reactionPosOverrides[props.round];
  }
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
        <div
          style={{
            transform: containerTransform,
            transitionTimingFunction: "ease-in",
            transitionDuration: `${containerTransformDuration}ms`,
          }}
          className={`all-images-container ${
            showContestants ? "show-contestants" : ""
          }`}
        >
          <img
            className="background"
            style={{ transform: backgroundTransform }}
            src={`${BACKGROUNDS_IMAGES_BASE_PATH}/${backgroundData.file}`}
            alt=""
          />
          <img src={`${BACKGROUNDS_IMAGES_BASE_PATH}/couch.png`} alt="" />
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
          {ratDateImages.map(({ img, id }) => (
            <div
              key={`rat-date-${id}`}
              className={
                id === currentRatId && !animatingDialogue
                  ? "current-rat contestant"
                  : "contestant"
              }
            >
              {img}
            </div>
          ))}
          {backgroundData.front && (
            <img
              className="background"
              style={{ transform: backgroundTransform }}
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
              <p>{ratName} has decided to pack their bags and leave</p>
              <button
                onClick={() => {
                  setShowLeavingPopup(false);
                  moveOntoNextRat();
                }}
              >
                Okay :(
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
          ? `${ratName} has decided to pack their bags and leave`
          : !animatingDialogue && (
              <div className="mobile-responses">{responses}</div>
            )}
      </MobileControl>
    </>
  );
}

import "./App.css";
import React, { useEffect, useState } from "react";
import { Intro } from "../Intro/Intro";
import { Ending } from "../Ending/Ending";
import { Epilogue } from "../Epilogue/Epilogue";
import { PlayerSelect } from "../PlayerSelect/PlayerSelect";
import { RatSelect } from "../RatSelect/RatSelect";
import { TalkingToRats } from "../TalkingToRats/TalkingToRats";
import { RoseCeremony } from "../RoseCeremony/RoseCeremony";
import { Proposal } from "../Proposal/Proposal";
import { Credits } from "../Credits/Credits";
import { SoundManager } from "../SoundManager/SoundManager";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, increment, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_URL,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREID,
};

// Init firebase analytics and database.
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const database = getDatabase(app);

import { getTalkingMusic } from "../../utils/soundDataHelper";

import {
  getRatById,
  BACKGROUNDS_IMAGES_BASE_PATH,
  INTRO_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";

import { PlayerCustomization } from "../PlayerCustom/PlayerCustomization";

const GameStages = {
  INTRO: 0,
  PLAYER_SELECT: 1,
  PLAYER_CUSTOMIZATION: 2,
  RAT_SELECT: 3,
  TALKING_TO_RATS: 4,
  ROSE_CEREMONY: 5,
  PROPOSAL: 6,
  ANIME_ENDING: 7,
  EPILOGUE: 8,
  CREDITS: 9,
};

// Num rats the person should select at the very beginning.
// const RATS_IN_GAME = 2;

// // How many rounds there are.
// const NUM_ROUNDS = 1;

// // How many roses get given out each round.
// const ROSES_PER_ROUND = [1];

// Num rats the person should select at the very beginning.
const RATS_IN_GAME = 7;

// How many rounds there are.
const NUM_ROUNDS = 5;

// How many roses get given out each round.
const ROSES_PER_ROUND = [5, 4, 3, 2, 1];

// Increments the rat count for ratchelor3 in Firebase realtime database.
function incrementRatCountInDatabase(ratName, leaving) {
  if (!leaving) {
    // They were proposed to.
    set(ref(database, "ratchelor3/proposals/" + ratName), increment(1));
  } else {
    // This time we also want to track rats leaving :)
    set(ref(database, "ratchelor3/leavings/" + ratName), increment(1));
  }
}

function RatchelorApp() {
  // What phase of the game we're in, like rose ceremony, propsal, etc.
  const [gameStage, setGameStage] = useState(GameStages.INTRO);

  // What round of the rose-talking loop we're on.
  const [round, setRound] = useState(0);

  // All rats currently still in the game.
  const [originalRats, setOriginalRats] = useState([]);

  // All rats currently still in the game.
  const [activeRats, setActiveRats] = useState([]);

  // Randomized active rats.
  const [randomizedActiveRats, setRandomizedActiveRats] = useState([]);
  const [randomLeavingResponse, setRandomLeavingResponse] = useState(0);

  // State variables for setting the global sound effects.
  const [sfx, setSfx] = useState(null);
  const [sfxTimestamp, setSfxTimestamp] = useState(0);

  // State variables for setting the global music.
  const [music, setMusic] = useState(null);
  const [musicTimestamp, setMusicTimestamp] = useState(0);

  // Keep track of rat feelings so rats can leave if disrespected.
  const [ratFeelings, setRatFeelings] = useState({});

  // Tracks which rat is currently leaving, if any.
  const [currentlyLeavingRat, setCurrentlyLeavingRat] = useState(null);

  // The player avatar that was selected.
  const [playerAvatarIndex, setPlayerAvatarIndex] = useState(null);

  // The player avatar decorations that were selected.
  const [playerAvatarDecorations, setPlayerAvatarDecorations] = useState([]);

  const [playingInterlude, setPlayingInterlude] = useState(false);
  const [playingInterludeText, setPlayingInterludeText] = useState("");

  const [mobileMode, setMobileMode] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(900);
  const [mobileLandscapeMode, setMobileLandscapeMode] = useState(false);

  function onMobileChange(watchMobile, watchLandscapeMobile) {
    setMobileMode(watchMobile.matches);
    setMobileLandscapeMode(watchLandscapeMobile.matches);

    const screenHeight = document.body.clientHeight;
    const screenWidth = document.body.clientWidth;

    const targetMobileWidth = (screenHeight * 900) / 675;
    setMobileWidth(targetMobileWidth);

    // A small timeout to avoid race condition.
    setTimeout(() => {
      document.documentElement.style.setProperty(
        "--game-width",
        `${targetMobileWidth}px`
      );
      document.documentElement.style.setProperty(
        "--mobile-height",
        `${screenHeight}px`
      );
      document.documentElement.style.setProperty(
        "--mobile-width",
        `${screenWidth}px`
      );
    }, 50);
  }

  useEffect(() => {
    const watchMobile = window.matchMedia("only screen and (hover: none)");
    const watchLandscapeMobile = window.matchMedia(
      "(hover: none) and (orientation: portrait)"
    );

    watchLandscapeMobile.addEventListener("change", () =>
      onMobileChange(watchMobile, watchLandscapeMobile)
    );
    onMobileChange(watchMobile, watchLandscapeMobile);
  }, [mobileLandscapeMode]);

  function playInterlude(interludeText, callback) {
    updateSfx("curtain.mp3");
    setPlayingInterlude(true);
    setPlayingInterludeText(interludeText);

    setTimeout(() => {
      setPlayingInterlude(false);
      callback();
    }, 2000);
  }

  function goToPlayerSelect() {
    updateMusic("intro.mp3");
    playInterlude("Meet yourself", () => {
      setGameStage(GameStages.PLAYER_SELECT);
    });
  }

  function goToPlayerCustomization() {
    playInterlude("Dress up for the show!", () => {
      setGameStage(GameStages.PLAYER_CUSTOMIZATION);
    });
  }

  function goToRatSelect() {
    playInterlude("Meet your suitors", () => {
      setGameStage(GameStages.RAT_SELECT);
    });
  }

  function goToTalkingToRats() {
    setRandomizedActiveRats(activeRats.sort(() => 0.5 - Math.random()));
    setRandomLeavingResponse(Math.random());
    setCurrentlyLeavingRat(null);
    playInterlude("Time 2 date!", () => {
      setGameStage(GameStages.TALKING_TO_RATS);
      updateMusic(getTalkingMusic(0));
    });
  }

  function goToRoseCeremony() {
    updateMusic("rose_ceremony.mp3");
    playInterlude("Who gets a rose?", () => {
      setGameStage(GameStages.ROSE_CEREMONY);
    });
  }

  function goToNextRound(chosenRats) {
    if (round === NUM_ROUNDS - 1) {
      updateMusic("romantic_sad.mp3");
      playInterlude("Proposal!", () => {
        setGameStage(GameStages.PROPOSAL);
        setActiveRats(chosenRats);
      });
      return;
    }

    playInterlude("Time 2 date!", () => {
      setRound(round + 1);
      setCurrentlyLeavingRat(null);
      setGameStage(GameStages.TALKING_TO_RATS);
      setActiveRats(chosenRats);
      updateMusic(getTalkingMusic(0));
      setRandomizedActiveRats(chosenRats.sort(() => 0.5 - Math.random()));
      setRandomLeavingResponse(Math.random());
    });
  }

  function goToEpilogue() {
    playInterlude("What happened to the others?", () => {
      setGameStage(GameStages.EPILOGUE);
    });
  }

  function goToCredits() {
    updateMusic("intro.mp3");
    playInterlude("Special thanks", () => {
      setGameStage(GameStages.CREDITS);
    });
  }

  function goToAnimeEnding() {
    const chosenRat = activeRats[0];
    updateMusic(getRatById(chosenRat)?.ending);
    incrementRatCountInDatabase(chosenRat, false);
    playInterlude("Ending!", () => {
      setGameStage(GameStages.ANIME_ENDING);
    });
  }

  // Updates rat feelings based on user response scores.
  function updateRatFeelings(ratId, feelingScore) {
    // No effect if response elicits a neutral or positive feeling.
    if (feelingScore >= 0) {
      return false;
    }
    const updatedRatScore = (ratFeelings[ratId] ?? 0) + feelingScore;
    const newFeelings = { ...ratFeelings };
    newFeelings[ratId] = updatedRatScore;
    const randomNumber = Math.random();
    setRatFeelings(newFeelings);
    const threshold = ((Math.abs(updatedRatScore) * round) / NUM_ROUNDS) * 0.2;
    if (!currentlyLeavingRat && randomNumber < threshold) {
      setCurrentlyLeavingRat(ratId);
      incrementRatCountInDatabase(ratId, true);
      return true;
    }
    return false;
  }

  function resetGame() {
    playInterlude("Let's begin anew...", () => {
      setGameStage(GameStages.INTRO);
      setRound(0);
      setPlayerAvatarIndex(null);
      setPlayerAvatarDecorations([]);
      setActiveRats([]);
      setRandomizedActiveRats([]);
      setOriginalRats([]);
      setRatFeelings({});
      updateMusic("intro.mp3");
      setCurrentlyLeavingRat(null);
    });
  }

  function updateSfx(sfx) {
    setSfx(sfx);
    setSfxTimestamp(Date.now());
  }

  function updateMusic(music) {
    setMusic(music);
    setMusicTimestamp(Date.now());
  }

  let gameScreenContents = "";
  switch (gameStage) {
    case GameStages.INTRO:
      gameScreenContents = <Intro advanceToNextStage={goToPlayerSelect} />;
      break;
    case GameStages.PLAYER_SELECT:
      gameScreenContents = (
        <PlayerSelect
          advanceToNextStage={goToPlayerCustomization}
          setPlayerAvatarIndex={setPlayerAvatarIndex}
          playerAvatarIndex={playerAvatarIndex}
          updateSfx={updateSfx}
        />
      );
      break;
    case GameStages.PLAYER_CUSTOMIZATION:
      gameScreenContents = (
        <PlayerCustomization
          advanceToNextStage={goToRatSelect}
          goToPlayerSelect={goToPlayerSelect}
          playerAvatarIndex={playerAvatarIndex}
          playerAvatarDecorations={playerAvatarDecorations}
          setPlayerAvatarDecorations={setPlayerAvatarDecorations}
          updateSfx={updateSfx}
        />
      );
      break;
    case GameStages.RAT_SELECT:
      gameScreenContents = (
        <RatSelect
          maxRats={RATS_IN_GAME}
          advanceToNextStage={goToTalkingToRats}
          setActiveRats={setActiveRats}
          setOriginalRats={setOriginalRats}
          activeRats={activeRats}
          updateSfx={updateSfx}
          mobileMode={mobileMode}
        />
      );
      break;
    case GameStages.TALKING_TO_RATS:
      gameScreenContents = (
        <TalkingToRats
          activeRats={randomizedActiveRats}
          mobileMode={mobileMode}
          mobileWidth={mobileWidth}
          randomLeavingResponse={randomLeavingResponse}
          playerAvatarIndex={playerAvatarIndex}
          round={round}
          goToRoseCeremony={goToRoseCeremony}
          playerAvatarDecorations={playerAvatarDecorations}
          updateSfx={updateSfx}
          updateMusic={updateMusic}
          updateRatFeelings={updateRatFeelings}
        />
      );
      break;
    case GameStages.ROSE_CEREMONY:
      gameScreenContents = (
        <RoseCeremony
          activeRats={activeRats}
          round={round}
          maxRats={ROSES_PER_ROUND[round]}
          goToNextRound={goToNextRound}
          updateSfx={updateSfx}
          currentlyLeavingRat={currentlyLeavingRat}
        />
      );
      break;
    case GameStages.PROPOSAL:
      gameScreenContents = (
        <Proposal
          playerAvatarDecorations={playerAvatarDecorations}
          finalRat={activeRats[0]}
          playerAvatarIndex={playerAvatarIndex}
          goToAnimeEnding={goToAnimeEnding}
        />
      );
      break;
    case GameStages.ANIME_ENDING:
      gameScreenContents = (
        <Ending finalRat={activeRats[0]} advanceToNextStage={goToEpilogue} />
      );
      break;
    case GameStages.EPILOGUE:
      gameScreenContents = (
        <Epilogue
          finalRat={activeRats[0]}
          originalRats={originalRats}
          advanceToNextStage={goToCredits}
        />
      );
      break;
    case GameStages.CREDITS:
      gameScreenContents = (
        <Credits finalRat={activeRats[0]} reset={resetGame} />
      );
      break;
    default:
      gameScreenContents = "something went wrong... restart?";
      break;
  }

  if (mobileLandscapeMode) {
    return (
      <div className="landscape-mode-warning">
        <h2>Ratchelor 3</h2>
        It looks like you are in portrait mode on your phone! Please rotate your
        phone to continue or visit on desktop instead!
      </div>
    );
  }

  return (
    <div className="game">
      <img
        className="frame"
        src={`${INTRO_IMAGES_BASE_PATH}/frame.png`}
        alt=""
      ></img>
      <div className="screen interlude-container">
        <div className={`${playingInterlude ? "playing" : ""} interlude`}>
          <img alt="" src={`${BACKGROUNDS_IMAGES_BASE_PATH}/curtains.png`} />
          <h2>{playingInterludeText}</h2>
        </div>
      </div>
      {gameScreenContents}
      <SoundManager
        soundFile={sfx}
        soundTimestamp={sfxTimestamp}
        musicFile={music}
        musicTimestamp={musicTimestamp}
      />
    </div>
  );
}

export default RatchelorApp;

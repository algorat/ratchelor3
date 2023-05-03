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

import frameImage from "../../assets/images/frame.png";

import {
  getRatById,
  BACKGROUNDS_IMAGES_BASE_PATH,
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

// // Num rats the person should select at the very beginning.
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

  // TOdo
  const [sfx, setSfx] = useState(null);
  const [sfxTimestamp, setSfxTimestamp] = useState(0);

  // Todo
  const [music, setMusic] = useState(null);
  const [musicTimestamp, setMusicTimestamp] = useState(0);

  // Todo
  const [ratFeelings, setRatFeelings] = useState({});

  // The player avatar that was selected.
  const [playerAvatarIndex, setPlayerAvatarIndex] = useState(null);

  // The player avatar decorations that were selected.
  const [playerAvatarDecorations, setPlayerAvatarDecorations] = useState([]);

  const [playingInterlude, setPlayingInterlude] = useState(false);
  const [playingInterludeText, setPlayingInterludeText] = useState("");

  const [mobileMode, setMobileMode] = useState(false);
  const [mobileLandscapeMode, setMobileLandscapeMode] = useState(false);

  useEffect(() => {
    const watchMobile = window.matchMedia("only screen and (hover: none)");
    const watchLandscapeMobile = window.matchMedia(
      "(hover: none) and (orientation: portrait)"
    );

    watchLandscapeMobile.addEventListener("change", () => {
      setMobileLandscapeMode(watchLandscapeMobile.matches);
    });

    setMobileMode(watchMobile.matches);
    setMobileLandscapeMode(watchLandscapeMobile.matches);

    const screenHeight = document.body.clientHeight;
    const screenWidth = document.body.clientWidth;

    const targetMobileWidth = (screenHeight * 900) / 675;

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

  // TODO
  function goToPlayerSelect() {
    updateMusic("intro.mp3");
    playInterlude("Meet yourself", () => {
      setGameStage(GameStages.PLAYER_SELECT);
    });
  }

  // TODO
  function goToPlayerCustomization() {
    playInterlude("Dress up for the show!", () => {
      setGameStage(GameStages.PLAYER_CUSTOMIZATION);
    });
  }

  // TODO
  function goToRatSelect() {
    playInterlude("Meet your suitors", () => {
      setGameStage(GameStages.RAT_SELECT);
    });
  }

  // TODO
  function goToTalkingToRats() {
    setRandomizedActiveRats(activeRats.sort(() => 0.5 - Math.random()));
    playInterlude("Time 2 date!", () => {
      setGameStage(GameStages.TALKING_TO_RATS);
    });
  }

  // TODO
  function goToRoseCeremony() {
    updateMusic("rose_ceremony.mp3");
    playInterlude("Who gets a rose?", () => {
      setGameStage(GameStages.ROSE_CEREMONY);
    });
  }

  // TODO
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
      setGameStage(GameStages.TALKING_TO_RATS);
      setActiveRats(chosenRats);
      setRandomizedActiveRats(chosenRats.sort(() => 0.5 - Math.random()));
    });
  }

  // TODO
  function goToEpilogue() {
    playInterlude("What happened to the others?", () => {
      setGameStage(GameStages.EPILOGUE);
    });
  }

  // TODO
  function goToCredits() {
    updateMusic("intro.mp3");
    playInterlude("Special thanks", () => {
      setGameStage(GameStages.CREDITS);
    });
  }

  // TODO
  function goToAnimeEnding() {
    const chosenRat = activeRats[0];
    updateMusic(getRatById(chosenRat)?.ending);
    playInterlude("Ending!", () => {
      setGameStage(GameStages.ANIME_ENDING);
    });
  }

  // TODO
  function updateRatFeelings(ratId, feelingScore) {
    const updatedRatScore = ratFeelings[ratId] ?? 0;
    const newFeelings = { ...ratFeelings };
    newFeelings[ratId] = updatedRatScore + feelingScore;
    setRatFeelings(newFeelings);
  }

  function resetGame() {
    playInterlude("Resetting game...", () => {
      setGameStage(GameStages.INTRO);
      setRound(0);
      setPlayerAvatarIndex(null);
      setPlayerAvatarDecorations([]);
      setActiveRats([]);
      setRandomizedActiveRats([]);
      setOriginalRats([]);
      setRatFeelings({});
      updateMusic("intro.mp3");
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
          playerAvatarIndex={playerAvatarIndex}
          round={round}
          goToRoseCeremony={goToRoseCeremony}
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
          ratFeelings={ratFeelings}
        />
      );
      break;
    case GameStages.PROPOSAL:
      gameScreenContents = (
        <Proposal
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

  // TODO
  if (mobileLandscapeMode) {
    return (
      <div className="landscape-mode-warning">
        <h2>Ratchelor 3</h2>
        It looks like you are in portrait mode on your phone! Please rotate your
        phone to continue.
      </div>
    );
  }

  return (
    <div className="game">
      <img className="frame" src={frameImage} alt=""></img>
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

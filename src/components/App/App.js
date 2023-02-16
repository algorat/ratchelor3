import "./App.css";
import React, { useState } from "react";
import { Intro } from "../Intro/Intro";
import { Ending } from "../Ending/Ending";
import { Epilogue } from "../Epilogue/Epilogue";
import { PlayerSelect } from "../PlayerSelect/PlayerSelect";
import { RatSelect } from "../RatSelect/RatSelect";
import { TalkingToRats } from "../TalkingToRats/TalkingToRats";
import { RoseCeremony } from "../RoseCeremony/RoseCeremony";
import { Proposal } from "../Proposal/Proposal";

import frameImage from "../../assets/images/frame.png";

const GameStages = {
  INTRO: 0,
  PLAYER_SELECT: 1,
  RAT_SELECT: 2,
  TALKING_TO_RATS: 3,
  ROSE_CEREMONY: 4,
  PROPOSAL: 5,
  ANIME_ENDING: 6,
  EPILOGUE: 7,
};

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

  // The overall music & SFX volume of the game.
  const [volume, setVolume] = useState(10);

  // The player avatar that was selected.
  const [playerAvatarIndex, setPlayerAvatarIndex] = useState(null);

  // Advances the game to the next stage.
  const advanceToNextStage = () => {
    setGameStage(gameStage + 1);
  };

  // TODO
  const goToRoseCeremony = () => {
    setGameStage(GameStages.ROSE_CEREMONY);
  };

  // TODO
  const goToNextRound = (chosenRats) => {
    setRound(round + 1);
    setActiveRats(chosenRats);

    if (round === NUM_ROUNDS - 1) {
      setGameStage(GameStages.PROPOSAL);
      return;
    }

    setGameStage(GameStages.TALKING_TO_RATS);
  };

  // TODO
  const goToAnimeEnding = () => {
    setGameStage(GameStages.ANIME_ENDING);
  };

  const resetGame = () => {
    setGameStage(GameStages.INTRO);
    setRound(0);
    setPlayerAvatarIndex(null);
    setActiveRats([]);
    setOriginalRats([]);
  };

  const randomizedActiveRats = activeRats.sort(() => 0.5 - Math.random());
  let gameScreenContents = "";
  switch (gameStage) {
    case GameStages.INTRO:
      gameScreenContents = <Intro advanceToNextStage={advanceToNextStage} />;
      break;
    case GameStages.PLAYER_SELECT:
      gameScreenContents = (
        <PlayerSelect
          advanceToNextStage={advanceToNextStage}
          setPlayerAvatarIndex={setPlayerAvatarIndex}
          playerAvatarIndex={playerAvatarIndex}
        />
      );
      break;
    case GameStages.RAT_SELECT:
      gameScreenContents = (
        <RatSelect
          maxRats={RATS_IN_GAME}
          advanceToNextStage={advanceToNextStage}
          setActiveRats={setActiveRats}
          setOriginalRats={setOriginalRats}
          activeRats={activeRats}
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
        <Ending
          finalRat={activeRats[0]}
          advanceToNextStage={advanceToNextStage}
        />
      );
      break;
    case GameStages.EPILOGUE:
      gameScreenContents = (
        <Epilogue
          finalRat={activeRats[0]}
          originalRats={originalRats}
          reset={resetGame}
        />
      );
      break;
    default:
      gameScreenContents = "something went wrong... restart?";
      break;
  }
  return (
    <div className="game">
      <img className="frame" src={frameImage} alt=""></img>
      {gameScreenContents}
    </div>
  );
}

export default RatchelorApp;

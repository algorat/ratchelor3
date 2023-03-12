import "./Ending.css";

import React from "react";
import {
  ENDINGS_IMAGES_BASE_PATH,
  getRatById,
} from "../../utils/ratDataHelper";

export function Ending(props) {
  const finalRatData = getRatById(props.finalRat);
  return (
    <div className="ending-screen screen">
      <img
        className="ending-art"
        src={`${ENDINGS_IMAGES_BASE_PATH}/${props.finalRat}.jpg`}
        alt="your chosen rat looking adoringly at you"
      ></img>
      <div className="ending-dialogue">
        {finalRatData.dialogue[finalRatData.dialogue.length - 1]}
      </div>
      <button className="epilogue-button" onClick={props.advanceToNextStage}>
        Epilogue
      </button>
    </div>
  );
}

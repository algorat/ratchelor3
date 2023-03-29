import "./Ending.css";

import React from "react";
import {
  ENDINGS_IMAGES_BASE_PATH,
  getRatById,
} from "../../utils/ratDataHelper";
import { MobileControl } from "../MobileControl/MobileControl";

export function Ending(props) {
  const finalRatData = getRatById(props.finalRat);
  return (
    <>
      <div className="ending-screen screen">
        <img
          className="ending-art"
          src={`${ENDINGS_IMAGES_BASE_PATH}/${props.finalRat}.jpg`}
          alt="your chosen rat looking adoringly at you"
        ></img>
        <MobileControl show={false}>
          <div className="ending-dialogue">
            {finalRatData.dialogue[finalRatData.dialogue.length - 1]}
          </div>
          <button
            className="epilogue-button"
            onClick={props.advanceToNextStage}
          >
            Epilogue
          </button>
        </MobileControl>
      </div>
      <MobileControl
        show={true}
        ctaButton={<button onClick={props.advanceToNextStage}>Epilogue</button>}
      >
        {finalRatData.dialogue[finalRatData.dialogue.length - 1]}
      </MobileControl>
    </>
  );
}

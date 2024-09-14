import "./Ending.css";

import React, { useEffect, useState } from "react";
import {
  ENDINGS_IMAGES_BASE_PATH,
  getRatById,
} from "../../utils/ratDataHelper";
import { MobileControl } from "../MobileControl/MobileControl";

const animationDuration = 2000;
export function Ending(props) {
  const [fadingIn, setFadingIn] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setFadingIn(false);
    }, animationDuration);
  });

  const style = {
    transition: `background ${animationDuration}ms`,
    background: fadingIn ? "black" : "transparent",
  };

  const finalRatData = getRatById(props.finalRat);

  const fontOverride = finalRatData.fontOverride
    ? { fontFamily: `"${finalRatData.fontOverride}", serif` }
    : {};

  return (
    <>
      <div className="ending-screen screen">
        <img
          className="ending-art"
          src={`${ENDINGS_IMAGES_BASE_PATH}/${props.finalRat}.jpg`}
          alt="your chosen rat looking adoringly at you"
        ></img>
        <MobileControl show={false} mobileMode={props.mobileMode}>
          <div className="ending-dialogue" style={fontOverride}>
            {finalRatData.dialogue[finalRatData.dialogue.length - 1]}
          </div>
          <button
            className="epilogue-button"
            onClick={props.advanceToNextStage}
          >
            Epilogue
          </button>
        </MobileControl>
        <div style={style} className="black-screen"></div>
      </div>
      <MobileControl
        show={true}
        mobileMode={props.mobileMode}
        ctaButton={<button onClick={props.advanceToNextStage}>Epilogue</button>}
      >
        <span style={fontOverride}>
          {finalRatData.dialogue[finalRatData.dialogue.length - 1]}
        </span>
      </MobileControl>
    </>
  );
}

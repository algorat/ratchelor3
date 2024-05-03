import "./Proposal.css";

import React, { useEffect, useState } from "react";
import {
  getRatById,
  BACKGROUNDS_IMAGES_BASE_PATH,
  PROPOSAL_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";
import { MobileControl } from "../MobileControl/MobileControl";

const animationDuration = 2000;

export function Proposal(props) {
  const [fadingOut, setFadingOut] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setFadingOut(true);
      setTimeout(props.goToAnimeEnding, animationDuration);
    }, 3000);
  });
  const finalRat = getRatById(props.finalRat);
  const playerFile = `${props.playerAvatarIndex}.png`;

  const style = {
    transition: `background ${animationDuration}ms`,
    background: fadingOut ? "black" : "transparent",
  };

  return (
    <>
      <div className="proposal-screen screen">
        <img
          className="proposal-background"
          src={`${BACKGROUNDS_IMAGES_BASE_PATH}/proposal.png`}
          alt=""
        />
        <div className="proposing-rat-container">
          <img
            alt="the rat that you're proposing to"
            className={`final-rat proposal-${finalRat.size}`}
            src={`${PROPOSAL_IMAGES_BASE_PATH}/${props.finalRat}.png`}
          />
          <img
            className="proposing-rat"
            alt="you are on one knee proposing"
            src={`${PROPOSAL_IMAGES_BASE_PATH}/${playerFile}`}
          />
          {props.playerAvatarDecorations.map((decoration) => (
            <img
              key={`decoration${decoration}`}
              src={`${PROPOSAL_IMAGES_BASE_PATH}/${props.playerAvatarIndex}_${decoration}.png`}
              alt=""
            />
          ))}
        </div>
        <div style={style} className="black-screen"></div>
      </div>
      <MobileControl show={true}>Proposes :3</MobileControl>
    </>
  );
}

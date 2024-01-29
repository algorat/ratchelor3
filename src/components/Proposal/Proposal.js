import "./Proposal.css";

import React from "react";
import {
  getRatById,
  CHARACTERS_IMAGES_BASE_PATH,
  BACKGROUNDS_IMAGES_BASE_PATH,
  PLAYER_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";
import { MobileControl } from "../MobileControl/MobileControl";

export function Proposal(props) {
  const finalRat = getRatById(props.finalRat);
  const playerFile = `${props.playerAvatarIndex}_proposal.png`;

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
            src={`${CHARACTERS_IMAGES_BASE_PATH}/${props.finalRat}.png`}
          />
          <img
            className="proposing-rat"
            alt="you are on one knee proposing"
            src={`${PLAYER_IMAGES_BASE_PATH}/${playerFile}`}
          />
        </div>
        <MobileControl show={false}>
          <header>
            <button onClick={props.goToAnimeEnding}>Continue</button>
          </header>
        </MobileControl>
      </div>
      <MobileControl
        show={true}
        ctaButton={<button onClick={props.goToAnimeEnding}>Continue</button>}
      >
        Proposes :3
      </MobileControl>
    </>
  );
}

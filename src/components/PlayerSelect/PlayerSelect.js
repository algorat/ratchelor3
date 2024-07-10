import "./PlayerSelect.css";
import { MobileControl } from "../MobileControl/MobileControl";

import React from "react";
import {
  PLAYER_IMAGES_BASE_PATH,
  FRAMES_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";

/** One of the selectable character images. */
function SelectableCharacter(props) {
  return (
    <div
      onClick={props.onClick}
      className={`player-img ${props.selected && "selected-img"}`}
    >
      {props.selected && (
        <img
          alt=""
          src={`${FRAMES_IMAGES_BASE_PATH}/hearts7.png`}
          className="selected-bg"
        />
      )}
      <img src={props.src} alt="one of the selectable characters" />
    </div>
  );
}

/** Player selection component. */
export function PlayerSelect(props) {
  let ctaArea;

  if (props.playerAvatarIndex) {
    ctaArea = <button onClick={props.advanceToNextStage}>Onwards!</button>;
  } else {
    ctaArea = (
      <div className="player-select-question heading-medium">
        Which rat do you want to be?
      </div>
    );
  }

  return (
    <>
      <div className="player-select-screen screen">
        <div className="player-select-intro">
          <img
            alt=""
            className="player-select-hearts-header"
            src={`${PLAYER_IMAGES_BASE_PATH}/playerselecthearts.png`}
          ></img>
          <h2>You are The Ratchelor,</h2>
          <p className="heading-medium player-select-description">
            A single rat looking for love. You will meet many rats and choose
            who to keep, round after round, until you find true love.
          </p>
        </div>
        <div className="player-select-row">
          {[1, 2, 3, 4].map((idx) => (
            <SelectableCharacter
              selected={idx === props.playerAvatarIndex}
              onClick={() => {
                props.setPlayerAvatarIndex(idx);
                props.updateSfx("tap.mp3");
              }}
              key={`char${idx}`}
              src={`${PLAYER_IMAGES_BASE_PATH}/${idx}_intro.png`}
            />
          ))}
        </div>
        <MobileControl mobileMode={props.mobileMode} show={false}>
          {ctaArea}
        </MobileControl>
      </div>
      <MobileControl
        mobileMode={props.mobileMode}
        show={true}
        header="Choose your avatar"
        ctaButton={props.playerAvatarIndex && ctaArea}
      >
        {props.playerAvatarIndex
          ? "Wonderful! Let's continue!"
          : "Select a rat from the left panel to get started."}
      </MobileControl>
    </>
  );
}

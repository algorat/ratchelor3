import { PLAYER_IMAGES_BASE_PATH } from "../../utils/ratDataHelper";
import React from "react";
import customData from "../../data/playerCustomization.json";

import "./PlayerCustomization.css";
import { MobileControl } from "../MobileControl/MobileControl";

export function PlayerCustomization(props) {
  const playerImg = `${PLAYER_IMAGES_BASE_PATH}/${props.playerAvatarIndex}_fullbody.png`;
  const images = customData[props.playerAvatarIndex];

  function toggleDecoration(decoration) {
    if (props.playerAvatarDecorations.includes(decoration)) {
      props.setPlayerAvatarDecorations(
        props.playerAvatarDecorations.filter((d) => d !== decoration)
      );
    } else {
      props.setPlayerAvatarDecorations([
        ...props.playerAvatarDecorations,
        decoration,
      ]);
    }
  }

  const options = (
    <ul className="player-custom-options">
      {images.map((image) => (
        <li key={image}>
          <button
            className={`small ${
              props.playerAvatarDecorations.includes(image) ? "selected" : ""
            }`}
            onClick={() => {
              toggleDecoration(image);
            }}
          >
            {image}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="player-customization-screen screen">
        <header>
          <h2>Dress up your character? </h2>
          <MobileControl show={false}>
            <button className="small" onClick={props.advanceToNextStage}>
              Continue onwards
            </button>
          </MobileControl>
        </header>
        <div className="custom-game">
          <div className="custom-character">
            <img src={playerImg} />
            {props.playerAvatarDecorations.map((decorationImage) => (
              <img
                className="decoration"
                key={decorationImage}
                src={`${PLAYER_IMAGES_BASE_PATH}/${props.playerAvatarIndex}_${decorationImage}.png`}
                alt=""
              />
            ))}
          </div>
          <MobileControl show={false}>{options}</MobileControl>
        </div>
      </div>
      <MobileControl
        show={true}
        header="Choose accessories"
        ctaButton={
          <button className="small" onClick={props.advanceToNextStage}>
            Continue onwards
          </button>
        }
      >
        {options}
      </MobileControl>
    </>
  );
}
import { DRESSER_IMAGES_BASE_PATH } from "../../utils/ratDataHelper";
import React from "react";
import customData from "../../data/playerCustomization.json";

import "./PlayerCustomization.css";
import { MobileControl } from "../MobileControl/MobileControl";

export function PlayerCustomization(props) {
  const playerImg = `${DRESSER_IMAGES_BASE_PATH}/${props.playerAvatarIndex}.png`;
  const images = customData[props.playerAvatarIndex];

  function toggleDecoration(decoration) {
    if (props.playerAvatarDecorations.includes(decoration)) {
      props.setPlayerAvatarDecorations(
        props.playerAvatarDecorations.filter((d) => d !== decoration)
      );
    } else {
      const unsorted = [...props.playerAvatarDecorations, decoration];
      const sorted = unsorted.sort(
        (a, b) => images.indexOf(a) - images.indexOf(b)
      );
      props.setPlayerAvatarDecorations(sorted);
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
              props.updateSfx("tap.mp3");
              toggleDecoration(image);
            }}
          >
            {image}
          </button>
        </li>
      ))}
    </ul>
  );

  const onwardsButton = (
    <button className="small onwards" onClick={props.advanceToNextStage}>
      Onwards →
    </button>
  );
  const onPrevious = () => {
    props.setPlayerAvatarDecorations([]);
    props.goToPlayerSelect();
  };
  const previousButton = (
    <button className="small back" onClick={onPrevious}>
      ← Back
    </button>
  );
  const unSelectedDecorations = images.filter(
    (image) => !props.playerAvatarDecorations.includes(image)
  );
  return (
    <>
      <div className="player-customization-screen screen">
        <MobileControl show={false} mobileMode={props.mobileMode}>
          <header>
            {previousButton}
            <h2>Dress up your character? </h2>
            {onwardsButton}
          </header>
        </MobileControl>
        <div className="custom-game">
          <div className="custom-character">
            <img
              className="background"
              src={`${DRESSER_IMAGES_BASE_PATH}/dressing_room.png`}
              alt="A dressing room with accessories in it"
            />
            <img src={playerImg} />
            {props.playerAvatarDecorations.map((decorationImage) => (
              <img
                className="decoration"
                key={decorationImage}
                src={`${DRESSER_IMAGES_BASE_PATH}/${props.playerAvatarIndex}_${decorationImage}_on.png`}
                alt=""
              />
            ))}
            {unSelectedDecorations.map((decorationImage) => (
              <img
                className="decoration"
                key={decorationImage}
                src={`${DRESSER_IMAGES_BASE_PATH}/${props.playerAvatarIndex}_${decorationImage}.png`}
                alt=""
              />
            ))}
          </div>
          {options}
        </div>
      </div>
      <MobileControl
        show={true}
        mobileMode={props.mobileMode}
        header="Choose accessories"
        ctaButton={
          <>
            {previousButton}
            {onwardsButton}
          </>
        }
      >
        Dress up your character?
      </MobileControl>
    </>
  );
}

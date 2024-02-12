import "./Intro.css";

import React from "react";
import { MobileControl } from "../MobileControl/MobileControl";
import { Preloader } from "../Preloader/Preloader";

import { INTRO_IMAGES_BASE_PATH } from "../../utils/ratDataHelper";

export function Intro(props) {
  const onClick = () => {
    props.advanceToNextStage();
  };

  return (
    <>
      <div className="intro-screen screen">
        <MobileControl show={false}>
          <div className="cta">
            <Preloader>
              <button className="embark-button" onClick={onClick}>
                Embark
                <img
                  src={`${INTRO_IMAGES_BASE_PATH}/sound.png`}
                  alt=" with sound"
                />
              </button>
            </Preloader>
          </div>
        </MobileControl>
      </div>
      <MobileControl
        show={true}
        ctaButton={
          <Preloader>
            <button className="embark-button" onClick={onClick}>
              Embark
              <img
                src={`${INTRO_IMAGES_BASE_PATH}/sound.png`}
                alt=" with sound"
              />
            </button>
          </Preloader>
        }
      >
        {"Looks like you're on mobile! Mobile is available, but our game" +
          " works better on larger screens. We suggest joining from a laptop" +
          " or desktop computer if possible :)"}
      </MobileControl>
    </>
  );
}

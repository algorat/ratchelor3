import "./Intro.css";

import React from "react";
import { MobileControl } from "../MobileControl/MobileControl";
import { Preloader } from "../Preloader/Preloader";

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
              <button onClick={onClick}>Embark</button>
            </Preloader>
          </div>
        </MobileControl>
      </div>
      <MobileControl
        show={true}
        ctaButton={
          <Preloader>
            <button onClick={onClick}>Embark</button>
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

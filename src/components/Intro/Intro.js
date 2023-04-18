import "./Intro.css";

import React from "react";
import { MobileControl } from "../MobileControl/MobileControl";

export function Intro(props) {
  const onClick = () => {
    props.advanceToNextStage();
  };

  return (
    <>
      <div className="intro-screen screen">
        <MobileControl show={false}>
          <button onClick={onClick}>Embark</button>
        </MobileControl>
      </div>
      <MobileControl
        show={true}
        ctaButton={<button onClick={onClick}>Embark</button>}
      >
        {"Looks like you're on mobile! Mobile is available, but our game" +
          " works better on larger screens. We suggest joining from a laptop" +
          " or desktop computer if possible :)"}
      </MobileControl>
    </>
  );
}

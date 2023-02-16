import "./Intro.css";

import React from "react";

export function Intro(props) {
  const onClick = () => {
    props.advanceToNextStage();
  };

  return (
    <div className="intro-screen screen">
      <button onClick={onClick}>Embark</button>
    </div>
  );
}

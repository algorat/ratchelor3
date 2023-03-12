import "./Reaction.css";

import React from "react";
import { REACTIONS_IMAGES_BASE_PATH } from "../../utils/ratDataHelper";

export function Reaction(props) {
  return (
    <div
      className="reaction-animation"
      style={{ left: `${props.left}%`, top: props.top + "%" }}
    >
      {Array(5)
        .fill(props.emote)
        .map((val, idx) => (
          <div
            key={"reaction-emote-" + (idx + 1)}
            className={"reaction-emote reaction-emote-" + (idx + 1)}
          >
            <img
              src={`${REACTIONS_IMAGES_BASE_PATH}/${props.src}`}
              alt=""
            ></img>
          </div>
        ))}
    </div>
  );
}

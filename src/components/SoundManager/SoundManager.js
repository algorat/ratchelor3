import "./SoundManager.css";

import ReactAudioPlayer from "react-audio-player";

import React, { useState } from "react";
import { SOUND_BASE_PATH } from "../../utils/ratDataHelper";

export function SoundManager(props) {
  const [volume, setVolume] = useState(0.2);
  const [lastTimestamp, setLastTimestamp] = useState(null);

  return (
    <>
      <div className="game-options">
        {/* <img
          src={soundurl}
          alt="Sound icon"
          className="sound-icon"
          onClick={toggleSound}
        /> */}
        <div className="sound-slider">
          <input
            min="0"
            max="1"
            step="0.05"
            type="range"
            value={volume}
            onChange={(evt) => {
              setVolume(parseFloat(evt.target.value));
              console.log("change");
            }}
          />
          <div
            className="behind-slider"
            style={{
              backgroundImage: `linear-gradient(to right, #fffec6, #fffec6 
                ${parseInt(volume * 100)}%, #977c40 
                ${parseInt(volume * 100)}%, #977c40 100%)`,
            }}
          />
        </div>
      </div>
      {props.soundFile && (
        <ReactAudioPlayer
          id={String(props.timestamp)}
          src={`${SOUND_BASE_PATH}/${props.soundFile}`}
          volume={volume}
          ref={(element) => {
            if (!element || lastTimestamp === props.timestamp) return;
            setLastTimestamp(props.timestamp);
            element.audioEl.current.currentTime = 0;
            element.audioEl.current.play();
          }}
        />
      )}
    </>
  );
}

import "./SoundManager.css";

import ReactAudioPlayer from "react-audio-player";

import React, { useState } from "react";
import { SOUND_BASE_PATH } from "../../utils/ratDataHelper";

export function SoundManager(props) {
  const [volume, setVolume] = useState(0.2);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [lastMusicTimestamp, setLastMusicTimestamp] = useState(null);

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
          id={String(props.soundTimestamp)}
          src={`${SOUND_BASE_PATH}/${props.soundFile}`}
          volume={volume}
          ref={(element) => {
            if (!element || lastTimestamp === props.soundTimestamp) return;
            setLastTimestamp(props.soundTimestamp);
            element.audioEl.current.currentTime = 0;
            element.audioEl.current.play();
          }}
        />
      )}
      {props.musicFile && (
        <ReactAudioPlayer
          src={`${SOUND_BASE_PATH}/${props.musicFile}`}
          volume={volume / 3}
          loop={true}
          ref={(element) => {
            if (!element || lastMusicTimestamp === props.musicTimestamp) return;
            setLastMusicTimestamp(props.musicTimestamp);
            element.audioEl.current.currentTime = 0;
            element.audioEl.current.play();
          }}
        />
      )}
    </>
  );
}

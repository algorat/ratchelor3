import "./SoundManager.css";

import ReactHowler from "react-howler";

import React, { useState } from "react";
import {
  SOUND_BASE_PATH,
  SOUND_ICONS_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";

const VOLUME_ICON_PREFIX = "volume_";
const VOLUME_ICON_POSTFIX = ".png";
const VOLUME_MUTE = "volume_mute.png";

const DEFAULT_VOLUME = 0.2;

function volumeToIndex(vol) {
  if (vol < 0.15) {
    return 0;
  } else if (vol < 0.25) {
    return 1;
  } else if (vol < 0.5) {
    return 2;
  } else {
    return 3;
  }
}

export function SoundManager(props) {
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [lastTimestamp, setLastTimestamp] = useState(null);

  let volumeIconFullPath = `${SOUND_ICONS_IMAGES_BASE_PATH}/${VOLUME_MUTE}`;

  if (volume > 0) {
    const vIdx = volumeToIndex(volume);
    const volumeIconSrc = `${VOLUME_ICON_PREFIX}${vIdx}${VOLUME_ICON_POSTFIX}`;
    volumeIconFullPath = `${SOUND_ICONS_IMAGES_BASE_PATH}/${volumeIconSrc}`;
  }

  function toggleSound() {
    setVolume(volume === 0 ? DEFAULT_VOLUME : 0);
  }

  return (
    <>
      <div className="game-options">
        <img
          src={volumeIconFullPath}
          alt="Sound icon"
          className="sound-icon"
          onClick={toggleSound}
        />
        <div className="sound-slider">
          <input
            min="0"
            max="1"
            step="0.05"
            type="range"
            value={volume}
            onChange={(evt) => {
              setVolume(parseFloat(evt.target.value));
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
        <ReactHowler
          id={String(props.soundTimestamp)}
          src={`${SOUND_BASE_PATH}/${props.soundFile}`}
          volume={volume}
          ref={(element) => {
            if (!element || lastTimestamp === props.soundTimestamp) return;
            setLastTimestamp(props.soundTimestamp);
            element.howler.seek(0);
            element.howler.play();
          }}
          onEnd={() => {
            props.setSfx(null);
          }}
        />
      )}
      {props.musicFile && (
        <ReactHowler
          src={`${SOUND_BASE_PATH}/${props.musicFile}`}
          volume={volume * 0.5}
          html5={true}
          loop={true}
        />
      )}
    </>
  );
}

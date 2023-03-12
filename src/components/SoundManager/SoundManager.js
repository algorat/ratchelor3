import "./SoundManager.css";

import ReactAudioPlayer from "react-audio-player";

import React, { useState } from "react";
import {
  SOUND_BASE_PATH,
  SOUND_ICONS_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";

const VOL_MAX = 3.9;
const VOLUME_ICON_PREFIX = "volume_";
const VOLUME_ICON_POSTFIX = ".png";
const VOLUME_MUTE = "volume_mute.png";

const DEFAULT_VOLUME = 0.2;

function volumeToIndex(vol) {
  return Math.floor(vol * VOL_MAX);
}

export function SoundManager(props) {
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [lastMusicTimestamp, setLastMusicTimestamp] = useState(null);

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
            element.audioEl.current.play();
          }}
        />
      )}
    </>
  );
}

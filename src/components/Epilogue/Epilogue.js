import "./Epilogue.css";
import {
  getRandomEpiloguePhoto,
  EPILOGUE_IMAGES_BASE_PATH,
  BACKGROUNDS_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";
import React from "react";

export function Epilogue(props) {
  const rats = props.originalRats.filter((rat) => rat !== props.finalRat);
  const randomPhotos = rats.map((rat) => getRandomEpiloguePhoto(rat));
  const photosWithoutDupes = [...new Set(randomPhotos)].slice(0, 6);
  return (
    <div className="epilogue-screen screen">
      <header>
        <button onClick={props.reset}>Play again</button>
      </header>
      <img
        className="epilogue-background"
        src={`${BACKGROUNDS_IMAGES_BASE_PATH}/desk.png`}
      />
      <div className="photos">
        {photosWithoutDupes.map(
          (photo) =>
            photo && (
              <img
                key={photo}
                src={`${EPILOGUE_IMAGES_BASE_PATH}/${photo}`}
                alt=""
              />
            )
        )}
      </div>
    </div>
  );
}

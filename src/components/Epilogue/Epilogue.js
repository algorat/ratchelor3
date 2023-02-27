import "./Epilogue.css";
import {
  getRandomEpiloguePhoto,
  EPILOGUE_IMAGES_BASE_PATH,
  BACKGROUNDS_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";
import React, { useEffect, useState } from "react";

function noDupes(photoData, finalRat) {
  const seenRats = new Set();
  const finalPhotos = [];

  for (const photo of photoData) {
    if (!photo) continue;
    const { rats } = photo;
    const dupeRats = rats.filter((r) => seenRats.has(r));

    if (dupeRats.length === 0 && !rats.includes(finalRat)) {
      rats.forEach((rat) => seenRats.add(rat));
      finalPhotos.push(photo);
    }
  }
  return finalPhotos;
}

export function Epilogue(props) {
  const [hoveredPhoto, setHoveredPhoto] = useState(null);
  const [randomPhotos, setRandomPhotos] = useState([]);

  useEffect(() => {
    const randomPhotoData = props.originalRats.map((rat) =>
      getRandomEpiloguePhoto(rat)
    );

    const photosWithoutDupes = noDupes(randomPhotoData, props.finalRat);

    console.log(randomPhotoData, photosWithoutDupes);

    setRandomPhotos(photosWithoutDupes.slice(0, 6));
  }, []);

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
        {randomPhotos.map((photo) => (
          <div className="epilogue-photo-container" key={photo.src}>
            <img
              onMouseEnter={() => {
                setHoveredPhoto(photo.src);
              }}
              onMouseLeave={() => {
                setHoveredPhoto(null);
              }}
              src={`${EPILOGUE_IMAGES_BASE_PATH}/${photo.src}`}
              alt=""
            />
            {photo.src === hoveredPhoto && (
              <div className="epilogue-photo-description">
                {photo.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

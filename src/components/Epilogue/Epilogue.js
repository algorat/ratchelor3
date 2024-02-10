import "./Epilogue.css";
import {
  getRandomEpiloguePhoto,
  EPILOGUE_IMAGES_BASE_PATH,
  BACKGROUNDS_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";
import React, { useEffect, useState } from "react";
import { MobileControl } from "../MobileControl/MobileControl";

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
  const [selectedPhotoDescription, setSelectedPhotoDescription] =
    useState(null);

  let mobileContent =
    selectedPhotoDescription || "Select a rat photo to see more info!";

  useEffect(() => {
    const randomPhotoData = props.originalRats.map((rat) =>
      getRandomEpiloguePhoto(rat)
    );
    console.log(randomPhotoData);
    const photosWithoutDupes = noDupes(randomPhotoData, props.finalRat);
    setRandomPhotos(photosWithoutDupes.slice(0, 6));
  }, []);

  const cta = (
    <>
      <a
        href="https://www.instagram.com/alg0rat/"
        target="_blank"
        rel="noreferrer"
      >
        <button>Follow our Instagram for updates</button>
      </a>
      <a href="https://ko-fi.com/alg0rat" target="_blank" rel="noreferrer">
        <button>Donate if you enjoyed</button>
      </a>
      <button onClick={props.advanceToNextStage}>Continue</button>
    </>
  );

  return (
    <>
      <div className="epilogue-screen screen">
        <MobileControl show={false}>
          <header>{cta}</header>
        </MobileControl>
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
                onClick={() => {
                  setSelectedPhotoDescription(photo.description);
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
      <MobileControl
        show={true}
        header="What happened to the rats after?"
        ctaButton={cta}
      >
        {mobileContent}
      </MobileControl>
    </>
  );
}

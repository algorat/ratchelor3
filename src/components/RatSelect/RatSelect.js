import "./RatSelect.css";

import React, { useState } from "react";
import {
  getAllRatData,
  getRatById,
  FRAMES_IMAGES_BASE_PATH,
  MOBILE_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";

import { MobileControl } from "../MobileControl/MobileControl";

function IntermediateMobileRat(props) {
  const ratData = getRatById(props.ratId);
  return (
    <>
      <p className="heading-medium">{ratData.name}</p>
      <p>{ratData.tagline}</p>
      <p>Zodiac sign: {ratData.zodiac}</p>
    </>
  );
}

/** A rat frame that is selectable. */
function SelectableRat(props) {
  const {
    index,
    ratId,
    ratName,
    ratZodiac,
    ratTagline,
    isSelected,
    onClick,
    filename,
    filenameHearts,
    isMobileSelected,
  } = props;
  return (
    <div
      aria-label={`A selectable framed image of ${ratName}.`}
      className={`rat-container ${isSelected ? "selected-rat" : ""}`}
      role="button"
    >
      <div
        className={`rat-list-item rat${index} rat-list-item-${ratId}`}
        onClick={onClick}
      >
        <div className="rat-pic">
          <img
            className="rat-frame"
            src={`${FRAMES_IMAGES_BASE_PATH}/${filename}`}
            alt=""
          />
          <img
            className={`arrows ${isMobileSelected ? "mobile-selected" : ""}`}
            src={`${MOBILE_IMAGES_BASE_PATH}/arrows_frame.png`}
            alt=""
          />
          <img
            className="rat-hearts"
            src={`${FRAMES_IMAGES_BASE_PATH}/${filenameHearts}`}
            alt=""
          />
        </div>
        <div className="rat-name-container">
          <div className="rat-name">{ratName}</div>
          <div className="rat-tagline">
            <i>Zodiac sign: {ratZodiac}</i>
            <p>{`"${ratTagline}"`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RatSelect(props) {
  const {
    activeRats,
    setActiveRats,
    setOriginalRats,
    advanceToNextStage,
    mobileMode,
  } = props;

  const [intermediateMobileRat, setIntermediateMobileRat] = useState(null);

  function onRatSelect(selectedRatId) {
    if (mobileMode) {
      setIntermediateMobileRat(selectedRatId);
    } else {
      selectRat(selectedRatId);
    }
  }

  const selectRat = (selectedRatId) => {
    // Is it already selected?
    if (activeRats.includes(selectedRatId)) {
      setActiveRats(activeRats.filter((ratId) => ratId !== selectedRatId));
      return;
    }
    // Exit early if we're at our selection limit.
    if (activeRats.length === props.maxRats) {
      props.updateSfx("bad_action.wav");
      return;
    }

    props.updateSfx("tap.mp3");
    setActiveRats([...activeRats, selectedRatId]);
  };

  const ratsData = getAllRatData();
  const numRatsLeft = props.maxRats - activeRats.length;

  const ctaButton = (
    <button
      onClick={() => {
        advanceToNextStage();
        setOriginalRats(activeRats);
      }}
    >
      Onwards!
    </button>
  );

  let mobileCtaButton = "";
  let mobileContent = "";
  let mobileHeader = `Select your ${numRatsLeft} contestants!`;

  if (numRatsLeft === 0 && !activeRats.includes(intermediateMobileRat)) {
    mobileContent =
      "You are done selecting rats!" +
      " Either move on to the next round or select a rat to deselect.";
  } else if (intermediateMobileRat) {
    const buttonText = activeRats.includes(intermediateMobileRat)
      ? "Deselect"
      : "Select";
    mobileContent = (
      <div className="rat-select-mobile-panel">
        <IntermediateMobileRat ratId={intermediateMobileRat} />{" "}
        <button
          className="small"
          onClick={() => {
            selectRat(intermediateMobileRat);
          }}
        >
          {buttonText}
        </button>
      </div>
    );
  } else {
    mobileContent = "Select a rat!";
  }

  if (numRatsLeft === 0) {
    mobileHeader = "You're done selecting rats!";
    mobileCtaButton = ctaButton;
  }

  return (
    <>
      <div className="screen rat-select-screen">
        <MobileControl show={false}>
          <header>
            {numRatsLeft > 0 ? (
              <h2>Choose {numRatsLeft} contestants</h2>
            ) : (
              ctaButton
            )}
          </header>
        </MobileControl>
        <div className="rat-grid">
          {ratsData.map((ratData, index) => (
            <SelectableRat
              key={`rats${index}`}
              index={index}
              ratId={ratData.filename}
              ratName={ratData.name}
              ratZodiac={ratData.zodiac}
              ratTagline={ratData.tagline}
              isSelected={activeRats.includes(ratData.filename)}
              isMobileSelected={intermediateMobileRat === ratData.filename}
              onClick={() => onRatSelect(ratData.filename)}
              filename={`${ratData.filename}-frame.png`}
              filenameHearts={`hearts${(index % 9) + 1}.png`}
            />
          ))}
        </div>
      </div>
      <MobileControl
        show={true}
        header={mobileHeader}
        ctaButton={mobileCtaButton}
      >
        {mobileContent}
      </MobileControl>
    </>
  );
}

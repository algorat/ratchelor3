import "./RatSelect.css";

import React from "react";
import {
  getAllRatData,
  FRAMES_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";

/** TODO */
function SelectableRat(props) {
  const {
    index,
    ratId,
    ratName,
    ratTagline,
    isSelected,
    onClick,
    filename,
    filenameHearts,
  } = props;
  return (
    <div
      aria-label={`A selectable framed image of ${ratName}.`}
      className={`rat-container ${isSelected ? "selected-rat" : ""}`}
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
            className="rat-hearts"
            src={`${FRAMES_IMAGES_BASE_PATH}/${filenameHearts}`}
            alt=""
          />
        </div>
        <div className="rat-name-container">
          <div className="rat-name">{ratName}</div>
          <div className="rat-tagline">{`"${ratTagline}"`}</div>
        </div>
      </div>
    </div>
  );
}

/** TODO */
export function RatSelect(props) {
  const { activeRats, setActiveRats, setOriginalRats, advanceToNextStage } =
    props;

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

  return (
    <div className="screen rat-select-screen">
      <header>
        {numRatsLeft > 0 ? (
          <p>Choose {numRatsLeft} contestants</p>
        ) : (
          <button
            onClick={() => {
              advanceToNextStage();
              setOriginalRats(activeRats);
            }}
          >
            Onwards!
          </button>
        )}
      </header>
      <div className="rat-grid">
        {ratsData.map((ratData, index) => (
          <SelectableRat
            key={`rats${index}`}
            index={index}
            ratId={ratData.filename}
            ratName={ratData.name}
            ratTagline={ratData.tagline}
            isSelected={activeRats.includes(ratData.filename)}
            onClick={() => selectRat(ratData.filename)}
            filename={`${ratData.filename}-frame.png`}
            filenameHearts={`hearts${(index % 9) + 1}.png`}
          />
        ))}
      </div>
    </div>
  );
}

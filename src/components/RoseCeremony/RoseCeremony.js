import "./RoseCeremony.css";

import {
  getRatById,
  CHARACTERS_IMAGES_BASE_PATH,
  BACKGROUNDS_IMAGES_BASE_PATH,
  BOUQUET_IMAGES_BASE_PATH,
} from "../../utils/ratDataHelper";

import React, { useState } from "react";

const sizeOrderings = {
  small: 1,
  "med-small": 2,
  medium: 3,
  "med-large": 4,
  large: 5,
  xlarge: 6,
};

const ratStates = {
  NEVER_CHOSEN: "neverchosen",
  CHOSEN: "chosen",
  UNCHOSEN: "unchosen",
};

const ROSE_SUFFIX = "-rose.png";
const ROSE_SAD_SUFFIX = "-sad.png";

function SelectableRat(props) {
  const ratData = getRatById(props.rat);
  const ratState = props.ratState;

  let file = `${CHARACTERS_IMAGES_BASE_PATH}/${props.rat}.png`;
  let roseFile = `${CHARACTERS_IMAGES_BASE_PATH}/${props.rat}${ROSE_SUFFIX}`;
  let sadFile = `${CHARACTERS_IMAGES_BASE_PATH}/${props.rat}${ROSE_SAD_SUFFIX}`;

  if (
    ratData.rose_ceremony_filename &&
    props.round < ratData.rose_ceremony_filename.length
  ) {
    const baseFile = ratData.rose_ceremony_filename[props.round];
    file = `${CHARACTERS_IMAGES_BASE_PATH}/${baseFile}.png`;
    roseFile = `${CHARACTERS_IMAGES_BASE_PATH}/${baseFile}${ROSE_SUFFIX}`;
    sadFile = `${CHARACTERS_IMAGES_BASE_PATH}/${baseFile}${ROSE_SAD_SUFFIX}`;
  }
  return (
    <div
      onClick={props.onClick}
      className={`rose-ceremony-rat ${ratData.size}`}
    >
      <img
        className={ratState === ratStates.NEVER_CHOSEN ? "show" : ""}
        src={file}
        alt={`${ratData.name} waiting for you to make a decision`}
      />
      <img
        className={ratState === ratStates.CHOSEN ? "show" : ""}
        src={roseFile}
        alt={`${ratData.name} holding a rose`}
      />
      <img
        className={ratState === ratStates.UNCHOSEN ? "show" : ""}
        src={sadFile}
        alt={`a sad ${ratData.name}`}
      />
    </div>
  );
}

function sizeCompare(rat1, rat2) {
  const rat1Size = getRatById(rat1).size;
  const rat2Size = getRatById(rat2).size;
  return sizeOrderings[rat2Size] - sizeOrderings[rat1Size];
}

export function RoseCeremony(props) {
  const ratsOrderedBySize = props.activeRats.sort(sizeCompare);
  const [selectedRats, setSelectedRats] = useState([]);
  const [previousRats, setPreviousRats] = useState([]);

  const selectRat = (selectedRatId) => {
    console.log("selected");
    // Is it already selected?
    if (selectedRats.includes(selectedRatId)) {
      setPreviousRats([...previousRats, selectedRatId]);
      setSelectedRats(selectedRats.filter((ratId) => ratId !== selectedRatId));
      return;
    }
    // Exit early if we're at our selection limit.
    if (selectedRats.length === props.maxRats) {
      // TODO: play bad sound here.
      return;
    }

    // TODO: play success sound
    setSelectedRats([...selectedRats, selectedRatId]);
  };

  const bouquetNum = props.maxRats - selectedRats.length;

  let instructions = `Choose ${bouquetNum} rats to continue.`;
  if (bouquetNum === 0) {
    instructions = (
      <button onClick={() => props.goToNextRound(selectedRats)}>
        Onwards!
      </button>
    );
  }

  return (
    <div className="rose-ceremony-screen screen">
      <div className="rose-ceremony-rats">
        {ratsOrderedBySize.map((rat, idx) => {
          let ratState = ratStates.NEVER_CHOSEN;
          if (selectedRats.includes(rat)) {
            ratState = ratStates.CHOSEN;
          } else if (previousRats.includes(rat)) {
            ratState = ratStates.UNCHOSEN;
          }
          return (
            <SelectableRat
              key={`roseceremonyrat${idx}`}
              rat={rat}
              ratState={ratState}
              onClick={() => {
                selectRat(rat);
              }}
              round={props.round}
            />
          );
        })}
      </div>
      <img
        className="bouquet"
        alt="a rose bouquet"
        src={`${BOUQUET_IMAGES_BASE_PATH}/bouquet${bouquetNum}.png`}
      ></img>
      <img
        className="rose-ceremony-background"
        src={`${BACKGROUNDS_IMAGES_BASE_PATH}/rose_ceremony.png`}
        alt=""
      />
      <header>{instructions}</header>
    </div>
  );
}

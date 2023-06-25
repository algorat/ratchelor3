import "./RoseCeremony.css";
import { MobileControl } from "../MobileControl/MobileControl";

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
      className={`rose-ceremony-rat ${ratData.size} ${
        props.leaving ? "leaving" : ""
      }`}
    >
      <img
        className={
          ratState === ratStates.NEVER_CHOSEN && !props.leaving ? "show" : ""
        }
        src={file}
        alt={`${ratData.name} waiting for you to make a decision`}
      />
      <img
        className={
          ratState === ratStates.CHOSEN && !props.leaving ? "show" : ""
        }
        src={roseFile}
        alt={`${ratData.name} holding a rose`}
      />
      <img
        className={
          ratState === ratStates.UNCHOSEN || props.leaving ? "show" : ""
        }
        src={sadFile}
        alt={`a sad ${ratData.name}`}
      />
      <div className="hoverable-rat-name">{ratData.name}</div>
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

  const leavingRat = props.currentlyLeavingRat;

  const selectRat = (selectedRatId) => {
    // Is it a rat who is leaving already?
    if (selectedRatId === leavingRat) {
      props.updateSfx("bad_action.wav");
      return;
    }

    // Is it already selected?
    if (selectedRats.includes(selectedRatId)) {
      props.updateSfx("wobble.mp3");
      setPreviousRats([...previousRats, selectedRatId]);
      setSelectedRats(selectedRats.filter((ratId) => ratId !== selectedRatId));
      return;
    }
    // Exit early if we're at our selection limit.
    if (selectedRats.length === props.maxRats) {
      props.updateSfx("bad_action.wav");
      return;
    }

    props.updateSfx("rose3.wav");
    setSelectedRats([...selectedRats, selectedRatId]);
  };

  const bouquetNum = props.maxRats - selectedRats.length;

  let instructions = `Choose ${bouquetNum} rats to continue.`;
  if (props.maxRats === 1) {
    instructions = "Choose a rat to propose to.";
  }

  if (leavingRat) {
    const leavingRatData = getRatById(leavingRat);
    instructions = `Reminder: ${leavingRatData.name} has decided to leave the show. ${instructions}`;
  }

  if (bouquetNum === 0) {
    instructions = (
      <button onClick={() => props.goToNextRound(selectedRats)}>
        Onwards!
      </button>
    );
  }

  return (
    <>
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
                leaving={leavingRat === rat}
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
          src={`${BACKGROUNDS_IMAGES_BASE_PATH}/${
            props.maxRats === 1 ? "garden.png" : "rose_ceremony.png"
          }`}
          alt=""
        />
        <MobileControl show={false}>
          <header>{instructions}</header>
        </MobileControl>
      </div>
      <MobileControl show={true} header="Who will you choose?">
        {instructions}
      </MobileControl>
    </>
  );
}

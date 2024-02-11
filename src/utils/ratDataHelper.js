/* eslint-disable max-len */

import ratsJson from "../data/rats.json";
import responsesJson from "../data/responses.json";
import epilogueJson from "../data/epilogue.json";

export const PLAYER_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/player`;

export const DRESSER_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/dresser`;

export const FRAMES_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/frames`;

export const DATES_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/dates`;

export const REACTIONS_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/reactions`;

export const CHARACTERS_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/characters`;

export const BACKGROUNDS_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/backgrounds`;

export const BOUQUET_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/bouquet`;

export const PROPOSAL_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/proposal`;

export const ENDINGS_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/endings`;

export const EPILOGUE_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/epilogue`;

export const SOUND_ICONS_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/sound_icons`;

export const MOBILE_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/mobile`;

export const SOUND_BASE_PATH = `${process.env.PUBLIC_URL}/sounds`;

/**
 * Takes a string rat name and returns the
 * Json object with additional details.
 * @param name The name acting as the "key" of the rat.
 * @return Dict with rat info, or null if not found.
 */
export function getRatById(id) {
  const idCleaned = id.trim().toLowerCase();
  for (let i = 0; i < ratsJson.length; i++) {
    const ratData = ratsJson[i];
    if (!ratData) continue;

    const ratDataidCleaned = ratData.filename.trim().toLowerCase();
    if (ratDataidCleaned === idCleaned) {
      return ratData;
    }
  }
  return null;
}

/** TODO */
export function getAllRatData() {
  return ratsJson;
}

function randArrayItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** TODO */
export function getResponsesByRound(ratId, roundNumber) {
  const ratResponsesData = responsesJson[ratId];

  const allResponses = ratResponsesData[roundNumber];

  const positives = allResponses.filter((response) => response.score > 0);
  const neutrals = allResponses.filter((response) => response.score === 0);
  const negatives = allResponses.filter((response) => response.score < 0);

  const threeResponses = [
    randArrayItem(positives),
    randArrayItem(neutrals),
    randArrayItem(negatives),
  ];

  const shuffled = threeResponses.sort(() => 0.5 - Math.random());
  return shuffled;
}

/** TODO */
export function getRandomEpiloguePhoto(ratId) {
  const matches = [];
  Object.entries(epilogueJson).filter(([key, value]) => {
    if (value.rats.includes(ratId)) {
      matches.push({ src: key, rats: value.rats, description: value.text });
    }
  });
  const randomIdx = Math.floor(Math.random() * matches.length);
  return matches[randomIdx];
}

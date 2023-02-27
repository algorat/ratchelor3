/* eslint-disable max-len */

import ratsJson from "../data/rats.json";
import responsesJson from "../data/responses.json";
import epilogueJson from "../data/epilogue.json";

/** TODO */
export const PLAYER_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/player`;

/** TODO */
export const FRAMES_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/frames`;

/** TODO */
export const DATES_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/dates`;

/** TODO */
export const REACTIONS_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/reactions`;

/** TODO */
export const CHARACTERS_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/characters`;

/** TODO */
export const BACKGROUNDS_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/backgrounds`;

/** TODO */
export const BOUQUET_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/bouquet`;

/** TODO */
export const ENDINGS_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/endings`;

/** TODO */
export const EPILOGUE_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/epilogue`;

/** TODO */
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

/** TODO */
export function getResponsesByRound(ratId, roundNumber, numResponses = null) {
  const ratResponsesData = responsesJson[ratId];
  const allResponses = ratResponsesData[roundNumber];
  if (!numResponses) return allResponses;

  const shuffled = allResponses.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numResponses);
}

/** TODO */
export function getRandomEpiloguePhoto(ratId) {
  const matches = [];
  Object.entries(epilogueJson).filter(([key, value]) => {
    if (value.rats.includes(ratId)) {
      matches.push(key);
    }
  });
  const randomIdx = Math.floor(Math.random() * matches.length);
  return matches[randomIdx];
}

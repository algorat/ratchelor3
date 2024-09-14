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
export const INTRO_IMAGES_BASE_PATH = `${process.env.PUBLIC_URL}/images/intro`;
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

export function getAllRatData(marriedRats) {
  // Let's separate the original rats from second round rats.
  const originalRats = ratsJson.filter((rat) => !rat.secondRound);
  const secondRoundRats = ratsJson.filter((rat) => !!rat.secondRound);

  const findSecondRoundMatch = (rat) => (matchingRat) => {
    return (
      matchingRat.filename !== rat.filename &&
      matchingRat.secondRound === rat.filename
    );
  };

  // Now see if we want to sub out any of the married rats with
  // their second round counterparts.
  const finalRats = [];
  for (const rat of originalRats) {
    const ratName = rat.filename;
    if (marriedRats.includes(ratName)) {
      const matchingRats = secondRoundRats.filter(findSecondRoundMatch(rat));
      if (matchingRats.length !== 0) {
        finalRats.push(matchingRats);
      } else {
        finalRats.push([rat]);
      }
    } else {
      finalRats.push([rat]);
    }
  }
  return finalRats;
}

function randArrayItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getResponsesByRound(ratId, roundNumber) {
  const ratResponsesData = responsesJson[ratId];

  const allResponses = ratResponsesData[roundNumber];

  const positives = allResponses.filter((response) => response.score > 0);
  const neutrals = allResponses.filter((response) => response.score === 0);
  const negatives = allResponses.filter((response) => response.score < 0);

  // If we don't have one of reach type, let's just return the first 3.
  if (
    positives.length === 0 ||
    neutrals.length === 0 ||
    negatives.length === 0
  ) {
    return allResponses.slice(0, 3);
  }

  const threeResponses = [
    randArrayItem(positives),
    randArrayItem(neutrals),
    randArrayItem(negatives),
  ];

  const shuffled = threeResponses.sort(() => 0.5 - Math.random());
  return shuffled;
}

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

export function getRandomEpiloguePhoto(ratId, ineligableRats) {
  const matches = [];
  Object.entries(epilogueJson).filter(([key, value]) => {
    // Return early if this photo has an ineligable rat.
    for (const rat of value.rats) {
      if (ineligableRats.has(rat)) {
        return;
      }
    }
    if (value.rats.includes(ratId)) {
      matches.push({ src: key, rats: value.rats, description: value.text });
    }
  });
  const randomIdx = Math.floor(Math.random() * matches.length);
  return matches[randomIdx];
}

const maxTries = 30;
export function getEpiloguePhotos(originalRats, finalRat) {
  const ineligableRats = new Set([finalRat]);
  const photos = [];
  let tries = 0;
  // start by adding original rats
  for (const rat of originalRats) {
    if (rat === finalRat) {
      continue;
    }
    const photo = getRandomEpiloguePhoto(rat, ineligableRats);
    if (photo) {
      photos.push(photo);
      photo.rats.forEach((rat) => ineligableRats.add(rat));
    }
  }
  const leftoverRats = ratsJson
    .filter(
      (ratData) =>
        !originalRats.includes(ratData.filename) &&
        ratData.fileName !== finalRat &&
        !ineligableRats.has(ratData.filename)
    )
    .map((ratData) => ratData.filename);
  while (photos.length < 6) {
    const randomRat = randArrayItem(leftoverRats);
    const photo = getRandomEpiloguePhoto(randomRat, ineligableRats);
    if (photo) {
      photos.push(photo);
      photo.rats.forEach((rat) => ineligableRats.add(rat));
    }
    tries++;
    if (tries > maxTries) {
      console.warn("max tries exceeded");
      break;
    }
  }
  return photos;
}

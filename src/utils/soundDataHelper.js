import soundMapping from "../data/soundsToActions.json";

const allTalkingMusic = [
  "talking_to_rat_1.mp3",
  "talking_to_rat_2.mp3",
  "talking_to_rat_3.mp3",
  "talking_to_rat_4.mp3",
];

/** TODO */
const reactionsToSounds = {};
for (const [sound, reactions] of Object.entries(soundMapping)) {
  for (const reaction of reactions) {
    reactionsToSounds[reaction] = sound;
  }
}

/**
 * TODO comment
 * Also maybe return fallback sound if failed to find sound?
 */
export function getMatchingSound(reaction) {
  return reactionsToSounds[reaction];
}

/** TODO */
export function getTalkingMusic(index) {
  return allTalkingMusic[index % allTalkingMusic.length];
}

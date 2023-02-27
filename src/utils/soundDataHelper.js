import soundMapping from "../data/soundsToActions.json";

const allTalkingMusic = [
  "talking_to_rat_1.mp3",
  "talking_to_rat_2.mp3",
  "talking_to_rat_3.mp3",
  "talking_to_rat_4.mp3",
];

// import Cheerful from "../sounds/Cheerful.mp3";
// import Funky from "../sounds/Funky.mp3";
// import Intense from "../sounds/Intense.mp3";
// import IntroScreen from "../sounds/Intro_Screen.mp3";
// import Paris from "../sounds/Paris.mp3";
// import Pop from "../sounds/Pop.mp3";
// import RomanticHappy from "../sounds/Romantic_Happy.mp3";
// import RomanticSad from "../sounds/Romantic_Sad.mp3";
// import RoseCeremony from "../sounds/Rose_Ceremony.mp3";
// import Talking1 from "../sounds/Talking_To_Rat_1.mp3";
// import Talking2 from "../sounds/Talking_To_Rat_2.mp3";
// import Talking3 from "../sounds/Talking_To_Rat_3.mp3";
// import Talking4 from "../sounds/Talking_To_Rat_4.mp3";

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

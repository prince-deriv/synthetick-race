import { atom } from "recoil";

const speedState = atom({
  key: "speed",
  default: 0.5,
});

const distanceState = atom({
  key: "distance",
  default: 0,
});

const carLaneState = atom({
  key: "lane",
  default: 0,
});

const collisionState = atom({
  key: "collision",
  default: false,
});

const enemyDistanceState = atom({
  key: "enemy_distance",
  default: 0,
});

export {
  speedState,
  distanceState,
  carLaneState,
  collisionState,
  enemyDistanceState,
};

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

const gameState = atom({
  key: "game_state",
  default: "home",
});

const carColorState = atom({
  key: "car_color",
  default: 0,
});

const luckyNumberState = atom({
  key: "lucky_number",
  default: 0,
});

const symbolState = atom({
  key: "symbol",
  default: 0,
});

const nameState = atom({
  key: "player_name",
  default: "Player 1",
});

export {
  speedState,
  distanceState,
  carLaneState,
  collisionState,
  enemyDistanceState,
  gameState,
  carColorState,
  luckyNumberState,
  symbolState,
  nameState,
};

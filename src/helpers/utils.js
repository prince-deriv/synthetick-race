export const getRandomDigit = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getSpeed = (id) => {
  const car = document.getElementById(id);
  return parseFloat(car.getAttribute("speed"));
};

export const getPosition = (id) => {
  const car = document.getElementById(id);
  return parseFloat(car.getAttribute("position"));
};

export const getLane = (id) => {
  const car = document.getElementById(id);
  const lane = parseInt(car.getAttribute("lane"));

  return isNaN(lane) ? (id === "car" ? 0 : 1) : lane;
};

export const setSpeed = (id, speed) => {
  const final_speed = speed < 0 ? 0 : speed;

  document.getElementById(id).setAttribute("speed", final_speed);
};

export const setPosition = (id, pos) => {
  document.getElementById(id).setAttribute("position", pos);
};

export const setClass = (id, class_name) => {
  document.getElementById(id).setAttribute("class", class_name);
};

export const setLane = (id, lane) => {
  document.getElementById(id).setAttribute("lane", lane);
};

export const carMove = (id, lane) => {
  let new_speed = null;
  let final_class = null;

  const speed = getSpeed(id);
  const speed_deduction = speed * 0.02;

  const turn_reset = 300;

  if (lane) {
    setClass(id, "car right-move right-turn");
    final_class = "car right-move";
  } else {
    setClass(id, "car left-move left-turn");
    final_class = "car left-move";
  }

  new_speed = speed - speed_deduction;
  setSpeed(id, new_speed);

  setTimeout(() => {
    setClass(id, final_class);
    setLane(id, lane);
  }, turn_reset);
};

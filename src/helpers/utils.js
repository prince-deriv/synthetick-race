import { Cars, CAR_SIZE, CAR_STATUS } from "components/car";
import Explosion from "images/effects/explosion.gif";

export const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const isInvulnerable = (id) => {
  return getState(id) === "bonus";
};

export const getRandomDigit = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getSpeed = (id) => {
  const car = document.getElementById(id);
  return parseFloat(car.getAttribute("speed"));
};

export const getPosition = (id) => {
  const car = document.getElementById(id);

  const pos = parseFloat(car.getAttribute("position"));
  return isNaN(pos) ? 0 : pos;
};

export const getLane = (id) => {
  const car = document.getElementById(id);
  const lane = parseInt(car.getAttribute("lane"));

  return isNaN(lane) ? (id === "car" ? 0 : 1) : lane;
};

export const getAcceleration = (id) => {
  const car = document.getElementById(id);
  return parseFloat(car.getAttribute("acc"));
};

export const getLuckyNumber = (id) => {
  const car = document.getElementById(id);
  return parseFloat(car.getAttribute("lucky_number"));
};

export const getTopSpeed = (id) => {
  const car = document.getElementById(id);
  return parseFloat(car.getAttribute("top-speed"));
};

export const getState = (id) => {
  const car = document.getElementById(id);
  return car.getAttribute("state");
};

export const getName = (id) => {
  const car = document.getElementById(id);
  return car.getAttribute("pl-name");
};

export const getRef = (id) => {
  const car = document.getElementById(id);
  return car.getAttribute("ref");
};

export const getSrc = (id) => {
  const car = document.getElementById(id);
  return car.style.backgroundImage;
};

export const getSkin = (id) => {
  const car = document.getElementById(id);
  return car.getAttribute("skin");
};

export const getType = (id) => {
  const car = document.getElementById(id);
  return car.getAttribute("type");
};

export const getLeft = (id) => {
  const car = document.getElementById(id);
  return car.offsetLeft;
};

export const getDistance = (id) => {
  const element = document.getElementById(id);
  const distance = parseInt(element.getAttribute("distance"));

  return isNaN(distance) ? 0 : distance;
};

export const getCollision = (id) => {
  const element = document.getElementById(id);
  const collision = parseInt(element.getAttribute("collision"));

  return isNaN(collision) ? 0 : collision;
};

export const getCollided = (id) => {
  const element = document.getElementById(id);
  const collided = parseInt(element.getAttribute("collided"));

  return isNaN(collided) ? 0 : collided;
};

export const setSpeed = (id, speed) => {
  const final_speed = speed < 0 ? 0 : speed;

  document.getElementById(id).setAttribute("speed", final_speed);
};

export const setPosition = (id, pos) => {
  document.getElementById(id).setAttribute("position", pos);
};

export const setLuckyNumber = (id, lucky_number) => {
  document.getElementById(id).setAttribute("lucky_number", lucky_number);
};

export const setSkin = (id, skin) => {
  document.getElementById(id).setAttribute("skin", skin);
};

export const setSrc = (id, src) => {
  document.getElementById(id).style.backgroundImage = `url(${src})`;
};

export const setClass = (id, class_name) => {
  document.getElementById(id).setAttribute("class", class_name);
};

export const setLane = (id, lane) => {
  document.getElementById(id).setAttribute("lane", lane);
};

export const setCollided = (id, collided) => {
  document.getElementById(id).setAttribute("collided", collided);
};

export const setBottom = (id, bottom) => {
  document.getElementById(id).style.bottom = `${bottom}px`;
};

export const setDistance = (id, distance) => {
  document.getElementById(id).setAttribute("distance", distance);
};

export const setRef = (id, ref) => {
  document.getElementById(id).setAttribute("ref", ref);
};

export const setName = (id, name) => {
  document.getElementById(id).setAttribute("pl-name", name);
};

export const setState = (id, state) => {
  document.getElementById(id).setAttribute("state", state);
};

export const setCollision = (id, collision) => {
  document.getElementById(id).setAttribute("collision", collision);
};

export const setCoordinates = (id, coordinates) => {
  document.getElementById(id).setAttribute("coordinates", coordinates);
};

export const setAcceleration = (id, acc) => {
  document.getElementById(id).setAttribute("acc", acc);
};
export const setTopSpeed = (id, top_speed) => {
  document.getElementById(id).setAttribute("top-speed", top_speed);
};

export const show = (id) => {
  document.getElementById(id).style.opacity = 1;
};

export const hide = (id) => {
  document.getElementById(id).style.opacity = 0;
};

export const kill = (id) => {
  const state = getState(id);

  if (state !== "finished") {
    setSpeed(id, 0);
    setState(id, CAR_STATUS.dead);
    setSrc(id, Explosion);

    setTimeout(() => {
      const skin = getSkin(id);
      setSrc(id, skin);
      setState(id, "");
    }, 1000);
  }
};

export const carMove = (id, lane) => {
  let new_speed = null;
  let final_class = null;

  const speed = getSpeed(id);
  const speed_deduction = speed * 0.009;

  const turn_reset = 300;
  const state = getState(id);

  if (state !== CAR_STATUS.dead) {
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
  }
};

export const getRanking = () => {
  const ranking = {};
  const positions = [];

  Cars.forEach((c) => {
    const position = getPosition(c);

    ranking[c] = position;
    positions.push(position);
  });

  positions.sort((a, b) => {
    return b - a;
  });

  const car_order = [];

  positions.forEach((p) => {
    let done = false;
    Cars.forEach((c) => {
      if (ranking[c] === p && !done && !car_order.includes(c)) {
        car_order.push(c);
        done = true;
      }
    });
  });

  return { ranking, positions, car_order };
};

export const getCarRank = (c) => {
  const { car_order } = getRanking();
  const places = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
  const key = arraySearch(car_order, c);
  const place = places[key];

  return { key, place };
};

export const arraySearch = (arr, val) => {
  for (var i = 0; i < arr.length; i++) if (arr[i] === val) return i;
  return false;
};

export const getCarCoordinates = () => {
  const coordinates = {};

  Cars.forEach((c) => {
    const position = parseInt(getPosition(c));
    const range = position - CAR_SIZE;

    coordinates[c] = [];

    for (let x = position; x >= range; x--) {
      coordinates[c].push(x);
    }

    // setCoordinates(c, coordinates[c].join(','))
  });

  return coordinates;
};

const getArraysIntersection = (a1, a2) => {
  return a1.filter(function (n) {
    return a2.indexOf(n) !== -1;
  });
};

export const getActualPosition = (pos) => {
  const distance = getDistance("terrain");

  return pos - distance;
};

export const getLandPosition = (pos) => {
  const distance = getDistance("terrain");

  return pos + distance;
};

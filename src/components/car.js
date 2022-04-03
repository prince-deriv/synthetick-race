import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "styles/global.scss";
import CarImage from "images/cars/car-red.png";
import CarEnemyImage1 from "images/cars/car-blue.png";
import CarEnemyImage2 from "images/cars/car-yellow.png";
import CarEnemyImage3 from "images/cars/car-green.png";
import CarEnemyImage4 from "images/cars/car-pink.png";
import CarEnemyImage5 from "images/cars/car-cyan.png";
import { useKeyPress } from "helpers/use-key-press";
import {
  carMove,
  getSpeed,
  getSrc,
  getState,
  setAcceleration,
  setLane,
  setPosition,
  setSkin,
  setSpeed,
  setSrc,
  setTopSpeed,
} from "helpers/utils";

export const PLAYER_DEFAULT_POS = 20;
export const CAR_SIZE = 80;
export const CAR_STATUS = {
  dead: "dead",
};

export const MAX_DISTANCE = 100000;

const CarContainer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 115px;
  height: 100px;
  padding: 10px;
  z-index: 3;
}
`;

const CarBox = styled.img`
  height: 80px;
  width: auto;
  position: absolute;
  left: 10px;
  bottom: ${PLAYER_DEFAULT_POS}px;
  transition: left 0.3s ease-in, transform 0.1s ease-out; 

  &.right-turn {
    transform: rotate(12deg);
  }

  &.right-move {
    left: 80px;
  }

  &.left-turn {
    transform: rotate(-12deg);
  }

  &.left-move {
    left: 10px;
  }

  &#car-enemy-1 {
    bottom: ${PLAYER_DEFAULT_POS}px;
    left: 80px;
  }
  &#car-enemy-2 {
    bottom: -80px;
  }
  &#car-enemy-3 {
    left: 80px;
    bottom: -80px;
  }
  &#car-enemy-4 {
    bottom: -160px;
  }
  &#car-enemy-5 {
    left: 80px;
    bottom: -160px;
  }
}
`;

export const Cars = [
  "car",
  "car-enemy-1",
  "car-enemy-2",
  "car-enemy-3",
  "car-enemy-4",
  "car-enemy-5",
];

export const EnemyCars = Cars.filter((c) => c != "car");

const Car = () => {
  const arrow_left = useKeyPress("ArrowLeft");
  const arrow_right = useKeyPress("ArrowRight");
  const arrow_down = useKeyPress("ArrowDown");

  const [class_name, setClassName] = useState("");
  const [debounce, setDebounce] = useState(false);
  const turn_reset = 300;

  const handleClassName = (cn) => {
    const default_class = "";

    setClassName(`${default_class} ${cn}`);
  };

  useEffect(() => {
    handleClassName();

    const car_lanes = {
      car: 0,
      "car-enemy-1": 1,
      "car-enemy-2": 0,
      "car-enemy-3": 1,
      "car-enemy-4": 0,
      "car-enemy-5": 1,
    };

    const car_positions = {
      car: PLAYER_DEFAULT_POS,
      "car-enemy-1": PLAYER_DEFAULT_POS,
      "car-enemy-2": -100,
      "car-enemy-3": -100,
      "car-enemy-4": -200,
      "car-enemy-5": -200,
    };

    Cars.forEach((c) => {
      const src = getSrc(c);
      setLane(c, car_lanes[c]);
      setPosition(c, car_positions[c]);
      setSpeed(c, 0);
      setSkin(c, src);
      setAcceleration(c, 0.02);
      setTopSpeed(c, 5);
    });

    setPosition("terrain", 1200);
  }, []);

  useEffect(() => {
    const player = document.getElementById("car");
    const speed = getSpeed("car");
    const speed_deduction = speed * 0.1;
    let new_speed = null;

    const state = getState("car");

    if (state !== CAR_STATUS.dead) {
      if (arrow_right && !debounce) {
        setDebounce(true);
        handleClassName("right-move right-turn");

        new_speed = speed - speed_deduction;
        player.setAttribute("speed", new_speed);

        setTimeout(() => {
          handleClassName("right-move");
          setDebounce(false);
          player.setAttribute("lane", 1);
        }, turn_reset);

        // carMove("car", 1);
      }

      if (arrow_left && !debounce) {
        setDebounce(true);
        handleClassName("left-move left-turn");

        new_speed = speed - speed_deduction;
        player.setAttribute("speed", new_speed);

        setTimeout(() => {
          handleClassName("left-move");
          setDebounce(false);
          player.setAttribute("lane", 0);
        }, turn_reset);
        // carMove("car", 0);
      }

      if (arrow_down) {
        new_speed = speed - speed * 0.05;

        setSpeed("car", new_speed);
      }
    }
  }, [arrow_right, arrow_left, arrow_down, debounce]);

  return (
    <CarContainer>
      <CarBox src={CarImage} className={class_name} id="car" />
      <CarBox src={CarEnemyImage1} id="car-enemy-1" />
      <CarBox src={CarEnemyImage2} id="car-enemy-2" />
      <CarBox src={CarEnemyImage3} id="car-enemy-3" />
      <CarBox src={CarEnemyImage4} id="car-enemy-4" />
      <CarBox src={CarEnemyImage5} id="car-enemy-5" />
    </CarContainer>
  );
};

export default Car;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "styles/global.scss";
import CarImage from "images/cars/car-red.png";
import CarEnemyImage from "images/cars/car-blue.png";
import { useKeyPress } from "helpers/use-key-press";
import { useRecoilState, useRecoilValue } from "recoil";
import { carLaneState, speedState } from "atoms";
import { getSpeed } from "helpers/utils";

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
  position: relative;
  left: 0px;
  transition: left 0.3s ease-in, transform 0.1s ease-out; 

  &.right-turn {
    transform: rotate(12deg);
  }

  &.right-move {
    left: 70px;
  }

  &.left-turn {
    transform: rotate(-12deg);
  }

  &.left-move {
    left: 0px;
  }

  &#car-enemy {
    left: 30px;
  }
}
`;

const Car = () => {
  const arrow_left = useKeyPress("ArrowLeft");
  const arrow_right = useKeyPress("ArrowRight");
  const [, setCarLane] = useRecoilState(carLaneState);
  const speed = useRecoilValue(speedState);

  const [class_name, setClassName] = useState("");
  const [debounce, setDebounce] = useState(false);
  const turn_reset = 300;

  const handleClassName = (cn) => {
    const default_class = "";

    setClassName(`${default_class} ${cn}`);
  };

  useEffect(() => {
    handleClassName();
  }, []);

  useEffect(() => {
    const player = document.getElementById("car");
    const speed = getSpeed("car");
    const speed_deduction = speed * 0.1;
    let new_speed = null;

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
    }
  }, [arrow_right, arrow_left, debounce]);

  return (
    <CarContainer>
      <CarBox src={CarImage} className={class_name} id="car" />
      <CarBox src={CarEnemyImage} id="car-enemy" />
    </CarContainer>
  );
};

export default Car;

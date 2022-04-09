import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Finish from "images/obstacles/finish.jpeg";
import { Cars } from "./car";
import { getSkin, setRef } from "helpers/utils";
import { gameState } from "atoms";
import { useRecoilValue } from "recoil";

const LineContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 400px;
  width: 50px;
  position: absolute;
  top: 50%;
  right: 100px;
  transform: translateY(-50%);
  text-align: center;
  overflow: hidden;
`;
const Line = styled.div`
  height: 100%;
  width: 3px;
  border-radius: 10px;
  background: white;
`;

const FinishLine = styled.img`
  //   border-radius: 100%;
  height: 20px;
  width: 30px;
  overflow: hidden;
  object-fit: cover;
  position: absolute;
  top: -10px;
`;

const MiniCar = styled.img`
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: 0px;
  object-fit: contain;
  z-index: 1;
`;

const Indicator = () => {
  const game_state = useRecoilValue(gameState);
  const [is_ready, setReady] = useState(false);
  useEffect(() => {
    if (game_state === "race") setReady(true);
  }, [game_state]);

  useEffect(() => {
    if (is_ready) {
      Cars.forEach((c) => {
        const mini_car_id = `indicator-${c}`;
        setRef(mini_car_id, c);
      });
    }
  }, [is_ready]);

  if (is_ready) {
    return (
      <LineContainer>
        <FinishLine src={Finish} />
        <Line />
        {Cars.map((c) => {
          const src = getSkin(c);

          return (
            <MiniCar key={`indicator-${c}`} id={`indicator-${c}`} src={src} />
          );
        })}
      </LineContainer>
    );
  }

  return <></>;
};

export default Indicator;

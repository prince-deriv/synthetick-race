import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import "styles/global.scss";
import TerrainBg from "images/terrain.jpg";
import { Car, Indicator, Obstacle } from "components";
import { useRecoilState } from "recoil";
import { speedState } from "atoms";
import { getSpeed, getState, setDistance, setSpeed } from "helpers/utils";
import ReactSpeedometer from "react-d3-speedometer";

const Land = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
`;

const Terrain = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 100%;
  background: #000;
  background-image: url(${TerrainBg});
  background-repeat: repeat-y;
  background-size: 100%;
  background-position: 0 0;
  z-index: 1;
}
`;

const SpeedoMeterContainer = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100px;
  height: 100px;
  right: 82px;
`;

const PlaceBox = styled.div`
  position: absolute;
  bottom: 0px;
  display: flex;
  width: 75px;
  justify-content: center;
  height: auto;
  left: 82px;
  background: rgba(0, 0, 0, 0.4);
  font-family: Digital7;
  font-size: 40px;
  color: white;
  padding: 8px 8px 0px 8px;
  border-radius: 5px 5px 0px 0px;
`;

const ScoreBoard = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.4);
  padding: 10px;
  border-radius: 4px;
  height: 350px;
  width: 300px;
  font-family: Digital7;
  z-index: 10;
  opacity: 0;
  transition: opacity 1s ease-in;

  .title {
    font-size: 40px;
    display: flex;
    justify-content: center;
    border-bottom: 5px dashed #fff;
    padding-bottom: 10px;
    margin-bottom: 5px;
  }

  .item {
    display: flex;
    font-size: 30px;
    padding: 10px;

    .place {
      display: flex;
      padding-right: 5px;
      border-right: solid 1px #fff;
      width: 50px;
      justify-content: center;
    }

    .name {
      padding-left: 20px;
      font-family: arial;
      font-size: 25px;
      text-transform: uppercase;
    }
  }
`;

const Game = () => {
  const terrain = useRef();
  const [speed, setCarSpeed] = useRecoilState(speedState);
  const [data, setData] = useState({
    speed: 0,
  });

  useEffect(() => {
    const current = terrain.current;
    let terrain_move;
    if (current) {
      terrain_move = setInterval(() => {
        move();
      }, 10);
    }

    return () => clearInterval(terrain_move);
  }, []);

  const move = () => {
    const current = terrain.current;

    const bpy = current.style.backgroundPositionY;

    const speed = getSpeed("car");
    const posY = bpy === "" ? 0 : parseFloat(bpy);

    const new_bpy = posY + speed;

    const status = getState("car");

    if (status !== "finished") {
      current.style.backgroundPositionY = `${new_bpy}px`;
    }

    const new_data = { ...data };
    new_data.speed = parseInt(speed * 30);

    setDistance("terrain", new_bpy);
    setCarSpeed(speed);
    setData(new_data);
  };

  return (
    <Land>
      <Terrain ref={terrain} id="terrain">
        <Indicator />
        <SpeedoMeterContainer>
          <ReactSpeedometer
            maxValue={300}
            width={175}
            height={170}
            value={data.speed}
            segments={5}
            needleColor="#ffffff"
            needleTransition="easeBounceIn"
            labelFontSize={"0px"}
            valueTextFontSize="75px"
            textColor="#ffffff"
            segmentColors={[
              "#111111",
              "#222222",
              "#333333",
              "#444444",
              "#555555",
            ]}
          />
        </SpeedoMeterContainer>
        <PlaceBox>
          <strong id="place"></strong>
        </PlaceBox>
      </Terrain>
      <Obstacle />
      <Car />
      <ScoreBoard id="score-board">
        <span className="title">Result</span>
        <div className="item">
          <span className="place">1st</span>
          <span className="name" id="place-0"></span>
        </div>
        <div className="item">
          <span className="place">2nd</span>
          <span className="name" id="place-1"></span>
        </div>
        <div className="item">
          <span className="place">3rd</span>
          <span className="name" id="place-2"></span>
        </div>
        <div className="item">
          <span className="place">4th</span>
          <span className="name" id="place-3"></span>
        </div>
        <div className="item">
          <span className="place">5th</span>
          <span className="name" id="place-4"></span>
        </div>
        <div className="item">
          <span className="place">6th</span>
          <span className="name" id="place-5"></span>
        </div>
      </ScoreBoard>
    </Land>
  );
};

export default Game;

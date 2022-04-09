import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  carColorState,
  gameState,
  luckyNumberState,
  nameState,
  symbolState,
} from "atoms";
import { useRecoilState } from "recoil";

import { car_images } from "./car";

const MenuBoard = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 4px;
  height: auto;
  width: 300px;
  font-family: Digital7;
  z-index: 10;
  transition: opacity 0.2s ease-in;
  opacity: ${(props) => (props.show ? "1" : "0")};
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  font-size: 25px;
  color: white;
  background: rgba(0, 0, 0, 0.8);
  width: auto;
  margin-bottom: 5px;
  transition: all 0.2s ease-in;

  &:hover {
    background: cyan;
    box-shadow: 0px 0px 10px cyan;
    color: #000;
  }
`;

const Dropdown = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
  font-size: 25px;
  color: white;
  background: rgba(0, 0, 0, 0.8);
  width: auto;
  margin-bottom: 5px;

  .title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  select {
    height: 40px;
    background: #222;
    border: solid 1px #222;
    color: #aaa;
    font-size: 20px;
    font-family: Digital7;
  }

  .car-option {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    img {
      width: 30px;
      height: auto;
      object-fit: scale-down;
      border-radius: 5px;
      background: #222;
      transform: rotate(20deg);
      padding: 2px;
      margin: 0 5px;

      &.active {
        background: cyan;
        box-shadow: 0px 0px 10px cyan;
      }
    }
  }

  .box-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .box-option {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      border-radius: 2px;
      margin: 0 2px;
      background: #222;
      color: white;
      font-size: 30px;
      margin-bottom: 5px;

      &.active {
        background: cyan;
        box-shadow: 0px 0px 10px cyan;
        color: #000;
      }
    }
  }
`;

export const FooterMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;

  .button {
    background: #222;
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    font-size: 25px;
    height: 30px;
    margin: 0 5px;

    &:hover {
      background: cyan;
      box-shadow: 0px 0px 10px cyan;
      color: #000;
    }
  }
`;

const startGame = (setGameState) => {
  setGameState("race");
};

const openSettings = (setGameState) => {
  setGameState("settings");
};

const menu_list = [
  {
    title: "New Game",
    action: startGame,
  },
  {
    title: "Settings",
    action: openSettings,
  },
  //   {
  //     title: "Info",
  //     action: null,
  //   },
];

export const symbols = [
  {
    name: "Volatility 10 (1s) Index",
    symbol: "1HZ10V",
  },
  {
    name: "Volatility 10 Index",
    symbol: "R10",
  },
  {
    name: "Volatility 25 (1s) Index",
    symbol: "1HZ25V",
  },
  {
    name: "Volatility 25  Index",
    symbol: "R_25",
  },
  {
    name: "Volatility 50 (1s) Index",
    symbol: "1HZ50V",
  },
  {
    name: "Volatility 50 Index",
    symbol: "R_50",
  },
  {
    name: "Volatility 75 (1s) Index",
    symbol: "1HZ75V",
  },
  {
    name: "Volatility 75 Index",
    symbol: "R_75",
  },
  {
    name: "Volatility 100 (1s) Index",
    symbol: "1HZ100V",
  },
  {
    name: "Volatility 100 Index",
    symbol: "R_100",
  },
  {
    name: "Volatility 200 (1s) Index",
    symbol: "1HZ200V",
  },
  {
    name: "Volatility 200 Index",
    symbol: "R_200",
  },
  {
    name: "Volatility 300 (1s) Index",
    symbol: "1HZ300V",
  },
  {
    name: "Volatility 300 Index",
    symbol: "R_300",
  },
];

const Menu = () => {
  const [game_state, setGameState] = useRecoilState(gameState);
  const [car_color, setCarColor] = useRecoilState(carColorState);
  const [lucky_number, setLuckyNumber] = useRecoilState(luckyNumberState);
  const [player_name, setPlayerName] = useRecoilState(nameState);
  const [symbol, setSymbol] = useRecoilState(symbolState);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const show_on = ["home", "settings"];

    setShow(() => show_on.includes(game_state));
  }, [game_state]);

  return (
    <MenuBoard show={show}>
      {game_state === "home" &&
        menu_list.map(({ title, action }, key) => (
          <MenuItem
            key={`menu-${key}`}
            onClick={() => action && action(setGameState)}
          >
            {title}
          </MenuItem>
        ))}

      {game_state === "settings" && (
        <>
          <Dropdown>
            <span className="title">Name</span>
            <input
              type="text"
              value={player_name}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </Dropdown>
          <Dropdown>
            <span className="title">Car Color</span>
            <div className="car-option">
              {car_images.map((i, k) => (
                <img
                  className={car_color === k ? "active" : ""}
                  key={`car-image-${k}`}
                  src={i}
                  onClick={() => setCarColor(k)}
                />
              ))}
            </div>
          </Dropdown>
          <Dropdown>
            <span className="title">Lucky Last Digit</span>
            <div className="box-container">
              {Array.from(Array(10).keys()).map((l, k) => (
                <span
                  key={`ln-${k}`}
                  className={`box-option ${lucky_number === l ? "active" : ""}`}
                  onClick={() => setLuckyNumber(l)}
                >
                  {l}
                </span>
              ))}
            </div>
          </Dropdown>
          <Dropdown>
            <span className="title">Synthetic Market</span>
            <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
              {symbols.map(({ name }, k) => (
                <option key={`market-${k}`} value={k}>
                  {name}
                </option>
              ))}
            </select>
          </Dropdown>
          <FooterMenu>
            <span className="button" onClick={() => setGameState("home")}>
              ← Back
            </span>
          </FooterMenu>
        </>
      )}
    </MenuBoard>
  );
};

export default Menu;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "styles/global.scss";
import Oil from "images/obstacles/oil.png";
import Magnet from "images/obstacles/magnet.png";
import Finish from "images/obstacles/finish.jpeg";
import Barricade from "images/obstacles/barricade.png";
import Water from "images/obstacles/water.png";
import Explosion from "images/effects/explosion.gif";
import Splash from "images/effects/splash.gif";
import { triggerWS } from "helpers/trade";

import {
  getRandomDigit,
  getLane,
  getPosition,
  getSpeed,
  setSpeed,
  setPosition,
  carMove,
  setBottom,
  getState,
  getType,
  getRanking,
  kill,
  getActualPosition,
  getLandPosition,
  getRef,
  getTopSpeed,
  getAcceleration,
  setAcceleration,
  getCarRank,
  setState,
  setCollided,
  getCollided,
  show,
  getName,
  isInvulnerable,
} from "helpers/utils";
import {
  Cars,
  CAR_SIZE,
  CAR_STATUS,
  EnemyCars,
  MAX_DISTANCE,
} from "components/car";
import { gameState, symbolState } from "atoms";
import { useRecoilValue } from "recoil";

const ObstacleContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 115px;
  height: 100%;
  padding: 10px;
  z-index: 2;
}
`;

const createObstacle = ({ src, position, lane, type, id }) => {
  const new_obstacle = document.createElement("div");
  new_obstacle.setAttribute("id", id);
  new_obstacle.setAttribute("class", `obstacle-item ${lane ? "right" : ""}`);
  new_obstacle.setAttribute("type", type);
  new_obstacle.setAttribute("position", position);
  new_obstacle.setAttribute("lane", lane);
  new_obstacle.style.backgroundImage = `url(${src})`;
  new_obstacle.style.bottom = `${position}px`;
  new_obstacle.style.backgroundSize = "100%";

  document.getElementById("obstacle-container").appendChild(new_obstacle);
};

const Obstacle = () => {
  const [enemy_move, setEnemyMove] = useState(false);
  const game_state = useRecoilValue(gameState);
  const symbol = useRecoilValue(symbolState);

  const spawnObstacle = (spawn_distance, x) => {
    const lane = getRandomDigit(0, 1);
    let obs_type = getRandomDigit(0, 3);
    const random_spawn = getRandomDigit(0, 3);
    const random_spawn2 = getRandomDigit(0, 5);

    obs_type = obs_type === 0 ? random_spawn : obs_type;
    obs_type = obs_type === 3 ? (random_spawn2 === 0 ? 3 : 1) : obs_type;

    const id = `obstacle-${+new Date()}-${x}`;
    const id2 = `obstacle-${+new Date()}-${x}-${x}`;

    const obtacle_types = [
      {
        type: "water",
        src: Water,
      },
      {
        type: "barricade",
        src: Barricade,
      },
      {
        type: "oil",
        src: Oil,
      },
      {
        type: "magnet",
        src: Magnet,
      },
    ];

    const { src, type } = obtacle_types[obs_type];
    const position = spawn_distance;

    // Create obstacle
    const max_obstacles = 250;
    const total_obstacles = document.querySelectorAll(".obstacle-item").length;

    if (total_obstacles <= max_obstacles && position < MAX_DISTANCE) {
      createObstacle({ src, position, lane, type, id });

      // const double_spawn = getRandomDigit(0, 1);

      // if (type === "oil" && double_spawn) {
      //   createObstacle({
      //     src,
      //     position: position + 200,
      //     lane: lane === 1 ? 0 : 1,
      //     type,
      //     id2,
      //   });
      // }
    }
  };

  const handleCollision = (obstacle, car, c) => {
    const collided = obstacle.getAttribute("collided");
    const type = obstacle.getAttribute("type");
    const id = obstacle.getAttribute("id");
    const car_speed = getSpeed(c);
    const is_invulnerable = isInvulnerable(c);

    const appearances = {
      barricade: Explosion,
      water: Splash,
      oil: Oil,
    };

    if (!collided) {
      const appearance = appearances[type];
      let new_speed = car_speed;

      setCollided(id, 1);
      obstacle.style.backgroundImage = `url(${appearance})`;

      switch (type) {
        case "water":
          new_speed = car_speed + car_speed * 0.5;

          break;
        case "barricade":
          if (!is_invulnerable) {
            new_speed = 0;
            kill(c);
          }
          break;

        case "oil":
          if (!is_invulnerable) {
            const acc = getAcceleration(c);
            let new_acc = acc;
            if (acc > 0.01) {
              new_acc = acc - 0.01;
            }

            new_speed = car_speed - car_speed * 0.5;
            setAcceleration(c, new_acc);
          }
          break;

        case "magnet":
          if (!is_invulnerable) {
            new_speed = 0;
            kill(c);
          }
          break;
      }

      if (new_speed != car_speed) {
        setSpeed(c, new_speed);
      }

      // Auto fade obstacles
      obstacle.style.opacity = 0;

      setTimeout(() => {
        obstacle.remove();
      }, 3000);
    }
  };

  const handleOpponents = () => {
    const player_speed = getSpeed("car");
    const player_status = getState("car");

    EnemyCars.forEach((e) => {
      const enemy_pos = getPosition(e);
      const enemy_speed = getSpeed(e);
      const diff = player_speed - enemy_speed;

      let new_pos = enemy_pos - diff;

      if (player_status === "finished") {
        new_pos = enemy_pos + enemy_speed;
      }

      setPosition(e, new_pos);
      setBottom(e, new_pos);
    });
  };

  const handleCarCollision = () => {
    Cars.forEach((c) => {
      const is_player = c === "car";
      const lane = getLane(c);
      const position = is_player ? 0 : getPosition(c);
      const collision_buffer = is_player ? CAR_SIZE : position + CAR_SIZE;
      const speed = getSpeed(c);
      const invul = isInvulnerable(c);

      Cars.forEach((oc) => {
        if (oc !== c) {
          const is_oplayer = oc === "car";
          const olane = getLane(oc);
          const oposition = is_oplayer ? 0 : getPosition(oc);
          const state = getState(oc);
          const ospeed = getSpeed(oc);
          const oinvul = isInvulnerable(oc);

          if (
            lane === olane &&
            oposition < collision_buffer &&
            oposition > collision_buffer - (CAR_SIZE + 10) &&
            state !== CAR_STATUS.dead
          ) {
            if (speed > ospeed) {
              if (oinvul) {
                if (!invul) {
                  kill(c);
                }
              } else {
                kill(oc);
              }
            } else {
              if (invul) {
                if (!oinvul) {
                  kill(oc);
                }
              } else {
                kill(c);
              }
            }
          }
        }
      });
    });
  };

  const handleRanking = () => {
    const { place } = getCarRank("car");
    const place_holder = document.getElementById("place");

    if (place_holder) {
      place_holder.innerHTML = place;
    }

    // Rank Result
    const { car_order } = getRanking();

    car_order.forEach((c, k) => {
      const place_box = document.getElementById(`place-${k}`);
      const state = getState(c);

      if (place_box && state === "finished") {
        const name = getName(c);

        place_box.innerHTML = name;

        if (c === "car") {
          place_box.style.color = "#08ec43";
        }
      }
    });
  };

  const carLoop = () => {
    // Car Speed
    Cars.forEach((c) => {
      const speed = getSpeed(c);
      const status = getState(c);
      const pos = getPosition(c);

      const max_speed = getTopSpeed(c);
      const speed_increment = getAcceleration(c);

      // Finis Line

      const land_pos = getLandPosition(pos);

      if (land_pos >= MAX_DISTANCE) {
        const runway = 1500;
        const { key } = getCarRank(c);
        const rank = key + 1;
        const reducer = runway - runway * (0.1 * rank);
        const slow_down = speed - speed * 0.1;
        const final_runway = MAX_DISTANCE + reducer;

        setState(c, "finished");

        // Finishing effect
        if (c === "car") {
          const n_pos = pos + speed;
          setPosition(c, n_pos);
          setBottom(c, n_pos);
          show("score-board");
        }

        if (land_pos >= final_runway) {
          setSpeed(c, slow_down);
        }

        return false;
      }

      if (speed < max_speed && status !== CAR_STATUS.dead) {
        const new_speed = speed + speed_increment;

        if (status !== "finished") {
          setSpeed(c, new_speed);
        }
      }
    });

    // Car Life Cycle
    carLifeCycle();

    // Car Indicator
    const max_bottom = 400;

    Cars.forEach((c) => {
      const mini_car_id = `indicator-${c}`;
      const ref = getRef(mini_car_id);
      const pos = getPosition(ref);
      const land_pos = getLandPosition(pos);

      const travelled = land_pos / MAX_DISTANCE;

      const indicator_pos = max_bottom * travelled;

      setPosition(mini_car_id, indicator_pos);
      setBottom(mini_car_id, indicator_pos);
    });
  };

  const carLifeCycle = () => {
    Cars.forEach((c) => {
      const is_player = c === "car";
      const car = document.getElementById(c);
      const car_lane = getLane(c);
      const car_position = getPosition(c);
      const is_invulnerable = isInvulnerable(c);

      // Collision check
      document.querySelectorAll.length &&
        document.querySelectorAll(".obstacle-item").forEach((o) => {
          const id = o.getAttribute("id");

          const position = getPosition(id);
          const lane = getLane(id);
          const type = getType(id);
          const collided = getCollided(id);

          const calculated_position = !is_player
            ? car_position + position
            : position;

          const actual_position = getActualPosition(calculated_position);

          // Move obstacle
          const obstacle = document.getElementById(id);
          const range_offset = 80;
          const position_reference = is_player
            ? range_offset
            : range_offset + car_position * 2;

          if (obstacle) {
            if (is_player) {
              if (getState(c) !== "finished") {
                obstacle.style.bottom = `${actual_position}px`;
              }
            }

            // Enemy Evade Obstacles

            if (!is_player) {
              const enemy_lane = getLane(c);
              const speed = getSpeed(c);
              const danger_range = position_reference + speed * 40;

              const evade = ["barricade", "oil", "magnet"];

              if (
                actual_position <= danger_range &&
                actual_position >= danger_range - range_offset &&
                lane === enemy_lane &&
                evade.includes(type) &&
                !is_invulnerable
              ) {
                const move_to = lane ? 0 : 1;

                if (!enemy_move) {
                  setEnemyMove(true);
                  carMove(c, move_to);

                  setTimeout(() => {
                    setEnemyMove(false);
                  }, 10);
                }
              }
            }

            // ****************

            const speed = getSpeed(c);
            const danger_range = position_reference + speed * 40;

            // Obstacle Collision

            if (
              actual_position <= position_reference &&
              actual_position >= position_reference - range_offset
            ) {
              // Magnet Pull
              if (type === "magnet" && !collided && !is_invulnerable) {
                for (let x = 1; x <= 20; x++) {
                  carMove(c, lane);
                }
              }

              const floaters = ["finish"];

              if (lane === car_lane && !floaters.includes(type)) {
                handleCollision(obstacle, car, c);
              }
            }
          }
        });
    });

    // Handle Opponents
    handleOpponents();
    // Car Collisions
    handleCarCollision();
    // Ranking
    handleRanking();
  };

  useEffect(() => {
    if (game_state === "race") {
      const car_loop = setInterval(carLoop, 10);

      // Spawn Obstacles
      for (let x = 1000; x <= MAX_DISTANCE; x++) {
        const spawn_distance = getRandomDigit(500, 600);

        const obstacle_position = spawn_distance + x;

        x = obstacle_position;

        spawnObstacle(obstacle_position, x);
      }

      // Render Finish
      createObstacle({
        src: Finish,
        position: MAX_DISTANCE,
        lane: 0,
        type: "finish",
        id: "finish-line",
      });

      // Open Websocket Connection
      triggerWS(symbol);

      return () => {
        clearInterval(car_loop);
      };
    }
  }, [game_state]);

  return <ObstacleContainer id="obstacle-container" />;
};

export default Obstacle;

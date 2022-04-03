import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "styles/global.scss";
import Oil from "images/obstacles/oil.png";
import Finish from "images/obstacles/finish.jpeg";
import Barricade from "images/obstacles/barricade.png";
import Water from "images/obstacles/water.png";
import Explosion from "images/effects/explosion.gif";
import Splash from "images/effects/splash.gif";

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
  getDistance,
  getRanking,
  getCollision,
  getLeft,
  checkCollision,
  kill,
  getActualPosition,
  getLandPosition,
  getRef,
  getTopSpeed,
  getAcceleration,
  setAcceleration,
  setTopSpeed,
  getCarRank,
} from "helpers/utils";
import {
  Cars,
  CAR_SIZE,
  CAR_STATUS,
  EnemyCars,
  MAX_DISTANCE,
} from "components/car";

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

  const spawnObstacle = (spawn_distance) => {
    const lane = getRandomDigit(0, 1);
    let obs_type = getRandomDigit(0, 2);
    const random_spawn = getRandomDigit(0, 2);

    obs_type = obs_type === 0 ? random_spawn : obs_type;

    const id = `obstacle-${+new Date()}`;
    const id2 = `obstacle-clone-${+new Date()}`;

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
    ];

    const { src, type } = obtacle_types[obs_type];
    const position = spawn_distance;

    // Create obstacle
    const max_obstacles = 150;
    const total_obstacles = document.querySelectorAll(".obstacle-item").length;

    if (total_obstacles <= max_obstacles && position < MAX_DISTANCE) {
      createObstacle({ src, position, lane, type, id });
    }
  };

  const handleCollision = (obstacle, car, c) => {
    const collided = obstacle.getAttribute("collided");
    const type = obstacle.getAttribute("type");
    const car_speed = getSpeed(c);

    const appearances = {
      barricade: Explosion,
      water: Splash,
      oil: Oil,
    };

    if (!collided) {
      const appearance = appearances[type];
      let new_speed = car_speed;

      obstacle.setAttribute("collided", 1);
      obstacle.style.backgroundImage = `url(${appearance})`;

      switch (type) {
        case "water":
          new_speed = car_speed + car_speed * 0.5;

          break;
        case "barricade":
          new_speed = 0;
          kill(c);
          break;

        case "oil":
          new_speed = car_speed - car_speed * 0.8;
          break;
      }

      if (new_speed != car_speed) {
        car.setAttribute("speed", new_speed);
      }

      if (type !== "finish") {
        // Auto fade obstacles
        obstacle.style.opacity = 0;

        setTimeout(() => {
          obstacle.remove();
        }, 3000);
      }
    }
  };

  const handleOpponents = () => {
    const player_speed = getSpeed("car");

    EnemyCars.forEach((e) => {
      const enemy_pos = getPosition(e);
      const enemy_speed = getSpeed(e);
      const diff = player_speed - enemy_speed;
      const new_pos = enemy_pos - diff;

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

      Cars.forEach((oc) => {
        if (oc !== c) {
          const is_oplayer = oc === "car";
          const olane = getLane(oc);
          const oposition = is_oplayer ? 0 : getPosition(oc);
          const state = getState(oc);
          const ospeed = getSpeed(oc);

          if (
            lane === olane &&
            oposition < collision_buffer &&
            oposition > collision_buffer - (CAR_SIZE + 10) &&
            state !== CAR_STATUS.dead
          ) {
            // if (speed === ospeed) {
            //   kill(oc);
            //   kill(c);
            // } else
            if (speed > ospeed) {
              kill(oc);
            } else {
              kill(c);
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
  };

  useEffect(() => {
    const carLoop = setInterval(() => {
      // Car Speed
      Cars.forEach((c) => {
        const speed = getSpeed(c);
        const status = getState(c);
        const pos = getPosition(c);

        const land_pos = getLandPosition(pos);

        if (land_pos >= MAX_DISTANCE) {
          // const runway = 1000;
          // const rank = getCarRank(c) + 1;
          // const reducer = runway - runway * (0.1 * rank);
          const slow_down = speed - speed * 0.5;

          setSpeed(c, slow_down);

          return;
        }

        const max_speed = getTopSpeed(c);
        const speed_increment = getAcceleration(c);

        if (speed < max_speed && status !== CAR_STATUS.dead) {
          const new_speed = speed + speed_increment;

          setSpeed(c, new_speed);
        }
      });

      // Car Life Cycle
      carLifeCycle();

      // Car Indicator
      const max_bottom = 375;

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
    }, 10);

    // Spawn Obstacles
    setInterval(() => {
      const { positions } = getRanking();
      const first_car = Math.max(...positions);
      const spawn_distance = getRandomDigit(250, 350);
      const spawn_position = getPosition("terrain");

      const final_spawn_position =
        first_car > spawn_position ? first_car + 2000 : spawn_position;

      const final_distance = final_spawn_position + spawn_distance;

      spawnObstacle(final_distance);
      setPosition("terrain", final_distance);
    }, 300);

    // Render Finish

    createObstacle({
      src: Finish,
      position: MAX_DISTANCE,
      lane: 0,
      type: "finish",
      id: "finish-line",
    });

    // Speed Bonus

    setInterval(() => {
      const lucky_car = getRandomDigit(0, 5);

      Cars.forEach((c, k) => {
        if (k === lucky_car) {
          const acc = getAcceleration(c);
          const top_speed = getTopSpeed(c);

          const new_acc = acc + 0.01;
          const new_top_speed = top_speed + 0.2;

          setAcceleration(c, new_acc);
          setTopSpeed(c, new_top_speed);
        }
      });
    }, 1500);

    return () => {
      clearInterval(carLoop);
    };
  }, []);

  const carLifeCycle = () => {
    Cars.forEach((c) => {
      const is_player = c === "car";
      const car = document.getElementById(c);
      const car_lane = getLane(c);
      const car_position = getPosition(c);

      // Collision check
      document.querySelectorAll.length &&
        document.querySelectorAll(".obstacle-item").forEach((o) => {
          const id = o.getAttribute("id");

          const position = getPosition(id);
          const lane = getLane(id);
          const type = getType(id);

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
              obstacle.style.bottom = `${actual_position}px`;
            }

            // Enemy Evade Obstacles

            if (!is_player) {
              const enemy_lane = getLane(c);
              const speed = getSpeed(c);
              const danger_range = position_reference + speed * 40;

              const evade = ["barricade", "oil"];

              if (
                actual_position <= danger_range &&
                actual_position >= danger_range - range_offset &&
                lane === enemy_lane &&
                evade.includes(type)
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

            // Obstacle Collision

            if (
              actual_position <= position_reference &&
              actual_position >= position_reference - range_offset
            ) {
              if (lane === car_lane) {
                handleCollision(obstacle, car, c);
              }
            }

            // Recycle Obstacle
            if (is_player && actual_position < -50) {
              if (type !== "finish") {
                obstacle.remove();
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

  return <ObstacleContainer id="obstacle-container" />;
};

export default Obstacle;

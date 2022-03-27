import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "styles/global.scss";
import Tire from "images/obstacles/tire.png";
import Water from "images/obstacles/water.png";
import Explosion from "images/effects/explosion.gif";
import Splash from "images/effects/splash.gif";
import { useRecoilValue, useRecoilState } from "recoil";
import { distanceState, enemyDistanceState } from "atoms";
import {
  getRandomDigit,
  getLane,
  getPosition,
  getSpeed,
  setSpeed,
  setPosition,
  carMove,
} from "helpers/utils";

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

// const ObstacleItem = ({ bg, position, lane, type, collide }) => {
//   let appearance = bg;

//   const appearances = {
//     tire: Explosion,
//     water: Splash,
//   };

//   if (collide) {
//     appearance = appearances[type];
//   }

//   const style_data = {
//     backgroundImage: `url(${appearance})`,
//     bottom: `${position}px`,
//     backgroundSize: "100%",
//   };

//   return (
//     <div
//       className={`obstacle-item ${lane ? "right" : ""}`}
//       style={style_data}
//     />
//   );
// };

const createObstacle = ({ src, position, lane, type, id }) => {
  const new_obstacle = document.createElement("div");
  new_obstacle.setAttribute("id", id);
  new_obstacle.setAttribute("class", `obstacle-item ${lane ? "right" : ""}`);
  new_obstacle.setAttribute("type", type);
  new_obstacle.style.backgroundImage = `url(${src})`;
  new_obstacle.style.bottom = `${position}px`;
  new_obstacle.style.backgroundSize = "100%";

  document.getElementById("obstacle-container").appendChild(new_obstacle);
};

const Obstacle = () => {
  const distance = useRecoilValue(distanceState);
  const [last_distance, setLastDistance] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [collision_state, setCollisionState] = useState(false);
  const [enemy_move, setEnemyMove] = useState(false);
  const getActualPosition = (pos) => {
    return pos - distance;
  };

  const [, setEnemyDistance] = useRecoilState(enemyDistanceState);

  const spawnObstacle = (dist) => {
    const lane = getRandomDigit(0, 1);
    const spawn_distance = getRandomDigit(1500, 1550);
    let obs_type = getRandomDigit(0, 10);

    obs_type = obs_type > 1 ? 1 : obs_type;

    const obs = [...obstacles];
    const id = `obstacle-${+new Date()}`;

    const obtacle_types = [
      {
        type: "water",
        src: Water,
      },
      {
        type: "tire",
        src: Tire,
      },
    ];

    const { src, type } = obtacle_types[obs_type];
    const position = dist + spawn_distance;

    obs.push({
      id,
      src,
      position,
      lane,
      type,
    });

    // Create obstacle
    createObstacle({ src, position, lane, type, id });
    setObstacles(obs);
  };

  const handleCollision = (obstacle, car, c) => {
    const collided = obstacle.getAttribute("collided");
    const type = obstacle.getAttribute("type");
    const car_speed = getSpeed(c);

    const appearances = {
      tire: Explosion,
      water: Splash,
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
        case "tire":
          new_speed = 1;
          car.setAttribute("state", "fade");

          setTimeout(() => {
            car.setAttribute("state", "");
          }, 1000);
          break;
      }

      if (new_speed != car_speed) {
        car.setAttribute("speed", new_speed);
      }

      // Auto fade obstacles

      obstacle.style.opacity = 0;

      setTimeout(() => {
        obstacle.remove();
      }, 3000);
    }
  };

  const handleOpponents = () => {
    const enemy = document.getElementById("car-enemy");
    const player = document.getElementById("car");

    const enemy_speed = parseFloat(enemy.getAttribute("speed"));
    const player_speed = parseFloat(player.getAttribute("speed"));

    let enemy_pos = enemy.getAttribute("position");

    enemy_pos = isNaN(enemy_pos) ? 0 : enemy_pos;

    const diff = player_speed - enemy_speed;

    const new_pos = enemy_pos - diff;

    enemy.setAttribute("position", new_pos);
    enemy.style.bottom = `${new_pos}px`;
  };

  const handleCarCollision = () => {
    const enemy = document.getElementById("car-enemy");
    const player = document.getElementById("car");

    const player_lane = getLane("car");
    const enemy_lane = getLane("car-enemy");

    const player_pos = 0;
    const enemy_pos = getPosition("car-enemy");

    const player_speed = getSpeed("car");
    const enemy_speed = getSpeed("car-enemy");

    const collision_buffer = 50;
    const collision_impact = 70;

    if (
      player_lane === enemy_lane &&
      enemy_pos <= collision_buffer &&
      // enemy_pos > 0 &&
      !collision_state
    ) {
      let player_new_speed = null;
      let enemy_new_speed = null;
      let enemy_new_bottom = null;

      const speed_effect = 0.1;

      if (player_pos > enemy_pos) {
        player_new_speed = player_speed + speed_effect;
        enemy_new_speed = enemy_speed - speed_effect;
        enemy_new_bottom = enemy_pos - collision_impact;
      } else {
        player_new_speed = player_speed - speed_effect;
        enemy_new_speed = enemy_speed + speed_effect;
        enemy_new_bottom = enemy_pos + collision_impact;
      }

      setSpeed("car", player_new_speed);
      setSpeed("car-enemy", enemy_new_speed);

      setPosition("car-enemy", enemy_new_bottom);
      setCollisionState(true);

      setTimeout(() => {
        setCollisionState(false);
      }, 1000);
    }
  };

  useEffect(() => {
    setInterval(() => {
      const player = document.getElementById("car");
      const opponent = document.getElementById("car-enemy");
      const player_current_speed = player.getAttribute("speed");
      const current_speed = opponent.getAttribute("speed");
      const enemy_speed = !current_speed ? 0 : parseFloat(current_speed);
      const player_speed = !player_current_speed
        ? 0
        : parseFloat(player_current_speed);
      const max_speed = 8;
      const speed_increment = 0.02;

      let new_speed = 0;

      if (enemy_speed < max_speed) {
        new_speed = enemy_speed + speed_increment;
        opponent.setAttribute("speed", new_speed);
      }
      if (player_speed < max_speed) {
        new_speed = player_speed + speed_increment;
        player.setAttribute("speed", new_speed);
      }
    }, 10);
  }, []);

  useEffect(() => {
    const spawn_range = 300;
    const enemy_advantage = getPosition("car-enemy");
    const diff_adjust = enemy_advantage > 0 ? enemy_advantage + spawn_range : 0;

    const final_distance = distance + diff_adjust;
    const difference = Math.abs(final_distance - last_distance);

    if (difference >= spawn_range) {
      spawnObstacle(final_distance);
      setLastDistance(final_distance);
    }

    const cars = ["car", "car-enemy"];

    cars.forEach((c) => {
      const is_player = c === "car";
      const car = document.getElementById(c);
      const car_lane = getLane(c);
      const car_position = getPosition(c);

      // Collision check
      obstacles.forEach(({ position, lane, id, type }) => {
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

            if (
              actual_position <= danger_range &&
              actual_position >= danger_range - range_offset &&
              lane === enemy_lane &&
              type === "tire"
            ) {
              const move_to = lane ? 0 : 1;

              if (!enemy_move) {
                setEnemyMove(true);
                carMove("car-enemy", move_to);

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
            obstacle.remove();
            setObstacles((obstacles) => obstacles.filter((o) => id !== o.id));
          }
        }
      });
    });

    // Handle Opponents
    handleOpponents();
    // Car Collisions
    handleCarCollision();

    // Distance Calculator
    const enemy_position = getPosition("car-enemy");
    const enemy_distance = Math.abs(0 - enemy_position);

    setEnemyDistance(enemy_distance);
  }, [distance]);

  return (
    <ObstacleContainer id="obstacle-container">
      {/* {obstacles.map(({ src, bottom, lane, type }, k) => {
        const actual_position = getActualPosition(bottom);

        const collide = k === collision_key;

        if (collide && !collided_obs.includes(k)) {
          let new_speed = car_speed;

          switch (type) {
            case "water":
              new_speed = car_speed - car_speed * 0.5;

              break;
            case "tire":
              new_speed = 1;

              break;
          }

          if (new_speed != car_speed) {
            document.getElementById("terrain").setAttribute("speed", new_speed);
          }

          collided_obs.push(k);

          setCollidedObs([...collided_obs]);
        }

        if (actual_position > 0) {
          return (
            <ObstacleItem
              position={actual_position}
              collide={collide}
              key={k}
              id={k}
              bg={src}
              lane={lane}
              type={type}
            />
          );
        }
      })} */}
    </ObstacleContainer>
  );
};

export default Obstacle;

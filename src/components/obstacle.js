import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import 'styles/global.scss'
import Tire from 'images/obstacles/tire-2.png'
import Barricade from 'images/obstacles/barricade.png'
import Water from 'images/obstacles/water.png'
import Explosion from 'images/effects/explosion.gif'
import Splash from 'images/effects/splash.gif'
import { useRecoilValue, useRecoilState } from 'recoil'
import { distanceState, enemyDistanceState } from 'atoms'
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
  getRanking
} from 'helpers/utils'
import {
  Cars,
  CAR_SIZE,
  CAR_STATUS,
  EnemyCars,
  PLAYER_DEFAULT_POS
} from 'components/car'

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
`

const createObstacle = ({ src, position, lane, type, id }) => {
  const new_obstacle = document.createElement('div')
  new_obstacle.setAttribute('id', id)
  new_obstacle.setAttribute('class', `obstacle-item ${lane ? 'right' : ''}`)
  new_obstacle.setAttribute('type', type)
  new_obstacle.setAttribute('position', position)
  new_obstacle.setAttribute('lane', lane)
  new_obstacle.style.backgroundImage = `url(${src})`
  new_obstacle.style.bottom = `${position}px`
  new_obstacle.style.backgroundSize = '100%'

  document.getElementById('obstacle-container').appendChild(new_obstacle)
}

const Obstacle = () => {
  const [enemy_move, setEnemyMove] = useState(false)
  const getActualPosition = pos => {
    const distance = getDistance('terrain')

    return pos - distance
  }

  const [, setEnemyDistance] = useRecoilState(enemyDistanceState)

  const spawnObstacle = spawn_distance => {
    const lane = getRandomDigit(0, 1)
    let obs_type = getRandomDigit(0, 10)

    obs_type = obs_type > 1 ? 1 : obs_type

    const id = `obstacle-${+new Date()}`

    const obtacle_types = [
      {
        type: 'water',
        src: Water
      },
      {
        type: 'barricade',
        src: Barricade
      }
    ]

    const { src, type } = obtacle_types[obs_type]
    const position = spawn_distance

    // Create obstacle
    const max_obstacles = 250
    const total_obstacles = document.querySelectorAll('.obstacle-item').length

    if (total_obstacles <= max_obstacles) {
      createObstacle({ src, position, lane, type, id })
    }
  }

  const handleCollision = (obstacle, car, c) => {
    const collided = obstacle.getAttribute('collided')
    const type = obstacle.getAttribute('type')
    const car_speed = getSpeed(c)

    const appearances = {
      barricade: Explosion,
      water: Splash
    }

    if (!collided) {
      const appearance = appearances[type]
      let new_speed = car_speed

      obstacle.setAttribute('collided', 1)
      obstacle.style.backgroundImage = `url(${appearance})`

      switch (type) {
        case 'water':
          new_speed = car_speed + car_speed * 0.5

          break
        case 'barricade':
          new_speed = 0
          car.setAttribute('state', CAR_STATUS.dead)

          setTimeout(() => {
            car.setAttribute('state', '')
          }, 2000)
          break
      }

      if (new_speed != car_speed) {
        car.setAttribute('speed', new_speed)
      }

      // Auto fade obstacles

      obstacle.style.opacity = 0

      setTimeout(() => {
        obstacle.remove()
      }, 3000)
    }
  }

  const handleOpponents = () => {
    const player_speed = getSpeed('car')

    EnemyCars.forEach(e => {
      const enemy_pos = getPosition(e)
      const enemy_speed = getSpeed(e)
      const diff = player_speed - enemy_speed
      const new_pos = enemy_pos - diff

      setPosition(e, new_pos)
      setBottom(e, new_pos)
    })
  }

  const handleCarCollision = () => {
    Cars.forEach(c => {
      const is_player = c === 'car'
      const lane = getLane(c)
      const position = is_player ? 0 : getPosition(c)
      const speed = getSpeed(c)
      const collision_buffer = is_player ? CAR_SIZE : position + CAR_SIZE
      const collision_impact = 60

      Cars.forEach(oc => {
        if (oc !== c) {
          const is_oplayer = oc === 'car'
          const olane = getLane(oc)
          const oposition = is_oplayer ? 0 : getPosition(oc)
          const ospeed = getSpeed(oc)
          const state = getState(oc)

          if (
            lane === olane &&
            oposition < collision_buffer &&
            oposition > collision_buffer - CAR_SIZE &&
            state !== CAR_STATUS.dead
          ) {
            let new_speed = null
            let o_new_speed = null
            let new_bottom = null
            let o_new_bottom = null

            const speed_increment = 0.04
            const speed_reduction = 0.02

            if (position > oposition) {
              new_speed = speed + speed * speed_increment
              o_new_speed = ospeed - ospeed * speed_reduction
              // new_bottom = is_player ? 0 : position - collision_impact
              new_bottom = is_player ? 0 : position
              o_new_bottom = is_oplayer ? 0 : oposition + collision_impact
            } else {
              new_speed = speed - speed * speed_reduction
              o_new_speed = ospeed + ospeed * speed_increment
              // new_bottom = is_player ? 0 : position - collision_impact
              new_bottom = is_player ? 0 : position
              o_new_bottom = is_oplayer ? 0 : oposition + collision_impact
            }
            setSpeed(c, new_speed)
            setSpeed(oc, o_new_speed)
            setPosition(c, new_bottom)
            setPosition(oc, o_new_bottom)
          }
        }
      })
    })
  }

  useEffect(() => {
    const carLoop = setInterval(() => {
      // Car Speed
      Cars.forEach(c => {
        const speed = getSpeed(c)
        const status = getState(c)
        const max_speed = 5
        const speed_increment = 0.02

        if (speed < max_speed && status !== CAR_STATUS.dead) {
          const new_speed = speed + speed_increment
          setSpeed(c, new_speed)
        }
      })

      // Car Life Cycle
      carLifeCycle()
    }, 10)

    // Spawn Obstacles
    setInterval(() => {
      const { positions } = getRanking()
      const first_car = Math.max(...positions)
      const spawn_distance = getRandomDigit(150, 350)
      const spawn_position = getPosition('terrain')

      const final_spawn_position =
        first_car > spawn_position ? first_car + 1000 : spawn_position

      const final_distance = final_spawn_position + spawn_distance

      spawnObstacle(final_distance)
      setPosition('terrain', final_distance)
    }, 500)

    return () => {
      clearInterval(carLoop)
    }
  }, [])

  const carLifeCycle = () => {
    Cars.forEach(c => {
      const is_player = c === 'car'
      const car = document.getElementById(c)
      const car_lane = getLane(c)
      const car_position = getPosition(c)

      // Collision check
      document.querySelectorAll.length &&
        document.querySelectorAll('.obstacle-item').forEach(o => {
          const id = o.getAttribute('id')

          const position = getPosition(id)
          const lane = getLane(id)
          const type = getType(id)

          const calculated_position = !is_player
            ? car_position + position
            : position

          const actual_position = getActualPosition(calculated_position)

          // Move obstacle
          const obstacle = document.getElementById(id)
          const range_offset = 80
          const position_reference = is_player
            ? range_offset
            : range_offset + car_position * 2

          if (obstacle) {
            if (is_player) {
              obstacle.style.bottom = `${actual_position}px`
            }

            // Enemy Evade Obstacles

            // if (!is_player) {
            const enemy_lane = getLane(c)
            const speed = getSpeed(c)
            const danger_range = position_reference + speed * 40

            if (
              actual_position <= danger_range &&
              actual_position >= danger_range - range_offset &&
              lane === enemy_lane &&
              type === 'barricade'
            ) {
              const move_to = lane ? 0 : 1

              if (!enemy_move) {
                setEnemyMove(true)
                carMove(c, move_to)

                setTimeout(() => {
                  setEnemyMove(false)
                }, 10)
              }
            }
            // }

            // Obstacle Collision

            if (
              actual_position <= position_reference &&
              actual_position >= position_reference - range_offset
            ) {
              if (lane === car_lane) {
                handleCollision(obstacle, car, c)
              }
            }

            // Recycle Obstacle
            if (is_player && actual_position < -50) {
              obstacle.remove()
            }
          }
        })
    })

    // Handle Opponents
    handleOpponents()
    // Car Collisions
    handleCarCollision()

    // Distance Calculator
    const enemy_position = getPosition('car-enemy')
    const enemy_distance = Math.abs(PLAYER_DEFAULT_POS - enemy_position)

    setEnemyDistance(enemy_distance)
  }

  return <ObstacleContainer id='obstacle-container' />
}

export default Obstacle

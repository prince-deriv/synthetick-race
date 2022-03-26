import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import 'styles/global.scss'
import Tire from 'images/obstacles/tire.png'
import { useRecoilValue } from 'recoil'
import { distanceState } from 'atoms'
import { getRandomDigit } from 'helpers/utils'

const ObstacleContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 115px;
  height: 100%;
  padding: 10px;
  z-index: 3;
}
`

const ObstacleItem = ({ bg, position, lane }) => (
  <div
    className={`obstacle-item ${lane ? 'right' : ''}`}
    style={{
      backgroundImage: `url(${bg})`,
      bottom: `${position}px`,
      backgroundSize: '100%'
    }}
  />
)

const Obstacle = () => {
  const distance = useRecoilValue(distanceState)
  const [last_distance, setLastDistance] = useState(0)
  const [obstacles, setObstacles] = useState([])

  const getActualPosition = bottom => {
    return bottom - distance
  }

  const spawnObstacle = () => {
    const lane = getRandomDigit(0, 1)
    const spawn_distance = getRandomDigit(900, 1000)
    const obs = [...obstacles]

    obs.push({
      src: Tire,
      bottom: distance + spawn_distance,
      lane
    })

    setObstacles(obs)
  }

  useEffect(() => {
    const difference = Math.abs(distance - last_distance)

    if (difference >= 300) {
      spawnObstacle()
      setLastDistance(distance)
    }
  }, [distance])

  return (
    <ObstacleContainer>
      {obstacles.map(({ src, bottom, lane }, k) => {
        const actual_position = getActualPosition(bottom)

        if (actual_position > 0) {
          return (
            <ObstacleItem
              position={actual_position}
              key={k}
              bg={src}
              lane={lane}
            />
          )
        }
      })}
    </ObstacleContainer>
  )
}

export default Obstacle

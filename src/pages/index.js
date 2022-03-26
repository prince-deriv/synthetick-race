import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import 'styles/global.scss'
import TerrainBg from 'images/terrain.jpg'
import { Car, Obstacle } from 'components'
import { useRecoilState } from 'recoil'
import { speedState, distanceState } from 'atoms'

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
`

// markup
const Game = () => {
  const terrain = useRef()
  const [, setCarSpeed] = useRecoilState(speedState)
  const [, setDistance] = useRecoilState(distanceState)
  const [data, setData] = useState({
    speed: 0
  })

  useEffect(() => {
    const current = terrain.current
    let terrain_move
    if (current) {
      terrain_move = setInterval(() => {
        move()
      }, 10)
    }

    setInterval(() => {
      const current_speed = current.getAttribute('speed')
      const speed = !current_speed ? 0.7 : parseFloat(current_speed)

      if (speed < 10) {
        speedUp()
      }
    }, 1000)

    return () => clearInterval(terrain_move)
  }, [])

  const move = () => {
    const current = terrain.current
    const current_speed = current.getAttribute('speed')
    const bpy = current.style.backgroundPositionY

    const speed = !current_speed ? 0 : parseFloat(current_speed)
    const posY = bpy === '' ? 0 : parseFloat(bpy)

    const new_bpy = posY + speed

    current.style.backgroundPositionY = `${new_bpy}px`
    current.setAttribute('speed', speed)

    const new_data = { ...data }
    new_data.speed = parseInt(speed * 20)

    setDistance(new_bpy)
    setCarSpeed(speed)
    setData(new_data)
  }

  const speedUp = () => {
    const speed_increment = 0.1
    const current = terrain.current
    const current_speed = parseFloat(current.getAttribute('speed'))
    const new_speed = current_speed + speed_increment

    current.setAttribute('speed', new_speed)
  }

  const speedDown = () => {
    const speed_increment = 1
    const current = terrain.current
    const current_speed = parseFloat(current.getAttribute('speed'))
    const new_speed = current_speed - speed_increment

    current.setAttribute('speed', new_speed)
  }

  return (
    <>
      <Terrain ref={terrain} />
      <Obstacle />
      <Car />
      <button onClick={speedUp}>+</button>
      <button onClick={speedDown}>-</button>
      <h1>Speed: {data.speed}km/h</h1>
    </>
  )
}

export default Game

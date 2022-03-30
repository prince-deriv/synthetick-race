import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import 'styles/global.scss'
import TerrainBg from 'images/terrain.jpg'
import { Car, Obstacle } from 'components'
import { useRecoilState, useRecoilValue } from 'recoil'
import { speedState, distanceState, enemyDistanceState } from 'atoms'
import { setDistance } from 'helpers/utils'

const Land = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
`

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
  const [speed, setCarSpeed] = useRecoilState(speedState)
  const [data, setData] = useState({
    speed: 0
  })

  const enemy_distance = useRecoilValue(enemyDistanceState)

  useEffect(() => {
    const current = terrain.current
    let terrain_move
    if (current) {
      terrain_move = setInterval(() => {
        move()
      }, 10)
    }

    return () => clearInterval(terrain_move)
  }, [])

  useEffect(() => {
    const current = terrain.current
    const final_speed = speed < 0 ? 1 : speed
    current.setAttribute('speed', final_speed)
  }, [speed])

  const move = () => {
    const player = document.getElementById('car')
    const current = terrain.current
    const current_speed = player.getAttribute('speed')
    const bpy = current.style.backgroundPositionY

    const speed = !current_speed ? 0 : parseFloat(current_speed)
    const posY = bpy === '' ? 0 : parseFloat(bpy)

    const new_bpy = posY + speed

    current.style.backgroundPositionY = `${new_bpy}px`
    player.setAttribute('speed', speed)

    const new_data = { ...data }
    new_data.speed = parseInt(speed * 30)

    setDistance('terrain', new_bpy)
    setCarSpeed(speed)
    setData(new_data)
  }

  return (
    <Land>
      <Terrain ref={terrain} id='terrain' />
      <Obstacle />
      <Car />
      <h1>Speed: {data.speed}km/h</h1>
      <h1>Enemy: {enemy_distance.toFixed(2)}M</h1>
    </Land>
  )
}

export default Game

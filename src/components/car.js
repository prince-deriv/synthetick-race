import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import 'styles/global.scss'
import CarImage from 'images/cars/car-red.png'
import { useKeyPress } from 'helpers/use-key-press'

const CarContainer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 115px;
  height: 100px;
  padding: 10px;
  z-index: 2;
}
`

const CarBox = styled.img`
  height: 80px;
  width: auto;
  position: relative;
  left: 0px;
  transition: left 0.3s ease-in, transform 0.1s ease-out; 

  &.right-turn {
    transform: rotate(12deg);
  }

  &.right-move {
    left: 70px;
  }

  &.left-turn {
    transform: rotate(-12deg);
  }

  &.left-move {
    left: 0px;
  }
}
`

const Car = () => {
  const arrow_left = useKeyPress('ArrowLeft')
  const arrow_right = useKeyPress('ArrowRight')

  const [class_name, setClassName] = useState('')
  const [debounce, setDebounce] = useState(false)
  const turn_reset = 300

  useEffect(() => {
    if (arrow_right && !debounce) {
      setDebounce(true)
      setClassName('right-move right-turn')

      setTimeout(() => {
        setClassName('right-move')
        setDebounce(false)
      }, turn_reset)
    }
  }, [arrow_right, debounce])

  useEffect(() => {
    if (arrow_left && !debounce) {
      setDebounce(true)
      setClassName('left-move left-turn')

      setTimeout(() => {
        setClassName('left-move')
        setDebounce(false)
      }, turn_reset)
    }
  }, [arrow_left, debounce])

  return (
    <CarContainer>
      <CarBox src={CarImage} className={class_name} />
    </CarContainer>
  )
}

export default Car

import { Cars } from 'components/car'

export const getRandomDigit = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getSpeed = id => {
  const car = document.getElementById(id)
  return parseFloat(car.getAttribute('speed'))
}

export const getPosition = id => {
  const car = document.getElementById(id)
  const pos = parseFloat(car.getAttribute('position'))
  return isNaN(pos) ? 0 : pos
}

export const getLane = id => {
  const car = document.getElementById(id)
  const lane = parseInt(car.getAttribute('lane'))

  return isNaN(lane) ? (id === 'car' ? 0 : 1) : lane
}

export const getState = id => {
  const car = document.getElementById(id)
  return car.getAttribute('state')
}

export const getType = id => {
  const car = document.getElementById(id)
  return car.getAttribute('type')
}

export const getDistance = id => {
  const element = document.getElementById(id)
  const distance = parseInt(element.getAttribute('distance'))

  return isNaN(distance) ? 0 : distance
}

export const setSpeed = (id, speed) => {
  const final_speed = speed < 0 ? 0 : speed

  document.getElementById(id).setAttribute('speed', final_speed)
}

export const setPosition = (id, pos) => {
  document.getElementById(id).setAttribute('position', pos)
}

export const setClass = (id, class_name) => {
  document.getElementById(id).setAttribute('class', class_name)
}

export const setLane = (id, lane) => {
  document.getElementById(id).setAttribute('lane', lane)
}

export const setBottom = (id, bottom) => {
  document.getElementById(id).style.bottom = `${bottom}px`
}

export const setDistance = (id, distance) => {
  document.getElementById(id).setAttribute('distance', distance)
}

export const carMove = (id, lane) => {
  let new_speed = null
  let final_class = null

  const speed = getSpeed(id)
  const speed_deduction = speed * 0.01

  const turn_reset = 300

  if (lane) {
    setClass(id, 'car right-move right-turn')
    final_class = 'car right-move'
  } else {
    setClass(id, 'car left-move left-turn')
    final_class = 'car left-move'
  }

  new_speed = speed - speed_deduction
  setSpeed(id, new_speed)

  setTimeout(() => {
    setClass(id, final_class)
    setLane(id, lane)
  }, turn_reset)
}

export const getRanking = () => {
  const ranking = {}
  const positions = []
  Cars.forEach(c => {
    const position = getPosition(c)

    ranking[c] = position
    positions.push(position)
  })

  return { ranking, positions }
}

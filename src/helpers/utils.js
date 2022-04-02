import { Cars, CAR_SIZE } from 'components/car'

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

export const getLeft = id => {
  const car = document.getElementById(id)
  return car.offsetLeft
}

export const getDistance = id => {
  const element = document.getElementById(id)
  const distance = parseInt(element.getAttribute('distance'))

  return isNaN(distance) ? 0 : distance
}

export const getCollision = id => {
  const element = document.getElementById(id)
  const collision = parseInt(element.getAttribute('collision'))

  return isNaN(collision) ? 0 : collision
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

export const setCollision = (id, collision) => {
  document.getElementById(id).setAttribute('collision', collision)
}

export const setCoordinates = (id, coordinates) => {
  document.getElementById(id).setAttribute('coordinates', coordinates)
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

export const getCarCoordinates = () => {
  const coordinates = {}

  Cars.forEach(c => {
    const position = parseInt(getPosition(c))
    const range = position - CAR_SIZE

    coordinates[c] = []

    for (let x = position; x >= range; x--) {
      coordinates[c].push(x)
    }

    // setCoordinates(c, coordinates[c].join(','))
  })

  return coordinates
}

const getArraysIntersection = (a1, a2) => {
  return a1.filter(function (n) {
    return a2.indexOf(n) !== -1
  })
}

export const checkCollision = () => {
  Cars.forEach(c => {
    let coordinates = getCarCoordinates()
    const car_coordinates = coordinates[c]
    const lane = getLane(c)
    const speed = getSpeed(c)

    Cars.forEach(oc => {
      if (oc !== c) {
        coordinates = getCarCoordinates()
        const ocar_coordinates = coordinates[oc]
        const olane = getLane(oc)
        const ospeed = getSpeed(oc)

        const collision = car_coordinates.some(e => {
          return ocar_coordinates.includes(e)
        })

        const c_max = Math.max(...car_coordinates)
        const oc_max = Math.max(...ocar_coordinates)

        let c_new_speed = speed
        let o_new_speed = ospeed

        const intersection = getArraysIntersection(
          car_coordinates,
          ocar_coordinates
        )

        const extra_speed = intersection.length * 0.001

        if (collision && olane === lane) {
          if (c_max > oc_max) {
            c_new_speed = speed + extra_speed
          } else {
            o_new_speed = ospeed + extra_speed
          }

          // console.log({
          //   c,
          //   oc,
          //   c_max,
          //   oc_max,
          //   intersection: getArraysIntersection(
          //     car_coordinates,
          //     ocar_coordinates
          //   )
          // })
        }
      }
    })
  })
}

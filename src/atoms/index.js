import { atom } from 'recoil'

const speedState = atom({
  key: 'speed',
  default: 0
})

const distanceState = atom({
  key: 'distance',
  default: 0
})

export { speedState, distanceState }

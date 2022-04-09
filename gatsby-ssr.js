import React from 'react'
import { RecoilRoot } from 'recoil'

const wrapRootElement = ({ element }) => {
  return <RecoilRoot>{element}</RecoilRoot>
}

export default wrapRootElement

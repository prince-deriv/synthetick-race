import React from "react";
import { RecoilRoot } from "recoil";

exports.wrapRootElement = ({ element }) => {
  return <RecoilRoot>{element}</RecoilRoot>;
};

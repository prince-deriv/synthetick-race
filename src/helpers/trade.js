import { Cars } from "components/car";
import { symbols } from "components/menu";
import {
  getAcceleration,
  getCarRank,
  getLuckyNumber,
  getSpeed,
  getState,
  getTopSpeed,
  setAcceleration,
  setSpeed,
  setState,
  setTopSpeed,
} from "./utils";

const socket_url =
  "wss://green.binaryws.com/websockets/v3?app_id=16929&l=EN&brand=deriv";

export const triggerWS = (s) => {
  const { symbol } = symbols[s];
  let ws = new WebSocket(socket_url);

  ws.onopen = () => {
    ws.send(
      JSON.stringify({
        ticks: symbol,
      })
    );
  };

  ws.onclose = () => console.log("ws closed");

  ws.onmessage = (e) => {
    const message = JSON.parse(e.data);

    const { msg_type, tick } = message;

    if (msg_type === "tick") {
      const { quote } = tick;

      if (quote) {
        const digit = quote + "";
        const last_digit = parseInt(digit[digit.length - 1]);
        console.log(last_digit);
        updateNumberBox(last_digit);
      }
    }
  };

  return () => {
    ws.close();
  };
};

const updateNumberBox = (last_digit) => {
  const number_items = document.querySelectorAll(".number-item");

  number_items.forEach((n, k) => {
    const new_class_name = `number-item ${k === last_digit ? "active" : ""}`;
    n.setAttribute("class", new_class_name);

    Cars.forEach((c) => {
      const lucky_number = getLuckyNumber(c);

      if (lucky_number === last_digit) {
        const acc = getAcceleration(c);
        const top_speed = getTopSpeed(c);
        const speed = getSpeed(c);

        const { key } = getCarRank(c);

        const speed_bonus = 0.005 * key; // The lower the place the higher the buff

        const new_acc = acc + 0.005;
        const new_top_speed = top_speed + 0.04;
        const new_speed = speed + speed * speed_bonus;
        const state = getState(c);

        if (state !== "finished") {
          setAcceleration(c, new_acc);
          setTopSpeed(c, new_top_speed);

          if (state !== "dead") {
            setSpeed(c, new_speed);
            setState(c, "bonus");
          }

          setTimeout(() => {
            setState(c, "");
          }, 3000);
        }
      }
    });
  });
};

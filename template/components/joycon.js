const buttonMap = {
  LR: {
    0: "B",
    1: "A",
    2: "Y",
    3: "X",
    4: "L",
    5: "R",
    6: "ZL",
    7: "ZR",
    8: "minus",
    9: "plus",
    10: "axes-L",
    11: "axes-R",
    12: "up",
    13: "down",
    14: "left",
    15: "right",
    16: "home",
    17: "screenshot",
    18: "SL-L",
    19: "SR-L",
    20: "SL-R",
    21: "SR-R"
  },
  L: {
    0: "left",
    1: "down",
    2: "up",
    3: "right",
    4: "SL-L",
    5: "SR-L",
    6: "ZL",
    8: "L",
    9: "minus",
    10: "axes-L",
    16: "screenshot"
  },
  R: {
    0: "A",
    1: "X",
    2: "B",
    3: "Y",
    4: "SL-R",
    5: "SR-R",
    7: "ZR",
    8: "R",
    9: "plus",
    10: "axes-R",
    16: "home"
  }
};

export default class JoyCon {
  constructor(debug) {
    this.debug = !!debug;
    this.active = false;
    this.controllers = {};
    this.currentState = {};
    this.handlers = {
      keydown: [],
      keyup: []
    };
    this.connect();
  }

  start() {
    this.active = true;
    requestAnimationFrame(this.updateState.bind(this));
  }
  end() {
    this.active = false;
  }

  on(type, handler) {
    if (!this.handlers[type]) {
      return;
    }
    if (this.handlers[type].indexOf(handler) === -1) {
      this.handlers[type].push(handler);
    }
  }

  off(type, handler) {
    if (!this.handlers[type]) {
      return;
    }
    const index = this.handlers[type].indexOf(handler);
    if (index >= 0) {
      this.handlers[type].splice(index, 1);
    }
  }

  fire(type, event) {
    if (this.handlers[type]) {
      this.handlers[type].forEach(handler => handler.call(this, event));
    }
  }

  connect() {
    const { controllers, debug } = this;

    function onConnect(event) {
      const { gamepad } = event;
      const side = getJoyConSide(gamepad.id);
      if (side) {
        const index = gamepad.index;
        Object.defineProperty(controllers, side, {
          get() {
            return navigator.getGamepads()[index];
          },
          enumerable: true,
          configurable: true
        });
      }
      if (debug) {
        console.log("connected", side, gamepad);
      }
    }

    function onDisconnect() {
      const { gamepad } = event;
      const side = getJoyConSide(gamepad.id);
      if (side) {
        delete controllers[side];
      }
      if (debug) {
        console.log("disconnected", side, gamepad);
      }
    }

    function getJoyConSide(id) {
      if (id.match(/^Joy-Con L\+R /)) {
        return "LR";
      }
      if (id.match(/^Joy-Con \(L\) /)) {
        return "L";
      }
      if (id.match(/^Joy-Con \(R\) /)) {
        return "R";
      }
    }

    window.addEventListener("gamepadconnected", onConnect);
    window.addEventListener("gamepaddisconnected", onDisconnect);
  }

  getNewState() {
    const { controllers } = this;
    const LR = getSideState("LR");
    const L = getSideState("L");
    const R = getSideState("R");

    if (!LR && !L && !R) {
      return;
    }

    const result = {};

    if (LR) {
      result.LR = LR;
    }
    if (L) {
      result.L = L;
    }
    if (R) {
      result.R = R;
    }

    return result;

    function getAxesResult(x, y) {
      const atan = (Math.atan(x / y) / Math.PI) * 180;
      if (y < 0) {
        return atan + 180;
      }
      if (x < 0) {
        return atan + 360;
      }
      return atan;
    }

    function getSideState(side) {
      const gamepad = controllers[side];
      if (gamepad) {
        const result = {};
        const { axes, buttons } = gamepad;
        const [x, y] = axes;
        const axesForce = Math.sqrt(x * x + y * y);
        const axesAngle = axesForce ? getAxesResult(x, y) : undefined;
        const axesResult = { angle: axesAngle, force: axesForce };
        const buttonsResult = buttons
          .map((btn, index) => ({
            key: buttonMap[side][index],
            pressed: btn.pressed
          }))
          .filter(({ pressed }) => pressed)
          .map(info => info.key);
        if (!axesForce && buttonsResult.length === 0) {
          return;
        }
        if (axesForce) {
          result.axes = axesResult;
        }
        if (buttonsResult.length > 0) {
          result.buttons = buttonsResult;
        }
        return result;
      }
    }
  }

  updateState() {
    const { currentState, active, debug } = this;
    const newState = this.getNewState();

    const newButtonState = [];
    if (newState && newState.LR && newState.LR.buttons) {
      newButtonState.push(...newState.LR.buttons);
    }
    if (newState && newState.L && newState.L.buttons) {
      newButtonState.push(...newState.L.buttons);
    }
    if (newState && newState.R && newState.R.buttons) {
      newButtonState.push(...newState.R.buttons);
    }

    if (debug) {
      if (newState) {
        console.log(4, newButtonState, newState);
      }
    }

    newButtonState.forEach(key => {
      if (!currentState[key]) {
        currentState[key] = true;
        if (debug) {
          console.log(`${key} pressed down`);
        }
        const event = new CustomEvent("keydown");
        event.code = key;
        this.fire("keydown", event);
      }
    });
    Object.keys(currentState).forEach(key => {
      if (newButtonState.indexOf(key) === -1) {
        delete currentState[key];
        if (debug) {
          console.log(`${key} dropped up`);
        }
        const event = new CustomEvent("keyup");
        event.code = key;
        this.fire("keyup", event);
      }
    });

    if (active) {
      requestAnimationFrame(this.updateState.bind(this));
    }
  }
}

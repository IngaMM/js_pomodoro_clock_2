var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PomodoroClock = function (_React$Component) {
  _inherits(PomodoroClock, _React$Component);

  function PomodoroClock(props) {
    _classCallCheck(this, PomodoroClock);

    var _this = _possibleConstructorReturn(this, (PomodoroClock.__proto__ || Object.getPrototypeOf(PomodoroClock)).call(this, props));

    _this.state = {
      breakLength: 5,
      sessionLength: 25,
      currentPhase: "Session",
      timeLeftString: "25:00",
      clockRunning: false,
      timerId: ""
    };
    _this.decreaseTimeSession = _this.decreaseTimeSession.bind(_this);
    _this.increaseTimeSession = _this.increaseTimeSession.bind(_this);
    _this.decreaseTimeBreak = _this.decreaseTimeBreak.bind(_this);
    _this.increaseTimeBreak = _this.increaseTimeBreak.bind(_this);
    _this.startStop = _this.startStop.bind(_this);
    _this.reset = _this.reset.bind(_this);
    _this.startClock = _this.startClock.bind(_this);
    _this.stopClock = _this.stopClock.bind(_this);
    _this.clock = _this.clock.bind(_this);
    _this.switchPhase = _this.switchPhase.bind(_this);
    _this.updateTimeLeftString = _this.updateTimeLeftString.bind(_this);
    return _this;
  }

  _createClass(PomodoroClock, [{
    key: "decreaseTimeSession",
    value: function decreaseTimeSession() {
      var _this2 = this;

      this.setState({
        sessionLength: Math.max(this.state.sessionLength - 1, 1)
      }, function () {
        if (_this2.state.clockRunning === false && _this2.state.currentPhase === "Session") {
          _this2.updateTimeLeftString(_this2.state.sessionLength * 60);
        }
      });
    }
  }, {
    key: "increaseTimeSession",
    value: function increaseTimeSession() {
      var _this3 = this;

      this.setState({
        sessionLength: Math.min(this.state.sessionLength + 1, 60)
      }, function () {
        if (_this3.state.clockRunning === false && _this3.state.currentPhase === "Session") {
          _this3.updateTimeLeftString(_this3.state.sessionLength * 60);
        }
      });
    }
  }, {
    key: "decreaseTimeBreak",
    value: function decreaseTimeBreak() {
      var _this4 = this;

      this.setState({
        breakLength: Math.max(this.state.breakLength - 1, 1)
      }, function () {
        if (_this4.state.clockRunning === false && _this4.state.currentPhase === "Break") {
          _this4.updateTimeLeftString(_this4.state.breakLength * 60);
        }
      });
    }
  }, {
    key: "increaseTimeBreak",
    value: function increaseTimeBreak() {
      var _this5 = this;

      this.setState({
        breakLength: Math.min(this.state.breakLength + 1, 60)
      }, function () {
        if (_this5.state.clockRunning === false && _this5.state.currentPhase === "Break") {
          _this5.updateTimeLeftString(_this5.state.breakLength * 60);
        }
      });
    }
  }, {
    key: "startStop",
    value: function startStop() {
      if (this.state.clockRunning === false) {
        this.startClock();
        this.setState({
          clockRunning: true
        });
      } else {
        this.stopClock();
        this.setState({
          clockRunning: false
        });
      }
    }
  }, {
    key: "startClock",
    value: function startClock() {
      var _this6 = this;

      this.setState({
        timerId: setInterval(function () {
          _this6.clock();
        }, 1000)
      });
    }
  }, {
    key: "stopClock",
    value: function stopClock() {
      clearInterval(this.state.timerId);
      this.setState({
        timerId: ""
      });
    }
  }, {
    key: "clock",
    value: function clock() {
      if (this.state.timeLeftString === "00:00") {
        this.switchPhase();
      }
      var currentTime = parseInt(this.state.timeLeftString.split(":")[0]) * 60 + parseInt(this.state.timeLeftString.split(":")[1]);
      currentTime -= 1;
      this.updateTimeLeftString(currentTime);
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.state.clockRunning === true) {
        this.stopClock();
      }
      this.audioBeep.pause();
      this.audioBeep.currentTime = 0;
      this.setState({
        breakLength: 5,
        sessionLength: 25,
        currentPhase: "Session",
        timeLeftString: "25:00",
        clockRunning: false
      });
    }
  }, {
    key: "switchPhase",
    value: function switchPhase() {
      var _this7 = this;

      this.stopClock();
      this.audioBeep.play();
      if (this.state.currentPhase === "Session") {
        this.setState({
          currentPhase: "Break"
        }, function () {
          _this7.updateTimeLeftString(_this7.state.breakLength * 60 + 1);
          _this7.startClock();
        });
      } else {
        this.setState({
          currentPhase: "Session"
        }, function () {
          _this7.updateTimeLeftString(_this7.state.sessionLength * 60 + 1);
          _this7.startClock();
        });
      }
    }
  }, {
    key: "updateTimeLeftString",
    value: function updateTimeLeftString(timeLength) {
      var minutesLeft = Math.floor(timeLength % (60 * 60) / 60);
      var secondsLeft = Math.floor(timeLength % 60);
      var minutesLeftString = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft;
      var secondsLeftString = secondsLeft < 10 ? "0" + secondsLeft : secondsLeft;
      this.setState({
        timeLeftString: minutesLeftString + ":" + secondsLeftString
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      return React.createElement(
        "div",
        { id: "clock" },
        React.createElement(SessionSection, {
          onClickD: this.decreaseTimeSession,
          onClickI: this.increaseTimeSession,
          length: this.state.sessionLength
        }),
        React.createElement(BreakSection, {
          onClickD: this.decreaseTimeBreak,
          onClickI: this.increaseTimeBreak,
          length: this.state.breakLength
        }),
        React.createElement(TimerSection, {
          currentPhase: this.state.currentPhase,
          timeLeftString: this.state.timeLeftString
        }),
        React.createElement(ButtonSection, {
          onClickStartStop: this.startStop,
          onClickReset: this.reset
        }),
        React.createElement("audio", {
          id: "beep",
          src: "https://goo.gl/65cBl1",
          ref: function ref(audio) {
            _this8.audioBeep = audio;
          }
        })
      );
    }
  }]);

  return PomodoroClock;
}(React.Component);

var SessionSection = function SessionSection(props) {
  return React.createElement(
    "div",
    { id: "session-section" },
    React.createElement(
      "div",
      { id: "session-label" },
      "Session Length"
    ),
    React.createElement(
      "div",
      { id: "session-length" },
      props.length
    ),
    React.createElement(
      "div",
      { id: "session-decrement", "class": "buttons", onClick: props.onClickD },
      "\u2193"
    ),
    React.createElement(
      "div",
      { id: "session-increment", "class": "buttons", onClick: props.onClickI },
      "\u2191"
    )
  );
};

var BreakSection = function BreakSection(props) {
  return React.createElement(
    "div",
    { id: "break-section" },
    React.createElement(
      "div",
      { id: "break-label" },
      "Break Length"
    ),
    React.createElement(
      "div",
      { id: "break-length" },
      props.length
    ),
    React.createElement(
      "div",
      { id: "break-decrement", "class": "buttons", onClick: props.onClickD },
      "\u2193"
    ),
    React.createElement(
      "div",
      { id: "break-increment", "class": "buttons", onClick: props.onClickI },
      "\u2191"
    )
  );
};

var TimerSection = function TimerSection(props) {
  return React.createElement(
    "div",
    { id: "timer-section" },
    React.createElement(
      "div",
      { id: "timer-label" },
      props.currentPhase
    ),
    React.createElement(
      "div",
      { id: "time-left" },
      props.timeLeftString
    )
  );
};

var ButtonSection = function ButtonSection(props) {
  return React.createElement(
    "div",
    { id: "button-section" },
    React.createElement(
      "div",
      { id: "start_stop", "class": "buttons", onClick: props.onClickStartStop },
      "Start/Stop"
    ),
    React.createElement(
      "div",
      { id: "reset", "class": "buttons", onClick: props.onClickReset },
      "Reset"
    )
  );
};

ReactDOM.render(React.createElement(PomodoroClock, null), document.getElementById("pomodoroClock"));
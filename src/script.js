class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      currentPhase: "Session",
      timeLeftString: "25:00",
      clockRunning: false,
      timerId: ""
    };
    this.decreaseTimeSession = this.decreaseTimeSession.bind(this);
    this.increaseTimeSession = this.increaseTimeSession.bind(this);
    this.decreaseTimeBreak = this.decreaseTimeBreak.bind(this);
    this.increaseTimeBreak = this.increaseTimeBreak.bind(this);
    this.startStop = this.startStop.bind(this);
    this.reset = this.reset.bind(this);
    this.startClock = this.startClock.bind(this);
    this.stopClock = this.stopClock.bind(this);
    this.clock = this.clock.bind(this);
    this.switchPhase = this.switchPhase.bind(this);
    this.updateTimeLeftString = this.updateTimeLeftString.bind(this);
  }

  decreaseTimeSession() {
    this.setState(
      {
        sessionLength: Math.max(this.state.sessionLength - 1, 1)
      },
      () => {
        if (
          this.state.clockRunning === false &&
          this.state.currentPhase === "Session"
        ) {
          this.updateTimeLeftString(this.state.sessionLength * 60);
        }
      }
    );
  }

  increaseTimeSession() {
    this.setState(
      {
        sessionLength: Math.min(this.state.sessionLength + 1, 60)
      },
      () => {
        if (
          this.state.clockRunning === false &&
          this.state.currentPhase === "Session"
        ) {
          this.updateTimeLeftString(this.state.sessionLength * 60);
        }
      }
    );
  }

  decreaseTimeBreak() {
    this.setState(
      {
        breakLength: Math.max(this.state.breakLength - 1, 1)
      },
      () => {
        if (
          this.state.clockRunning === false &&
          this.state.currentPhase === "Break"
        ) {
          this.updateTimeLeftString(this.state.breakLength * 60);
        }
      }
    );
  }

  increaseTimeBreak() {
    this.setState(
      {
        breakLength: Math.min(this.state.breakLength + 1, 60)
      },
      () => {
        if (
          this.state.clockRunning === false &&
          this.state.currentPhase === "Break"
        ) {
          this.updateTimeLeftString(this.state.breakLength * 60);
        }
      }
    );
  }

  startStop() {
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

  startClock() {
    this.setState({
      timerId: setInterval(() => {
        this.clock();
      }, 1000)
    });
  }

  stopClock() {
    clearInterval(this.state.timerId);
    this.setState({
      timerId: ""
    });
  }

  clock() {
    if (this.state.timeLeftString === "00:00") {
      this.switchPhase();
    }
    let currentTime =
      parseInt(this.state.timeLeftString.split(":")[0]) * 60 +
      parseInt(this.state.timeLeftString.split(":")[1]);
    currentTime -= 1;
    this.updateTimeLeftString(currentTime);
  }

  reset() {
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

  switchPhase() {
    this.stopClock();
    this.audioBeep.play();
    if (this.state.currentPhase === "Session") {
      this.setState(
        {
          currentPhase: "Break"
        },
        () => {
          this.updateTimeLeftString(this.state.breakLength * 60 + 1);
          this.startClock();
        }
      );
    } else {
      this.setState(
        {
          currentPhase: "Session"
        },
        () => {
          this.updateTimeLeftString(this.state.sessionLength * 60 + 1);
          this.startClock();
        }
      );
    }
  }

  updateTimeLeftString(timeLength) {
    let minutesLeft = Math.floor((timeLength % (60 * 60)) / 60);
    let secondsLeft = Math.floor(timeLength % 60);
    let minutesLeftString = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft;
    let secondsLeftString = secondsLeft < 10 ? "0" + secondsLeft : secondsLeft;
    this.setState({
      timeLeftString: minutesLeftString + ":" + secondsLeftString
    });
  }

  render() {
    return (
      <div id="clock">
        <SessionSection
          onClickD={this.decreaseTimeSession}
          onClickI={this.increaseTimeSession}
          length={this.state.sessionLength}
        />
        <BreakSection
          onClickD={this.decreaseTimeBreak}
          onClickI={this.increaseTimeBreak}
          length={this.state.breakLength}
        />
        <TimerSection
          currentPhase={this.state.currentPhase}
          timeLeftString={this.state.timeLeftString}
        />
        <ButtonSection
          onClickStartStop={this.startStop}
          onClickReset={this.reset}
        />
        <audio
          id="beep"
          src={"https://goo.gl/65cBl1"}
          ref={audio => {
            this.audioBeep = audio;
          }}
        ></audio>
      </div>
    );
  }
}

const SessionSection = props => {
  return (
    <div id="session-section">
      <div id="session-label">Session Length</div>
      <div id="session-length">{props.length}</div>
      <div id="session-decrement" class="buttons" onClick={props.onClickD}>
        &#8595;
      </div>
      <div id="session-increment" class="buttons" onClick={props.onClickI}>
        &#8593;
      </div>
    </div>
  );
};

const BreakSection = props => {
  return (
    <div id="break-section">
      <div id="break-label">Break Length</div>
      <div id="break-length">{props.length}</div>
      <div id="break-decrement" class="buttons" onClick={props.onClickD}>
        &#8595;
      </div>
      <div id="break-increment" class="buttons" onClick={props.onClickI}>
        &#8593;
      </div>
    </div>
  );
};

const TimerSection = props => {
  return (
    <div id="timer-section">
      <div id="timer-label">{props.currentPhase}</div>
      <div id="time-left">{props.timeLeftString}</div>
    </div>
  );
};

const ButtonSection = props => {
  return (
    <div id="button-section">
      <div id="start_stop" class="buttons" onClick={props.onClickStartStop}>
        Start/Stop
      </div>
      <div id="reset" class="buttons" onClick={props.onClickReset}>
        Reset
      </div>
    </div>
  );
};

ReactDOM.render(<PomodoroClock />, document.getElementById("pomodoroClock"));

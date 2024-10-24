import { useEffect, useState } from "react";
import "./App.css";
import click from "./assets/click.mp3";
import clockRinging from "./assets/ringing.mp3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [timer, setTimer] = useState(0);
  const [active, setActive] = useState(false);
  const [inputValue, setinputValue] = useState("");
  const [pause, setPause] = useState(false);

  useEffect(() => {
    let interval;

    if ((active || pause) && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0 && active) {
      setActive(false);
      setTimer(300);
      setPause(true);
    }

    if (timer === 5) {
      playSound(clockRinging);
    }

    return () => clearInterval(interval);
  }, [active, timer, pause]);

  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`;
    }

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleInput = (e) => {
    setinputValue(e.target.value);
  };

  const handlePause = () => {
    if (timer > 0) {
      setActive(!active);
      playSound(click);
      setPause(false);
    }
  };

  const startTimer = () => {
    if (inputValue.trim() !== "" && !isNaN(inputValue)) {
      setActive(true);
      setinputValue("");
      setTimer(parseInt(inputValue) * 60);
      playSound(click);
      setPause(false);
    } else {
      toast.error("Postoji greska prilikom inputa, pokusajte brojevima...");
    }
  };

  const resetTimer = () => {
    setActive(false);
    setinputValue("");
    setTimer(0);
    setPause(true);
    playSound(click);
  };

  const playSound = (sound) => {
    new Audio(sound).play();
  };

  return (
    <>
      <h1>Pomodoro APP powered by Filip Orcic</h1>
      <div className="container-timer">
        <input
          id="input"
          type="text"
          value={inputValue}
          onChange={handleInput}
          placeholder="unesite vreme u minutama"
        />

        <div className="naslov">
          {active ? "Ucenje" : timer === 0 ? "" : "Pauza"}
        </div>

        <div className={`timer ${active ? "pastelBlue" : "pastelRed"}`}>
          <p>{formatTime(timer)}</p>
        </div>

        <div className="container-buttons">
          <button onClick={() => (timer <= 0 ? startTimer() : resetTimer())}>
            {active ? "Reset" : timer === 0 ? "Start" : "Reset"}
          </button>

          <button
            className={active ? "pastelGreen" : "pastelRed"}
            onClick={handlePause}
          >
            {active ? "Pause" : "Pause"}
          </button>
        </div>
      </div>
      <ToastContainer theme="dark" position="top-center" />
    </>
  );
}

export default App;

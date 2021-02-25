import React, { useState, useEffect } from 'react';
import s from './Timer.scss';
import AntTreeSelect from "../../components/TreeSelect/AntTreeSelect";
import {Icon} from "antd";
const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className="app">
      <div style={{margin:"10px"}}>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-evenly"}}>
          <Icon style={{fontSize:"25px"}} type="message" />
          <Icon style={{fontSize:"25px"}} type="video-camera" />
          <Icon style={{fontSize:"25px"}} type="camera" />
          <Icon style={{fontSize:"25px"}}type="twitter" />
        </div>
      </div>
      <div>
        <AntTreeSelect/>
      </div>
      <div className="time">
        {new Date(seconds * 1000).toISOString().substr(11, 8)}
      </div>
      <div className="row">

        <button className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
          {isActive ? <Icon type="pause" /> : <Icon type="caret-right" />}

        </button>
        <button className="button" onClick={reset}>
          <Icon type="undo" />
        </button>
      </div>
    </div>
  );
};

export default Timer;

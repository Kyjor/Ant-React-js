// Libs
import React, { Component } from "react";
// Styles
import styles from "./Timer.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
//import Path from "@/components/Timer/Path";

/**
 * Home
 *
 * @class Timer
 * @extends {Component}
 */
class Timer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className={styles.timer}>
        Hello
        </div>
    );
  }
}

export default Timer;

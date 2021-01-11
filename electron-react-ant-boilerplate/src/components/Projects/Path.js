// Libs
import React, { Component } from "react";
import { Breadcrumb } from "antd";
// Styles
import styles from "./Path.scss";

/**
 * Path
 *
 * @class Path
 * @extends {Component}
 */
class Path extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Breadcrumb className={styles.path}>
        <Breadcrumb.Item>Projects</Breadcrumb.Item>
      </Breadcrumb>
    );
  }
}

export default Path;

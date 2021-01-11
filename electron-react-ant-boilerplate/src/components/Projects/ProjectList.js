// Libs
import React, { Component } from "react";
// Styles
import styles from "./ProjectList.scss";

/**
 * ProjectList
 *
 * @class ProjectList
 * @extends {Component}
 */
class ProjectList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={styles.helloWorld}>Project</div>;
  }
}

export default ProjectList;

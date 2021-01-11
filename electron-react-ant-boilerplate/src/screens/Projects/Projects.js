// Libs
import React, { Component } from "react";
// Styles
import styles from "./Projects.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import Path from "@/components/Projects/Path";
import ProjectList from "@/components/Projects/ProjectList";

/**
 * Home
 *
 * @class Home
 * @extends {Component}
 */
class Projects extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.home}>
          <Path />
          <ProjectList />
        </div>
      </Layout>
    );
  }
}

export default Projects;
